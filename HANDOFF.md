# HANDOFF

## 20/11/2026 (15): filtro por modelo y orden (en main)

- Vic pide: «implementa todo lo que puedas de Chollometro», incluir AliExpress, y dice que ya tiene Supabase. Pedido a Vic: claves de Supabase en Cloudflare (URL y anon como variables; service_role como secreto), URL de Auth, cuenta de Resend para emails, y para AliExpress el tracking ID de Portals y la fuente de los productos.
- `modelosDe()` en core: lee el texto «modelos» (Model 3/Y, «3, Y, X y S», Cybertruck, MY/M3); si no nombra ninguno, es universal y sale en todos. 4 tests. En el catálogo: Model Y 1.328, Model 3 1.029, S 89, X 83, Cybertruck 77 (los 77 universales).
- Páginas estáticas `/modelo/<id>` y `/modelo/<id>/pagina/N` (en el sitemap). Menú: Model Y y Model 3 en lugar de Carga y Alfombrillas.
- Componente `Filtros` (modelo, tipo, orden) en portada, categorías y modelos. Orden: destacados, más descuento, más baratos, más caros, precio más reciente. Las combinaciones simples van a páginas estáticas y el resto a `/buscar?q&modelo&categoria&orden&p` (dinámica, `noindex`).
- No hay orden «Nuevos» ni «Más calientes» de verdad: el catálogo no tiene fecha de publicación y aún no hay votos. Llegan con Supabase.

## 20/11/2026 (14): sin cobros por ahora

- **Decisión de Vic:** no se cobra a nadie por ahora. Fuera del plan hasta nuevo aviso: Fase 6 (publicadores de pago, Stripe, cupos), destacados de pago y condiciones de contratación. Las funciones gratuitas de comunidad (cuentas, votos, guardados, alertas) siguen en el plan.

## 20/11/2026 (13): borradores de aviso legal, privacidad y cookies (en main)

- Páginas `/aviso-legal`, `/privacidad` y `/cookies`, enlazadas en el pie. Describen la web tal como es hoy: sin cuentas, sin cookies propias, Cloudflare como alojamiento, fotos cargadas desde Amazon y Shopify, registro de clics sin IP (Workers Logs guarda 3 días en el plan gratis). **Borrador: debe revisarlo un abogado antes de cobrar.** Hay que ampliar la privacidad antes de activar las cuentas.
- Los datos del titular (LSSI art. 10) **no van en el repo**: se leen de `NEXT_PUBLIC_TITULAR_NOMBRE`, `NEXT_PUBLIC_TITULAR_NIF`, `NEXT_PUBLIC_TITULAR_DIRECCION` y `NEXT_PUBLIC_TITULAR_EMAIL` (`apps/web/src/lib/titular.ts`). Mientras falten, se ve «pendiente».
- **Pendiente de Vic:** poner esas 4 variables de build en Cloudflare (Workers → chollesla → Settings → Build → Variables) y relanzar el build. Como particular se publican su nombre, NIF y dirección (ver `docs/LEGAL_Y_PAGOS.md` §0).
- Faltan las condiciones de uso: se redactan con las cuentas de usuario.

## 20/11/2026 (12): salida por /ir/<slug> (en main)

- Buscador (entrada 11) juntado con `main` a petición de Vic; Cloudflare lo despliega solo.
- Nueva ruta `/ir/<slug>`: pone el afiliado en el servidor y responde 302 (`no-store`, `X-Robots-Tag: noindex, nofollow`); si el chollo no existe, 404. Cada clic se escribe en los registros del Worker (`{"evento":"clic","slug","tienda"}`), visibles en Cloudflare → Workers → chollesla → Logs (observabilidad ya activa). Cuando haya Supabase, se guardarán en una tabla.
- **Amazon va directo** a `amazon.es/dp/…?tag=teslaaccesorios-21`, sin pasar por `/ir/`: su acuerdo de afiliados prohíbe ocultar o enmascarar los enlaces especiales. El resto de tiendas sale por `/ir/`. Lógica en `apps/web/src/lib/salida.ts`.
- `robots.txt` (cuando se active la indexación) bloquea `/ir/` y `/buscar`.
- Probado en local: 302 a Awin para EVDANCE, enlace directo de Amazon, 404 en un slug inexistente, typecheck y lint.

