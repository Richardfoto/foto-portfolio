import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { SanityImageSource } from "@sanity/image-url";
import { groq } from "next-sanity";
import FeaturedRotator from "./components/FeaturedRotator";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import {
  JsonLd,
  baseOrganizationSchema,
  breadcrumbSchema,
  createMetadata,
  faqSchema,
  imageObjectSchema,
  isLocale,
  photographerSchema,
  schemaGraph,
  site,
  type Locale,
} from "@/lib/site";
import {
  serviceKeywords,
  serviceSchemaNodes,
  sharedFaqs,
} from "@/lib/photography-content";
import { getActivePhotographyServices } from "@/lib/active-services";
import { getServiceSlug } from "@/lib/service-slugs";

type LocaleParams = Promise<{ locale: string }>;

type AboutHome = {
  aboutImage?: SanityImageSource;
  profileImage?: SanityImageSource;
};

type HeroHome = {
  headerEyebrow?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  image?: SanityImageSource;
  images?: SanityImageSource[];
  workingImage?: SanityImageSource;
  headerPrimaryCta?: string;
  headerSecondaryCta?: string;
  seoTitle?: string;
  seoDescription?: string;
};

type GalleryItem = {
  _id: string;
  title: string;
  category?: string;
  serviceId?: string;
  coverImage?: SanityImageSource;
};

type HomeSessions = {
  personalBrandStarterImage?: SanityImageSource;
  lifestyleStorySessionImage?: SanityImageSource;
  contentCreatorDayImage?: SanityImageSource;
  datingBoostImage?: SanityImageSource;
  modelApplicationImage?: SanityImageSource;
};

const heroQuery = groq`coalesce(
  *[_id == "hero"][0],
  *[_type == "hero" && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]
){
  headerEyebrow,
  headerTitle,
  headerSubtitle,
  image,
  images,
  workingImage,
  headerPrimaryCta,
  headerSecondaryCta,
  seoTitle,
  seoDescription
}`;
const heroSeoQuery = groq`coalesce(
  *[_id == "hero"][0],
  *[_type == "hero" && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]
){
  seoTitle,
  seoDescription
}`;
const homeSessionsQuery = groq`coalesce(
  *[_id == "homeSessions"][0],
  *[_type == "homeSessions" && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]
){
  personalBrandStarterImage,
  lifestyleStorySessionImage,
  contentCreatorDayImage,
  datingBoostImage,
  modelApplicationImage
}`;
const aboutQuery = groq`coalesce(
  *[_id == "about"][0],
  *[_type == "about" && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]
){ aboutImage, profileImage }`;
const featuredQuery = groq`*[
  _type == "gallery" &&
  featured == true &&
  (!defined(service->inactive) || service->inactive != true)
] | order(service->order asc, _createdAt desc)[0...8]{
  _id,
  title,
  category,
  "serviceId": service->serviceId,
  coverImage
}`;
const galleryQuery = groq`*[
  _type == "gallery" &&
  (!defined(service->inactive) || service->inactive != true)
] | order(service->order asc, _createdAt desc)[0...50]{
  _id,
  title,
  category,
  "serviceId": service->serviceId,
  coverImage
}`;

