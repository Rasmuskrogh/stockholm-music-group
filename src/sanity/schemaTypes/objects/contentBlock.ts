import { defineArrayMember, defineField, defineType } from "sanity";
import { TextIcon } from "@sanity/icons/Text";

/**
 * One text block in the intro section below the hero. Every part is
 * optional and renders in field order: rubrik → text → inledning →
 * punktlista → steg → rubricerade stycken → avslutning.
 */
export default defineType({
  name: "contentBlock",
  title: "Textblock",
  type: "object",
  icon: TextIcon,
  fields: [
    defineField({ name: "subtitle", title: "Rubrik", type: "string" }),
    defineField({
      name: "content",
      title: "Text",
      type: "text",
      rows: 5,
      description: "Radbrytningar i texten visas som radbrytningar på sajten.",
    }),
    defineField({ name: "intro", title: "Inledning (före listan)", type: "string" }),
    defineField({
      name: "list",
      title: "Punktlista",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "steps",
      title: "Numrerade steg",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "step",
          fields: [
            defineField({ name: "title", title: "Rubrik", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "text", title: "Text", type: "string" }),
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        }),
      ],
    }),
    defineField({
      name: "items",
      title: "Rubricerade stycken",
      type: "array",
      description: "Fetstilad etikett följd av en text, t.ex. \"🎵 Ceremonier\".",
      of: [
        defineArrayMember({
          type: "object",
          name: "labeledItem",
          fields: [
            defineField({ name: "label", title: "Etikett", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "text", title: "Text", type: "string" }),
          ],
          preview: { select: { title: "label", subtitle: "text" } },
        }),
      ],
    }),
    defineField({ name: "outro", title: "Avslutning (efter listan)", type: "text", rows: 2 }),
  ],
  preview: {
    select: { title: "subtitle", subtitle: "content" },
    prepare({ title, subtitle }) {
      return { title: title || "(utan rubrik)", subtitle };
    },
  },
});
