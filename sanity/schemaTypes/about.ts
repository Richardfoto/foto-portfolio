import { defineField, defineType } from "sanity";

export const about = defineType({
  name: "about",
  title: "Rólam",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Teljes név",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "profileImage",
      title: "Profilkép",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Bemutatkozás",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "experience",
      title: "Tapasztalat (évek)",
      type: "number",
    }),
    defineField({
      name: "instagram",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "facebook",
      title: "Facebook URL",
      type: "url",
    }),
    defineField({
      name: "email",
      title: "Email cím",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Telefonszám",
      type: "string",
    }),
  ],
});
