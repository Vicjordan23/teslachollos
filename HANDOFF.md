# HANDOFF

## 20/11/2026 (3): nombre, logo y comunidad

**Decidido:** nombre **Chollesla** · logo (boceto de Vic) · la comunidad publica gratis con el afiliado de Vic · buscar más programas de afiliados.

**Hecho:** logo redibujado en SVG (`marca/`).

**REA:** el primer intento (`npx rea-agents@6.10.1 inspect-web-page`) se cortó a los 5 minutos sin datos. Un aviso anterior a Vic decía por error que había terminado bien; corregido. Se instaló aparte en el scratchpad (`npm install rea-agents@6.10.1`, sin `setup` y sin scripts nativos), pero **se niega a ejecutarse**: exige Node ≥ 24.22.1 y el PC tiene 24.21.0. Falta el permiso de Vic para descargar un Node nuevo (portable o actualización).

**Pendiente de Vic:** comprar `chollesla.es` y `chollesla.com` (y buscar antes la marca en OEPM y EUIPO).

## 20/11/2026 (4): Fase 1, esqueleto (hecho y probado en local)

- Monorepo npm workspaces: `apps/web` (Next.js 16.4.6, React 19, Tailwind 4, App Router, `src/`) + `packages/core` (`@chollesla/core`).
- `packages/core`: tiendas de Vic con dominios y descuentos; `aplicarAfiliado()` pone el afiliado de Vic y quita los ajenos (Amazon `/dp/ASIN?tag=`, Hansshow `bg_ref`, Jowua `ghref`+`discount`, Tesery `/es-es/`+GoAffPro, EVDANCE envuelto en Awin); limpia afiliados y `utm` en otras tiendas; marca los acortadores para resolverlos en el servidor; rechaza URLs no web o con credenciales. También `avisoAfiliado()` (texto literal de Amazon), `precioFinal()` (misma regla que `publicar_siguiente.py`), `formatoEuros()` y `porcentajeAhorro()`. **15 tests en verde.**
- Web: portada provisional con la marca (icono SVG, Fredoka, rojo y negro, tema claro y oscuro) y una ficha de ejemplo real que usa `@chollesla/core`. Probada a 375 px sin scroll horizontal. Pie: «no es una web oficial de Tesla».
- CI: `.github/workflows/ci.yml` (Node 24: `npm ci`, test, build, lint).
- Comprobado en local: `npm test`, `npm run build`, `npm run lint`, `npm run typecheck`.

## 20/11/2026 (5): REA funcionando y foto en las tarjetas

- **REA:** con el OK de Vic se descargó Node portable 24.22.3 de nodejs.org (SHA-256 verificado) en el scratchpad; el Node del sistema no se tocó. Se ejecutó `inspect-web-page` (DOM y accesibilidad) sobre la portada pública de Chollometro en un Chrome aislado → `docs/FUNCIONES_OBSERVADAS.md`. Sin bundles, sin API y sin copiar contenidos. No se capturó ninguna ficha individual (REA filtra los enlaces).
- **Foto del producto en cada tarjeta** (petición de Vic): `urlFoto()` en core (solo `m.media-amazon.com` y `cdn.shopify.com`; desenvuelve el proxy `wsrv.nl` del catálogo antiguo) + `images.remotePatterns` en `next.config.ts` + componente `TarjetaChollo`, con foto, tienda, precio final, precio en tienda tachado, código y aviso. 18 tests en verde. Probado en el navegador: las fotos de Amazon y de Shopify cargan.
- Riesgo ya avisado: las fotos de Amazon son de terceros; lo correcto a medio plazo es la API de Amazon (PA-API).

## 20/11/2026 (6): catálogo importado, web con 1.594 chollos y esquema de Supabase

