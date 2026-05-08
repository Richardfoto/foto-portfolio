import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { SanityImageSource } from "@sanity/image-url";
import { groq } from "next-sanity";
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
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

type LocaleParams = Promise<{ locale: string }>;

type HomeSessions = {
  modelApplicationImage?: SanityImageSource;
};

const homeSessionsQuery = groq`coalesce(
  *[_id == "homeSessions"][0],
  *[_type == "homeSessions" && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]
){
  modelApplicationImage
}`;

const modelCopy = {
  hu: {
    title: "Jelentkezz modellnek",
    description:
      "Vintage modellfotózás Budapesten Richard Fotóval: modern hightech munka és 1960-as évekbeli objektív különleges, időutazós rajzolattal.",
    eyebrow: "Vintage casting",
    heroTitle: "Igazi időutazás egy 1960-as lencsével.",
    intro:
      "Olyan modelleket, arcokat és karaktereket keresek, akikkel közösen kipróbálhatok egy különleges vintage fotózási irányt. A modern digitális technika találkozik egy régi objektív egyedi rajzával: lágyabb átmenetek, másfajta mélység, apró optikai tökéletlenségek és olyan hangulat, amit a túl steril hightech képek ritkán adnak vissza.",
    whyTitle: "Miért keresek modelleket?",
    whyText:
      "Szeretném ebből a sorozatból a maximumot kihozni, mert a legjobb képeket publikálnám a honlapon és a portfóliómban. Ezért nem csak gyors tesztfotózásról van szó: közösen építünk hangulatot, ruhát, fényt és karaktert.",
    moodTitle: "Milyen hangulatra számíts?",
    moodItems: [
      "vintage, filmes hatás digitális biztonsággal",
      "1960-as évekbeli lencse különleges rajzolattal",
      "portré, lifestyle és editorial jellegű képek",
      "nyugodt, vezetett fotózás, ahol nem kell profinak lenned",
    ],
    whoTitle: "Kinek való?",
    whoText:
      "Nem csak tapasztalt modelleket keresek. Ha érdekes karaktered, erős kisugárzásod, jó stílusérzéked vagy egyszerűen kíváncsiságod van, már lehet, hogy pont jó vagy ehhez a sorozathoz.",
    note:
      "A jelentkezés után egyeztetünk a részletekről. A publikálás csak előzetes megbeszélés és hozzájárulás alapján történik.",
    cta: "Jelentkezem modellnek",
    secondaryCta: "Megnézem a galériát",
    tileLabel: "Kedvezményes",
    tileTitle: "Vintage Fotózás",
    tileCta: "Jelentkezem modellnek",
    tileAlt: "Kedvezményes vintage fotózás modell jelentkezés Richard Foto Budapest",
  },
  en: {
    title: "Apply as a model",
    description:
      "Vintage model session in Budapest with Richard Foto: modern high-tech workflow meets a 1960s lens with a rare, time-travel character.",
    eyebrow: "Vintage casting",
    heroTitle: "A real time trip through a 1960s lens.",
    intro:
      "I am looking for models, faces and characters for a special vintage photo direction. Modern digital technique meets the unique rendering of an old lens: softer transitions, a different sense of depth, tiny optical imperfections and a mood that overly sterile high-tech images rarely keep.",
    whyTitle: "Why I am looking for models",
    whyText:
      "I want to push this series as far as possible, because the strongest images may be published on my website and in my portfolio. This is not just a quick test shoot: we build mood, styling, light and character together.",
    moodTitle: "What kind of mood is it?",
    moodItems: [
      "vintage film-like character with digital reliability",
      "a 1960s lens with a distinctive rendering",
      "portrait, lifestyle and editorial-style images",
      "a calm guided session; you do not need to be a professional model",
    ],
    whoTitle: "Who is it for?",
    whoText:
      "I am not only looking for experienced models. If you have an interesting presence, strong character, a good sense of style or simple curiosity, you may be right for this series.",
    note:
      "After applying, we discuss the details. Publication only happens after prior discussion and consent.",
    cta: "Apply as a model",
    secondaryCta: "View gallery",
    tileLabel: "Discounted",
    tileTitle: "Vintage Session",
    tileCta: "Apply as a model",
    tileAlt: "Discounted vintage model session application Richard Foto Budapest",
  },
} as const;

function getSanityImageUrl(image: SanityImageSource | undefined) {
  if (!image) return null;
  return urlFor(image)
    .ignoreImageParams()
    .width(1400)
    .height(1500)
    .fit("max")
    .format("webp")
    .quality(88)
    .url();
}

