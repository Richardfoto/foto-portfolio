import type { Metadata } from "next";
import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import { groq } from "next-sanity";
import BookingForm from "./BookingForm";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
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
  serviceSchemaNodes,
  sharedFaqs,
} from "@/lib/photography-content";
import { getActivePhotographyServices } from "@/lib/active-services";

type LocaleParams = Promise<{ locale: string }>;
type BookingSearchParams = Promise<{
  service?: string | string[];
}>;

type BookingSettingsDocument = {
  eyebrowHu?: string;
  eyebrowEn?: string;
  titleHu?: string;
  titleEn?: string;
  introHu?: string;
  introEn?: string;
  headerImage?: SanityImageSource;
};

const bookingSettingsQuery = groq`coalesce(
  *[_id == "bookingSettings"][0],
  *[_type == "bookingSettings" && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]
){
  eyebrowHu,
  eyebrowEn,
  titleHu,
  titleEn,
  introHu,
  introEn,
  headerImage
}`;

const bookingCopy = {
  hu: {
    title: "Kezdjük el a közös projektet!",
    description:
      "Foglalj lifestyle, werk, családi, kismama és újszülött, esküvői, termék vagy rendezvény fotózást Budapesten Richard Fotóval.",
    eyebrow: "Forgatás egyeztetése",
    intro:
      "Válaszd ki a csomagot és a dátumot, aztán egyeztessünk időpontot.",
    flowTitle: "A foglalás menete 5 lépésben",
    flowLead:
      "Ez még nem végleges szerződés vagy automatikus foglalás, hanem egy tiszta érdeklődés. Te jelzed az irányt, én visszaírok az elérhető időpontokról és a pontos keretekről.",
    flowCards: [
      {
        title: "Szolgáltatás",
        text: "Válaszd ki, milyen fotózási irány érdekel.",
      },
      {
        title: "Csomag",
        text: "A Standard alapból be van állítva, csak akkor módosítsd, ha mást szeretnél.",
      },
      {
        title: "Dátum",
        text: "Adj meg egy preferált napot. Ez még egyeztethető.",
      },
      {
        title: "Megjegyzés",
        text: "Írj pár szót a célról, helyszínről vagy határidőről.",
      },
      {
        title: "Elérhetőség",
        text: "Add meg, hová válaszolhatok, majd küldd el az érdeklődést.",
      },
    ],
    selectedTitle: "Kiválasztott irány",
    selectedFallback: "Még nincs kiválasztva szolgáltatás",
    selectedFallbackText:
      "Válassz egy irányt fent, vagy hagyd üresen és az űrlapban kézzel add meg.",
    homeGroup: "Kiemelt fotózási irányok",
    servicesGroup: "Szolgáltatások",
    giftGroup: "Ajándék",
    giftVoucher: "Ajándékutalvány",
    homeOptions: [
      { _id: "personal-brand-starter", title: "Personal Brand Starter" },
      { _id: "lifestyle-story-session", title: "Lifestyle Story Session" },
      { _id: "content-creator-day", title: "Content Creator Day" },
      { _id: "boudoir-branding", title: "Dating Boost / Boudoir" },
      { _id: "model-application", title: "Kedvezményes Vintage Fotózás" },
    ],
    processTitle: "Mi történik a foglalás után?",
    steps: [
      "Megkapom az érdeklődésedet emailben.",
      "Visszaírok az elérhető időpontokkal.",
      "Pontosítjuk a szolgáltatást, helyszínt és hangulatot.",
      "Véglegesítjük az időpontot és a kereteket.",
      "A fotózás után privát online galériában kapod meg a képeket.",
    ],
    sideTitle: "Nem kell kész brief.",
    sideText:
      "Elég egy érzés, egy dátum vagy egy alkalom. Ha bizonytalan vagy, az üzenet alapján segítek eldönteni, melyik fotózási forma lesz a legjobb.",
    formEyebrow: "2-3 perc",
    formTitle: "Csak pár kattintásra vagyunk. Érdeklődj.",
    formLead:
      "A küldés után az érdeklődés közvetlenül megérkezik hozzám emailben. Átnézem, mire készülsz, és általában 1-2 munkanapon belül visszajelzek az időpontokról és a következő lépésekről.",
    trustNote:
      "Nem kell kész brief: elég a szolgáltatás, a csomag és egy körülbelüli dátum. A részleteket együtt pontosítjuk.",
    bottomCtaEyebrow: "Direkt kapcsolat",
    bottomCtaTitle: "Ha inkább egyszerűen írnál, küldj emailt.",
    bottomCtaText:
      "Írhatsz közvetlenül is, de az űrlap segít abban, hogy az első válaszomban már konkrétabb időpontot és irányt tudjak adni.",
    bottomCta: "Email írása Richardnak",
  },
  en: {
    title: "Let us start the project together.",
    description:
      "Book lifestyle, werk, family, maternity and newborn, wedding, product or event photography in Budapest with Richard Foto.",
    eyebrow: "Plan a shoot",
    intro:
      "Choose the package and preferred date, then let us find a time that works.",
    flowTitle: "Booking in 5 steps",
    flowLead:
      "This is not an automatic final booking yet. It is a clear inquiry: you choose the direction, and I reply with availability and exact next steps.",
    flowCards: [
      {
        title: "Service",
        text: "Choose the photography direction you are interested in.",
      },
      {
        title: "Package",
        text: "Standard is selected by default; change it only if you want another scale.",
      },
      {
        title: "Date",
        text: "Add a preferred day. It is still flexible.",
      },
      {
        title: "Notes",
        text: "Add a few words about the goal, location or deadline.",
      },
      {
        title: "Contact",
        text: "Add where I can reply, then send the inquiry.",
      },
    ],
    selectedTitle: "Selected direction",
    selectedFallback: "No service selected yet",
    selectedFallbackText:
      "Choose a direction above, or leave it open and select one manually in the form.",
    homeGroup: "Featured photography directions",
    servicesGroup: "Services",
    giftGroup: "Gift",
    giftVoucher: "Gift voucher",
    homeOptions: [
      { _id: "personal-brand-starter", title: "Personal Brand Starter" },
      { _id: "lifestyle-story-session", title: "Lifestyle Story Session" },
      { _id: "content-creator-day", title: "Content Creator Day" },
      { _id: "boudoir-branding", title: "Dating Boost / Boudoir" },
      { _id: "model-application", title: "Discounted Vintage Session" },
    ],
    processTitle: "What happens after booking?",
    steps: [
      "I receive your inquiry by email.",
      "I reply with available dates.",
      "We refine the service, location and mood.",
      "We confirm the date and exact details.",
      "After the session, the images arrive in a private online gallery.",
    ],
    sideTitle: "You do not need a finished brief.",
    sideText:
      "A feeling, a date or an occasion is enough. If you are unsure, I will help you choose the best format based on your message.",
    formEyebrow: "2-3 minutes",
    formTitle: "We are only a few clicks away. Send an inquiry.",
    formLead:
      "After submitting, the inquiry arrives directly to me by email. I review what you are planning and usually reply within 1-2 business days with availability and next steps.",
    trustNote:
      "You do not need a finished brief: the service, package and approximate date are enough. We refine the details together.",
    bottomCtaEyebrow: "Direct contact",
    bottomCtaTitle: "If you prefer, you can simply email me.",
    bottomCtaText:
      "You can write directly too, but the form helps me reply with a clearer date and direction from the first response.",
    bottomCta: "Email Richard",
  },
} as const;

