import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { headers } from "next/headers";
import { isLocale, site } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Richard Foto | Storytelling Photography Budapest",
    template: "%s | Richard Foto",
  },
  description:
    "Natural, cinematic storytelling photography in Budapest by Richard Foto.",
  applicationName: site.name,
  authors: [{ name: site.owner, url: site.url }],
  creator: site.owner,
  publisher: site.name,
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: Promise<{ locale?: string }>;
}) {
  const resolvedParams = params ? await params : {};
  const requestHeaders = await headers();
  const headerLocale =
    requestHeaders.get("x-next-intl-locale") ??
    requestHeaders.get("x-current-locale") ??
    requestHeaders.get("NEXT_LOCALE");
  const paramsLocale = resolvedParams.locale;
  const safeHeaderLocale = headerLocale && isLocale(headerLocale) ? headerLocale : undefined;
  const lang = isLocale(paramsLocale ?? "") ? paramsLocale : safeHeaderLocale ?? "hu";

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable}`}
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
