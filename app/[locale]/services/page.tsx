import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type LocaleParams = Promise<{ locale: string }>;

export async function generateMetadata(props: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "services" });
  return {
    title: locale === "hu" ? "Szolgáltatások" : "Services",
    description: t("subtitle"),
  };
}

export default async function ServicesPage(props: { params: LocaleParams }) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "services" });

  const vintagePackages = [
    {
      title: "Vintage Portrait",
      price: 89000,
      duration: "1.5 óra",
      description: "Klasszikus, filmszerű portréfotózás természetes fényben.",
    },
    {
      title: "Vintage Couple",
      price: 129000,
      duration: "2 óra",
      description: "Párok számára – romantikus, időtlen hangulat.",
    },
  ];

  const highTechPackages = [
    {
      title: "Modern Portrait",
      price: 99000,
      duration: "1.5 óra",
      description:
        "Kortárs, tiszta stílusú portré – stúdió vagy városi környezetben.",
    },
    {
      title: "High-Tech Couple",
      price: 139000,
      duration: "2 óra",
      description: "Modern páros fotózás – dinamikus és elegáns.",
    },
    {
      title: "Editorial Session",
      price: 189000,
      duration: "3 óra",
      description: "Teljesen testreszabott, magazin-stílusú fotózás.",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-zinc-900 text-white text-center py-32 px-4">
        <h1 className="text-5xl font-serif mb-4">{t("title")}</h1>
        <p className="text-zinc-400 max-w-md mx-auto">{t("subtitle")}</p>
      </section>

      {/* Intro */}
      <section className="max-w-4xl mx-auto py-20 px-4 text-center">
        <p className="text-xs tracking-[0.35em] uppercase text-zinc-400 mb-5">
          Richard Foto
        </p>
        <h2 className="text-4xl md:text-5xl font-serif mb-6">
          {locale === "hu"
            ? "Két világ, két stílus"
            : "Two worlds, two aesthetics"}
        </h2>
        <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
          {locale === "hu"
            ? "Válassz a klasszikus, filmszerű hangulat és a modern, letisztult stílus között."
            : "Choose between timeless film-like aesthetics and modern clean visual language."}
        </p>
      </section>

      {/* VINTAGE - Klasszikus & Időtlen (sötét háttér) */}
      <section className="bg-zinc-950 py-24 px-4 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <div className="inline-block px-5 py-1.5 text-xs tracking-[0.2em] border border-white/30 rounded-full mb-4">
              VINTAGE
            </div>
            <h2 className="text-4xl font-serif">Klasszikus & Időtlen</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {vintagePackages.map((pkg, index) => (
              <div
                key={index}
                className="border border-white/10 p-10 flex flex-col hover:border-white/30 transition-all"
              >
                <div>
                  <h3 className="text-3xl font-serif mb-2">{pkg.title}</h3>
                  <p className="text-4xl font-light mb-6">
                    {pkg.price.toLocaleString("hu-HU")} Ft
                  </p>
                  <p className="text-sm text-zinc-400 mb-6">{pkg.duration}</p>
                  <p className="text-zinc-300 leading-relaxed">
                    {pkg.description}
                  </p>
                </div>
                <Link
                  href={`/${locale}/booking`}
                  className="mt-auto block text-center border border-white py-4 text-sm tracking-widest hover:bg-white hover:text-black transition-all"
                >
                  Foglalás
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HIGH-TECH - Modern & Letisztult (világos háttér) */}
      <section className="max-w-6xl mx-auto px-4 py-24">
        <div className="mb-12 text-center">
          <div className="inline-block px-5 py-1.5 text-xs tracking-[0.2em] border border-zinc-300 rounded-full mb-4">
            HIGH-TECH
          </div>
          <h2 className="text-4xl font-serif">Modern & Letisztult</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highTechPackages.map((pkg, index) => (
            <div
              key={index}
              className="border border-zinc-200 p-10 flex flex-col hover:border-zinc-900 transition-all"
            >
              <div>
                <h3 className="text-3xl font-serif mb-2">{pkg.title}</h3>
                <p className="text-4xl font-light mb-6">
                  {pkg.price.toLocaleString("hu-HU")} Ft
                </p>
                <p className="text-sm text-zinc-500 mb-6">{pkg.duration}</p>
                <p className="text-zinc-600 leading-relaxed">
                  {pkg.description}
                </p>
              </div>
              <Link
                href={`/${locale}/booking`}
                className="mt-auto block text-center border border-zinc-900 py-4 text-sm tracking-widest hover:bg-zinc-900 hover:text-white transition-all"
              >
                Foglalás
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
