import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

const aboutQuery = groq`*[_type == "about"][0]{
  name,
  bio,
  experience,
  email,
  phone,
  instagram,
  facebook,
  profileImage
}`;

export default async function AboutPage() {
  const about = await client.fetch(aboutQuery);

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-zinc-900 text-white text-center py-32 px-4">
        <h1 className="text-5xl font-serif mb-4">Rolam</h1>
      </section>
      <section className="max-w-4xl mx-auto py-24 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
          {about.profileImage && (
            <img
              src={urlFor(about.profileImage).width(600).height(800).url()}
              alt={about.name}
              className="w-full object-cover"
            />
          )}
          <div>
            <h2 className="text-3xl font-serif mb-6">{about.name}</h2>
            {about.experience && (
              <p className="text-zinc-400 text-sm tracking-widest mb-6">
                {about.experience} EV TAPASZTALAT
              </p>
            )}
            <p className="text-zinc-600 leading-relaxed mb-8">{about.bio}</p>
            <div className="space-y-2 text-sm text-zinc-600">
              {about.email && <p>✉ {about.email}</p>}
              {about.phone && <p>✆ {about.phone}</p>}
              {about.instagram && (
                <a href={about.instagram} className="block hover:text-zinc-900">
                  Instagram
                </a>
              )}
              {about.facebook && (
                <a href={about.facebook} className="block hover:text-zinc-900">
                  Facebook
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