## 20/11/2026 (11): buscador

- `buscar()` en `@chollesla/core` (`buscar.ts`): sin acentos, todas las palabras por prefijo, plurales sencillos (alfombrillas, luces → luz), modelos normalizados («Model 3/Y», «MY», «M3» → `model3`/`modely`), quita palabras vacías («para», «tesla»…) y ordena por relevancia (título > modelos > descripción). 6 tests nuevos.
- Web: cuadro de búsqueda en la cabecera (segunda fila en móvil; formulario GET, funciona sin JavaScript) y página `/buscar?q=…&p=N` (24 por página, `noindex`, sin resultados muestra las categorías). Se renderiza en el Worker en cada petición.
- El menú de texto se ve desde `md` y «Publicar chollo» desde `lg`, para dejar sitio al buscador.
- Probado: typecheck, lint, 41 tests y vista a 375 px y 1280 px sin scroll horizontal. Ejemplos con el catálogo real: «alfombrillas model y» 63, «wallbox» 5, «luces ambiente» 11.

## 20/11/2026 (10): ficha oscura estilo Chollometro

- **Petición de Vic:** que las fichas tengan el mismo aspecto que la de Chollometro. Se le avisó de que chocaba con la regla anti plagio y eligió «copia visual fiel»; la excepción queda en `CLAUDE.md`.
- `TarjetaChollo.tsx` rehecha: panel blanco de foto a la izquierda (arriba en móvil); píldora de temperatura con ▾/▴ redondos azul y rojo; chip del precio con fecha (rojo oscuro, en el lugar de la cuenta atrás, porque el catálogo no tiene caducidad y no se inventa); título en negrita; precio naranja, tachado y `-N%` en verde; «Disponible en **Tienda**»; «Compartido por **Chollesla**» con el icono; descripción a 2 líneas (solo desde `sm`); pie con compartir y guardar (iconos), código con copiar y botón naranja «Ir al chollo» con icono.
- Colores nuevos `--ficha-*` en `globals.css`. `AccionesChollo.tsx` con estilo oscuro y `Compartir` solo icono.
- No hay comentarios (la cuenta gratuita no los tiene), así que no se pinta el icono de comentarios. Sin autor real ni caducidad hasta que haya publicadores.
- Probado: typecheck, lint, 35 tests y vista en 375 px y de escritorio. La página sigue con fondo claro; solo las fichas son oscuras.
- Nota: `@chollesla/core` hay que compilarlo (`npm run build -w packages/core`) antes del typecheck en un clon nuevo.

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

## 20/11/2026 (7): Cloudflare y Supabase en marcha (a medias, esperando a Vic)

- Repo preparado para Cloudflare Workers con OpenNext (`apps/web/wrangler.jsonc`, `open-next.config.ts`, scripts `cf:build` y `cf:deploy`). Worker de 1,66 MB comprimido. Fotos pedidas ya reducidas a los CDN de Amazon y Shopify. Sin `cacheComponents` → 404 reales. Build de OpenNext probado en Windows (avisa de que no es plataforma recomendada; el despliegue real lo hará Cloudflare en Linux).
- Con el OK de Vic: se instala la app «Cloudflare Workers and Pages» en GitHub **solo para `Vicjordan23/teslachollos`**. GitHub pidió confirmar con GitHub Mobile: **pendiente de Vic**.
- Supabase: formulario «New project» relleno (nombre `chollesla`, Central EU Frankfurt). La contraseña de la base de datos la generó Supabase. **Vic** la guarda con «Copy» en su gestor y pulsa «Create new project». Después Claude aplica `supabase/migrations/20261120000000_inicial.sql` en el editor SQL.
- `docs/ALTAS_AFILIADOS.md`: enlaces y textos para las altas. Claude rellena lo público; Vic pone datos, contraseña y condiciones. Mejor cuando la web esté publicada.
- Siguiente: crear el Worker desde el repo con Cloudflare. Build command `npm run cf:build -w apps/web`; deploy command `cd apps/web && npx opennextjs-cloudflare deploy`; raíz del repo `/`. Variable `NEXT_PUBLIC_SITIO` = la dirección de workers.dev hasta tener dominio.

