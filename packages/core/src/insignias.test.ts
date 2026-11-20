import { describe, expect, it } from "vitest";
import { insigniasDe, nivelDe } from "./insignias";

const base = { chollos: 0, grados: 0, votos_dados: 0, reportes_utiles: 0, creado: "2026-11-01T00:00:00Z" };
const ahora = Date.parse("2026-11-20T00:00:00Z");

describe("insignias", () => {
  it("sin actividad no hay insignias", () => {
    expect(insigniasDe(base, ahora)).toEqual([]);
  });
  it("se ganan por umbrales reales", () => {
    const ids = insigniasDe({ ...base, chollos: 12, grados: 150, votos_dados: 60, creado: "2025-10-01T00:00:00Z" }, ahora).map((i) => i.id);
    expect(ids).toEqual(["primer-chollo", "cazachollos", "en-llamas", "votante", "veterano"]);
  });
});

describe("niveles", () => {
  it("calcula puntos y nivel", () => {
    expect(nivelDe(base)).toEqual({ nivel: 1, nombre: "Novato", puntos: 0, siguiente: 50 });
    expect(nivelDe({ ...base, chollos: 20, grados: 60 })).toEqual({ nivel: 3, nombre: "Experto", puntos: 260, siguiente: 1000 });
    expect(nivelDe({ ...base, chollos: 5 }).nombre).toBe("Aficionado");
  });
  it("la temperatura negativa no baja de 0 puntos", () => {
    expect(nivelDe({ ...base, grados: -500 }).puntos).toBe(0);
  });
});
