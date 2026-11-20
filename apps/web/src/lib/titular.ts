/**
 * Datos del titular de la web (LSSI art. 10). No se guardan en el repositorio: Vic los pone como variables de build
 * en Cloudflare (Workers → chollesla → Settings → Build → Variables). Mientras falten, las páginas legales lo indican.
 */
export const TITULAR = {
  nombre: process.env.NEXT_PUBLIC_TITULAR_NOMBRE?.trim() || null,
  nif: process.env.NEXT_PUBLIC_TITULAR_NIF?.trim() || null,
  direccion: process.env.NEXT_PUBLIC_TITULAR_DIRECCION?.trim() || null,
  email: process.env.NEXT_PUBLIC_TITULAR_EMAIL?.trim() || null,
};

export const ACTUALIZADO = "20/11/2026";
