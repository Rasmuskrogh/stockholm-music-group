import { defineField, defineType } from "sanity";
import { StarIcon } from "@sanity/icons/Star";

export default defineType({
  name: "heroSection",
  title: "Hero",
  type: "object",
  icon: StarIcon,
  fields: [
    defineField({ name: "title", title: "Rubrik", type: "string", initialValue: "Stockholm" }),
    defineField({ name: "subtitle", title: "Underrubrik", type: "string", initialValue: "Music Group" }),
    defineField({ name: "ctaText", title: "Knapptext", type: "string", initialValue: "BOKA OSS" }),
    defineField({
      name: "video",
      title: "Bakgrundsvideo",
      type: "file",
      options: { accept: "video/mp4,video/webm" },
      description: "MP4, helst under ~5 MB. Spelas ljudlöst i loop.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "subtitle" },
    prepare: ({ title, subtitle }) => ({ title: "Hero", subtitle: [title, subtitle].filter(Boolean).join(" ") }),
  },
});
