import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ContactForm from "./ContactForm";

type LocaleParams = Promise<{ locale: string }>;

export async function generateMetadata(props: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ContactPage(props: { params: LocaleParams }) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-zinc-900 text-white text-center py-32 px-4">
        <h1 className="text-5xl font-serif mb-4">{t("title")}</h1>
        <p className="text-zinc-400 max-w-md mx-auto">{t("subtitle")}</p>
      </section>
      <section className="max-w-2xl mx-auto py-24 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-xl font-serif mb-8">{t("detailsHeading")}</h2>
            <div className="space-y-4 text-zinc-600 text-sm">
              <p>✉ richard@example.com</p>
              <p>✆ +36 30 123 4567</p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-serif mb-8">{t("formHeading")}</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
