"use client";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";

interface FeaturedItem {
  _id: string;
  title: string;
  category?: string;
  coverImage: SanityImageSource;
  slugCurrent: string;
}

export default function FeaturedRotator({
  featured,
  locale,
}: {
  featured: FeaturedItem[];
  locale: string;
}) {
  if (featured.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {featured.map((item) => {
        const imageUrl = item.coverImage
          ? urlFor(item.coverImage)
              .width(900)
              .height(1200)
              .fit("max") // ← Nincs vágás!
              .quality(85)
              .url()
          : null;

        return (
          <Link
            key={item._id}
            href={`/${locale}/gallery/${item.slugCurrent}`}
            className="group block overflow-hidden"
          >
            <div className="relative aspect-[4/5] md:aspect-[5/6] bg-zinc-100 overflow-hidden rounded-3xl flex items-center justify-center border border-zinc-200">
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={`${item.title} – ${item.category || ""}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain transition-transform duration-700 group-hover:scale-105 p-4"
                />
              )}

              {/* Hover overlay + info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                {item.category && (
                  <p className="text-xs uppercase tracking-[0.125em] text-white/80 mb-2">
                    {item.category}
                  </p>
                )}
                <h3 className="text-2xl md:text-3xl font-serif text-white leading-tight tracking-tight">
                  {item.title}
                </h3>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
