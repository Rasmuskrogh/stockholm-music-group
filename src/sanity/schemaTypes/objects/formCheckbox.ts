import { defineField, defineType } from "sanity";
import { CheckmarkCircleIcon } from "@sanity/icons/CheckmarkCircle";

export default defineType({
  name: "formCheckbox",
  title: "Kryssruta",
  type: "object",
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: "label",
      title: "Text",
      type: "text",
      rows: 2,
      description: "Texten bredvid kryssrutan, t.ex. ett samtycke.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "required",
      title: "Måste kryssas i",
      type: "boolean",
      description: "Formuläret går inte att skicka utan att rutan är ikryssad.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { label: "label", required: "required" },
    prepare: ({ label, required }) => ({ title: `☐ ${label ?? "(utan text)"}${required ? " *" : ""}`, subtitle: "Kryssruta" }),
  },
});
