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
import {
  photographyServices,
  serviceKeywords,
  serviceSchemaNodes,
  sharedFaqs,
} from "@/lib/photography-content";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

type LocaleParams = Promise<{ locale: string }>;

type GalleryItem = {
  _id: string;
  title: string;
  category?: string;
  coverImage?: SanityImageSource;
};

const galleryQuery = groq`*[_type == "gallery"] | order(featured desc, _createdAt desc)[0...16]{
  _id,
  title,
  category,
  coverImage
}`;

const servicesCopy = {
  hu: {
    title: "Fotózási szolgáltatások Budapesten",
    description:
      "Történetmesélő újszülött, kismama, családi lifestyle, werk, üzleti portré, esküvői, termék, rendezvény, kisállat és boudoir fotózás Budapesten.",
    eyebrow: "Richard Foto szolgáltatások",
    intro:
      "Minden fotózás más tempót kér. Van, ahol csend és türelem kell, máshol gyors reakció, pontos kommunikáció vagy intim bizalom. Az alábbi szolgáltatások közös alapja ugyanaz: természetes pillanatok, letisztult képi világ és átlátható folyamat.",
    railLabel: "Fotózási fókuszok",
    promiseTitle: "Egy vizuális nyelv, tíz különböző ritmus.",
    promise:
      "A szolgáltatások nem különálló stílusok, hanem ugyanannak a szemléletnek a különböző helyzetei. Csend, figyelem, fény, történet és könnyen használható képanyag.",
    includedTitle: "A legtöbb fotózás tartalmazza",
    included: [
      "rövid előzetes egyeztetés és hangulati irány",
      "helyszín- és öltözékjavaslat, ha szükséges",
      "nyugodt, természetes vezetés a fotózás alatt",
      "gondosan válogatott és utómunkázott képek",
      "privát online galéria letöltési lehetőséggel",
    ],
    pricingTitle: "Árak és csomagok",
    pricing:
      "A kisebb portré és lifestyle sorozatok jellemzően 65 000 Ft-tól indulnak. Üzleti, esküvői, rendezvény és termékfotózás esetén személyre szabott ajánlatot adok a cél, időtartam, helyszín és felhasználás alapján.",
    flowTitle: "A megfelelő forma kiválasztása",
    flowItems: [
      "ha emléket őriznél, lifestyle vagy családi irányból indulunk",
      "ha kommunikációhoz kell képanyag, werk, portré vagy termékfotózás lesz a pontos út",
      "ha eseményed van, előre kijelöljük a kulcspillanatokat és az átadási tempót",
    ],
    cta: "Személyre szabott ajánlatot kérek",
    viewHomeSection: "Részletes történet a főoldalon",
  },
  en: {
    title: "Photography Services in Budapest",
    description:
      "Storytelling newborn, maternity, family lifestyle, werk, business portrait, wedding, product, event, pet and boudoir photography in Budapest.",
    eyebrow: "Richard Foto services",
    intro:
      "Every session needs a different rhythm. Some require quiet patience, others quick reactions, precise communication or intimate trust. The foundation is the same: natural moments, clean visual language and a transparent process.",
    railLabel: "Photography focuses",
    promiseTitle: "One visual language, ten different rhythms.",
    promise:
      "These services are not separate styles; they are different situations for the same way of seeing. Quiet, attention, light, story and image material that is easy to use.",
    includedTitle: "Most sessions include",
    included: [
      "a short consultation and mood direction",
      "location and outfit guidance when needed",
      "calm, natural guidance during the session",
      "carefully selected and edited images",
      "a private online gallery with download access",
    ],
    pricingTitle: "Pricing and packages",
    pricing:
      "Smaller portrait and lifestyle sessions usually start from EUR 180. Business, wedding, event and product photography are quoted individually based on goal, duration, location and usage.",
    flowTitle: "Choosing the right format",
    flowItems: [
      "if you want to preserve a memory, we begin with lifestyle or family photography",
      "if you need communication assets, werk, portrait or product photography is usually the right path",
      "if you have an event, we define the key moments and delivery rhythm in advance",
    ],
    cta: "Request a tailored quote",
    viewHomeSection: "Detailed story on the homepage",
  },
} as const;

export async function generateMetadata(props: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale: rawLocale } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";
  const copy = servicesCopy[locale];

  return createMetadata({
    locale,
    path: "/services",
    title:
      locale === "hu"
        ? "Szolgáltatások | Lifestyle, werk és portré fotózás Budapest"
        : "Services | Lifestyle, Werk and Portrait Photography Budapest",
    description: copy.description,
    keywords: serviceKeywords(locale),
  });
}

function getSanityImageUrl(
  image: SanityImageSource | undefined,
  width: number,
  height?: number,
) {
  if (!image) return null;
  const builder = urlFor(image).width(width).format("webp").quality(88);
  return height ? builder.height(height).fit("crop").url() : builder.url();
}