export async function generateMetadata(props: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale: rawLocale } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";
  const copy = modelCopy[locale];

  return createMetadata({
    locale,
    path: "/model",
    title:
      locale === "hu"
        ? "Jelentkezz modellnek | Vintage fotózás Budapest"
        : "Apply as a Model | Vintage Photo Session Budapest",
    description: copy.description,
    keywords:
      locale === "hu"
        ? ["modell jelentkezés Budapest", "vintage fotózás", "modell fotózás Budapest"]
        : ["model casting Budapest", "vintage photo session", "model photography Budapest"],
  });
}

export default async function ModelPage(props: { params: LocaleParams }) {
  const { locale: rawLocale } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";
  const copy = modelCopy[locale];
  const homeSessions = await client.fetch<HomeSessions | null>(homeSessionsQuery);
  const tileImageUrl = getSanityImageUrl(homeSessions?.modelApplicationImage);
  const subject =
    locale === "hu"
      ? "Jelentkezés vintage modellfotózásra"
      : "Application for vintage model session";
  const body =
    locale === "hu"
      ? "Szia Richard,%0A%0ASzeretnék jelentkezni a vintage modellfotózásra.%0A%0ANév:%0AInstagram / portfólió:%0ARöviden rólam:%0AElérhetőség:%0A"
      : "Hi Richard,%0A%0AI would like to apply for the vintage model session.%0A%0AName:%0AInstagram / portfolio:%0AShort intro:%0AContact:%0A";
  const mailHref = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${body}`;

  const graph = schemaGraph([
    baseOrganizationSchema(locale),
    photographerSchema(locale),
    ...serviceSchemaNodes(locale),
    imageObjectSchema({
      locale,
      path: "/model",
      caption:
        locale === "hu"
          ? "Vintage modellfotózás felhívás Richard Foto Budapest"
          : "Vintage model session casting Richard Foto Budapest",
    }),
    breadcrumbSchema(locale, [
      { name: site.name, path: "/" },
      { name: copy.title, path: "/model" },
    ]),
    faqSchema(sharedFaqs[locale]),
  ]);

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-neutral-950">
      <JsonLd data={graph} />

      <section className="bg-neutral-950 px-6 pb-20 pt-32 text-white md:pb-28 md:pt-40">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <p className="mb-6 text-xs uppercase tracking-[0.34em] text-white/45">
              {copy.eyebrow}
            </p>
            <h1 className="font-serif text-5xl leading-tight tracking-tight md:text-7xl">
              {copy.heroTitle}
            </h1>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-white/70">
            {copy.intro}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <article className="group reveal-on-scroll overflow-hidden bg-neutral-950 text-white shadow-[0_24px_70px_rgba(20,20,20,0.14)]">
          <div className="relative aspect-[4/5] md:aspect-[16/9]">
            {tileImageUrl ? (
              <Image
                src={tileImageUrl}
                alt={copy.tileAlt}
                fill
                sizes="(max-width: 768px) 100vw, 1152px"
                className="image-soft-motion object-contain p-2 opacity-80"
              />
            ) : (
              <div className="absolute inset-0 bg-neutral-900" aria-hidden="true" />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/82 via-black/18 to-transparent" />
            <div className="absolute inset-x-0 top-0 p-6 md:p-8">
              <p className="max-w-md text-xs uppercase leading-5 tracking-[0.24em] text-white/65">
                {copy.tileLabel}
              </p>
              <h2 className="mt-4 max-w-xl font-serif text-3xl leading-tight tracking-tight md:text-5xl">
                {copy.tileTitle}
              </h2>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <a
                href={mailHref}
                className="inline-flex border border-white/60 px-5 py-3 text-xs uppercase tracking-[0.18em] text-white transition-colors hover:bg-white hover:text-neutral-950"
              >
                {copy.tileCta}
              </a>
            </div>
          </div>
        </article>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[0.85fr_1.15fr] md:py-28">
        <div>
          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-neutral-400">
            {locale === "hu" ? "Felhívás" : "Open call"}
          </p>
          <h2 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">
            {copy.whyTitle}
          </h2>
        </div>
        <div className="space-y-8 text-lg leading-8 text-neutral-650">
          <p>{copy.whyText}</p>
          <p>{copy.whoText}</p>
        </div>
      </section>

      <section className="bg-white px-6 py-20 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <h2 className="font-serif text-4xl tracking-tight">
            {copy.moodTitle}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {copy.moodItems.map((item) => (
              <p
                key={item}
                className="border-t border-neutral-200 pt-5 text-sm leading-7 text-neutral-600"
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mx-auto max-w-2xl text-base leading-8 text-neutral-600">
            {copy.note}
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={mailHref}
              className="bg-neutral-950 px-8 py-4 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-neutral-800"
            >
              {copy.cta}
            </a>
            <Link
              href={`/${locale}/gallery`}
              className="border border-neutral-300 px-8 py-4 text-sm uppercase tracking-[0.2em] text-neutral-700 transition-colors hover:border-neutral-950 hover:text-neutral-950"
            >
              {copy.secondaryCta}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
