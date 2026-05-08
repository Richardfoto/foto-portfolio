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
  serviceKeywords,
  serviceSchemaNodes,
  sharedFaqs,
} from "@/lib/photography-content";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { getActivePhotographyServices } from "@/lib/active-services";
import { memoryFirstCopy } from "@/lib/memory-first-copy";
import { getServiceSlug } from "@/lib/service-slugs";

type LocaleParams = Promise<{ locale: string }>;

type GalleryItem = {
  _id: string;
  serviceId?: string;
  coverImage?: SanityImageSource;
  slugCurrent?: string;
};

type ServiceMediaItem = {
  serviceId?: string;
  images?: SanityImageSource[];
};

type ServiceProcessCopy = {
  title: string;
  steps: string[];
  cta: string;
  galleryHint: string;
};

const galleryQuery = groq`*[
  _type == "gallery" &&
  (!defined(service->inactive) || service->inactive != true)
] | order(service->order asc, serviceOrder asc, featured desc, _createdAt desc)[0...50]{
  _id,
  "serviceId": service->serviceId,
  coverImage,
  "slugCurrent": slug.current
}`;

const serviceMediaQuery = groq`*[
  _type == "service" &&
  defined(serviceId) &&
  !(_id in path("drafts.**"))
]{
  serviceId,
  "images": serviceImages
}`;

