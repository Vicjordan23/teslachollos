import { TIENDAS, type IdTienda } from "@chollesla/core";

/** Canal principal: todas las tiendas, un chollo cada 30 minutos. */
export const TELEGRAM = "https://t.me/teslaaccesorios";

/** Canales por tienda (27/11/2026): cada uno publica solo su tienda cada 30 minutos. */
const USUARIOS: Record<IdTienda, string> = {
  amazon: "CholleslaAmzn", // Amazon no admite «amazon» en la dirección
  aliexpress: "CholleslaAliExpress",
  hansshow: "CholleslaHansshow",
  jowua: "CholleslaJowua",
  tesery: "CholleslaTesery",
  temu: "CholleslaTemu",
  yeslak: "CholleslaYeslak",
};

export const canalDe = (tienda: IdTienda) => `https://t.me/${USUARIOS[tienda]}`;

export const CANALES_TIENDA = (Object.keys(USUARIOS) as IdTienda[]).map((id) => ({
  id,
  nombre: TIENDAS[id].nombre.replace(".es", ""),
  url: canalDe(id),
}));
