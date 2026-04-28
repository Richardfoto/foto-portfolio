"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";

interface Item {
  _id: string;
  title: string;
  category?: string;
  coverImage?: SanityImageSource;
}

type ItemWithImage = Item & { coverImage: SanityImageSource };

export default function FeaturedRotator({
  featured,
  gallery,
}: {
  featured: Item[];
  gallery: Item[];
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const featuredWithImages = (featured ?? []).filter(
    (item): item is ItemWithImage => Boolean(item.coverImage),
  );

  if (!featuredWithImages.length) return null;

  const allImages: ItemWithImage[] = [
    ...featuredWithImages,
    ...(gallery ?? []).filter(
      (item): item is ItemWithImage =>
        Boolean(item.coverImage) &&
        !featuredWithImages.some((featuredItem) => featuredItem._id === item._id),
    ),
  ];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goToPrev = () =>
    setLightboxIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));

  const goToNext = () =>
    setLightboxIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {featuredWithImages.slice(0, 2).map((item, index) => {
          const imageUrl = item.coverImage
            ? urlFor(item.coverImage).width(2000).format("webp").quality(90).url()
            : null;

          return (
            <button
              type="button"
              key={item._id}
              onClick={() => openLightbox(index)}
              className="group block w-full cursor-pointer text-left"
              aria-label={`Open ${item.title}`}
            >
              <div className="relative h-[70vh] w-full overflow-hidden bg-zinc-100 md:h-[80vh]">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={item.title}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                )}

                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                  {item.category && (
                    <p className="text-xs uppercase tracking-widest text-white/70 mb-2">
                      {item.category}
                    </p>
                  )}
                  <h2 className="text-3xl md:text-4xl font-serif text-white leading-tight">
                    {item.title}
                  </h2>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <div className="relative w-full h-full flex flex-col items-center justify-center px-4">
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close gallery image"
              className="absolute top-6 right-6 text-white text-4xl z-50"
            >
              ✕
            </button>

            <div className="relative w-full max-w-6xl h-[80vh]">
              <Image
                src={urlFor(allImages[lightboxIndex].coverImage)
                  .width(2000)
                  .format("webp")
                  .quality(90)
                  .url()}
                alt={allImages[lightboxIndex].title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            <p className="text-white mt-6 text-lg text-center">
              {allImages[lightboxIndex].title}
            </p>

            <div className="absolute inset-y-0 left-0 flex items-center">
              <button
                type="button"
                onClick={goToPrev}
                aria-label="Previous image"
                className="text-white text-4xl px-6"
              >
                ←
              </button>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                type="button"
                onClick={goToNext}
                aria-label="Next image"
                className="text-white text-4xl px-6"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
