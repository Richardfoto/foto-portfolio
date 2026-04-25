import { defineField, defineType } from "sanity";

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Cím",
      type: "string",
    }),
    defineField({
      name: "subtitle",
      title: "Alcím",
      type: "string",
    }),
    defineField({
      name: "images",
      title: "Hero képek",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
    }),
  ],
});
