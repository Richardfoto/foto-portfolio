import { getCliClient } from "sanity/cli";

const apiVersion = "2025-01-01";
const dryRun = process.argv.includes("--dry-run");

const client = getCliClient({ apiVersion });

type AboutDocument = Record<string, unknown> & {
  _id: string;
  _type: "about";
  _createdAt?: string;
  _updatedAt?: string;
  _rev?: string;
};

async function main() {
  const stable = await client.fetch<AboutDocument | null>(
    `*[_id == "about"][0]`,
  );
  const source =
    stable ??
    (await client.fetch<AboutDocument | null>(
      `*[_type == "about" && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]`,
    ));

  if (!source) {
    throw new Error("No about document found to sync.");
  }

  const content = { ...source };
  delete content._createdAt;
  delete content._updatedAt;
  delete content._rev;
  const document = {
    ...content,
    _id: "about",
    _type: "about",
    aboutImage: content.aboutImage ?? content.profileImage,
  };

  if (dryRun) {
    console.log(JSON.stringify(document, null, 2));
    return;
  }

  await client.createOrReplace(document);
  console.log("Synced about document to stable _id: about.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
