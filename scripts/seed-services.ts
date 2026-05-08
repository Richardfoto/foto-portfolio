import { getCliClient } from "sanity/cli";

import { photographyServices } from "../lib/photography-content";

const apiVersion = "2025-01-01";
const dryRun = process.argv.includes("--dry-run");
const deleteLegacy = process.argv.includes("--delete-legacy");

const client = getCliClient({ apiVersion });

const transparentPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
  "base64",
);

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
  const asset = dryRun ? null : await getPlaceholderAsset();

  const documents = photographyServices.map((service, index) => ({
    _id: `service-${service.id}`,
    _type: "service",
    serviceId: service.id,
    order: index + 1,
    anchor: service.anchor,
    image: asset
      ? {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: asset._id,
          },
        }
      : undefined,
    titleHu: service.title.hu,
    titleEn: service.title.en,
    shortTitleHu: service.shortTitle.hu,
    shortTitleEn: service.shortTitle.en,
    descriptionHu: service.description.hu,
    descriptionEn: service.description.en,
    ctaHu: service.cta.hu,
    ctaEn: service.cta.en,
    captionsHu: service.captions.hu,
    captionsEn: service.captions.en,
    keywordsHu: service.keywords.hu,
    keywordsEn: service.keywords.en,
    featured: ["business-portrait", "family-lifestyle", "wedding"].includes(service.id),
  }));

  if (dryRun) {
    console.log(
      JSON.stringify(
        {
          deleteLegacy,
          documents,
        },
        null,
        2,
      ),
    );
    return;
  }

  let transaction = documents.reduce(
    (trx, document) => trx.createOrReplace(document),
    client.transaction(),
  );

  if (deleteLegacy) {
    const documentIds = documents.map((document) => document._id);
    const legacyDocuments = await client.fetch<Array<{ _id: string }>>(
      `*[_type == "service" && !(_id in $documentIds)]{_id}`,
      { documentIds },
    );

    transaction = legacyDocuments.reduce(
      (trx, document) => trx.delete(document._id),
      transaction,
    );
  }

  await transaction.commit();
  console.log(
    `Seeded ${documents.length} service documents${
      deleteLegacy ? " and deleted legacy service documents" : ""
    }.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
