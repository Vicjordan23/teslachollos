import type { MetadataRoute } from "next";
import { INDEXAR, SITIO } from "@/lib/sitio";

export default function robots(): MetadataRoute.Robots {
  if (!INDEXAR) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/ir/", "/buscar", "/api/", "/admin/", "/auth/", "/cuenta", "/entrar", "/guardados", "/publicar"] }, sitemap: `${SITIO}/sitemap.xml` };
}
