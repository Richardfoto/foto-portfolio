import { absoluteUrl, localizedPath, site, type Locale } from "./site";
import { getServiceSlug } from "./service-slugs";

type LocalizedText = Record<Locale, string>;

export type PhotographyService = {
  id: string;
  anchor: string;
  imageServiceId?: string;
  relatedServiceIds?: string[];
  featuredSession?: boolean;
  title: LocalizedText;
  shortTitle: LocalizedText;
  description: LocalizedText;
  captions: Record<Locale, string[]>;
  alt: LocalizedText;
  cta: LocalizedText;
  keywords: Record<Locale, string[]>;
};

export const featuredSessionServices: PhotographyService[] = [
  {
    id: "personal-brand-starter",
    anchor: "personal-brand-starter",
    featuredSession: true,
    title: {
      hu: "Personal Brand Starter",
      en: "Personal Brand Starter",
    },
    shortTitle: {
      hu: "Personal Brand",
      en: "Personal Brand",
    },
    description: {
      hu: "Letisztult, természetes márkaképek weboldalhoz, LinkedInhez, bemutatkozó anyaghoz vagy új márkaindításhoz. Gyors, fókuszált induló csomag szakmai jelenléthez.",
      en: "Clean, natural brand images for websites, LinkedIn, introductions or the beginning of a new brand chapter. A focused starter session for professional presence.",
    },
    captions: {
      hu: ["Vállalkozói portré és szakmai jelenlét", "Weboldalhoz, LinkedInhez és bemutatkozáshoz"],
      en: ["Founder portrait and professional presence", "For websites, LinkedIn and introductions"],
    },
    alt: {
      hu: "personal brand starter fotózás Budapest szakmai portrékkal",
      en: "personal brand starter photography Budapest with professional portraits",
    },
    cta: {
      hu: "Márkaképeket kérek",
      en: "Request brand images",
    },
    keywords: {
      hu: ["personal brand fotózás Budapest", "szakmai portré starter"],
      en: ["personal brand photography Budapest", "professional portrait starter"],
    },
  },
  {
    id: "lifestyle-story-session",
    anchor: "lifestyle-story-session",
    featuredSession: true,
    title: {
      hu: "Lifestyle Story Session",
      en: "Lifestyle Story Session",
    },
    shortTitle: {
      hu: "Lifestyle Story",
      en: "Lifestyle Story",
    },
    description: {
      hu: "Egy séta, otthoni fény, városi részlet vagy közös ritmus. Természetes képsorozat azoknak, akik nem merev portrékat, hanem visszaidézhető hangulatot szeretnének.",
      en: "A walk, at-home light, city details or shared rhythm. A natural session for people who want images that bring back a feeling rather than stiff portraits.",
    },
    captions: {
      hu: ["Természetes lifestyle történet", "Otthon, városban vagy közös ritmusban"],
      en: ["Natural lifestyle story", "At home, in the city or in a shared rhythm"],
    },
    alt: {
      hu: "lifestyle story session Budapest természetes fotózás",
      en: "lifestyle story session Budapest natural photography",
    },
    cta: {
      hu: "Lifestyle sorozatot kérek",
      en: "Request a lifestyle story",
    },
    keywords: {
      hu: ["lifestyle story session Budapest", "természetes lifestyle fotózás"],
      en: ["lifestyle story session Budapest", "natural lifestyle photography"],
    },
  },
  {
    id: "content-creator-day",
    anchor: "content-creator-day",
    featuredSession: true,
    title: {
      hu: "Content Creator Day",
      en: "Content Creator Day",
    },
    shortTitle: {
      hu: "Content Creator",
      en: "Content Creator",
    },
    description: {
      hu: "Egy vezetett fotózási nap, ahol több hétre előre gondolkodunk: portré, werk, részletek, social és webes felhasználás. Kifejezetten tartalomhoz és kampányokhoz.",
      en: "A guided photography day planned ahead: portraits, werk moments, details, social content and web-ready imagery. Built especially for content and campaigns.",
    },
    captions: {
      hu: ["Tartalom több hétre előre", "Portré, werk, részletek és social anyag"],
      en: ["Content planned weeks ahead", "Portraits, werk, details and social assets"],
    },
    alt: {
      hu: "content creator day fotózás Budapest social media tartalomhoz",
      en: "content creator day photography Budapest for social media content",
    },
    cta: {
      hu: "Tartalomnapot kérek",
      en: "Request a content day",
    },
    keywords: {
      hu: ["content creator fotózás Budapest", "social media fotózás"],
      en: ["content creator photography Budapest", "social media photography"],
    },
  },
];

