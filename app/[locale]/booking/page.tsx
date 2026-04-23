import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { getTranslations } from "next-intl/server";
import BookingForm from "./BookingForm";

type ServiceOption = {
  _id: string;
  title: string;
};

type LocaleParams = Promise<{ locale: string }>;

const servicesQuery = groq`*[_type == "service"] | order(price asc) {
  _id,
  title
}`;

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
  const services = await client.fetch<ServiceOption[]>(servicesQuery);

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-zinc-900 text-white text-center py-32 px-4">
        <h1 className="text-5xl font-serif mb-4">{t("title")}</h1>
        <p className="text-zinc-400 max-w-md mx-auto">
          {t("subtitle")}
        </p>
      </section>
      <section className="max-w-2xl mx-auto py-24 px-4">
        <BookingForm services={services} />
      </section>
    </main>
  );
}
