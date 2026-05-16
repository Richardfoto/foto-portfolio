import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { SanityImageSource } from "@sanity/image-url";
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { getActivePhotographyServices } from "@/lib/active-services";
import {
  JsonLd,
  absoluteUrl,
  baseOrganizationSchema,
  breadcrumbSchema,
  createMetadata,
  faqSchema,
  imageObjectSchema,
  isLocale,
  photographerSchema,
  schemaGraph,
  site,
  localizedPath,
  type Locale,
} from "@/lib/site";
import {
  serviceSchemaNodes,
  sharedFaqs,
  type PhotographyService,
} from "@/lib/photography-content";
import { memoryFirstCopy } from "@/lib/memory-first-copy";
import { findServiceIdBySlug, getServiceSlug } from "@/lib/service-slugs";

type LocaleParams = Promise<{ locale: string; slug: string }>;

type ServiceMediaItem = {
  serviceId?: string;
  images?: SanityImageSource[];
};

type GalleryLinkItem = {
  serviceId?: string;
  slugCurrent?: string;
  coverImage?: SanityImageSource;
};

type LandingCard = {
  title: string;
  text: string;
};

type LandingFaq = {
  question: string;
  answer: string;
};

type ServiceLandingCopy = {
  fitTitle: string;
  fitLead: string;
  fitItems: LandingCard[];
  processTitle: string;
  processLead: string;
  processSteps: LandingCard[];
  faqTitle: string;
  faqs: LandingFaq[];
};

const serviceMediaQuery = groq`*[
  _type == "service" &&
  defined(serviceId) &&
  !(_id in path("drafts.**"))
]{
  serviceId,
  "images": serviceImages
}`;

const galleryLinkQuery = groq`*[
  _type == "gallery" &&
  defined(service->serviceId) &&
  defined(slug.current) &&
  (!defined(service->inactive) || service->inactive != true)
] | order(featured desc, serviceOrder asc, _createdAt desc){
  "serviceId": service->serviceId,
  "slugCurrent": slug.current,
  coverImage
}`;

const detailCopy = {
  hu: {
    eyebrow: "Richard Foto szolgáltatás",
    includedTitle: "Mit kapsz a fotózásban?",
    included: [
      "rövid előzetes egyeztetés és hangulati irány",
      "helyszín- és öltözékjavaslat, ha szükséges",
      "nyugodt, természetes vezetés a fotózás alatt",
      "gondosan válogatott és utómunkázott képek",
      "privát online galéria letöltési lehetőséggel",
    ],
    pricingTitle: "Bevezető session árak",
    packages: [
      ["Basic", "100 EUR-tól", "rövid, fókuszált kezdés"],
      ["Standard", "200 EUR-tól", "a legtöbb történethez"],
      ["Premium", "400 EUR-tól", "teljes vizuális anyaghoz"],
    ],
    galleryCta: "Kapcsolódó galéria",
    bookingCta: "Ezt az irányt választom",
    servicesCta: "Vissza a szolgáltatásokhoz",
    relatedTitle: "A következő lépés egyszerű.",
    relatedText:
      "Ha ez az irány közel áll hozzád, válaszd ki a foglalásnál. Nem kell kész brief: segítek pontosítani a helyszínt, képi hangulatot és azt, milyen emléket szeretnél hazavinni.",
  },
  en: {
    eyebrow: "Richard Foto service",
    includedTitle: "What the session includes",
    included: [
      "a short consultation and mood direction",
      "location and outfit guidance when needed",
      "calm, natural guidance during the session",
      "carefully selected and edited images",
      "a private online gallery with download access",
    ],
    pricingTitle: "Introductory session rates",
    packages: [
      ["Basic", "EUR 100+", "a short focused start"],
      ["Standard", "EUR 200+", "for most stories"],
      ["Premium", "EUR 400+", "for a complete visual set"],
    ],
    galleryCta: "Related gallery",
    bookingCta: "Choose this direction",
    servicesCta: "Back to services",
    relatedTitle: "The next step is simple.",
    relatedText:
      "If this direction feels close, choose it during booking. You do not need a finished brief: I will help refine the location, visual mood and the memory you want to take with you.",
  },
} as const;

