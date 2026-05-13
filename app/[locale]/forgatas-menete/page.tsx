import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createMetadata, isLocale, type Locale } from "@/lib/site";
import ForgatasMeneteExperience from "./ForgatasMeneteExperience";

type LocaleParams = Promise<{ locale: string }>;

export async function generateMetadata(props: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale: rawLocale } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";
  const isHu = locale === "hu";

  return createMetadata({
    locale,
    path: "/forgatas-menete",
    title: isHu
      ? "Forgatás menete | Richard Foto"
      : "Filming Flow | Richard Foto",
    description: isHu
      ? "Egy rövid, filmes hangulatú bemutató arról, hogyan épül fel a Richard Foto fotózás: cél, atmoszféra, karakter és időpont."
      : "A cinematic walkthrough of the Richard Foto process: goal, atmosphere, character and booking.",
  });
}

export default async function ForgatasMenetePage(props: {
  params: LocaleParams;
}) {
  const { locale: rawLocale } = await props.params;
  if (!isLocale(rawLocale)) notFound();

  return <ForgatasMeneteExperience locale={rawLocale} />;
}
