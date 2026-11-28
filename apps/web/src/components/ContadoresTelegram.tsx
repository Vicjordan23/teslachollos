"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CANALES_TIENDA, TELEGRAM } from "@/lib/telegram";

type Cifras = Record<string, number | null>;

// Una sola petición aunque la usen varios componentes.
let peticion: Promise<Cifras> | null = null;
function pedir(): Promise<Cifras> {
  peticion ??= fetch("/api/telegram")
    .then((r) => (r.ok ? r.json() : { suscriptores: {} }))
    .then((j: { suscriptores: Cifras }) => j.suscriptores)
    .catch(() => ({}));
  return peticion;
}

function useSuscriptores(): Cifras {
  const [cifras, setCifras] = useState<Cifras>({});
  useEffect(() => {
    pedir().then(setCifras);
  }, []);
  return cifras;
}

const numero = (n: number) => n.toLocaleString("es-ES");

/** Contador grande del canal principal, encima de la franja azul. */
export function ContadorPrincipal() {
  const n = useSuscriptores().principal;
  return (
    <a href={TELEGRAM} target="_blank" rel="noopener" className="flex min-h-14 flex-wrap items-baseline justify-center gap-x-3 bg-[#0b1620] px-4 py-2 text-center text-white">
      <span className="font-display text-2xl font-bold uppercase tracking-wide sm:text-4xl">
        Ya somos <strong className="font-bold tabular-nums text-[#2aabee]">{typeof n === "number" ? numero(n) : "…"}</strong>
      </span>
      <span className="text-sm font-medium opacity-90 sm:text-lg">en el canal de Telegram de Chollesla</span>
    </a>
  );
}

/** Noticiario: un canal por tienda que pasa de derecha a izquierda. La segunda tira es la copia que cierra el bucle. */
export function CintaCanales() {
  const cifras = useSuscriptores();
  const tira = (copia: boolean) => (
    <ul className="cinta-tira" aria-hidden={copia || undefined}>
      {CANALES_TIENDA.map((c) => {
        const n = cifras[c.id];
        return (
          <li key={c.id}>
            <a href={c.url} target="_blank" rel="noopener" tabIndex={copia ? -1 : undefined} className="flex items-center gap-2 whitespace-nowrap px-5 py-1.5 text-sm hover:underline">
              <Image src={`/canales/${c.id}.webp`} alt="" width={44} height={44} unoptimized className="size-11 rounded-full bg-white" />
              <span>
                Canal de {c.nombre} en Telegram: <b className="text-[#2aabee]">@{c.url.split("/").pop()}</b>
                {typeof n === "number" && (
                  <span className="ml-2 tabular-nums text-texto-suave">
                    👥 {numero(n)} {n === 1 ? "suscriptor" : "suscriptores"}
                  </span>
                )}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
  return (
    <section aria-label="Tenemos un canal de Telegram por cada tienda" className="cinta border-b border-borde bg-superficie text-texto">
      <div className="cinta-pista">
        {tira(false)}
        {tira(true)}
      </div>
    </section>
  );
}
