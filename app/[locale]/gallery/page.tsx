import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { getTranslations } from "next-intl/server";
import GalleryCard, { type GalleryCardProps } from "../components/GalleryCard";

type LocaleParams = Promise<{ locale: string }>;

const galleriesQuery = groq`*[_type == "gallery"] | order(_createdAt desc){
  _id,
  title,
  category,
  coverImage,
  "slugCurrent": slug.current
}`;

export default async function GalleryPage(props: { params: LocaleParams }) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "gallery" });

  // 🔥 TÍPUSOS FETCH — nincs több any
  const galleries = await client.fetch<GalleryCardProps[]>(galleriesQuery);

  return (
    <main className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.35em] uppercase text-zinc-500 mb-3">
            OUR WORK
          </p>
          <h1 className="text-6xl font-serif tracking-tight">{t("title")}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleries.map((gallery) => (
            <GalleryCard key={gallery._id} {...gallery} locale={locale} />
          ))}
        </div>
      </div>
    </main>
  );
}
