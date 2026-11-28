/**
 * Navegadores del propietario que no deben contar como visitas ni como clics.
 * Se marca visitando cualquier página con `?medir=no` (se deshace con `?medir=si`).
 */
export const NO_MEDIR = "chollesla-no-medir";

export function cookieNoMedir(cookie: string | null): boolean {
  return !!cookie && cookie.split(";").some((c) => c.trim() === `${NO_MEDIR}=1`);
}
