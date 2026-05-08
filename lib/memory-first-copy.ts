import type { Locale } from "@/lib/site";

const replacements: Record<Locale, Array<[string, string]>> = {
  hu: [
    [
      "Egy séta, otthoni fény, városi részlet vagy közös ritmus. Természetes képsorozat azoknak, akik nem merev portrékat, hanem visszaidézhető hangulatot szeretnének.",
      "Egy séta, otthoni fény, városi részlet vagy közös pillanat. Természetes képsorozat azoknak, akik nem merev portrékat, hanem évekkel később is visszahozható emléket szeretnének.",
    ],
    [
      "Otthon, városban vagy közös ritmusban",
      "Otthon, városban vagy közös pillanatban",
    ],
    [
      "A gyerekek mozgását, a szülők tekintetét, az apró érintéseket és a közös ritmust keresem.",
      "A gyerekek mozgását, a szülők tekintetét, az apró érintéseket és azokat a pillanatokat keresem, amelyekből valódi emlék marad.",
    ],
    [
      "hogy a nap ritmusa megmaradjon, a képek pedig évek múlva is visszavigyenek oda.",
      "hogy a nap természetesen történjen, a képek pedig évek múlva is visszavigyenek oda.",
    ],
    [
      "Állatportré nyugodt, játékos ritmusban",
      "Állatportré nyugodt, játékos pillanatokkal",
    ],
    [
      "finom vezetéssel és jó ritmussal.",
      "finom vezetéssel és természetes önbizalommal.",
    ],
  ],
  en: [
    [
      "A walk, at-home light, city details or shared rhythm. A natural session for people who want images that bring back a feeling rather than stiff portraits.",
      "A walk, at-home light, city details or shared moments. A natural session for people who want a memory they can return to, not stiff portraits.",
    ],
    [
      "At home, in the city or in a shared rhythm",
      "At home, in the city or in a shared moment",
    ],
    [
      "I look for children's movement, the parents' glances, small touches and the rhythm you already share.",
      "I look for children's movement, the parents' glances, small touches and the moments that become real memories.",
    ],
    [
      "so the day keeps its rhythm and the images can take you back years later.",
      "so the day can unfold naturally and the images can take you back years later.",
    ],
    [
      "Animal portrait with a calm and playful rhythm",
      "Animal portrait with calm, playful moments",
    ],
    [
      "with gentle guidance and a calm rhythm.",
      "with gentle guidance and natural confidence.",
    ],
  ],
};

export function memoryFirstCopy(text: string, locale: Locale) {
  return replacements[locale].reduce(
    (value, [from, to]) => value.replaceAll(from, to),
    text,
  );
}
