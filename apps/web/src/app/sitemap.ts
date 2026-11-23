import type { MetadataRoute } from "next";
import { CATEGORIAS, MODELOS_WEB, TIENDAS } from "@chollesla/core";
import { CHOLLOS, chollosDeCategoria, chollosDeVersionCategoria, ULTIMA_REVISION } from "@/datos/chollos";
import { fichaIndexable } from "@/datos/textos";
import { HUBS_VERSION, IDS_CODIGOS } from "@/lib/contenido";
import { SITIO } from "@/lib/sitio";

/** Mismo mínimo que `app/modelo/[modelo]/[categoria]`: solo se listan las páginas que existen. */
const MINIMO_VERSION_CATEGORIA = 8;

/** Solo URL indexables y con 200: lo que está en `noindex` o da 404 no entra. `lastModified` = fecha real de los datos. */
export default function sitemap(): MetadataRoute.Sitemap {
  const revision = ULTIMA_REVISION;
  const hubsVersion = Object.values(HUBS_VERSION);
  return [
    { url: `${SITIO}/`, lastModified: revision, changeFrequency: "daily", priority: 1 },
    { url: `${SITIO}/chollos-tesla-esta-semana`, lastModified: revision, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITIO}/codigos-descuento`, lastModified: revision, changeFrequency: "weekly", priority: 0.9 },
    ...IDS_CODIGOS.map((t) => ({ url: `${SITIO}/codigos-descuento/${t}`, lastModified: revision, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...hubsVersion.map((h) => ({ url: `${SITIO}/modelo/${h.version}`, lastModified: revision, changeFrequency: "daily" as const, priority: 0.9 })),
    ...hubsVersion.flatMap((h) =>
      CATEGORIAS.filter((c) => c.id !== "otros" && chollosDeVersionCategoria(h.version, c.id).length >= MINIMO_VERSION_CATEGORIA).map((c) => ({
        url: `${SITIO}/modelo/${h.version}/${c.id}`,
        lastModified: revision,
        changeFrequency: "daily" as const,
        priority: 0.8,
      })),
    ),
    ...MODELOS_WEB.map((m) => ({ url: `${SITIO}/modelo/${m.id}`, lastModified: revision, changeFrequency: "daily" as const, priority: 0.8 })),
    ...CATEGORIAS.filter((c) => chollosDeCategoria(c.id).length > 0).map((c) => ({ url: `${SITIO}/categoria/${c.id}`, lastModified: revision, changeFrequency: "daily" as const, priority: 0.7 })),
    ...Object.keys(TIENDAS).map((t) => ({ url: `${SITIO}/tienda/${t}`, lastModified: revision, changeFrequency: "weekly" as const, priority: 0.5 })),
    { url: `${SITIO}/comunidad`, changeFrequency: "daily" as const, priority: 0.4 },
    ...CHOLLOS.filter(fichaIndexable).map((c) => ({ url: `${SITIO}/chollo/${c.slug}`, lastModified: c.fecha, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
