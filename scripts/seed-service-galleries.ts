import { getCliClient } from "sanity/cli";

const apiVersion = "2025-01-01";
const dryRun = process.argv.includes("--dry-run");

const client = getCliClient({ apiVersion });

const transparentPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
  "base64",
);

type ServiceDocument = {
  _id: string;
  serviceId: string;
  order: number;
  anchor: string;
  titleHu: string;
  titleEn: string;
  descriptionHu?: string;
};

async function getPlaceholderAsset() {
  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "sanity.imageAsset" && originalFilename == "service-placeholder.png"][0]{_id}`,
  );

  if (existing) return existing;

  return client.assets.upload("image", transparentPng, {
    filename: "service-placeholder.png",
    contentType: "image/png",
  });
}

async function main() {
  const services = await client.fetch<ServiceDocument[]>(
    `*[_type == "service"] | order(order asc){
      _id,
      serviceId,
      order,
      anchor,
      titleHu,
      titleEn,
      descriptionHu
    }`,
  );
  const asset = dryRun ? null : await getPlaceholderAsset();

  const galleries = services.map((service) => ({
    _id: `gallery-${service.serviceId}`,
    _type: "gallery",
    title: service.titleHu,
    slug: {
      _type: "slug",
      current: service.anchor,
    },
    service: {
      _type: "reference",
      _ref: service._id,
    },
    serviceId: service.serviceId,
    serviceOrder: service.order,
    category: service.serviceId,
    featured: ["business-portrait", "family-lifestyle", "wedding"].includes(
      service.serviceId,
    ),
    coverImage: asset
      ? {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: asset._id,
          },
        }
      : undefined,
    images: asset
      ? [
          {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: asset._id,
            },
          },
        ]
      : [],
    description: service.descriptionHu,
  }));

  if (dryRun) {
    console.log(JSON.stringify(galleries, null, 2));
    return;
  }

  const transaction = galleries.reduce(
    (trx, gallery) => trx.createOrReplace(gallery),
    client.transaction(),
  );

  await transaction.commit();
  console.log(`Seeded ${galleries.length} service-based gallery documents.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
