import type { Metadata } from "next";
import Link from "next/link";
import BookingForm from "./BookingForm";
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
  serviceSchemaNodes,
  sharedFaqs,
} from "@/lib/photography-content";

type LocaleParams = Promise<{ locale: string }>;
type BookingSearchParams = Promise<{
  service?: string | string[];
}>;

const bookingCopy = {
  hu: {
    title: "Foglalás",
    description:
      "Foglalj lifestyle, werk, üzleti portré, családi, újszülött, kismama, esküvői, termék vagy rendezvény fotózást Budapesten Richard Fotóval.",
    eyebrow: "Időpont egyeztetés",
    intro:
      "Írj pár sort arról, mire készülsz. Nem kell mindent tudnod előre; segítek a szolgáltatás, helyszín, ritmus és képi hangulat tisztázásában.",
    chooserTitle: "Válaszd ki, milyen történettel érkezel.",
    chooserLead:
      "A 10 fotózási fókusz nem menüfal, hanem gyors útvonal. Kattints arra, ami most a legközelebb áll hozzád, és az űrlapban már előkészítve jelenik meg.",
    selectedLabel: "Kiválasztva",
    giftVoucher: "Ajándékutalvány",
    processTitle: "Mi történik a foglalás után?",
    steps: [
      "Visszaírok, és pontosítjuk az elképzelést.",
      "Kiválasztjuk a megfelelő szolgáltatást és időpontot.",
      "A fotózás előtt kapsz gyakorlati javaslatokat.",
      "A kész képek privát online galériában érkeznek.",
    ],
    sideTitle: "Nem kell kész brief.",
    sideText:
      "Elég egy érzés, egy dátum vagy egy alkalom. Ha bizonytalan vagy, az üzenet alapján segítek eldönteni, melyik fotózási forma lesz a legjobb.",
    formEyebrow: "2-3 perc",
    formTitle: "Foglalási kérés",
  },
  en: {
    title: "Booking",
    description:
      "Book lifestyle, werk, business portrait, family, newborn, maternity, wedding, product or event photography in Budapest with Richard Foto.",
    eyebrow: "Session inquiry",
    intro:
      "Write a few lines about what you are planning. You do not need to know everything in advance; I will help clarify the service, location, rhythm and visual mood.",
    chooserTitle: "Choose the story you are arriving with.",
    chooserLead:
      "The 10 photography focuses are not a wall of options; they are a faster route. Choose the one that feels closest right now, and the form will open with it already prepared.",
    selectedLabel: "Selected",
    giftVoucher: "Gift voucher",
    processTitle: "What happens after booking?",
    steps: [
      "I reply and we refine the idea.",
      "We choose the right service and date.",
      "Before the session, you receive practical guidance.",
      "The finished images arrive in a private online gallery.",
    ],
    sideTitle: "You do not need a finished brief.",
    sideText:
      "A feeling, a date or an occasion is enough. If you are unsure, I will help you choose the best format based on your message.",
    formEyebrow: "2-3 minutes",
    formTitle: "Booking request",
  },
} as const;

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

  const services = photographyServices.map((service) => ({
    _id: service.id,
    title: service.title[locale],
  }));
  const serviceOptions = [
    ...services,
    { _id: "gift-voucher", title: copy.giftVoucher },
  ];
  const selectedService =
    serviceOptions.find((service) => service._id === serviceParam) ?? null;

  const graph = schemaGraph([
    baseOrganizationSchema(locale),
    photographerSchema(locale),
    ...serviceSchemaNodes(locale),
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

      <section className="bg-neutral-950 px-6 py-28 text-white md:py-36">
        <div className="reveal-up mx-auto max-w-5xl">
          <p className="mb-6 text-xs uppercase tracking-[0.32em] text-white/45">
            {copy.eyebrow}
          </p>
          <h1 className="font-serif text-5xl tracking-tight md:text-7xl">
            {copy.title}
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-white/68">
            {copy.intro}
          </p>
        </div>
      </section>

      <section className="overflow-hidden border-y border-neutral-200 bg-white py-5">
        <div className="marquee-track flex gap-4 pr-4">
          {[...serviceOptions, ...serviceOptions].map((service, index) => (
            <a
              key={`${service._id}-${index}`}
              href={`#${service._id}`}
              className="whitespace-nowrap border border-neutral-200 px-5 py-3 text-xs uppercase tracking-[0.18em] text-neutral-500 transition-colors hover:border-neutral-950 hover:text-neutral-950"
            >
              {service.title}
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="reveal-on-scroll grid gap-10 md:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-neutral-400">
              {locale === "hu" ? "Első lépés" : "First step"}
            </p>
            <h2 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">
              {copy.chooserTitle}
            </h2>
          </div>
          <p className="self-end text-lg leading-8 text-neutral-600">
            {copy.chooserLead}
          </p>
        </div>

        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {serviceOptions.map((service, index) => {
            const isSelected = service._id === selectedService?._id;

            return (
              <Link
                id={service._id}
                key={service._id}
                href={`/${locale}/booking?service=${service._id}#booking-form-heading`}
                className={`group reveal-on-scroll border px-5 py-5 transition-all hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(0,0,0,0.08)] ${
                  isSelected
                    ? "border-neutral-950 bg-neutral-950 text-white"
                    : "border-neutral-200 bg-white text-neutral-950 hover:border-neutral-950"
                }`}
              >
                <span
                  className={`block text-xs uppercase tracking-[0.24em] ${
                    isSelected ? "text-white/55" : "text-neutral-400"
                  }`}
                >
                  {isSelected
                    ? copy.selectedLabel
                    : String(index + 1).padStart(2, "0")}
                </span>
                <span className="mt-6 block font-serif text-2xl leading-tight tracking-tight">
                  {service.title}
                </span>
                <span
                  className={`mt-5 block text-xs uppercase tracking-[0.18em] underline-offset-8 group-hover:underline ${
                    isSelected ? "text-white/70" : "text-neutral-500"
                  }`}
                >
                  {locale === "hu" ? "Ezzel kérek ajánlatot" : "Request this"}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-14 px-6 pb-20 md:grid-cols-[0.8fr_1.2fr] md:pb-28">
        <aside className="reveal-on-scroll">
          <h2 className="font-serif text-3xl tracking-tight">
            {copy.processTitle}
          </h2>
          <ol className="mt-8 space-y-5">
            {copy.steps.map((step, index) => (
              <li
                key={step}
                className="story-line relative border-t border-neutral-200 pt-5 text-neutral-600"
              >
                <span className="mb-3 block text-xs uppercase tracking-[0.2em] text-neutral-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-10 bg-neutral-50 p-6 text-sm leading-7 text-neutral-600">
            <h3 className="font-serif text-2xl text-neutral-950">
              {copy.sideTitle}
            </h3>
            <p className="mt-4">{copy.sideText}</p>
          </div>
          <div className="mt-10 border-t border-neutral-200 pt-8 text-sm leading-7 text-neutral-500">
            <p>
              <a href={`mailto:${site.email}`} className="hover:text-neutral-950">
                {site.email}
              </a>
            </p>
            <p>
              <a href={site.phoneHref} className="hover:text-neutral-950">
                {site.phone}
              </a>
            </p>
          </div>
        </aside>

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
          <div className="mt-8">
            <BookingForm
              key={selectedService?.title ?? "empty-booking-form"}
              contactEmail={site.email}
              services={serviceOptions}
              initialService={selectedService?.title ?? ""}
            />
          </div>
        </section>
      </section>
    </main>
  );
}
