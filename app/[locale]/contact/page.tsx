import type { Metadata } from "next";
import ContactForm from "./ContactForm";
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

const contactCopy = {
  hu: {
    title: "Kapcsolat",
    description:
      "Kapcsolatfelvétel Richard Fotóval Budapesten lifestyle, werk, portré, családi, esküvői, termék és rendezvény fotózáshoz.",
    eyebrow: "Írj pár sort",
    intro:
      "Nem kell kész brief-fel érkezned. Elég, ha leírod, milyen pillanatot, embert, márkát vagy eseményt szeretnél megőrizni, és együtt megtaláljuk hozzá a megfelelő formát.",
    detailsHeading: "Elérhetőségek",
    formHeading: "Üzenet küldése",
    response: "Általában 1-2 munkanapon belül válaszolok.",
  },
  en: {
    title: "Contact",
    description:
      "Contact Richard Foto in Budapest for lifestyle, werk, portrait, family, wedding, product and event photography.",
    eyebrow: "Write a few lines",
    intro:
      "You do not need to arrive with a finished brief. Simply tell me what moment, person, brand or event you want to preserve, and we will find the right form together.",
    detailsHeading: "Contact details",
    formHeading: "Send a message",
    response: "I usually reply within 1-2 business days.",
  },
} as const;

export async function generateMetadata(props: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale: rawLocale } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";
  const copy = contactCopy[locale];

  return createMetadata({
    locale,
    path: "/contact",
    title:
      locale === "hu"
        ? "Kapcsolat | Richard Foto Budapest"
        : "Contact | Richard Foto Budapest",
    description: copy.description,
    keywords:
      locale === "hu"
        ? ["fotós kapcsolat Budapest", "Richard Foto", "fotózás ajánlatkérés"]
        : ["photographer contact Budapest", "Richard Foto", "photo session inquiry"],
  });
}

export default async function ContactPage(props: { params: LocaleParams }) {
  const { locale: rawLocale } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";
  const copy = contactCopy[locale];

  const graph = schemaGraph([
    baseOrganizationSchema(locale),
    photographerSchema(locale),
    ...serviceSchemaNodes(locale),
    imageObjectSchema({
      locale,
      path: "/contact",
      caption:
        locale === "hu"
          ? "Kapcsolat Richard Foto budapesti fotózáshoz"
          : "Contact Richard Foto for Budapest photography",
    }),
    breadcrumbSchema(locale, [
      { name: site.name, path: "/" },
      { name: copy.title, path: "/contact" },
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
          <h1 className="font-serif text-5xl tracking-tight md:text-7xl">
            {copy.title}
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-white/68">
            {copy.intro}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-14 px-6 py-20 md:grid-cols-[0.8fr_1.2fr] md:py-28">
        <aside>
          <h2 className="font-serif text-3xl tracking-tight">
            {copy.detailsHeading}
          </h2>
          <div className="mt-8 space-y-4 text-neutral-600">
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
            <p>{site.city}</p>
            <p className="pt-4 text-sm leading-6 text-neutral-500">
              {copy.response}
            </p>
          </div>
        </aside>

        <section aria-labelledby="contact-form-heading">
          <h2
            id="contact-form-heading"
            className="font-serif text-3xl tracking-tight"
          >
            {copy.formHeading}
          </h2>
          <div className="mt-8">
            <ContactForm />
          </div>
        </section>
      </section>
    </main>
  );
}
