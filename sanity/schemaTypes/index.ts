import { type SchemaTypeDefinition } from "sanity";
import { gallery } from "./gallery";
import { service } from "./service";
import { about } from "./about";
import { hero } from "./hero";

export const schemaTypes: SchemaTypeDefinition[] = [
  gallery,
  service,
  about,
  hero,
];
