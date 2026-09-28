import { defineField, defineType } from "sanity";
import { LinkIcon } from "@sanity/icons/Link";

/** Button that scrolls down to the booking form. */
export default defineType({
  name: "ctaBlock",
  title: "Knapp till bokningsformuläret",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({ name: "text", title: "Knapptext", type: "string", validation: (Rule) => Rule.required() }),
  ],
  preview: {
    select: { title: "text" },
    prepare({ title }) {
      return { title, subtitle: "Knapp → bokningsformuläret" };
    },
  },
});
