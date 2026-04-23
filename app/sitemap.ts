import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://richardfoto.vercel.app/hu", lastModified: new Date() },
    { url: "https://richardfoto.vercel.app/en", lastModified: new Date() },
    {
      url: "https://richardfoto.vercel.app/hu/gallery",
      lastModified: new Date(),
    },
    {
      url: "https://richardfoto.vercel.app/en/gallery",
      lastModified: new Date(),
    },
    {
      url: "https://richardfoto.vercel.app/hu/services",
      lastModified: new Date(),
    },
    {
      url: "https://richardfoto.vercel.app/en/services",
      lastModified: new Date(),
    },
    {
      url: "https://richardfoto.vercel.app/hu/about",
      lastModified: new Date(),
    },
    {
      url: "https://richardfoto.vercel.app/en/about",
      lastModified: new Date(),
    },
    {
      url: "https://richardfoto.vercel.app/hu/contact",
      lastModified: new Date(),
    },
    {
      url: "https://richardfoto.vercel.app/en/contact",
      lastModified: new Date(),
    },
    {
      url: "https://richardfoto.vercel.app/hu/booking",
      lastModified: new Date(),
    },
    {
      url: "https://richardfoto.vercel.app/en/booking",
      lastModified: new Date(),
    },
  ];
}
