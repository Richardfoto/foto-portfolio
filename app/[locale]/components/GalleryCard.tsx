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
    <Link href={`/${locale}/gallery/${slugCurrent}`}>
      <div className="group overflow-hidden cursor-pointer">
        {coverImage && (
          <div className="flex h-104 items-center justify-center overflow-hidden bg-zinc-100 p-4 md:h-112">
            <Image
              src={urlFor(coverImage).width(900).fit("max").url()}
              alt={title}
              width={900}
              height={1200}
              className="max-h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        )}
        <div className="pt-4">
          <p className="text-xs text-zinc-600 tracking-widest uppercase">
            {category}
          </p>
          <h3 className="text-lg font-serif mt-1">{title}</h3>
        </div>
      </div>
    </Link>
  );
}
