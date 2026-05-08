import { defineField, defineType } from "sanity";

export const about = defineType({
  name: "about",
  title: "Rólam",
  type: "document",
  fields: [
    defineField({
      name: "heroImage",
      title: "Régi hero háttérkép",
      type: "image",
      hidden: true,
      description:
        "Régi mező. A főoldali hero képet a Főoldal hero dokumentumban szerkeszd.",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "name",
      title: "Teljes név",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headerEyebrowHu",
      title: "Header kis felirat - magyar",
      type: "string",
      description: "A Rólam oldal tetején, a nagy cím felett jelenik meg.",
    }),
    defineField({
      name: "headerEyebrowEn",
      title: "Header kis felirat - angol",
      type: "string",
      description: "Az angol Rólam oldal tetején, a nagy cím felett jelenik meg.",
    }),
    defineField({
      name: "headerTitleHu",
      title: "Header főcím - magyar",
      type: "string",
      description: "A Rólam oldal nagy címe.",
    }),
    defineField({
      name: "headerTitleEn",
      title: "Header főcím - angol",
      type: "string",
      description: "Az angol Rólam oldal nagy címe.",
    }),
    defineField({
      name: "headerIntroHu",
      title: "Header bevezető - magyar",
      type: "text",
      rows: 3,
      description: "A Rólam oldal header szövege a nagy cím alatt.",
    }),
    defineField({
      name: "headerIntroEn",
      title: "Header bevezető - angol",
      type: "text",
      rows: 3,
      description: "Az angol Rólam oldal header szövege a nagy cím alatt.",
    }),
    defineField({
      name: "headerImage",
      title: "Rólam oldal header képe",
      type: "image",
      description:
        "A Rólam oldal felső, sötét header szekciójának háttérképe. Külön állítható a profilképtől.",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "profileImage",
      title: "Rólam oldal fő profilképe",
      type: "image",
      description:
        "A Rólam oldalon a bemutatkozó szöveg mellett megjelenő fő portré/profilkép.",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "aboutImage",
      title: "Főoldali rólam szekció képe",
      type: "image",
      options: {
        hotspot: true,
      },
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
