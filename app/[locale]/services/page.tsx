import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type LocaleParams = Promise<{ locale: string }>;

type Service = {
  _id: string;
  title: string;
  price: number;
  duration?: string;
  description: string;
};

function getServicesContent(locale: string) {
  if (locale === "hu") {
    return {
      introTitle: "Nem csak képeket kapsz, hanem egy végigkísért élményt",
      introText:
        "A fotózás számomra nem néhány gyors kattintásból áll. Segítek a tervezésben, a helyszínválasztásban, az öltözékek átgondolásában és abban is, hogy a kamera előtt természetesen tudd önmagad adni.",
      promiseTitle: "Mit kapsz a fotózáson túl?",
      promiseItems: [
        "Segítséget a koncepció, helyszín és öltözék kiválasztásában.",
        "Nyugodt, irányított, mégis természetes fotózási élményt.",
        "Gondosan válogatott és utómunkázott, időtálló képeket.",
      ],
      processTitle: "Így dolgozom veled",
      processItems: [
        {
          title: "1. Rövid egyeztetés",
          text: "Átbeszéljük, milyen alkalomra készül a fotózás, milyen hangulatot szeretnél, és mi áll hozzád a legközelebb.",
        },
        {
          title: "2. Fotózás kényelmes tempóban",
          text: "Lépésről lépésre vezetlek, hogy ne pózokat erőltessünk, hanem valódi jelenlétet és jó pillanatokat kapjunk el.",
        },
        {
          title: "3. Válogatás és átadás",
          text: "A legerősebb képeket gondosan kidolgozva kapod meg, olyan formában, amit örömmel mutatsz meg másoknak is.",
        },
      ],
      faqTitle: "Gyakori kérdések",
      faqItems: [
        {
          q: "Mi van, ha még sosem voltam fotózáson?",
          a: "Ez teljesen rendben van. A legtöbb ügyfelem nem modell, ezért végig segítek abban, hogy kényelmesen és természetesen érezd magad.",
        },
        {
          q: "Segítesz a helyszín és az öltözék kiválasztásában?",
          a: "Igen. A fotózás előtt adok iránymutatást, hogy a végeredmény egységes, esztétikus és hozzád illő legyen.",
        },
        {
          q: "Mennyi idő alatt kapom meg a képeket?",
          a: "A végleges képek átadási ideje a csomagtól és a szezontól függ, de minden foglalásnál előre egyeztetjük az ütemezést.",
        },
      ],
      closingTitle: "Ha nem csak szép képeket szeretnél, hanem valódi emléket",
      closingText:
        "A célom az, hogy olyan képek készüljenek rólad, amik nemcsak jól néznek ki, hanem évek múlva is visszaadják, milyen volt az a pillanat.",
      closingCta: "Időpontot kérek",
    };
  }

  return {
    introTitle: "You get more than photos, you get a guided experience",
    introText:
      "For me, a photoshoot is never just a few quick shots. I help with the concept, location, styling, and with creating an atmosphere where you can feel natural in front of the camera.",
    promiseTitle: "What do you get beyond the shoot itself?",
    promiseItems: [
      "Guidance with concept, location, and outfit choices.",
      "A calm, directed, yet natural photoshoot experience.",
      "Carefully selected and professionally edited images that last.",
    ],
    processTitle: "How we work together",
    processItems: [
      {
        title: "1. A short consultation",
        text: "We talk through the occasion, the mood you want, and the visual direction that fits you best.",
      },
      {
        title: "2. A relaxed photoshoot",
        text: "I guide you step by step so we capture real presence and strong moments instead of forced poses.",
      },
      {
        title: "3. Selection and delivery",
        text: "You receive the strongest images carefully refined into a final set you will be proud to share.",
      },
    ],
    faqTitle: "Frequently asked questions",
    faqItems: [
      {
        q: "What if I have never had a professional photoshoot before?",
        a: "That is completely fine. Most of my clients are not models, so I guide you throughout the process and help you feel comfortable.",
      },
      {
        q: "Can you help with location and outfit selection?",
        a: "Yes. Before the session I provide direction so the final images feel cohesive, elegant, and true to you.",
      },
      {
        q: "How long does it take to receive the final images?",
        a: "Delivery depends on the package and the season, but the timeline is always discussed clearly before the shoot.",
      },
    ],
    closingTitle: "If you want more than beautiful photos",
    closingText:
      "My goal is to create images that do not simply look good, but still bring back the feeling of the moment years from now.",
    closingCta: "Request a booking",
  };
}

