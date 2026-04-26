// app/page.tsx
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { groq } from "next-sanity";
import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import FeaturedRotator from "./components/FeaturedRotator";

type LocaleParams = Promise<{ locale: string }>;

const aboutQuery = groq`*[_type == "about"][0]{ heroImage }`;

// CSAK A BEpipÁLTAK – ez a lényeg!
const featuredQuery = groq`*[_type == "gallery" && featured == true] 
  | order(_createdAt desc)[0...8]{
  _id,
  title,
  category,
  coverImage,
  "slugCurrent": slug.current
}`;

export default async function Home(props: { params: LocaleParams }) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "home" });

  const [about, featured] = await Promise.all([
    client.fetch(aboutQuery),
    client.fetch(featuredQuery),
  ]);

  const heroImageUrl = about?.heroImage
    ? urlFor(about.heroImage)
        .width(2000)
        .height(1200)
        .fit("crop")
        .crop("entropy")
        .quality(95)
        .url()
    : null;

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center">
        {heroImageUrl && (
          <Image
            src={heroImageUrl}
            alt="Richard Foto – Időtlen pillanatok Budapesten"
            fill
            className="object-cover"
            priority
            quality={95}
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90 md:via-black/60" />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase text-zinc-400 mb-6">
            BUDAPEST • SINCE 2015
          </p>
          <h1 className="text-6xl sm:text-7xl md:text-[96px] lg:text-[128px] font-serif leading-[0.92] tracking-[-0.04em] mb-8">
            IDŐTLEN
            <br />
            PILLANATOK
          </h1>
          <p className="text-xl md:text-3xl text-zinc-300 max-w-[620px] mx-auto mb-14 font-light tracking-tight px-4">
            Nem csak képeket készítek.
            <br />
            Történeteket örökítek meg.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={`/${locale}/gallery`}
              className="group inline-flex items-center justify-center border-2 border-white px-12 py-5 text-sm tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 w-full sm:w-auto"
            >
              GALÉRIA MEGTEKINTÉSE
            </Link>
            <Link
              href={`/${locale}/booking`}
              className="group inline-flex items-center justify-center bg-white text-black px-12 py-5 text-sm tracking-[0.2em] hover:bg-zinc-200 transition-all duration-300 w-full sm:w-auto"
            >
              IDŐPONTOT KÉREK
            </Link>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <div className="text-[10px] tracking-[0.3em] text-zinc-400">
            SCROLL TO BEGIN
          </div>
          <div className="animate-bounce text-white/60 text-3xl">↓</div>
        </div>
      </section>

      {/* KIVÁLASZTOTT PILLANATOK – CSAK A BEpipÁLTAK */}
      <section className="bg-white py-20 px-6 text-black">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.35em] uppercase text-zinc-500 mb-3">
              SELECTED MOMENTS
            </p>
            <h2 className="text-5xl md:text-6xl font-serif tracking-tight">
              Kiválasztott pillanatok
            </h2>
          </div>

          {featured.length > 0 ? (
            <FeaturedRotator featured={featured} locale={locale} />
          ) : (
            <p className="text-center text-zinc-400 py-20 text-lg">
              Még nincs kiemelt galéria.
              <br />
              Menj a Sanity Studio-ba és pipáld be néhány galériát a "Kiemelt a
              főoldalon?" mezőnél.
            </p>
          )}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-black py-28 px-6 text-center text-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-serif tracking-tighter mb-8">
            Készen állsz a saját történetedre?
          </h2>
          <Link
            href={`/${locale}/booking`}
            className="inline-block border-2 border-white px-16 py-5 text-sm tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300"
          >
            FOGLALÁS MOST
          </Link>
        </div>
      </section>
    </main>
  );
}
