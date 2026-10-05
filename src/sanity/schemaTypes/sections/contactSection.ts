import { defineArrayMember, defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { DEFAULT_FORM_FIELDS, DEFAULT_SUBMIT_LABEL, DEFAULT_SUCCESS_MESSAGE } from "../../../lib/bookingForm";

/**
 * The booking form. Hero and "Boka oss" buttons scroll here. Its fields
 * are editable; /api/contact validates submissions against them and
 * lists them, in this order, in the notification email.
 */
export default defineType({
  name: "contactSection",
  title: "Bokningsformulär",
  type: "object",
  icon: EnvelopeIcon,
  fields: [
    defineField({ name: "title", title: "Rubrik", type: "string", initialValue: "BOKA OSS" }),
    defineField({
      name: "fields",
      title: "Formulärfält",
      type: "array",
      description: "Fälten uppifrån och ned. Lägg till, ta bort eller dra för att ändra ordning.",
      of: [defineArrayMember({ type: "formInput" }), defineArrayMember({ type: "formCheckbox" })],
      initialValue: () => DEFAULT_FORM_FIELDS.map((field) => ({ ...field, _key: Math.random().toString(36).slice(2, 14) })),
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .custom((fields: { _type: string; kind?: string }[] | undefined) =>
            (fields ?? []).some((f) => f._type === "formInput" && f.kind === "email")
              ? true
              : "Formuläret behöver ett fält av typen E-post, annars går det inte att svara på förfrågan.",
          ),
    }),
    defineField({ name: "submitLabel", title: "Text på skicka-knappen", type: "string", initialValue: DEFAULT_SUBMIT_LABEL }),
    defineField({
      name: "successMessage",
      title: "Tack-meddelande",
      type: "string",
      description: "Visas när formuläret har skickats.",
      initialValue: DEFAULT_SUCCESS_MESSAGE,
    }),
  ],
  preview: {
    select: { title: "title", fields: "fields" },
    prepare: ({ title, fields }) => ({
      title: "Bokningsformulär",
      subtitle: [title, fields ? `${Object.keys(fields).length} fält` : null].filter(Boolean).join(" · "),
    }),
  },
});
