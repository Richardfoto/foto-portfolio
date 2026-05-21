import type { StructureResolver } from "sanity/structure";
import { featuredServicePresets } from "./servicePresets";

const galleryServices = [
  { title: "Kismama és újszülött fotózás", serviceIds: ["maternity", "newborn"] },
  { title: "Werk fotózás", serviceId: "business-portrait" },
  { title: "Családi lifestyle", serviceId: "family-lifestyle" },
  { title: "Jegyes / páros", serviceId: "engagement-couples" },
  { title: "Esküvő", serviceId: "wedding" },
  { title: "Termék / e-commerce", serviceId: "product-ecommerce" },
  { title: "Rendezvény", serviceId: "event-corporate" },
  { title: "Kisállat", serviceId: "pet-animal" },
  { title: "Dating Boost / Boudoir", serviceId: "boudoir-branding" },
];

export const structure: StructureResolver = (S) => {
  const listedTypes = [
    "hero",
    "about",
    "homeSessions",
    "forgatasMenete",
    "gallery",
    "service",
    "galleryWall",
    "bookingSettings",
  ];
  const singleton = (type: string, title: string) =>
    S.listItem()
      .title(title)
      .schemaType(type)
      .child(S.document().schemaType(type).documentId(type));
  const featuredServiceItems = featuredServicePresets.map((service) =>
    S.listItem()
      .title(service.title)
      .schemaType("service")
      .child(
        S.document()
          .schemaType("service")
          .documentId(service.id)
          .initialValueTemplate(service.id),
      ),
  );
  const baseServiceList = S.documentTypeList("service")
    .title("Alap szolgáltatások - képek és szövegek")
    .filter(
      '_type == "service" && !(serviceId in ["personal-brand-starter", "lifestyle-story-session", "content-creator-day"])',
    )
    .defaultOrdering([{ field: "order", direction: "asc" }]);
  const serviceList = S.documentTypeList("service")
    .title("Minden szolgáltatás - képek és szövegek")
    .defaultOrdering([{ field: "order", direction: "asc" }]);
  const allGalleriesList = S.documentTypeList("gallery")
    .title("Minden szolgáltatás galéria")
    .defaultOrdering([
      { field: "service.order", direction: "asc" },
      { field: "_createdAt", direction: "desc" },
    ]);
  const galleriesByService = galleryServices.map((service) =>
    S.listItem()
      .title(service.title)
      .schemaType("gallery")
      .child(
        S.documentTypeList("gallery")
          .title(service.title)
          .filter('_type == "gallery" && service->serviceId in $serviceIds')
          .params({
            serviceIds:
              "serviceIds" in service ? service.serviceIds : [service.serviceId],
          })
          .defaultOrdering([{ field: "_createdAt", direction: "desc" }]),
      ),
  );

  return S.list()
    .title("Richard Foto")
    .items([
      S.listItem()
        .title("Főoldal")
        .child(
          S.list()
            .title("Főoldal")
            .items([
              singleton("hero", "Header szekció és munkakép"),
              singleton("homeSessions", "Kiemelt csempék képei"),
            ]),
        ),
      singleton("forgatasMenete", "Röviden"),
      S.divider(),
      S.listItem()
        .title("Galéria")
        .schemaType("galleryWall")
        .child(
          S.list()
            .title("Galéria")
            .items([
              S.listItem()
                .title("Galéria oldal - 6 kép, 6 történet")
                .schemaType("galleryWall")
                .child(
                  S.document()
                    .schemaType("galleryWall")
                    .documentId("galleryWall"),
                ),
            ]),
        ),
      singleton("about", "Rólam"),
      S.listItem()
        .title("Szolgáltatások")
        .schemaType("service")
        .child(
          S.list()
            .title("Szolgáltatások")
            .items([
              S.listItem()
                .title("Kiemelt szolgáltatások - főoldal és foglalás")
                .child(
                  S.list()
                    .title("Kiemelt szolgáltatások")
                    .items(featuredServiceItems),
                ),
              S.listItem()
                .title("Alap szolgáltatások - services oldal")
                .schemaType("service")
                .child(baseServiceList),
              S.listItem()
                .title("Minden szolgáltatás egyben")
                .schemaType("service")
                .child(serviceList),
              S.divider(),
              S.listItem()
                .title("Szolgáltatás galériák - külön képcsoportok")
                .schemaType("gallery")
                .child(
                  S.list()
                    .title("Szolgáltatás galériák")
                    .items([
                      S.listItem()
                        .title("Összes szolgáltatás galéria")
                        .schemaType("gallery")
                        .child(allGalleriesList),
                      S.divider(),
                      ...galleriesByService,
                    ]),
                ),
            ]),
        ),
      S.listItem()
        .title("Foglalás")
        .child(
          S.list()
            .title("Foglalás")
            .items([
              singleton("bookingSettings", "Foglalás oldal header"),
              S.divider(),
              S.listItem()
                .title("A foglalásban megjelenő opciók")
                .child(
                  S.list()
                    .title("A foglalásban megjelenő opciók")
                    .items([
                      S.listItem()
                        .title("Főoldali ajánlatok")
                        .child(
                          S.list()
                            .title("Főoldali ajánlatok")
                            .items(featuredServiceItems),
                        ),
                      S.listItem()
                        .title("Szolgáltatások")
                        .schemaType("service")
                        .child(baseServiceList),
                    ]),
                ),
            ]),
        ),
      S.listItem()
        .title("Jelentkezz modellnek")
        .child(
          S.list()
            .title("Jelentkezz modellnek")
            .items([
              singleton("homeSessions", "Főoldali modell csempe képe"),
            ]),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !listedTypes.includes(item.getId() ?? ""),
      ),
    ]);
};
