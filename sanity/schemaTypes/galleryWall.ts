import { defineField, defineType } from "sanity";

export const galleryWall = defineType({
  name: "galleryWall",
  title: "Galéria fal",
  type: "document",
  fields: [
    defineField({
      name: "titleHu",
      title: "Címsor (HU)",
      type: "string",
      initialValue: "Üdvözöllek a víziómban",
    }),
    defineField({
      name: "titleEn",
      title: "Title (EN)",
      type: "string",
      initialValue: "Welcome to my vision",
    }),
    defineField({
      name: "leadHu",
      title: "Bevezető (HU)",
      type: "text",
      rows: 4,
      initialValue:
        "Ez egy kis love letter szekció: az a szívem csücske rész, ami nekem kedves. Biztosan megtaláljuk a számodra is legjobb stílust, atmoszférát, értéket és pillanatot, amit keresel.",
    }),
    defineField({
      name: "leadEn",
      title: "Lead (EN)",
      type: "text",
      rows: 4,
      initialValue:
        "This is a small love letter section: a corner of the work that feels close to my heart. I am sure we can find the style, atmosphere, value and moment that feels right for you.",
    }),
    defineField({
      name: "heroImage",
      title: "Galéria head kép",
      type: "image",
      description:
        "Ez csak a Galéria oldal felső hero/head képét állítja. Nem számít bele a 6 képes galériafalba.",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroCaptionHu",
      title: "Head kép képaláírás (HU)",
      type: "text",
      rows: 2,
      description:
        "Opcionális rövid képaláírás a Galéria oldal felső képéhez.",
    }),
    defineField({
      name: "heroCaptionEn",
      title: "Hero image caption (EN)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "items",
      title: "Képfal elemek",
      type: "array",
      description:
        "Ide csak a Galéria oldal 6 kiemelt képét töltsd. Hat kép, hat rövid történet: ez legyen a személyes love letter szekció, nem teljes archívum.",
      validation: (rule) => rule.max(6).warning("A galéria falon legfeljebb 6 kép jelenjen meg."),
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "active",
              title: "Aktív?",
              type: "boolean",
              initialValue: true,
            }),
            defineField({
              name: "image",
              title: "Kép",
              type: "image",
              options: { hotspot: true },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "size",
              title: "Méret a képfalon",
              type: "string",
              options: {
                list: [
                  { title: "Közepes", value: "medium" },
                  { title: "Nagy", value: "large" },
                  { title: "Széles", value: "wide" },
                  { title: "Magas", value: "tall" },
                  { title: "Kicsi", value: "small" },
                ],
              },
              initialValue: "medium",
            }),
            defineField({
              name: "storyTitleHu",
              title: "Story cím (HU)",
              type: "string",
            }),
            defineField({
              name: "storyTitleEn",
              title: "Story title (EN)",
              type: "string",
            }),
            defineField({
              name: "storyHu",
              title: "Story szöveg (HU)",
              type: "text",
              rows: 4,
            }),
            defineField({
              name: "storyEn",
              title: "Story text (EN)",
              type: "text",
              rows: 4,
            }),
          ],
          preview: {
            select: {
              title: "storyTitleHu",
              media: "image",
              size: "size",
            },
            prepare({ title, media, size }) {
              return {
                title: title || "Galéria fal kép",
                subtitle: size,
                media,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "feedbackStories",
      title: "Hiteles visszajelzések képpel",
      type: "array",
      description:
        "Ide kerülhetnek azok a valódi visszajelzések, ahol a fotóalany akár a kinyomtatott képpel együtt szerepel. A honlapon csak az aktív, képpel és idézettel kitöltött elemek jelennek meg.",
      validation: (rule) =>
        rule.max(4).warning("Elég 2-4 erős, hiteles visszajelzés."),
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "active",
              title: "Aktív?",
              type: "boolean",
              initialValue: true,
            }),
            defineField({
              name: "image",
              title: "Kép a visszajelzéshez",
              type: "image",
              description:
                "Ide jöhet például a modell a kinyomtatott képpel, vagy egy kép a fotózás utáni átadás pillanatáról.",
              options: { hotspot: true },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "quoteHu",
              title: "Visszajelzés szövege (HU)",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "quoteEn",
              title: "Feedback text (EN)",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "name",
              title: "Megjelenő név",
              type: "string",
              description:
                "Keresztnév, monogram vagy 'név nélkül'. Csak engedéllyel töltsd ki.",
            }),
            defineField({
              name: "contextHu",
              title: "Rövid kontextus (HU)",
              type: "string",
              description:
                "Például: Personal Brand Starter, Lifestyle Story Session, Budapest.",
            }),
            defineField({
              name: "contextEn",
              title: "Short context (EN)",
              type: "string",
            }),
          ],
          preview: {
            select: {
              title: "name",
              subtitle: "contextHu",
              media: "image",
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title || "Visszajelzés",
                subtitle: subtitle || "Hiteles visszajelzés képpel",
                media,
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      media: "heroImage",
    },
    prepare({ media }) {
      return {
        title: "Galéria fal",
        subtitle: "6 kép, 6 történet, személyes love letter szekció",
        media,
      };
    },
  },
});
