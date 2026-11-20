"use client";

import { fotoConAncho } from "@chollesla/core";

// Cargador de next/image: las fotos se piden ya reducidas al CDN de la tienda (Amazon, Shopify).
// Así no hace falta el optimizador de Next ni Cloudflare Images (gratis en Cloudflare Workers).
export default function cargadorFotos({ src, width }: { src: string; width: number; quality?: number }): string {
  return fotoConAncho(src, width);
}
