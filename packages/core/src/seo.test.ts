import { describe, expect, it } from "vitest";
import { acortarSinPuntos, jsonLdColeccion, jsonLdFaq, jsonLdMigas, serializarJsonLd } from "./seo";

describe("acortarSinPuntos", () => {
  it("no toca los textos cortos", () => {
    expect(acortarSinPuntos("Alfombrillas 3D", 40)).toBe("Alfombrillas 3D");
  });
  it("corta en palabra, sin puntos suspensivos ni preposición colgando", () => {
    const t = acortarSinPuntos("Organizador de almacenamiento para la consola central inferior", 46);
    expect(t).not.toContain("…");
    expect(t.length).toBeLessThanOrEqual(46);
    expect(t).toBe("Organizador de almacenamiento para la consola");
    expect(acortarSinPuntos("Soporte de pantalla para el coche entero", 23)).toBe("Soporte de pantalla");
  });
});

describe("JSON-LD", () => {
  it("migas numera desde 1", () => {
    const j = jsonLdMigas([{ nombre: "Inicio", url: "https://x.es" }, { nombre: "A", url: "https://x.es/a" }]);
    expect(j.itemListElement.map((i) => i.position)).toEqual([1, 2]);
  });
  it("FAQ copia pregunta y respuesta", () => {
    const j = jsonLdFaq([{ pregunta: "¿Q?", respuesta: "R" }]);
    expect(j.mainEntity[0]!.acceptedAnswer.text).toBe("R");
  });
  it("colección no lleva Product ni AggregateOffer", () => {
    const j = jsonLdColeccion({ url: "u", nombre: "n", descripcion: "d", elementos: [{ nombre: "a", url: "ua" }] });
    expect(JSON.stringify(j)).not.toMatch(/AggregateOffer|"Product"/);
    expect(j.mainEntity.numberOfItems).toBe(1);
  });
  it("serializa sin cerrar el script", () => {
    expect(serializarJsonLd({ a: "</script>" })).not.toContain("</script>");
  });
});
