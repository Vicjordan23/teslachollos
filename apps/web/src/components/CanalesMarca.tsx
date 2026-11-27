import { CANALES_TIENDA } from "@/lib/telegram";

/** Botones a los canales de Telegram de cada tienda. */
export function CanalesMarca({ className = "" }: { className?: string }) {
  return (
    <nav aria-label="Canales de Telegram por tienda" className={`flex flex-wrap items-center gap-2 text-sm font-bold ${className}`}>
      <span>Canales por tienda:</span>
      {CANALES_TIENDA.map((c) => (
        <a key={c.id} href={c.url} target="_blank" rel="noopener" className="rounded-full bg-[#2aabee] px-3 py-1 text-white hover:brightness-110">
          {c.nombre}
        </a>
      ))}
    </nav>
  );
}
