import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";
import { groq } from "next-sanity";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

type LocaleParams = Promise<{ locale: string }>;

type AboutDocument = {
  name: string;
  bio: string;
  experience?: number;
  email?: string;
  phone?: string;
  instagram?: string;
  facebook?: string;
  profileImage?: SanityImageSource;
};

function getAboutContent(locale: string) {
  if (locale === "hu") {
    return {
      storyTitle: "A jó fotó számomra nem a tökéletességről szól",
      storyText:
        "Hanem arról a pillanatról, amikor valaki valóban jelen van a képen. Azért fotózok, hogy ne csak szép portrék készüljenek, hanem olyan képek, amelyekben vissza lehet ismerni egy történetet, egy kapcsolatot vagy egy fontos életszakaszt.",
      valuesTitle: "Amire a munkámban építek",
      values: [
        {
          title: "Bizalom",
          text: "A legjobb képek akkor születnek, amikor biztonságban érzed magad, és nem azt érzed, hogy szerepelned kell.",
        },
        {
          title: "Őszinteség",
          text: "Nem erőltetett pózokat keresek, hanem azt, ami valóban rólad szól és hozzád illik.",
        },
        {
          title: "Időtállóság",
          text: "Olyan képekre törekszem, amelyek évekkel később is ugyanazzal az erővel hatnak.",
        },
      ],
      forWhoTitle: "Kikkel szeretek dolgozni",
      forWhoText:
        "Párokkal, családokkal, kreatív vállalkozókkal és mindenkivel, aki nem csupán szép fotókat szeretne, hanem önazonos képeket magáról vagy az életének fontos pillanatairól.",
      closingQuote:
        "A célom nem az, hogy megmutassam, hogyan nézel ki. Hanem az, hogy megmutassam, ki vagy egy adott pillanatban. Hős, Harcos, Ikon vagy a leendő Miniszterelnök.",
    };
  }

  return {
    storyTitle: "To me, great photography is not about perfection",
    storyText:
      "It is about the moment when someone is truly present in the frame. I photograph people so the result is not only beautiful, but honest, memorable, and connected to a real story.",
    valuesTitle: "What my work is built on",
    values: [
      {
        title: "Trust",
        text: "The strongest images happen when you feel safe and comfortable, not when you feel like you have to perform.",
      },
      {
        title: "Honesty",
        text: "I do not look for forced poses. I look for gestures, expressions, and moments that genuinely feel like you.",
      },
      {
        title: "Timelessness",
        text: "I aim to create photographs that still feel powerful years later, not just in the moment they were taken.",
      },
    ],
    forWhoTitle: "Who I love working with",
    forWhoText:
      "Couples, families, creative professionals, and anyone who wants more than attractive photos, but images that feel personal and true.",
    closingQuote:
      "My goal is not simply to show how you look, but who you are in a defining moment. A hero, a fighter, an icon, or the future prime minister.",
  };
}

export async function generateMetadata(props: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "about" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

const aboutQuery = groq`*[_type == "about"][0]{
  name,
  bio,
  experience,
  email,
  phone,
  instagram,
  facebook,
  profileImage
}`;

export default async function AboutPage(props: { params: LocaleParams }) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "about" });
  const about = await client.fetch<AboutDocument>(aboutQuery);
  const content = getAboutContent(locale);

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-zinc-900 text-white text-center py-32 px-4">
        <h1 className="text-5xl font-serif mb-4">{t("title")}</h1>
      </section>
      <section className="max-w-4xl mx-auto py-24 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
          {about.profileImage && (
            <Image
              src={urlFor(about.profileImage).width(600).height(800).url()}
              alt={about.name}
              width={600}
              height={800}
              className="w-full object-cover"
            />
          )}
          <div>
            <h2 className="text-3xl font-serif mb-6">{about.name}</h2>
            {about.experience && (
              <p className="text-zinc-400 text-sm tracking-widest mb-6">
                {about.experience} {t("experience").toUpperCase()}
              </p>
            )}
            <p className="text-zinc-600 leading-relaxed mb-8">
              {about.bio || content.storyText}
            </p>
            <div className="space-y-2 text-sm text-zinc-600">
              {about.email && <p>✉ {about.email}</p>}
              {about.phone && <p>✆ {about.phone}</p>}
              {about.instagram && (
                <a href={about.instagram} className="block hover:text-zinc-900">
                  {t("socialInstagram")}
                </a>
              )}
              {about.facebook && (
                <a href={about.facebook} className="block hover:text-zinc-900">
                  {t("socialFacebook")}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-zinc-50 py-24 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <p className="text-xs tracking-[0.35em] uppercase text-zinc-400 mb-5">
              Richard Foto
            </p>
            <h2 className="text-3xl md:text-4xl font-serif mb-6">{content.storyTitle}</h2>
            <p className="text-zinc-600 leading-relaxed">{content.storyText}</p>
          </div>
          <div>
            <h2 className="text-3xl font-serif mb-8">{content.valuesTitle}</h2>
            <div className="space-y-8">
              {content.values.map((item) => (
                <div key={item.title}>
                  <h3 className="text-xl font-serif mb-2">{item.title}</h3>
                  <p className="text-zinc-600 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-5xl mx-auto py-24 px-4">
        <div className="border border-zinc-200 p-10 md:p-14">
          <h2 className="text-3xl font-serif mb-6">{content.forWhoTitle}</h2>
          <p className="text-zinc-600 leading-relaxed mb-10">{content.forWhoText}</p>
          <blockquote className="text-2xl md:text-3xl font-serif leading-relaxed text-zinc-900">
            “{content.closingQuote}”
          </blockquote>
        </div>
      </section>
    </main>
  );
}
