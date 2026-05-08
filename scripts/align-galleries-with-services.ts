import { getCliClient } from "sanity/cli";

const apiVersion = "2025-01-01";
const dryRun = process.argv.includes("--dry-run");

const client = getCliClient({ apiVersion });

const serviceByGallerySlug: Record<string, string> = {
  eloadas: "event-corporate",
  "content-creator-day": "business-portrait",
  werkfotozas: "business-portrait",
  "dating-boost": "boudoir-branding",
  "personal-brand-starter": "business-portrait",
  "portre-galeria": "family-lifestyle",
};

const serviceByLegacyCategory: Record<string, string> = {
  eskuvo: "wedding",
  portret: "boudoir-branding",
  csaladi: "family-lifestyle",
  uzleti: "business-portrait",
};

type GalleryDocument = {
  _id: string;
  title?: string;
  category?: string;
  slug?: { current?: string };
};

type ServiceDocument = {
  _id: string;
  serviceId: string;
  order: number;
};

async function main() {
  const [galleries, services] = await Promise.all([
    client.fetch<GalleryDocument[]>(
      `*[_type == "gallery"]{_id, title, category, slug{current}}`,
    ),
    client.fetch<ServiceDocument[]>(
      `*[_type == "service"]{_id, serviceId, order}`,
    ),
  ]);

  const servicesById = new Map(services.map((service) => [service.serviceId, service]));
  const patches = galleries.flatMap((gallery) => {
    const slug = gallery.slug?.current ?? "";
    const serviceId =
      serviceByGallerySlug[slug] ??
      serviceByLegacyCategory[gallery.category ?? ""] ??
      "family-lifestyle";
    const service = servicesById.get(serviceId);

    if (!service) {
      throw new Error(`Missing service document for ${serviceId}`);
    }

    return {
      galleryId: gallery._id,
      title: gallery.title,
      serviceId,
      serviceRef: service._id,
      serviceOrder: service.order,
    };
  });

  if (dryRun) {
    console.log(JSON.stringify(patches, null, 2));
    return;
  }

  const transaction = patches.reduce(
    (trx, patch) =>
      trx.patch(patch.galleryId, (builder) =>
        builder.set({
          service: {
            _type: "reference",
            _ref: patch.serviceRef,
          },
          serviceId: patch.serviceId,
          serviceOrder: patch.serviceOrder,
        }),
      ),
    client.transaction(),
  );

  await transaction.commit();
  console.log(`Aligned ${patches.length} gallery documents with services.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