const servicesCopy = {
  hu: {
    title: "Fotózási szolgáltatások Budapesten",
    description:
      "Történetmesélő kismama és újszülött, családi lifestyle, werk, esküvői, termék, rendezvény, kisállat és Dating Boost / Boudoir fotózás Budapesten.",
    eyebrow: "Richard Foto szolgáltatások",
    intro:
      "Minden fotózás célja ugyanaz: olyan képek készüljenek, amelyek évekkel később is visszahozzák azt, amit akkor éreztél. Az alábbi szolgáltatások közös alapja a természetes jelenlét, a tiszta képi világ és az átlátható folyamat.",
    railLabel: "Fotózási irányok",
    promiseTitle: "Nem csak képeket kapsz, hanem megőrizhető emléket.",
    promise:
      "A szolgáltatások különböző élethelyzetekhez készültek, de ugyanarra épülnek: figyelem, nyugalom, fény és olyan képanyag, amelyet később is jó érzés elővenni.",
    includedTitle: "A legtöbb fotózás tartalmazza",
    included: [
      "rövid előzetes egyeztetés és hangulati irány",
      "helyszín- és öltözékjavaslat, ha szükséges",
      "nyugodt, természetes vezetés a fotózás alatt",
      "több variáció, hogy az emlék teljesebb legyen",
      "gondosan válogatott és utómunkázott képek",
      "privát online galéria letöltési lehetőséggel",
      "alap webes és social felhasználás személyes projektekhez",
    ],
    pricingTitle: "Bevezető session árak",
    pricingLead:
      "2026-os bevezető árak, hogy könnyebb legyen elindulni egy örök emlék felé. A korábbi ajánlott árszintet most kedvezményes kezdőárral adom, pontosítva a cél, időtartam, helyszín és felhasználás alapján.",
    pricingBadge: "Bevezető ár",
    pricingOriginalLabel: "ajánlott ár",
    packages: [
      {
        name: "Basic",
        originalPrice: "120 EUR-tól",
        price: "100 EUR-tól",
        subtitle: "rövid, fókuszált kezdés",
        description:
          "Ha pár erős kép kell gyorsan: portré, dating, mini lifestyle vagy egy konkrét vizuális cél.",
        features: [
          "rövid előzetes egyeztetés",
          "1 fókuszált képi irány",
          "privát online galéria",
        ],
        cta: "Basic csomagot kérek",
      },
      {
        name: "Standard",
        originalPrice: "240 EUR-tól",
        price: "200 EUR-tól",
        subtitle: "a legtöbb történethez",
        description:
          "A legkiegyensúlyozottabb választás portréhoz, lifestyle-hoz, personal brandhez, kismama/újszülött vagy páros fotózáshoz.",
        features: [
          "részletesebb hangulati egyeztetés",
          "több variáció és finom vezetés",
          "gondosan válogatott, egységes sorozat",
        ],
        cta: "Standard csomagot kérek",
        featured: true,
      },
      {
        name: "Premium",
        originalPrice: "500 EUR-tól",
        price: "400 EUR-tól",
        subtitle: "teljes vizuális anyaghoz",
        description:
          "Több helyszín, több szett, content day, kampány, esemény vagy hosszabb, tudatosan épített képi történet.",
        features: [
          "több helyszín vagy több szett",
          "kampányhoz vagy tartalomnaphoz is alkalmas",
          "átfogóbb képi anyag webre és social felületre",
        ],
        cta: "Premium csomagot kérek",
      },
    ],
    feedbackTitle: "Fotózás után szívesen kérek tőled pár őszinte mondatot.",
    feedbackLead:
      "Ha jól érezted magad és a képek is közel kerültek hozzád, nagy segítség, ha megírod, milyen volt velem dolgozni. Nem kell hivatalos értékelésnek lennie, elég, ha a saját szavaiddal válaszolsz pár kérdésre.",
    feedbackQuestions: [
      "Miért választottál engem?",
      "Milyen volt maga a fotózás?",
      "Mit adott neked a végeredmény?",
    ],
    feedbackPermission:
      "Ha megengeded, a visszajelzésedet kitehetem a weboldalra a keresztneveddel vagy név nélkül. Ha ezt szívesen vállalod, csak jelezd előre.",
    flowTitle: "A megfelelő forma kiválasztása",
    flowItems: [
      "ha örök emléket szeretnél, lifestyle vagy családi irányból indulunk",
      "ha kommunikációhoz kell képanyag, werk vagy termékfotózás lesz a pontos út",
      "ha eseményed van, előre kijelöljük a megőrzendő kulcspillanatokat és az átadás menetét",
    ],
    cta: "Személyre szabott ajánlatot kérek",
    viewHomeSection: "Részletes történet a főoldalon",
  },
  en: {
    title: "Photography Services in Budapest",
    description:
      "Storytelling maternity and newborn, family lifestyle, werk, wedding, product, event, pet and Dating Boost / Boudoir photography in Budapest.",
    eyebrow: "Richard Foto services",
    intro:
      "Every session has the same aim: images that still bring back what you felt years later. The foundation is natural presence, clean visual language and a transparent process.",
    railLabel: "Photography directions",
    promiseTitle: "You receive more than images: you receive a lasting memory.",
    promise:
      "These services are built for different moments, but the foundation is the same: attention, calm guidance, light and images you will want to return to.",
    includedTitle: "Most sessions include",
    included: [
      "a short consultation and mood direction",
      "location and outfit guidance when needed",
      "calm, natural guidance during the session",
      "several variations so the memory feels complete",
      "carefully selected and edited images",
      "a private online gallery with download access",
      "basic web and social usage for personal projects",
    ],
    pricingTitle: "Introductory session rates",
    pricingLead:
      "Introductory 2026 rates to make it easier to begin with a lasting memory. The recommended rate is discounted for now, then refined around the goal, duration, location and usage.",
    pricingBadge: "Intro rate",
    pricingOriginalLabel: "recommended",
    packages: [
      {
        name: "Basic",
        originalPrice: "EUR 120+",
        price: "EUR 100+",
        subtitle: "a short focused start",
        description:
          "For a few strong images quickly: portrait, dating, mini lifestyle or one clear visual goal.",
        features: [
          "short pre-session consultation",
          "one focused visual direction",
          "private online gallery",
        ],
        cta: "Request Basic",
      },
      {
        name: "Standard",
        originalPrice: "EUR 240+",
        price: "EUR 200+",
        subtitle: "for most stories",
        description:
          "The balanced choice for portraits, lifestyle, personal brand, maternity/newborn or couples photography.",
        features: [
          "more detailed mood consultation",
          "several variations with calm guidance",
          "carefully selected, cohesive image story",
        ],
        cta: "Request Standard",
        featured: true,
      },
      {
        name: "Premium",
        originalPrice: "EUR 500+",
        price: "EUR 400+",
        subtitle: "for a complete visual set",
        description:
          "Multiple locations, several looks, content day, campaign, event or a longer intentional visual story.",
        features: [
          "multiple locations or looks",
          "strong fit for campaigns and content days",
          "broader visual set for web and social use",
        ],
        cta: "Request Premium",
      },
    ],
    feedbackTitle: "After the session, I am always grateful for a few honest words.",
    feedbackLead:
      "If the experience felt good and the images stayed with you, it helps a lot when you share what it was like to work together. It does not need to sound formal; your own words are more valuable.",
    feedbackQuestions: [
      "Why did you choose me?",
      "What did the session itself feel like?",
      "What did the final images give you?",
    ],
    feedbackPermission:
      "With your permission, I may share your feedback on the website with your first name or anonymously. If you are comfortable with that, just let me know in advance.",
    flowTitle: "Choosing the right format",
    flowItems: [
      "if you want a lasting memory, we begin with lifestyle or family photography",
      "if you need communication assets, werk or product photography is usually the right path",
      "if you have an event, we define the moments worth preserving and the delivery flow in advance",
    ],
    cta: "Request a tailored quote",
    viewHomeSection: "Detailed story on the homepage",
  },
} as const;

