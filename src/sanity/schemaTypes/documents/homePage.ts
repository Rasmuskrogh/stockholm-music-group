import { defineArrayMember, defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons/Home";

/** Singleton — the whole one-page site, section by section. */
export default defineType({
  name: "homePage",
  title: "Startsida",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "intro", title: "Textblock" },
    { name: "media", title: "Media" },
    { name: "bio", title: "Bio" },
    { name: "gallery", title: "Galleri" },
  ],
  fields: [
    defineField({ name: "heroTitle", title: "Rubrik", type: "string", group: "hero", initialValue: "Stockholm" }),
    defineField({ name: "heroSubtitle", title: "Underrubrik", type: "string", group: "hero", initialValue: "Music Group" }),
    defineField({ name: "heroCtaText", title: "Knapptext", type: "string", group: "hero", initialValue: "BOKA OSS" }),
    defineField({
      name: "heroVideo",
      title: "Bakgrundsvideo",
      type: "file",
      group: "hero",
      options: { accept: "video/mp4,video/webm" },
      description: "MP4, helst under ~5 MB. Spelas ljudlöst i loop.",
    }),

    defineField({
      name: "contentBlocks",
      title: "Textblock",
      type: "array",
      group: "intro",
      description: "Blocken under heron, i den här ordningen. Dra för att sortera.",
      of: [defineArrayMember({ type: "contentBlock" }), defineArrayMember({ type: "ctaBlock" })],
    }),

    defineField({ name: "mediaTitle", title: "Rubrik", type: "string", group: "media", initialValue: "Media" }),
    defineField({
      name: "videos",
      title: "Videor",
      type: "array",
      group: "media",
      of: [defineArrayMember({ type: "youtubeVideo" })],
    }),

    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 12,
      group: "bio",
      description: "Lämna en tom rad mellan stycken.",
    }),

    defineField({
      name: "gallery",
      title: "Bilder",
      type: "array",
      group: "gallery",
      description: "Dra för att sortera. Beskärning och fokuspunkt ställs in på varje bild.",
      options: { layout: "grid" },
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Bildtext",
              type: "string",
              description: "Visas under bilden i förstoringsläget och läses upp av skärmläsare.",
              validation: (Rule) => Rule.required(),
            }),
          ],
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