const homeCopy = {
  hu: {
    heroEyebrow: "Budapest • filmes hangulatú fotózás • 2015 óta",
    heroTitle: "Budapest\nfotózás\nValódi pillanatok.",
    heroSubtitle:
      "Vezetett, mégis kötetlen hangulatú fotózás.\nMinden egy kávéval kezdődik, és egy történettel ér véget.",
    primaryCta: "Röviden, Igy képzeld el",
    secondaryCta: "Melyik stílus illik hozzád?",
    introTitle: "Gyere, meséld el a történeted, és csináljunk egy különleges képet.",
    intro: [
      "Engedd meg, hogy megmutassam, hogyan dolgozunk.",
    ],
    introCta: "Forgatás menete",
    introHref: "/process",
    trendingEyebrow: "Trending sessions",
    trendingTitle:
      "Modern fotózási belépők webdesign építéshez.",
    trendingLead:
      "Öt irány, öt különböző vizuális cél. Gyors indulópontok, hogy könnyebb legyen választani. Válaszd azt, amelyik most a legközelebb áll hozzád, és a foglalásnál együtt pontosítjuk a részleteket.",
    trendingSessions: [
      {
        id: "personal-brand-starter",
        title: "Personal Brand Starter",
        label: "vállalkozóknak és szakmai jelenléthez",
        description:
          "Képek, amelyek megmutatják, mit képviselsz: weboldalra, LinkedInre, bemutatkozáshoz vagy márkaindításhoz.",
        cta: "Márkaképeket kérek",
        serviceId: "personal-brand-starter",
      },
      {
        id: "lifestyle-story-session",
        title: "Lifestyle\nStory\nSession",
        label: "Egy igazi kép rólad",
        description: "",
        cta: "Lifestyle sorozatot kérek",
        serviceId: "lifestyle-story-session",
      },
      {
        id: "content-creator-day",
        title: "Content\nCreator Day",
        label: "",
        description: "Egy nap akár fél évnyi tartalom",
        cta: "Marketing Kampány indítása",
        serviceId: "content-creator-day",
      },
      {
        id: "dating-boost",
        title: "Dating\nBoost",
        label: "önazonos portrékhoz",
        description:
          "Könnyed, természetes portrék társkereső profilhoz vagy egyszerűen ahhoz, hogy végre legyenek rólad jó, őszinte képek.",
        cta: "Dating boostot kérek",
        serviceId: "boudoir-branding",
      },
      {
        id: "model-application",
        title: "Vintage Fotózás",
        label: "Kedvezményes",
        description: "",
        cta: "Jelentkezem modellnek",
        href: "/model",
      },
    ],
    servicesEyebrow: "Fotózási területek",
    servicesTitle: "Modern és klasszikus csomagok, az igényekhez igazodva",
    servicesLead:
      "Van tapasztalatom és futó projektem többféle fotózási helyzetben, mégis az a legfontosabb, hogy megtaláljuk a közös ritmust. Szeretem, amikor jó flow-ban dolgozunk; sok minden a tervezésen múlik, a hangulat pedig rajtunk. Nyugodtan bízd rám magad, mutatok pár irányt, amiben tudok segíteni.",
    serviceRailLabel: "Válassz történetet",
    captionsLabel: "Képi irány",
    experienceTitle: "A fotózás nem csak az elkészült képekből áll.",
    experienceText:
      "A teljes élmény számít: hogyan érkezel meg, mennyire érzed magad biztonságban, mikor engedjük el a kameratudatot, és milyen könnyű végül kiválasztani a képeket. Ezért a rendelési folyamat rövid, személyes és vezetett marad.",
    experienceItems: [
      "segítek kiválasztani a megfelelő fotózási típust",
      "nem kell előre tudnod, hogyan állj vagy mit csinálj",
      "a foglalás után világos következő lépéseket kapsz",
    ],
    howTitle: "Hogyan dolgozunk együtt?",
    howSteps: [
      {
        title: "Rövid egyeztetés",
        text: "Megértem, mire van szükséged, milyen képi világ áll közel hozzád, és hol lesz természetes a történet.",
      },
      {
        title: "Finom tervezés",
        text: "Helyszín, fény, ruhák és ritmus: nem túlbonyolítjuk, csak megteremtjük a nyugodt keretet.",
      },
      {
        title: "Fotózás jelenléttel",
        text: "Nem hagylak magadra a kamera előtt, de nem is irányítalak túl. A legjobb képeknek levegő kell.",
      },
      {
        title: "Válogatás és átadás",
        text: "A kész, gondosan utómunkázott képek privát online galériában érkeznek, maximum 7 munkanapon belül.",
      },
    ],
    whyTitle: "Miért Richard Foto?",
    values: [
      {
        title: "Bizalom",
        text: "Nyugodt, figyelmes folyamat, ahol nem kell tudnod, hogyan kell pózolni.",
      },
      {
        title: "Őszinteség",
        text: "Valódi érzelmek, természetes mozdulatok, erőltetett jelenetek nélkül.",
      },
      {
        title: "Időtállóság",
        text: "Letisztult képek, amelyek nem trendet akarnak követni, hanem emléket őriznek.",
      },
    ],
    stats: ["2015 óta", "több fotózási irány", "max. 7 napos átadás"],
    testimonial:
      "Egy jó élmény fotózása után nem csak kép marad, hanem érzés is.",
    giftTitle: "Fotózást ajándékba?",
    giftText:
      "Egy fotózás lehet ajándék is: kismamáknak, családoknak, pároknak vagy valakinek, aki régóta szeretne magáról természetes, erős képeket. Ajándékutalványt egyedi üzenettel is készíthetünk.",
    giftCta: "Ajándékutalvány egyeztetése",
    accordionCta: "Ezt az irányt választom",
    finalTitle: "Ha fontos, hogy a képek rólad szóljanak, kezdjük el.",
    finalText:
      "Írj néhány sort arról, milyen pillanatot szeretnél megőrizni, és együtt megtaláljuk hozzá a legtermészetesebb formát.",
    finalCta: "Foglalás indítása",
  },
  en: {
    heroEyebrow: "Budapest • cinematic photography • since 2015",
    heroTitle: "Budapest\nphotography\nReal moments.",
    heroSubtitle:
      "Quiet storytelling photography in Budapest for people who do not want to perform in front of the camera, but finally feel like themselves.",
    primaryCta: "Filming flow",
    secondaryCta: "Which style fits you?",
    introTitle: "Come tell me your story, and let us create a special image.",
    intro: [
      "I look for the moment when you stop thinking about the camera. A half-smile, a gesture, a quiet pause: the point where the photograph starts to feel like you.",
      "I watch the light, the rhythm and the situation, while leaving enough room for the images to breathe. Together, we create a frame for the moment.",
      "That is why the session feels less like performing and more like a guided conversation. The final images are not strangely perfect; they are recognisably yours.",
    ],
    introCta: "Filming flow",
    introHref: "/process",
    trendingEyebrow: "Trending sessions",
    trendingTitle:
      "Modern session entries for people who know what they want the images to feel like.",
    trendingLead:
      "These are not rigid package names; they are easier starting points. Choose the one closest to your current season, and we will refine the details during booking.",
    trendingSessions: [
      {
        id: "personal-brand-starter",
        title: "Personal Brand Starter",
        label: "for founders and professional presence",
        description:
          "Clean portraits and werk-style imagery for websites, LinkedIn, introductions or the beginning of a new brand chapter.",
        cta: "Request brand images",
        serviceId: "personal-brand-starter",
      },
      {
        id: "lifestyle-story-session",
        title: "Lifestyle\nStory\nSession",
        label: "A real image of you",
        description: "",
        cta: "Request a lifestyle story",
        serviceId: "lifestyle-story-session",
      },
      {
        id: "content-creator-day",
        title: "Content\nCreator Day",
        label: "",
        description: "One day, up to half a year of content",
        cta: "Start a marketing campaign",
        serviceId: "content-creator-day",
      },
      {
        id: "dating-boost",
        title: "Dating\nBoost",
        label: "for honest personal portraits",
        description:
          "Relaxed, natural portraits for dating profiles or simply for finally having strong, honest photographs of yourself.",
        cta: "Request a dating boost",
        serviceId: "boudoir-branding",
      },
      {
        id: "model-application",
        title: "Vintage Session",
        label: "Discounted",
        description: "",
        cta: "Apply as a model",
        href: "/model",
      },
    ],
    servicesEyebrow: "Photography fields",
    servicesTitle:
      "I work across different fields, but I always look for the right connection.",
    servicesLead:
      "I have experience and ongoing projects in several kinds of photography, but the most important part is finding a shared rhythm with the person in front of me. I love when the flow is good; a lot comes down to planning, and the mood is something we create together. You can relax and trust the process. Here are a few directions where I can help.",
    serviceRailLabel: "Choose your story",
    captionsLabel: "Visual direction",
    experienceTitle: "A session is more than the finished photographs.",
    experienceText:
      "The whole experience matters: how you arrive, how safe you feel, when camera-awareness fades and how easy it is to choose your images afterwards. That is why the booking flow stays short, personal and guided.",
    experienceItems: [
      "I help you choose the right kind of session",
      "you do not need to know how to pose in advance",
      "after booking, you receive clear next steps",
    ],
    howTitle: "How it works",
    howSteps: [
      {
        title: "Short consultation",
        text: "I learn what you need, what visual mood feels close to you and where the story will feel natural.",
      },
      {
        title: "Gentle planning",
        text: "Location, light, clothes and rhythm: we do not overcomplicate it, we simply create a calm frame.",
      },
      {
        title: "Present photography",
        text: "I do not leave you alone in front of the camera, and I do not over-direct. The best images need room.",
      },
      {
        title: "Selection and delivery",
        text: "Your carefully edited images arrive in a private online gallery within maximum 7 business days.",
      },
    ],
    whyTitle: "Why choose Richard Foto?",
    values: [
      {
        title: "Trust",
        text: "A calm, attentive process where you do not need to know how to pose.",
      },
      {
        title: "Honesty",
        text: "Real emotion, natural movement and no forced scenes.",
      },
      {
        title: "Timelessness",
        text: "Clean images that do not chase a trend, but preserve a memory.",
      },
    ],
    stats: ["Since 2015", "several photography directions", "max. 7 day delivery"],
    testimonial:
      "Richard made me comfortable in front of the camera. The images are not staged, yet they beautifully hold the season we wanted to remember.",
    giftTitle: "A photo session as a gift?",
    giftText:
      "A session can also be a gift: for expecting mothers, families, couples or someone who has long wanted natural, strong images of themselves. Gift vouchers can be prepared with a personal message.",
    giftCta: "Ask about a gift voucher",
    accordionCta: "Choose this direction",
    finalTitle: "If the photographs should feel like you, let us begin.",
    finalText:
      "Send a few lines about the moment you want to preserve, and we will find the most natural form for it together.",
    finalCta: "Start booking",
  },
} as const;