const hungarianCountySeats = [
  "Békéscsaba",
  "Budapest",
  "Debrecen",
  "Eger",
  "Győr",
  "Kaposvár",
  "Kecskemét",
  "Miskolc",
  "Nyíregyháza",
  "Pécs",
  "Salgótarján",
  "Szeged",
  "Székesfehérvár",
  "Szekszárd",
  "Szolnok",
  "Szombathely",
  "Tatabánya",
  "Veszprém",
  "Zalaegerszeg",
] as const;

function textOrFallback(value: string | undefined, fallback: string) {
  return value?.trim() || fallback;
}

export async function generateMetadata(props: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale: rawLocale } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";
  const copy = bookingCopy[locale];

  return createMetadata({
    locale,
    path: "/booking",
    title:
      locale === "hu"
        ? "Foglalás | Fotózás időpont Budapesten | Richard Foto"
        : "Booking | Photography Session in Budapest | Richard Foto",
    description: copy.description,
    keywords:
      locale === "hu"
        ? ["fotózás foglalás Budapest", "fotózás árak Budapest", "Richard Foto foglalás"]
        : ["photography booking Budapest", "photo session Budapest", "Richard Foto booking"],
  });
}

export default async function BookingPage(props: {
  params: LocaleParams;
  searchParams: BookingSearchParams;
}) {
  const { locale: rawLocale } = await props.params;
  const searchParams = await props.searchParams;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";
  const copy = bookingCopy[locale];
  const serviceParam = Array.isArray(searchParams?.service)
    ? searchParams.service[0]
    : searchParams?.service;

  const [activeServices, bookingSettings] = await Promise.all([
    getActivePhotographyServices(),
    client.fetch<BookingSettingsDocument | null>(bookingSettingsQuery),
  ]);
  const headerEyebrow = textOrFallback(
    locale === "hu" ? bookingSettings?.eyebrowHu : bookingSettings?.eyebrowEn,
    copy.eyebrow,
  );
  const headerTitle = textOrFallback(
    locale === "hu" ? bookingSettings?.titleHu : bookingSettings?.titleEn,
    copy.title,
  );
  const headerIntro = textOrFallback(
    locale === "hu" ? bookingSettings?.introHu : bookingSettings?.introEn,
    copy.intro,
  );
  const headerImageUrl = bookingSettings?.headerImage
    ? urlFor(bookingSettings.headerImage)
        .ignoreImageParams()
        .width(2200)
        .height(1200)
        .fit("max")
        .format("webp")
        .quality(88)
        .url()
    : null;
  const homepageServiceIds = new Set<string>(
    copy.homeOptions.map((option) => option._id),
  );
  const services = activeServices
    .filter((service) => !homepageServiceIds.has(service.id))
    .map((service) => ({
      _id: service.id,
      title: service.title[locale],
    }));
  const serviceGroups = [
    { title: copy.homeGroup, options: copy.homeOptions },
    { title: copy.servicesGroup, options: services },
    { title: copy.giftGroup, options: [{ _id: "gift-voucher", title: copy.giftVoucher }] },
  ];
  const serviceOptions = serviceGroups.flatMap((group) => group.options);
  const selectedService =
    serviceOptions.find((service) => service._id === serviceParam) ?? null;

  const graph = schemaGraph([
    baseOrganizationSchema(locale),
    photographerSchema(locale),
    ...serviceSchemaNodes(locale, activeServices),
    imageObjectSchema({
      locale,
      path: "/booking",
      caption:
        locale === "hu"
          ? "Fotózás foglalás Budapest Richard Foto"
          : "Photography booking Budapest Richard Foto",
    }),
    breadcrumbSchema(locale, [
      { name: site.name, path: "/" },
      { name: copy.title, path: "/booking" },
    ]),
    faqSchema(sharedFaqs[locale]),
  ]);

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <JsonLd data={graph} />

      <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-neutral-950 px-6 text-[#fff8e8]">
        {headerImageUrl ? (
          <Image
            src={headerImageUrl}
            alt={
              locale === "hu"
                ? "Richard Foto foglalás oldal header kép"
                : "Richard Foto booking page header image"
            }
            fill
            priority
            sizes="100vw"
            className="image-soft-motion object-cover opacity-68"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(255,255,255,0.16),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_42%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/72 via-neutral-950/18 to-neutral-950/8" />
        <div className="reveal-up relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-6xl pb-14 pt-24 md:pb-20 md:pt-28">
          <div className="self-start">
            <p className="mb-5 text-xs uppercase tracking-[0.35em] text-[#fff8e8]/55">
              {headerEyebrow}
            </p>
            <h1 className="max-w-4xl font-serif text-5xl font-normal leading-[0.92] tracking-[-0.045em] text-[#fff8e8] md:text-7xl">
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

      <section
        aria-label={
          locale === "hu"
            ? "Magyarországi megyeszékhelyek"
            : "Hungarian county seats"
        }
        className="overflow-hidden border-y border-neutral-200 bg-[#fbfaf7] py-4"
      >
        <div
          className="marquee-track flex gap-3 pr-3"
          style={{ animationDuration: "92s" }}
        >
          {[...hungarianCountySeats, ...hungarianCountySeats].map((city, index) => (
            <span
              key={`${city}-${index}`}
              className="whitespace-nowrap border border-neutral-200 bg-white px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-neutral-500 md:text-xs"
            >
              {city}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <section
          aria-labelledby="booking-form-heading"
          className="reveal-on-scroll bg-white"
        >
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-neutral-400">
            {copy.formEyebrow}
          </p>
          <h2
            id="booking-form-heading"
            className="font-serif text-3xl tracking-tight"
          >
            {copy.formTitle}
          </h2>
          <div className="mt-6 grid gap-4 border-y border-neutral-200 bg-[#fbfaf7] p-5 text-sm leading-7 text-neutral-600 md:grid-cols-2 md:p-6">
            <p>{copy.formLead}</p>
            <p>{copy.trustNote}</p>
          </div>
          <div className="mt-8">
            <BookingForm
              key={selectedService?.title ?? "empty-booking-form"}
              contactEmail={site.email}
              serviceGroups={serviceGroups}
              initialService={selectedService?.title ?? ""}
              selectedTitle={copy.selectedTitle}
              selectedFallback={copy.selectedFallback}
              selectedFallbackText={copy.selectedFallbackText}
              sideText={copy.sideText}
              flowTitle={copy.flowTitle}
              flowLead={copy.flowLead}
              flowCards={copy.flowCards}
            />
          </div>
        </section>
      </section>

      <section className="bg-neutral-950 px-6 py-20 text-center text-white md:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-white/45">
            {copy.bottomCtaEyebrow}
          </p>
          <h2 className="font-serif text-4xl leading-tight tracking-tight md:text-6xl">
            {copy.bottomCtaTitle}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/65">
            {copy.bottomCtaText}
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={`mailto:${site.email}`}
              className="bg-white px-7 py-4 text-sm uppercase tracking-[0.18em] text-neutral-950 transition-colors hover:bg-neutral-200"
            >
              {copy.bottomCta}
            </a>
            <a
              href={site.phoneHref}
              className="border border-white/40 px-7 py-4 text-sm uppercase tracking-[0.18em] text-white transition-colors hover:bg-white hover:text-neutral-950"
            >
              {site.phone}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
