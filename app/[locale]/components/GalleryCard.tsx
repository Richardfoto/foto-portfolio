// app/components/GalleryCard.tsx
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";
import Image from "next/image";
import Link from "next/link";

export type GalleryCardProps = {
  _id: string;
  title: string;
  category: string;
  coverImage?: SanityImageSource;
  slugCurrent: string;
  locale: string;
};

export default function GalleryCard({
  title,
  category,
  coverImage,
  slugCurrent,
  locale,
}: GalleryCardProps) {
  return (
    <Link
      href={`/${locale}/gallery/${slugCurrent}`}
      className="group block overflow-hidden"
    >
      {/* Aspect ratio + entropy crop – tökéletes emberek/portré fotókhoz */}
      <div className="relative aspect-[4/5] md:aspect-[5/6] bg-zinc-100 overflow-hidden">
        {coverImage && (
          <Image
            src={urlFor(coverImage)
              .width(900)
              .height(1200)
              .fit("crop")
              .crop("entropy") // ← Arcok középre kerülnek
              .format("webp")
              .quality(85)
              .url()}
            alt={
              locale === "hu"
                ? `${title} - ${category} fotózás Budapest`
                : `${title} - ${category} photography Budapest`
            }
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={false}
          />
        )}
      </div>

      {/* Információ */}
      <div className="pt-5 pb-1">
        <p className="text-xs text-zinc-500 tracking-[0.125em] uppercase font-medium">
          {category}
        </p>
        <h3 className="text-[21px] font-serif leading-tight mt-1.5 tracking-tight">
          {title}
        </h3>
      </div>
    </Link>
  );
}
