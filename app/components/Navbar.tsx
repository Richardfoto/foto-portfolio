import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-serif tracking-wider">
          Richard Foto
        </Link>
        <div className="flex items-center gap-8 text-sm tracking-widest">
          <Link
            href="/gallery"
            className="hover:text-zinc-400 transition-colors"
          >
            GALÉRIA
          </Link>
          <Link
            href="/services"
            className="hover:text-zinc-400 transition-colors"
          >
            SZOLGÁLTATÁSOK
          </Link>
          <Link href="/about" className="hover:text-zinc-400 transition-colors">
            RÓLAM
          </Link>
          <Link
            href="/contact"
            className="bg-zinc-900 text-white px-6 py-2 hover:bg-zinc-700 transition-colors"
          >
            KAPCSOLAT
          </Link>
        </div>
      </div>
    </nav>
  );
}
