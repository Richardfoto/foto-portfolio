import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { groq } from "next-sanity";
import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import FeaturedRotator from "./components/FeaturedRotator"; // ← Fontos!

type LocaleParams = Promise<{ locale: string }>;

const aboutQuery = groq`*[_type == "about"][0]{ heroImage }`;
const featuredQuery = groq`*[_type == "gallery"] | order(_createdAt desc)[0...8]{
  _id,
  title,
  coverImage
}`;

export default async function Home(props: { params: LocaleParams }) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "home" });
  const [about, featured] = await Promise.all([
    client.fetch(aboutQuery),
    client.fetch(featuredQuery),
  ]);

  const heroImageUrl = about?.heroImage
    ? urlFor(about.heroImage).width(2000).height(1200).url()
    : null;

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center">
        {heroImageUrl && (
          <Image
            src={heroImageUrl}
            alt="Richard Foto"
            fill
            className="object-cover"
            priority
            quality={95}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <p className="text-xs tracking-[0.4em] uppercase text-zinc-400 mb-6">
            BUDAPEST • SINCE 2015
          </p>

          <h1 className="text-[88px] md:text-[128px] font-serif leading-[0.9] tracking-[-0.04em] mb-8">
            IDŐTLEN
            <br />
            PILLANATOK
          </h1>

          <p className="text-2xl md:text-3xl text-zinc-300 max-w-[620px] mx-auto mb-14 font-light tracking-tight">
            Nem csak képeket készítek.
            <br />
            Történeteket örökítek meg.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/gallery`}
              className="group inline-flex items-center justify-center border-2 border-white px-14 py-5 text-sm tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300"
            >
              GALÉRIA MEGTEKINTÉSE
            </Link>
            <Link
              href={`/${locale}/booking`}
              className="group inline-flex items-center justify-center bg-white text-black px-14 py-5 text-sm tracking-[0.2em] hover:bg-zinc-200 transition-all duration-300"
            >
              IDŐPONTOT KÉREK
            </Link>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <div className="text-[10px] tracking-[0.3em] text-zinc-400">
            SCROLL TO BEGIN
          </div>
          <div className="animate-bounce text-white/60 text-2xl">↓</div>
        </div>
      </section>

      {/* KIVÁLASZTOTT PILLANATOK - EGY NAGY KÉP + VÁLTÁS */}
      <section className="bg-white py-20 px-6 text-black">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.35em] uppercase text-zinc-500 mb-3">
              SELECTED MOMENTS
            </p>
            <h2 className="text-6xl font-serif tracking-tight">
              Kiválasztott pillanatok
            </h2>
          </div>

          <FeaturedRotator featured={featured} />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-black py-28 px-6 text-center text-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-6xl font-serif tracking-tighter mb-8">
            Készen állsz a saját történetedre?
          </h2>
          <Link
            href={`/${locale}/booking`}
            className="inline-block border-2 border-white px-16 py-5 text-sm tracking-[0.2em] hover:bg-white hover:text-black transition-all"
          >
            FOGLALÁS MOST
          </Link>
        </div>
      </section>
    </main>
  );
}
