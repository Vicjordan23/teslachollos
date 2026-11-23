/** Utilidades de SEO puras (sin React ni Next) para poder probarlas: títulos, metas y datos estructurados. */

/** Recorta a `max` caracteres sin partir palabras y SIN puntos suspensivos (los títulos con «…» quedan feos en Google). */
export function acortarSinPuntos(texto: string, max: number): string {
  const t = texto.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const corte = t.slice(0, max);
  const ultimo = corte.lastIndexOf(" ");
  const base = ultimo > max * 0.5 ? corte.slice(0, ultimo) : corte;
  return base.replace(/[\s,.;:\-–(\[]+$/, "").replace(/\b(de|del|la|el|los|las|para|con|y|e|en|a|por|un|una)$/i, "").trim();
}

export interface Miga {
  nombre: string;
  /** URL absoluta. */
  url: string;
}

export function jsonLdMigas(migas: Miga[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: migas.map((m, i) => ({ "@type": "ListItem", position: i + 1, name: m.nombre, item: m.url })),
  };
}

export interface PreguntaFrecuente {
  pregunta: string;
  respuesta: string;
}

/** Solo debe usarse con preguntas que se ven en la página, con el mismo texto. */
export function jsonLdFaq(preguntas: PreguntaFrecuente[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: preguntas.map((p) => ({
      "@type": "Question",
      name: p.pregunta,
      acceptedAnswer: { "@type": "Answer", text: p.respuesta },
    })),
  };
}

export interface ElementoLista {
  nombre: string;
  /** URL absoluta de la ficha. */
  url: string;
}

/**
 * Página de listado: CollectionPage con ItemList de fichas. No se marca como Product ni con AggregateOffer: un listado
 * mezcla productos distintos, y AggregateOffer solo vale para ofertas reales del MISMO producto.
 */
export function jsonLdColeccion(datos: { url: string; nombre: string; descripcion: string; elementos: ElementoLista[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: datos.nombre,
    description: datos.descripcion,
    url: datos.url,
    inLanguage: "es-ES",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: datos.elementos.length,
      itemListElement: datos.elementos.map((e, i) => ({ "@type": "ListItem", position: i + 1, url: e.url, name: e.nombre })),
    },
  };
}

/** Serializa JSON-LD para incrustarlo en un <script>: evita que un «<» cierre la etiqueta. */
export function serializarJsonLd(datos: unknown): string {
  return JSON.stringify(datos).replace(/</g, "\\u003c");
}
