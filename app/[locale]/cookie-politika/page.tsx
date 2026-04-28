// app/[locale]/cookie-politika/page.tsx
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

export async function generateMetadata(props: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale: rawLocale } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";
  const isHu = locale === "hu";
  return createMetadata({
    locale,
    path: "/cookie-politika",
    title: isHu
      ? "Cookie (Süti) Politika | Richard Foto"
      : "Cookie Policy | Richard Foto",
    description: isHu
      ? "Richard Foto cookie (süti) politikája: milyen sütiket használunk és hogyan kezelhetők."
      : "Richard Foto cookie policy: what cookies we use and how to manage them.",
    noIndex: true,
  });
}

export default async function CookiePolicy(props: { params: LocaleParams }) {
  const { locale: rawLocale } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";
  const isHu = locale === "hu";
  const title = isHu ? "Cookie (Süti) Politika" : "Cookie Policy";
  const graph = schemaGraph([
    baseOrganizationSchema(locale),
    photographerSchema(locale),
    ...serviceSchemaNodes(locale),
    imageObjectSchema({
      locale,
      path: "/cookie-politika",
      caption: isHu ? "Richard Foto cookie politika" : "Richard Foto cookie policy",
    }),
    breadcrumbSchema(locale, [
      { name: site.name, path: "/" },
      { name: title, path: "/cookie-politika" },
    ]),
    faqSchema(sharedFaqs[locale]),
  ]);

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <JsonLd data={graph} />
      <div className="max-w-3xl mx-auto px-6 py-24">
        <Link
          href={`/${locale}`}
          className="text-xs tracking-[0.3em] uppercase text-neutral-400 hover:text-neutral-900 transition-colors mb-12 inline-block"
        >
          ← {isHu ? "Vissza a főoldalra" : "Back to homepage"}
        </Link>

        <h1 className="text-5xl font-light tracking-tight mb-4">
          {isHu ? "Cookie (Süti) Politika" : "Cookie Policy"}
        </h1>
        <p className="text-sm text-neutral-400 mb-12">
          {isHu ? "Hatálybalépés dátuma:" : "Effective date:"} 2025.01.01.
        </p>

        <hr className="border-neutral-100 mb-12" />

        {isHu ? (
          <div className="space-y-10 text-neutral-600 leading-relaxed">
            <p>
              A Richard Foto weboldalon sütiket (cookie-kat) használunk a
              felhasználói élmény javítása és a weboldal teljesítményének
              elemzése céljából.
            </p>

            <section>
              <h2 className="text-2xl font-light text-neutral-900 mb-4">
                1. Mik azok a sütik?
              </h2>
              <p>
                A sütik kis adatfájlok, amelyeket böngészője tárol a készülékén,
                amikor meglátogat egy weboldalt. Segítenek a weboldal
                működésének javításában és hasznos információkat nyújtanak a
                látogatásról.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-neutral-900 mb-4">
                2. Milyen sütiket használunk?
              </h2>
              <ul className="list-disc pl-5 space-y-3">
                <li>
                  <strong className="font-medium text-neutral-800">
                    Funkcionális sütik:
                  </strong>{" "}
                  A weboldal megfelelő működéséhez elengedhetetlenek (pl. nyelvi
                  beállítás megjegyzése). Ezek nélkül az oldal nem működne
                  megfelelően.
                </li>
                <li>
                  <strong className="font-medium text-neutral-800">
                    Analitikai sütik (Google Analytics):
                  </strong>{" "}
                  Anonimizált látogatói adatokat gyűjtünk a weboldal
                  teljesítményének javítása érdekében. Ezek az adatok nem
                  köthetők össze az Ön személyével.
                </li>
                <li>
                  <strong className="font-medium text-neutral-800">
                    Google Fonts sütik:
                  </strong>{" "}
                  A betűtípusok betöltéséhez szükséges külső kérések, amelyek
                  adatokat gyűjthetnek az Ön böngészőjéből.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-neutral-900 mb-4">
                3. A sütik kezelése
              </h2>
              <p>
                Böngészőjében bármikor lehetősége van a sütik kezelésére,
                módosítására vagy törlésére. Felhívjuk figyelmét, hogy a
                funkcionális sütik letiltása befolyásolhatja a weboldal
                megfelelő működését. A leggyakoribb böngészők beállításaihoz:
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-1">
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-neutral-900 transition-colors"
                  >
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/hu/kb/sutik-kezelese"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-neutral-900 transition-colors"
                  >
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/hu-hu/guide/safari/sfri11471/mac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-neutral-900 transition-colors"
                  >
                    Apple Safari
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-neutral-900 mb-4">
                4. Harmadik felek sütijei
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="font-medium text-neutral-800">
                    Google Analytics:
                  </strong>{" "}
                  Látogatói statisztikák gyűjtéséhez. Részletek:{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-neutral-900 transition-colors"
                  >
                    Google adatvédelmi irányelvek
                  </a>
                  .
                </li>
                <li>
                  <strong className="font-medium text-neutral-800">
                    Google Fonts:
                  </strong>{" "}
                  Betűtípusok megjelenítéséhez.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-neutral-900 mb-4">
                5. Kapcsolat
              </h2>
              <p>
                Kérdés esetén forduljon hozzánk:{" "}
                <a
                  href="mailto:hello@richardfoto.hu"
                  className="underline hover:text-neutral-900 transition-colors"
                >
                  hello@richardfoto.hu
                </a>
              </p>
            </section>
          </div>
        ) : (
          <div className="space-y-10 text-neutral-600 leading-relaxed">
            <p>
              The Richard Foto website uses cookies to enhance the user
              experience and analyse website performance.
            </p>

            <section>
              <h2 className="text-2xl font-light text-neutral-900 mb-4">
                1. What are cookies?
              </h2>
              <p>
                Cookies are small data files stored by your browser on your
                device when you visit a website. They help improve the
                website&apos;s functionality and provide useful information
                about the visit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-neutral-900 mb-4">
                2. What cookies do we use?
              </h2>
              <ul className="list-disc pl-5 space-y-3">
                <li>
                  <strong className="font-medium text-neutral-800">
                    Functional cookies:
                  </strong>{" "}
                  Essential for the website to work correctly (e.g. remembering
                  your language preference). Without these, the site cannot
                  function properly.
                </li>
                <li>
                  <strong className="font-medium text-neutral-800">
                    Analytics cookies (Google Analytics):
                  </strong>{" "}
                  We collect anonymised visitor data to improve the website.
                  This data cannot be linked to your identity.
                </li>
                <li>
                  <strong className="font-medium text-neutral-800">
                    Google Fonts:
                  </strong>{" "}
                  External requests required to load fonts, which may collect
                  data from your browser.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-neutral-900 mb-4">
                3. Managing cookies
              </h2>
              <p>
                You can manage, modify or delete cookies at any time through
                your browser settings. Please note that disabling functional
                cookies may affect the website&apos;s performance. Browser
                guides:
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-1">
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-neutral-900 transition-colors"
                  >
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-neutral-900 transition-colors"
                  >
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-neutral-900 transition-colors"
                  >
                    Apple Safari
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-neutral-900 mb-4">
                4. Third-party cookies
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="font-medium text-neutral-800">
                    Google Analytics:
                  </strong>{" "}
                  For visitor statistics. See the{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-neutral-900 transition-colors"
                  >
                    Google Privacy Policy
                  </a>
                  .
                </li>
                <li>
                  <strong className="font-medium text-neutral-800">
                    Google Fonts:
                  </strong>{" "}
                  For typography rendering.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-neutral-900 mb-4">
                5. Contact
              </h2>
              <p>
                For any questions:{" "}
                <a
                  href="mailto:hello@richardfoto.hu"
                  className="underline hover:text-neutral-900 transition-colors"
                >
                  hello@richardfoto.hu
                </a>
              </p>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
