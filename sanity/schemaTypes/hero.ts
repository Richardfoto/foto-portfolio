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
      name: "image",
      title: "Főoldali hero kép",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "images",
      title: "Régi hero képek",
      type: "array",
      hidden: true,
      of: [
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
    }),
  ],
});
