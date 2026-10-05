import { defineField, defineType } from "sanity";
import { EditIcon } from "@sanity/icons/Edit";
import { FORM_INPUT_KINDS } from "../../../lib/bookingForm";

export default defineType({
  name: "formInput",
  title: "Inmatningsfält",
  type: "object",
  icon: EditIcon,
  fields: [
    defineField({
      name: "label",
      title: "Text i fältet",
      type: "string",
      description: 'Visas i fältet och i mejlet, t.ex. "Datum för eventet". Obligatoriska fält får en * automatiskt.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "kind",
      title: "Typ",
      type: "string",
      description: "E-post används som svarsadress och får bekräftelsemejlet. Namn används i mejlets ämnesrad.",
      options: { list: FORM_INPUT_KINDS, layout: "radio" },
      initialValue: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "required", title: "Obligatoriskt", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { label: "label", kind: "kind", required: "required" },
    prepare: ({ label, kind, required }) => ({
      title: `${label ?? "(utan text)"}${required ? " *" : ""}`,
      subtitle: FORM_INPUT_KINDS.find((k) => k.value === kind)?.title,
    }),
  },
});