const serviceLandingOverrides: Partial<
  Record<string, Record<Locale, ServiceLandingCopy>>
> = {
  "personal-brand-starter": {
    hu: {
      fitTitle: "Kinek szól a Personal Brand Starter?",
      fitLead:
        "Ha a képeidnek dolgozniuk kell érted: weboldalon, LinkedInen, bemutatkozó anyagban vagy egy új márkaindításnál.",
      fitItems: [
        {
          title: "Vállalkozóknak",
          text: "Akik nem sablonos profilképet, hanem hiteles szakmai jelenlétet szeretnének.",
        },
        {
          title: "Új induláshoz",
          text: "Amikor weboldal, landing oldal vagy bemutatkozó anyag készül, és végre kell egy erős képi alap.",
        },
        {
          title: "LinkedInhez és PR-hoz",
          text: "Tiszta, használható portrékhoz, amelyek nem túl merevek, de komolyan vehetők.",
        },
      ],
      processTitle: "Hogyan zajlik?",
      processLead:
        "Először tisztázzuk, hol fognak megjelenni a képek, utána ehhez igazítjuk a hangulatot, helyszínt és ritmust.",
      processSteps: [
        {
          title: "Cél és felület",
          text: "Megnézzük, webre, LinkedInre, PR anyaghoz vagy márkaindításhoz készül-e a sorozat.",
        },
        {
          title: "Képi irány",
          text: "Kiválasztjuk a helyszínt, öltözéket és azt a tónust, amelyben magabiztos, de természetes maradsz.",
        },
        {
          title: "Vezetett fotózás",
          text: "Nem kell tudnod pózolni: apró instrukciókkal végigvezetlek, hogy a képek élők legyenek.",
        },
        {
          title: "Privát galéria",
          text: "A válogatott, utómunkázott képeket letölthető online galériában kapod meg.",
        },
      ],
      faqTitle: "Personal brand kérdések",
      faqs: [
        {
          question: "Használhatom a képeket LinkedInen és weboldalon?",
          answer:
            "Igen. A sorozatot eleve úgy tervezzük, hogy legyenek profilképre, weboldalra, bemutatkozó felületre és social megjelenésre alkalmas képek.",
        },
        {
          question: "Mi van, ha még nincs kész a márkám vizuális világa?",
          answer:
            "Nem gond. A fotózás előtt elég egy irány vagy hangulat; segítek letisztítani, milyen képek támogatják legjobban a szakmai jelenlétedet.",
        },
      ],
    },
    en: {
      fitTitle: "Who is Personal Brand Starter for?",
      fitLead:
        "For images that need to work for you on a website, LinkedIn, introduction material or a new brand launch.",
      fitItems: [
        {
          title: "Entrepreneurs",
          text: "For people who want credible professional presence instead of a generic profile photo.",
        },
        {
          title: "New launches",
          text: "When a website, landing page or introduction material needs a strong visual base.",
        },
        {
          title: "LinkedIn and PR",
          text: "Clean, useful portraits that feel serious without becoming stiff.",
        },
      ],
      processTitle: "How it works",
      processLead:
        "We first define where the images will live, then shape the mood, location and rhythm around that use.",
      processSteps: [
        {
          title: "Goal and platform",
          text: "We clarify whether the images are for web, LinkedIn, PR material or a brand launch.",
        },
        {
          title: "Visual direction",
          text: "We choose the location, outfits and tone so you can feel confident and natural.",
        },
        {
          title: "Guided session",
          text: "You do not need to know how to pose. I guide you with small, calm instructions.",
        },
        {
          title: "Private gallery",
          text: "You receive the selected and edited images in a downloadable online gallery.",
        },
      ],
      faqTitle: "Personal brand questions",
      faqs: [
        {
          question: "Can I use the images on LinkedIn and my website?",
          answer:
            "Yes. We plan the session so you receive images suitable for profile photos, website sections, introductions and social presence.",
        },
        {
          question: "What if my brand visuals are not final yet?",
          answer:
            "That is fine. A direction or mood is enough; I help refine what kind of images will support your professional presence best.",
        },
      ],
    },
  },
  "content-creator-day": {
    hu: {
      fitTitle: "Kinek szól a Content Creator Day?",
      fitLead:
        "Ha egyetlen napból szeretnél több hétre vagy akár hónapokra előre használható, egységes képi anyagot.",
      fitItems: [
        {
          title: "Online jelenléthez",
          text: "Weboldalra, social csatornákra, hírlevélhez és kampányanyagokhoz.",
        },
        {
          title: "Kampányindításhoz",
          text: "Amikor nem csak portré kell, hanem részletek, werk, hangulat és használható képi készlet.",
        },
        {
          title: "Tartalomhiány ellen",
          text: "Ha eleged van abból, hogy mindig az utolsó pillanatban kell képet keresni egy poszthoz.",
        },
      ],
      processTitle: "Hogyan épül fel a tartalomnap?",
      processLead:
        "Nem véletlen képeket gyártunk, hanem előre kitalált, több felületre használható vizuális rendszert.",
      processSteps: [
        {
          title: "Tartalomterv",
          text: "Átnézzük, milyen felületekre, milyen üzenetekhez és milyen időszakra kell anyag.",
        },
        {
          title: "Shotlist",
          text: "Összerakjuk a portré, werk, részlet, hangulat és webes felhasználás fő képtípusait.",
        },
        {
          title: "Fotózási nap",
          text: "Vezetetten haladunk, hogy a nap végére változatos, mégis egységes sorozat szülessen.",
        },
        {
          title: "Rendszerezett átadás",
          text: "A képeket privát galériában kapod, hogy könnyű legyen később elővenni és használni őket.",
        },
      ],
      faqTitle: "Content Creator Day kérdések",
      faqs: [
        {
          question: "Tényleg elég lehet egy nap több hónapra?",
          answer:
            "Jó előkészítéssel igen. A cél nem az, hogy egyféle kép készüljön sokszor, hanem hogy több helyzetre legyen használható vizuális anyagod.",
        },
        {
          question: "Videót is tartalmaz?",
          answer:
            "Alapból fotós tartalomra épül. Ha videós vagy reels irány is kell, azt külön egyeztetjük a fotózás előtt.",
        },
      ],
    },
    en: {
      fitTitle: "Who is Content Creator Day for?",
      fitLead:
        "For people who want one day to create consistent visual material for weeks or even months ahead.",
      fitItems: [
        {
          title: "Online presence",
          text: "For websites, social channels, newsletters and campaign material.",
        },
        {
          title: "Campaign launches",
          text: "When you need more than portraits: details, werk moments, atmosphere and usable visual assets.",
        },
        {
          title: "Content gaps",
          text: "If you are tired of searching for images at the last minute before every post.",
        },
      ],
      processTitle: "How the content day works",
      processLead:
        "We do not create random images. We build a planned visual system that works across platforms.",
      processSteps: [
        {
          title: "Content plan",
          text: "We review which platforms, messages and time period the images need to support.",
        },
        {
          title: "Shot list",
          text: "We define portraits, werk moments, details, atmosphere and web-ready image types.",
        },
        {
          title: "Session day",
          text: "We move through the day with guidance so the result is varied but visually consistent.",
        },
        {
          title: "Organised delivery",
          text: "You receive the images in a private gallery so they are easy to find and use later.",
        },
      ],
      faqTitle: "Content Creator Day questions",
      faqs: [
        {
          question: "Can one day really cover months of content?",
          answer:
            "With preparation, yes. The goal is not to repeat one image, but to create useful visual material for multiple situations.",
        },
        {
          question: "Does it include video?",
          answer:
            "The base session is built around photography. If you need video or reels direction, we discuss that separately before the shoot.",
        },
      ],
    },
  },
  "boudoir-branding": {
    hu: {
      fitTitle: "Kinek szól a Dating Boost / Boudoir?",
      fitLead:
        "Azoknak, akik őszinte, vonzó és ízléses képeket szeretnének magukról, túlzás és erőltetett szerepjáték nélkül.",
      fitItems: [
        {
          title: "Társkereső profilhoz",
          text: "Ha szeretnéd, hogy végre legyenek rólad jó, természetes és bizalmat építő képek.",
        },
        {
          title: "Önazonos portréhoz",
          text: "Ha nem steril vagy túljátszott képeket keresel, hanem olyan sorozatot, amiben felismered magad.",
        },
        {
          title: "Finom boudoir irányhoz",
          text: "Ha elegáns, visszafogottabb, személyesebb hangulat érdekel, amely nem ijesztő és nem közönséges.",
        },
      ],
      processTitle: "Hogyan lesz természetes?",
      processLead:
        "A cél nem az, hogy valaki másnak tűnj, hanem hogy legyen rólad egy erős, vállalható és emlékezetes kép.",
      processSteps: [
        {
          title: "Hatás és határok",
          text: "Előre megbeszéljük, milyen képeket szeretnél, mi komfortos, és mi az, amit biztosan nem.",
        },
        {
          title: "Helyszín és ruha",
          text: "Olyan irányt választunk, amelyben jól mozogsz, és ami illik hozzád.",
        },
        {
          title: "Nyugodt vezetés",
          text: "A fotózáson apró instrukciókkal segítek, hogy ne kelljen szerepelned.",
        },
        {
          title: "Privát átadás",
          text: "A kész képek privát online galériában érkeznek, diszkrét és letölthető formában.",
        },
      ],
      faqTitle: "Dating Boost kérdések",
      faqs: [
        {
          question: "Kell hozzá modell tapasztalat?",
          answer:
            "Nem. Ez pont azoknak szól, akik nem rutinosak kamera előtt, de szeretnének végre jó, természetes képeket magukról.",
        },
        {
          question: "Lehet teljesen visszafogott irányban is?",
          answer:
            "Igen. A boudoir itt nem kötelezően merész vagy kihívó; lehet elegáns, finom, karakteres portré is.",
        },
        {
          question: "Használhatom társkereső profilhoz?",
          answer:
            "Igen, a Dating Boost egyik fő célja, hogy természetes, bizalomépítő képeket kapj profilhoz vagy bemutatkozáshoz.",
        },
      ],
    },
    en: {
      fitTitle: "Who is Dating Boost / Boudoir for?",
      fitLead:
        "For people who want honest, attractive and tasteful images of themselves without exaggeration or forced performance.",
      fitItems: [
        {
          title: "Dating profiles",
          text: "If you finally want good, natural images that build trust before the first message.",
        },
        {
          title: "Authentic portraits",
          text: "If you do not want sterile or overplayed images, but a series where you recognise yourself.",
        },
        {
          title: "Soft boudoir direction",
          text: "If you are interested in an elegant, subtle and personal mood without an overplayed look.",
        },
      ],
      processTitle: "How it stays natural",
      processLead:
        "The goal is not to make you look like someone else, but to create a strong, honest and memorable image of you.",
      processSteps: [
        {
          title: "Mood and boundaries",
          text: "We discuss what you want, what feels comfortable and what is definitely not your direction.",
        },
        {
          title: "Location and clothes",
          text: "We choose a direction that suits you and allows you to move naturally.",
        },
        {
          title: "Calm guidance",
          text: "I guide with small instructions so you do not have to perform.",
        },
        {
          title: "Private delivery",
          text: "The finished images arrive in a discreet, downloadable private online gallery.",
        },
      ],
      faqTitle: "Dating Boost questions",
      faqs: [
        {
          question: "Do I need modelling experience?",
          answer:
            "No. This is made for people who are not used to the camera but want good, natural images of themselves.",
        },
        {
          question: "Can it be very subtle?",
          answer:
            "Yes. Boudoir here does not have to mean bold or provocative; it can be elegant, soft and character-driven.",
        },
        {
          question: "Can I use the images for dating profiles?",
          answer:
            "Yes. Dating Boost is designed to create natural, trust-building images for profiles and introductions.",
        },
      ],
    },
  },
  maternity: {
    hu: {
      fitTitle: "Kinek szól a kismama és újszülött fotózás?",
      fitLead:
        "Ha szeretnéd megőrizni ezt az időszakot szépen, nyugodtan és emberien, túlzott beállítások nélkül.",
      fitItems: [
        {
          title: "Várandósság idején",
          text: "Finom, természetes kismama képekhez, amelyek nem díszletnek, hanem emléknek készülnek.",
        },
        {
          title: "Az első hetekben",
          text: "Újszülött fotózáshoz otthoni, türelmes, természetes ritmusban.",
        },
        {
          title: "Egyben vagy külön",
          text: "Lehet külön kismama vagy baba sorozat, de össze is kapcsolhatjuk egy teljesebb kezdettörténetté.",
        },
      ],
      processTitle: "Hogyan lesz nyugodt?",
      processLead:
        "A fotózás ritmusát hozzátok igazítom, különösen újszülött és családi helyzetben.",
      processSteps: [
        {
          title: "Időzítés",
          text: "Egyeztetjük, hogy kismama, újszülött vagy összekapcsolt csomag lenne a legjobb.",
        },
        {
          title: "Helyszín",
          text: "Lehet otthon, természetes fényben, kültéren vagy olyan helyen, ahol biztonságban érzitek magatokat.",
        },
        {
          title: "Türelem",
          text: "Baba és család mellett nincs rohanás; a jó képekhez nyugalom kell.",
        },
        {
          title: "Örök emlék",
          text: "A kész sorozat célja, hogy később is visszavigyen abba az időszakba.",
        },
      ],
      faqTitle: "Kismama és újszülött kérdések",
      faqs: [
        {
          question: "Mikor érdemes kismama fotózást foglalni?",
          answer:
            "Általában a harmadik trimeszter eleje-közepe ideális, de a pontos időzítést mindig a komfortodhoz igazítjuk.",
        },
        {
          question: "Az újszülött fotózás lehet otthon?",
          answer:
            "Igen, kifejezetten jó irány lehet, mert az otthoni közeg nyugodtabb és személyesebb.",
        },
      ],
    },
    en: {
      fitTitle: "Who is maternity and newborn photography for?",
      fitLead:
        "For preserving this chapter beautifully, calmly and humanly without overly staged images.",
      fitItems: [
        {
          title: "During pregnancy",
          text: "Soft, natural maternity images made as memories rather than decoration.",
        },
        {
          title: "In the first weeks",
          text: "Newborn photography at home or in a calm natural rhythm.",
        },
        {
          title: "Together or separate",
          text: "You can book maternity or newborn separately, or connect them into one fuller beginning story.",
        },
      ],
      processTitle: "How it stays calm",
      processLead:
        "The rhythm of the session adapts to you, especially with newborn and family situations.",
      processSteps: [
        {
          title: "Timing",
          text: "We decide whether maternity, newborn or a connected package fits best.",
        },
        {
          title: "Location",
          text: "It can happen at home, in natural light, outdoors or anywhere you feel safe.",
        },
        {
          title: "Patience",
          text: "With babies and families there is no rush. Good images need calm.",
        },
        {
          title: "Lasting memory",
          text: "The aim is to create a series that takes you back to this time later.",
        },
      ],
      faqTitle: "Maternity and newborn questions",
      faqs: [
        {
          question: "When should I book a maternity session?",
          answer:
            "The early to middle part of the third trimester is often ideal, but timing always follows your comfort.",
        },
        {
          question: "Can the newborn session happen at home?",
          answer:
            "Yes. Home is often a beautiful option because it feels calmer and more personal.",
        },
      ],
    },
  },
};

