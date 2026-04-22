import { type SchemaTypeDefinition } from "sanity";
import { gallery } from "./gallery";
import { service } from "./service";
import { about } from "./about";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [gallery, service, about],
};
