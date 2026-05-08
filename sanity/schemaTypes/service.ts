import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Szolgáltatás",
  type: "document",
  groups: [
    { name: "images", title: "Képek" },
    { name: "content", title: "Szövegek" },
    { name: "settings", title: "Beállítások" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "serviceId",
      title: "Belső azonosító - ne módosítsd",
      type: "string",
      group: "settings",
      description:
        "Ezt a honlap használja a szolgáltatás és a galéria összekötéséhez.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Honlap sorrend",
      type: "number",
      group: "settings",
      description:
        "Ez adja a szolgáltatások és a hozzájuk tartozó galériák sorrendjét a honlapon.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "inactive",
      title: "Elrejtve a honlapról?",
      type: "boolean",
      group: "settings",
      description:
        "Kapcsold be, ha ezt a szolgáltatást ideiglenesen nem szeretnéd megjeleníteni a publikus honlapon. A tartalom és a képek megmaradnak a Studio-ban.",
      initialValue: false,
    }),
    defineField({
      name: "anchor",
      title: "Oldalon belüli horgony",
      type: "string",
      group: "settings",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Régi szolgáltatás kép",
      type: "image",
      group: "settings",
      description:
        "Régi mező, a honlap már nem ezt használja. Új képet a Szolgáltatás oldal képei mezőbe tölts fel.",
      hidden: true,
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "serviceImages",
      title: "Szolgáltatás oldal képei",
      type: "array",
      group: "images",
      description:
        "Csak a Services/Szolgáltatások oldal és a szolgáltatás részletes oldala használja. Legfeljebb 3 saját kép; külön van a Galériáktól és a főoldali session képektől.",
      validation: (rule) => rule.max(3),
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: "titleHu",
      title: "Cím (HU)",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "titleEn",
      title: "Title (EN)",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortTitleHu",
      title: "Rövid cím (HU)",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "shortTitleEn",
      title: "Short title (EN)",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "descriptionHu",
      title: "Leírás (HU)",
      type: "text",
      group: "content",
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "descriptionEn",
      title: "Description (EN)",
      type: "text",
      group: "content",
      rows: 5,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ctaHu",
      title: "CTA (HU)",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "ctaEn",
      title: "CTA (EN)",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "captionsHu",
      title: "Képaláírások (HU)",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "captionsEn",
      title: "Captions (EN)",
      type: "array",
      group: "content",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "keywordsHu",
      title: "Kulcsszavak (HU)",
      type: "array",
      group: "seo",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "keywordsEn",
      title: "Keywords (EN)",
      type: "array",
      group: "seo",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "featured",
      title: "Kiemelt szolgáltatás?",
      type: "boolean",
      group: "settings",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Sorrend szerint",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "titleHu",
      subtitle: "titleEn",
      media: "image",
      serviceImages: "serviceImages",
      inactive: "inactive",
    },
    prepare({ title, subtitle, media, serviceImages, inactive }) {
      return {
        title,
        subtitle: inactive === true ? `Inaktív - ${subtitle}` : subtitle,
        media: serviceImages?.[0] ?? media,
      };
    },
  },
});
