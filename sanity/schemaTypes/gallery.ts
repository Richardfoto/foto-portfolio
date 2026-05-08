import { defineField, defineType } from "sanity";

export const gallery = defineType({
  name: "gallery",
  title: "Szolgáltatás galéria",
  type: "document",
  groups: [
    { name: "images", title: "Képek" },
    { name: "content", title: "Tartalom" },
    { name: "feedback", title: "Visszajelzés" },
    { name: "settings", title: "Kapcsolás" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Szolgáltatás galéria címe",
      type: "string",
      group: "content",
      description:
        "Ez jelenik meg a galéria kártyán és a galéria részletes oldalának címsorában.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL azonosító",
      type: "slug",
      group: "content",
      options: {
        source: "title",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "service",
      title: "Kapcsolódó szolgáltatás - a honlap ezt használja",
      type: "reference",
      group: "settings",
      to: [{ type: "service" }],
      description:
        "Ez dönti el, melyik szolgáltatáshoz tartozik a galéria, milyen kategórianév látszik, és a honlap milyen sorrendben jeleníti meg.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "serviceId",
      title: "Régi szolgáltatás azonosító",
      type: "string",
      group: "settings",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "serviceOrder",
      title: "Régi szolgáltatás sorrend",
      type: "number",
      group: "settings",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "category",
      title: "Régi kategória",
      type: "string",
      group: "settings",
      description:
        "Korábbi kategória mező. Új tartalomnál a Kapcsolódó szolgáltatás mezőt használd.",
      readOnly: true,
      hidden: true,
    }),

    defineField({
      name: "featured",
      title: "Kiemelt a főoldalon?",
      type: "boolean",
      group: "settings",
      description:
        "Pipáld be, ha ezt a galériát szeretnéd látni a főoldali kiemelt galéria szekcióban. A honlap legfeljebb 8 kiemelt galériát mutat.",
      initialValue: false,
    }),

    defineField({
      name: "coverImage",
      title: "Szolgáltatás galéria borítókép",
      type: "image",
      group: "images",
      description:
        "Csak a Galéria oldalakon jelenik meg: a galéria kártyán és a galéria részletes oldalának fő képeként. A Services oldal képei külön, a szolgáltatás dokumentumban állíthatók.",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "images",
      title: "Szolgáltatás galéria képei",
      type: "array",
      group: "images",
      description:
        "Ezek jelennek meg a galéria részletes oldalán. Az első erős kép legyen elöl; ha nincs külön kép feltöltve, a honlap a galéria borítóképet használja.",
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
      name: "description",
      title: "Leírás a galéria oldalhoz",
      type: "text",
      group: "content",
      description:
        "Rövid, emberi leírás. Nem kell hosszúnak lennie; 1-3 mondat elég.",
    }),
    defineField({
      name: "feedbackEnabled",
      title: "Visszajelzés megjelenítése?",
      type: "boolean",
      group: "feedback",
      description:
        "Kapcsold be, ha ehhez a galériához szeretnél visszajelzést vagy Google értékelést megjeleníteni.",
      initialValue: false,
    }),
    defineField({
      name: "feedbackQuoteHu",
      title: "Visszajelzés szövege (HU)",
      type: "text",
      rows: 4,
      group: "feedback",
      description:
        "Rövid idézet vagy összefoglaló. Csak akkor jelenik meg, ha a visszajelzés kapcsoló aktív.",
    }),
    defineField({
      name: "feedbackQuoteEn",
      title: "Feedback text (EN)",
      type: "text",
      rows: 4,
      group: "feedback",
    }),
    defineField({
      name: "feedbackAuthor",
      title: "Név / megjelenített aláírás",
      type: "string",
      group: "feedback",
      description:
        "Lehet teljes név, keresztnév, monogram vagy általános aláírás, például: Google értékelés.",
    }),
    defineField({
      name: "feedbackSource",
      title: "Forrás",
      type: "string",
      group: "feedback",
      options: {
        list: [
          { title: "Személyes visszajelzés", value: "personal" },
          { title: "Google értékelés", value: "google" },
          { title: "Email / üzenet", value: "message" },
        ],
      },
      initialValue: "personal",
    }),
    defineField({
      name: "feedbackUrl",
      title: "Google értékelés vagy forrás link",
      type: "url",
      group: "feedback",
      description:
        "Opcionális. Akkor hasznos, ha publikus Google értékelésre szeretnél mutatni.",
    }),
  ],
  orderings: [
    {
      title: "Szolgáltatás sorrend szerint",
      name: "serviceOrderAsc",
      by: [
        { field: "serviceOrder", direction: "asc" },
        { field: "_createdAt", direction: "desc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      serviceTitle: "service.titleHu",
      media: "coverImage",
    },
    prepare({ title, serviceTitle, media }) {
      return {
        title,
        subtitle: serviceTitle,
        media,
      };
    },
  },
});
