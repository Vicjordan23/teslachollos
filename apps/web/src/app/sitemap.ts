import type { MetadataRoute } from "next";
import { CATEGORIAS } from "@chollesla/core";
import { CHOLLOS } from "@/datos/chollos";
import { SITIO } from "@/lib/sitio";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITIO}/`, changeFrequency: "daily", priority: 1 },
    ...CATEGORIAS.map((c) => ({ url: `${SITIO}/categoria/${c.id}`, changeFrequency: "daily" as const, priority: 0.8 })),
    ...CHOLLOS.map((c) => ({ url: `${SITIO}/chollo/${c.slug}`, lastModified: c.fecha, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
