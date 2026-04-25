"use client";

import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";

interface FeaturedItem {
  _id: string;
  title: string;
  coverImage: SanityImageSource;
}

export default function FeaturedRotator({
  featured,
}: {
  featured: FeaturedItem[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const current = featured[currentIndex];

  const imageUrl = current?.coverImage
    ? urlFor(current.coverImage).width(1600).height(1200).url()
    : null;

  return (
    <div className="relative max-w-5xl mx-auto">
      {/* Nagy kép */}
      <div className="relative w-full aspect-16/10 md:aspect-21/13 overflow-hidden rounded-3xl bg-zinc-100 flex items-center justify-center border border-zinc-100">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={current.title}
            fill
            className="object-contain"
            priority
          />
        )}

        {/* Cím overlay */}
        <div className="absolute bottom-8 left-8 bg-black/70 backdrop-blur-md text-white px-8 py-4 rounded-2xl">
          <p className="text-xl font-light">{current?.title}</p>
        </div>

        {/* Bal nyíl */}
        <button
          onClick={() =>
            setCurrentIndex(
              (prev) => (prev - 1 + featured.length) % featured.length,
            )
          }
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black p-5 rounded-full text-3xl shadow-xl transition-all"
        >
          ←
        </button>

        {/* Jobb nyíl */}
        <button
          onClick={() =>
            setCurrentIndex((prev) => (prev + 1) % featured.length)
          }
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-black p-5 rounded-full text-3xl shadow-xl transition-all"
        >
          →
        </button>
      </div>
    </div>
  );
}
