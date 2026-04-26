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
  location?: string;
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

  if (!gallery) return { title: "Gallery | Richard Foto" };

  return {
    title: `${gallery.title} | Richard Foto`,
    description:
      gallery.description ??
      `Professzionális ${gallery.category.toLowerCase()} fotózás Budapesten`,
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

  const getImageUrl = (image: SanityImageSource | undefined) => {
    if (!image) return null;
    try {
      return urlFor(image).width(1400).fit("max").quality(85).url();
    } catch {
      return null;
    }
  };

  return (
    <main className="min-h-screen bg-white">
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

      <div className="max-w-6xl mx-auto px-4 pt-10">
        <Link
          href={`/${locale}/gallery`}
          className="inline-flex items-center gap-2 text-sm tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          ← {t("back") || "Vissza a galériához"}
        </Link>
      </div>

      <section className="max-w-6xl mx-auto py-12 px-4">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {images.map((image, index) => {
            const imageUrl = getImageUrl(image);
            if (!imageUrl) return null;

            return (
              <div
                key={index}
                className="break-inside-avoid group relative overflow-hidden bg-zinc-100 rounded-3xl"
              >
                <Image
                  src={imageUrl}
                  alt={`${gallery.title} – ${gallery.category} ${index + 1}`}
                  width={1400}
                  height={2000}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="w-full h-auto object-contain transition-all duration-700 group-hover:scale-[1.02]"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-20 opacity-0 group-hover:opacity-100 transition-all flex items-end p-6">
                  <p className="text-white text-xs tracking-widest">
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
  );
}
