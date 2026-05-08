import { getCliClient } from "sanity/cli";

const apiVersion = "2026-04-22";
const client = getCliClient({ apiVersion });

type GalleryDoc = {
  _id: string;
  title?: string;
  category?: string;
};

const legacyPatterns = [/üzleti/i, /headshot/i, /business portrait/i];

function hasLegacyCopy(value: string | undefined) {
  return Boolean(value && legacyPatterns.some((pattern) => pattern.test(value)));
}

async function main() {
  const galleries = await client.fetch<GalleryDoc[]>(
    `*[
      _type == "gallery" &&
      service->serviceId == "business-portrait" &&
      !(_id in path("drafts.**"))
    ]{_id, title, category}`,
  );

  const transaction = client.transaction();
  let updated = 0;

  for (const gallery of galleries) {
    const patch: Record<string, unknown> = {};

    if (hasLegacyCopy(gallery.title)) {
      patch.title = "Werkfotózás";
    }

    if (hasLegacyCopy(gallery.category)) {
      patch.category = "Werkfotózás";
    }

    patch.slug = { _type: "slug", current: "werk-fotozas" };

    if (Object.keys(patch).length > 0) {
      transaction.patch(gallery._id, (item) => item.set(patch));
      updated += 1;
    }
  }

  if (updated > 0) {
    await transaction.commit();
  }

  console.log(`Updated ${updated} Werk gallery document(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
