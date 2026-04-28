// app/[locale]/aszf/page.tsx
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
    path: "/aszf",
    title: isHu
      ? "Általános Szerződési Feltételek | Richard Foto"
      : "Terms & Conditions | Richard Foto",
    description: isHu
      ? "Richard Foto általános szerződési feltételei: foglalás, fizetés, lemondás, szerzői jog."
      : "Richard Foto terms and conditions: booking, payment, cancellation and copyright.",
    noIndex: true,
  });
}

export default async function Terms(props: { params: LocaleParams }) {
  const { locale: rawLocale } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";
  const isHu = locale === "hu";
  const title = isHu ? "Általános Szerződési Feltételek" : "Terms & Conditions";
  const graph = schemaGraph([
    baseOrganizationSchema(locale),
    photographerSchema(locale),
    ...serviceSchemaNodes(locale),
    imageObjectSchema({
      locale,
      path: "/aszf",
      caption: isHu
        ? "Richard Foto általános szerződési feltételek"
        : "Richard Foto terms and conditions",
    }),
    breadcrumbSchema(locale, [
      { name: site.name, path: "/" },
      { name: title, path: "/aszf" },
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
          {isHu ? "Általános Szerződési Feltételek" : "Terms & Conditions"}
        </h1>
        <p className="text-sm text-neutral-400 mb-12">
          {isHu ? "Hatálybalépés dátuma:" : "Effective date:"} 2025.01.01.
        </p>

        <hr className="border-neutral-100 mb-12" />

        {isHu ? (
          <div className="space-y-10 text-neutral-600 leading-relaxed">
            <p>
              A Richard Foto weboldalának és szolgáltatásainak igénybevételével
              Ön elfogadja az alábbi feltételeket. Kérjük, olvassa el
              figyelmesen.
            </p>

            <section>
              <h2 className="text-2xl font-light text-neutral-900 mb-4">
                1. Foglalás és visszaigazolás
              </h2>
              <p>
                A fotózási időpont kizárólag az előleg befizetése után
                tekinthető lefoglaltnak. Az előleg mértéke a csomag árának
                30%-a, amely a végösszegbe beleszámít. Az előleg befizetésére
                visszaigazolás után 5 munkanap áll rendelkezésre.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-neutral-900 mb-4">
                2. Fizetési feltételek
              </h2>
              <p>
                A fennmaradó összeg a fotózás napján, legkésőbb a fotózás
                megkezdése előtt esedékes. Elfogadott fizetési módok: banki
                átutalás, készpénz.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-neutral-900 mb-4">
                3. Lemondás és halasztás
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="font-medium text-neutral-800">
                    48 órán belüli lemondás:
                  </strong>{" "}
                  Az előleg elvész.
                </li>
                <li>
                  <strong className="font-medium text-neutral-800">
                    48 óránál korábban:
                  </strong>{" "}
                  Az előleg egy alkalommal átvihető egy új időpontra (a
                  rögzítéstől számított 6 hónapon belül).
                </li>
                <li>
                  <strong className="font-medium text-neutral-800">
                    Időjárás miatti halasztás:
                  </strong>{" "}
                  Kültéri fotózás esetén közös megegyezéssel új időpont kerül
                  kijelölésre, előleg elvesztése nélkül.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-neutral-900 mb-4">
                4. Képek átadása
              </h2>
              <p>
                A szerkesztett képek privát online galérián keresztül kerülnek
                átadásra a fotózástól számított 7–10 munkanapon belül. A galéria
                60 napig érhető el; ez idő alatt az ügyfél letöltheti a képeket.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-neutral-900 mb-4">
                5. Szerzői jog és felhasználás
              </h2>
              <p>
                A képek szerzői joga Richard Fotót illeti. Az ügyfél személyes,
                nem kereskedelmi célokra (pl. közösségi média, nyomtatás saját
                részre) felhasználhatja a képeket. Kereskedelmi felhasználáshoz
                (reklám, értékesítés stb.) külön írásos engedély szükséges.
                Richard Foto a képeket portfólió és marketing anyagokban
                felhasználhatja, kivéve, ha az ügyfél erre vonatkozóan írásban
                tiltakozik.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-neutral-900 mb-4">
                6. Felelősség korlátozása
              </h2>
              <p>
                Richard Foto nem vállal felelősséget technikai meghibásodásból
                (pl. kameracsere, memóriakártya hiba) eredő képveszteségért,
                amennyiben minden tőle elvárható intézkedést megtett. Ilyen
                esetben az előleg visszatérítésre kerül.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-neutral-900 mb-4">
                7. Kapcsolat
              </h2>
              <p>
                Kérdés esetén:{" "}
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
              By using the Richard Foto website and services, you agree to the
              following terms. Please read them carefully.
            </p>

            <section>
              <h2 className="text-2xl font-light text-neutral-900 mb-4">
                1. Booking & confirmation
              </h2>
              <p>
                A session date is only confirmed upon receipt of a deposit equal
                to 30% of the package price. This deposit is deducted from the
                total. Payment is due within 5 business days of receiving the
                booking confirmation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-neutral-900 mb-4">
                2. Payment
              </h2>
              <p>
                The remaining balance is due on the day of the session, before
                the shoot begins. Accepted payment methods: bank transfer, cash.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-neutral-900 mb-4">
                3. Cancellation & rescheduling
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="font-medium text-neutral-800">
                    Cancellation within 48 hours:
                  </strong>{" "}
                  The deposit is forfeited.
                </li>
                <li>
                  <strong className="font-medium text-neutral-800">
                    Cancellation more than 48 hours in advance:
                  </strong>{" "}
                  The deposit may be transferred once to a new date within 6
                  months.
                </li>
                <li>
                  <strong className="font-medium text-neutral-800">
                    Weather-related postponement:
                  </strong>{" "}
                  For outdoor sessions, a new date can be agreed by mutual
                  consent without forfeiting the deposit.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-neutral-900 mb-4">
                4. Image delivery
              </h2>
              <p>
                Edited images are delivered via a private online gallery within
                7–10 business days of the session. The gallery remains
                accessible for 60 days, during which the client may download all
                images.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-neutral-900 mb-4">
                5. Copyright & usage
              </h2>
              <p>
                All images remain the intellectual property of Richard Foto.
                Clients may use images for personal, non-commercial purposes
                (e.g. social media, personal printing). Commercial use requires
                separate written permission. Richard Foto may use images in
                portfolio and marketing materials unless the client objects in
                writing.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-neutral-900 mb-4">
                6. Limitation of liability
              </h2>
              <p>
                Richard Foto is not liable for image loss due to technical
                failure (e.g. equipment or memory card failure) provided all
                reasonable precautions were taken. In such cases, the deposit
                will be refunded in full.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-neutral-900 mb-4">
                7. Contact
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
