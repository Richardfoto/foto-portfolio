// app/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar(): import("react").JSX.Element {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.startsWith("/en") ? "en" : "hu";

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  function switchLocale() {
    const newLocale = locale === "hu" ? "en" : "hu";
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-b border-zinc-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
        {/* Logo with subtle lift */}
        <Link
          href={`/${locale}`}
          className="text-3xl font-serif tracking-[-0.04em] text-zinc-900 hover:-translate-y-0.5 transition-all duration-300 drop-shadow-[0_0_12px_rgb(0,0,0,0.12)]"
        >
          Richard Foto
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 text-sm tracking-[0.125em] font-medium">
          <Link
            href={`/${locale}/gallery`}
            className={`relative transition-colors duration-300 hover:text-zinc-400 ${
              isActive(`/${locale}/gallery`) ? "text-zinc-900" : ""
            }`}
          >
            {t("gallery")}
            <span
              className={`absolute -bottom-0.5 left-0 h-0.5 bg-zinc-900 transition-all duration-300 ${
                isActive(`/${locale}/gallery`)
                  ? "w-full"
                  : "w-0 group-hover:w-full"
              }`}
            />
          </Link>

          <Link
            href={`/${locale}/services`}
            className={`relative transition-colors duration-300 hover:text-zinc-400 ${
              isActive(`/${locale}/services`) ? "text-zinc-900" : ""
            }`}
          >
            {t("services")}
            <span
              className={`absolute -bottom-0.5 left-0 h-0.5 bg-zinc-900 transition-all duration-300 ${
                isActive(`/${locale}/services`)
                  ? "w-full"
                  : "w-0 group-hover:w-full"
              }`}
            />
          </Link>

          <Link
            href={`/${locale}/about`}
            className={`relative transition-colors duration-300 hover:text-zinc-400 ${
              isActive(`/${locale}/about`) ? "text-zinc-900" : ""
            }`}
          >
            {t("about")}
            <span
              className={`absolute -bottom-0.5 left-0 h-0.5 bg-zinc-900 transition-all duration-300 ${
                isActive(`/${locale}/about`)
                  ? "w-full"
                  : "w-0 group-hover:w-full"
              }`}
            />
          </Link>

          <Link
            href={`/${locale}/booking`}
            className={`relative transition-colors duration-300 hover:text-zinc-400 ${
              isActive(`/${locale}/booking`) ? "text-zinc-900" : ""
            }`}
          >
            {t("booking")}
            <span
              className={`absolute -bottom-0.5 left-0 h-0.5 bg-zinc-900 transition-all duration-300 ${
                isActive(`/${locale}/booking`)
                  ? "w-full"
                  : "w-0 group-hover:w-full"
              }`}
            />
          </Link>

          {/* Language switch */}
          <button
            onClick={switchLocale}
            className="px-4 py-2 text-xs font-medium border border-zinc-200 hover:border-zinc-400 rounded-3xl transition-all hover:scale-105 active:scale-95"
          >
            {locale === "hu" ? "EN" : "HU"}
          </button>

          {/* Contact CTA with subtle glow pulse */}
          <Link
            href={`/${locale}/contact`}
            className="relative bg-zinc-900 text-white px-8 py-3.5 text-sm tracking-widest hover:bg-black hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-zinc-900/30 hover:shadow-xl hover:shadow-zinc-900/40 animate-pulse-slow"
          >
            {t("contact")}
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          aria-label={open ? "Menü bezárása" : "Menü megnyitása"}
          className="md:hidden flex flex-col gap-1.5 p-3"
          onClick={() => setOpen(!open)}
        >
          <span
            className={`block w-7 h-0.5 bg-zinc-900 transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-7 h-0.5 bg-zinc-900 transition-all duration-300 ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-7 h-0.5 bg-zinc-900 transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-zinc-100 px-8 py-10 flex flex-col gap-8 text-lg font-medium">
          <Link
            href={`/${locale}/gallery`}
            onClick={() => setOpen(false)}
            className="py-2"
          >
            {t("gallery")}
          </Link>
          <Link
            href={`/${locale}/services`}
            onClick={() => setOpen(false)}
            className="py-2"
          >
            {t("services")}
          </Link>
          <Link
            href={`/${locale}/about`}
            onClick={() => setOpen(false)}
            className="py-2"
          >
            {t("about")}
          </Link>
          <Link
            href={`/${locale}/booking`}
            onClick={() => setOpen(false)}
            className="py-2"
          >
            {t("booking")}
          </Link>

          <button
            onClick={() => {
              switchLocale();
              setOpen(false);
            }}
            className="text-left py-2 text-zinc-600"
          >
            {locale === "hu" ? "English version" : "Magyar verzió"}
          </button>

          <Link
            href={`/${locale}/contact`}
            onClick={() => setOpen(false)}
            className="mt-6 bg-zinc-900 text-white py-5 text-center tracking-widest text-base"
          >
            {t("contact")}
          </Link>
        </div>
      )}
    </nav>
  );
}
