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
        <h1 className="text-5xl md:text-7xl font-serif mb-6">
          {t("hero_title")}
        </h1>
        <p className="text-xl text-zinc-400 max-w-md">{t("hero_subtitle")}</p>
        <Link
          href={`/${locale}/gallery`}
          className="mt-10 border border-white px-8 py-3 text-sm tracking-widest hover:bg-white hover:text-black transition-all"
        >
          {t("gallery_button").toUpperCase()}
        </Link>
      </section>
      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="max-w-3xl">
          <p className="text-xs tracking-[0.35em] uppercase text-zinc-600 mb-5">
            {t("intro_eyebrow")}
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-zinc-900 mb-6">
            {t("intro_title")}
          </h2>
          <p className="text-lg text-zinc-600 leading-relaxed">
            {t("intro_body")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {[
            {
              title: t("intro_who_title"),
              body: t("intro_who_body"),
            },
            {
              title: t("intro_where_title"),
              body: t("intro_where_body"),
            },
            {
              title: t("intro_what_title"),
              body: t("intro_what_body"),
            },
          ].map((item) => (
            <div
              key={item.title}
              className="border border-zinc-200 p-8 bg-zinc-50/60"
            >
              <h3 className="text-2xl font-serif text-zinc-900 mb-4">
                {item.title}
              </h3>
              <p className="text-zinc-600 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
        <Link
          href={`/${locale}/about`}
          className="inline-block mt-12 border border-zinc-900 px-8 py-3 text-sm tracking-widest hover:bg-zinc-900 hover:text-white transition-colors"
        >
          {t("intro_cta").toUpperCase()}
        </Link>
      </section>
      <section id="galeria" className="max-w-6xl mx-auto py-24 px-4">
        <h2 className="text-3xl font-serif text-center mb-16">
          {galleryT("title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
            <Link
              key={gallery._id}
              href={`/${locale}/gallery/${gallery.slugCurrent}`}
            >
              <div className="group overflow-hidden cursor-pointer">
                {gallery.coverImage && (
                  <div className="flex h-[26rem] items-center justify-center overflow-hidden bg-zinc-100 p-4 md:h-[28rem]">
                    <Image
                      src={urlFor(gallery.coverImage)
                        .width(900)
                        .fit("max")
                        .url()}
                      alt={gallery.title}
                      width={900}
                      height={1200}
                      className="max-h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                )}
                <div className="pt-4">
                  <p className="text-xs text-zinc-600 tracking-widest uppercase">
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
