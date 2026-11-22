"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/** Contenedor de Google Tag Manager (analítica). Solo se carga si la persona lo acepta. */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-T78HDVK3";
const CLAVE = "chollesla-analitica";

function leer(): string | null {
  try {
    return localStorage.getItem(CLAVE);
  } catch {
    return null;
  }
}

function cargarGtm() {
  if (document.getElementById("gtm-script")) return;
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const s = document.createElement("script");
  s.id = "gtm-script";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(s);
}

export function Analitica() {
  const [decidido, setDecidido] = useState(true); // true = no se muestra el aviso hasta saber qué hay guardado

  useEffect(() => {
    const guardado = leer();
    if (guardado === "si") cargarGtm();
    setDecidido(guardado !== null);
  }, []);

  useEffect(() => {
    // Evento para Google Analytics (vía Tag Manager) cuando alguien pulsa «Ir al chollo». Solo se envía si aceptó las cookies.
    const alPulsar = (e: MouseEvent) => {
      const enlace = (e.target as Element | null)?.closest?.("a[data-ir-slug]") as HTMLAnchorElement | null;
      if (!enlace || leer() !== "si") return;
      const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
      w.dataLayer = w.dataLayer ?? [];
      w.dataLayer.push({
        event: "ir_al_chollo",
        chollo_slug: enlace.dataset.irSlug,
        chollo_titulo: enlace.dataset.irTitulo,
        tienda: enlace.dataset.irTienda,
      });
    };
    document.addEventListener("click", alPulsar);
    return () => document.removeEventListener("click", alPulsar);
  }, []);

  function decidir(valor: "si" | "no") {
    try {
      localStorage.setItem(CLAVE, valor);
    } catch {
      /* sin almacenamiento: se aplica solo en esta visita */
    }
    if (valor === "si") cargarGtm();
    setDecidido(true);
  }

  if (decidido) return null;

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies de analítica"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-borde bg-superficie px-4 py-4 shadow-2xl"
    >
      <div className="mx-auto flex max-w-[1250px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-texto">
          Usamos Google Analytics para saber cuántas personas visitan la web y qué chollos interesan. Solo se activa si lo
          aceptas.{" "}
          <Link href="/cookies" className="underline">
            Más información
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decidir("no")}
            className="rounded border border-borde px-4 py-2 text-sm font-bold hover:bg-fondo"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={() => decidir("si")}
            className="rounded bg-[#ff3d1f] px-4 py-2 text-sm font-bold text-white hover:brightness-110"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