export default async function ServicesPage(props: { params: LocaleParams }) {
  const { locale: rawLocale } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";
  const copy = servicesCopy[locale];
  const gallery = await client.fetch<GalleryItem[]>(galleryQuery);
  const galleryImages = (gallery ?? []).filter((item) => item.coverImage);

  const graph = schemaGraph([
    baseOrganizationSchema(locale),
    photographerSchema(locale),
    ...serviceSchemaNodes(locale),
    imageObjectSchema({
      locale,
      path: "/services",
      caption:
        locale === "hu"
          ? "Richard Foto fotózási szolgáltatások Budapesten"
          : "Richard Foto photography services in Budapest",
    }),
    breadcrumbSchema(locale, [
      { name: site.name, path: "/" },
      { name: locale === "hu" ? "Szolgáltatások" : "Services", path: "/services" },
    ]),
    faqSchema(sharedFaqs[locale]),
  ]);

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <JsonLd data={graph} />

      <section className="bg-neutral-950 px-6 py-28 text-white md:py-36">
        <div className="reveal-up mx-auto max-w-5xl">
          <p className="mb-6 text-xs uppercase tracking-[0.32em] text-white/45">
            {copy.eyebrow}
          </p>
          <h1 className="max-w-4xl font-serif text-5xl leading-tight tracking-tight md:text-7xl">
            {copy.title}
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-white/68">
            {copy.intro}
          </p>
        </div>
      </section>

      <section
        aria-label={copy.railLabel}
        className="overflow-hidden border-y border-neutral-200 bg-white py-5"
      >
        <div className="marquee-track flex gap-4 pr-4">
          {[...photographyServices, ...photographyServices].map((service, index) => (
            <a
              key={`${service.id}-${index}`}
              href={`#${service.anchor}`}
              className="whitespace-nowrap border border-neutral-200 px-5 py-3 text-xs uppercase tracking-[0.18em] text-neutral-500 transition-colors hover:border-neutral-950 hover:text-neutral-950"
            >
              {service.shortTitle[locale]}
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[0.9fr_1.1fr] md:py-28">
        <div className="reveal-on-scroll">
          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-neutral-400">
            {locale === "hu" ? "Közös alap" : "Shared foundation"}
          </p>
          <h2 className="font-serif text-4xl leading-tight tracking-tight md:text-6xl">
            {copy.promiseTitle}
          </h2>
        </div>
        <p className="reveal-on-scroll self-end text-lg leading-8 text-neutral-600">
          {copy.promise}
        </p>
      </section>

      <section className="bg-neutral-50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl space-y-16">
          {photographyServices.map((service, index) => {
            const image = galleryImages[index]?.coverImage;
            const imageUrl = getSanityImageUrl(image, 900, 1080);
            const isEven = index % 2 === 0;

            return (
              <article
                id={service.anchor}
                key={service.id}
                className="reveal-on-scroll grid gap-8 border-t border-neutral-200 pt-12 md:grid-cols-[0.78fr_1.22fr]"
              >
                <div className={isEven ? "" : "md:order-2"}>
                  <p className="mb-5 text-xs uppercase tracking-[0.25em] text-neutral-400">
                    {String(index + 1).padStart(2, "0")} / 10
                  </p>
                  <h2 className="font-serif text-3xl leading-tight tracking-tight md:text-5xl">
                    {service.title[locale]}
                  </h2>
                  <div className="mt-7 flex flex-col gap-3 text-sm uppercase tracking-[0.16em] sm:flex-row">
                    <Link
                      href={`/${locale}/booking?service=${service.id}`}
                      className="text-neutral-950 underline-offset-8 hover:underline"
                    >
                      {service.cta[locale]}
                    </Link>
                    <Link
                      href={`/${locale}/#${service.anchor}`}
                      className="text-neutral-500 underline-offset-8 hover:text-neutral-950 hover:underline"
                    >
                      {copy.viewHomeSection}
                    </Link>
                  </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr]">
                  <div>
                    <p className="text-lg leading-8 text-neutral-600">
                      {service.description[locale]}
                    </p>
                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      {service.captions[locale].map((caption) => (
                        <p
                          key={caption}
                          className="border-t border-neutral-200 pt-4 text-sm leading-6 text-neutral-500"
                        >
                          {caption}
                        </p>
                      ))}
                    </div>
                  </div>

                  {imageUrl ? (
                    <figure className="group overflow-hidden bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                      <Image
                        src={imageUrl}
                        alt={service.alt[locale]}
                        width={900}
                        height={1080}
                        sizes="(max-width: 1024px) 100vw, 340px"
                        className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                      />
                    </figure>
                  ) : (
                    <div className="flex min-h-64 items-end bg-white p-6 text-sm leading-6 text-neutral-400">
                      {service.captions[locale][0]}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-4xl tracking-tight">
              {copy.includedTitle}
            </h2>
            <ul className="mt-8 space-y-4 text-neutral-600">
              {copy.included.map((item) => (
                <li key={item} className="border-t border-neutral-200 pt-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-4xl tracking-tight">
              {copy.pricingTitle}
            </h2>
            <p className="mt-8 text-lg leading-8 text-neutral-600">
              {copy.pricing}
            </p>
            <Link
              href={`/${locale}/booking`}
              className="mt-9 inline-flex bg-neutral-950 px-8 py-4 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-neutral-800"
            >
              {copy.cta}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#ece7df] px-6 py-20 md:py-28">
        <div className="reveal-on-scroll mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <h2 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">
            {copy.flowTitle}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {copy.flowItems.map((item) => (
              <p
                key={item}
                className="story-line relative border-t border-neutral-950/15 pt-5 text-sm leading-7 text-neutral-700"
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
