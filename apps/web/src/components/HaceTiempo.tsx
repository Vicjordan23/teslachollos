"use client";

import { useEffect, useState } from "react";

function textoHace(iso: string): string | null {
  const [a, m, d] = iso.split("-").map(Number);
  if (!a || !m || !d) return null;
  const hoy = new Date();
  const dias = Math.round((Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()) - Date.UTC(a, m - 1, d)) / 86400000);
  if (dias <= 0) return "hoy";
  if (dias === 1) return "ayer";
  if (dias < 14) return `hace ${dias} días`;
  if (dias < 60) return `hace ${Math.floor(dias / 7)} semanas`;
  return `hace ${Math.floor(dias / 30)} meses`;
}

/** «Precio de hoy / hace 3 días…» a partir de la fecha del precio. Hasta que carga en el navegador muestra la fecha. */
export function HaceTiempo({ fecha, alternativa }: { fecha: string; alternativa: string }) {
  const [texto, setTexto] = useState<string | null>(null);
  useEffect(() => setTexto(textoHace(fecha)), [fecha]);
  return (
    <time dateTime={fecha} title={alternativa}>
      {texto ?? alternativa}
    </time>
  );
}
