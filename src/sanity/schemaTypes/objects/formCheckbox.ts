import { defineField, defineType } from "sanity";
import { CheckmarkCircleIcon } from "@sanity/icons/CheckmarkCircle";
import { displayLabel } from "../../../lib/bookingForm";

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
      description: "Texten bredvid kryssrutan, t.ex. ett samtycke. Avsluta med * om rutan måste kryssas i.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "required",
      title: "Måste kryssas i",
      type: "boolean",
      description: "Formuläret går inte att skicka utan att rutan är ikryssad. Samma sak som att avsluta texten med *.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { label: "label", required: "required" },
    prepare: ({ label, required }) => ({ title: `☐ ${label ? displayLabel({ label, required }) : "(utan text)"}`, subtitle: "Kryssruta" }),
  },
});