export const photographyServices: PhotographyService[] = [
  {
    id: "maternity",
    anchor: "maternity-newborn-photography",
    relatedServiceIds: ["maternity", "newborn"],
    title: {
      hu: "Kismama és újszülött fotózás",
      en: "Maternity and Newborn Photography",
    },
    shortTitle: {
      hu: "Kismama / újszülött",
      en: "Maternity / newborn",
    },
    description: {
      hu: "A kismama és újszülött fotózás együtt egy teljesebb kezdettörténet: a várakozás csendje, az első napok törékenysége és az otthon melege egy képi ívvé áll össze. Lehet külön kismama sorozat, külön újszülött fotózás, vagy tudatosan egymásra épített csomag, ha szeretnéd megőrizni ezt az időszakot a várandósságtól az első hetekig. Természetes fényben, türelemmel dolgozom, erőltetett pózok helyett finom, személyes és időtálló képekkel.",
      en: "Maternity and newborn photography together create a fuller beginning story: the quiet anticipation, the fragile first days and the warmth of home become one visual arc. It can be a maternity session, a newborn session, or a carefully connected package if you want to preserve this chapter from pregnancy to the first weeks. I work patiently in natural light, focusing on personal, timeless images instead of forced posing.",
    },
    captions: {
      hu: [
        "Kismama és újszülött történet természetes fényben",
        "Várandósságtól az első hetekig, finom filmes hangulatban",
      ],
      en: [
        "Maternity and newborn story in natural light",
        "From pregnancy to the first weeks with a soft cinematic mood",
      ],
    },
    alt: {
      hu: "kismama és újszülött fotózás Budapest természetes filmes hangulatban",
      en: "maternity and newborn photography Budapest in a natural cinematic style",
    },
    cta: {
      hu: "Kismama vagy újszülött fotózás foglalása",
      en: "Book maternity or newborn photography",
    },
    keywords: {
      hu: [
        "kismama fotózás Budapest",
        "újszülött fotózás Budapest",
        "várandós fotózás Budapest",
        "természetes baba fotózás",
      ],
      en: [
        "maternity photography Budapest",
        "newborn photography Budapest",
        "pregnancy photography Budapest",
        "natural baby photography",
      ],
    },
  },
  {
    id: "business-portrait",
    anchor: "werk-photography",
    title: {
      hu: "Werk fotózás",
      en: "Werk Photography",
    },
    shortTitle: {
      hu: "Werk fotózás",
      en: "Werk photography",
    },
    description: {
      hu: "A werk fotózás a színfalak mögötti munka vizuális dokumentációja: folyamatok, technikai részletek, alkotói döntések, kézmozdulatok, fények, eszközök és a háttérben történő koncentrált munka. Nem klasszikus portré kategória, hanem olyan képi anyag, amely megmutatja, hogyan készül valami, milyen figyelem van mögötte, és milyen hangulatból születik a végeredmény. Kreatív projektekhez, márkakommunikációhoz, kampányokhoz és webes tartalomhoz különösen erős.",
      en: "Werk photography documents what happens behind the scenes: process, technical details, creative decisions, hands at work, light, tools and the focused effort behind the final result. It is not a classic portrait category, but visual material that shows how something is made, what kind of attention sits behind it and what atmosphere shapes the outcome. It is especially useful for creative projects, brand communication, campaigns and web content.",
    },
    captions: {
      hu: [
        "Werk fotózás alkotói folyamat közben",
        "Színfalak mögötti technikai részletek",
      ],
      en: [
        "Werk photography during a real creative process",
        "Behind-the-scenes technical details",
      ],
    },
    alt: {
      hu: "werk fotózás Budapest színfalak mögötti technikai részletekkel",
      en: "werk photography Budapest with behind-the-scenes technical details",
    },
    cta: {
      hu: "Werk fotózás egyeztetése",
      en: "Plan werk photography",
    },
    keywords: {
      hu: [
        "werk fotózás Budapest",
        "kulisszák mögötti fotózás",
        "színfalak mögötti fotózás",
        "márka werk fotózás",
      ],
      en: [
        "werk photography Budapest",
        "behind the scenes photography Budapest",
        "brand werk photography",
        "creative process photography",
      ],
    },
  },
  {
    id: "family-lifestyle",
    anchor: "family-lifestyle-photography",
    title: {
      hu: "Családi lifestyle fotózás",
      en: "Family Lifestyle Photography",
    },
    shortTitle: {
      hu: "Családi lifestyle",
      en: "Family lifestyle",
    },
    description: {
      hu: "A családi képek akkor maradnak igazán időtállóak, ha nem tökéletesnek, hanem valódinak érződnek. A gyerekek mozgását, a szülők tekintetét, az apró érintéseket és a közös ritmust keresem. A családi lifestyle fotózás lehet otthon, parkban vagy a városban; a lényeg, hogy ne egy díszletben legyetek, hanem a saját történetetekben.",
      en: "Family photographs become timeless when they feel real rather than perfect. I look for children's movement, the parents' glances, small touches and the rhythm you already share. A family lifestyle session can happen at home, in a park or in the city; what matters is that you are not placed in a set, but held inside your own story.",
    },
    captions: {
      hu: [
        "Családi lifestyle fotózás őszinte mozdulatokkal",
        "Természetes családi pillanat Budapesten",
      ],
      en: [
        "Family lifestyle photography with honest movement",
        "Natural family moment in Budapest",
      ],
    },
    alt: {
      hu: "családi lifestyle fotózás Budapest természetes pillanatokkal",
      en: "family lifestyle photography Budapest with natural moments",
    },
    cta: {
      hu: "Családi fotózás foglalása",
      en: "Book a family session",
    },
    keywords: {
      hu: ["családi lifestyle fotózás Budapest", "természetes családi fotózás"],
      en: ["family lifestyle photography Budapest", "natural family photography"],
    },
  },
  {
    id: "engagement-couples",
    anchor: "engagement-couples-photography",
    title: {
      hu: "Jegyes, páros és engagement fotózás",
      en: "Engagement, Couples and Love Story Photography",
    },
    shortTitle: {
      hu: "Jegyes / páros",
      en: "Engagement / couples",
    },
    description: {
      hu: "A páros fotózás akkor működik, ha nem kell szerepelnetek benne. Séta, beszélgetés, egymásra figyelés: ezekből születnek azok a képek, amelyek nem csak szépek, hanem felismerhetően ti vagytok. Jegyes fotózásnál különösen fontos, hogy a képek természetesek maradjanak, mégis legyen bennük egy finom, ünnepi várakozás. Esküvői fotózással együtt is tervezhető, ha szeretnétek, hogy az egymás felé vezető út és a nagy nap egy képi történetté álljon össze.",
      en: "Couples photography works best when you do not have to perform. A walk, a conversation, the way you notice each other: these are the moments that create images that are beautiful and unmistakably yours. For engagement sessions, I keep the photographs natural while preserving the quiet anticipation of what is coming. It can also be planned together with wedding photography if you want the story leading to the day and the day itself to feel connected.",
    },
    captions: {
      hu: [
        "Jegyes fotózás Budapest utcáin természetes hangulatban",
        "Páros történetmesélő fotózás naplementében",
      ],
      en: [
        "Engagement photography in Budapest with a natural mood",
        "Storytelling couples session at sunset",
      ],
    },
    alt: {
      hu: "jegyes fotózás Budapest természetes páros lifestyle képekkel",
      en: "engagement photography Budapest with natural couples lifestyle images",
    },
    cta: {
      hu: "Jegyes fotózás egyeztetése",
      en: "Plan an engagement session",
    },
    keywords: {
      hu: ["jegyes fotózás Budapest", "páros fotózás Budapest"],
      en: ["engagement photography Budapest", "couples photography Budapest"],
    },
  },
  {
    id: "wedding",
    anchor: "wedding-photography",
    title: {
      hu: "Esküvői fotózás",
      en: "Wedding Photography",
    },
    shortTitle: {
      hu: "Esküvő",
      en: "Wedding",
    },
    description: {
      hu: "Az esküvő napján a legfontosabb pillanatok sokszor nem akkor történnek, amikor mindenki a kamerába néz. Egy kézszorítás, egy félmosoly, egy szülő tekintete vagy a csend az igen előtt épp annyira része a történetnek, mint a nagy jelenetek. Esküvői fotósként diszkréten dolgozom, hogy a nap ritmusa megmaradjon, a képek pedig évek múlva is visszavigyenek oda. Jegyes vagy páros sorozattal együtt is kérhető, így már a készülődés előtti időszakból is lehet egy természetes, személyes képi alapotok.",
      en: "On a wedding day, the most important moments often happen when nobody is looking at the camera. A hand held tightly, a half-smile, a parent's glance or the silence before the vows can carry as much meaning as the grand scenes. As a wedding photographer, I work discreetly so the day keeps its rhythm and the images can take you back years later. It can also be paired with an engagement or couples session, so the time before the wedding becomes part of the same personal visual story.",
    },
    captions: {
      hu: [
        "Esküvői fotózás időtlen, dokumentarista szemlélettel",
        "Valódi érzelmek az esküvő napján",
      ],
      en: [
        "Wedding photography with a timeless documentary eye",
        "Real emotions on the wedding day",
      ],
    },
    alt: {
      hu: "esküvői fotós Budapest dokumentarista természetes stílusban",
      en: "wedding photographer Budapest in a natural documentary style",
    },
    cta: {
      hu: "Esküvői ajánlat kérése",
      en: "Ask for wedding availability",
    },
    keywords: {
      hu: ["esküvői fotós Budapest", "természetes esküvői fotózás"],
      en: ["wedding photographer Budapest", "natural wedding photography"],
    },
  },
  {
    id: "product-ecommerce",
    anchor: "product-ecommerce-photography",
    title: {
      hu: "Termék- és e-commerce fotózás",
      en: "Product and E-commerce Photography",
    },
    shortTitle: {
      hu: "Termék / e-commerce",
      en: "Product / e-commerce",
    },
    description: {
      hu: "A termékfotó akkor dolgozik jól, ha egyszerre tiszta, pontos és vágyat ébreszt. Webshophoz, social kampányhoz vagy márkaoldalhoz olyan képeket készítek, amelyek megmutatják az anyagot, a formát és a használat hangulatát. A letisztult e-commerce képek mellett lifestyle jelenetekkel is segítek, ha a termék mögé történetet kell építeni.",
      en: "Product photography works when it is clean, precise and quietly desirable. For webshops, social campaigns or brand pages, I create images that show material, form and the feeling of use. Alongside clean e-commerce images, I can build lifestyle scenes when the product needs a story around it.",
    },
    captions: {
      hu: [
        "Letisztult termékfotó webáruházhoz",
        "Lifestyle termékfotó márkatörténethez",
      ],
      en: [
        "Clean product image for e-commerce",
        "Lifestyle product photography for brand storytelling",
      ],
    },
    alt: {
      hu: "termékfotózás Budapest e-commerce és lifestyle márkaképekkel",
      en: "product photography Budapest with e-commerce and lifestyle brand images",
    },
    cta: {
      hu: "Termékfotózás egyeztetése",
      en: "Plan product photography",
    },
    keywords: {
      hu: ["termékfotózás Budapest", "e-commerce fotózás"],
      en: ["product photography Budapest", "e-commerce photography"],
    },
  },
  {
    id: "event-corporate",
    anchor: "event-corporate-photography",
    title: {
      hu: "Rendezvény- és corporate event fotózás",
      en: "Event and Corporate Event Photography",
    },
    shortTitle: {
      hu: "Rendezvény",
      en: "Event",
    },
    description: {
      hu: "Egy rendezvény képei akkor értékesek, ha nem csak dokumentálják, hogy kik voltak ott, hanem visszaadják az esemény energiáját. Corporate event, konferencia, workshop vagy márkaesemény esetén figyelek a kulcspillanatokra, a kapcsolódásokra és azokra a részletekre, amelyek később kommunikációban is használhatóak. A cél: gyorsan átadható, elegáns, természetes képanyag.",
      en: "Event images are valuable when they do more than prove who attended; they bring back the energy of the room. For corporate events, conferences, workshops or brand gatherings, I look for key moments, connections and details that can later support communication. The goal is an elegant, natural gallery delivered efficiently.",
    },
    captions: {
      hu: [
        "Corporate event fotózás Budapest üzleti eseményen",
        "Konferencia és márkaesemény természetes dokumentálása",
      ],
      en: [
        "Corporate event photography at a Budapest business gathering",
        "Natural documentation of a conference and brand event",
      ],
    },
    alt: {
      hu: "rendezvényfotózás Budapest corporate event és konferencia fotózás",
      en: "event photography Budapest corporate event and conference photography",
    },
    cta: {
      hu: "Rendezvényfotózás ajánlatkérés",
      en: "Request event coverage",
    },
    keywords: {
      hu: ["rendezvényfotózás Budapest", "corporate event fotózás"],
      en: ["event photography Budapest", "corporate event photography Budapest"],
    },
  },
  {
    id: "pet-animal",
    anchor: "pet-animal-photography",
    title: {
      hu: "Kisállat- és állatfotózás",
      en: "Pet and Animal Photography",
    },
    shortTitle: {
      hu: "Kisállat",
      en: "Pet",
    },
    description: {
      hu: "Egy állat jelenléte ritkán kiszámítható, pont ezért őszinte. A kisállat fotózás során nem fegyelmezett pózokat keresek, hanem karaktert: kíváncsiságot, játékot, nyugalmat, kötődést. Kültéren vagy otthon is dolgozhatunk, a tempót mindig az állat biztonságérzete határozza meg.",
      en: "An animal's presence is rarely predictable, and that is exactly why it feels honest. In pet photography I do not look for disciplined posing, but for character: curiosity, play, calm and connection. We can work outdoors or at home, always following the animal's sense of safety.",
    },
    captions: {
      hu: [
        "Kisállat fotózás természetes kapcsolatban",
        "Állatportré nyugodt, játékos ritmusban",
      ],
      en: [
        "Pet photography with natural connection",
        "Animal portrait with a calm and playful rhythm",
      ],
    },
    alt: {
      hu: "kisállat fotózás Budapest természetes állatportré stílusban",
      en: "pet photography Budapest in a natural animal portrait style",
    },
    cta: {
      hu: "Kisállat fotózás foglalása",
      en: "Book a pet session",
    },
    keywords: {
      hu: ["kisállat fotózás Budapest", "állatfotózás Budapest"],
      en: ["pet photography Budapest", "animal photography Budapest"],
    },
  },
  {
    id: "boudoir-branding",
    anchor: "dating-boost-boudoir",
    title: {
      hu: "Dating Boost / Boudoir fotózás",
      en: "Dating Boost / Boudoir Photography",
    },
    shortTitle: {
      hu: "Dating Boost / Boudoir",
      en: "Dating Boost / Boudoir",
    },
    description: {
      hu: "A Dating Boost / Boudoir irány azoknak szól, akik szeretnének magukról erős, ízléses és önazonos képeket társkereső profilhoz, személyes márkához vagy egyszerűen saját maguknak. Nem harsány és nem kellemetlenül direkt: inkább magabiztos, természetes, elegáns portréhangulat, finom vezetéssel és jó ritmussal.",
      en: "The Dating Boost / Boudoir direction is for people who want confident, tasteful and recognisably personal images for a dating profile, personal brand or simply for themselves. It is not loud or overly direct: the mood is natural, elegant and assured, with gentle guidance and a calm rhythm.",
    },
    captions: {
      hu: [
        "Dating profilhoz és személyes márkához",
        "Elegáns, természetes boudoir hangulat",
      ],
      en: [
        "For dating profiles and personal brands",
        "Elegant, natural boudoir mood",
      ],
    },
    alt: {
      hu: "dating boost és boudoir fotózás Budapest természetes elegáns portrékkal",
      en: "dating boost and boudoir photography Budapest with natural elegant portraits",
    },
    cta: {
      hu: "Dating Boost / Boudoir egyeztetés",
      en: "Plan Dating Boost / Boudoir",
    },
    keywords: {
      hu: [
        "dating profil fotózás Budapest",
        "boudoir fotózás Budapest",
        "társkereső portré fotózás",
        "elegáns portré fotózás Budapest",
      ],
      en: [
        "dating profile photography Budapest",
        "boudoir photography Budapest",
        "dating portrait photography",
        "elegant portrait photography Budapest",
      ],
    },
  },
];

