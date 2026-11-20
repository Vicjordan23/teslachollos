import { describe, expect, it } from "vitest";
import { eurosACentimos, prepararPublicacion, slugComunidad } from "./publicar";

describe("eurosACentimos", () => {
  it("entiende los formatos españoles", () => {
    expect(eurosACentimos("39,99")).toBe(3999);
    expect(eurosACentimos("39.99")).toBe(3999);
    expect(eurosACentimos("1.234,5 €")).toBe(123450);
    expect(eurosACentimos("12")).toBe(1200);
    expect(eurosACentimos("0")).toBeNull();
    expect(eurosACentimos("doce")).toBeNull();
  });
});

describe("prepararPublicacion", () => {
  const base = { titulo: "Wallbox de 11 kW", precio: "100" };
  it("pone el afiliado de Vic y aplica su código", () => {
    const r = prepararPublicacion({ ...base, enlace: "https://www.hansshow.com/products/x?bg_ref=OTRO" });
    expect(r.ok).toBe(true);
    if (r.ok !== true) return;
    expect(r.chollo.enlace).toContain("bg_ref=nBeGMuizu9");
    expect(r.chollo.enlace).not.toContain("OTRO");
    expect(r.chollo.precio_final).toBe(8000);
    expect(r.chollo.categoria).toBe("carga");
  });
  it("Amazon con /dp/ y su tag", () => {
    const r = prepararPublicacion({ ...base, enlace: "https://www.amazon.es/dp/B0GY6GB73J?tag=otro-21" });
    expect(r.ok === true && r.chollo.enlace).toBe("https://www.amazon.es/dp/B0GY6GB73J?tag=teslaaccesorios-21");
    expect(prepararPublicacion({ ...base, enlace: "https://www.amazon.es/s?k=tesla" }).ok).toBe(false);
  });
  it("AliExpress y Tesla se aceptan limpios; otras tiendas no", () => {
    const ali = prepararPublicacion({ ...base, enlace: "https://es.aliexpress.com/item/100500.html?aff_id=x&utm_source=y" });
    expect(ali.ok === true && ali.chollo.enlace).toBe("https://es.aliexpress.com/item/100500.html");
    expect(prepararPublicacion({ ...base, enlace: "https://tienda-rara.com/x" }).ok).toBe(false);
  });
  it("los acortadores se resuelven en el servidor", () => {
    expect(prepararPublicacion({ ...base, enlace: "https://amzn.eu/d/abc" })).toEqual({ ok: "resolver" });
  });
  it("valida título y precio", () => {
    expect(prepararPublicacion({ titulo: "abc", precio: "1", enlace: "https://www.amazon.es/dp/B0GY6GB73J" }).ok).toBe(false);
    expect(prepararPublicacion({ ...base, precio: "gratis", enlace: "https://www.amazon.es/dp/B0GY6GB73J" }).ok).toBe(false);
  });
});

describe("slugComunidad", () => {
  it("cumple el formato de la base de datos", () => {
    expect(slugComunidad("Funda de llave ¡Oferta!", "Ab3x9")).toBe("funda-de-llave-oferta-ab3x9");
    expect(slugComunidad("!!!", "z1")).toBe("chollo-z1");
  });
});
