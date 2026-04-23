import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import Link from "next/link";

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

const galleryQuery = groq`*[_type == "gallery" && slug.current == $slug][0]{
  title,
  category,
  description,
  coverImage,
  images
}`;

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gallery = await client.fetch(galleryQuery, { slug });

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-zinc-900 text-white text-center py-32 px-4">
        <p className="text-xs tracking-widest text-zinc-400 mb-4 uppercase">
          {gallery.category}
        </p>
        <h1 className="text-5xl font-serif mb-4">{gallery.title}</h1>
        {gallery.description && (
          <p className="text-zinc-400 max-w-md mx-auto">
            {gallery.description}
          </p>
        )}
      </section>
      <section className="max-w-6xl mx-auto py-24 px-4">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {gallery.coverImage && (
            <img
              src={urlFor(gallery.coverImage).width(800).url()}
              alt={gallery.title}
              className="w-full break-inside-avoid"
            />
          )}
          {gallery.images &&
            gallery.images.map((image: any, index: number) => (
              <img
                key={index}
                src={urlFor(image).width(800).url()}
                alt={`${gallery.title} - ${index + 1}`}
                className="w-full break-inside-avoid"
              />
            ))}
        </div>
        <div className="text-center mt-16">
          <Link
            href="/gallery"
            className="border border-zinc-900 px-8 py-3 text-sm tracking-widest hover:bg-zinc-900 hover:text-white transition-all"
          >
            VISSZA
          </Link>
        </div>
      </section>
    </main>
  );
}
