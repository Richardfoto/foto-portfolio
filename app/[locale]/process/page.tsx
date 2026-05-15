import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createMetadata, isLocale, type Locale } from "@/lib/site";
import ProcessScrollController from "./ProcessScrollController";

type LocaleParams = Promise<{ locale: string }>;

type ProcessScene = {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  body?: string;
  words?: string[];
  points?: string[];
  outro?: string;
  duration?: string;
};

const processCopy = {
  hu: {
    metaTitle: "Enter the Production | Richard Foto",
    metaDescription:
      "Cinematic bemutató arról, hogyan épül fel egy Richard Foto fotózás: konzultáció, atmoszféra, forgatás, utómunka és átadás.",
    nav: [
      "Prelude",
      "Story",
      "Mood",
      "Shoot",
      "Color",
      "Delivery",
      "Booking",
    ],
    production: {
      location: "Budapest",
      format: "Photo / Film / Portrait",
      status: "Pre-production",
      roll: "RF-2015",
    },
    opening: {
      eyebrow: "Opening sequence",
      title: "PRELUDE — BEFORE THE FRAME",
      lines: [
        "Minden fotózás egy beszélgetéssel kezdődik.",
        "Nem kamerákról.",
        "Nem pózokról.",
        "Hanem rólad.",
      ],
      body: "Mielőtt elkészülne az első kép, meg kell értenem, ki vagy, milyen energiát szeretnél közvetíteni, és hogyan szeretnéd, hogy emlékezzenek rád.",
    },
    scenes: [
      {
        id: "01",
        eyebrow: "Scene 01",
        title: "Story discovery",
        intro:
          "Az első konzultáció során közösen feltérképezzük a projekt vizuális irányát.",
        points: [
          "mi a fotózás célja",
          "milyen atmoszféra áll hozzád közel",
          "milyen képi világ működik hitelesen",
          "hol készüljenek a képek",
          "milyen platformokon jelennek majd meg",
        ],
        outro:
          "A cél nem egyszerűen néhány szép kép elkészítése, hanem egy olyan vizuális jelenlét létrehozása, ami valóban tükröz Téged.",
      },
      {
        id: "02",
        eyebrow: "Scene 02",
        title: "Mood & atmosphere",
        intro:
          "A fotózás előtt közösen kialakítjuk a projekt ritmusát és hangulatát.",
        words: [
          "Helyszínek.",
          "Fények.",
          "Színek.",
          "Textúrák.",
          "Mozgás.",
          "Energia.",
        ],
        points: [
          "milyen ruhák működnek jól kamerán",
          "milyen környezet illik a történethez",
          "milyen érzetet szeretnénk létrehozni",
          "melyik session illik legjobban az elképzeléseidhez",
        ],
        outro:
          "Minden projekt más atmoszférát kíván. Van, amelyik csendesebb és intimebb. Van, amelyik filmszerűbb, erőteljesebb vagy nyersebb.",
      },
      {
        id: "03",
        eyebrow: "Scene 03",
        title: "The shoot",
        intro:
          "A kamera előtt nem tökéletesnek kell lenned. Jelen kell lenned.",
        points: [
          "természetes mozgások",
          "jelenetek kialakítása",
          "pózolási segítség",
          "komfortos jelenlét a kamera előtt",
        ],
        body: "A legtöbb ember nem modell. És nem is kell annak lennie. A legerősebb képek általában azok a pillanatok, amikor megszűnik a szerepjáték, és valami valódi jelenik meg a kamera előtt.",
        duration:
          "Egy rövidebb portré session általában 1-1,5 órát vesz igénybe, míg egy komplexebb storytelling vagy personal branding fotózás akár több helyszínen, fél napos produkcióként is készülhet.",
      },
      {
        id: "04",
        eyebrow: "Scene 04",
        title: "Color & emotion",
        intro:
          "A fotózás a kamera kikapcsolása után sem ér véget. Az utómunka során a nyers képekből atmoszféra születik.",
        points: [
          "természetes bőrtónusok",
          "filmszerű fények",
          "kontrasztok",
          "színek ritmusa",
          "egységes cinematic hangulat",
        ],
        outro:
          "A cél nem a túlretusált tökéletesség, hanem az érzet. Az a hangulat, amit a képek néhány másodperc alatt képesek átadni.",
      },
      {
        id: "05",
        eyebrow: "Final frame",
        title: "Delivery",
        intro:
          "Az elkészült képeket online galérián keresztül kapod meg, nagy felbontásban, könnyen letölthető formában.",
        body: "Az átadás általában 7-10 munkanapon belül történik, a projekt méretétől függően.",
        outro:
          "A végleges anyag nem csupán fotók gyűjteménye. Hanem egy vizuális lenyomat arról, ki voltál abban a pillanatban.",
        duration:
          "Az elkészült képeket a leadástól számított egy évig biztonsági mentésként saját szerveren is megőrzöm.",
      },
    ] satisfies ProcessScene[],
    cta: {
      eyebrow: "Booking ending scene",
      title: "BOOK THE SESSION",
      text: "A történeted itt kezdődik.",
      button: "Időpontot kérek",
    },
  },
  en: {
    metaTitle: "Enter the Production | Richard Foto",
    metaDescription:
      "A cinematic walkthrough of the Richard Foto process: consultation, atmosphere, shoot, color work and delivery.",
    nav: [
      "Prelude",
      "Story",
      "Mood",
      "Shoot",
      "Color",
      "Delivery",
      "Booking",
    ],
    production: {
      location: "Budapest",
      format: "Photo / Film / Portrait",
      status: "Pre-production",
      roll: "RF-2015",
    },
    opening: {
      eyebrow: "Opening sequence",
      title: "PRELUDE — BEFORE THE FRAME",
      lines: [
        "Every session starts with a conversation.",
        "Not about cameras.",
        "Not about poses.",
        "About you.",
      ],
      body: "Before the first frame exists, I need to understand who you are, what energy you want to communicate, and how you want to be remembered.",
    },
    scenes: [
      {
        id: "01",
        eyebrow: "Scene 01",
        title: "Story discovery",
        intro:
          "During the first consultation, we map the visual direction of the project together.",
        points: [
          "what the shoot needs to achieve",
          "which atmosphere feels close to you",
          "what visual language feels credible",
          "where the images should be made",
          "which platforms the images will live on",
        ],
        outro:
          "The goal is not simply to create a few beautiful images, but to build a visual presence that genuinely reflects you.",
      },
      {
        id: "02",
        eyebrow: "Scene 02",
        title: "Mood & atmosphere",
        intro:
          "Before the shoot, we shape the rhythm and atmosphere of the project.",
        words: [
          "Locations.",
          "Light.",
          "Colors.",
          "Textures.",
          "Movement.",
          "Energy.",
        ],
        points: [
          "which clothes work well on camera",
          "which environment fits the story",
          "what feeling we want to create",
          "which session best fits your idea",
        ],
        outro:
          "Every project needs its own atmosphere. Some are quieter and more intimate. Some are more cinematic, stronger or rawer.",
      },
      {
        id: "03",
        eyebrow: "Scene 03",
        title: "The shoot",
        intro:
          "In front of the camera, you do not need to be perfect. You need to be present.",
        points: [
          "natural movement",
          "scene building",
          "posing guidance",
          "a comfortable presence in front of the camera",
        ],
        body: "Most people are not models. They do not need to be. The strongest images usually appear when the performance disappears and something real arrives in front of the camera.",
        duration:
          "A shorter portrait session usually takes 1-1.5 hours, while a more complex storytelling or personal branding shoot can become a half-day production across multiple locations.",
      },
      {
        id: "04",
        eyebrow: "Scene 04",
        title: "Color & emotion",
        intro:
          "The shoot does not end when the camera turns off. During post-production, raw frames become atmosphere.",
        points: [
          "natural skin tones",
          "cinematic light",
          "contrast",
          "rhythm of colors",
          "a consistent cinematic mood",
        ],
        outro:
          "The goal is not over-retouched perfection, but feeling. The atmosphere the images can communicate within a few seconds.",
      },
      {
        id: "05",
        eyebrow: "Final frame",
        title: "Delivery",
        intro:
          "You receive the finished images through an online gallery, in high resolution and in an easy-to-download format.",
        body: "Delivery usually happens within 7-10 business days, depending on the size of the project.",
        outro:
          "The final material is not just a collection of photographs. It is a visual imprint of who you were in that moment.",
        duration:
          "The delivered images are also kept as a backup on my own server for one year after delivery.",
      },
    ] satisfies ProcessScene[],
    cta: {
      eyebrow: "Booking ending scene",
      title: "BOOK THE SESSION",
      text: "Your story starts here.",
      button: "Request a date",
    },
  },
};

