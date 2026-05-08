import { defineField, defineType } from "sanity";

export const homeSessions = defineType({
  name: "homeSessions",
  title: "Főoldali session képek",
  type: "document",
  groups: [{ name: "images", title: "Főoldali képek" }],
  fields: [
    defineField({
      name: "personalBrandStarterImage",
      title: "Personal Brand Starter kép",
      type: "image",
      group: "images",
      description:
        "Csak a főoldali Personal Brand Starter kártya képe. Nem a Services oldal és nem a Galéria képe.",
      options: { hotspot: true },
    }),
    defineField({
      name: "lifestyleStorySessionImage",
      title: "Lifestyle Story Session kép",
      type: "image",
      group: "images",
      description:
        "Csak a főoldali Lifestyle Story Session kártya képe. Nem a Services oldal és nem a Galéria képe.",
      options: { hotspot: true },
    }),
    defineField({
      name: "contentCreatorDayImage",
      title: "Content Creator Day kép",
      type: "image",
      group: "images",
      description:
        "Csak a főoldali Content Creator Day kártya képe. Nem a Services oldal és nem a Galéria képe.",
      options: { hotspot: true },
    }),
    defineField({
      name: "datingBoostImage",
      title: "Dating Boost kép",
      type: "image",
      group: "images",
      description:
        "Csak a főoldali Dating Boost kártya képe. Nem a Services oldal és nem a Galéria képe.",
      options: { hotspot: true },
    }),
    defineField({
      name: "modelApplicationImage",
      title: "Kedvezményes fotózás / modell jelentkezés kép",
      type: "image",
      group: "images",
      description:
        "Csak a főoldali Kedvezményes fotózás / Jelentkezz modellnek kártya képe. Nem a Services oldal és nem a Galéria képe.",
      options: { hotspot: true },
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Főoldali session képek",
        subtitle:
          "Personal Brand, Lifestyle, Content Creator, Dating Boost, Kedvezményes fotózás",
      };
    },
  },
});
