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
  headerEyebrowHu?: string;
  headerEyebrowEn?: string;
  headerTitleHu?: string;
  headerTitleEn?: string;
  headerIntroHu?: string;
  headerIntroEn?: string;
  headerImage?: SanityImageSource;
  bio?: string;
  experience?: number;
  email?: string;
  phone?: string;
  instagram?: string;
  facebook?: string;
  profileImage?: SanityImageSource;
};

const aboutQuery = groq`coalesce(
  *[_id == "about"][0],
  *[_type == "about" && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]
){
  name,
  headerEyebrowHu,
  headerEyebrowEn,
  headerTitleHu,
  headerTitleEn,
  headerIntroHu,
  headerIntroEn,
  headerImage,
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
      "Nem kell tudnod pózolni. A fotózás akkor működik jól, amikor biztonságban érzed magad, és nem kell folyamatosan arra gondolnod, hogyan nézel ki.",
    fallbackBio:
      "Budapesten dolgozom történetmesélő és lifestyle szemlélettel. Embereket, családokat, párokat, alkotókat és márkákat fotózok úgy, hogy a képek természetesek, használhatóak és hosszú távon is vállalhatóak maradjanak.",
    valuesTitle: "Amire a munkám épül",
    poseTitle: "Nem kell tudnod, mit csinálj a kamera előtt.",
    poseText:
      "A fotózás közben végig vezetlek: adok irányt, figyelek a fényre, a helyzetre és arra, hogy a képek valódi emlékké álljanak össze. Neked nem szerepelned kell, hanem megérkezned.",
    howTitle: "Hogyan vezetlek végig?",
    howSteps: [
      "Először tisztázzuk, milyen érzést és felhasználást keresel.",
      "A fotózáson finoman irányítalak, de nem erőltetek rád pózokat.",
      "A végén egy egységes, válogatott emléket kapsz privát galériában.",
    ],
    quote:
      "A célom nem az, hogy megmutassam, hogyan nézel ki. Hanem az, hogy örökre emlékezz arra, ki voltál abban a pillanatban.",
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
      "You do not need to know how to pose. A session works best when you feel safe and no longer have to think constantly about how you look.",
    fallbackBio:
      "I work in Budapest with a storytelling, lifestyle and portrait approach. I photograph people, families, couples, creators and brands in a way that keeps the images natural, useful and timeless.",
    valuesTitle: "What my work is built on",
    poseTitle: "You do not need to know what to do in front of the camera.",
    poseText:
      "I guide you throughout the session: I give direction, watch the light, the situation and how the images can become a real memory. You do not need to perform; you only need to arrive.",
    howTitle: "How I guide the session",
    howSteps: [
      "We first clarify the feeling and practical use you need from the images.",
      "During the session I guide gently without forcing poses onto you.",
      "Afterwards you receive a cohesive lasting memory in a private gallery.",
    ],
    quote:
      "My aim is not to show how you look. It is to help you remember, forever, who you were in that moment.",
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

function textOrFallback(value: string | undefined, fallback: string) {
  return value?.trim() || fallback;
}

export default async function AboutPage(props: { params: LocaleParams }) {
  const { locale: rawLocale } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";
  const copy = aboutCopy[locale];
  const about = await client.fetch<AboutDocument | null>(aboutQuery);

  const name = about?.name ?? site.owner;
  const headerEyebrow = textOrFallback(
    locale === "hu" ? about?.headerEyebrowHu : about?.headerEyebrowEn,
    copy.eyebrow,
  );
  const headerTitle = textOrFallback(
    locale === "hu" ? about?.headerTitleHu : about?.headerTitleEn,
    copy.title,
  );
  const headerIntro = textOrFallback(
    locale === "hu" ? about?.headerIntroHu : about?.headerIntroEn,
    copy.intro,
  );
  const bioParagraphs = paragraphs(about?.bio);
  const headerImageUrl = about?.headerImage
    ? urlFor(about.headerImage)
        .ignoreImageParams()
        .width(2200)
        .height(1200)
        .fit("max")
        .format("webp")
        .quality(88)
        .url()
    : null;
  const profileImageUrl = about?.profileImage
    ? urlFor(about.profileImage)
        .ignoreImageParams()
        .width(900)
        .height(1100)
        .fit("max")
        .format("webp")
        .quality(88)
        .url()
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

      <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-neutral-950 px-6 text-[#fff8e8]">
        {headerImageUrl && (
          <Image
            src={headerImageUrl}
            alt={
              locale === "hu"
                ? "Richard Foto rólam oldal header kép"
                : "Richard Foto about page header image"
            }
            fill
            priority
            sizes="100vw"
            className="image-soft-motion object-cover opacity-68"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/78 via-neutral-950/28 to-neutral-950/18" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/68 via-neutral-950/22 to-transparent" />
        <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-6xl px-0 pb-14 pt-24 md:pb-20 md:pt-28">
          <div className="self-start">
            <p className="mb-5 text-xs uppercase tracking-[0.35em] text-[#fff8e8]/55">
              {headerEyebrow}
            </p>
            <h1 className="font-serif text-5xl font-normal leading-[0.92] tracking-[-0.045em] text-[#fff8e8] md:text-7xl">
              {headerTitle}
            </h1>
          </div>
          <div className="self-end">
            <p className="max-w-3xl border-l border-[#fff8e8]/35 pl-5 text-lg leading-8 text-[#fff8e8]/74">
              {headerIntro}
            </p>
          </div>
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
              className="image-soft-motion h-auto w-full object-contain"
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

      <section className="bg-[#fbfaf7] px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-neutral-400">
              {locale === "hu" ? "Vezetett élmény" : "Guided experience"}
            </p>
            <h2 className="font-serif text-4xl leading-tight tracking-tight md:text-6xl">
              {copy.poseTitle}
            </h2>
          </div>
          <div className="self-end">
            <p className="text-lg leading-8 text-neutral-600">{copy.poseText}</p>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {copy.howSteps.map((step, index) => (
                <p
                  key={step}
                  className="border-t border-neutral-200 pt-5 text-sm leading-7 text-neutral-600"
                >
                  <span className="mb-3 block text-xs uppercase tracking-[0.2em] text-neutral-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {step}
                </p>
              ))}
            </div>
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
                title: locale === "hu" ? "Örök emlék" : "Lasting memory",
                text:
                  locale === "hu"
                    ? "Olyan képekre törekszem, amelyek évek múlva is visszahozzák azt, amit akkor éreztél."
                    : "I create photographs that can bring back what you felt years later.",
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
          href={`/${locale}/booking`}
          className="mt-10 inline-flex bg-white px-8 py-4 text-sm uppercase tracking-[0.2em] text-neutral-950 transition-colors hover:bg-neutral-200"
        >
          {copy.cta}
        </Link>
      </section>
    </main>
  );
}