function createDefaultLandingCopy(
  service: PhotographyService,
  locale: Locale,
): ServiceLandingCopy {
  if (locale === "hu") {
    return {
      fitTitle: `Kinek szól a ${service.shortTitle.hu}?`,
      fitLead:
        "Ha olyan fotózást keresel, ahol nem egy sablont kell eljátszanod, hanem a saját történeted kap jó formát.",
      fitItems: [
        {
          title: "Ha van egy alkalom",
          text: "Lehet konkrét esemény, új fejezet, szakmai cél vagy személyes emlék, amit szeretnél jól megőrizni.",
        },
        {
          title: "Ha kell vezetés",
          text: "Nem kell rutinosnak lenned kamera előtt; segítek mozdulatban, tempóban és hangulatban.",
        },
        {
          title: "Ha fontos az időtállóság",
          text: "A cél nem az aktuális trend másolása, hanem olyan képek készítése, amelyek később is vállalhatóak.",
        },
      ],
      processTitle: "Hogyan zajlik a fotózás?",
      processLead:
        "A folyamat egyszerű: rövid egyeztetés, tiszta irány, nyugodt fotózás és átlátható átadás.",
      processSteps: [
        {
          title: "Egyeztetés",
          text: "Megbeszéljük, milyen képekre van szükséged, mire használod őket, és milyen hangulat áll közel hozzád.",
        },
        {
          title: "Előkészítés",
          text: "Helyszínt, ruhát és képi irányt választunk, hogy a fotózás ne a bizonytalanságról szóljon.",
        },
        {
          title: "Vezetett fotózás",
          text: "A fotózás alatt finoman irányítalak, közben figyelek arra, hogy a képek természetesek maradjanak.",
        },
        {
          title: "Átadás",
          text: "A válogatott, utómunkázott képeket privát online galériában kapod meg.",
        },
      ],
      faqTitle: "Gyakori kérdések",
      faqs: [
        {
          question: "Mi van, ha nem tudom pontosan, milyen képet szeretnék?",
          answer:
            "Ez teljesen rendben van. Elég, ha elmondod, mire van szükséged vagy milyen érzést keresel; segítek képi irányt találni hozzá.",
        },
        {
          question: "Kapok segítséget a fotózás közben?",
          answer:
            "Igen. A fotózás vezetett, de nem merev. Apró instrukciókkal segítek, hogy ne szerepnek, hanem önmagadnak hass.",
        },
      ],
    };
  }

  return {
    fitTitle: `Who is ${service.shortTitle.en} for?`,
    fitLead:
      "For people who want a guided session where their own story gets a clear visual shape instead of a forced template.",
    fitItems: [
      {
        title: "If there is a moment",
        text: "It can be an event, a new chapter, a professional goal or a personal memory you want to preserve well.",
      },
      {
        title: "If you need guidance",
        text: "You do not need camera experience. I help with movement, pace and mood throughout the session.",
      },
      {
        title: "If timelessness matters",
        text: "The goal is not to copy a trend, but to create images you will still stand behind later.",
      },
    ],
    processTitle: "How the session works",
    processLead:
      "The process is simple: a short consultation, clear direction, a calm session and transparent delivery.",
    processSteps: [
      {
        title: "Consultation",
        text: "We discuss what images you need, where you will use them and what kind of mood feels close.",
      },
      {
        title: "Preparation",
        text: "We choose location, clothes and visual direction so the session does not feel uncertain.",
      },
      {
        title: "Guided session",
        text: "During the shoot I guide gently while keeping the images natural and recognisably yours.",
      },
      {
        title: "Delivery",
        text: "You receive the selected and edited images in a private online gallery.",
      },
    ],
    faqTitle: "Common questions",
    faqs: [
      {
        question: "What if I do not know exactly what kind of images I want?",
        answer:
          "That is completely fine. It is enough to tell me what you need or what feeling you are looking for; I help translate that into a visual direction.",
      },
      {
        question: "Will I get guidance during the session?",
        answer:
          "Yes. The session is guided but not stiff. I use small instructions so you can look like yourself instead of performing.",
      },
    ],
  };
}

