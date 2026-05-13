"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import type { Locale } from "@/lib/site";

type VisualAsset = {
  src: string;
  alt: string;
};

type ExperienceCopy = {
  chapters: string[];
  hero: {
    kicker: string;
    title: string;
    titleSecond: string;
    lead: string;
    image: VisualAsset;
  };
  frame: {
    label: string;
    title: string;
    body: string;
    processLabel: string;
    processTitle: string;
    processBody: string;
    steps: Array<{
      number: string;
      title: string;
      body: string;
    }>;
  };
  character: {
    label: string;
    title: string;
    body: string;
    brandLabel: string;
    brandTitle: string;
    atmosphereLabel: string;
    atmosphereTitle: string;
    creatorLabel: string;
    creatorTitle: string;
  };
  why: {
    label: string;
    title: string;
    body: string;
  };
  booking: {
    label: string;
    title: string;
    cta: string;
  };
};

const assets = {
  hero: {
    src: "https://cdn.sanity.io/images/au19aoqa/production/86c5b3966ca36bfa7657c46ac2de682ebb60a113-6000x4000.jpg",
    alt: "Richard Foto filmes hangulatú fotózás Budapesten",
  },
  personalBrand: {
    src: "https://cdn.sanity.io/images/au19aoqa/production/c53a7b80bd51581f08e0dde261cb9f8543dd9a8a-4088x2725.jpg",
    alt: "Personal Brand Starter fotózás Budapest",
  },
  creator: {
    src: "https://cdn.sanity.io/images/au19aoqa/production/d910e34af7cc20e48614b194c25c461c32239ed5-3877x5216.png",
    alt: "Content Creator Day fotózás Budapest",
  },
  profile: {
    src: "https://cdn.sanity.io/images/au19aoqa/production/e5e576929446cccbcf32f6dbafefb8559c8ba7b7-4000x6000.jpg",
    alt: "Richard Varga fotós portré",
  },
  booking: {
    src: "https://cdn.sanity.io/images/au19aoqa/production/170249db2ec5f9f9fba1aad60fc7fef09ceb58ab-3740x2496.jpg",
    alt: "Filmes hangulatú fotózás Budapest",
  },
} satisfies Record<string, VisualAsset>;

const copy: Record<Locale, ExperienceCopy> = {
  hu: {
    chapters: ["Intro", "Frame", "Karakter", "Miért én", "Időpont"],
    hero: {
      kicker: "Budapest / film / portrait",
      title: "Nem csak képet készítek.",
      titleSecond: "Örök élményt készítek.",
      lead: "Egy frame az életedből, emléknek vagy egy új kezdethez.",
      image: assets.hero,
    },
    frame: {
      label: "02 / frame",
      title: "A menet egyszerű.",
      body: "A karakter adott. Elmeséled, mi a cél, én keretet adok neki, és leforgatom. Csak mesélj, a kamera meg forog.",
      processLabel: "Három lépés",
      processTitle: "A jelenet viszi előre a képet.",
      processBody:
        "Itt már csak az számít, mit szeretnél, hogyan dolgozunk, és mikor indul a jelenet.",
      steps: [
        {
          number: "01",
          title: "Elmondod a célt",
          body: "Nem pózolást kérdezek, hanem irányt: mire kell a kép, milyen hangulatot vigyen.",
        },
        {
          number: "02",
          title: "Keretet adok neki",
          body: "Helyszín, fény, ritmus, technika. A kép nem véletlenül történik meg.",
        },
        {
          number: "03",
          title: "Leforgatjuk",
          body: "Vezetlek, de nem túlvezérellek. A pillanatnak hagyok annyi teret, amennyi kell.",
        },
      ],
    },
    character: {
      label: "03 / karakter",
      title: "A szerep adja a képet.",
      body: "Minden scroll jelenetet vált. Minden blokk más tempót hoz.",
      brandLabel: "Personal Brand Starter",
      brandTitle: "A szakmai szerepedet tesszük láthatóvá.",
      atmosphereLabel: "Filmforgatásokon szocializálódott látásmód",
      atmosphereTitle: "Felkavar, megmozgat, megmosolyogtat.",
      creatorLabel: "Werk / social / kampány",
      creatorTitle: "Több hét anyag egy napból.",
    },
    why: {
      label: "04 / miért én",
      title: "Miért engem válassz?",
      body: "Egy erős kép több mindenre válaszol, mint egy hosszú magyarázat.",
    },
    booking: {
      label: "05 / időpont",
      title: "Kezdjük el a közös projektet.",
      cta: "Időpontot kérek",
    },
  },
  en: {
    chapters: ["Intro", "Frame", "Character", "Why me", "Date"],
    hero: {
      kicker: "Budapest / film / portrait",
      title: "I do not just take pictures.",
      titleSecond: "I create lasting experiences.",
      lead: "A frame from your life, for memory or a new beginning.",
      image: assets.hero,
    },
    frame: {
      label: "02 / frame",
      title: "The process is simple.",
      body: "The character is already there. You tell me the goal, I build the frame around it, and we shoot the scene.",
      processLabel: "Three steps",
      processTitle: "The scene moves the image forward.",
      processBody:
        "From here, it is only about what you want, how we work, and when the scene begins.",
      steps: [
        {
          number: "01",
          title: "You tell me the goal",
          body: "I do not start with posing. I ask what the image is for and what mood it should carry.",
        },
        {
          number: "02",
          title: "I frame it",
          body: "Location, light, rhythm and technique. Strong images do not happen by accident.",
        },
        {
          number: "03",
          title: "We shoot it",
          body: "I guide you without over-directing. The moment gets the space it needs.",
        },
      ],
    },
    character: {
      label: "03 / character",
      title: "The role shapes the image.",
      body: "Each scroll changes the scene. Each block brings a different tempo.",
      brandLabel: "Personal Brand Starter",
      brandTitle: "We make your professional role visible.",
      atmosphereLabel: "A film-set way of seeing",
      atmosphereTitle: "It should move, stir and make you smile.",
      creatorLabel: "Werk / social / campaign",
      creatorTitle: "Weeks of material from one day.",
    },
    why: {
      label: "04 / why me",
      title: "Why choose me?",
      body: "One strong image can answer more than a long explanation.",
    },
    booking: {
      label: "05 / date",
      title: "Let us start the project.",
      cta: "Request a date",
    },
  },
};

