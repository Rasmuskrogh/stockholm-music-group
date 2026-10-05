import { defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons/User";

export default defineType({
  name: "bioSection",
  title: "Bio",
  type: "object",
  icon: UserIcon,
  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      rows: 12,
      description: "Lämna en tom rad mellan stycken.",
    }),
  ],
  preview: {
    select: { text: "text" },
    prepare: ({ text }) => ({ title: "Bio", subtitle: text }),
  },
});
