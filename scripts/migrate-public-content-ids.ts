import { getCliClient } from "sanity/cli";

const apiVersion = "2025-01-01";
const dryRun = process.argv.includes("--dry-run");
const deletePrivate = process.argv.includes("--delete-private");

const client = getCliClient({ apiVersion });

type ServiceDocument = {
  _id: string;
  _type: "service";
  serviceId?: string;
  order?: number;
  anchor?: string;
  image?: unknown;
  titleHu?: string;
  titleEn?: string;
  shortTitleHu?: string;
  shortTitleEn?: string;
  descriptionHu?: string;
  descriptionEn?: string;
  ctaHu?: string;
  ctaEn?: string;
  captionsHu?: string[];
  captionsEn?: string[];
  keywordsHu?: string[];
  keywordsEn?: string[];
  featured?: boolean;
};

type GalleryDocument = {
  _id: string;
  _type: "gallery";
  title?: string;
  slug?: unknown;
  serviceId?: string;
  serviceOrder?: number;
  category?: string;
  featured?: boolean;
  coverImage?: unknown;
  images?: unknown[];
  description?: string;
};

const privateServiceId = (serviceId: string) => `service.${serviceId}`;
const publicServiceId = (serviceId: string) => `service-${serviceId}`;
const privateGalleryId = (serviceId: string) => `gallery.${serviceId}`;
const publicGalleryId = (serviceId: string) => `gallery-${serviceId}`;

async function main() {
  const services = await client.fetch<ServiceDocument[]>(
    `*[_type == "service" && defined(serviceId)] | order(order asc){
      _id,
      _type,
      serviceId,
      order,
      anchor,
      image,
      titleHu,
      titleEn,
      shortTitleHu,
      shortTitleEn,
      descriptionHu,
      descriptionEn,
      ctaHu,
      ctaEn,
      captionsHu,
      captionsEn,
      keywordsHu,
      keywordsEn,
      featured
    }`,
  );

  const galleries = await client.fetch<GalleryDocument[]>(
    `*[_type == "gallery" && defined(serviceId)] | order(serviceOrder asc){
      _id,
      _type,
      title,
      slug,
      serviceId,
      serviceOrder,
      category,
      featured,
      coverImage,
      images,
      description
    }`,
  );

  const serviceById = new Map(
    services
      .filter((service) => service.serviceId)
      .map((service) => [service.serviceId as string, service]),
  );

  const publicServices = Array.from(serviceById.values()).map((service) => ({
    ...service,
    _id: publicServiceId(service.serviceId as string),
  }));

  const publicGalleries = galleries
    .filter((gallery) => gallery.serviceId && serviceById.has(gallery.serviceId))
    .map((gallery) => {
      const service = serviceById.get(gallery.serviceId as string);

      return {
        ...gallery,
        _id: publicGalleryId(gallery.serviceId as string),
        service: {
          _type: "reference",
          _ref: publicServiceId(gallery.serviceId as string),
        },
        title: gallery.title ?? service?.titleHu,
        serviceOrder: gallery.serviceOrder ?? service?.order,
        category: gallery.category ?? gallery.serviceId,
      };
    });

  const privateIds = [
    ...publicServices.map((service) => privateServiceId(service.serviceId as string)),
    ...publicGalleries.map((gallery) => privateGalleryId(gallery.serviceId as string)),
  ];

  if (dryRun) {
    console.log(
      JSON.stringify(
        {
          deletePrivate,
          createOrReplace: {
            services: publicServices.map(({ _id, serviceId, titleHu }) => ({
              _id,
              serviceId,
              titleHu,
            })),
            galleries: publicGalleries.map(({ _id, serviceId, title }) => ({
              _id,
              serviceId,
              title,
            })),
          },
          delete: deletePrivate ? privateIds : [],
        },
        null,
        2,
      ),
    );
    return;
  }

  let transaction = publicServices.reduce(
    (trx, document) => trx.createOrReplace(document),
    client.transaction(),
  );

  transaction = publicGalleries.reduce(
    (trx, document) => trx.createOrReplace(document),
    transaction,
  );

  if (deletePrivate) {
    transaction = privateIds.reduce((trx, id) => trx.delete(id), transaction);
  }

  await transaction.commit();

  console.log(
    `Created/updated ${publicServices.length} public service documents and ${publicGalleries.length} public gallery documents${
      deletePrivate ? ", then deleted the private dotted copies" : ""
    }.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
