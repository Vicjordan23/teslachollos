import { TIENDAS, type IdTienda } from "./tiendas";

/** Formato de precios.json de Vic: { p: céntimos en tienda, d: 1 si es «desde», f: fecha ISO }. */
export interface PrecioTienda {
  p: number;
  d?: 0 | 1;
  f: string;
}

/** Precio final en céntimos tras el código de descuento de la tienda (misma regla que el agente de Telegram). */
export function precioFinal(precioTienda: number, tienda: IdTienda | null): number {
  const descuento = tienda ? TIENDAS[tienda].descuento : 0;
  return Math.floor(precioTienda * (1 - descuento) + 0.5);
}

/** 4199 → «41,99 €»; 123456 → «1.234,56 €». */
export function formatoEuros(centimos: number): string {
  const negativo = centimos < 0;
  const abs = Math.abs(Math.round(centimos));
  const euros = Math.floor(abs / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const cent = (abs % 100).toString().padStart(2, "0");
  return `${negativo ? "-" : ""}${euros},${cent} €`;
}

/** % de ahorro redondeado (0 si no hay precio anterior mayor). */
export function porcentajeAhorro(precioFinalCentimos: number, precioAnteriorCentimos: number | null | undefined): number {
  if (!precioAnteriorCentimos || precioAnteriorCentimos <= precioFinalCentimos) return 0;
  return Math.round((1 - precioFinalCentimos / precioAnteriorCentimos) * 100);
}
