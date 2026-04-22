import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

const aboutQuery = groq`*[_type == "about"][0]{
  email,
  phone,
  instagram,
  facebook
}`;

export default async function ContactPage() {
  const about = await client.fetch(aboutQuery);

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-zinc-900 text-white text-center py-32 px-4">
        <h1 className="text-5xl font-serif mb-4">Kapcsolat</h1>
        <p className="text-zinc-400 max-w-md mx-auto">
          Vedd fel velem a kapcsolatot
        </p>
      </section>
      <section className="max-w-2xl mx-auto py-24 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-xl font-serif mb-8">Elérhetőségek</h2>
            <div className="space-y-4 text-zinc-600">
              {about.email && (
                <a
                  href={`mailto:${about.email}`}
                  className="flex items-center gap-3 hover:text-zinc-900 transition-colors"
                >
                  <span>✉</span>
                  <span>{about.email}</span>
                </a>
              )}
              {about.phone && (
                <a
                  href={`tel:${about.phone}`}
                  className="flex items-center gap-3 hover:text-zinc-900 transition-colors"
                >
                  <span>✆</span>
                  <span>{about.phone}</span>
                </a>
              )}
              {about.instagram && (
                <a
                  href={about.instagram}
                  target="_blank"
                  className="flex items-center gap-3 hover:text-zinc-900 transition-colors"
                >
                  <span>◈</span>
                  <span>Instagram</span>
                </a>
              )}
              {about.facebook && (
                <a
                  href={about.facebook}
                  target="_blank"
                  className="flex items-center gap-3 hover:text-zinc-900 transition-colors"
                >
                  <span>◈</span>
                  <span>Facebook</span>
                </a>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-serif mb-8">Írj nekem</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Neved"
                className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors"
              />
              <input
                type="email"
                placeholder="Email címed"
                className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors"
              />
              <textarea
                placeholder="Üzeneted"
                rows={5}
                className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition-colors resize-none"
              />
              <button className="w-full bg-zinc-900 text-white py-3 text-sm tracking-widest hover:bg-zinc-700 transition-colors">
                KÜLDÉS
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
