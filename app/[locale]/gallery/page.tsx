import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { getTranslations } from "next-intl/server";
import GalleryWall, { type GalleryWallItem } from "./GalleryWall";
import CameraSettingsTicker from "./CameraSettingsTicker";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
import { serviceSchemaNodes, sharedFaqs } from "@/lib/photography-content";
import { urlFor } from "@/sanity/lib/image";
import AboutFeedbackForm from "../about/AboutFeedbackForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type LocaleParams = Promise<{ locale: string }>;

type GalleryWallDocument = {
  titleHu?: string;
  titleEn?: string;
  leadHu?: string;
  leadEn?: string;
  heroImage?: Parameters<typeof urlFor>[0];
  heroCaptionHu?: string;
  heroCaptionEn?: string;
  items?: Array<{
    _key?: string;
    active?: boolean;
    image?: Parameters<typeof urlFor>[0];
    size?: GalleryWallItem["size"];
    storyTitleHu?: string;
    storyTitleEn?: string;
    storyHu?: string;
    storyEn?: string;
  }>;
  feedbackStories?: Array<{
    _key?: string;
    active?: boolean;
    image?: Parameters<typeof urlFor>[0];
    quoteHu?: string;
    quoteEn?: string;
    name?: string;
    contextHu?: string;
    contextEn?: string;
  }>;
};

const galleryWallQuery = groq`coalesce(
  *[_id == "galleryWall"][0],
  *[_type == "galleryWall" && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]
){
  titleHu,
  titleEn,
  leadHu,
  leadEn,
  heroImage,
  heroCaptionHu,
  heroCaptionEn,
  items[]{
    _key,
    active,
    image,
    size,
    storyTitleHu,
    storyTitleEn,
    storyHu,
    storyEn
  },
  feedbackStories[]{
    _key,
    active,
    image,
    quoteHu,
    quoteEn,
    name,
    contextHu,
    contextEn
  }
}`;

function imageUrl(image: Parameters<typeof urlFor>[0] | undefined, width = 1600) {
  if (!image) return null;
  return urlFor(image)
    .ignoreImageParams()
    .width(width)
    .fit("max")
    .auto("format")
    .quality(88)
    .url();
}

function galleryWallTitle(value: string | undefined, locale: Locale) {
  const title = value?.trim();
  if (
    !title ||
    title === "A képek közötti ritmus" ||
    title === "The rhythm between images" ||
    title === "Örök emléket kapsz" ||
    title === "You receive a lasting memory"
  ) {
    return locale === "hu" ? "Üdvözöllek a víziómban" : "Welcome to my vision";
  }

  return title;
}

function galleryWallLead(value: string | undefined, locale: Locale) {
  const lead = value?.trim();
  if (
    !lead ||
    lead ===
      "Nem kategóriákat nézel, hanem hangulatokat: fényeket, mozdulatokat, arcokat, részleteket és kis történeteket." ||
    lead ===
      "Nem kategóriákat nézel, hanem emlékeket: fényeket, mozdulatokat, arcokat és részleteket, amelyek visszahoznak egy valódi pillanatot." ||
    lead ===
      "You are not browsing categories, but memories: light, movement, faces and details that bring back a real moment." ||
    lead ===
      "You are not browsing categories, but moods: light, movement, faces, details and small stories."
  ) {
    return locale === "hu"
      ? "Ez a személyes válogatásom: képek, hangulatok és pillanatok, amelyek közel állnak hozzám. Ha megszólít valamelyik irány, megtaláljuk hozzá a te történeted saját atmoszféráját is."
      : "This is my personal selection: images, moods and moments that feel close to me. If one of these directions speaks to you, we can find the atmosphere that belongs to your own story too.";
  }

  return lead;
}

export async function generateMetadata(props: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale: rawLocale } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";

  return createMetadata({
    locale,
    path: "/gallery",
    title:
      locale === "hu"
        ? "Galéria | Richard Foto Budapest"
        : "Gallery | Richard Foto Budapest",
    description:
      locale === "hu"
        ? "Richard Foto galéria: természetes lifestyle, portré, családi, werk, esküvői és történetmesélő fotózás Budapesten."
        : "Richard Foto gallery: natural lifestyle, portrait, family, werk, wedding and storytelling photography in Budapest.",
  });
}

