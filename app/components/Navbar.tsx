"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-zinc-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-serif tracking-wider">
          Richard Foto
        </Link>

        {/* Desktop menü */}
        <div className="hidden md:flex items-center gap-8 text-sm tracking-widest">
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

        {/* Mobil hamburger gomb */}
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
          <Link href="/gallery" onClick={() => setOpen(false)}>
            GALÉRIA
          </Link>
          <Link href="/services" onClick={() => setOpen(false)}>
            SZOLGÁLTATÁSOK
          </Link>
          <Link href="/about" onClick={() => setOpen(false)}>
            RÓLAM
          </Link>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="bg-zinc-900 text-white px-6 py-3 text-center"
          >
            KAPCSOLAT
          </Link>
        </div>
      )}
    </nav>
  );
}
