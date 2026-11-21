"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const ABIERTOS = "header details[open], nav[aria-label='Menú principal'] details[open]";

/** Cierra los menús desplegables (<details>) de la cabecera al elegir una opción (cambio de ruta o de filtros),
 *  al pulsar un enlace dentro del menú y al hacer clic fuera. El layout no se remonta al navegar,
 *  así que sin esto el menú se quedaba abierto. */
export function CierraMenus() {
  const ruta = usePathname();
  const consulta = useSearchParams().toString();

  useEffect(() => {
    document.querySelectorAll<HTMLDetailsElement>(ABIERTOS).forEach((d) => d.removeAttribute("open"));
  }, [ruta, consulta]);

  useEffect(() => {
    const alPulsar = (e: Event) => {
      const destino = e.target as Element | null;
      document.querySelectorAll<HTMLDetailsElement>(ABIERTOS).forEach((d) => {
        if (!destino || !d.contains(destino)) d.removeAttribute("open");
      });
    };
    const alElegir = (e: Event) => {
      const enlace = (e.target as Element | null)?.closest?.("details a[href]");
      if (enlace) enlace.closest("details")?.removeAttribute("open");
    };
    document.addEventListener("pointerdown", alPulsar);
    document.addEventListener("click", alElegir);
    return () => {
      document.removeEventListener("pointerdown", alPulsar);
      document.removeEventListener("click", alElegir);
    };
  }, []);

  return null;
}
