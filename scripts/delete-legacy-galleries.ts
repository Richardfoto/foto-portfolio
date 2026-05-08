import { getCliClient } from "sanity/cli";

const apiVersion = "2025-01-01";
const dryRun = process.argv.includes("--dry-run");

const client = getCliClient({ apiVersion });

async function main() {
  const legacyGalleries = await client.fetch<Array<{ _id: string; title?: string }>>(
    `*[_type == "gallery" && !(_id match "gallery.*")]{_id, title}`,
  );

  if (dryRun) {
    console.log(JSON.stringify(legacyGalleries, null, 2));
    return;
  }

  if (!legacyGalleries.length) {
    console.log("No legacy gallery documents to delete.");
    return;
  }

  const transaction = legacyGalleries.reduce(
    (trx, gallery) => trx.delete(gallery._id),
    client.transaction(),
  );

  await transaction.commit();
  console.log(`Deleted ${legacyGalleries.length} legacy gallery documents.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