export const sharedFaqs: Record<Locale, Array<{ question: string; answer: string }>> = {
  hu: [
    {
      question: "Budapesten kívül is vállalsz fotózást?",
      answer:
        "Igen. Elsősorban Budapesten és környékén dolgozom, de előzetes egyeztetéssel vidéki vagy külföldi helyszín is megoldható.",
    },
    {
      question: "Mi történik, ha nem vagyok magabiztos kamera előtt?",
      answer:
        "Ez teljesen természetes. A fotózás során finoman vezetlek, de nem pózoltatlak mereven; a cél az, hogy a képek valódinak és rólad szólónak hassanak.",
    },
    {
      question: "Mikor kapom meg a képeket?",
      answer:
        "A legtöbb portré, lifestyle és családi sorozat maximum 7 munkanapon belül készül el privát online galériában. Nagyobb eseményeknél az átadási időt előre egyeztetjük.",
    },
  ],
  en: [
    {
      question: "Do you photograph outside Budapest?",
      answer:
        "Yes. I mainly work in and around Budapest, but countryside and international sessions can be arranged in advance.",
    },
    {
      question: "What if I do not feel confident in front of the camera?",
      answer:
        "That is completely normal. I guide gently without stiff posing, so the images can feel real, calm and recognisably yours.",
    },
    {
      question: "When will I receive the images?",
      answer:
        "Most portrait, lifestyle and family sessions are delivered within maximum 7 business days in a private online gallery. Larger events are scheduled individually.",
    },
  ],
};

export function serviceKeywords(
  locale: Locale,
  services: PhotographyService[] = photographyServices,
) {
  return Array.from(
    new Set(services.flatMap((service) => service.keywords[locale])),
  );
}

export function serviceSchemaNodes(
  locale: Locale,
  services: PhotographyService[] = photographyServices,
) {
  return services.map((service) => ({
    "@type": "Service",
    "@id": `${site.url}/#service-${service.id}`,
    name: service.title[locale],
    description: service.description[locale],
    provider: { "@id": `${site.url}/#photographer` },
    areaServed: { "@type": "City", name: "Budapest" },
    serviceType: service.keywords[locale],
    url: absoluteUrl(localizedPath(locale, `/services/${getServiceSlug(service.id, locale)}`)),
  }));
}
