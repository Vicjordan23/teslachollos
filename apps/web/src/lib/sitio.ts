/** URL pública de la web (sin barra final). Se cambia con NEXT_PUBLIC_SITIO cuando exista el dominio. */
export const SITIO = (process.env.NEXT_PUBLIC_SITIO ?? "https://chollesla.es").replace(/\/+$/, "");

/** Solo se permite indexar en Google cuando Vic lo active (NEXT_PUBLIC_INDEXAR=si), para que las pruebas no se indexen. */
export const INDEXAR = process.env.NEXT_PUBLIC_INDEXAR === "si";
