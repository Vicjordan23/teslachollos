"use client";

import { usePathname, useRouter } from "next/navigation";
import { alternarGuardado, useChollo, useEstado, votar } from "@/lib/interacciones";

function useAEntrar() {
  const router = useRouter();
  const ruta = usePathname();
  const { sesion } = useEstado();
  // Con sesión pero sin alias, a /cuenta para elegirlo.
  return () => router.push(sesion ? "/cuenta" : `/entrar?volver=${encodeURIComponent(ruta)}`);
}

const FLECHA = "size-3.5";

/** Temperatura con votar a favor o en contra (necesita cuenta). */
export function Temperatura({ slug }: { slug: string }) {
  const c = useChollo(slug);
  const aEntrar = useAEntrar();
  const t = c?.temperatura ?? 0;
  const color = t < 0 ? "text-ficha-frio" : t >= 100 ? "text-ficha-calor" : "text-ficha-suave";
  const pulsar = async (valor: 1 | -1) => {
    if (!(await votar(slug, valor))) aEntrar();
  };
  const boton = (activo: boolean, borde: string, relleno: string) =>
    `grid size-7 place-items-center rounded-full border-2 ${borde} ${activo ? `${relleno} text-ficha` : ""}`;
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-ficha-chip p-1">
      <button
        type="button"
        onClick={() => pulsar(-1)}
        aria-label="Voto negativo: está frío"
        aria-pressed={c?.voto === -1}
        className={`${boton(c?.voto === -1, "border-ficha-frio", "bg-ficha-frio")} ${c?.voto === -1 ? "" : "text-ficha-frio"}`}
      >
        <svg viewBox="0 0 24 24" className={FLECHA} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 5v14M6 13l6 6 6-6" />
        </svg>
      </button>
      <span className={`min-w-10 text-center text-base font-bold ${color}`} aria-live="polite">
        {t}°
      </span>
      <button
        type="button"
        onClick={() => pulsar(1)}
        aria-label="Voto positivo: está caliente"
        aria-pressed={c?.voto === 1}
        className={`${boton(c?.voto === 1, "border-ficha-calor", "bg-ficha-calor")} ${c?.voto === 1 ? "" : "text-ficha-calor"}`}
      >
        <svg viewBox="0 0 24 24" className={FLECHA} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 19V5M6 11l6-6 6 6" />
        </svg>
      </button>
    </div>
  );
}

/** Botón de guardar (marcador). */
export function Guardar({ slug, claro = false }: { slug: string; claro?: boolean }) {
  const c = useChollo(slug);
  const aEntrar = useAEntrar();
  const activo = c?.guardado ?? false;
  return (
    <button
      type="button"
      onClick={async () => {
        if (!(await alternarGuardado(slug))) aEntrar();
      }}
      title={activo ? "Quitar de guardados" : "Guardar"}
      aria-label={activo ? "Quitar de guardados" : "Guardar"}
      aria-pressed={activo}
      className={claro ? "text-texto-suave hover:text-texto" : `${activo ? "text-ficha-precio" : "text-ficha-suave"} hover:text-ficha-texto`}
    >
      <svg viewBox="0 0 24 24" className="size-6" fill={activo ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
        <path d="M6 3h12v18l-6-4-6 4z" />
      </svg>
    </button>
  );
}
