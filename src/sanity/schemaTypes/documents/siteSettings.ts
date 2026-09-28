import { defineArrayMember, defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons/Cog";

/** Singleton — contact details, social links and footer text. */
export default defineType({
  name: "siteSettings",
  title: "Inställningar",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "email",
      title: "E-post (visas i footern)",
      type: "string",
      validation: (Rule) => Rule.email(),
    }),
    defineField({ name: "phone", title: "Telefon (visas i footern)", type: "string" }),
    defineField({
      name: "socialLinks",
      title: "Sociala medier",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          fields: [
            defineField({
              name: "platform",
              title: "Plattform",
              type: "string",
              options: { list: ["YouTube", "Instagram", "Facebook"] },
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "url", title: "Länk", type: "url", validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        }),
      ],
    }),
    defineField({ name: "copyright", title: "Copyright-text i footern", type: "string" }),
  ],
  preview: {
    prepare() {
      return { title: "Inställningar" };
    },
  },
});
