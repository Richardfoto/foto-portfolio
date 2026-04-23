"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function switchLocale() {
    const newLocale = locale === "hu" ? "en" : "hu";
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={`/${locale}`} className="text-xl font-serif tracking-wider">
          Richard Foto
        </Link>

        {/* Desktop menü */}
        <div className="hidden md:flex items-center gap-8 text-sm tracking-widest">
          <Link
            href={`/${locale}/gallery`}
            className="hover:text-zinc-400 transition-colors"
          >
            {t("gallery")}
          </Link>
          <Link
            href={`/${locale}/services`}
            className="hover:text-zinc-400 transition-colors"
          >
            {t("services")}
          </Link>
          <Link
            href={`/${locale}/about`}
            className="hover:text-zinc-400 transition-colors"
          >
            {t("about")}
          </Link>
          <button
            onClick={switchLocale}
            className="text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            {locale === "hu" ? "EN" : "HU"}
          </button>
          <Link
            href={`/${locale}/contact`}
            className="bg-zinc-900 text-white px-6 py-2 hover:bg-zinc-700 transition-colors"
          >
            {t("contact")}
          </Link>
        </div>

        {/* Mobil hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
        >
          <span
            className={`block w-6 h-0.5 bg-zinc-900 transition-all ${open ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-zinc-900 transition-all ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-zinc-900 transition-all ${open ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobil menü */}
      {open && (
        <div className="md:hidden bg-white border-t border-zinc-100 px-4 py-6 flex flex-col gap-6 text-sm tracking-widest">
          <Link href={`/${locale}/gallery`} onClick={() => setOpen(false)}>
            {t("gallery")}
          </Link>
          <Link href={`/${locale}/services`} onClick={() => setOpen(false)}>
            {t("services")}
          </Link>
          <Link href={`/${locale}/about`} onClick={() => setOpen(false)}>
            {t("about")}
          </Link>
          <button onClick={switchLocale} className="text-left text-zinc-400">
            {locale === "hu" ? "English" : "Magyar"}
          </button>
          <Link
            href={`/${locale}/contact`}
            onClick={() => setOpen(false)}
            className="bg-zinc-900 text-white px-6 py-3 text-center"
          >
            {t("contact")}
          </Link>
        </div>
      )}
    </nav>
  );
}
