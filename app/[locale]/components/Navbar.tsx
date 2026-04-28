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
    <nav
      aria-label={locale === "hu" ? "Fő navigáció" : "Main navigation"}
      className="fixed inset-x-0 top-0 z-50 border-b border-neutral-950/10 bg-[#fbfaf7]/95 shadow-[0_1px_0_rgba(20,20,20,0.04)] backdrop-blur-xl"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Logo with subtle lift */}
        <Link
          href={`/${locale}`}
          className="font-serif text-2xl tracking-tight text-neutral-950 transition-transform duration-300 hover:-translate-y-0.5 sm:text-3xl"
        >
          Richard Foto
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-700 md:flex">
          <Link
            href={`/${locale}/gallery`}
            className={`group relative transition-colors duration-300 hover:text-neutral-950 ${
              isActive(`/${locale}/gallery`) ? "text-neutral-950" : ""
            }`}
          >
            {t("gallery")}
            <span
              className={`absolute -bottom-1.5 left-0 h-px bg-neutral-950 transition-all duration-300 ${
                isActive(`/${locale}/gallery`)
                  ? "w-full"
                  : "w-0 group-hover:w-full"
              }`}
            />
          </Link>

          <Link
            href={`/${locale}/services`}
            className={`group relative transition-colors duration-300 hover:text-neutral-950 ${
              isActive(`/${locale}/services`) ? "text-neutral-950" : ""
            }`}
          >
            {t("services")}
            <span
              className={`absolute -bottom-1.5 left-0 h-px bg-neutral-950 transition-all duration-300 ${
                isActive(`/${locale}/services`)
                  ? "w-full"
                  : "w-0 group-hover:w-full"
              }`}
            />
          </Link>

          <Link
            href={`/${locale}/about`}
            className={`group relative transition-colors duration-300 hover:text-neutral-950 ${
              isActive(`/${locale}/about`) ? "text-neutral-950" : ""
            }`}
          >
            {t("about")}
            <span
              className={`absolute -bottom-1.5 left-0 h-px bg-neutral-950 transition-all duration-300 ${
                isActive(`/${locale}/about`)
                  ? "w-full"
                  : "w-0 group-hover:w-full"
              }`}
            />
          </Link>

          <Link
            href={`/${locale}/booking`}
            className={`group relative transition-colors duration-300 hover:text-neutral-950 ${
              isActive(`/${locale}/booking`) ? "text-neutral-950" : ""
            }`}
          >
            {t("booking")}
            <span
              className={`absolute -bottom-1.5 left-0 h-px bg-neutral-950 transition-all duration-300 ${
                isActive(`/${locale}/booking`)
                  ? "w-full"
                  : "w-0 group-hover:w-full"
              }`}
            />
          </Link>

          {/* Language switch */}
          <button
            onClick={switchLocale}
            aria-label={
              locale === "hu"
                ? "Váltás angol nyelvre"
                : "Switch to Hungarian language"
            }
            className="border border-neutral-950/20 px-4 py-2 text-xs font-semibold text-neutral-800 transition-all hover:border-neutral-950 hover:bg-neutral-950 hover:text-white active:scale-95"
          >
            {locale === "hu" ? "EN" : "HU"}
          </button>

          {/* Contact CTA with subtle glow pulse */}
          <Link
            href={`/${locale}/contact`}
            className="bg-neutral-950 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_12px_30px_rgba(10,10,10,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-black active:scale-95"
          >
            {t("contact")}
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          aria-label={open ? "Menü bezárása" : "Menü megnyitása"}
          aria-expanded={open}
          className="flex flex-col gap-1.5 border border-neutral-950/15 p-3 md:hidden"
          onClick={() => setOpen(!open)}
        >
          <span
            className={`block h-0.5 w-6 bg-neutral-950 transition-all duration-300 ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-neutral-950 transition-all duration-300 ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-neutral-950 transition-all duration-300 ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="flex flex-col gap-7 border-t border-neutral-950/10 bg-[#fbfaf7] px-6 py-10 text-lg font-medium shadow-[0_24px_80px_rgba(10,10,10,0.12)] md:hidden">
          <Link
            href={`/${locale}/gallery`}
            onClick={() => setOpen(false)}
            className="border-b border-neutral-950/10 pb-4"
          >
            {t("gallery")}
          </Link>
          <Link
            href={`/${locale}/services`}
            onClick={() => setOpen(false)}
            className="border-b border-neutral-950/10 pb-4"
          >
            {t("services")}
          </Link>
          <Link
            href={`/${locale}/about`}
            onClick={() => setOpen(false)}
            className="border-b border-neutral-950/10 pb-4"
          >
            {t("about")}
          </Link>
          <Link
            href={`/${locale}/booking`}
            onClick={() => setOpen(false)}
            className="border-b border-neutral-950/10 pb-4"
          >
            {t("booking")}
          </Link>

          <button
            onClick={() => {
              switchLocale();
              setOpen(false);
            }}
            className="text-left text-sm uppercase tracking-[0.18em] text-neutral-500"
          >
            {locale === "hu" ? "English version" : "Magyar verzió"}
          </button>

          <Link
            href={`/${locale}/contact`}
            onClick={() => setOpen(false)}
            className="mt-3 bg-neutral-950 py-5 text-center text-sm uppercase tracking-[0.2em] text-white"
          >
            {t("contact")}
          </Link>
        </div>
      )}
    </nav>
  );
}
