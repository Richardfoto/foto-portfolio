// app/gallery/page.tsx
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { getTranslations } from "next-intl/server";
import GalleryCard, { type GalleryCardProps } from "../components/GalleryCard";
import type { Metadata } from "next";
import {
  JsonLd,
  baseOrganizationSchema,
  breadcrumbSchema,
  createMetadata,
  faqSchema,
  imageObjectSchema,
  isLocale,
  photographerSchema,
  schemaGraph,
  site,
  type Locale,
} from "@/lib/site";
import { serviceSchemaNodes, sharedFaqs } from "@/lib/photography-content";

type LocaleParams = Promise<{ locale: string }>;

const galleriesQuery = groq`*[_type == "gallery"] | order(_createdAt desc){
  _id,
  title,
  category,
  coverImage,
  "slugCurrent": slug.current
}`;

export async function generateMetadata(props: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale: rawLocale } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";

  return createMetadata({
    locale,
    path: "/gallery",
    title:
      locale === "hu"
        ? "Galéria | Richard Foto Budapest"
        : "Gallery | Richard Foto Budapest",
    description:
      locale === "hu"
        ? "Richard Foto galéria: természetes lifestyle, portré, családi, werk, esküvői és történetmesélő fotózás Budapesten."
        : "Richard Foto gallery: natural lifestyle, portrait, family, werk, wedding and storytelling photography in Budapest.",
    keywords:
      locale === "hu"
        ? [
            "fotó galéria Budapest",
            "lifestyle fotózás Budapest",
            "történetmesélő fotózás Budapest",
          ]
        : [
            "photography gallery Budapest",
            "lifestyle photography Budapest",
            "storytelling photography Budapest",
          ],
  });
}

export default async function GalleryPage(props: { params: LocaleParams }) {
  const { locale: rawLocale } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";
  const t = await getTranslations({ locale, namespace: "gallery" });

  const galleries = await client.fetch<GalleryCardProps[]>(galleriesQuery);
  const graph = schemaGraph([
    baseOrganizationSchema(locale),
    photographerSchema(locale),
    ...serviceSchemaNodes(locale),
    imageObjectSchema({
      locale,
      path: "/gallery",
      caption:
        locale === "hu"
          ? "Richard Foto galéria természetes budapesti fotózásokkal"
          : "Richard Foto gallery with natural Budapest photo sessions",
    }),
    breadcrumbSchema(locale, [
      { name: site.name, path: "/" },
      { name: t("title"), path: "/gallery" },
    ]),
    faqSchema(sharedFaqs[locale]),
  ]);

  return (
    <main className="min-h-screen bg-white pt-20">
      <JsonLd data={graph} />
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.35em] uppercase text-zinc-500 mb-3">
            OUR WORK
          </p>
          <h1 className="text-6xl md:text-7xl font-serif tracking-tight text-zinc-900">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-zinc-600 max-w-2xl mx-auto">
            {t("subtitle") || "Időtlen pillanatok, amiket örökre megőrzünk"}
          </p>
        </div>

        {/* Galéria grid – a javított GalleryCard-dal */}
        {galleries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {galleries.map((gallery) => (
              <GalleryCard key={gallery._id} {...gallery} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-zinc-400">
            Még nincsenek feltöltve galériák.
          </div>
        )}
      </div>
    </main>
  );
}
