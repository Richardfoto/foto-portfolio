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
  photographyServices,
  serviceKeywords,
  serviceSchemaNodes,
  sharedFaqs,
} from "@/lib/photography-content";

type LocaleParams = Promise<{ locale: string }>;

type AboutHome = {
  heroImage?: SanityImageSource;
  aboutImage?: SanityImageSource;
};

type GalleryItem = {
  _id: string;
  title: string;
  category?: string;
  coverImage?: SanityImageSource;
};

const aboutQuery = groq`*[_type == "about"][0]{ heroImage, aboutImage }`;
const featuredQuery = groq`*[_type == "gallery" && featured == true] | order(_createdAt desc)[0...8]{
  _id,
  title,
  category,
  coverImage
}`;
const galleryQuery = groq`*[_type == "gallery"] | order(_createdAt desc)[0...50]{
  _id,
  title,
  category,
  coverImage
}`;

const homeCopy = {
  hu: {
    heroEyebrow: "Budapest • filmes hangulatú fotózás • 2015 óta",
    heroTitle: "Valódi pillanatok. Időtlen képek.",
    heroSubtitle:
      "Csendes, történetmesélő fotózás Budapesten azoknak, akik nem szerepelni szeretnének a kamera előtt, hanem végre önmaguk lenni.",
    primaryCta: "Foglalás indítása",
    secondaryCta: "Kiválasztott pillanatok",
    heroCards: [
      "természetes jelenlét",
      "filmes szerkesztés",
      "privát online galéria",
    ],
    introTitle: "Nem azt kérem, hogy tudj pózolni.",
    intro: [
      "Azt figyelem, mikor engeded el a kamerát. Egy félmosolyban, egy mozdulatban, abban a pillanatban, amikor már nem a képre gondolsz, hanem arra, ami éppen történik.",
      "Richardként nem rendezni szeretném az életedet, hanem finoman keretet adni neki. Megnézem a fényt, a ritmust, a helyzetet, és közben hagyom, hogy a képeknek legyen levegője.",
      "Ezért a fotózás nem szereplésnek érződik, hanem egy nyugodt, vezetett találkozásnak. A végeredmény pedig nem idegenül tökéletes, hanem felismerhetően te.",
    ],
    introCta: "Richard története",
    trendingEyebrow: "Trending sessions",
    trendingTitle: "Modern fotózási belépők, ha pontosan tudod, mit szeretnél érezni a képeken.",
    trendingLead:
      "Ezek nem klasszikus csomagnevek, hanem könnyebb indulópontok. Válaszd azt, amelyik legközelebb van az élethelyzetedhez, és a foglalásnál együtt pontosítjuk a részleteket.",
    trendingSessions: [
      {
        id: "personal-brand-starter",
        title: "Personal Brand Starter",
        label: "vállalkozóknak és szakmai jelenléthez",
        description:
          "Letisztult portrék és werk hangulatú képek weboldalhoz, LinkedInhez, bemutatkozó anyaghoz vagy új márkaindításhoz.",
        cta: "Márkaképeket kérek",
        serviceId: "business-portrait",
      },
      {
        id: "lifestyle-story-session",
        title: "Lifestyle Story Session",
        label: "természetes emlékekhez",
        description:
          "Egy séta, otthoni fény, városi részlet vagy közös ritmus. Képek, amelyek nem megállítanak, hanem visszavisznek egy érzéshez.",
        cta: "Lifestyle sorozatot kérek",
        serviceId: "family-lifestyle",
      },
      {
        id: "content-creator-day",
        title: "Content Creator Day",
        label: "tartalomhoz és kampányokhoz",
        description:
          "Egy vezetett fotózási nap, ahol több hétre előre gondolkodunk: portré, werk, részletek, social és webes felhasználás.",
        cta: "Tartalomnapot kérek",
        serviceId: "business-portrait",
      },
      {
        id: "dating-boost",
        title: "Dating Boost",
        label: "önazonos portrékhoz",
        description:
          "Könnyed, természetes portrék társkereső profilhoz vagy egyszerűen ahhoz, hogy végre legyenek rólad jó, őszinte képek.",
        cta: "Dating boostot kérek",
        serviceId: "boudoir-branding",
      },
    ],
    servicesEyebrow: "Fotózási területek",
    servicesTitle: "A teljes 10 fókusz, ha konkrétabb irányból érkeznél.",
    servicesLead:
      "A 10 niche SEO-ban és választásban is hasznos, de nem kell az első pillanatban mindent eldöntened. Nyisd le azt, ami érdekel, vagy indulj a fenti sessionök egyikéből.",
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
        text: "A kész, gondosan utómunkázott képek privát online galériában érkeznek, általában 7-10 munkanapon belül.",
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
    stats: ["2015 óta", "10+ fotózási terület", "7-10 napos átadás"],
    testimonial:
      "Richard teljesen feloldott a kamera előtt. A képek nem beállítottak, mégis gyönyörűen összefogják azt az időszakot, amit szerettünk volna megőrizni.",
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
    heroTitle: "Real moments. Timeless images.",
    heroSubtitle:
      "Quiet storytelling photography in Budapest for people who do not want to perform in front of the camera, but finally feel like themselves.",
    primaryCta: "Start booking",
    secondaryCta: "Selected moments",
    heroCards: [
      "natural presence",
      "cinematic editing",
      "private online gallery",
    ],
    introTitle: "I do not need you to know how to pose.",
    intro: [
      "I look for the moment when you stop thinking about the camera. A half-smile, a gesture, a quiet pause: the point where the photograph starts to feel like you.",
      "As Richard, I do not want to stage your life. I create a calm frame, watch the light and rhythm, and leave enough room for something honest to appear.",
      "That is why the session feels less like performing and more like a guided conversation. The final images are not strangely perfect; they are recognisably yours.",
    ],
    introCta: "Richard's story",
    trendingEyebrow: "Trending sessions",
    trendingTitle: "Modern session entries for people who know what they want the images to feel like.",
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
        serviceId: "business-portrait",
      },
      {
        id: "lifestyle-story-session",
        title: "Lifestyle Story Session",
        label: "for natural memories",
        description:
          "A walk, at-home light, city details or shared rhythm. Images that do not freeze you, but bring back a feeling.",
        cta: "Request a lifestyle story",
        serviceId: "family-lifestyle",
      },
      {
        id: "content-creator-day",
        title: "Content Creator Day",
        label: "for content and campaigns",
        description:
          "A guided photography day planned ahead: portraits, werk moments, details, social content and web-ready imagery.",
        cta: "Request a content day",
        serviceId: "business-portrait",
      },
      {
        id: "dating-boost",
        title: "Dating Boost",
        label: "for honest personal portraits",
        description:
          "Relaxed, natural portraits for dating profiles or simply for finally having strong, honest photographs of yourself.",
        cta: "Request a dating boost",
        serviceId: "boudoir-branding",
      },
    ],
    servicesEyebrow: "Photography fields",
    servicesTitle: "The full 10-focus menu, if you arrive with a more specific direction.",
    servicesLead:
      "The 10 niches are useful for SEO and choice, but you do not need to decide everything at once. Open the direction that interests you, or begin with one of the sessions above.",
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
        text: "Your carefully edited images arrive in a private online gallery, usually within 7-10 business days.",
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
    stats: ["Since 2015", "10+ photography fields", "7-10 day delivery"],
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

  return createMetadata({
    locale,
    path: "/",
    title: isHu
      ? "Richard Foto | Történetmesélő lifestyle fotózás Budapest"
      : "Richard Foto | Storytelling Lifestyle Photography Budapest",
    description: isHu
      ? "Időtlen, természetes lifestyle, werk, családi, kismama, újszülött, esküvői és portré fotózás Budapesten. Valódi pillanatok, filmes hangulatban."
      : "Timeless natural lifestyle, werk, family, maternity, newborn, wedding and portrait photography in Budapest. Real moments with a cinematic feeling.",
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
) {
  if (!image) return null;
  const builder = urlFor(image).width(width).format("webp").quality(88);
  return height ? builder.height(height).fit("crop").url() : builder.url();
}

export default async function Home(props: { params: LocaleParams }) {
  const { locale: rawLocale } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";
  const copy = homeCopy[locale];

  const [about, featured, gallery] = await Promise.all([
    client.fetch<AboutHome | null>(aboutQuery),
    client.fetch<GalleryItem[]>(featuredQuery),
    client.fetch<GalleryItem[]>(galleryQuery),
  ]);

  const heroImageUrl = getSanityImageUrl(about?.heroImage, 2200, 1300);
  const aboutImageUrl = getSanityImageUrl(about?.aboutImage, 900, 1100);
  const galleryImages = (gallery ?? []).filter((item) => item.coverImage);

  const graph = schemaGraph([
    baseOrganizationSchema(locale),
    photographerSchema(locale),
    ...serviceSchemaNodes(locale),
    imageObjectSchema({
      locale,
      path: "/",
      caption:
        locale === "hu"
          ? "Richard Foto történetmesélő lifestyle fotózás Budapest"
          : "Richard Foto storytelling lifestyle photography Budapest",
      contentUrl: heroImageUrl ?? undefined,
    }),
    breadcrumbSchema(locale, [
      { name: site.name, path: "/" },
    ]),
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
            sizes="100vw"
            className="hero-drift object-cover opacity-70"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-950" aria-hidden="true" />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-black/45 via-black/15 to-black/70" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] max-w-6xl flex-col justify-center px-6 py-24">
          <p className="reveal-up mb-7 max-w-xl text-xs uppercase tracking-[0.32em] text-white/70">
            {copy.heroEyebrow}
          </p>
          <h1 className="reveal-up max-w-5xl font-serif text-5xl leading-[0.96] tracking-tight [animation-delay:90ms] sm:text-6xl md:text-7xl lg:text-8xl">
            {copy.heroTitle}
          </h1>
          <p className="reveal-up mt-8 max-w-2xl text-lg leading-8 text-white/82 [animation-delay:180ms] md:text-xl">
            {copy.heroSubtitle}
          </p>
          <div className="reveal-up mt-12 flex flex-col gap-4 [animation-delay:260ms] sm:flex-row">
            <Link
              href={`/${locale}/booking`}
              className="inline-flex items-center justify-center bg-white px-8 py-4 text-sm uppercase tracking-[0.2em] text-neutral-950 transition-colors hover:bg-neutral-200"
            >
              {copy.primaryCta}
            </Link>
            <Link
              href="#selected-moments"
              className="inline-flex items-center justify-center border border-white/70 px-8 py-4 text-sm uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-neutral-950"
            >
              {copy.secondaryCta}
            </Link>
          </div>

          <div className="reveal-up mt-16 grid max-w-3xl gap-3 [animation-delay:340ms] sm:grid-cols-3">
            {copy.heroCards.map((card) => (
              <div
                key={card}
                className="glass-panel border border-white/18 px-4 py-4 text-xs uppercase tracking-[0.2em] text-white/82"
              >
                {card}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal-on-scroll mx-auto grid max-w-6xl gap-14 px-6 py-24 md:grid-cols-[0.95fr_1.05fr] md:py-32">
        <div>
          <p className="mb-5 text-xs uppercase tracking-[0.3em] text-neutral-400">
            {site.name}
          </p>
          <h2 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">
            {copy.introTitle}
          </h2>
        </div>
        <div className="space-y-6 text-lg leading-8 text-neutral-600">
          {copy.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <Link
            href={`/${locale}/about`}
            className="inline-flex pt-2 text-sm uppercase tracking-[0.2em] text-neutral-950 underline-offset-8 hover:underline"
          >
            {copy.introCta}
          </Link>
        </div>
      </section>

      {aboutImageUrl && (
        <section className="reveal-on-scroll mx-auto max-w-6xl px-6 pb-8">
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
            className="h-auto w-full object-cover shadow-[0_28px_80px_rgba(0,0,0,0.12)]"
          />
        </section>
      )}

      <section className="bg-[#f0ece4] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="reveal-on-scroll grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="mb-5 text-xs uppercase tracking-[0.3em] text-neutral-500">
                {copy.trendingEyebrow}
              </p>
              <h2 className="max-w-3xl font-serif text-4xl leading-tight tracking-tight md:text-6xl">
                {copy.trendingTitle}
              </h2>
            </div>
            <p className="self-end text-lg leading-8 text-neutral-700">
              {copy.trendingLead}
            </p>
          </div>

          <div className="mt-16 grid gap-5 lg:grid-cols-3">
            {copy.trendingSessions.map((session, index) => {
              const image = galleryImages[index]?.coverImage;
              const imageUrl = getSanityImageUrl(image, 1200, 1300);
              const isFeature = index === 0;
              const titleId = `trending-${session.id}`;

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
                      isFeature ? "aspect-[4/5] lg:aspect-[8/5]" : "aspect-[4/5]"
                    }`}
                  >
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={
                          locale === "hu"
                            ? `${session.title} fotózás Budapest természetes, filmes hangulatban`
                            : `${session.title} photography in Budapest with a natural cinematic mood`
                        }
                        fill
                        sizes={
                          isFeature
                            ? "(max-width: 1024px) 100vw, 62vw"
                            : "(max-width: 1024px) 100vw, 31vw"
                        }
                        className="object-cover opacity-80 transition-transform duration-1000 ease-out group-hover:scale-[1.035]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-neutral-900" aria-hidden="true" />
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/82 via-black/18 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                      <p className="mb-4 max-w-md text-xs uppercase tracking-[0.24em] text-white/55">
                        {session.label}
                      </p>
                      <h3
                        id={titleId}
                        className="max-w-xl font-serif text-3xl leading-tight tracking-tight md:text-5xl"
                      >
                        {session.title}
                      </h3>
                      <p className="mt-5 max-w-2xl text-sm leading-7 text-white/72 md:text-base">
                        {session.description}
                      </p>
                      <Link
                        href={`/${locale}/booking?service=${session.serviceId}`}
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

      {(featured?.length || gallery?.length) && (
        <section
          id="selected-moments"
          className="reveal-on-scroll bg-[#fbfaf7] px-6 py-24 md:py-32"
        >
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <p className="mb-5 text-xs uppercase tracking-[0.3em] text-neutral-400">
                {locale === "hu" ? "Válogatott munkák" : "Selected work"}
              </p>
              <h2 className="font-serif text-4xl tracking-tight md:text-6xl">
                {locale === "hu" ? "Kiválasztott pillanatok" : "Selected moments"}
              </h2>
            </div>
            <FeaturedRotator
              featured={(featured ?? []).filter((item) => item.coverImage) as GalleryItem[]}
              gallery={(gallery ?? []).filter((item) => item.coverImage) as GalleryItem[]}
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
                  className="story-line relative border-t border-neutral-950/15 pt-4 text-sm uppercase tracking-[0.16em] text-neutral-700 after:absolute after:left-0 after:top-[-1px] after:h-px after:w-24 after:bg-neutral-950"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 px-6 py-24 text-white md:py-32">
        <div className="mx-auto max-w-6xl">
          <h2 className="reveal-on-scroll max-w-3xl font-serif text-4xl leading-tight tracking-tight md:text-6xl">
            {copy.howTitle}
          </h2>
          <div className="mt-16 grid gap-8 md:grid-cols-4">
            {copy.howSteps.map((step, index) => (
              <article
                key={step.title}
                className="reveal-on-scroll border-t border-white/15 pt-6"
              >
                <p className="mb-8 text-xs uppercase tracking-[0.28em] text-white/35">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="font-serif text-2xl">{step.title}</h3>
                <p className="mt-5 text-sm leading-7 text-white/62">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:py-32">
        <div className="reveal-on-scroll mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="mb-5 text-xs uppercase tracking-[0.3em] text-neutral-400">
                {locale === "hu" ? "Értékek" : "Values"}
              </p>
              <h2 className="font-serif text-4xl leading-tight tracking-tight md:text-6xl">
                {copy.whyTitle}
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {copy.values.map((value) => (
                <article key={value.title} className="border-t border-neutral-200 pt-6">
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

      <section className="bg-neutral-100 px-6 py-24 md:py-32">
        <div className="reveal-on-scroll mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-neutral-400">
              {locale === "hu" ? "Ajándék" : "Gift"}
            </p>
            <h2 className="font-serif text-4xl leading-tight tracking-tight md:text-6xl">
              {copy.giftTitle}
            </h2>
          </div>
          <div className="self-end">
            <p className="text-lg leading-8 text-neutral-600">{copy.giftText}</p>
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
              <p className="mb-5 text-xs uppercase tracking-[0.3em] text-neutral-400">
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
            {photographyServices.map((service, index) => (
              <details
                id={service.anchor}
                key={service.id}
                className="service-disclosure group py-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                  <div className="grid gap-4 md:grid-cols-[9rem_1fr] md:items-baseline">
                    <span className="text-xs uppercase tracking-[0.24em] text-neutral-400">
                      {String(index + 1).padStart(2, "0")} / 10
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
                    <h4 className="text-xs uppercase tracking-[0.22em] text-neutral-400">
                      {copy.captionsLabel}
                    </h4>
                    <ul className="mt-4 space-y-3 text-sm leading-6 text-neutral-500">
                      {service.captions[locale].map((caption) => (
                        <li key={caption}>{caption}</li>
                      ))}
                    </ul>
                    <Link
                      href={`/${locale}/booking?service=${service.id}`}
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
