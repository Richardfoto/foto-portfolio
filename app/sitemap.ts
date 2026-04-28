import type { MetadataRoute } from "next";
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { absoluteUrl, locales, localizedPath, type Locale } from "@/lib/site";

type GallerySlug = {
  slug: string;
  _updatedAt?: string;
};

const staticRoutes = [
  "/",
  "/gallery",
  "/services",
  "/about",
  "/contact",
  "/booking",
  "/adatvedelmi-nyilatkozat",
  "/aszf",
  "/cookie-politika",
];

function urlFor(locale: Locale, path: string) {
  return absoluteUrl(path === "/" ? `/${locale}` : localizedPath(locale, path));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const galleries = await client.fetch<GallerySlug[]>(
    groq`*[_type == "gallery" && defined(slug.current)]{
      "slug": slug.current,
      _updatedAt
    }`,
  );

  const staticEntries = locales.flatMap((locale) =>
    staticRoutes.map((path) => ({
      url: urlFor(locale, path),
      lastModified: now,
      changeFrequency:
        path === "/" || path === "/gallery" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : path === "/booking" ? 0.9 : 0.7,
    })),
  );

  const galleryEntries = locales.flatMap((locale) =>
    galleries.map((gallery) => ({
      url: urlFor(locale, `/gallery/${gallery.slug}`),
      lastModified: gallery._updatedAt ? new Date(gallery._updatedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  );

  return [...staticEntries, ...galleryEntries];
}
