import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Szolgáltatás",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Csomag neve",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Ár (Ft)",
      type: "number",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "duration",
      title: "Időtartam",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Leírás",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "includes",
      title: "Mit tartalmaz",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "isPopular",
      title: "Kiemelt csomag?",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
