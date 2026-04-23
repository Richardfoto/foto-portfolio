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

const galleriesQuery = groq`*[_type == "gallery"]{
  _id,
  title,
  category,
  description,
  coverImage,
  "slugCurrent": slug.current
}`;

export async function generateMetadata(props: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "home" });

  return {
    title:
      locale === "hu"
        ? "Richard Foto – Professzionális fotózás Budapest"
        : "Richard Foto – Professional Photography Budapest",
    description: t("hero_subtitle"),
    openGraph: {
      title: "Richard Foto",
      description: t("hero_subtitle"),
      url: `https://richardfoto.vercel.app/${locale}`,
      siteName: "Richard Foto",
      locale: locale === "hu" ? "hu_HU" : "en_US",
      type: "website",
    },
  };
}

export default async function Home(props: { params: LocaleParams }) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "home" });
  const galleryT = await getTranslations({ locale, namespace: "gallery" });
  const galleries = await client.fetch<GalleryCard[]>(galleriesQuery);

  return (
    <main className="min-h-screen bg-white">
      <section className="flex flex-col items-center justify-center h-screen bg-zinc-900 text-white text-center px-4">
        <h1 className="text-5xl md:text-7xl font-serif mb-6">{t("hero_title")}</h1>
        <p className="text-xl text-zinc-400 max-w-md">{t("hero_subtitle")}</p>
        <Link
          href={`/${locale}/gallery`}
          className="mt-10 border border-white px-8 py-3 text-sm tracking-widest hover:bg-white hover:text-black transition-all"
        >
          {t("gallery_button").toUpperCase()}
        </Link>
      </section>
      <section id="galeria" className="max-w-6xl mx-auto py-24 px-4">
        <h2 className="text-3xl font-serif text-center mb-16">{galleryT("title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      className="w-full h-64 object-contain group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}
                <div className="pt-4">
                  <p className="text-xs text-zinc-400 tracking-widest uppercase">
                    {gallery.category}
                  </p>
                  <h3 className="text-lg font-serif mt-1">{gallery.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
