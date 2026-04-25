import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";
import { groq } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type LocaleParams = Promise<{ locale: string }>;

type AboutDocument = {
  name: string;
  bio: string;
  experience?: number;
  email?: string;
  phone?: string;
  instagram?: string;
  facebook?: string;
  profileImage?: SanityImageSource;
};

const aboutQuery = groq`*[_type == "about"][0]{
  name,
  bio,
  experience,
  email,
  phone,
  instagram,
  facebook,
  profileImage
}`;

export async function generateMetadata(props: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AboutPage(props: { params: LocaleParams }) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "about" });
  const about = await client.fetch<AboutDocument>(aboutQuery);

  const profileImageUrl = about?.profileImage
    ? urlFor(about.profileImage).width(700).height(900).url()
    : null;

  return (
    <main className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="bg-zinc-900 text-white text-center py-32 px-4">
        <p className="text-xs tracking-[0.35em] uppercase text-zinc-400 mb-4">
          RICHARD VARGA
        </p>
        <h1 className="text-6xl md:text-7xl font-serif tracking-tighter">
          {t("title")}
        </h1>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Photo */}
          {profileImageUrl && (
            <div className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-xl">
              <Image
                src={profileImageUrl}
                alt={about.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Text */}
          <div className="pt-8 lg:pt-16">
            <h2 className="text-4xl font-serif mb-8">{about.name}</h2>

            {about.experience && (
              <p className="text-sm tracking-widest text-zinc-500 mb-8">
                {about.experience} ÉV TAPASZTALAT
              </p>
            )}

            <div className="prose prose-lg text-zinc-600 max-w-prose">
              {about.bio && (
                <div dangerouslySetInnerHTML={{ __html: about.bio }} />
              )}
            </div>

            {/* Contact Info */}
            <div className="mt-12 space-y-3 text-sm text-zinc-600">
              {about.email && <p>✉ {about.email}</p>}
              {about.phone && <p>✆ {about.phone}</p>}
              {about.instagram && (
                <a
                  href={about.instagram}
                  target="_blank"
                  className="block hover:text-black transition"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-zinc-950 py-24 px-4 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.35em] uppercase text-zinc-400 mb-4">
              ÉRTÉKEIM
            </p>
            <h2 className="text-5xl font-serif">Amire a munkám épül</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: locale === "hu" ? "Bizalom" : "Trust",
                text:
                  locale === "hu"
                    ? "A legjobb képek akkor születnek, amikor biztonságban érzed magad."
                    : "The strongest images happen when you feel safe and comfortable.",
              },
              {
                title: locale === "hu" ? "Őszinteség" : "Honesty",
                text:
                  locale === "hu"
                    ? "Nem erőltetett pózokat keresek, hanem azt, ami valóban rólad szól."
                    : "I don’t look for forced poses. I look for what genuinely feels like you.",
              },
              {
                title: locale === "hu" ? "Időtállóság" : "Timelessness",
                text:
                  locale === "hu"
                    ? "Olyan képekre törekszem, amelyek évek múlva is ugyanazzal az erővel hatnak."
                    : "I create photographs that still feel powerful years later.",
              },
            ].map((value, index) => (
              <div key={index} className="border border-white/10 p-10">
                <h3 className="text-2xl font-serif mb-6">{value.title}</h3>
                <p className="text-zinc-300 leading-relaxed">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing Quote */}
      <section className="max-w-4xl mx-auto px-4 py-24 text-center">
        <blockquote className="text-3xl md:text-4xl font-serif leading-tight text-zinc-900">
          „A célom nem az, hogy megmutassam, hogyan nézel ki.
          <br />
          Hanem az, hogy megmutassam, ki vagy egy adott pillanatban.”
        </blockquote>
        <p className="mt-10 text-sm tracking-widest text-zinc-500">
          — RICHARD VARGA
        </p>
      </section>

      {/* CTA */}
      <section className="bg-zinc-900 text-white py-20 text-center px-4">
        <h2 className="text-4xl font-serif mb-6">Dolgozzunk együtt?</h2>
        <p className="text-zinc-400 max-w-md mx-auto mb-10">
          Írj nekem, és beszéljük meg, milyen történetet szeretnénk közösen
          megörökíteni.
        </p>
        <Link
          href={`/${locale}/contact`}
          className="inline-block border border-white px-10 py-4 text-sm tracking-widest hover:bg-white hover:text-black transition-all"
        >
          Kapcsolatfelvétel
        </Link>
      </section>
    </main>
  );
}
