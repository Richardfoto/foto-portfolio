import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://richardfoto.vercel.app"),
  title: {
    default: "Richard Foto – Professzionális fotózás Budapest",
    template: "%s | Richard Foto",
  },
  description: "Professzionális portré, esküvői és családi fotózás Budapesten.",
  openGraph: {
    title: "Richard Foto",
    description: "Professzionális fotózás Budapesten",
    url: "https://richardfoto.vercel.app",
    siteName: "Richard Foto",
    locale: "hu_HU",
    type: "website",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider messages={messages}>
      <div className={`${playfair.variable} ${inter.variable} min-h-screen flex flex-col`}>
        <Navbar />
        <div className="pt-16 flex-1">{children}</div>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