export async function generateMetadata(props: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "services" });

  return {
    title: locale === "hu" ? "Szolgáltatások és árak" : "Services and pricing",
    description: t("subtitle"),
  };
}
const servicesQuery = groq`*[_type == "service"] | order(price asc) {
  _id,
  title,
  price,
  duration,
  description
}`;

export default async function ServicesPage(props: { params: LocaleParams }) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "services" });
  const services = await client.fetch<Service[]>(servicesQuery);
  const content = getServicesContent(locale);

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-zinc-900 text-white text-center py-32 px-4">
        <h1 className="text-5xl font-serif mb-4">{t("title")}</h1>
        <p className="text-zinc-400 max-w-md mx-auto">{t("subtitle")}</p>
      </section>
      <section className="max-w-4xl mx-auto py-20 px-4 text-center">
        <p className="text-xs tracking-[0.35em] uppercase text-zinc-400 mb-5">
          Richard Foto
        </p>
        <h2 className="text-3xl md:text-4xl font-serif mb-6">{content.introTitle}</h2>
        <p className="text-zinc-600 leading-relaxed max-w-3xl mx-auto">
          {content.introText}
        </p>
      </section>
      <section className="max-w-5xl mx-auto py-24 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service._id} className="border border-zinc-200 p-8">
              <h3 className="text-2xl font-serif mb-2">{service.title}</h3>
              <p className="text-3xl font-light mb-4">
                {service.price.toLocaleString("hu-HU")} Ft
              </p>
              {service.duration && (
                <p className="text-xs tracking-[0.3em] uppercase text-zinc-400 mb-4">
                  {service.duration}
                </p>
              )}
              <p className="text-zinc-600 mb-8">{service.description}</p>
              <Link
                href={`/${locale}/booking`}
                className="block text-center border border-zinc-900 px-6 py-3 text-sm hover:bg-zinc-900 hover:text-white transition-all"
              >
                {t("book")}
              </Link>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-zinc-50 py-24 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-serif mb-8">{content.promiseTitle}</h2>
            <div className="space-y-5">
              {content.promiseItems.map((item) => (
                <div key={item} className="border-l border-zinc-300 pl-5 text-zinc-600 leading-relaxed">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-serif mb-8">{content.processTitle}</h2>
            <div className="space-y-8">
              {content.processItems.map((item) => (
                <div key={item.title}>
                  <h3 className="text-lg font-serif mb-2">{item.title}</h3>
                  <p className="text-zinc-600 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-5xl mx-auto py-24 px-4">
        <h2 className="text-3xl font-serif text-center mb-14">{content.faqTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.faqItems.map((item) => (
            <div key={item.q} className="border border-zinc-200 p-8">
              <h3 className="text-xl font-serif mb-4">{item.q}</h3>
              <p className="text-zinc-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-zinc-900 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-6">{content.closingTitle}</h2>
          <p className="text-zinc-300 leading-relaxed max-w-2xl mx-auto mb-10">
            {content.closingText}
          </p>
          <Link
            href={`/${locale}/booking`}
            className="inline-block border border-white px-8 py-3 text-sm tracking-widest hover:bg-white hover:text-zinc-900 transition-colors"
          >
            {content.closingCta}
          </Link>
        </div>
      </section>
    </main>
  );
}
