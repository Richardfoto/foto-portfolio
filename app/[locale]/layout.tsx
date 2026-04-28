import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { isLocale, type Locale } from "@/lib/site";

type LocaleParams = Promise<{ locale: string }>;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: LocaleParams;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  const locale: Locale = rawLocale;
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="site-shell min-h-screen flex flex-col">
        <a href="#main-content" className="skip-link">
          {locale === "hu" ? "Ugrás a tartalomra" : "Skip to content"}
        </a>
        <Navbar />
        <div id="main-content" tabIndex={-1} className="flex-1">
          {children}
        </div>
        <Footer locale={locale} />
      </div>
    </NextIntlClientProvider>
  );
}