const serviceProcessDefaults: Record<Locale, ServiceProcessCopy> = {
  hu: {
    title: "Hogyan zajlik?",
    steps: [
      "Röviden átbeszéljük, milyen emléket vagy képi célt szeretnél.",
      "Kiválasztjuk a helyszínt, hangulatot és a számodra kényelmes irányt.",
      "Végig vezetlek, majd privát galériában kapod meg a kész képeket.",
    ],
    cta: "Megrendelem",
    galleryHint: "Kattints a képre a részletekhez",
  },
  en: {
    title: "How it works",
    steps: [
      "We briefly clarify the memory or visual goal you want to create.",
      "We choose the location, mood and a direction that feels comfortable for you.",
      "I guide you through the session, then deliver the images in a private gallery.",
    ],
    cta: "Book this",
    galleryHint: "Click the image for details",
  },
};

const serviceProcessOverrides: Partial<
  Record<string, Partial<Record<Locale, ServiceProcessCopy>>>
> = {
  "personal-brand-starter": {
    hu: {
      title: "Hogyan épül fel?",
      steps: [
        "Megnézzük, weboldalra, LinkedInre vagy bemutatkozó anyaghoz kell-e a képsorozat.",
        "Letisztítjuk a hangulatot, ruhát, helyszínt és a szakmai üzenetet.",
        "Vezetett fotózáson készülnek a márkaképek, majd privát galériában adom át őket.",
      ],
      cta: "Márkaképeket kérek",
      galleryHint: "Kattints a képre a personal brand részletekhez",
    },
    en: {
      title: "How it works",
      steps: [
        "We define whether the images are for your website, LinkedIn or introduction material.",
        "We refine the mood, outfit, location and professional message.",
        "The guided session creates your brand images, delivered in a private gallery.",
      ],
      cta: "Request brand images",
      galleryHint: "Click the image for personal brand details",
    },
  },
  "content-creator-day": {
    hu: {
      title: "Hogyan lesz belőle tartalom?",
      steps: [
        "Előre összerakjuk, milyen felületekre és milyen kampányhoz kell képanyag.",
        "Shotlist alapján haladunk: portré, részlet, werk, hangulat és webes felhasználás.",
        "Egy napból rendszerezett, több hétre elővehető képi anyagot kapsz.",
      ],
      cta: "Marketing kampány indítása",
      galleryHint: "Kattints a képre a content részletekhez",
    },
    en: {
      title: "How it becomes content",
      steps: [
        "We plan which platforms and campaign messages the images need to support.",
        "We follow a shot list: portraits, details, werk moments, mood and web usage.",
        "One day becomes an organised visual set you can use for weeks.",
      ],
      cta: "Start a marketing campaign",
      galleryHint: "Click the image for content details",
    },
  },
  maternity: {
    hu: {
      title: "Hogyan lesz nyugodt?",
      steps: [
        "Egyeztetjük, kismama, újszülött vagy összekapcsolt történet legyen-e.",
        "Hozzátok igazítjuk a tempót, helyszínt és azt, hogy mi komfortos.",
        "Türelmes fotózás után finom, időtálló képeket kapsz privát galériában.",
      ],
      cta: "Időpontot kérek",
      galleryHint: "Kattints a képre a kismama / újszülött galériához",
    },
    en: {
      title: "How it stays calm",
      steps: [
        "We decide whether it is maternity, newborn or a connected beginning story.",
        "The pace, location and comfort level are shaped around you.",
        "After a patient session, you receive soft, timeless images in a private gallery.",
      ],
      cta: "Request a date",
      galleryHint: "Click the image to open the maternity / newborn gallery",
    },
  },
  "boudoir-branding": {
    hu: {
      title: "Hogyan marad önazonos?",
      steps: [
        "Előre tisztázzuk a hangulatot, határokat és azt, milyen képet szeretnél magadról.",
        "Olyan ruhát, helyszínt és tempót választunk, amiben nem kell szerepelned.",
        "Finom vezetés mellett készülnek természetes, bizalomépítő portrék.",
      ],
      cta: "Dating Boostot kérek",
      galleryHint: "Kattints a képre a Dating Boost részletekhez",
    },
    en: {
      title: "How it stays authentic",
      steps: [
        "We clarify mood, boundaries and the image you want to have of yourself.",
        "We choose clothes, location and pace so you do not have to perform.",
        "Calm guidance creates natural, trust-building portraits.",
      ],
      cta: "Request Dating Boost",
      galleryHint: "Click the image for Dating Boost details",
    },
  },
};

