import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons/Envelope";

/** The booking form. Hero and "Boka oss" buttons scroll here. */
export default defineType({
  name: "contactSection",
  title: "Bokningsformulär",
  type: "object",
  icon: EnvelopeIcon,
  fields: [defineField({ name: "title", title: "Rubrik", type: "string", initialValue: "BOKA OSS" })],
  preview: {
    select: { title: "title" },
    prepare: ({ title }) => ({ title: "Bokningsformulär", subtitle: title }),
  },
});
