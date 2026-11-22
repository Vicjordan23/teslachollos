"use client";

import { useEffect, useState } from "react";

/** Días de antigüedad a partir de los cuales se avisa de que el precio no se ha revisado. */
const DIAS_AVISO = 7;

function diasDesde(iso: string): number | null {
  const [a, m, d] = iso.split("-").map(Number);
  if (!a || !m || !d) return null;
  const hoy = new Date();
  return Math.round((Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()) - Date.UTC(a, m - 1, d)) / 86400000);
}

/** Solo aparece cuando el precio lleva más de una semana sin revisarse; con precios al día no se muestra nada. */
export function AvisoPrecio({ fecha, className = "" }: { fecha: string; className?: string }) {
  const [dias, setDias] = useState<number | null>(null);
  useEffect(() => setDias(diasDesde(fecha)), [fecha]);
  if (dias === null || dias <= DIAS_AVISO) return null;
  return (
    <span className={`flex items-center gap-1.5 rounded-md bg-ficha-aviso px-2.5 py-1.5 text-xs text-ficha-aviso-texto sm:text-sm ${className}`}>
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
      Precio sin revisar desde hace {dias} días
    </span>
  );
}
