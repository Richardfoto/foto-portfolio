import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";
import Image from "next/image";
import Link from "next/link";

export type GalleryCardProps = {
  _id: string;
  index?: number;
  featured?: boolean;
  title: string;
  category?: string;
  categoryHu?: string;
  categoryEn?: string;
  coverImage?: SanityImageSource & {
    asset?: {
      _ref?: string;
    };
  };
  slugCurrent: string;
  locale: string;
  description?: string;
  feedbackQuote?: string;
  feedbackAuthor?: string;
  feedbackSource?: string;
  feedbackUrl?: string;
};

export default function GalleryCard({
  index = 0,
  featured = false,
  title,
  category,
  coverImage,
  slugCurrent,
  locale,
  description,
  feedbackQuote,
  feedbackAuthor,
  feedbackSource,
  feedbackUrl,
}: GalleryCardProps) {
  const imageUrl = coverImage?.asset?._ref
    ? urlFor(coverImage)
        .ignoreImageParams()
        .width(featured ? 1500 : 1000)
        .height(featured ? 1050 : 1300)
        .fit("max")
        .auto("format")
        .quality(88)
        .url()
    : null;

  const sourceLabel =
    feedbackSource === "google"
      ? "Google"
      : feedbackSource === "message"
        ? locale === "hu"
          ? "Üzenet"
          : "Message"
        : locale === "hu"
          ? "Visszajelzés"
          : "Feedback";

  return (
    <article
      className={`group overflow-hidden bg-white shadow-[0_22px_70px_rgba(20,20,20,0.1)] ${
        featured ? "md:col-span-2 lg:col-span-2" : ""
      }`}
    >
      <Link
        href={`/${locale}/gallery/${slugCurrent}`}
        className={`relative block overflow-hidden bg-neutral-950 text-white ${
          featured ? "aspect-[16/11]" : "aspect-[4/5]"
        }`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={
              locale === "hu"
                ? `${title} - ${category ?? "galéria"} fotózás Budapest`
                : `${title} - ${category ?? "gallery"} photography Budapest`
            }
            fill
            sizes={
              featured
                ? "(max-width: 1024px) 100vw, 66vw"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
            priority={featured}
            className="image-soft-motion object-contain p-2"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-white/40">
            Nincs borítókép
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-75" />
        <div className="absolute left-5 right-5 top-5 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-white/60">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{locale === "hu" ? "Galéria" : "Gallery"}</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
          {category && (
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/60">
              {category}
            </p>
          )}

          <h3
            className={`mt-2 max-w-xl font-serif leading-tight tracking-tight ${
              featured ? "text-3xl md:text-5xl" : "text-2xl"
            }`}
          >
            {title}
          </h3>
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-white/68 underline-offset-8 group-hover:underline">
            {locale === "hu" ? "Megnyitás" : "Open"}
          </p>
        </div>
      </Link>

      {(description || feedbackQuote) && (
        <div className="border border-t-0 border-neutral-200 bg-[#fbfaf7] p-5 md:p-7">
          {description && (
            <p className="text-sm leading-7 text-neutral-600">{description}</p>
          )}
          {feedbackQuote && (
            <blockquote className="mt-5 border-l border-neutral-950/25 pl-4">
              <p className="font-serif text-xl leading-8 text-neutral-900">
                “{feedbackQuote}”
              </p>
              <footer className="mt-4 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-neutral-500">
                {feedbackAuthor && <span>{feedbackAuthor}</span>}
                <span>{sourceLabel}</span>
                {feedbackUrl && (
                  <a
                    href={feedbackUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-4 transition-colors hover:text-neutral-950"
                  >
                    {locale === "hu" ? "Forrás" : "Source"}
                  </a>
                )}
              </footer>
            </blockquote>
          )}
        </div>
      )}
    </article>
  );
}
