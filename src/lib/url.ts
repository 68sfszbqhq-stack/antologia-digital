/**
 * Antepone el `base` configurado en astro.config.mjs a una ruta interna.
 *
 * En local `base` es "/antologia-digital" igual que en producción, así que lo
 * que ves al desarrollar es lo que se publica. Úsalo en TODO href interno:
 * un `href="/sesion/1"` escrito a mano da 404 en GitHub Pages.
 */
export function u(path: string): string {
  if (!path.startsWith("/")) return path;
  const base = import.meta.env.BASE_URL.replace(/\/+$/, "");
  return `${base}${path}`;
}
