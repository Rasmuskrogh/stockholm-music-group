import { defineField, defineType } from "sanity";
import { EditIcon } from "@sanity/icons/Edit";
import { FORM_INPUT_KINDS, displayLabel } from "../../../lib/bookingForm";

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
      description: 'Visas i fältet och i mejlet, t.ex. "Datum för eventet". Avsluta med * för att göra fältet obligatoriskt.',
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
    defineField({
      name: "required",
      title: "Obligatoriskt",
      type: "boolean",
      description: "Samma sak som att avsluta texten med *.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { label: "label", kind: "kind", required: "required" },
    prepare: ({ label, kind, required }) => ({
      title: label ? displayLabel({ label, required }) : "(utan text)",
      subtitle: FORM_INPUT_KINDS.find((k) => k.value === kind)?.title,
    }),
  },
});
