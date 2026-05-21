import { defineField, defineType } from "sanity";

export const forgatasMenete = defineType({
  name: "forgatasMenete",
  title: "Röviden",
  type: "document",
  groups: [{ name: "images", title: "Oldal képei" }],
  fields: [
    defineField({
      name: "heroImage",
      title: "Hero kép",
      type: "image",
      group: "images",
      description: "A Röviden oldal nyitó, teljes szélességű hero képe.",
      options: { hotspot: true },
    }),
    defineField({
      name: "frameImage",
      title: "Frame szekció képe",
      type: "image",
      group: "images",
      description: "A 02 / frame szekció lebegő képe.",
      options: { hotspot: true },
    }),
    defineField({
      name: "brandImage",
      title: "Karakter - brand kép",
      type: "image",
      group: "images",
      description:
        "A vízszintes Karakter szekció Personal Brand Starter paneljének képe.",
      options: { hotspot: true },
    }),
    defineField({
      name: "atmosphereImage",
      title: "Karakter - atmoszféra kép",
      type: "image",
      group: "images",
      description:
        "A vízszintes Karakter szekció középső, atmoszféra paneljének képe.",
      options: { hotspot: true },
    }),
    defineField({
      name: "creatorImage",
      title: "Karakter - creator kép",
      type: "image",
      group: "images",
      description:
        "A vízszintes Karakter szekció creator / werk paneljének képe.",
      options: { hotspot: true },
    }),
    defineField({
      name: "whyImage",
      title: "Miért én szekció képe",
      type: "image",
      group: "images",
      description:
        "A 04 / miért én szekció nagy, kattintható képe, amely a galériára visz.",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      media: "heroImage",
    },
    prepare({ media }) {
      return {
        title: "Röviden",
        subtitle: "A roviden oldal külön állítható képei",
        media,
      };
    },
  },
});
