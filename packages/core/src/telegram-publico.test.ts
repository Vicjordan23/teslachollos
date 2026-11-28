import { describe, expect, it } from "vitest";
import { leerSuscriptores, leerVistas } from "./telegram-publico";

describe("datos públicos de Telegram", () => {
  it("resta a Vic y al bot", () => {
    expect(leerSuscriptores('<div class="tgme_page_extra">48 subscribers</div>')).toBe(46);
    expect(leerSuscriptores('<div class="tgme_page_extra">1 234 subscribers</div>')).toBe(1232);
  });
  it("nunca baja de cero y reconoce la falta de dato", () => {
    expect(leerSuscriptores('<div class="tgme_page_extra">1 subscriber</div>')).toBe(0);
    expect(leerSuscriptores('<div class="tgme_page_extra">@canal</div>')).toBeNull();
  });
  it("lee las vistas con sufijos", () => {
    const html = '<span class="tgme_widget_message_views">12</span><span class="tgme_widget_message_views">1.2K</span>';
    expect(leerVistas(html)).toEqual([12, 1200]);
  });
});