export async function generateMetadata(props: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale: rawLocale } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";
  const isHu = locale === "hu";
  const heroSeo = isHu
    ? await client.fetch<Pick<HeroHome, "seoTitle" | "seoDescription"> | null>(
        heroSeoQuery,
      )
    : null;
  const title =
    isHu && heroSeo?.seoTitle?.trim()
      ? heroSeo.seoTitle
      : isHu
        ? "Richard Foto | Történetmesélő lifestyle fotózás Budapest"
        : "Richard Foto | Storytelling Lifestyle Photography Budapest";
  const description =
    isHu && heroSeo?.seoDescription?.trim()
      ? heroSeo.seoDescription
      : isHu
        ? "Időtlen, természetes lifestyle, werk, családi, kismama, újszülött, esküvői és portré fotózás Budapesten. Valódi pillanatok, filmes hangulatban."
        : "Timeless natural lifestyle, werk, family, maternity, newborn, wedding and portrait photography in Budapest. Real moments with a cinematic feeling.";

  return createMetadata({
    locale,
    path: "/",
    title,
    description,
    keywords: [
      ...serviceKeywords(locale),
      ...(isHu
        ? [
            "personal brand fotózás Budapest",
            "lifestyle story session Budapest",
            "content creator fotózás Budapest",
            "dating profil fotózás Budapest",
          ]
        : [
            "personal brand photography Budapest",
            "lifestyle story session Budapest",
            "content creator photography Budapest",
            "dating profile photography Budapest",
          ]),
    ],
  });
}

