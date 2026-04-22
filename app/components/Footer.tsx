import Link from "next/link";

export default function Footer() {
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
            OLDALAK
          </h4>
          <div className="flex flex-col gap-3 text-sm text-zinc-300">
            <Link
              href="/gallery"
              className="hover:text-white transition-colors"
            >
              Galéria
            </Link>
            <Link
              href="/services"
              className="hover:text-white transition-colors"
            >
              Szolgáltatások
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              Rólam
            </Link>
            <Link
              href="/contact"
              className="hover:text-white transition-colors"
            >
              Kapcsolat
            </Link>
          </div>
        </div>
        <div>
          <h4 className="text-xs tracking-widest mb-6 text-zinc-400">
            KAPCSOLAT
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
        © {new Date().getFullYear()} Richard Foto. Minden jog fenntartva.
      </div>
    </footer>
  );
}
