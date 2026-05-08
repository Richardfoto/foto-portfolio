import { getCliClient } from "sanity/cli";

const apiVersion = "2026-04-22";
const dryRun = process.argv.includes("--dry-run");

const client = getCliClient({ apiVersion });

const stories = [
  {
    key: "9e0c17ef08ca",
    size: "large",
    storyTitleHu: "Sminkfény Budapest felett",
    storyTitleEn: "Makeup Light Above Budapest",
    storyHu:
      "Egy csendes budapesti pillanat a forgatás előtt: ecset, tükör, koncentráció. Szeretem ezeket az átmeneteket, amikor a kép még nem készült el, de a karakter már lassan megérkezik.",
    storyEn:
      "A quiet Budapest moment before the shoot: brush, mirror, concentration. I love these in-between states, when the image does not exist yet, but the character is already arriving.",
  },
  {
    key: "17bcfc0183b7",
    size: "wide",
    storyTitleHu: "Télűző tűz és gólyaláb",
    storyTitleEn: "Winter Farewell on Stilts",
    storyHu:
      "Gólyalábas zsonglőr, télűző zaj, boszorkányégetés és közösségi rítus egyetlen kavargó jelenetben. Nem steril eseményfotó, hanem energia: mozgás, füst, arcok és az a furcsa, ősi játékosság, amitől élni kezd a kép.",
    storyEn:
      "A stilt-walking juggler, winter-chasing noise, witch-burning ritual and community energy in one swirling scene. Not sterile event photography, but movement, smoke, faces and the strange old playfulness that makes an image come alive.",
  },
  {
    key: "74daf838aa10",
    size: "tall",
    storyTitleHu: "Bevilágítás próba",
    storyTitleEn: "Lighting Test on Set",
    storyHu:
      "Budapesti filmforgatás, amikor még minden próba: fények, állványok, árnyékok, apró döntések. A werk számomra nem háttérzaj, hanem a készülő kép idegrendszere.",
    storyEn:
      "A Budapest film set while everything is still rehearsal: lights, stands, shadows and small decisions. For me, werk is not background noise, but the nervous system of the image being made.",
  },
] as const;

async function main() {
  const document = await client.fetch<{
    _rev?: string;
    items?: Array<Record<string, unknown> & { _key?: string }>;
  } | null>(`*[_id == "galleryWall"][0]{_rev, items}`);

  if (!document?.items?.length) {
    throw new Error("galleryWall document or items not found.");
  }

  const items = document.items.map((item) => {
    const story = stories.find((entry) => entry.key === item._key);
    return story
      ? {
          ...item,
          size: story.size,
          storyTitleHu: story.storyTitleHu,
          storyTitleEn: story.storyTitleEn,
          storyHu: story.storyHu,
          storyEn: story.storyEn,
        }
      : item;
  });

  const patch = {
    titleHu: "Üdvözöllek a víziómban",
    titleEn: "Welcome to my vision",
    leadHu:
      "Ez egy kis love letter szekció: az a szívem csücske rész, ami nekem kedves. Biztosan megtaláljuk a számodra is legjobb stílust, atmoszférát, értéket és pillanatot, amit keresel.",
    leadEn:
      "This is a small love letter section: a corner of the work that feels close to my heart. I am sure we can find the style, atmosphere, value and moment that feels right for you.",
    items,
  };

  if (dryRun) {
    console.log(JSON.stringify(patch, null, 2));
    return;
  }

  await client.patch("galleryWall").set(patch).commit();
  console.log("Updated gallery wall stories.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
