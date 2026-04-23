"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.startsWith("/en") ? "en" : "hu";

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
          <Link
            href={`/${locale}/booking`}
            className="hover:text-zinc-400 transition-colors"
          >
            {t("booking")}
          </Link>
          <button
            onClick={switchLocale}
            aria-label={
              locale === "hu" ? "Switch to English" : "Váltás magyarra"
            }
            className="text-zinc-600 hover:text-zinc-900 transition-colors"
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

        <button
          aria-label={open ? "Menü bezárása" : "Menü megnyitása"}
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

      {open && (
        <div className="md:hidden px-4 pb-6 flex flex-col gap-4 text-sm tracking-widest bg-white border-t border-zinc-100">
          <Link
            href={`/${locale}/gallery`}
            className="pt-4"
            onClick={() => setOpen(false)}
          >
            {t("gallery")}
          </Link>
          <Link href={`/${locale}/services`} onClick={() => setOpen(false)}>
            {t("services")}
          </Link>
          <Link href={`/${locale}/about`} onClick={() => setOpen(false)}>
            {t("about")}
          </Link>
          <Link href={`/${locale}/booking`} onClick={() => setOpen(false)}>
            {t("booking")}
          </Link>
          <button
            onClick={switchLocale}
            aria-label={
              locale === "hu" ? "Switch to English" : "Váltás magyarra"
            }
            className="text-left text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            {locale === "hu" ? "EN" : "HU"}
          </button>
          <Link
            href={`/${locale}/contact`}
            className="bg-zinc-900 text-white px-6 py-3 text-center hover:bg-zinc-700 transition-colors"
            onClick={() => setOpen(false)}
          >
            {t("contact")}
          </Link>
        </div>
      )}
    </nav>
  );
}
