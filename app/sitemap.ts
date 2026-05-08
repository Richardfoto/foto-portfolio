import type { MetadataRoute } from "next";
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { absoluteUrl, locales, localizedPath, type Locale } from "@/lib/site";
import { getActivePhotographyServices } from "@/lib/active-services";
import { getServiceSlug } from "@/lib/service-slugs";

type GallerySlug = {
  slug: string;
  _updatedAt?: string;
};

const staticRoutes = [
  "/",
  "/gallery",
  "/services",
  "/about",
  "/model",
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
    groq`*[
      _type == "gallery" &&
      defined(slug.current) &&
      (!defined(service->inactive) || service->inactive != true)
    ]{
      "slug": slug.current,
      _updatedAt
    }`,
  );
  const services = await getActivePhotographyServices();

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

  const serviceEntries = locales.flatMap((locale) =>
    services.map((service) => ({
      url: urlFor(locale, `/services/${getServiceSlug(service.id, locale)}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: service.featuredSession ? 0.72 : 0.7,
    })),
  );

  return [...staticEntries, ...galleryEntries, ...serviceEntries];
}