function getLandingCopy(service: PhotographyService, locale: Locale) {
  return (
    serviceLandingOverrides[service.id]?.[locale] ??
    createDefaultLandingCopy(service, locale)
  );
}

function findService(
  services: PhotographyService[],
  slug: string,
  locale: Locale,
) {
  const serviceId = findServiceIdBySlug(slug, locale);
  return serviceId ? services.find((service) => service.id === serviceId) : null;
}

function getImageUrl(image: SanityImageSource | undefined, width = 1400) {
  if (!image) return null;
  return urlFor(image)
    .ignoreImageParams()
    .width(width)
    .fit("max")
    .format("webp")
    .quality(88)
    .url();
}

export async function generateMetadata(props: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";
  const services = await getActivePhotographyServices();
  const service = findService(services, slug, locale);

  if (!service) {
    return createMetadata({
      locale,
      path: `/services/${slug}`,
      title: "Service | Richard Foto",
      description:
        locale === "hu"
          ? "Richard Foto fotózási szolgáltatás Budapesten."
          : "Richard Foto photography service in Budapest.",
      noIndex: true,
    });
  }

  const title =
    locale === "hu"
      ? `${service.title.hu} Budapest | Richard Foto`
      : `${service.title.en} Budapest | Richard Foto`;

  const metadata = createMetadata({
    locale,
    path: `/services/${slug}`,
    title,
    description: memoryFirstCopy(service.description[locale], locale),
    keywords: service.keywords[locale],
  });

  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      canonical: absoluteUrl(
        localizedPath(locale, `/services/${getServiceSlug(service.id, locale)}`),
      ),
      languages: {
        hu: absoluteUrl(
          localizedPath("hu", `/services/${getServiceSlug(service.id, "hu")}`),
        ),
        en: absoluteUrl(
          localizedPath("en", `/services/${getServiceSlug(service.id, "en")}`),
        ),
        "x-default": absoluteUrl(
          localizedPath("hu", `/services/${getServiceSlug(service.id, "hu")}`),
        ),
      },
    },
  };
}

