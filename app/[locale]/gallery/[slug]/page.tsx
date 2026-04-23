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
};

const galleryQuery = groq`*[_type == "gallery" && slug.current == $slug][0]{
  title,
  category,
  description,
  coverImage,
  images
}`;

export async function generateMetadata(props: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const gallery = await client.fetch<GalleryDetail | null>(galleryQuery, { slug });

  if (!gallery) {
    return {
      title: "Gallery",
    };
  }

  return {
    title: gallery.title,
    description: gallery.description ?? gallery.title,
  };
}

export default async function GalleryPage(props: { params: LocaleParams }) {
  const { locale, slug } = await props.params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  const gallery = await client.fetch<GalleryDetail | null>(galleryQuery, { slug });

  if (!gallery) {
    notFound();
  }

  const images = gallery.images?.length ? gallery.images : gallery.coverImage ? [gallery.coverImage] : [];

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-zinc-900 text-white text-center py-32 px-4">
        <p className="text-xs tracking-[0.35em] text-zinc-400 uppercase mb-4">
          {gallery.category}
        </p>
        <h1 className="text-5xl font-serif mb-4">{gallery.title}</h1>
        {gallery.description && (
          <p className="text-zinc-400 max-w-2xl mx-auto">{gallery.description}</p>
        )}
      </section>
      <section className="max-w-6xl mx-auto py-24 px-4">
        <Link
          href={`/${locale}/gallery`}
          className="inline-block mb-10 text-sm tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          {t("back")}
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="flex min-h-[22rem] items-center justify-center overflow-hidden bg-zinc-100 p-4 md:min-h-[28rem]"
            >
              <Image
                src={urlFor(image).width(1800).fit("max").url()}
                alt={`${gallery.title} ${index + 1}`}
                width={1800}
                height={2400}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="block max-h-[75vh] w-full object-contain"
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
