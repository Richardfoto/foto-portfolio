import type { Metadata } from "next";
import Link from "next/link";
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

const privacyCopy = {
  hu: {
    title: "Adatvédelmi nyilatkozat",
    description:
      "Richard Foto adatvédelmi nyilatkozata: kapcsolatfelvétel, foglalás, személyes adatok kezelése, megőrzés és jogok.",
    back: "Vissza a főoldalra",
    effective: "Hatálybalépés dátuma",
    sections: [
      {
        title: "1. Adatkezelő",
        body: `Az adatkezelő Richard Foto / ${site.owner}. Kapcsolat: ${site.email}.`,
      },
      {
        title: "2. Kezelt adatok",
        body: "Kapcsolatfelvétel és foglalás során név, email cím, telefonszám, választott szolgáltatás, kívánt időpont és az üzenetben önként megadott információk kezelhetők.",
      },
      {
        title: "3. Az adatkezelés célja",
        body: "Az adatok célja ajánlatadás, időpont-egyeztetés, kapcsolattartás, számlázási vagy szerződéses kötelezettségek teljesítése, valamint a fotózással kapcsolatos kommunikáció.",
      },
      {
        title: "4. Megőrzési idő",
        body: "A megkereséseket a kommunikáció lezárását követően csak a szükséges ideig őrizzük meg. Szerződéses és számlázási adatokra a jogszabályi megőrzési határidők vonatkoznak.",
      },
      {
        title: "5. Továbbítás",
        body: "Az adatokat harmadik félnek nem adjuk el. Technikai szolgáltatók, például emailküldő vagy tárhelyszolgáltató, a működéshez szükséges mértékben adatfeldolgozóként részt vehetnek.",
      },
      {
        title: "6. Érintetti jogok",
        body: "Kérheted adataidhoz való hozzáférést, javítást, törlést, korlátozást vagy tiltakozhatsz az adatkezelés ellen a fenti email címen.",
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    description:
      "Richard Foto privacy policy: contact, booking, personal data handling, retention and data subject rights.",
    back: "Back to homepage",
    effective: "Effective date",
    sections: [
      {
        title: "1. Controller",
        body: `The controller is Richard Foto / ${site.owner}. Contact: ${site.email}.`,
      },
      {
        title: "2. Data processed",
        body: "When contacting or booking, we may process your name, email address, phone number, selected service, preferred date and any information voluntarily included in your message.",
      },
      {
        title: "3. Purpose of processing",
        body: "The data is used for quotes, scheduling, communication, contractual or invoicing obligations and messages related to the photography session.",
      },
      {
        title: "4. Retention",
        body: "Inquiries are retained only as long as necessary after communication ends. Contractual and invoicing data follow the applicable legal retention periods.",
      },
      {
        title: "5. Processors",
        body: "We do not sell personal data. Technical providers such as email or hosting services may act as processors where necessary for the website to operate.",
      },
      {
        title: "6. Your rights",
        body: "You may request access, correction, deletion, restriction or object to processing by contacting the email address above.",
      },
    ],
  },
} as const;

export async function generateMetadata(props: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale: rawLocale } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";
  const copy = privacyCopy[locale];

  return createMetadata({
    locale,
    path: "/adatvedelmi-nyilatkozat",
    title: `${copy.title} | Richard Foto`,
    description: copy.description,
    noIndex: true,
  });
}

export default async function PrivacyPage(props: { params: LocaleParams }) {
  const { locale: rawLocale } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";
  const copy = privacyCopy[locale];
  const graph = schemaGraph([
    baseOrganizationSchema(locale),
    photographerSchema(locale),
    ...serviceSchemaNodes(locale),
    imageObjectSchema({
      locale,
      path: "/adatvedelmi-nyilatkozat",
      caption:
        locale === "hu"
          ? "Richard Foto adatvédelmi nyilatkozat"
          : "Richard Foto privacy policy",
    }),
    breadcrumbSchema(locale, [
      { name: site.name, path: "/" },
      { name: copy.title, path: "/adatvedelmi-nyilatkozat" },
    ]),
    faqSchema(sharedFaqs[locale]),
  ]);

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <JsonLd data={graph} />
      <div className="mx-auto max-w-3xl px-6 py-24">
        <Link
          href={`/${locale}`}
          className="mb-12 inline-block text-xs uppercase tracking-[0.3em] text-neutral-400 hover:text-neutral-900"
        >
          {copy.back}
        </Link>
        <h1 className="font-serif text-5xl tracking-tight">{copy.title}</h1>
        <p className="mt-4 text-sm text-neutral-400">
          {copy.effective}: 2025.01.01.
        </p>
        <div className="mt-12 space-y-10 text-neutral-600">
          {copy.sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-4 text-2xl font-light text-neutral-950">
                {section.title}
              </h2>
              <p className="leading-8">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
