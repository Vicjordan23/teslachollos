"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Cierra los menús desplegables (<details>) de la cabecera al elegir una opción
 *  (cambio de ruta) y al hacer clic fuera de ellos. El layout no se remonta al navegar,
 *  así que sin esto el menú se quedaba abierto. */
export function CierraMenus() {
  const ruta = usePathname();

  useEffect(() => {
    document.querySelectorAll<HTMLDetailsElement>("nav[aria-label='Menú principal'] details[open]").forEach((d) => d.removeAttribute("open"));
  }, [ruta]);

  useEffect(() => {
    const fuera = (e: Event) => {
      const destino = e.target as Node | null;
      document.querySelectorAll<HTMLDetailsElement>("nav[aria-label='Menú principal'] details[open]").forEach((d) => {
        if (!destino || !d.contains(destino)) d.removeAttribute("open");
      });
    };
    document.addEventListener("pointerdown", fuera);
    return () => document.removeEventListener("pointerdown", fuera);
  }, []);

  return null;
}
