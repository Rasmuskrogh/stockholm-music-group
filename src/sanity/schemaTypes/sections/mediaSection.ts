import { defineArrayMember, defineField, defineType } from "sanity";
import { PlayIcon } from "@sanity/icons/Play";

export default defineType({
  name: "mediaSection",
  title: "Media",
  type: "object",
  icon: PlayIcon,
  fields: [
    defineField({ name: "title", title: "Rubrik", type: "string", initialValue: "Media" }),
    defineField({ name: "videos", title: "Videor", type: "array", of: [defineArrayMember({ type: "youtubeVideo" })] }),
  ],
  preview: {
    select: { title: "title", videos: "videos" },
    prepare: ({ title, videos }) => ({
      title: "Media",
      subtitle: [title, videos ? `${Object.keys(videos).length} video(r)` : null].filter(Boolean).join(" · "),
    }),
  },
});
