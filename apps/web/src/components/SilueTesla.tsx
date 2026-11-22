/** Silueta lateral del Model 3 (berlina) o del Model Y (más alto, con el techo cayendo hasta atrás) para distinguirlos de un vistazo. */
export function SilueTesla({ modelo, className = "h-6 w-14" }: { modelo: string; className?: string }) {
  const y = modelo === "model-y";
  return (
    <svg viewBox="0 0 124 48" className={className} fill="currentColor" aria-hidden>
      <path
        d={
          y
            ? "M6 34 C6 29 10 27 20 26 L36 13 C44 8 80 7 94 12 C102 15 110 24 114 28 C118 29 119 31 119 34 L119 37 L6 37 Z"
            : "M6 34 C6 30 10 28 20 27 L40 17 C48 12 72 11 86 14 C98 17 108 24 114 28 C118 29 119 31 119 34 L119 37 L6 37 Z"
        }
      />
      <circle cx="29" cy="37" r="8" className="fill-fondo stroke-current" strokeWidth="3" />
      <circle cx="97" cy="37" r="8" className="fill-fondo stroke-current" strokeWidth="3" />
    </svg>
  );
}
