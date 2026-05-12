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
  featured = [],
  gallery = [],
}: {
  featured?: Item[];
  gallery?: Item[];
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const selectedImages = (
    featured.length ? featured : gallery
  )
    .filter((item): item is ItemWithImage => Boolean(item.coverImage))
    .slice(0, 2);

  if (!selectedImages.length) return null;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goToPrev = () => {
    setLightboxIndex((prev) => (prev === 0 ? selectedImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setLightboxIndex((prev) => (prev === selectedImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
        {selectedImages.map((item, index) => {
          const imageUrl = urlFor(item.coverImage)
            .ignoreImageParams()
            .width(2000)
            .fit("max")
            .format("webp")
            .quality(90)
            .url();

          return (
            <button
              key={item._id}
              type="button"
              onClick={() => openLightbox(index)}
              className="group block w-full cursor-pointer text-left"
              aria-label={`Open ${item.title}`}
            >
              <div className="relative h-[70vh] w-full overflow-hidden bg-zinc-100 md:h-[80vh]">
                <Image
                  src={imageUrl}
                  alt={item.title}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="image-soft-motion object-contain p-2"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80" />

                <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
                  {item.category && (
                    <p className="mb-2 text-xs uppercase tracking-widest text-white/70">
                      {item.category}
                    </p>
                  )}

                  <h2 className="font-serif text-3xl leading-tight text-white md:text-4xl">
                    {item.title}
                  </h2>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {lightboxOpen && selectedImages[lightboxIndex] && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/95"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <div className="relative flex h-full w-full flex-col items-center justify-center px-4">
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close gallery image"
              className="absolute right-6 top-6 z-50 text-4xl text-white"
            >
              ✕
            </button>

            <div className="relative h-[80vh] w-full max-w-6xl">
              <Image
                src={urlFor(selectedImages[lightboxIndex].coverImage)
                  .ignoreImageParams()
                  .width(2000)
                  .fit("max")
                  .format("webp")
                  .quality(90)
                  .url()}
                alt={selectedImages[lightboxIndex].title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            <p className="mt-6 text-center text-lg text-white">
              {selectedImages[lightboxIndex].title}
            </p>

            <div className="absolute inset-y-0 left-0 flex items-center">
              <button
                type="button"
                onClick={goToPrev}
                aria-label="Previous image"
                className="px-6 text-4xl text-white"
              >
                ←
              </button>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                type="button"
                onClick={goToNext}
                aria-label="Next image"
                className="px-6 text-4xl text-white"
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
