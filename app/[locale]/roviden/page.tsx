import type { Metadata } from "next";
import type { SanityImageSource } from "@sanity/image-url";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import { createMetadata, isLocale, type Locale } from "@/lib/site";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import RovidenExperience from "./RovidenExperience";

type LocaleParams = Promise<{ locale: string }>;
type RovidenImages = {
  heroImage?: SanityImageSource;
  frameImage?: SanityImageSource;
  brandImage?: SanityImageSource;
  atmosphereImage?: SanityImageSource;
  creatorImage?: SanityImageSource;
  whyImage?: SanityImageSource;
};

const forgatasMeneteQuery = groq`coalesce(
  *[_id == "forgatasMenete"][0],
  *[_type == "forgatasMenete" && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]
){
  heroImage,
  frameImage,
  brandImage,
  atmosphereImage,
  creatorImage,
  whyImage
}`;

function getSanityImageUrl(image: SanityImageSource | undefined) {
  if (!image) return undefined;

  return urlFor(image).width(2200).auto("format").url();
}

export async function generateMetadata(props: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale: rawLocale } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";
  const isHu = locale === "hu";

  return createMetadata({
    locale,
    path: "/roviden",
    title: isHu ? "Röviden | Richard Foto" : "In Brief | Richard Foto",
    description: isHu
      ? "Egy rövid, filmes hangulatú bemutató arról, hogyan épül fel a Richard Foto fotózás: cél, atmoszféra, karakter és időpont."
      : "A cinematic walkthrough of the Richard Foto process: goal, atmosphere, character and booking.",
  });
}

export default async function RovidenPage(props: {
  params: LocaleParams;
}) {
  const { locale: rawLocale } = await props.params;
  if (!isLocale(rawLocale)) notFound();

  const images = await client.fetch<RovidenImages | null>(
    forgatasMeneteQuery,
  );

  return (
    <RovidenExperience
      locale={rawLocale}
      images={{
        hero: getSanityImageUrl(images?.heroImage),
        frame: getSanityImageUrl(images?.frameImage),
        brand: getSanityImageUrl(images?.brandImage),
        atmosphere: getSanityImageUrl(images?.atmosphereImage),
        creator: getSanityImageUrl(images?.creatorImage),
        why: getSanityImageUrl(images?.whyImage),
      }}
    />
  );
}
