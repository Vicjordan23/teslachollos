import { describe, expect, it } from "vitest";
import { categoriaDe } from "./categorias";

describe("categoriaDe", () => {
  it("clasifica títulos reales del catálogo", () => {
    expect(categoriaDe('Protector de pantalla mate Spigen EZ Fit (15,4")')).toBe("pantalla");
    expect(categoriaDe("Soporte giratorio para la pantalla central")).toBe("soportes");
    expect(categoriaDe("Wallbox 11 kW Tipo 2 trifásica")).toBe("carga");
    expect(categoriaDe("Alfombrillas de todo tiempo para Model Y Juniper (Jowua)")).toBe("alfombrillas");
    expect(categoriaDe("Organizador de almacenamiento para la consola central")).toBe("organizacion");
    expect(categoriaDe("Model 3/Y Carbon Fiber Steering Wheel D-Shaped")).toBe("volante");
    expect(categoriaDe("Ambient Lighting Kit for Model Y")).toBe("iluminacion");
    expect(categoriaDe("Alerón trasero de fibra de carbono")).toBe("exterior");
    expect(categoriaDe("Parasol de parabrisas para Model Y Juniper")).toBe("interior");
    expect(categoriaDe("Fundas de asiento de cuero")).toBe("asientos");
  });
  it("sin coincidencias va a Otros, y usa la descripción como respaldo", () => {
    expect(categoriaDe("Pack regalo Tesla")).toBe("otros");
    expect(categoriaDe("Pack regalo Tesla", "Incluye un organizador")).toBe("organizacion");
  });
});
