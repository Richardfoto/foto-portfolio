import Link from "next/link";
import { site } from "@/lib/site";

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const isHu = locale === "hu";

  return (
    <footer className="bg-white border-t border-neutral-100 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Felső sor – logo + nav */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
          <div>
            <p className="text-2xl font-serif tracking-tight">Richard Foto</p>
            <p className="text-sm text-neutral-400 mt-1">
              {isHu
                ? "Budapesti fotós • Azóta: 2015"
                : "Budapest photographer • Since 2015"}
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-neutral-500">
            <Link
              href={`/${locale}/services`}
              className="hover:text-neutral-900 transition-colors"
            >
              {isHu ? "Szolgáltatások" : "Services"}
            </Link>
            <Link
              href={`/${locale}/gallery`}
              className="hover:text-neutral-900 transition-colors"
            >
              {isHu ? "Galéria" : "Gallery"}
            </Link>
            <Link
              href={`/${locale}/booking`}
              className="hover:text-neutral-900 transition-colors"
            >
              {isHu ? "Foglalás & Árak" : "Book & Pricing"}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="hover:text-neutral-900 transition-colors"
            >
              {isHu ? "Rólam" : "About"}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="hover:text-neutral-900 transition-colors"
            >
              {isHu ? "Kapcsolat" : "Contact"}
            </Link>
          </nav>
        </div>

        <div className="mb-8 flex flex-col gap-3 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href={`mailto:${site.email}`} className="hover:text-neutral-900">
              {site.email}
            </a>
            <a href={site.phoneHref} className="hover:text-neutral-900">
              {site.phone}
            </a>
          </div>
          <div className="flex gap-3">
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-9 w-9 items-center justify-center border border-neutral-200 text-xs font-medium hover:border-neutral-900 hover:text-neutral-900"
            >
              IG
            </a>
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="inline-flex h-9 w-9 items-center justify-center border border-neutral-200 text-xs font-medium hover:border-neutral-900 hover:text-neutral-900"
            >
              FB
            </a>
          </div>
        </div>

        <hr className="border-neutral-100 mb-8" />

        {/* Alsó sor – jogi linkek + copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-neutral-400">
          <p>
            © {new Date().getFullYear()} Richard Foto.{" "}
            {isHu ? "Minden jog fenntartva." : "All rights reserved."}
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href={`/${locale}/adatvedelmi-nyilatkozat`}
              className="hover:text-neutral-700 transition-colors"
            >
              {isHu ? "Adatvédelmi Nyilatkozat" : "Privacy Policy"}
            </Link>
            <Link
              href={`/${locale}/aszf`}
              className="hover:text-neutral-700 transition-colors"
            >
              {isHu ? "Általános Szerződési Feltételek" : "Terms & Conditions"}
            </Link>
            <Link
              href={`/${locale}/cookie-politika`}
              className="hover:text-neutral-700 transition-colors"
            >
              {isHu ? "Cookie Politika" : "Cookie Policy"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
