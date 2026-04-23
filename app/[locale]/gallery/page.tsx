import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";
import { groq } from "next-sanity";
import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

type LocaleParams = Promise<{ locale: string }>;

type GalleryCard = {
  _id: string;
  title: string;
  category: string;
  description?: string;
  coverImage?: SanityImageSource;
  slugCurrent: string;
};

export async function generateMetadata(props: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "gallery" });

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

const galleriesQuery = groq`*[_type == "gallery"] | order(_createdAt desc) {
  _id,
  title,
  category,
  description,
  coverImage,
  "slugCurrent": slug.current
}`;

export default async function GalleryPage(props: { params: LocaleParams }) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  const galleries = await client.fetch<GalleryCard[]>(galleriesQuery);

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-zinc-900 text-white text-center py-32 px-4">
        <h1 className="text-5xl font-serif mb-4">{t("title")}</h1>
        <p className="text-zinc-400 max-w-md mx-auto">{t("subtitle")}</p>
      </section>
      <section className="max-w-6xl mx-auto py-24 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleries.map((gallery) => (
            <Link
              key={gallery._id}
              href={`/${locale}/gallery/${gallery.slugCurrent}`}
            >
              <div className="group overflow-hidden cursor-pointer">
                {gallery.coverImage && (
                  <div className="overflow-hidden bg-zinc-100">
                    <Image
                      src={urlFor(gallery.coverImage)
                        .width(600)
                        .height(400)
                        .url()}
                      alt={gallery.title}
                      width={600}
                      height={400}
                      className="w-full h-72 object-contain group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}
                <div className="pt-4">
                  <p className="text-xs text-zinc-400 tracking-widest uppercase">
                    {gallery.category}
                  </p>
                  <h3 className="text-xl font-serif mt-1">{gallery.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
