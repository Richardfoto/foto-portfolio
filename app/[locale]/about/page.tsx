import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";
import { groq } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  JsonLd,
  baseOrganizationSchema,
  breadcrumbSchema,
  createMetadata,
  faqSchema,
  imageObjectSchema,
  isLocale,
  photographerSchema,
  schemaGraph,
  site,
  type Locale,
} from "@/lib/site";
import { serviceSchemaNodes, sharedFaqs } from "@/lib/photography-content";

type LocaleParams = Promise<{ locale: string }>;

type AboutDocument = {
  name?: string;
  bio?: string;
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

const aboutCopy = {
  hu: {
    title: "Rólam",
    metaTitle: "Rólam | Richard Foto történetmesélő fotós Budapest",
    description:
      "Ismerd meg Richard Vargát, a Richard Foto budapesti történetmesélő fotósát. Természetes lifestyle, werk, portré, családi és esküvői fotózás őszinte pillanatokkal.",
    eyebrow: "Richard Varga",
    intro:
      "A fotózás számomra nem látványos instrukciók sorozata, hanem figyelem. Akkor készülnek erős képek, amikor az ember biztonságban érzi magát, és nem kell folyamatosan arra gondolnia, hogyan néz ki.",
    fallbackBio:
      "Budapesten dolgozom történetmesélő, lifestyle és portré szemlélettel. Embereket, családokat, párokat, alkotókat és márkákat fotózok úgy, hogy a képek természetesek, használhatóak és hosszú távon is vállalhatóak maradjanak.",
    valuesTitle: "Amire a munkám épül",
    quote:
      "A célom nem az, hogy megmutassam, hogyan nézel ki. Hanem az, hogy megmutassam, ki vagy egy adott pillanatban.",
    ctaTitle: "Dolgozzunk együtt?",
    ctaText:
      "Írj nekem, és beszéljük meg, milyen történetet szeretnél megőrizni.",
    cta: "Kapcsolatfelvétel",
  },
  en: {
    title: "About",
    metaTitle: "About | Richard Foto Storytelling Photographer Budapest",
    description:
      "Meet Richard Varga, the Budapest storytelling photographer behind Richard Foto. Natural lifestyle, werk, portrait, family and wedding photography with honest moments.",
    eyebrow: "Richard Varga",
    intro:
      "Photography, for me, is not a series of loud instructions. It is attention. Strong images happen when a person feels safe and no longer has to think constantly about how they look.",
    fallbackBio:
      "I work in Budapest with a storytelling, lifestyle and portrait approach. I photograph people, families, couples, creators and brands in a way that keeps the images natural, useful and timeless.",
    valuesTitle: "What my work is built on",
    quote:
      "My aim is not to show how you look. It is to show who you are in a particular moment.",
    ctaTitle: "Shall we work together?",
    ctaText: "Write to me and let us talk about the story you want to preserve.",
    cta: "Get in touch",
  },
} as const;

export async function generateMetadata(props: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale: rawLocale } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";
  const copy = aboutCopy[locale];

  return createMetadata({
    locale,
    path: "/about",
    title: copy.metaTitle,
    description: copy.description,
    keywords:
      locale === "hu"
        ? [
            "budapesti fotós",
            "történetmesélő fotós Budapest",
            "lifestyle fotózás Budapest",
            "Richard Foto",
          ]
        : [
            "Budapest photographer",
            "storytelling photographer Budapest",
            "lifestyle photography Budapest",
            "Richard Foto",
          ],
  });
}

