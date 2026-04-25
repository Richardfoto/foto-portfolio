import Link from "next/link";
import { useLocale } from "next-intl";

export default function Footer() {
  const locale = useLocale();

  return (
    <footer className="bg-zinc-950 text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16">
          {/* Brand + Tagline */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-5xl font-serif tracking-[-0.04em]">
                Richard Foto
              </div>
            </div>
            <p className="text-zinc-400 max-w-sm leading-relaxed text-[15px]">
              Időtlen pillanatok • Budapest
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <div className="uppercase text-xs tracking-[0.2em] text-zinc-500 mb-6">
              Oldalak
            </div>
            <div className="space-y-3 text-[15px]">
              <Link
                href={`/${locale}/gallery`}
                className="block hover:text-white transition"
              >
                Galéria
              </Link>
              <Link
                href={`/${locale}/services`}
                className="block hover:text-white transition"
              >
                Szolgáltatások
              </Link>
              <Link
                href={`/${locale}/about`}
                className="block hover:text-white transition"
              >
                Rólam
              </Link>
              <Link
                href={`/${locale}/booking`}
                className="block hover:text-white transition"
              >
                Foglalás
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <div className="uppercase text-xs tracking-[0.2em] text-zinc-500 mb-6">
              Kapcsolat
            </div>

            <div className="space-y-4 text-[15px]">
              <a
                href="mailto:richardfoto@icloud.com"
                className="block hover:text-white transition"
              >
                richardfoto@icloud.com
              </a>
              <a
                href="tel:+36308840987"
                className="block hover:text-white transition"
              >
                +36 30 88 40 987
              </a>
            </div>

            <div className="flex gap-8 mt-9 text-sm">
              <a
                href="https://instagram.com"
                target="_blank"
                className="hover:text-white transition"
              >
                Instagram
              </a>
              <a
                href="https://wa.me/36308840987"
                target="_blank"
                className="hover:text-white transition"
              >
                WhatsApp
              </a>
              <a
                href="sms:+36308840987"
                className="hover:text-white transition"
              >
                iMessage
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 px-8 py-7 text-xs text-zinc-500 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          © {new Date().getFullYear()} Richard Foto — Minden jog fenntartva.
        </div>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-white transition">
            Adatvédelem
          </Link>
          <Link href="#" className="hover:text-white transition">
            ÁSZF
          </Link>
        </div>
      </div>
    </footer>
  );
}
