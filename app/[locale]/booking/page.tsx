import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { getTranslations } from "next-intl/server";
import BookingForm from "./BookingForm";

type LocaleParams = Promise<{ locale: string }>;

const servicesQuery = groq`*[_type == "service"] | order(price asc) { _id, title }`;

export async function generateMetadata(props: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "booking" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function BookingPage(props: { params: LocaleParams }) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "booking" });
  const services = await client.fetch(servicesQuery);

  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-zinc-200 py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.35em] uppercase text-zinc-500 mb-4">
            FOGLALÁS
          </p>
          <h1 className="text-6xl md:text-7xl font-serif tracking-tighter mb-6">
            {t("title")}
          </h1>
          <p className="text-xl text-zinc-600 max-w-md mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4 py-20">
        <div className="mb-10">
          <h2 className="text-4xl font-serif mb-3">Időpont egyeztetés</h2>
          <p className="text-zinc-600">
            Töltsd ki az űrlapot, és 24 órán belül jelentkezem.
          </p>
        </div>

        <div className="border border-zinc-200 p-12">
          <BookingForm services={services} />
        </div>
      </section>
    </main>
  );
}