function getServiceProcessCopy(serviceId: string, locale: Locale) {
  return serviceProcessOverrides[serviceId]?.[locale] ?? serviceProcessDefaults[locale];
}

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
        ? "Szolgáltatások | Lifestyle, werk és történetmesélő fotózás Budapest"
        : "Services | Lifestyle, Werk and Storytelling Photography Budapest",
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
  const builder = urlFor(image)
    .ignoreImageParams()
    .width(width)
    .format("webp")
    .quality(88);
  if (!height) return builder.url();

  return builder.height(height).fit("max").url();
}

export default async function ServicesPage(props: { params: LocaleParams }) {
  const { locale: rawLocale } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";
  const copy = servicesCopy[locale];
  const [activeServices, gallery, serviceMedia] = await Promise.all([
    getActivePhotographyServices(),
    client.fetch<GalleryItem[]>(galleryQuery),
    client.fetch<ServiceMediaItem[]>(serviceMediaQuery),
  ]);
  const serviceLookupIds = (service: (typeof activeServices)[number]) => [
    service.imageServiceId ?? service.id,
    ...(service.relatedServiceIds ?? []),
  ];
  const serviceImagesFor = (serviceIds: string[]) =>
    serviceIds.flatMap(
      (serviceId) =>
        serviceMedia.find((item) => item.serviceId === serviceId)?.images?.filter(Boolean) ??
        [],
    );
  const serviceGalleryFor = (serviceIds: string[]) =>
    gallery.find(
      (item) => item.serviceId && serviceIds.includes(item.serviceId) && item.slugCurrent,
    )?.slugCurrent;
  const heroImages = activeServices
    .flatMap((service) => serviceImagesFor(serviceLookupIds(service)))
    .filter(Boolean)
    .slice(0, 5) as SanityImageSource[];

  const graph = schemaGraph([
    baseOrganizationSchema(locale),
    photographerSchema(locale),
    ...serviceSchemaNodes(locale, activeServices),
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

      <section className="bg-neutral-950 px-5 pb-10 pt-28 text-white md:px-8 md:pb-14 md:pt-36">
        <div className="reveal-up mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div>
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

          {heroImages.length > 0 && (
            <div className="grid min-h-[360px] grid-cols-6 grid-rows-6 gap-3 md:min-h-[470px]">
              {heroImages.map((image, index) => {
                const imageUrl = getSanityImageUrl(image, 900, 1100);
                const layout =
                  index === 0
                    ? "col-span-4 row-span-6"
                    : index === 1
                      ? "col-span-2 row-span-3"
                      : index === 2
                        ? "col-span-2 row-span-3"
                        : index === 3
                          ? "col-span-3 row-span-2 hidden md:block"
                          : "col-span-3 row-span-2 hidden md:block";

                if (!imageUrl) return null;

                return (
                  <figure
                    key={`${imageUrl}-${index}`}
                    className={`group relative overflow-hidden bg-white/8 ${layout}`}
                  >
                    <Image
                      src={imageUrl}
                      alt={
                        locale === "hu"
                          ? "Richard Foto szolgáltatás vizuális részlet"
                          : "Richard Foto service visual detail"
                      }
                      fill
                      priority={index === 0}
                      sizes={
                        index === 0
                          ? "(max-width: 1024px) 70vw, 520px"
                          : "(max-width: 1024px) 30vw, 260px"
                      }
                      className="image-soft-motion object-contain p-2"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                  </figure>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section
        aria-label={copy.railLabel}
        className="overflow-hidden border-y border-neutral-200 bg-white py-5"
      >
        <div className="marquee-track flex gap-4 pr-4">
          {[...activeServices, ...activeServices].map((service, index) => (
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

      <section className="bg-[#f7f4ee] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl space-y-8">
          {activeServices.map((service, index) => {
            const serviceIds = serviceLookupIds(service);
            const images = serviceImagesFor(serviceIds).slice(0, 3);
            const gallerySlug = serviceGalleryFor(serviceIds);
            const galleryHref = gallerySlug
              ? `/${locale}/gallery/${gallerySlug}`
              : `/${locale}/services/${getServiceSlug(service.id, locale)}`;
            const linkLabel = gallerySlug
              ? locale === "hu"
                ? `${service.title.hu} galéria megnyitása`
                : `Open ${service.title.en} gallery`
              : locale === "hu"
                ? `${service.title.hu} részletek megnyitása`
                : `Open ${service.title.en} details`;
            const processCopy = getServiceProcessCopy(service.id, locale);
            const isEven = index % 2 === 0;
            const primaryImage = images[0];
            const primaryImageUrl = getSanityImageUrl(primaryImage, 1500, 1800);
            const imagePanel = (
              <>
                {primaryImageUrl ? (
                  <figure className="absolute inset-0 bg-neutral-950 p-3">
                    <Image
                      src={primaryImageUrl}
                      alt={service.alt[locale]}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="image-soft-motion object-contain p-3 transition duration-700 group-hover:scale-[1.025] group-hover:opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-black/10" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                      <p className="text-xs uppercase tracking-[0.24em] text-white/60">
                        {String(index + 1).padStart(2, "0")} /{" "}
                        {activeServices.length}
                      </p>
                      <p className="mt-3 max-w-md font-serif text-3xl leading-tight tracking-tight md:text-4xl">
                        {service.shortTitle[locale]}
                      </p>
                      <p className="mt-4 text-xs uppercase tracking-[0.18em] text-white/62 underline-offset-8 transition group-hover:underline">
                        {processCopy.galleryHint}
                      </p>
                    </div>
                  </figure>
                ) : (
                  <div className="flex h-full items-end bg-neutral-900 p-8 text-sm leading-6 text-white/60">
                    {service.captions[locale][0]}
                  </div>
                )}
              </>
            );

            return (
              <article
                id={service.anchor}
                key={service.id}
                className={`reveal-on-scroll grid overflow-hidden border border-neutral-950/10 bg-white shadow-[0_24px_80px_rgba(20,20,20,0.08)] lg:min-h-[560px] lg:grid-cols-[1.05fr_0.95fr] ${
                  isEven ? "" : "lg:grid-flow-col"
                }`}
              >
                <Link
                  href={galleryHref}
                  aria-label={linkLabel}
                  className={`group relative block min-h-[420px] overflow-hidden bg-neutral-950 outline-none transition-opacity hover:opacity-95 focus-visible:ring-4 focus-visible:ring-[#b79d66] lg:min-h-full ${
                    isEven ? "" : "lg:col-start-2"
                  }`}
                >
                  {imagePanel}
                </Link>

                <div className="flex flex-col justify-between gap-10 p-6 md:p-10 lg:p-12">
                  <div>
                    <p className="mb-5 text-xs uppercase tracking-[0.25em] text-neutral-400">
                      {String(index + 1).padStart(2, "0")} / {activeServices.length}
                    </p>
                    <h2 className="max-w-xl font-serif text-4xl leading-tight tracking-tight md:text-5xl">
                      <Link
                        href={`/${locale}/services/${getServiceSlug(service.id, locale)}`}
                        className="transition-colors hover:text-neutral-600"
                      >
                        {service.title[locale]}
                      </Link>
                    </h2>
                    <p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-600">
                      {memoryFirstCopy(service.description[locale], locale)}
                    </p>
                  </div>

                  <div className="space-y-8">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {service.captions[locale].map((caption) => (
                        <p
                          key={caption}
                          className="border-t border-neutral-200 pt-4 text-sm leading-6 text-neutral-500"
                        >
                          {memoryFirstCopy(caption, locale)}
                        </p>
                      ))}
                    </div>

                    <div className="border border-neutral-200 bg-[#fbfaf7] p-5 md:p-6">
                      <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">
                        {processCopy.title}
                      </p>
                      <ol className="mt-5 space-y-4">
                        {processCopy.steps.map((step, stepIndex) => (
                          <li
                            key={step}
                            className="grid grid-cols-[2rem_1fr] gap-3 text-sm leading-6 text-neutral-600"
                          >
                            <span className="font-serif text-xl leading-6 text-neutral-950">
                              {stepIndex + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="flex flex-col gap-3 text-sm uppercase tracking-[0.16em] sm:flex-row">
                      <Link
                        href={`/${locale}/booking?service=${service.id}#booking-date`}
                        className="bg-neutral-950 px-6 py-4 text-center text-white transition-colors hover:bg-neutral-800"
                      >
                        {processCopy.cta}
                      </Link>
                    </div>
                  </div>
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
          <div className="md:pt-1">
            <h2 className="font-serif text-4xl tracking-tight">
              {copy.pricingTitle}
            </h2>
            <p className="mt-6 text-base leading-8 text-neutral-600">
              {copy.pricingLead}
            </p>
            <Link
              href={`/${locale}/booking`}
              className="mt-8 inline-flex bg-neutral-950 px-8 py-4 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-neutral-800"
            >
              {copy.cta}
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl gap-5 lg:grid-cols-3">
          {copy.packages.map((item) => {
            const isFeatured = "featured" in item && item.featured === true;

            return (
              <article
                key={item.name}
                className={`relative flex min-h-[360px] flex-col justify-between border p-6 shadow-[0_24px_80px_rgba(20,20,20,0.07)] md:p-8 ${
                  isFeatured
                    ? "border-[#b79d66] bg-[#fff8e8] text-neutral-950 shadow-[0_30px_90px_rgba(97,74,32,0.18)] lg:-mt-5 lg:min-h-[400px]"
                    : "border-neutral-200 bg-white text-neutral-950"
                }`}
              >
                <div>
                  {isFeatured && (
                    <p className="mb-5 inline-flex border border-[#b79d66]/50 bg-white/55 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#7a6233]">
                      {locale === "hu" ? "Ajánlott" : "Recommended"}
                    </p>
                  )}
                  <p
                    className={`mb-5 text-xs uppercase tracking-[0.24em] ${
                      isFeatured ? "text-[#7a6233]" : "text-neutral-400"
                    }`}
                  >
                    {item.subtitle}
                  </p>
                  <h3 className="font-serif text-4xl leading-tight tracking-tight">
                    {item.name}
                  </h3>
                  <p
                    className={`mt-6 text-sm leading-7 ${
                      isFeatured ? "text-neutral-700" : "text-neutral-600"
                    }`}
                  >
                    {item.description}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {item.features.map((feature) => (
                      <li
                        key={feature}
                        className={`border-t pt-3 text-sm leading-6 ${
                          isFeatured
                            ? "border-[#b79d66]/35 text-neutral-700"
                            : "border-neutral-200 text-neutral-600"
                        }`}
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-10">
                  <p
                    className={`text-[10px] uppercase tracking-[0.2em] ${
                      isFeatured ? "text-[#8b743f]" : "text-neutral-400"
                    }`}
                  >
                    {copy.pricingOriginalLabel}:{" "}
                    <span className="line-through">{item.originalPrice}</span>
                  </p>
                  <p className="mt-3 font-serif text-4xl tracking-tight">
                    {item.price}
                  </p>
                  <p
                    className={`mt-3 text-xs uppercase tracking-[0.18em] ${
                      isFeatured ? "text-[#7a6233]" : "text-neutral-500"
                    }`}
                  >
                    {copy.pricingBadge}
                  </p>
                  <Link
                    href={`/${locale}/booking`}
                    className={`mt-7 inline-flex w-full justify-center px-5 py-4 text-center text-xs uppercase tracking-[0.18em] transition-colors ${
                      isFeatured
                        ? "bg-neutral-950 text-white hover:bg-neutral-800"
                        : "border border-neutral-950/20 text-neutral-700 hover:border-neutral-950 hover:text-neutral-950"
                    }`}
                  >
                    {item.cta}
                  </Link>
                </div>
              </article>
            );
          })}
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

      <section className="border-y border-neutral-200 bg-white px-6 py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-neutral-500">
              {locale === "hu" ? "Visszajelzés" : "Feedback"}
            </p>
            <h2 className="font-serif text-4xl leading-tight tracking-tight text-neutral-950 md:text-5xl">
              {copy.feedbackTitle}
            </h2>
          </div>
          <div className="space-y-7">
            <p className="max-w-2xl text-lg leading-8 text-neutral-700">
              {copy.feedbackLead}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {copy.feedbackQuestions.map((question, index) => (
                <p
                  key={question}
                  className="border-l border-neutral-300 pl-4 text-sm leading-6 text-neutral-800"
                >
                  <span className="mb-3 block font-serif text-2xl text-neutral-950">
                    0{index + 1}
                  </span>
                  {question}
                </p>
              ))}
            </div>
            <p className="max-w-2xl border-t border-neutral-200 pt-5 text-sm leading-7 text-neutral-500">
              {copy.feedbackPermission}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
