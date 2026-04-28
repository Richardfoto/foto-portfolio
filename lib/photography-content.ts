import { absoluteUrl, localizedPath, site, type Locale } from "./site";

type LocalizedText = Record<Locale, string>;

export type PhotographyService = {
  id: string;
  anchor: string;
  title: LocalizedText;
  shortTitle: LocalizedText;
  description: LocalizedText;
  captions: Record<Locale, string[]>;
  alt: LocalizedText;
  cta: LocalizedText;
  keywords: Record<Locale, string[]>;
};

export const photographyServices: PhotographyService[] = [
  {
    id: "newborn",
    anchor: "newborn-photography",
    title: {
      hu: "Újszülött fotózás",
      en: "Newborn Photography",
    },
    shortTitle: {
      hu: "Újszülött",
      en: "Newborn",
    },
    description: {
      hu: "Az első napok csendesek, törékenyek és nagyon gyorsan elmúlnak. Az újszülött fotózás nálam nem erőltetett pózokról szól, hanem az otthon melegéről, az apró mozdulatokról és arról a különös nyugalomról, amely csak az első hetekben létezik. Természetes fényben, türelemmel dolgozom, hogy a képek évek múlva is a valódi kezdet hangulatát őrizzék.",
      en: "The first days are quiet, fragile and gone almost before you notice them. My newborn photography is not about forced posing, but about the warmth of home, tiny gestures and the rare stillness of the first weeks. I work patiently in natural light, preserving the beginning as it truly felt.",
    },
    captions: {
      hu: [
        "Újszülött életkép természetes fényben, Budapest",
        "Csendes otthoni pillanat az első hetekből",
      ],
      en: [
        "Newborn lifestyle moment in natural light, Budapest",
        "Quiet at-home memory from the first weeks",
      ],
    },
    alt: {
      hu: "természetes újszülött fotózás Budapesten otthoni környezetben",
      en: "natural newborn photography in Budapest at home",
    },
    cta: {
      hu: "Újszülött fotózás egyeztetése",
      en: "Plan a newborn session",
    },
    keywords: {
      hu: ["újszülött fotózás Budapest", "természetes baba fotózás"],
      en: ["newborn photography Budapest", "natural baby photography"],
    },
  },
  {
    id: "maternity",
    anchor: "maternity-photography",
    title: {
      hu: "Kismama fotózás",
      en: "Maternity Photography",
    },
    shortTitle: {
      hu: "Kismama",
      en: "Maternity",
    },
    description: {
      hu: "A várandósság egyszerre nagyon személyes és láthatóan ünnepi időszak. A kismama fotózás célja, hogy ne egy szerepet mutasson, hanem azt az erőt, finomságot és várakozást, amely ebben az időben benned van. Lehet városi séta, Duna-parti fény, otthoni csend vagy enteriőr; a ritmust mindig hozzád igazítom.",
      en: "Pregnancy is intimate and quietly ceremonial at the same time. A maternity session should not show a role, but the strength, softness and anticipation you carry in this chapter. It can be a walk in the city, light by the Danube, the quiet of home or a refined interior; the rhythm always follows you.",
    },
    captions: {
      hu: [
        "Kismama portré lágy budapesti fényben",
        "Várandósság története természetes, filmes hangulatban",
      ],
      en: [
        "Maternity portrait in soft Budapest light",
        "Pregnancy story with a natural cinematic mood",
      ],
    },
    alt: {
      hu: "kismama fotózás Budapest természetes filmes hangulatban",
      en: "maternity photography Budapest in a natural cinematic style",
    },
    cta: {
      hu: "Kismama fotózás foglalása",
      en: "Book a maternity session",
    },
    keywords: {
      hu: ["kismama fotózás Budapest", "várandós fotózás Budapest"],
      en: ["maternity photography Budapest", "pregnancy photography Budapest"],
    },
  },
  {
    id: "business-portrait",
    anchor: "business-portrait-werk-headshot",
    title: {
      hu: "Üzleti portré, werk és headshot fotózás",
      en: "Business Portrait, Werk and Headshot Photography",
    },
    shortTitle: {
      hu: "Üzleti portré / werk",
      en: "Business portrait / werk",
    },
    description: {
      hu: "Egy jó üzleti portré nem merev, hanem pontos: megmutatja a szakmai jelenlétedet, de nem veszi el belőle az emberit. A werk fotózás Budapest kreatív, vállalkozói és céges közegeiben különösen erős eszköz, mert nem csak arcot ad a márkának, hanem folyamatot, figyelmet és hitelességet is. Headshot, LinkedIn portré, csapatfotó vagy személyes márkaanyag esetén is letisztult, használható képi világot építünk.",
      en: "A strong business portrait is not stiff; it is precise. It shows your professional presence without removing the human part. Werk photography in Budapest is especially valuable for creatives, founders and companies because it gives a brand not only a face, but process, attention and credibility. Whether you need headshots, LinkedIn portraits, team imagery or personal brand content, we build a clean and useful visual language.",
    },
    captions: {
      hu: [
        "Üzleti portré természetes fénnyel, Budapest",
        "Werk fotózás alkotói folyamat közben",
      ],
      en: [
        "Business portrait with natural light, Budapest",
        "Werk photography during a real creative process",
      ],
    },
    alt: {
      hu: "werk fotózás Budapest üzleti portré és headshot természetes stílusban",
      en: "werk photography Budapest business portrait and headshot in a natural style",
    },
    cta: {
      hu: "Üzleti portré egyeztetése",
      en: "Plan business portraits",
    },
    keywords: {
      hu: ["werk fotózás Budapest", "üzleti portré fotózás", "headshot Budapest"],
      en: [
        "werk photography Budapest",
        "business portrait Budapest",
        "headshot photography Budapest",
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
      hu: "A páros fotózás akkor működik, ha nem kell szerepelnetek benne. Séta, beszélgetés, egymásra figyelés: ezekből születnek azok a képek, amelyek nem csak szépek, hanem felismerhetően ti vagytok. Jegyes fotózásnál különösen fontos, hogy a képek természetesek maradjanak, mégis legyen bennük egy finom, ünnepi várakozás.",
      en: "Couples photography works best when you do not have to perform. A walk, a conversation, the way you notice each other: these are the moments that create images that are beautiful and unmistakably yours. For engagement sessions, I keep the photographs natural while preserving the quiet anticipation of what is coming.",
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
      hu: "Az esküvő napján a legfontosabb pillanatok sokszor nem akkor történnek, amikor mindenki a kamerába néz. Egy kézszorítás, egy félmosoly, egy szülő tekintete vagy a csend az igen előtt épp annyira része a történetnek, mint a nagy jelenetek. Esküvői fotósként diszkréten dolgozom, hogy a nap ritmusa megmaradjon, a képek pedig évek múlva is visszavigyenek oda.",
      en: "On a wedding day, the most important moments often happen when nobody is looking at the camera. A hand held tightly, a half-smile, a parent's glance or the silence before the vows can carry as much meaning as the grand scenes. As a wedding photographer, I work discreetly so the day keeps its rhythm and the images can take you back years later.",
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
    anchor: "boudoir-intimate-personal-branding",
    title: {
      hu: "Boudoir, intim portré és personal branding fotózás",
      en: "Boudoir, Intimate Portrait and Personal Branding Photography",
    },
    shortTitle: {
      hu: "Boudoir / branding",
      en: "Boudoir / branding",
    },
    description: {
      hu: "Az intim portré nem a túlzásról szól, hanem a bizalomról. Boudoir vagy personal branding fotózásnál olyan teret teremtek, ahol nem kell szerepet játszanod, mégis erős, elegáns és személyes képek születhetnek. A hangsúly a finom irányításon, a természetes testbeszéden és azon van, hogy a végeredmény valóban hozzád tartozzon.",
      en: "Intimate portraiture is not about excess; it is about trust. For boudoir or personal branding photography, I create a space where you do not need to perform, yet the images can feel strong, elegant and deeply personal. The focus is on gentle direction, natural body language and a result that truly belongs to you.",
    },
    captions: {
      hu: [
        "Boudoir portré elegáns, bizalmi hangulatban",
        "Personal branding fotózás személyes történettel",
      ],
      en: [
        "Boudoir portrait with an elegant atmosphere of trust",
        "Personal branding photography with a personal story",
      ],
    },
    alt: {
      hu: "boudoir fotózás Budapest intim portré és personal branding stílusban",
      en: "boudoir photography Budapest intimate portrait and personal branding style",
    },
    cta: {
      hu: "Személyes portré egyeztetése",
      en: "Plan a personal portrait session",
    },
    keywords: {
      hu: ["boudoir fotózás Budapest", "personal branding fotózás Budapest"],
      en: ["boudoir photography Budapest", "personal branding photography Budapest"],
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
        "A legtöbb portré, lifestyle és családi sorozat 7-10 munkanapon belül készül el privát online galériában. Nagyobb eseményeknél az átadási időt előre egyeztetjük.",
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
        "Most portrait, lifestyle and family sessions are delivered within 7-10 business days in a private online gallery. Larger events are scheduled individually.",
    },
  ],
};

export function serviceKeywords(locale: Locale) {
  return Array.from(
    new Set(photographyServices.flatMap((service) => service.keywords[locale])),
  );
}

export function serviceSchemaNodes(locale: Locale) {
  return photographyServices.map((service) => ({
    "@type": "Service",
    "@id": `${site.url}/#service-${service.id}`,
    name: service.title[locale],
    description: service.description[locale],
    provider: { "@id": `${site.url}/#photographer` },
    areaServed: { "@type": "City", name: "Budapest" },
    serviceType: service.keywords[locale],
    url: absoluteUrl(`${localizedPath(locale, "/")}#${service.anchor}`),
  }));
}
