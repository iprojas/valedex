import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const valemones = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/valemones" }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    country: z.string(),
    type: z.string(),
    image: z.string(),
    model: z.string().nullable(),
    order: z.number(),
  }),
});

export const collections = { valemones };
