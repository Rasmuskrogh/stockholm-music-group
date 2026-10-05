/**
 * One-off: give every existing Bokningsformulär section the form that
 * used to be hard-coded (same texts, same required fields), so it shows
 * up as editable fields in the Studio. Applied to the published home page
 * and its draft; sections that already have fields are skipped.
 *
 *   npx sanity exec migration/booking-form.mjs --with-user-token            # dry run
 *   npx sanity exec migration/booking-form.mjs --with-user-token -- --apply
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-01-01", perspective: "raw" });
const apply = process.argv.includes("--apply");

// Mirrors DEFAULT_FORM_FIELDS in src/lib/bookingForm.ts.
const FIELDS = [
  { _key: "name", _type: "formInput", label: "Namn", kind: "name", required: true },
  { _key: "email", _type: "formInput", label: "E-postadress", kind: "email", required: true },
  { _key: "tel", _type: "formInput", label: "Telefonnummer", kind: "tel", required: false },
  { _key: "date", _type: "formInput", label: "Datum för eventet", kind: "text", required: true },
  { _key: "place", _type: "formInput", label: "Plats för eventet (stad/region)", kind: "text", required: true },
  { _key: "music", _type: "formInput", label: "Önskad låt eller musikstil", kind: "text", required: false },
  {
    _key: "info",
    _type: "formCheckbox",
    label: "Jag samtycker till att SMG kontaktar mig med information om framtida spelningar och erbjudanden",
    required: false,
  },
];

const docs = await client.fetch(`*[_id in ["homePage", "drafts.homePage"]]{ _id, sections }`);
let tx = client.transaction();
let count = 0;

for (const doc of docs) {
  for (const section of doc.sections ?? []) {
    if (section._type !== "contactSection") continue;
    if (section.fields?.length) {
      console.log(`${doc._id} / ${section._key}: already has ${section.fields.length} fields — skipped`);
      continue;
    }
    const base = `sections[_key=="${section._key}"]`;
    tx = tx.patch(doc._id, {
      set: {
        [`${base}.fields`]: FIELDS,
        [`${base}.submitLabel`]: "Skicka",
        [`${base}.successMessage`]: "Tack! Ditt meddelande har skickats.",
      },
    });
    console.log(`${doc._id} / ${section._key}: ${FIELDS.length} fields`);
    count++;
  }
}

if (!apply) {
  console.log(`\nDry run — ${count} section(s) would be updated. Re-run with -- --apply.`);
} else if (count) {
  await tx.commit();
  console.log(`\nUpdated ${count} section(s).`);
}
