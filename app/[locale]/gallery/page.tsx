// app/gallery/page.tsx
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { getTranslations } from "next-intl/server";
import GalleryCard, { type GalleryCardProps } from "../components/GalleryCard";
import type { Metadata } from "next";

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
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "gallery" });

  return {
    title:
      locale === "hu"
        ? "Galéria | Richard Foto Budapest"
        : "Gallery | Richard Foto Budapest",
    description:
      t("description") ||
      "Professzionális emberek fotózása Budapesten – portré, esküvő, családi, üzleti",
  };
}

export default async function GalleryPage(props: { params: LocaleParams }) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "gallery" });

  const galleries = await client.fetch<GalleryCardProps[]>(galleriesQuery);

  return (
    <main className="min-h-screen bg-white pt-20">
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
