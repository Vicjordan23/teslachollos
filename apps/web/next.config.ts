import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fotos reales de producto: solo de los hosts que acepta urlFoto() en @chollesla/core,
  // pedidas ya reducidas al CDN de cada tienda (src/lib/cargador-fotos.ts).
  images: {
    loader: "custom",
    loaderFile: "./src/lib/cargador-fotos.ts",
    remotePatterns: [
      { protocol: "https", hostname: "m.media-amazon.com", pathname: "/images/**" },
      { protocol: "https", hostname: "cdn.shopify.com", pathname: "/s/files/**" },
      { protocol: "https", hostname: "ae01.alicdn.com" },
      { protocol: "https", hostname: "ae-pic-a1.aliexpress-media.com" },
      { protocol: "https", hostname: "img.kwcdn.com" },
    ],
  },
  // Sin cacheComponents: OpenNext aún no lo soporta del todo en Cloudflare, y la web es estática.
  // Así las rutas dinámicas pueden usar dynamicParams = false (404 reales).
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
