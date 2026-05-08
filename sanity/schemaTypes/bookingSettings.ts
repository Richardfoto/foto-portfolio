import { defineField, defineType } from "sanity";

export const bookingSettings = defineType({
  name: "bookingSettings",
  title: "Foglalás oldal",
  type: "document",
  fields: [
    defineField({
      name: "eyebrowHu",
      title: "Header kis felirat - magyar",
      type: "string",
      description: "A Foglalás oldal tetején, a nagy cím felett jelenik meg.",
    }),
    defineField({
      name: "eyebrowEn",
      title: "Header kis felirat - angol",
      type: "string",
      description: "Az angol Foglalás oldal tetején, a nagy cím felett jelenik meg.",
    }),
    defineField({
      name: "titleHu",
      title: "Header főcím - magyar",
      type: "string",
      description: "A Foglalás oldal nagy címe.",
    }),
    defineField({
      name: "titleEn",
      title: "Header főcím - angol",
      type: "string",
      description: "Az angol Foglalás oldal nagy címe.",
    }),
    defineField({
      name: "introHu",
      title: "Header bevezető - magyar",
      type: "text",
      rows: 3,
      description: "A Foglalás oldal header szövege a nagy cím alatt.",
    }),
    defineField({
      name: "introEn",
      title: "Header bevezető - angol",
      type: "text",
      rows: 3,
      description: "Az angol Foglalás oldal header szövege a nagy cím alatt.",
    }),
    defineField({
      name: "headerImage",
      title: "Foglalás header képe",
      type: "image",
      description:
        "Opcionális háttérkép a Foglalás oldal felső header részéhez. Ha üres, marad a letisztult sötét háttér.",
      options: {
        hotspot: true,
      },
    }),
  ],
});