- **Importador** `scripts/importar-catalogo.mjs` (se ejecuta a mano con la ruta de la carpeta `proyecto` del agente): genera `apps/web/src/datos/oficiales.json`. **1.594 chollos** (Amazon 202, Jowua 160, Hansshow 465, Tesery 756, EVDANCE 11); descartados 22 pausados, 2 sin precio y 2 sin foto. Cada enlace se valida con `aplicarAfiliado()`. Para actualizar precios: volver a ejecutarlo (los precios los sigue actualizando el workflow semanal del agente).
- **Web estática (SEO):** portada y `/pagina/N` (24 por página, tiendas mezcladas en proporción, orden estable con semilla 2026), `/tienda/<id>` y `/tienda/<id>/pagina/N`, ficha `/chollo/<slug>` con datos estructurados de producto (sin valoraciones), `sitemap.xml` (1.600 URL) y `robots.txt`. **La indexación está bloqueada** hasta poner `NEXT_PUBLIC_INDEXAR=si` (y `NEXT_PUBLIC_SITIO` con el dominio). Pie con el aviso de afiliado y el de Amazon. Build: ~3,5 min.
- Rutas inexistentes: devuelven 200 con `noindex` y la página «Este chollo ya no está» (efecto del prerenderizado parcial de Next 16). Un 404 real se añadirá con `proxy.ts` si hace falta.
- **Supabase:** `supabase/migrations/20261120000000_inicial.sql`: perfiles (alias, rol), tiendas, chollos, votos, guardados, alertas, reportes, moderación (motivo, DSA art. 17) y la vista `chollos_publicos` con la temperatura. RLS en todo: los chollos solo los escribe el servidor (`service_role`), así nadie cuela su afiliado. **12 pruebas de RLS con PGlite** (`packages/db`), sin Docker.
- `@chollesla/core` usa imports con `.js` para poder ejecutarse en Node (importador).
- `npm test` ejecuta los tests de todos los paquetes (30 en total). El typecheck de la web hace `next typegen` antes.

**Pendiente:** despliegue de prueba en Cloudflare (cuando Vic cree la cuenta) · Fase 2 (Supabase: esquema, RLS y auth) · importar el catálogo · `docs/FUNCIONES_OBSERVADAS.md` (cuando REA funcione).

## 20/11/2026 (2): OK de Vic con cambios

**Decidido:** plataforma **gratuita** (sin cuotas ni destacados de pago por ahora) · ver chollos sin cuenta · importar su catálogo · arquitectura recomendada aprobada · usar REA **solo** sobre páginas públicas de Chollometro para sacar la lista de funciones.

**Hecho:** `docs/NOMBRES_Y_LOGO.md` (lista de nombres con .com comprobado y prompt del logo) · `PRODUCTO.md` §0 con el modelo gratuito y la propuesta de monetización (comunidad con el afiliado de Vic).

**Pendiente de Vic:** elegir nombre (recomendado: Chollesla) y comprar el dominio · generar el logo con el prompt · decir si la comunidad puede publicar gratis con su afiliado (PRODUCTO §0, punto 2).

**Siguiente (Claude):** observación con REA → `docs/FUNCIONES_OBSERVADAS.md` · Fase 1 del plan: esqueleto del monorepo.

## 20/11/2026: Fases 1 y 2 (preguntas y documentación)

**Hecho**
- Fase 1: preguntas a Vic por temas. Sus respuestas principales:
  - Lo lanza como particular y paga con Stripe. Hasta 30 €/mes de SaaS.
  - Cuota de 9,95 €/mes con planes de 3, 6 y 12 meses con descuento. Sin prueba gratuita.
  - Cuenta gratuita: ver, votar, guardar, alertas (email y push) y reportar. Sin comentarios.
  - Cupo mensual de chollos para publicadores. Destacar chollo de pago; la publicidad, más adelante.
  - Chollos oficiales más vistosos y con insignia. Insignias por publicaciones y votos.
  - Accesorios para cualquier Tesla. Enlaces de publicadores filtrados. El precio lo pone el publicador y la comunidad lo marca si es incorrecto.
  - Foto de la tienda enlazada. Alias. Solo español y España.
  - Telegram y Facebook actuales van aparte. Primero la web, luego las apps. No tiene cuentas de Apple ni de Google Play.
  - Pasó un logo (con el emblema y la palabra TESLA). El resto lo elijo yo.
- Revisada la skill REA (`docs/REA_REVISION.md`): no recomendada.
- Redactados `docs/PRODUCTO.md`, `docs/ARQUITECTURA.md`, `docs/LEGAL_Y_PAGOS.md`, `docs/PLAN.md`, `README.md` y `CLAUDE.md`.

**Estado:** pendiente del **OK de Vic** a la Fase 2. No hay código.

**Decisiones abiertas para Vic**
1. Ver chollos sin cuenta (recomendado, por SEO) o con cuenta obligatoria.
2. Nombre y logo: no usar el emblema ni la palabra TESLA como marca. Propuesta: `chollosev.es/.com`.
3. Arquitectura: monorepo Next.js + Expo (recomendada) o solo Expo.
4. Importar el catálogo actual (`productos*.json`) como chollos oficiales.
5. Cupo de 30 al mes, precios de los planes y del destacado. «6 años» interpretado como 6 meses.
6. Alta de autónomo antes de activar los cobros (como particular no se pueden cobrar cuotas).

**Siguiente:** con el OK, Fase 0 (Vic compra el dominio y crea cuentas) y Fase 1 (esqueleto del monorepo, CI y despliegue de prueba).
