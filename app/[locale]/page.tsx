import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

const galleriesQuery = groq`*[_type == "gallery"]{
  _id,
  title,
  category,
  description,
  coverImage,
  slug
}`;

export default async function Home() {
  const galleries = await client.fetch(galleriesQuery);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center h-screen bg-zinc-900 text-white text-center px-4">
        <h1 className="text-5xl md:text-7xl font-serif mb-6">Richard Foto</h1>
        <p className="text-xl text-zinc-400 max-w-md">
          Embereket fotózok – valódi pillanatokat, nem pózokat.
        </p>
        <a
          href="#galeria"
          className="mt-10 border border-white px-8 py-3 text-sm tracking-widest hover:bg-white hover:text-black transition-all"
        >
          GALÉRIA
        </a>
      </section>

      {/* Galéria */}
      <section id="galeria" className="max-w-6xl mx-auto py-24 px-4">
        <h2 className="text-3xl font-serif text-center mb-16">Galéria</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery: any) => (
            <div key={gallery._id} className="group overflow-hidden">
              {gallery.coverImage && (
                <img
                  src={urlFor(gallery.coverImage).width(600).height(400).url()}
                  alt={gallery.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="pt-4">
                <p className="text-xs text-zinc-400 tracking-widest uppercase">
                  {gallery.category}
                </p>
                <h3 className="text-lg font-serif mt-1">{gallery.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
