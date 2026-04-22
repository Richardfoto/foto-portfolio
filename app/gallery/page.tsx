import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import Link from "next/link";

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

const galleriesQuery = groq`*[_type == "gallery"] | order(_createdAt desc) {
  _id,
  title,
  category,
  description,
  coverImage,
  slug
}`;

export default async function GalleryPage() {
  const galleries = await client.fetch(galleriesQuery);

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-zinc-900 text-white text-center py-32 px-4">
        <h1 className="text-5xl font-serif mb-4">Galéria</h1>
        <p className="text-zinc-400 max-w-md mx-auto">Válassz egy kategóriát</p>
      </section>
      <section className="max-w-6xl mx-auto py-24 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleries.map((gallery: any) => (
            <Link key={gallery._id} href={`/gallery/${gallery.slug.current}`}>
              <div className="group overflow-hidden cursor-pointer">
                {gallery.coverImage && (
                  <div className="overflow-hidden">
                    <img
                      src={urlFor(gallery.coverImage)
                        .width(600)
                        .height(400)
                        .url()}
                      alt={gallery.title}
                      className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}
                <div className="pt-4">
                  <p className="text-xs text-zinc-400 tracking-widest uppercase">
                    {gallery.category}
                  </p>
                  <h3 className="text-xl font-serif mt-1 group-hover:text-zinc-500 transition-colors">
                    {gallery.title}
                  </h3>
                  {gallery.description && (
                    <p className="text-sm text-zinc-500 mt-2 line-clamp-2">
                      {gallery.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
