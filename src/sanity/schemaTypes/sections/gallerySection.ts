import { defineArrayMember, defineField, defineType } from "sanity";
import { ImagesIcon } from "@sanity/icons/Images";

export default defineType({
  name: "gallerySection",
  title: "Galleri",
  type: "object",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "images",
      title: "Bilder",
      type: "array",
      description: "Dra för att sortera. Beskärning och fokuspunkt ställs in på varje bild.",
      options: { layout: "grid" },
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Bildtext",
              type: "string",
              description: "Visas under bilden i förstoringsläget och läses upp av skärmläsare.",
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { images: "images", media: "images.0" },
    prepare: ({ images, media }) => ({
      title: "Galleri",
      subtitle: images ? `${Object.keys(images).length} bilder` : undefined,
      media,
    }),
  },
});
