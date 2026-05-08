import { getCliClient } from "sanity/cli";

const apiVersion = "2025-01-01";
const dryRun = process.argv.includes("--dry-run");

const client = getCliClient({ apiVersion });

type ImageField = {
  _type: "image";
  asset?: {
    _type: "reference";
    _ref: string;
  };
  hotspot?: unknown;
  crop?: unknown;
};

type HeroDocument = {
  _id: string;
  title?: string;
  subtitle?: string;
  image?: ImageField;
  images?: ImageField[];
};

type AboutDocument = {
  heroImage?: ImageField;
};

async function main() {
  const [hero, about] = await Promise.all([
    client.fetch<HeroDocument | null>(
      `*[_type == "hero"][0]{_id, image, images}`,
    ),
    client.fetch<AboutDocument | null>(
      `*[_type == "about" && !(_id in path("drafts.**"))][0]{heroImage}`,
    ),
  ]);

  const sourceImage = hero?.image ?? hero?.images?.[0] ?? about?.heroImage;

  if (!sourceImage?.asset?._ref) {
    throw new Error("No hero image source found in hero.image, hero.images, or about.heroImage.");
  }

  const documentId = "hero";
  const patch = {
    _id: documentId,
    _type: "hero",
    image: sourceImage,
    title: hero?.title ?? "Főoldal hero",
    subtitle: hero?.subtitle,
  };

  if (dryRun) {
    console.log(JSON.stringify(patch, null, 2));
    return;
  }

  await client.createOrReplace(patch);

  console.log(`Synced homepage hero image to ${documentId}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
