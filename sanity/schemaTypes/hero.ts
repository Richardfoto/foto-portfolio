import { defineField, defineType } from "sanity";

export const hero = defineType({
  name: "hero",
  title: "Főoldal header és hero",
  type: "document",
  groups: [
    {
      name: "header",
      title: "Header szekció",
      default: true,
    },
    {
      name: "hero",
      title: "Hero / munkakép",
    },
    {
      name: "seo",
      title: "SEO",
    },
  ],
  initialValue: {
    headerTitle: "Budapest\nfotózás\nValódi pillanatok.",
    headerSubtitle:
      "Vezetett, mégis kötetlen hangulatú fotózás.\nMinden egy kávéval kezdődik, és egy történettel ér véget.",
    headerEyebrow: "Budapest • filmes hangulatú fotózás • 2015 óta",
    headerPrimaryCta: "Röviden, Igy képzeld el",
    headerSecondaryCta: "Melyik stílus illik hozzád?",
    seoTitle: "Richard Foto | Budapest fotózás valódi pillanatokkal",
    seoDescription:
      "Történetmesélő lifestyle, werk, personal brand és portré fotózás Budapesten. Valódi pillanatok, filmes hangulatban.",
  },
  fields: [
    defineField({
      name: "headerEyebrow",
      title: "Kis felirat",
      type: "string",
      group: "header",
      description: "A főoldal nyitóképe feletti rövid sor.",
    }),
    defineField({
      name: "headerTitle",
      title: "Header cím",
      type: "text",
      rows: 3,
      group: "header",
      description: "A főoldal első nagy címe. Sortörést is használhatsz.",
    }),
    defineField({
      name: "headerSubtitle",
      title: "Header alcím",
      type: "text",
      rows: 3,
      group: "header",
      description: "A nyitókép alatti rövid magyarázó szöveg.",
    }),
    defineField({
      name: "image",
      title: "Header kép / nyitókép",
      type: "image",
      group: "header",
      description:
        "Ez a főoldal legfelső háttérképe. Ide kerülhet például a Budapest Parlament éjszakai kép.",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headerPrimaryCta",
      title: "Első gomb felirata",
      type: "string",
      group: "header",
    }),
    defineField({
      name: "headerSecondaryCta",
      title: "Második gomb felirata",
      type: "string",
      group: "header",
    }),
    defineField({
      name: "workingImage",
      title: "Főoldali munkakép rólam",
      type: "image",
      group: "hero",
      description:
        "Külön főoldali kép rólad munka közben. A honlapon ez jelenik meg a bemutatkozó/érték blokk környékén, ha ki van töltve.",
      options: { hotspot: true },
    }),
    defineField({
      name: "images",
      title: "Régi / tartalék header képek",
      type: "array",
      hidden: true,
      group: "header",
      of: [
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
    }),
    defineField({
      name: "seoTitle",
      title: "SEO cím",
      type: "string",
      group: "seo",
      description: "Ha üres, a honlap a beépített alap SEO címet használja.",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO leírás",
      type: "text",
      rows: 3,
      group: "seo",
      description: "Ha üres, a honlap a beépített alap SEO leírást használja.",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Főoldal header és hero",
        subtitle: "Nyitókép, munkakép, CTA feliratok és SEO",
      };
    },
  },
});
