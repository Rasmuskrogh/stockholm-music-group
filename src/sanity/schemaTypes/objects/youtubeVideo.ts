import { defineField, defineType } from "sanity";
import { PlayIcon } from "@sanity/icons/Play";

export default defineType({
  name: "youtubeVideo",
  title: "YouTube-video",
  type: "object",
  icon: PlayIcon,
  fields: [
    defineField({ name: "composer", title: "Artist / kompositör", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "title", title: "Låttitel", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "youtubeId",
      title: "YouTube-länk eller video-ID",
      type: "string",
      description: "Klistra in länken från YouTube (t.ex. https://youtu.be/ntgveY_yZAA) eller bara ID:t.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: { select: { title: "title", subtitle: "composer" } },
});
