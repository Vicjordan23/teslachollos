import type { MetadataRoute } from "next";
import { CATEGORIAS, MODELOS, TIENDAS } from "@chollesla/core";
import { CHOLLOS } from "@/datos/chollos";
import { SITIO } from "@/lib/sitio";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITIO}/`, changeFrequency: "daily", priority: 1 },
    ...MODELOS.map((m) => ({ url: `${SITIO}/modelo/${m.id}`, changeFrequency: "daily" as const, priority: 0.8 })),
    ...CATEGORIAS.map((c) => ({ url: `${SITIO}/categoria/${c.id}`, changeFrequency: "daily" as const, priority: 0.8 })),
    ...Object.keys(TIENDAS).map((t) => ({ url: `${SITIO}/tienda/${t}`, changeFrequency: "weekly" as const, priority: 0.6 })),
    { url: `${SITIO}/comunidad`, changeFrequency: "daily" as const, priority: 0.5 },
    ...CHOLLOS.map((c) => ({ url: `${SITIO}/chollo/${c.slug}`, lastModified: c.fecha, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