export async function generateMetadata(props: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale: rawLocale } = await props.params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "hu";
  const copy = processCopy[locale];

  return createMetadata({
    locale,
    path: "/process",
    title: copy.metaTitle,
    description: copy.metaDescription,
    keywords:
      locale === "hu"
        ? [
            "fotózás menete",
            "cinematic fotózás Budapest",
            "personal branding fotózás",
            "Richard Foto",
          ]
        : [
            "photography process",
            "cinematic photography Budapest",
            "personal branding photography",
            "Richard Foto",
          ],
  });
}

export default async function ProcessPage(props: { params: LocaleParams }) {
  const { locale: rawLocale } = await props.params;
  if (!isLocale(rawLocale)) notFound();

  const locale = rawLocale;
  const copy = processCopy[locale];
  const bookingHref = `/${locale}/booking`;

  return (
    <main className="process-root">
      <ProcessScrollController />
      <div className="process-noise" aria-hidden="true" />
      <aside className="process-scene-nav" aria-label="Production scenes">
        <Link href={`/${locale}`} className="process-brand">
          Richard Foto
        </Link>
        <div className="process-scene-list">
          {copy.nav.map((item, index) => (
            <a key={item} href={`#process-scene-${index}`}>
              <span>{String(index).padStart(2, "0")}</span>
              {item}
            </a>
          ))}
        </div>
      </aside>

      <section className="process-horizontal-reel" aria-label="Production scenes">
        <div className="process-horizontal-sticky">
          <div className="process-horizontal-track">
            <section className="process-panel process-hero" id="process-scene-0">
              <div className="process-rec">
                <span />
                REC
              </div>
              <div className="process-timecode">00:00:00:01</div>

              <div className="process-hero-inner">
                <p className="process-kicker">{copy.opening.eyebrow}</p>
                <h1>{copy.opening.title}</h1>
                <div className="process-opening-lines">
                  {copy.opening.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <p className="process-hero-body">{copy.opening.body}</p>
              </div>

              <dl className="process-production-meta">
                {Object.entries(copy.production).map(([key, value]) => (
                  <div key={key}>
                    <dt>{key}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {copy.scenes.map((scene, index) => (
              <article
                key={scene.id}
                className={`process-panel process-scene process-scene-${scene.id}`}
                id={`process-scene-${index + 1}`}
              >
                <div className="process-scene-frame">
                  <div className="process-scene-meta">
                    <span>{scene.eyebrow}</span>
                    <span>{`TC 00:0${index + 1}:15:${String(
                      12 + index * 7,
                    ).padStart(2, "0")}`}</span>
                  </div>

                  <div className="process-scene-grid">
                    <div className="process-scene-title">
                      <p>{scene.id}</p>
                      <h2>{scene.title}</h2>
                    </div>

                    <div className="process-scene-content">
                      {scene.intro ? (
                        <p className="process-lead">{scene.intro}</p>
                      ) : null}

                      {scene.words ? (
                        <div className="process-word-stack" aria-label={scene.title}>
                          {scene.words.map((word) => (
                            <span key={word}>{word}</span>
                          ))}
                        </div>
                      ) : null}

                      {scene.points ? (
                        <ul className="process-points">
                          {scene.points.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      ) : null}

                      {scene.body ? <p>{scene.body}</p> : null}
                      {scene.outro ? (
                        <p className="process-outro">{scene.outro}</p>
                      ) : null}
                      {scene.duration ? (
                        <p className="process-duration">{scene.duration}</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            ))}

            <section className="process-panel process-cta" id="process-scene-6">
              <div className="process-rec">
                <span />
                READY
              </div>
              <p>{copy.cta.eyebrow}</p>
              <h2>{copy.cta.title}</h2>
              <span>{copy.cta.text}</span>
              <Link href={bookingHref}>{copy.cta.button}</Link>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
