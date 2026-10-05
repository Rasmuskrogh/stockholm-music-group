import { defineArrayMember, defineField, defineType } from "sanity";
import { TextIcon } from "@sanity/icons/Text";

export default defineType({
  name: "textSection",
  title: "Textblock",
  type: "object",
  icon: TextIcon,
  fields: [
    defineField({
      name: "blocks",
      title: "Block",
      type: "array",
      description: "Visas i den här ordningen. Dra för att sortera.",
      of: [defineArrayMember({ type: "contentBlock" }), defineArrayMember({ type: "ctaBlock" })],
    }),
  ],
  preview: {
    select: { first: "blocks.0.subtitle", blocks: "blocks" },
    prepare: ({ first, blocks }) => ({
      title: "Textblock",
      subtitle: [first, blocks ? `${Object.keys(blocks).length} block` : null].filter(Boolean).join(" · "),
    }),
  },
});
