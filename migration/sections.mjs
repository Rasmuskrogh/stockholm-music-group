/**
 * One-off: build homePage.sections from the old fixed-layout fields, in
 * the order the page used to render them. Applied to the published
 * document and to its draft (each from its own content), and skipped
 * for any version that already has sections. The old fields are left
 * untouched, so the page can fall back to them.
 *
 *   npx sanity exec migration/sections.mjs --with-user-token            # dry run
 *   npx sanity exec migration/sections.mjs --with-user-token -- --apply
 */
import { randomUUID } from "node:crypto";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-01-01", perspective: "raw" });
const apply = process.argv.includes("--apply");
const key = () => randomUUID().replace(/-/g, "").slice(0, 12);

// Never write null/empty fields (Studio shows "Invalid property value").
const defined = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null));

function buildSections(doc) {
  return [
    defined({
      _key: key(),
      _type: "heroSection",
      title: doc.heroTitle,
      subtitle: doc.heroSubtitle,
      ctaText: doc.heroCtaText,
      video: doc.heroVideo,
    }),
    defined({ _key: key(), _type: "textSection", blocks: doc.contentBlocks }),
    { _key: key(), _type: "contactSection", title: "BOKA OSS" },
    defined({ _key: key(), _type: "mediaSection", title: doc.mediaTitle, videos: doc.videos }),
    defined({ _key: key(), _type: "bioSection", text: doc.bio }),
    defined({ _key: key(), _type: "gallerySection", images: doc.gallery }),
  ];
}

const docs = await client.fetch(`*[_id in ["homePage", "drafts.homePage"]]`);
let tx = client.transaction();
let count = 0;

for (const doc of docs) {
  if (doc.sections?.length) {
    console.log(`${doc._id}: already has ${doc.sections.length} sections — skipped`);
    continue;
  }
  const sections = buildSections(doc);
  console.log(
    `${doc._id}: ${sections.map((s) => s._type).join(" → ")} (blocks ${doc.contentBlocks?.length ?? 0}, videos ${doc.videos?.length ?? 0}, images ${doc.gallery?.length ?? 0})`,
  );
  tx = tx.patch(doc._id, { setIfMissing: { sections: [] }, set: { sections } });
  count++;
}

if (!apply) {
  console.log(`\nDry run — ${count} document(s) would be updated. Re-run with -- --apply.`);
} else if (count) {
  await tx.commit();
  console.log(`\nUpdated ${count} document(s).`);
}
