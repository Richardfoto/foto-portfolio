import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className="bg-zinc-900 text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="text-2xl font-serif mb-4">Richard Foto</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Embereket fotózok – valódi pillanatokat, nem pózokat.
          </p>
        </div>
        <div>
          <h4 className="text-xs tracking-widest mb-6 text-zinc-400">
            {t("pages")}
          </h4>
          <div className="flex flex-col gap-3 text-sm text-zinc-300">
            <Link
              href={`/${locale}/gallery`}
              className="hover:text-white transition-colors"
            >
              Gallery
            </Link>
            <Link
              href={`/${locale}/services`}
              className="hover:text-white transition-colors"
            >
              Services
            </Link>
            <Link
              href={`/${locale}/about`}
              className="hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="hover:text-white transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
        <div>
          <h4 className="text-xs tracking-widest mb-6 text-zinc-400">
            {t("contact")}
          </h4>
          <div className="flex flex-col gap-3 text-sm text-zinc-300">
            <a
              href="mailto:richard@example.com"
              className="hover:text-white transition-colors"
            >
              richard@example.com
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-zinc-800 px-4 py-6 text-center text-xs text-zinc-500">
        © {new Date().getFullYear()} Richard Foto. {t("rights")}
      </div>
    </footer>
  );
}
