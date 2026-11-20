import { describe, expect, it } from "vitest";
import { fotoConAncho, urlFoto } from "./foto";

describe("fotoConAncho", () => {
  it("Amazon: cambia el modificador de tamaño o lo añade", () => {
    expect(fotoConAncho("https://m.media-amazon.com/images/I/61n8sLuvvrL._AC_SL1200_.jpg", 384)).toBe(
      "https://m.media-amazon.com/images/I/61n8sLuvvrL._AC_SL384_.jpg",
    );
    expect(fotoConAncho("https://m.media-amazon.com/images/I/61n8sLuvvrL.jpg", 640)).toBe(
      "https://m.media-amazon.com/images/I/61n8sLuvvrL._AC_SL640_.jpg",
    );
  });
  it("Shopify: añade width y conserva la versión", () => {
    expect(fotoConAncho("https://cdn.shopify.com/s/files/1/a.jpg?v=17", 256)).toBe("https://cdn.shopify.com/s/files/1/a.jpg?v=17&width=256");
  });
  it("otros: sin cambios", () => {
    expect(fotoConAncho("/icon.svg", 64)).toBe("/icon.svg");
  });
});

describe("urlFoto", () => {
  it("acepta Amazon y Shopify tal cual", () => {
    expect(urlFoto("https://m.media-amazon.com/images/I/61n8sLuvvrL._AC_SL1200_.jpg")).toBe(
      "https://m.media-amazon.com/images/I/61n8sLuvvrL._AC_SL1200_.jpg",
    );
    expect(urlFoto("https://cdn.shopify.com/s/files/1/0632/8080/8148/files/1.jpg?v=1731481582")).toBe(
      "https://cdn.shopify.com/s/files/1/0632/8080/8148/files/1.jpg?v=1731481582",
    );
  });

  it("desenvuelve el proxy wsrv.nl y devuelve la foto original", () => {
    expect(
      urlFoto(
        "https://wsrv.nl/?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2Ffoto.png&output=jpg&w=1080&h=1080&fit=contain&cbg=white&q=90",
      ),
    ).toBe("https://cdn.shopify.com/s/files/1/foto.png");
  });

  it("rechaza hosts desconocidos, http y basura", () => {
    expect(urlFoto("https://ejemplo.com/foto.jpg")).toBeNull();
    expect(urlFoto("http://m.media-amazon.com/images/I/x.jpg")).toBeNull();
    expect(urlFoto("https://wsrv.nl/?url=https%3A%2F%2Fejemplo.com%2Fx.jpg")).toBeNull();
    expect(urlFoto("no es url")).toBeNull();
    expect(urlFoto(undefined)).toBeNull();
  });
});
