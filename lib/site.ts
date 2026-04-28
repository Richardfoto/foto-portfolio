import type { Metadata } from "next";
import { createElement } from "react";

export const locales = ["hu", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "hu";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export const site = {
  name: "Richard Foto",
  owner: "Richard Varga",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://richardfoto.vercel.app").replace(
    /\/$/,
    "",
  ),
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@richardfoto.hu",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+36 30 88 40 987",
  phoneHref: "tel:+36308840987",
  city: "Budapest",
  country: "HU",
  foundingDate: "2015",
  instagram: "https://www.instagram.com/richardfoto",
  facebook: "https://www.facebook.com/richardfoto",
};

export function absoluteUrl(path = "") {
  if (path.startsWith("http")) return path;
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function localizedPath(locale: Locale, path = "") {
  const cleanPath = path.replace(/^\/(hu|en)/, "");
  if (cleanPath === "" || cleanPath === "/") return `/${locale}`;
  return `/${locale}${cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`}`;
}

export function alternateLanguages(path: string) {
  return {
    hu: absoluteUrl(localizedPath("hu", path)),
    en: absoluteUrl(localizedPath("en", path)),
    "x-default": absoluteUrl(localizedPath(defaultLocale, path)),
  };
}

type SeoInput = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

export function createMetadata({
  locale,
  path,
  title,
  description,
  keywords = [],
  image = "/opengraph-image",
  type = "website",
  noIndex = false,
}: SeoInput): Metadata {
  const canonical = absoluteUrl(localizedPath(locale, path));
  const imageUrl = absoluteUrl(image);

  return {
    metadataBase: new URL(site.url),
    title: {
      absolute: title,
    },
    description,
    keywords,
    alternates: {
      canonical,
      languages: alternateLanguages(path),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: site.name,
      locale: locale === "hu" ? "hu_HU" : "en_US",
      alternateLocale: locale === "hu" ? ["en_US"] : ["hu_HU"],
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt:
            locale === "hu"
              ? "Richard Foto történetmesélő fotózás Budapesten"
              : "Richard Foto storytelling photography in Budapest",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function JsonLd({ data }: { data: unknown }) {
  return createElement("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: jsonLd(data) },
  });
}

export function baseOrganizationSchema(locale: Locale) {
  return {
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    foundingDate: site.foundingDate,
    sameAs: [site.instagram, site.facebook],
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressCountry: site.country,
    },
    description:
      locale === "hu"
        ? "Budapesti fotós márka természetes, történetmesélő lifestyle, családi, üzleti, esküvői és személyes portré fotózáshoz."
        : "Budapest photography brand for natural storytelling lifestyle, family, business, wedding and personal portrait sessions.",
  };
}

export function photographerSchema(locale: Locale) {
  return {
    "@type": "Photographer",
    "@id": `${site.url}/#photographer`,
    name: site.owner,
    alternateName: site.name,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    image: absoluteUrl("/opengraph-image"),
    worksFor: { "@id": `${site.url}/#organization` },
    areaServed: {
      "@type": "City",
      name: "Budapest",
    },
    knowsAbout:
      locale === "hu"
        ? [
            "lifestyle fotózás Budapest",
            "történetmesélő fotózás Budapest",
            "werk fotózás Budapest",
            "újszülött fotózás",
            "kismama fotózás",
            "családi fotózás",
            "esküvői fotózás",
          ]
        : [
            "lifestyle photography Budapest",
            "storytelling photography Budapest",
            "headshot photography Budapest",
            "newborn photography",
            "maternity photography",
            "family photography",
            "wedding photography",
          ],
  };
}

export function breadcrumbSchema(
  locale: Locale,
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(localizedPath(locale, item.path)),
    })),
  };
}

export function faqSchema(
  items: Array<{ question: string; answer: string }>,
) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function imageObjectSchema({
  locale,
  path,
  caption,
  contentUrl,
}: {
  locale: Locale;
  path: string;
  caption: string;
  contentUrl?: string;
}) {
  return {
    "@type": "ImageObject",
    name: caption,
    caption,
    contentUrl: contentUrl ?? absoluteUrl("/opengraph-image"),
    url: contentUrl ?? absoluteUrl(localizedPath(locale, path)),
    creator: { "@id": `${site.url}/#photographer` },
    copyrightHolder: { "@id": `${site.url}/#organization` },
    inLanguage: locale,
  };
}

export function schemaGraph(nodes: unknown[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
