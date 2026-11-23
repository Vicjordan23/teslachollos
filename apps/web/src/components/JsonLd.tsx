import { serializarJsonLd } from "@chollesla/core";

/** Datos estructurados JSON-LD (se serializa a salvo de «</script>»). */
export function JsonLd({ datos }: { datos: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializarJsonLd(datos) }} />;
}
