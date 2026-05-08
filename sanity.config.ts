"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

// Fontos: a sanity/ mappán belül vannak a fájlok
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { featuredServicePresets } from "./sanity/servicePresets";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev,
      ...featuredServicePresets.map((service) => ({
        id: service.id,
        title: service.title,
        schemaType: "service",
        value: {
          serviceId: service.serviceId,
          order: service.order,
          inactive: false,
          anchor: service.anchor,
          featured: true,
          titleHu: service.titleHu,
          titleEn: service.titleEn,
          shortTitleHu: service.shortTitleHu,
          shortTitleEn: service.shortTitleEn,
          descriptionHu: service.descriptionHu,
          descriptionEn: service.descriptionEn,
          ctaHu: service.ctaHu,
          ctaEn: service.ctaEn,
          captionsHu: service.captionsHu,
          captionsEn: service.captionsEn,
          keywordsHu: service.keywordsHu,
          keywordsEn: service.keywordsEn,
        },
      })),
    ],
  },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