export default async function GalleryPage(props: { params: LocaleParams }) {
  const { locale: rawLocale } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";
  const t = await getTranslations({ locale, namespace: "gallery" });

  const wall = await client.fetch<GalleryWallDocument | null>(galleryWallQuery);

  const wallItems = (wall?.items ?? [])
    .filter((item) => item.active !== false && item.image)
    .map((item, index) => {
      const url = imageUrl(item.image, 1800);
      if (!url) return null;

      return {
        id: item._key ?? `wall-${index}`,
        imageUrl: url,
        title:
          locale === "hu"
            ? item.storyTitleHu || "Képtörténet"
            : item.storyTitleEn || item.storyTitleHu || "Image story",
        story: locale === "hu" ? item.storyHu : item.storyEn || item.storyHu,
        size: item.size ?? "medium",
      } satisfies GalleryWallItem;
    })
    .filter(Boolean) as GalleryWallItem[];

  const items = wallItems.slice(0, 6);
  const feedbackStories = (wall?.feedbackStories ?? [])
    .filter((item) => item.active !== false && item.image)
    .map((item, index) => {
      const url = imageUrl(item.image, 1400);
      const quote =
        locale === "hu" ? item.quoteHu : item.quoteEn || item.quoteHu;
      if (!url || !quote?.trim()) return null;

      return {
        id: item._key ?? `feedback-${index}`,
        imageUrl: url,
        quote,
        name:
          item.name?.trim() ||
          (locale === "hu" ? "név nélkül" : "anonymous"),
        context:
          locale === "hu" ? item.contextHu : item.contextEn || item.contextHu,
      };
    })
    .filter(Boolean) as Array<{
      id: string;
      imageUrl: string;
      quote: string;
      name: string;
      context?: string;
    }>;
  const heroImageUrl = imageUrl(wall?.heroImage, 2200) ?? items[0]?.imageUrl ?? null;
  const title = galleryWallTitle(
    locale === "hu" ? wall?.titleHu : wall?.titleEn || wall?.titleHu,
    locale,
  );
  const lead = galleryWallLead(
    locale === "hu" ? wall?.leadHu : wall?.leadEn || wall?.leadHu,
    locale,
  );
  const heroCaption =
    locale === "hu"
      ? wall?.heroCaptionHu
      : wall?.heroCaptionEn || wall?.heroCaptionHu;
  const heroTitle =
    locale === "hu" && title === "Üdvözöllek a víziómban"
      ? "Üdvözöllek\na víziómban"
      : title;

  const graph = schemaGraph([
    baseOrganizationSchema(locale),
    photographerSchema(locale),
    ...serviceSchemaNodes(locale),
    imageObjectSchema({
      locale,
      path: "/gallery",
      caption:
        locale === "hu"
          ? "Richard Foto galéria természetes budapesti fotózásokkal"
          : "Richard Foto gallery with natural Budapest photo sessions",
    }),
    breadcrumbSchema(locale, [
      { name: site.name, path: "/" },
      { name: t("title"), path: "/gallery" },
    ]),
    faqSchema(sharedFaqs[locale]),
  ]);

  return (
    <main className="min-h-screen bg-[#f7f4ee] pt-20 text-neutral-950">
      <JsonLd data={graph} />

      <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-neutral-950 text-[#fff8e8]">
        {heroImageUrl && (
          <Image
            src={heroImageUrl}
            alt={
              locale === "hu"
                ? "Richard Foto kiemelt galéria"
                : "Richard Foto featured gallery"
            }
            fill
            priority
            sizes="100vw"
            className="image-soft-motion object-contain p-4 opacity-100"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-black/10 to-transparent" />
        <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-screen-xl px-4 pb-14 pt-12 md:pb-20 md:pt-14">
          <div className="self-start">
            <p className="mb-5 text-xs uppercase tracking-[0.35em] text-[#fff8e8]/50">
              Love letter
            </p>
            <h1 className="max-w-3xl whitespace-pre-line font-serif text-5xl font-normal leading-[0.92] tracking-[-0.045em] text-[#fff8e8] md:text-7xl">
              {heroTitle}
            </h1>
          </div>

          <div className="mt-10 grid gap-8 self-end md:grid-cols-[0.95fr_1.05fr] md:items-end">
            <div className="max-w-2xl">
              {heroCaption && (
                <p className="mb-5 border-l border-white/35 pl-4 text-xs uppercase leading-6 tracking-[0.18em] text-white/55">
                  {heroCaption}
                </p>
              )}
              <p className="text-lg leading-8 text-[#fff8e8]/72">{lead}</p>
            </div>
            <div className="md:col-start-2">
              <CameraSettingsTicker locale={locale} />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-screen-xl px-4 py-16 md:py-24">
        {items.length > 0 ? (
          <GalleryWall items={items} locale={locale} />
        ) : (
          <div className="py-24 text-center text-zinc-400">
            Még nincsenek feltöltve galériák.
          </div>
        )}
      </div>

      {feedbackStories.length > 0 && (
        <section className="bg-[#f0ece4] px-4 py-20 md:py-28">
          <div className="mx-auto max-w-screen-xl">
            <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end">
              <div>
                <p className="mb-5 text-xs uppercase tracking-[0.3em] text-neutral-500">
                  {locale === "hu" ? "Visszajelzések" : "Feedback"}
                </p>
                <h2 className="max-w-3xl font-serif text-4xl leading-tight tracking-tight md:text-6xl">
                  {locale === "hu"
                    ? "Amikor a kép már nem csak nálam él tovább."
                    : "When the image starts living beyond my camera."}
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-neutral-600 md:justify-self-end">
                {locale === "hu"
                  ? "Ide azok a valódi mondatok kerülnek, amelyeket fotózás után kaptam. Nem automatikus értékelések: csak olyan visszajelzés jelenik meg, amelyhez külön engedélyt kaptam."
                  : "These are real words received after sessions. They are not automatic reviews: only feedback shared with explicit permission appears here."}
              </p>
            </div>

            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {feedbackStories.slice(0, 3).map((feedback, index) => (
                <article
                  key={feedback.id}
                  className={`group overflow-hidden bg-neutral-950 text-white shadow-[0_24px_70px_rgba(20,20,20,0.12)] ${
                    index === 0 ? "lg:col-span-2" : ""
                  }`}
                >
                  <div
                    className={`relative bg-black ${
                      index === 0 ? "aspect-[16/10]" : "aspect-[4/5]"
                    }`}
                  >
                    <Image
                      src={feedback.imageUrl}
                      alt={
                        locale === "hu"
                          ? "Fotózás utáni hiteles visszajelzés"
                          : "Authentic feedback after a photo session"
                      }
                      fill
                      sizes={
                        index === 0
                          ? "(max-width: 1024px) 100vw, 760px"
                          : "(max-width: 1024px) 100vw, 380px"
                      }
                      className="image-soft-motion object-contain p-3 opacity-90"
                    />
                  </div>
                  <div className="grid gap-5 p-6 md:p-7">
                    {feedback.context && (
                      <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                        {feedback.context}
                      </p>
                    )}
                    <blockquote className="font-serif text-2xl leading-tight tracking-tight md:text-3xl">
                      “{feedback.quote}”
                    </blockquote>
                    <p className="text-sm uppercase tracking-[0.2em] text-white/55">
                      {feedback.name}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#f7f4ee] px-4 pb-20 md:pb-28">
        <div className="mx-auto grid max-w-screen-xl gap-10 border-t border-neutral-200 pt-14 md:grid-cols-[0.9fr_1.1fr] md:pt-20">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-neutral-400">
              {locale === "hu" ? "Fotózás után" : "After the session"}
            </p>
            <h2 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl">
              {locale === "hu"
                ? "Ha már van közös képünk, írhatsz róla pár őszinte mondatot."
                : "If we already have a shared image, you can send a few honest words about it."}
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-neutral-600">
              {locale === "hu"
                ? "A visszajelzésed emailben érkezik meg hozzám. Semmi nem kerül ki automatikusan a weboldalra; ha később idézném, pontosan látom, hogy név nélkül vagy keresztnévvel engedted."
                : "Your feedback arrives by email. Nothing is published automatically on the website; if I later quote it, I will know whether you allowed it anonymously or with your first name."}
            </p>
          </div>
          <div>
            <AboutFeedbackForm contactEmail={site.email} locale={locale} />
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 px-4 py-20 text-center text-white md:py-24">
        <p className="mb-5 text-xs uppercase tracking-[0.3em] text-white/45">
          {locale === "hu" ? "Következő lépés" : "Next step"}
        </p>
        <h2 className="mx-auto max-w-3xl font-serif text-4xl leading-tight tracking-tight md:text-6xl">
          {locale === "hu"
            ? "Ha ilyen emléket szeretnél, innen induljunk."
            : "If you want this kind of memory, this is where we begin."}
        </h2>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={`/${locale}/services`}
            className="bg-white px-7 py-4 text-sm uppercase tracking-[0.18em] text-neutral-950 transition-colors hover:bg-neutral-200"
          >
            {locale === "hu" ? "Szolgáltatások" : "Services"}
          </Link>
          <Link
            href={`/${locale}/booking`}
            className="border border-white/40 px-7 py-4 text-sm uppercase tracking-[0.18em] text-white transition-colors hover:bg-white hover:text-neutral-950"
          >
            {locale === "hu" ? "Foglalás" : "Booking"}
          </Link>
        </div>
      </section>
    </main>
  );
}
