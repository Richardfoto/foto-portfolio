import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import {
  featuredSessionServices,
  photographyServices,
  type PhotographyService,
} from "@/lib/photography-content";

type ServiceStatus = {
  serviceId?: string;
  inactive?: boolean;
};

const activeServicesQuery = groq`*[
  _type == "service" &&
  defined(serviceId) &&
  !(_id in path("drafts.**"))
]{
  serviceId,
  inactive
}`;

export async function getActivePhotographyServices(): Promise<PhotographyService[]> {
  const statuses = await client.fetch<ServiceStatus[]>(activeServicesQuery);
  const activeById = new Map(
    statuses
      .filter((status) => status.serviceId)
      .map((status) => [status.serviceId, status.inactive !== true]),
  );

  const activeBaseServices = photographyServices.filter(
    (service) => activeById.get(service.id) !== false,
  );
  const activeFeaturedServices = featuredSessionServices.filter(
    (service) => activeById.get(service.id) !== false,
  );

  return [...activeFeaturedServices, ...activeBaseServices];
}