function paragraphs(value?: string) {
  return (value ?? "")
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default async function AboutPage(props: { params: LocaleParams }) {
  const { locale: rawLocale } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";
  const copy = aboutCopy[locale];
  const about = await client.fetch<AboutDocument | null>(aboutQuery);

  const name = about?.name ?? site.owner;
  const bioParagraphs = paragraphs(about?.bio);
  const profileImageUrl = about?.profileImage
    ? urlFor(about.profileImage).width(900).height(1100).format("webp").quality(88).url()
    : null;

  const graph = schemaGraph([
    baseOrganizationSchema(locale),
    photographerSchema(locale),
    ...serviceSchemaNodes(locale),
    imageObjectSchema({
      locale,
      path: "/about",
      caption:
        locale === "hu"
          ? "Richard Foto budapesti történetmesélő fotós portré"
          : "Richard Foto Budapest storytelling photographer portrait",
      contentUrl: profileImageUrl ?? undefined,
    }),
    breadcrumbSchema(locale, [
      { name: site.name, path: "/" },
      { name: copy.title, path: "/about" },
    ]),
    faqSchema(sharedFaqs[locale]),
  ]);

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <JsonLd data={graph} />

      <section className="bg-neutral-950 px-6 py-28 text-white md:py-36">
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 text-xs uppercase tracking-[0.32em] text-white/45">
            {copy.eyebrow}
          </p>
          <h1 className="font-serif text-5xl leading-tight tracking-tight md:text-7xl">
            {copy.title}
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-white/68">
            {copy.intro}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-14 px-6 py-24 md:grid-cols-[0.9fr_1.1fr] md:py-32">
        <div>
          {profileImageUrl ? (
            <Image
              src={profileImageUrl}
              alt={
                locale === "hu"
                  ? `${name}, budapesti történetmesélő fotós`
                  : `${name}, Budapest storytelling photographer`
              }
              width={900}
              height={1100}
              sizes="(max-width: 768px) 100vw, 45vw"
              className="h-auto w-full object-cover"
              priority
            />
          ) : (
            <div className="min-h-[520px] bg-neutral-100" aria-hidden="true" />
          )}
        </div>

        <div className="self-center">
          <h2 className="font-serif text-4xl tracking-tight md:text-5xl">
            {name}
          </h2>
          <p className="mt-4 text-sm uppercase tracking-[0.24em] text-neutral-400">
            {about?.experience
              ? `${about.experience} ${
                  locale === "hu" ? "év tapasztalat" : "years of experience"
                }`
              : locale === "hu"
                ? "Budapest • történetmesélő fotózás"
                : "Budapest • storytelling photography"}
          </p>

          <div className="mt-10 space-y-6 text-lg leading-8 text-neutral-600">
            {(bioParagraphs.length ? bioParagraphs : [copy.fallbackBio]).map(
              (paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ),
            )}
          </div>

          <div className="mt-10 space-y-3 text-sm text-neutral-600">
            <p>
              <a href={`mailto:${about?.email ?? site.email}`} className="hover:text-neutral-950">
                {about?.email ?? site.email}
              </a>
            </p>
            <p>
              <a href={site.phoneHref} className="hover:text-neutral-950">
                {about?.phone ?? site.phone}
              </a>
            </p>
            {about?.instagram && (
              <p>
                <a
                  href={about.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-neutral-950"
                >
                  Instagram
                </a>
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-neutral-50 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-4xl tracking-tight md:text-6xl">
            {copy.valuesTitle}
          </h2>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
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
                    : "I do not look for forced poses. I look for what genuinely feels like you.",
              },
              {
                title: locale === "hu" ? "Időtállóság" : "Timelessness",
                text:
                  locale === "hu"
                    ? "Olyan képekre törekszem, amelyek évek múlva is ugyanazzal az erővel hatnak."
                    : "I create photographs that still feel powerful years later.",
              },
            ].map((value) => (
              <article key={value.title} className="border-t border-neutral-200 pt-6">
                <h3 className="font-serif text-2xl">{value.title}</h3>
                <p className="mt-4 text-sm leading-7 text-neutral-600">
                  {value.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
        <blockquote className="font-serif text-3xl leading-tight tracking-tight md:text-5xl">
          &ldquo;{copy.quote}&rdquo;
        </blockquote>
        <p className="mt-8 text-xs uppercase tracking-[0.28em] text-neutral-400">
          {name}
        </p>
      </section>

      <section className="bg-neutral-950 px-6 py-24 text-center text-white">
        <h2 className="font-serif text-4xl tracking-tight md:text-5xl">
          {copy.ctaTitle}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/65">
          {copy.ctaText}
        </p>
        <Link
          href={`/${locale}/contact`}
          className="mt-10 inline-flex bg-white px-8 py-4 text-sm uppercase tracking-[0.2em] text-neutral-950 transition-colors hover:bg-neutral-200"
        >
          {copy.cta}
        </Link>
      </section>
    </main>
  );
}