function MagneticImage({
  image,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 88vw, 38vw",
}: {
  image: VisualAsset;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={`fm-magnetic-image ${className}`}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes={sizes}
        className="fm-image-cover"
      />
    </div>
  );
}

export default function ForgatasMeneteExperience({
  locale,
}: {
  locale: Locale;
}) {
  const rootRef = useRef<HTMLElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const horizontalRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const t = copy[locale];

  useEffect(() => {
    const root = rootRef.current;
    const cursor = cursorRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.25,
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.82,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".fm-hero-word",
        { yPercent: 120, rotate: 4, opacity: 0 },
        {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.12,
          ease: "power4.out",
        },
      );

      gsap.to(".fm-hero-image", {
        scale: 1.14,
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: ".fm-hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.utils.toArray<HTMLElement>(".fm-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 86, opacity: 0, filter: "blur(14px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 82%",
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".fm-float-layer").forEach((el, index) => {
        gsap.to(el, {
          yPercent: index % 2 ? 18 : -16,
          rotate: index % 2 ? 3 : -4,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("section") ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      const section = horizontalRef.current;
      const track = trackRef.current;
      const isDesktop = window.matchMedia("(min-width: 1025px)").matches;

      if (isDesktop && section && track) {
        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 0.9,
            anticipatePin: 1,
            end: () => `+=${Math.max(track.scrollWidth, window.innerWidth * 3)}`,
            invalidateOnRefresh: true,
          },
        });
      }

      gsap.to(".fm-marquee-track", {
        xPercent: -50,
        ease: "none",
        repeat: -1,
        duration: 24,
      });
    }, root);

    const onMouseMove = (event: MouseEvent) => {
      if (!cursor) return;
      gsap.to(cursor, {
        x: event.clientX,
        y: event.clientY,
        duration: 0.55,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", onMouseMove);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      ctx.revert();
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, []);

  return (
    <main ref={rootRef} className="fm-root">
      <div ref={cursorRef} className="fm-cursor-orb" aria-hidden="true" />

      <nav
        className="fm-chapter-nav"
        aria-label={locale === "hu" ? "Forgatás menete" : "Filming flow"}
      >
        <Link className="fm-brand" href={`/${locale}`}>
          Richard Foto
        </Link>
        <div>
          {t.chapters.map((chapter, index) => (
            <a href={`#chapter-${index + 1}`} key={chapter}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {chapter}
            </a>
          ))}
        </div>
      </nav>

      <section className="fm-hero" id="chapter-1">
        <div className="fm-hero-image">
          <Image
            src={t.hero.image.src}
            alt={t.hero.image.alt}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="fm-image-cover"
          />
        </div>
        <div className="fm-hero-vignette" />
        <div className="fm-hero-content">
          <p className="fm-eyebrow">{t.hero.kicker}</p>
          <h1 aria-label={`${t.hero.title} ${t.hero.titleSecond}`}>
            <span className="fm-line-mask">
              <span className="fm-hero-word">{t.hero.title}</span>
            </span>
            <span className="fm-line-mask">
              <span className="fm-hero-word">{t.hero.titleSecond}</span>
            </span>
          </h1>
          <p className="fm-hero-lead">{t.hero.lead}</p>
        </div>
        <div className="fm-scroll-note">
          <span>Scroll</span>
          <span>to roll camera</span>
        </div>
      </section>

      <section className="fm-manifesto" id="chapter-2">
        <div className="fm-manifesto-text fm-reveal">
          <p>{t.frame.label}</p>
          <h2>{t.frame.title}</h2>
          <span>{t.frame.body}</span>
        </div>
        <div className="fm-frame-process-heading fm-reveal">
          <p>{t.frame.processLabel}</p>
          <h3>{t.frame.processTitle}</h3>
          <span>{t.frame.processBody}</span>
        </div>
        <div className="fm-frame-process fm-reveal">
          {t.frame.steps.map((step) => (
            <article className="fm-frame-process-card" key={step.number}>
              <p>{step.number}</p>
              <h3>{step.title}</h3>
              <span>{step.body}</span>
            </article>
          ))}
        </div>
        <MagneticImage
          image={assets.creator}
          className="fm-manifesto-image fm-float-layer"
        />
        <div className="fm-manifesto-ring fm-float-layer" aria-hidden="true" />
      </section>

      <section
        className="fm-horizontal-stage"
        id="chapter-3"
        ref={horizontalRef}
      >
        <div className="fm-horizontal-track" ref={trackRef}>
          <article className="fm-film-panel fm-panel-type">
            <p>{t.character.label}</p>
            <h2>{t.character.title}</h2>
            <span>{t.character.body}</span>
          </article>
          <article className="fm-film-panel fm-panel-image">
            <MagneticImage image={assets.personalBrand} priority />
            <div className="fm-panel-echo" aria-hidden="true">
              <span>frame</span>
              <span>light</span>
              <span>motion</span>
              <span>ritmus</span>
              <span>frame</span>
              <span>light</span>
              <span>motion</span>
              <span>ritmus</span>
            </div>
            <div>
              <p>{t.character.brandLabel}</p>
              <h3>{t.character.brandTitle}</h3>
            </div>
          </article>
          <article className="fm-film-panel fm-panel-split">
            <MagneticImage image={assets.profile} />
            <div>
              <p>{t.character.atmosphereLabel}</p>
              <h3>{t.character.atmosphereTitle}</h3>
            </div>
          </article>
          <article className="fm-film-panel fm-panel-image">
            <MagneticImage image={assets.creator} />
            <div className="fm-panel-echo" aria-hidden="true">
              <span>camera</span>
              <span>roll</span>
              <span>frame</span>
              <span>light</span>
              <span>camera</span>
              <span>roll</span>
              <span>frame</span>
              <span>light</span>
            </div>
            <div>
              <p>{t.character.creatorLabel}</p>
              <h3>{t.character.creatorTitle}</h3>
            </div>
          </article>
        </div>
      </section>

      <section className="fm-marquee-section" aria-label="visual rhythm">
        <div className="fm-marquee-track">
          {Array.from({ length: 2 }).map((_, group) => (
            <div className="fm-marquee-group" key={group}>
              <span>kamera forog</span>
              <span>film</span>
              <span>fény</span>
              <span>ritmus</span>
              <span>keret</span>
              <span>örök élmény</span>
            </div>
          ))}
        </div>
      </section>

      <section className="fm-why-me-wall" id="chapter-4">
        <div className="fm-section-heading fm-reveal">
          <p>{t.why.label}</p>
          <h2>{t.why.title}</h2>
          <span>{t.why.body}</span>
        </div>

        <article className="fm-why-me-card fm-reveal">
          <MagneticImage
            image={assets.profile}
            className="fm-why-me-image"
            sizes="(max-width: 768px) 92vw, 70vw"
          />
        </article>
      </section>

      <section className="fm-booking" id="chapter-5">
        <div>
          <p>{t.booking.label}</p>
          <h2>{t.booking.title}</h2>
        </div>
        <Link href={`/${locale}/booking`}>{t.booking.cta}</Link>
      </section>
    </main>
  );
}
