import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

const servicesQuery = groq`*[_type == "service"] | order(price asc) {
  _id,
  title,
  price,
  duration,
  description
}`;

export default async function ServicesPage() {
  const services = await client.fetch(servicesQuery);

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-zinc-900 text-white text-center py-32 px-4">
        <h1 className="text-5xl font-serif mb-4">Szolgáltatások</h1>
      </section>
      <section className="max-w-5xl mx-auto py-24 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service: any) => (
            <div key={service._id} className="border border-zinc-200 p-8">
              <h3 className="text-2xl font-serif mb-2">{service.title}</h3>
              <p className="text-3xl font-light mb-4">
                {service.price.toLocaleString("hu-HU")} Ft
              </p>
              <p className="text-zinc-600 mb-8">{service.description}</p>
              <a
                href="/booking"
                className="block text-center border border-zinc-900 px-6 py-3 text-sm hover:bg-zinc-900 hover:text-white transition-all"
              >
                Foglalás
              </a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
