// Configuración de OpenNext para Cloudflare Workers.
// La web es estática (todas las páginas se generan en el build), así que la caché se sirve
// desde los archivos estáticos del propio Worker: no hace falta R2 ni KV.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
