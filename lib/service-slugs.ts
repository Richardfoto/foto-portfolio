import type { Locale } from "./site";

export const serviceSlugById = {
  "personal-brand-starter": {
    hu: "personal-brand-fotozas-budapest",
    en: "personal-brand-photography-budapest",
  },
  "lifestyle-story-session": {
    hu: "lifestyle-fotozas-budapest",
    en: "lifestyle-photography-budapest",
  },
  "content-creator-day": {
    hu: "content-creator-fotozas-budapest",
    en: "content-creator-photography-budapest",
  },
  maternity: {
    hu: "kismama-ujszulott-fotozas-budapest",
    en: "maternity-newborn-photography-budapest",
  },
  "business-portrait": {
    hu: "werk-fotozas-budapest",
    en: "werk-photography-budapest",
  },
  "family-lifestyle": {
    hu: "csaladi-fotozas-budapest",
    en: "family-photography-budapest",
  },
  "engagement-couples": {
    hu: "paros-jegyes-fotozas-budapest",
    en: "couples-engagement-photography-budapest",
  },
  wedding: {
    hu: "eskuvoi-fotozas-budapest",
    en: "wedding-photography-budapest",
  },
  "product-ecommerce": {
    hu: "termekfotozas-budapest",
    en: "product-photography-budapest",
  },
  "event-corporate": {
    hu: "rendezvenyfotozas-budapest",
    en: "event-photography-budapest",
  },
  "pet-animal": {
    hu: "kisallat-fotozas-budapest",
    en: "pet-photography-budapest",
  },
  "boudoir-branding": {
    hu: "dating-boost-boudoir-fotozas-budapest",
    en: "dating-boost-boudoir-photography-budapest",
  },
} as const;

export type ServiceSlugId = keyof typeof serviceSlugById;

const serviceSlugAliases: Record<string, ServiceSlugId> = {
  "kismama-fotozas-budapest": "maternity",
  "ujszulott-fotozas-budapest": "maternity",
  "maternity-photography-budapest": "maternity",
  "newborn-photography-budapest": "maternity",
  "dating-profil-fotozas-budapest": "boudoir-branding",
  "dating-profile-photography-budapest": "boudoir-branding",
  "uzleti-portre-fotozas-budapest": "business-portrait",
  "business-portrait-photography-budapest": "business-portrait",
  "boudoir-personal-branding-fotozas-budapest": "boudoir-branding",
  "boudoir-personal-branding-photography-budapest": "boudoir-branding",
};

export function isServiceSlugId(serviceId: string): serviceId is ServiceSlugId {
  return serviceId in serviceSlugById;
}

export function getServiceSlug(serviceId: string, locale: Locale) {
  return isServiceSlugId(serviceId) ? serviceSlugById[serviceId][locale] : serviceId;
}

export function findServiceIdBySlug(slug: string, locale: Locale) {
  const alias = serviceSlugAliases[slug];
  if (alias) return alias;

  return Object.entries(serviceSlugById).find(
    ([, slugs]) => slugs[locale] === slug,
  )?.[0];
}
