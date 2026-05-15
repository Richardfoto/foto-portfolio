import { type SchemaTypeDefinition } from "sanity";
import { gallery } from "./gallery";
import { service } from "./service";
import { about } from "./about";
import { hero } from "./hero";
import { homeSessions } from "./homeSessions";
import { galleryWall } from "./galleryWall";
import { bookingSettings } from "./bookingSettings";
import { forgatasMenete } from "./forgatasMenete";

export const schemaTypes: SchemaTypeDefinition[] = [
  gallery,
  service,
  about,
  hero,
  homeSessions,
  galleryWall,
  bookingSettings,
  forgatasMenete,
];
