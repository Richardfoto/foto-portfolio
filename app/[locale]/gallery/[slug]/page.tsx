// app/gallery/[slug]/page.tsx
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";
import { groq } from "next-sanity";
import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

type LocaleParams = Promise<{ locale: string; slug: string }>;

type GalleryDetail = {
  title: string;
  category: string;
  description?: string;
  coverImage?: SanityImageSource;
  images?: SanityImageSource[];
  location?: string; // később Sanity-ban is hozzáadhatjuk
};

const galleryQuery = groq`*[_type == "gallery" && slug.current == $slug][0]{
  title,
  category,
  description,
  coverImage,
  images,
  location
}`;

export async function generateMetadata(props: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const gallery = await client.fetch<GalleryDetail | null>(galleryQuery, {
    slug,
  });

  if (!gallery) {
    return { title: "Gallery | Richard Foto" };
  }

  return {
    title: `${gallery.title} | Richard Foto`,
    description:
      gallery.description ??
      `Professzionális ${gallery.category.toLowerCase()} fotózás Budapesten – ${gallery.title}`,
  };
}

export default async function GalleryPage(props: { params: LocaleParams }) {
  const { locale, slug } = await props.params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  const gallery = await client.fetch<GalleryDetail | null>(galleryQuery, {
    slug,
  });

  if (!gallery) notFound();

  const images = gallery.images?.length
    ? gallery.images
    : gallery.coverImage
      ? [gallery.coverImage]
      : [];

  // JSON-LD Schema (ImageObject + GalleryPage)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: gallery.title,
    description: gallery.description,
    author: {
      "@type": "Person",
      name: "Richard Foto",
    },
    locationCreated: gallery.location
      ? { "@type": "Place", name: `${gallery.location}, Budapest` }
      : undefined,
    image: images.map((img, i) => ({
      "@type": "ImageObject",
      contentUrl: urlFor(img).width(2000).url(),
      name: `${gallery.title} ${i + 1}`,
      description: `${gallery.category} – ${gallery.location || "Budapest"}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">
        {/* Hero header */}
        <section className="bg-zinc-900 text-white text-center py-28 px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs tracking-[0.35em] text-zinc-400 uppercase mb-3">
              {gallery.category}
            </p>
            <h1 className="text-5xl md:text-6xl font-serif leading-tight mb-6">
              {gallery.title}
            </h1>
            {gallery.description && (
              <p className="text-zinc-300 text-lg max-w-2xl mx-auto leading-relaxed">
                {gallery.description}
              </p>
            )}
            {gallery.location && (
              <p className="text-sm text-zinc-400 mt-4">
                📍 {gallery.location}, Budapest
              </p>
            )}
          </div>
        </section>

        {/* Back button */}
        <div className="max-w-6xl mx-auto px-4 pt-10">
          <Link
            href={`/${locale}/gallery`}
            className="inline-flex items-center gap-2 text-sm tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors group"
          >
            ← {t("back")}
          </Link>
        </div>

        {/* Masonry Gallery */}
        <section className="max-w-6xl mx-auto py-12 px-4">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {images.map((image, index) => {
              const imageUrl = urlFor(image)
                .width(2000)
                .height(2800)
                .format("webp")
                .quality(85)
                .url();

              return (
                <div
                  key={index}
                  className="break-inside-avoid group relative overflow-hidden bg-zinc-100 cursor-pointer"
                >
                  <Image
                    src={imageUrl}
                    alt={`${gallery.title} – ${gallery.category} ${index + 1} | ${gallery.location || "Budapest"} | Richard Foto`}
                    width={2000}
                    height={2800}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="w-full h-auto transition-all duration-700 group-hover:scale-105"
                    loading={index === 0 ? "eager" : "lazy"}
                    priority={index === 0}
                  />
                  {/* Optional caption overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent h-24 opacity-0 group-hover:opacity-100 transition-all flex items-end p-4">
                    <p className="text-white text-xs">
                      {gallery.location || "Budapest"} • {index + 1}/
                      {images.length}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