function getSanityImageUrl(
  image: SanityImageSource | undefined,
  width: number,
  height?: number,
  quality = 84,
) {
  if (!image) return null;
  const builder = urlFor(image)
    .ignoreImageParams()
    .width(width)
    .format("webp")
    .quality(quality);
  return height ? builder.height(height).fit("max").url() : builder.url();
}

export default async function Home(props: { params: LocaleParams }) {
  const { locale: rawLocale } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";
  const copy = homeCopy[locale];

  const [hero, homeSessions, about, activeServices, featured, gallery] = await Promise.all([
    client.fetch<HeroHome | null>(heroQuery),
    client.fetch<HomeSessions | null>(homeSessionsQuery),
    client.fetch<AboutHome | null>(aboutQuery),
    getActivePhotographyServices(),
    client.fetch<GalleryItem[]>(featuredQuery),
    client.fetch<GalleryItem[]>(galleryQuery),
  ]);
  const serviceLabelById = new Map(
    activeServices.map((service) => [service.id, service.title[locale]]),
  );
  const localizeGalleryCategory = (item: GalleryItem): GalleryItem => {
    const serviceLabel = item.serviceId
      ? serviceLabelById.get(item.serviceId)
      : undefined;

    return {
      ...item,
      title:
        item.serviceId === "business-portrait"
          ? "Werkfotózás"
          : item.title,
      category:
        serviceLabel ??
        item.category,
    };
  };
  const localizedFeatured = featured.map(localizeGalleryCategory);
  const localizedGallery = gallery.map(localizeGalleryCategory);

  const heroImageUrl = getSanityImageUrl(
    hero?.image ?? hero?.images?.[0],
    1600,
    1000,
    69,
  );
  const aboutImageUrl = getSanityImageUrl(
    hero?.workingImage ?? about?.aboutImage ?? about?.profileImage,
    900,
    1100,
    84,
  );
  const homeText = (value: string | undefined, fallback: string) => {
    const text = value?.trim();
    const isInternalLabel =
      text === "Főoldal hero" ||
      text === "Hero" ||
      text === "Főoldali hero";

    return locale === "hu" && text && !isInternalLabel ? text : fallback;
  };
  const heroEyebrow = homeText(hero?.headerEyebrow, copy.heroEyebrow);
  const heroTitle = homeText(hero?.headerTitle, copy.heroTitle);
  const heroSubtitle = homeText(hero?.headerSubtitle, copy.heroSubtitle);
  const primaryCta = homeText(hero?.headerPrimaryCta, copy.primaryCta);
  const secondaryCta = homeText(hero?.headerSecondaryCta, copy.secondaryCta);
  const heroTitleLines = heroTitle.split("\n").filter(Boolean);
  const heroTitleFinalWords = (heroTitleLines.slice(2).join(" ") || "")
    .split(" ")
    .filter(Boolean);
  const heroTitleGrid = {
    leftTop: heroTitleLines[0] ?? heroTitle,
    leftBottom: heroTitleLines[1] ?? "",
    rightTop: heroTitleFinalWords[0] ?? "",
    rightBottom: heroTitleFinalWords.slice(1).join(" "),
  };
  const heroSubtitleLines =
    locale === "hu" &&
    heroSubtitle.includes("Minden egy kávéval kezdődik") &&
    heroSubtitle.includes("Vezetett, mégis kötetlen")
      ? "Vezetett, mégis kötetlen hangulatú fotózás.\nMinden egy kávéval kezdődik, és egy történettel ér véget."
      : heroSubtitle.includes(". ")
        ? heroSubtitle.replace(". ", ".\n")
        : heroSubtitle;
  const galleryImages = localizedGallery.filter((item) => item.coverImage);
  const sessionImages: Record<string, SanityImageSource | undefined> = {
    "personal-brand-starter": homeSessions?.personalBrandStarterImage,
    "lifestyle-story-session": homeSessions?.lifestyleStorySessionImage,
    "content-creator-day": homeSessions?.contentCreatorDayImage,
    "dating-boost": homeSessions?.datingBoostImage,
    "model-application": homeSessions?.modelApplicationImage,
  };

  const graph = schemaGraph([
    baseOrganizationSchema(locale),
    photographerSchema(locale),
    ...serviceSchemaNodes(locale, activeServices),
    imageObjectSchema({
      locale,
      path: "/",
      caption:
        locale === "hu"
          ? "Richard Foto történetmesélő lifestyle fotózás Budapest"
          : "Richard Foto storytelling lifestyle photography Budapest",
      contentUrl: heroImageUrl ?? undefined,
    }),
    breadcrumbSchema(locale, [{ name: site.name, path: "/" }]),
    faqSchema(sharedFaqs[locale]),
  ]);

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-neutral-950">
      <JsonLd data={graph} />

      <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-neutral-950 text-white">
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={
              locale === "hu"
                ? "történetmesélő lifestyle fotózás Budapest természetes pillanatokkal"
                : "storytelling lifestyle photography Budapest with natural moments"
            }
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="image-soft-motion object-cover opacity-88"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-950" aria-hidden="true" />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-black/28 via-black/6 to-black/46" />
        <div className="absolute inset-0 bg-linear-to-r from-black/38 via-black/6 to-black/20" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] max-w-6xl flex-col justify-between px-6 pb-10 pt-14 md:pb-12 md:pt-18 lg:pb-14 lg:pt-20">
          <div className="pt-2 md:pt-4">
            <p className="reveal-up mb-7 max-w-xl text-[0.7rem] uppercase tracking-[0.36em] text-white/68">
              {heroEyebrow}
            </p>
            <h1 className="reveal-up grid w-full max-w-6xl grid-cols-[minmax(0,1fr)] gap-x-10 font-serif text-4xl font-normal leading-[0.92] tracking-[-0.045em] text-[#fff8e8] [animation-delay:90ms] sm:text-5xl md:grid-cols-[minmax(0,0.95fr)_minmax(8rem,0.55fr)_minmax(0,0.95fr)] md:text-6xl lg:text-[4.7rem]">
              <span className="block">
                {heroTitleGrid.leftTop}
              </span>
              <span aria-hidden="true" className="hidden md:block" />
              <span className="block md:text-right">
                {heroTitleGrid.rightTop}
              </span>
              <span className="block">
                {heroTitleGrid.leftBottom}
              </span>
              <span aria-hidden="true" className="hidden md:block" />
              <span className="block md:text-right">
                {heroTitleGrid.rightBottom}
              </span>
            </h1>
          </div>

          <div className="pb-0">
            <p className="reveal-up max-w-3xl whitespace-pre-line text-lg leading-8 text-white/84 [animation-delay:180ms] md:text-xl">
              {heroSubtitleLines}
            </p>
            <div className="reveal-up mt-8 flex flex-col gap-4 [animation-delay:260ms] sm:flex-row">
              <Link
                href={`/${locale}/forgatas-menete`}
                className="inline-flex items-center justify-center bg-white px-8 py-4 text-sm uppercase tracking-[0.2em] text-neutral-950 transition-colors hover:bg-neutral-200"
              >
                {primaryCta}
              </Link>
              <Link
                href={`/${locale}/services`}
                className="inline-flex items-center justify-center border border-white/70 px-8 py-4 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-neutral-950"
              >
                {secondaryCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f0ece4] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="reveal-on-scroll grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="mb-5 text-xs uppercase tracking-[0.3em] text-neutral-500">
                {copy.trendingEyebrow}
              </p>
              <h2 className="max-w-3xl font-serif text-4xl font-normal leading-[0.92] tracking-[-0.045em] text-neutral-950 md:text-6xl">
                {copy.trendingTitle}
              </h2>
            </div>
            <p className="self-end text-lg leading-8 text-neutral-700">
              {copy.trendingLead}
            </p>
          </div>

          <div className="mt-16 grid gap-5 lg:grid-cols-3">
            {copy.trendingSessions.map((session, index) => {
              const image = sessionImages[session.id] ?? galleryImages[index]?.coverImage;
              const imageUrl = getSanityImageUrl(image, 1000, 1200, 82);
              const isFeature = index === 0;
              const titleId = `trending-${session.id}`;
              const imageContext =
                locale === "hu"
                  ? `${session.title} fotózás Budapest természetes, filmes hangulatban`
                  : `${session.title} photography in Budapest with a natural cinematic mood`;

              return (
                <article
                  key={session.id}
                  aria-labelledby={titleId}
                  className={`group reveal-on-scroll overflow-hidden bg-neutral-950 text-white shadow-[0_24px_70px_rgba(20,20,20,0.14)] ${
                    isFeature ? "lg:col-span-2" : ""
                  }`}
                >
                  <div
                    className={`relative ${
                      isFeature ? "aspect-4/5 lg:aspect-8/5" : "aspect-4/5"
                    }`}
                  >
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={imageContext}
                        fill
                        sizes={
                          isFeature
                            ? "(max-width: 767px) calc(100vw - 48px), (max-width: 1023px) calc(100vw - 48px), 744px"
                            : "(max-width: 767px) calc(100vw - 48px), (max-width: 1023px) calc(100vw - 48px), 360px"
                        }
                        className="image-soft-motion object-contain p-2 opacity-80"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 bg-neutral-900"
                        aria-hidden="true"
                      />
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/82 via-black/18 to-transparent" />
                    <div
                      className={`absolute inset-x-0 top-0 p-6 md:p-8 ${
                        session.id === "lifestyle-story-session" ? "text-right" : ""
                      }`}
                    >
                      {session.label && (
                        <p
                          className={`max-w-md text-xs uppercase leading-5 tracking-[0.24em] text-white/65 ${
                            session.id === "lifestyle-story-session" ? "ml-auto" : ""
                          }`}
                        >
                          {session.label}
                        </p>
                      )}
                      <h3
                        id={titleId}
                        className={`${session.label ? "mt-4" : ""} max-w-xl whitespace-pre-line font-serif font-normal leading-[0.92] tracking-[-0.045em] text-[#fff8e8] ${
                          session.id === "model-application"
                            ? "text-3xl md:text-[2rem] lg:text-[2.15rem]"
                            : "text-3xl md:text-5xl"
                        } ${session.id === "lifestyle-story-session" ? "ml-auto" : ""}`}
                      >
                        {session.title}
                      </h3>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                      {session.description && (
                        <p className="mt-5 max-w-2xl text-sm leading-7 text-white/72 md:text-base">
                          {session.description}
                        </p>
                      )}
                      <Link
                        href={
                          "href" in session
                            ? `/${locale}${session.href}`
                            : `/${locale}/services/${getServiceSlug(
                                session.serviceId,
                                locale,
                              )}`
                        }
                        className="mt-7 inline-flex border border-white/60 px-5 py-3 text-xs uppercase tracking-[0.18em] text-white transition-colors hover:bg-white hover:text-neutral-950"
                      >
                        {session.cta}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <Link
        id="presentation-start"
        href={`/${locale}${copy.introHref}`}
        aria-label={
          locale === "hu"
            ? "Forgatás menete megnyitása"
            : "Open filming flow"
        }
        className="group reveal-on-scroll relative mx-auto my-20 block max-w-6xl scroll-mt-28 overflow-hidden border border-neutral-950 bg-neutral-950 text-[#f7f0df] shadow-[0_34px_100px_rgba(20,20,20,0.24)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_48px_130px_rgba(20,20,20,0.32)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-950 md:my-28"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60 transition-transform duration-700 group-hover:scale-[1.015]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 20%, rgba(183,157,102,0.34), transparent 24%), radial-gradient(circle at 85% 78%, rgba(240,236,228,0.16), transparent 28%), linear-gradient(115deg, rgba(255,255,255,0.08), transparent 42%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-8 opacity-45"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0 18px, rgba(247,240,223,0.78) 18px 28px, transparent 28px 46px)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-8 opacity-45"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0 18px, rgba(247,240,223,0.78) 18px 28px, transparent 28px 46px)",
          }}
        />

        <div className="relative grid min-h-[520px] gap-0 md:grid-cols-[1.1fr_0.9fr]">
          <div className="relative flex min-h-[380px] flex-col justify-between overflow-hidden px-6 py-16 sm:px-10 md:min-h-[520px] md:px-12 md:py-20">
            <div
              aria-hidden="true"
              className="absolute -left-28 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-[#f7f0df]/10 transition-transform duration-700 group-hover:scale-110"
            />
            <div
              aria-hidden="true"
              className="absolute right-8 top-12 h-24 w-24 rounded-full border border-[#f7f0df]/20 opacity-70"
            />
            <div className="relative">
              <p className="mb-5 text-xs uppercase tracking-[0.34em] text-[#f7f0df]/55">
                {site.name}
              </p>
              <p className="text-[0.65rem] uppercase tracking-[0.34em] text-[#b79d66]">
                {locale === "hu" ? "Roll camera" : "Roll camera"}
              </p>
            </div>
            <h2 className="relative max-w-2xl font-serif text-4xl leading-[1.02] tracking-tight sm:text-5xl md:text-6xl">
              {copy.introTitle}
            </h2>
          </div>

          <div className="relative flex min-h-[360px] flex-col justify-between border-t border-[#f7f0df]/12 px-6 py-16 sm:px-10 md:min-h-[520px] md:border-l md:border-t-0 md:px-12 md:py-20">
            <div
              aria-hidden="true"
              className="absolute right-6 top-10 h-36 w-36 rounded-full border border-[#f7f0df]/18 opacity-75 transition-transform duration-700 group-hover:rotate-12 md:h-44 md:w-44"
            >
              <span className="absolute inset-5 rounded-full border border-[#f7f0df]/16" />
              <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f7f0df]/75" />
              <span className="absolute left-1/2 top-5 h-5 w-5 -translate-x-1/2 rounded-full bg-[#f7f0df]/45" />
              <span className="absolute bottom-5 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-[#f7f0df]/45" />
              <span className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-[#f7f0df]/45" />
              <span className="absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-[#f7f0df]/45" />
            </div>
            <div className="relative max-w-xl">
              {copy.intro.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-xl leading-8 text-[#f7f0df]/78 md:text-2xl md:leading-10"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <span className="relative mt-12 inline-flex min-h-16 w-fit items-center gap-4 overflow-hidden border border-[#f7f0df]/60 bg-[#f7f0df] px-5 py-3 text-neutral-950 shadow-[0_22px_60px_rgba(0,0,0,0.22)] transition-all duration-500 group-hover:border-[#b79d66] group-hover:bg-[#b79d66] group-hover:text-neutral-950">
              <span
                aria-hidden="true"
                className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-current/70 transition-transform duration-700 group-hover:rotate-[42deg]"
              >
                <span className="absolute h-8 w-8 rounded-full border border-current/35" />
                <span className="h-3 w-3 rounded-full bg-current" />
                <span className="absolute left-1/2 top-1 h-2 w-2 -translate-x-1/2 rounded-full bg-current/80" />
                <span className="absolute bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-current/80" />
                <span className="absolute left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-current/80" />
                <span className="absolute right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-current/80" />
              </span>
              <span className="grid gap-1">
                <span className="text-[0.62rem] uppercase tracking-[0.32em] text-current/55">
                  8mm / flow
                </span>
                <span className="text-sm uppercase tracking-[0.22em]">
                  {copy.introCta}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="ml-2 h-px w-10 bg-current/55 transition-all duration-500 group-hover:w-16"
              />
            </span>
          </div>
        </div>
      </Link>

      {(featured?.length || gallery?.length) && (
        <section
          id="selected-moments"
          className="reveal-on-scroll bg-[#fbfaf7] px-6 py-24 md:py-32"
        >
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <p className="mb-5 text-xs uppercase tracking-[0.3em] text-neutral-500">
                {locale === "hu" ? "Válogatott munkák" : "Selected work"}
              </p>
              <h2 className="font-serif text-4xl tracking-tight md:text-6xl">
                {locale === "hu"
                  ? "Kiválasztott pillanatok"
                  : "Selected moments"}
              </h2>
            </div>
            <FeaturedRotator
              featured={
                localizedFeatured.filter(
                  (item) => item.coverImage,
                ) as GalleryItem[]
              }
              gallery={
                localizedGallery.filter(
                  (item) => item.coverImage,
                ) as GalleryItem[]
              }
            />
          </div>
        </section>
      )}

      <section className="overflow-hidden bg-[#ece7df] px-6 py-24 md:py-32">
        <div className="reveal-on-scroll mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-neutral-500">
              {locale === "hu" ? "Élmény és folyamat" : "Experience and flow"}
            </p>
            <h2 className="font-serif text-4xl leading-tight tracking-tight md:text-6xl">
              {copy.experienceTitle}
            </h2>
          </div>
          <div className="self-end">
            <p className="text-lg leading-8 text-neutral-700">
              {copy.experienceText}
            </p>
            <ul className="mt-8 space-y-4">
              {copy.experienceItems.map((item) => (
                <li
                  key={item}
                  className="story-line relative border-t border-neutral-950/15 pt-4 text-sm uppercase tracking-[0.16em] text-neutral-700 after:absolute after:left-0 after:-top-px after:h-px after:w-24 after:bg-neutral-950"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 px-6 py-24 text-[#fff8e8] md:py-32">
        <div className="mx-auto max-w-6xl">
          <h2 className="reveal-on-scroll max-w-3xl font-serif text-4xl font-normal leading-[0.92] tracking-[-0.045em] md:text-6xl">
            {copy.howTitle}
          </h2>
          <div className="mt-16 grid gap-8 md:grid-cols-4">
            {copy.howSteps.map((step, index) => (
              <article
                key={step.title}
                className="reveal-on-scroll border-t border-white/15 pt-6"
              >
                <p className="mb-8 text-xs uppercase tracking-[0.28em] text-[#d89a43]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="font-serif text-2xl font-normal leading-[0.92] tracking-[-0.045em] text-[#fff8e8]">
                  {step.title}
                </h3>
                <p className="mt-5 text-sm leading-7 text-[#fff8e8]/62">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:py-32">
        <div className="reveal-on-scroll mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="mb-5 text-xs uppercase tracking-[0.3em] text-neutral-500">
                {locale === "hu" ? "Értékek" : "Values"}
              </p>
              <h2 className="font-serif text-4xl leading-tight tracking-tight md:text-6xl">
                {copy.whyTitle}
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {copy.values.map((value) => (
                <article
                  key={value.title}
                  className="border-t border-neutral-200 pt-6"
                >
                  <h3 className="font-serif text-2xl">{value.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-neutral-600">
                    {value.text}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-20 grid gap-8 border-y border-neutral-200 py-10 md:grid-cols-4">
            {copy.stats.map((stat) => (
              <p key={stat} className="font-serif text-2xl tracking-tight">
                {stat}
              </p>
            ))}
            <blockquote className="text-sm leading-7 text-neutral-600 md:col-span-1">
              &ldquo;{copy.testimonial}&rdquo;
            </blockquote>
          </div>
        </div>
      </section>

      {aboutImageUrl && (
        <section className="reveal-on-scroll mx-auto max-w-6xl px-6 py-10 md:py-14">
          <Image
            src={aboutImageUrl}
            alt={
              locale === "hu"
                ? "Richard Foto budapesti történetmesélő fotós portréja"
                : "Portrait of Richard Foto Budapest storytelling photographer"
            }
            width={1200}
            height={720}
            sizes="(max-width: 768px) 100vw, 1152px"
            className="image-soft-motion h-auto w-full object-contain shadow-[0_28px_80px_rgba(0,0,0,0.12)]"
          />
        </section>
      )}

      <section className="bg-neutral-100 px-6 py-24 md:py-32">
        <div className="reveal-on-scroll mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-neutral-500">
              {locale === "hu" ? "Ajándék" : "Gift"}
            </p>
            <h2 className="font-serif text-4xl leading-tight tracking-tight md:text-6xl">
              {copy.giftTitle}
            </h2>
          </div>
          <div className="self-end">
            <p className="text-lg leading-8 text-neutral-600">
              {copy.giftText}
            </p>
            <Link
              href={`/${locale}/booking?service=gift-voucher`}
              className="mt-8 inline-flex bg-neutral-950 px-8 py-4 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-neutral-800"
            >
              {copy.giftCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#fbfaf7] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="reveal-on-scroll grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="mb-5 text-xs uppercase tracking-[0.3em] text-neutral-500">
                {copy.servicesEyebrow}
              </p>
              <h2 className="font-serif text-4xl leading-tight tracking-tight md:text-6xl">
                {copy.servicesTitle}
              </h2>
            </div>
            <p className="self-end text-lg leading-8 text-neutral-600">
              {copy.servicesLead}
            </p>
          </div>

          <div className="mt-14 divide-y divide-neutral-200 border-y border-neutral-200">
            {activeServices.map((service, index) => (
              <details
                id={service.anchor}
                key={service.id}
                className="service-disclosure group py-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                  <div className="grid gap-4 md:grid-cols-[9rem_1fr] md:items-baseline">
                    <span className="text-xs uppercase tracking-[0.24em] text-neutral-500">
                      {String(index + 1).padStart(2, "0")} / {activeServices.length}
                    </span>
                    <h3 className="font-serif text-2xl leading-tight tracking-tight md:text-4xl">
                      {service.title[locale]}
                    </h3>
                  </div>
                  <span
                    aria-hidden="true"
                    className="service-toggle shrink-0 text-3xl leading-none text-neutral-500 transition-transform duration-300"
                  >
                    +
                  </span>
                </summary>

                <div className="mt-8 grid gap-8 md:ml-36 md:grid-cols-[1fr_0.65fr]">
                  <p className="text-base leading-8 text-neutral-600">
                    {service.description[locale]}
                  </p>
                  <div>
                    <h4 className="text-xs uppercase tracking-[0.22em] text-neutral-500">
                      {copy.captionsLabel}
                    </h4>
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-neutral-500">
                      {service.captions[locale].map((caption) => (
                        <li key={caption}>{caption}</li>
                      ))}
                    </ul>
                    <Link
                      href={`/${locale}/services/${getServiceSlug(service.id, locale)}`}
                      className="mt-7 inline-flex text-xs uppercase tracking-[0.18em] text-neutral-950 underline-offset-8 hover:underline"
                    >
                      {copy.accordionCta}
                    </Link>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 px-6 py-24 text-center text-white md:py-32">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-4xl leading-tight tracking-tight md:text-6xl">
            {copy.finalTitle}
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-8 text-white/68">
            {copy.finalText}
          </p>
          <Link
            href={`/${locale}/booking`}
            className="mt-10 inline-flex bg-white px-9 py-4 text-sm uppercase tracking-[0.22em] text-neutral-950 transition-colors hover:bg-neutral-200"
          >
            {copy.finalCta}
          </Link>
        </div>
      </section>
    </main>
  );
}