## 20/11/2026 (9): nuevo diseño (opción A de Vic)

- Vic eligió la **ficha horizontal A** y pidió color en el fondo de la ficha y en el botón. Paleta solo clara, **sin rojo**: fondo `#f1f4f8`, fichas azul suave `#f5f9ff`, precio verde `#15803d`, botón «Ir al chollo» verde `#16a34a`, temperatura ámbar. Letra Fredoka (le gusta).
- Ficha: foto a la izquierda; temperatura con ▾/▴ (0° hasta que haya cuentas), «Oficial», fecha del precio, título, precio final, precio tachado, % de ahorro, tienda, Guardar, Compartir (funciona), código con copiar y botón verde. **Sin aviso de afiliado por producto** (decisión de Vic): queda en el pie de todas las páginas, Amazon incluido.
- **Menú** arriba: Chollos, Carga, Alfombrillas, Alertas, «Publicar chollo» y «Entrar» (las tres últimas llevan a `/entrar`, «muy pronto»).
- **Filtro por tipo de producto** (no por tienda): `categoriaDe()` en core, por palabras del título (12 tipos; 90 de 1.594 en «Otros»). Rutas `/categoria/<id>` y `/categoria/<id>/pagina/N`. Las páginas `/tienda/...` siguen, pero ya no se enlazan desde la web.
- Pendiente de decidir con Vic: el icono del logo sigue rojo.

## 20/11/2026 (8): WEB PUBLICADA y Supabase con el esquema

- **Web en producción:** https://chollesla.victor-martin-juanas.workers.dev (Cloudflare Workers, plan gratis). Worker `chollesla` conectado a GitHub (app de Cloudflare instalada **solo en `teslachollos`**; Vic confirmó con GitHub Mobile). Cada push a `main` despliega solo. Build: `npm run cf:build -w apps/web`. Deploy: `cd apps/web && npx opennextjs-cloudflare deploy`. Raíz `/`. Variable `NODE_VERSION=24`. Vistas previas de rama desactivadas. Primer build: 2 min, OK.
- Comprobado en producción: portada, paginación, tiendas y fichas dan 200; las rutas inexistentes, 404; `robots.txt` bloquea y la web lleva `noindex`; enlaces de Amazon con `tag=teslaaccesorios-21`; fotos del CDN reducidas.
- **Supabase:** proyecto `chollesla` (id `qcyqerhinjqwkkmwcbpo`, Central EU Frankfurt, plan gratis); contraseña de la base de datos generada por Supabase y guardada por Vic. Migración `20261120000000_inicial.sql` aplicada en el editor SQL. Verificado: 8 tablas con RLS, 15 políticas, 5 tiendas. La web todavía no lo usa (es estática).
- Canonical y sitemap apuntan a `https://chollesla.es`. Cuando haya dominio: añadirlo en Cloudflare (Workers → chollesla → Domains), poner `NEXT_PUBLIC_SITIO` y, para lanzar, `NEXT_PUBLIC_INDEXAR=si` en las variables de build.

**Pendiente:** dominio chollesla.es/.com (Vic) · altas de afiliados con la web ya publicada (guía en `docs/ALTAS_AFILIADOS.md`) · fase de usuarios: login con Supabase, votos, guardados y alertas (claves de Supabase como variables o secretos de Cloudflare; Vic las copia, nunca en el chat) (cuando Vic cree la cuenta) · Fase 2 (Supabase: esquema, RLS y auth) · importar el catálogo · `docs/FUNCIONES_OBSERVADAS.md` (cuando REA funcione).

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
