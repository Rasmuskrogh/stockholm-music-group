import { defineArrayMember, defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons/Home";

// Sections there can only be one of: the hero belongs at the top, and the
// booking form is the target of every "Boka oss" button (#contact).
const SINGLE_SECTIONS: Record<string, string> = {
  heroSection: "Hero",
  contactSection: "Bokningsformulär",
};

/**
 * Singleton — the whole one-page site, built from sections that can be
 * added, removed and reordered. The footer is always last and isn't a
 * section.
 *
 * The fields below `sections` are the pre-section-builder layout, kept
 * (hidden) only as a fallback while `sections` is empty — see
 * src/app/(site)/page.tsx. They can be removed once every environment
 * has been migrated (migration/sections.mjs).
 */
export default defineType({
  name: "homePage",
  title: "Startsida",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "sections",
      title: "Sektioner",
      type: "array",
      description: "Sidan uppifrån och ned. Lägg till, ta bort eller dra för att ändra ordning. Footern ligger alltid sist.",
      of: [
        defineArrayMember({ type: "heroSection" }),
        defineArrayMember({ type: "textSection" }),
        defineArrayMember({ type: "contactSection" }),
        defineArrayMember({ type: "mediaSection" }),
        defineArrayMember({ type: "bioSection" }),
        defineArrayMember({ type: "gallerySection" }),
      ],
      validation: (Rule) =>
        Rule.custom((sections: { _type: string }[] | undefined) => {
          for (const [type, title] of Object.entries(SINGLE_SECTIONS)) {
            if ((sections ?? []).filter((s) => s._type === type).length > 1) {
              return `Det får bara finnas en sektion av typen "${title}".`;
            }
          }
          return true;
        }),
    }),

    // ---- Legacy layout (hidden fallback, see doc comment) ----
    defineField({ name: "heroTitle", type: "string", hidden: true }),
    defineField({ name: "heroSubtitle", type: "string", hidden: true }),
    defineField({ name: "heroCtaText", type: "string", hidden: true }),
    defineField({ name: "heroVideo", type: "file", hidden: true }),
    defineField({
      name: "contentBlocks",
      type: "array",
      hidden: true,
      of: [defineArrayMember({ type: "contentBlock" }), defineArrayMember({ type: "ctaBlock" })],
    }),
    defineField({ name: "mediaTitle", type: "string", hidden: true }),
    defineField({ name: "videos", type: "array", hidden: true, of: [defineArrayMember({ type: "youtubeVideo" })] }),
    defineField({ name: "bio", type: "text", hidden: true }),
    defineField({
      name: "gallery",
      type: "array",
      hidden: true,
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", type: "string" })],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Startsida" };
    },
  },
});
