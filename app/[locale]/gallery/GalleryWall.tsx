"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export type GalleryWallItem = {
  id: string;
  imageUrl: string;
  title: string;
  story?: string;
  size?: "small" | "medium" | "large" | "wide" | "tall";
};

type GalleryWallProps = {
  items: GalleryWallItem[];
  locale: string;
};

export default function GalleryWall({ items, locale }: GalleryWallProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<GalleryWallItem | null>(null);
  const activeItem = items[activeIndex] ?? items[0];
  const slideLabel = useMemo(
    () => `${String(activeIndex + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`,
    [activeIndex, items.length],
  );

  useEffect(() => {
    if (items.length <= 1 || selected) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 5200);

    return () => window.clearInterval(interval);
  }, [items.length, selected]);

  if (!activeItem) return null;

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % items.length);
  };

  return (
    <>
      <section>
        <div className="group relative overflow-hidden bg-neutral-950 shadow-[0_28px_90px_rgba(20,20,20,0.16)]">
          <button
            type="button"
            onClick={() => setSelected(activeItem)}
            className="relative block min-h-[72svh] w-full overflow-hidden text-left md:min-h-[820px]"
            aria-label={
              locale === "hu"
                ? `${activeItem.title} történetének megnyitása`
                : `Open the story for ${activeItem.title}`
            }
          >
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`absolute inset-0 transition duration-1000 ease-out ${
                  index === activeIndex
                    ? "scale-100 opacity-100"
                    : "scale-[1.015] opacity-0"
                }`}
                aria-hidden={index !== activeIndex}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  className="object-contain p-3 opacity-95 transition duration-[5200ms] ease-linear group-hover:scale-[1.025] md:p-6"
                />
              </div>
            ))}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/78 via-black/24 to-transparent p-5 text-white md:p-8">
              <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-white/45">
                {slideLabel}
              </p>
              <h2 className="max-w-2xl font-serif text-4xl leading-tight tracking-tight md:text-6xl">
                {activeItem.title}
              </h2>
              <p className="mt-5 text-xs uppercase tracking-[0.22em] text-white/62">
                {locale === "hu"
                  ? "Kattints a történethez"
                  : "Click for the story"}
              </p>
            </div>
          </button>

          {items.length > 1 && (
            <div className="absolute right-4 top-4 flex gap-2 md:right-6 md:top-6">
              <button
                type="button"
                onClick={goToPrevious}
                className="grid h-11 w-11 place-items-center border border-white/35 bg-black/20 text-xl text-white backdrop-blur transition-colors hover:bg-white hover:text-neutral-950"
                aria-label={locale === "hu" ? "Előző kép" : "Previous image"}
              >
                ←
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="grid h-11 w-11 place-items-center border border-white/35 bg-black/20 text-xl text-white backdrop-blur transition-colors hover:bg-white hover:text-neutral-950"
                aria-label={locale === "hu" ? "Következő kép" : "Next image"}
              >
                →
              </button>
            </div>
          )}
        </div>
      </section>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black/78 p-4 text-white backdrop-blur-sm md:items-center md:justify-center md:p-8"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="absolute right-4 top-4 border border-white/40 px-4 py-3 text-xs uppercase tracking-[0.18em] transition-colors hover:bg-white hover:text-neutral-950 md:right-8 md:top-8"
          >
            {locale === "hu" ? "Bezár" : "Close"}
          </button>
          <div className="grid max-h-[88vh] w-full max-w-6xl overflow-y-auto bg-neutral-950 shadow-[0_30px_100px_rgba(0,0,0,0.45)] md:grid-cols-[1.05fr_0.95fr]">
            <figure className="relative min-h-[420px] bg-black md:min-h-[620px]">
              <Image
                src={selected.imageUrl}
                alt={selected.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-4"
              />
            </figure>
            <div className="flex flex-col justify-end p-7 md:p-10">
              <p className="mb-5 text-xs uppercase tracking-[0.28em] text-white/45">
                {locale === "hu" ? "Képtörténet" : "Image story"}
              </p>
              <h3 className="font-serif text-4xl leading-tight tracking-tight md:text-6xl">
                {selected.title}
              </h3>
              {selected.story && (
                <p className="mt-7 text-lg leading-8 text-white/70">{selected.story}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
