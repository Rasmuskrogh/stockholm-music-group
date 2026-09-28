/**
 * Postgres/Cloudinary snapshot (migration/extracted/) → Sanity.
 * Run: set -a; source .env.local; set +a; npx sanity exec migration/import.mjs --with-user-token
 *
 * Idempotent: fixed document IDs + createOrReplace, _keys derived from
 * source IDs, and Sanity dedupes uploaded assets by content hash.
 */
import fs from "node:fs";
import crypto from "node:crypto";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-09-28" });
const dir = new URL("./extracted/", import.meta.url);
const read = (f) => JSON.parse(fs.readFileSync(new URL(f, dir), "utf8"));
const key = (s) => crypto.createHash("sha1").update(String(s)).digest("hex").slice(0, 12);
const clean = (s) => (typeof s === "string" && s.trim() !== "" ? s.trim() : undefined);

const content = Object.fromEntries(read("Content.json").map((r) => [r.key, r.value]));
const hero = read("Hero.json")[0];
const videos = read("MediaVideo.json").sort((a, b) => a.sortOrder - b.sortOrder);
const galleryMeta = new Map(read("GalleryImage.json").map((r) => [r.publicId, r]));
const cloudinary = read("cloudinary.json"); // live site order (all sortOrder = 0 → Cloudinary order)

const report = { warnings: [], skipped: [] };

// --- Assets ---------------------------------------------------------------
async function uploadImage(url, filename) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch ${url}: ${res.status}`);
  const asset = await client.assets.upload("image", Buffer.from(await res.arrayBuffer()), { filename });
  return asset._id;
}

const heroVideoAsset = await client.assets.upload(
  "file",
  fs.createReadStream(new URL("../public/videos/hero.mp4", import.meta.url)),
  { filename: "hero.mp4", contentType: "video/mp4" }
);
console.log("hero video →", heroVideoAsset._id);

const gallery = [];
for (const r of cloudinary) {
  const meta = galleryMeta.get(r.public_id);
  if (!meta) report.warnings.push(`Cloudinary image without DB row: ${r.public_id}`);
  const assetId = await uploadImage(r.secure_url, `${r.public_id}.${r.format}`);
  console.log("image", r.public_id, "→", assetId);
  gallery.push({
    _key: key(r.public_id),
    _type: "image",
    asset: { _type: "reference", _ref: assetId },
    alt: clean(meta?.displayName) ?? r.public_id.replace(/_[a-z0-9]{6}$/, "").replace(/_/g, " "),
  });
}

// --- Content blocks -------------------------------------------------------
const blocks = [];
JSON.parse(content.wedding_blocks ?? "[]").forEach((b, i) => {
  if (b.type === "cta") {
    blocks.push({ _key: key(`block-${i}`), _type: "ctaBlock", text: clean(b.text) });
    return;
  }
  const out = {
    _key: key(`block-${i}`),
    _type: "contentBlock",
    subtitle: clean(b.subtitle),
    content: clean(b.content),
    intro: clean(b.intro),
    list: b.list?.map(clean).filter(Boolean),
    steps: b.steps?.map((s, j) => ({ _key: key(`block-${i}-step-${j}`), _type: "step", title: clean(s.title), text: clean(s.text) })),
    items: b.items?.map((s, j) => ({ _key: key(`block-${i}-item-${j}`), _type: "labeledItem", label: clean(s.label), text: clean(s.text) })),
    outro: clean(b.outro),
  };
  if (Object.values(out).filter((v) => v !== undefined).length <= 2) {
    report.skipped.push(`wedding_blocks[${i}] is empty: ${JSON.stringify(b)}`);
    return;
  }
  blocks.push(out);
});

// --- Documents ------------------------------------------------------------
const homePage = {
  _id: "homePage",
  _type: "homePage",
  heroTitle: clean(hero.title),
  heroSubtitle: clean(hero.subtitle),
  heroCtaText: clean(hero.ctaText),
  heroVideo: { _type: "file", asset: { _type: "reference", _ref: heroVideoAsset._id } },
  contentBlocks: blocks,
  mediaTitle: clean(content.media_section_title),
  videos: videos.map((v) => ({
    _key: key(v.id),
    _type: "youtubeVideo",
    composer: clean(v.composer),
    title: clean(v.title),
    youtubeId: clean(v.youtubeId),
  })),
  bio: clean(content.bio_text),
  gallery,
};

// Contact details were env vars (EMAIL_USER / PHONE_USER); social links were hardcoded in Media.tsx.
const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  email: clean(process.env.EMAIL_USER),
  phone: clean(process.env.PHONE_USER),
  socialLinks: [
    { platform: "YouTube", url: "https://www.youtube.com/@stockholmmusicgroup" },
    { platform: "Instagram", url: "https://www.instagram.com/stockholmmusicgroup" },
    { platform: "Facebook", url: "https://www.facebook.com/share/1JwFqG14MH/?mibextid=wwXIfr" },
  ].map((l) => ({ _key: key(l.platform), _type: "socialLink", ...l })),
  copyright: clean(content.footer_copyright),
};
if (!siteSettings.email || !siteSettings.phone) report.warnings.push("EMAIL_USER/PHONE_USER not set — footer contact missing");

// Strip undefined recursively so no field is ever written as null.
const strip = (v) => JSON.parse(JSON.stringify(v));

await client
  .transaction()
  .createOrReplace(strip(homePage))
  .createOrReplace(strip(siteSettings))
  .commit();

fs.mkdirSync(new URL("./reports/", import.meta.url), { recursive: true });
fs.writeFileSync(new URL("./reports/import.json", import.meta.url), JSON.stringify(report, null, 2));
console.log("Done.", report);
