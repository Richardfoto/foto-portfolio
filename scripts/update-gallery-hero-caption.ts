import { getCliClient } from "sanity/cli";

const apiVersion = "2026-04-22";
const client = getCliClient({ apiVersion });

async function main() {
  await client
    .patch("galleryWall")
    .set({
      heroCaptionHu:
        "Parlament Budapest, 2026",
      heroCaptionEn:
        "Parliament Budapest, 2026",
    })
    .commit();

  console.log("Updated gallery hero caption.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
