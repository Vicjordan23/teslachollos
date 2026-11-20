import Link from "next/link";
import { TIENDAS, type IdTienda } from "@chollesla/core";
import { chollosDeTienda } from "@/datos/chollos";

export function ChipsTiendas({ activa }: { activa?: IdTienda }) {
  return (
    <nav aria-label="Tiendas" className="flex flex-wrap gap-2 text-sm">
      <Link
        href="/"
        className={`rounded-full px-3 py-1.5 ${!activa ? "bg-negro text-white dark:bg-white dark:text-negro" : "border border-black/10 dark:border-white/15"}`}
      >
        Todas
      </Link>
      {Object.values(TIENDAS).map((t) => (
        <Link
          key={t.id}
          href={`/tienda/${t.id}`}
          aria-current={activa === t.id ? "page" : undefined}
          className={`rounded-full px-3 py-1.5 ${activa === t.id ? "bg-negro text-white dark:bg-white dark:text-negro" : "border border-black/10 dark:border-white/15"}`}
        >
          {t.nombre} <span className="opacity-60">{chollosDeTienda(t.id).length}</span>
        </Link>
      ))}
    </nav>
  );
}