export default async function ServiceDetailPage(props: { params: LocaleParams }) {
  const { locale: rawLocale, slug } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";
  const copy = detailCopy[locale];
  const services = await getActivePhotographyServices();
  const service = findService(services, slug, locale);
  if (!service) notFound();

  const serviceIds = [
    service.imageServiceId ?? service.id,
    ...(service.relatedServiceIds ?? []),
  ];
  const [serviceMedia, galleries] = await Promise.all([
    client.fetch<ServiceMediaItem[]>(serviceMediaQuery),
    client.fetch<GalleryLinkItem[]>(galleryLinkQuery),
  ]);
  const images = serviceIds.flatMap(
    (serviceId) =>
      serviceMedia.find((item) => item.serviceId === serviceId)?.images?.filter(Boolean) ?? [],
  );
  const gallery = galleries.find(
    (item) => item.serviceId && serviceIds.includes(item.serviceId),
  );
  const galleryImage = gallery?.coverImage ? [gallery.coverImage] : [];
  const displayImages = images.length ? images : galleryImage;
  const heroImageUrl = getImageUrl(displayImages[0], 1800);
  const currentSlug = getServiceSlug(service.id, locale);
  const landingCopy = getLandingCopy(service, locale);
  const pageFaqs = [...landingCopy.faqs, ...sharedFaqs[locale]];

  const graph = schemaGraph([
    baseOrganizationSchema(locale),
    photographerSchema(locale),
    ...serviceSchemaNodes(locale, [service]),
    imageObjectSchema({
      locale,
      path: `/services/${currentSlug}`,
      caption: service.title[locale],
      contentUrl: heroImageUrl ?? undefined,
    }),
    breadcrumbSchema(locale, [
      { name: site.name, path: "/" },
      {
        name: locale === "hu" ? "Szolgáltatások" : "Services",
        path: "/services",
      },
      { name: service.title[locale], path: `/services/${currentSlug}` },
    ]),
    faqSchema(pageFaqs),
  ]);

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-neutral-950">
      <JsonLd data={graph} />

      <section className="bg-neutral-950 px-5 pb-12 pt-28 text-[#fff8e8] md:px-8 md:pb-16 md:pt-36">
        <div className="reveal-up mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="mb-6 text-xs uppercase tracking-[0.32em] text-[#fff8e8]/45">
              {copy.eyebrow}
            </p>
            <h1 className="max-w-4xl font-serif text-5xl font-normal leading-[0.92] tracking-[-0.045em] text-[#fff8e8] md:text-7xl">
              {service.title[locale]}
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-[#fff8e8]/70">
              {memoryFirstCopy(service.description[locale], locale)}
            </p>
            <div className="mt-10 flex flex-col gap-3 text-sm uppercase tracking-[0.16em] sm:flex-row">
              <Link
                href={`/${locale}/booking?service=${service.id}#booking-date`}
                className="bg-white px-6 py-4 text-center text-neutral-950 transition-colors hover:bg-neutral-200"
              >
                {copy.bookingCta}
              </Link>
              {gallery?.slugCurrent && (
                <Link
                  href={`/${locale}/gallery/${gallery.slugCurrent}`}
                  className="border border-white/35 px-6 py-4 text-center text-white transition-colors hover:bg-white hover:text-neutral-950"
                >
                  {copy.galleryCta}
                </Link>
              )}
            </div>
          </div>

          {heroImageUrl && (
            <figure className="relative min-h-[420px] overflow-hidden bg-neutral-900 md:min-h-[520px]">
              <Image
                src={heroImageUrl}
                alt={service.alt[locale]}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="image-soft-motion object-contain p-2"
              />
            </figure>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="reveal-on-scroll">
            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-neutral-400">
              {service.shortTitle[locale]}
            </p>
            <h2 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">
              {landingCopy.fitTitle}
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-neutral-600">
              {landingCopy.fitLead}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {landingCopy.fitItems.map((item) => (
              <article
                key={item.title}
                className="border border-neutral-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,15,15,0.04)]"
              >
                <h3 className="font-serif text-2xl leading-tight">
                  {item.title}
                </h3>
                <p className="mt-5 text-sm leading-7 text-neutral-600">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-white px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="reveal-on-scroll">
            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-neutral-400">
              {locale === "hu" ? "Folyamat" : "Process"}
            </p>
            <h2 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">
              {landingCopy.processTitle}
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-neutral-600">
              {landingCopy.processLead}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {landingCopy.processSteps.map((step, index) => (
              <article
                key={step.title}
                className="group border border-neutral-200 bg-[#fbfaf7] p-6 transition-colors hover:border-neutral-950"
              >
                <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-8 font-serif text-2xl leading-tight">
                  {step.title}
                </h3>
                <p className="mt-5 text-sm leading-7 text-neutral-600">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[0.95fr_1.05fr] md:py-28">
        <div className="reveal-on-scroll">
          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-neutral-400">
            {service.shortTitle[locale]}
          </p>
          <h2 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">
            {copy.includedTitle}
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {copy.included.map((item) => (
            <p
              key={item}
              className="border-t border-neutral-200 pt-4 text-sm leading-7 text-neutral-600"
            >
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="bg-[#f0ece4] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-4xl tracking-tight md:text-5xl">
            {copy.pricingTitle}
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {copy.packages.map(([name, price, label], index) => (
              <article
                key={name}
                className={`border p-6 ${
                  index === 1
                    ? "border-[#b79d66] bg-[#fff8e8]"
                    : "border-neutral-200 bg-white"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                  {label}
                </p>
                <h3 className="mt-5 font-serif text-3xl">{name}</h3>
                <p className="mt-6 font-serif text-4xl">{price}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:py-28">
        <div className="reveal-on-scroll mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.78fr_1.22fr] md:items-center">
          <h2 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">
            {copy.relatedTitle}
          </h2>
          <div>
            <p className="text-lg leading-8 text-neutral-600">
              {copy.relatedText}
            </p>
            <div className="mt-10">
              <Link
                href={`/${locale}/booking?service=${service.id}#booking-date`}
                className="inline-flex w-full items-center justify-center bg-neutral-950 px-8 py-5 text-center text-sm uppercase tracking-[0.2em] text-white shadow-[0_24px_60px_rgba(20,20,20,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-[0_30px_80px_rgba(20,20,20,0.24)] sm:w-auto"
              >
                {copy.bookingCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-neutral-400">
              FAQ
            </p>
            <h2 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">
              {landingCopy.faqTitle}
            </h2>
          </div>
          <div className="divide-y divide-neutral-200 border-y border-neutral-200">
            {landingCopy.faqs.map((faq) => (
              <article key={faq.question} className="py-7">
                <h3 className="text-base font-medium text-neutral-950">
                  {faq.question}
                </h3>
                <p className="mt-4 text-sm leading-7 text-neutral-600">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-[#fbfaf7] px-6 py-10">
        <div className="mx-auto flex max-w-6xl justify-center">
          <Link
            href={`/${locale}/services`}
            className="border border-neutral-950/15 px-6 py-4 text-center text-xs uppercase tracking-[0.18em] text-neutral-600 transition-colors hover:border-neutral-950 hover:text-neutral-950"
          >
            {copy.servicesCta}
          </Link>
        </div>
      </section>
    </main>
  );
}
