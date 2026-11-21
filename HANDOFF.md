# HANDOFF

## 21/11/2026 (31) — Search Console
- Propiedad de dominio `chollesla.es` verificada por DNS (TXT `google-site-verification=…` en la raíz de Cloudflare; no borrarlo). Sitemap `https://chollesla.es/sitemap.xml` enviado el 21/11/2026.
- Siguiente: en unos días revisar Páginas/Rendimiento en Search Console; añadir GA4 dentro de GTM.

## 21/11/2026 (30) — Resend probado y plantillas de email en español
- Probado por Vic: el login por email llega desde `no-reply@chollesla.es` a Recibidos (no spam); Resend lo marca «Delivered».
- Supabase → Auth → Emails → Templates: traducidas al español «Magic link or OTP» (la del login) y «Confirm sign up». Sin tocar (la web no las usa): Invite, Change email, Reset password, Reauthentication. Plantilla simple sin logo; mejora posible: diseño con logo.

## 21/11/2026 (29) — Resend (emails de login desde chollesla.es)
- Resend: dominio `chollesla.es` verificado (región eu-west-1). Registros en Cloudflare (DNS only): TXT `resend._domainkey`, CNAME `rsend` y `send`, TXT `_dmarc` (`v=DMARC1; p=none;`).
- Supabase → Auth → Emails → SMTP: activado, remitente `no-reply@chollesla.es` / «Chollesla», host `smtp.resend.com`, puerto 465, usuario `resend`; la clave de API la puso Vic (no está en ningún archivo).
- Pendiente: probar un login por email y ver el envío en Resend → Emails; traducir las plantillas de Supabase (siguen en inglés).

## 21/11/2026 (28) — Menús desplegables se cierran al elegir
- `components/CierraMenus.tsx` (cliente) cierra los `<details>` del menú principal (Categorías, Modelos…) al cambiar de ruta y al hacer clic fuera. Antes quedaban abiertos porque el layout no se remonta al navegar. Pendiente: probar en producción.

## 21/11/2026 (27) — Supabase con chollesla.es, indexación activada, Telegram sin enlace al canal
- Supabase: Site URL `https://chollesla.es` y redirección `https://chollesla.es/**` (se mantiene la de workers.dev). Login por email probado por Vic en el dominio nuevo: funciona.
- Build: añadida `NEXT_PUBLIC_INDEXAR=si` (este commit lanza el build). Pendiente después: Search Console + enviar `https://chollesla.es/sitemap.xml`.
- tesla-telegram: `marca.WEB` = `https://chollesla.es`; en Telegram ya no se enlaza el canal (ni botón ni pie: `PIE_TELEGRAM`); Facebook, Instagram y X siguen con web + canal. Commit 8a122ab.
- Pendiente: pegar y fijar el texto `AVISO` en el canal (`--aviso`), y revisar el fallo de Instagram (run #71).

## 21/11/2026 (26) — chollesla.es activo y conectado al Worker
- Cloudflare marcó chollesla.es «Active» (NS `johnathan`/`rita`). Añadidos como dominios personalizados del Worker `chollesla`: `chollesla.es` y `www.chollesla.es`.
- Variable de build `NEXT_PUBLIC_SITIO=https://chollesla.es` guardada; este commit lanza el build que la aplica.
- Pendiente (en este orden): comprobar que `https://chollesla.es` carga; Supabase → Authentication → URL Configuration (Site URL `https://chollesla.es` y redirección `https://chollesla.es/**`, dejando también la de workers.dev hasta probar); probar login, voto, guardado y alerta en el dominio nuevo; luego `NEXT_PUBLIC_INDEXAR=si`; cambiar `WEB` en `marca.py` de tesla-telegram a `https://chollesla.es`.

## 21/11/2026 (25) — Google Tag Manager con aviso de cookies; web + Telegram + logo en todas las publicaciones
- **GTM** (`GTM-5J53DMFM`, o `NEXT_PUBLIC_GTM_ID`): `components/Analitica.tsx`, montado en `layout.tsx`. No se carga nada de Google hasta que la persona pulsa «Aceptar» en el aviso inferior (decisión en localStorage `chollesla-analitica`); «Rechazar» no carga nada. Se usó el arranque estándar de GTM (`gtm.start` + `gtm.js`) en lugar del `gtag()` pegado por Vic. `/cookies` actualizada. Sin compilar en local: revisar el build de Cloudflare.
- **Telegram/Facebook/Instagram/X** (repo tesla-telegram, `marca.py`): todas las publicaciones llevan la web y el canal. Telegram además sube la foto con franja blanca con el logo «chollesla» (`marca/logo-letras.png`) y botones «Más chollos en la web» y «Canal de Telegram». La URL de la web sale de `marca.WEB` (o variable `WEB_URL`): **cuando chollesla.es esté activo, cambiar `WEB` a `https://chollesla.es`**. `AVISO` (texto para fijar) reescrito con la web. El workflow «Publicar en Telegram» instala Pillow. Probado con un envío real (#728).
- Incidente: un primer commit dejó roto `publicar_siguiente.py` (error de codificación al editar con Python y heredoc) unos minutos; corregido en 4961387. Editar siempre con la herramienta de edición, no con scripts por heredoc.
- Facebook e Instagram llevan web y canal en el texto pero la foto sin logo (Instagram exige una URL pública de la imagen; hay que alojar las imágenes con logo en algún sitio).

## 21/11/2026 (24) — Dominio chollesla.es (en curso)
- Vic compró chollesla.es en Hostinger. Añadido a Cloudflare (plan Free, sin registros DNS todavía) y en Hostinger los nameservers cambiados a `johnathan.ns.cloudflare.com` y `rita.ns.cloudflare.com`. Cloudflare está esperando la propagación (de minutos a 24 h).
- Falta cuando Cloudflare diga «Active»: Worker `chollesla` → Ajustes → Dominios y rutas → añadir `chollesla.es` (y `www`); variable de build `NEXT_PUBLIC_SITIO=https://chollesla.es` + «Retry build»; Supabase → Authentication → URL Configuration (Site URL y `https://chollesla.es/**`); luego `NEXT_PUBLIC_INDEXAR=si`. No cambiar la Site URL de Supabase antes de que el dominio funcione (rompería el login).

## 21/11/2026 (23) — Banner de Telegram y navegación en colores
- Franja azul Telegram arriba de todo (logo grande en `apps/web/public/telegram.webp`, «Únete al canal de Telegram», botón «Unirme gratis») enlazada a t.me/teslaaccesorios. Navegación principal con una pastilla de color por apartado.
- Fix: los desplegables Categorías/Modelos quedaban cortados por `overflow-x-auto` de la barra; ahora la barra usa `flex-wrap` y la cabecera `relative z-30`.
- Respuesta a Vic sobre el dominio: la web NO va en WordPress/Hostinger; es Next.js en Cloudflare Workers. Falta comprar chollesla.es (lo compra Vic), apuntarlo a Cloudflare, `NEXT_PUBLIC_SITIO`, `NEXT_PUBLIC_INDEXAR=si`, Auth URLs de Supabase.

## 20/11/2026 (22) — Títulos en español y panel lateral sin fijar
- `scripts/traducir-titulos.mjs` traduce al español títulos y descripciones de `aliexpress.json` y `oficiales.json` (traductor gratuito de Google, caché en `scripts/traducciones.json`; si falla deja el original). Se ejecuta en el workflow «Importar AliExpress» tras importar. Para el catálogo oficial hay que ejecutarlo a mano tras `importar-catalogo.mjs`. Tras traducir, lanzar «Sincronizar Supabase» para que la base tenga los títulos nuevos.
- Panel «Los mayores descuentos»: ya no es `sticky` (se quedaba fijo y cortado); se desplaza con la página.
- Telegram/Facebook/Instagram (repo tesla-telegram): siempre con foto y traducidos (`traducir.py`).

## 20/11/2026 (21) — Estilo propio «Garaje técnico»
- Decisión de Vic: público masculino, accesorios para coches Tesla, sin logos ni marca Tesla. Estilo: carbono casi negro con textura sutil, acento rojo-naranja `#ff3d1f`, descuentos en lima, tipografías Rajdhani (títulos/precios) + Barlow (texto), esquinas casi rectas, logo en mayúsculas espaciadas, textos directos.
- Variables en `globals.css`; estructura (cabecera, pestañas, panel lateral) igual que (20).

## 20/11/2026 (20) — Rediseño visual tipo Chollómetro (solo estructura, marca Chollesla)
- Tema oscuro (variables en `globals.css`), cabecera de dos filas a todo el ancho (logo, Menú, buscador, Crear alerta, Regístrate/Inicia sesión, Comparte; debajo Categorías, Modelos, Ofertas, Comunidad, Alertas, Telegram), pestañas de orden + botón «Filtrar» (`Filtros.tsx`), listado a todo el ancho con panel lateral «Los mayores descuentos» (`MasVotados.tsx`, dentro de `Rejilla.tsx`).
- No se usó la herramienta externa REA (repo desconocido; descargar/ejecutar código externo lo decide Vic). Sin logo ni nombre de Chollómetro. «Más votados» se llama «Mayores descuentos» porque los votos viven en Supabase, no en el HTML estático.
- Sin compilar en local (no hay node_modules): revisar el build de Cloudflare.

## 20/11/2026 (19) — Prueba en la web y arreglo de «Guardar»
- Prueba real con la cuenta de Vic: login, alias, voto y alerta funcionan; Vic es `rol='admin'` y `/admin` abre.
- Bug: «Guardar» no guardaba y `/guardados` se quedaba en «Cargando…». Causa: consultas lanzadas dentro de `onAuthStateChange` (interbloqueo del bloqueo de auth de supabase-js). Arreglo en `apps/web/src/lib/interacciones.ts` (se difieren con `setTimeout`), commit 0b487d5. Verificado en producción: POST `guardados` 201 y `/guardados` lista el chollo.
- Pendiente: Resend y login con Google (ver entrada anterior), rotar el App Secret de AliExpress (se pegó en el chat) y, si se quiere, la service_role de Supabase; migrar a las claves nuevas de Supabase antes de 2027.

## 20/11/2026 (18): configuración de paneles hecha desde el Chrome de Vic, y enlace de Telegram

- **Supabase (proyecto chollesla, ref `qcyqerhinjqwkkmwcbpo`):** aplicadas `20261121…` y `20261122…` en el editor SQL y verificado (`alertas.ultimo_aviso`, `perfiles.suspendido`, vista `perfiles_publicos`, tienda `aliexpress`). Auth → URL Configuration: Site URL `https://chollesla.victor-martin-juanas.workers.dev` y Redirect URL `…/**`.
- **Cloudflare (worker chollesla):** variables de build `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`; secreto de runtime `SUPABASE_SERVICE_ROLE_KEY`. Se usan las claves **legacy JWT**: `servicio()` envía la clave como `Bearer`, así que las `sb_secret_…` no sirven (y Supabase retirará las legacy en 2027: habrá que migrar el código antes). Build relanzado; estado final por comprobar.
- **GitHub:** secretos `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`. «Sincronizar Supabase» dejó `chollos` con 1.594 filas (todas publicadas, 0 de AliExpress).
- **Bug corregido:** los scripts (`sincronizar-supabase`, `enviar-alertas`, `caducar`) hacían `r.json()` sobre un 201 sin cuerpo (`return=minimal`) y fallaban con «Unexpected end of JSON input». Ahora leen el texto y parsean solo si hay cuerpo.
- **Telegram:** botón «Telegram» en la cabecera (pantallas ≥ md) y línea en el pie con `t.me/teslaaccesorios`.
- **AliExpress, hecho:** secretos `ALIEXPRESS_APP_KEY`, `ALIEXPRESS_APP_SECRET` y `ALIEXPRESS_TRACKING_ID` en el repo. Con SHA256 la API daba `IncompleteSignature`; el importador ahora recorta las claves y, si SHA256 falla, usa MD5 (protocolo TOP, como `aliexpress_api.py` del agente de Telegram). «Importar AliExpress» #4 en verde: 300 productos en `chollos` (total 1.894). El App Secret se pegó en un chat: conviene regenerarlo en el portal y actualizarlo aquí y en `tesla-telegram`.
- **Pendiente:** prueba en la web (entrar con email, alias, votar, guardar, alerta) y poner `rol = 'admin'` en `perfiles` para `/admin`.
- **Resend (emails):** cuenta gratis; SMTP en Supabase (Authentication → SMTP) y secretos `RESEND_API_KEY` y `ALERTAS_REMITENTE` en GitHub. Solo envía a cualquier destinatario con un **dominio verificado**: sin dominio propio no hay emails de alertas ni de acceso fiables.
- **Login con Google:** crear credenciales OAuth en Google Cloud, activar el proveedor en Supabase (Authentication → Sign In / Providers) con la callback de Supabase, y poner `NEXT_PUBLIC_LOGIN_GOOGLE=si` en Cloudflare (variable de build) y relanzar.

## 20/11/2026 (17): AliExpress, moderación, caducidad, perfiles, insignias, votos en directo y Google

- Vic pidió que Claude hiciera la configuración en Supabase y Cloudflare: esta sesión es en la nube y **no puede usar el navegador de su PC** (hace falta una sesión de Claude en su ordenador). Sigue pendiente de Vic la lista de la entrada 16, más lo de abajo.
- **AliExpress:** tienda `aliexpress` en core (ficha limpia `es.aliexpress.com/item/<id>.html`; los `s.click` ajenos se resuelven para quitar el afiliado). `scripts/importar-aliexpress.mjs` usa la API de afiliados (`aliexpress.affiliate.product.query`, firma HMAC-SHA256, EUR, envío a España, tracking ID de Vic), filtra productos para Tesla, guarda hasta 300 en `apps/web/src/datos/aliexpress.json` con su `enlaceAfiliado` (el botón sale por `/ir/`). No se muestra el «precio original» de AliExpress. Acción «Importar AliExpress» (lunes y a mano): importa, prueba, hace commit en main y sincroniza Supabase. Probado con una API simulada. **Las 2 ejecuciones reales fallaron: los secretos no están en este repo** (la acción acepta `ALIEXPRESS_APP_KEY`/`_APP_SECRET`/`_TRACKING_ID` y variantes). Vic debe añadirlos en `Vicjordan23/teslachollos` → Settings → Secrets → Actions.
- **Moderación:** `/admin` (pendientes y reportes; publicar, rechazar, caducar, retirar, suspender cuenta) + `POST /api/moderar` (comprueba rol admin; cada decisión queda en `moderacion` con su motivo). El autor ve el estado y el motivo en `/cuenta` → «Mis chollos» (DSA art. 17). Vic tiene que ponerse `rol = admin` en su fila de `perfiles` (Table Editor).
- **Caducidad:** `scripts/caducar.mjs` (en la acción diaria antes de las alertas): por fecha de fin, a los 30 días o con 3 reportes de «caducado» de personas distintas. Fecha de fin opcional al publicar.
- **Perfil público** `/u/<alias>`: nivel (Novato → Leyenda), puntos, estadísticas e insignias (`insigniasDe`/`nivelDe` en core, con tests). El alias del autor enlaza al perfil.
- **Votos en directo** (Supabase Realtime sobre `votos`). **Entrar con Google**: el botón aparece con `NEXT_PUBLIC_LOGIN_GOOGLE=si` cuando Vic configure el proveedor en Supabase.
- Migración nueva `20261122000000_aliexpress_moderacion_insignias.sql` (tienda AliExpress, suspensión, `perfiles_publicos`, Realtime). **Aplicar después de la de la entrada 16.**
- Nota: retirar o caducar un chollo oficial se deshace en la siguiente sincronización; los oficiales se corrigen en el catálogo de origen.
- Probado: 46 + 15 tests, typecheck, lint y en el navegador con Supabase simulado.
- Sin hacer: notificaciones push (necesita claves VAPID y un servicio de envío).

## 20/11/2026 (16): comunidad con Supabase (código listo; se activa con las claves de Vic)

Todo se activa solo cuando existen las variables; sin ellas la web sigue como antes («muy pronto»).

- **Cuentas:** entrar con enlace por email (sin contraseña, PKCE, sesión en localStorage). `/entrar`, `/auth/confirmar`, `/cuenta` (alias obligatorio antes de votar, cerrar sesión). Botón de la cabecera con `@alias`.
- **Temperatura y guardados** en cada ficha (`components/Interacciones.tsx`, estado en `lib/interacciones.ts`): las fichas siguen estáticas y piden temperatura, voto y guardado de todas a la vez a Supabase. `/guardados`.
- **Sincronización del catálogo:** `scripts/sincronizar-supabase.mjs` + acción «Sincronizar Supabase» (al cambiar `oficiales.json` o a mano). Upsert por `id_externo` = `tienda:id`; los que desaparecen pasan a `retirado`. Probado contra el esquema con PGlite: entran los 1.594.
- **Alertas:** `/alertas` (palabra, modelo, tipo, precio máximo; máx. 20), botón «Crear alerta con esta búsqueda» en `/buscar`. Envío diario por email con `scripts/enviar-alertas.mjs` + acción «Enviar alertas» (Resend). Los emails enlazan a nuestra ficha, nunca a Amazon (regla de Amazon).
- **Reportar** en la ficha (motivos: precio, caducado, no Tesla, spam, ilegal, otro) → tabla `reportes`.
- **Publicar** (`/publicar` + `POST /api/publicar`): valida con `prepararPublicacion()` de core (tiendas de Vic + Tesla y AliExpress limpios), pone el afiliado de Vic, resuelve acortadores, máx. 5 al día, evita duplicados; los 5 primeros de cada persona quedan `pendiente`. Fichas de la comunidad en `/c/<slug>` y listado `/comunidad` (Nuevos / Más calientes 7 días). `/ir/<slug>` también sirve los de la comunidad.
- **Moderación:** de momento en Supabase → Table Editor (`chollos.estado` de `pendiente` a `publicado`; tabla `reportes`). Panel propio, más adelante.
- **Legal:** `/condiciones` nuevas; privacidad y cookies ampliadas (email, alias, Supabase en Fráncfort, sesión en localStorage). Borradores.
- Migración nueva `supabase/migrations/20261121000000_alertas_y_comunidad.sql` (ventana de avisos, límite de alertas, categoría). **Hay que aplicarla en el editor SQL.**
- Fotos: se admiten también las del CDN de AliExpress.
- Probado: 40 + 12 tests, typecheck, lint, build de producción, y en el navegador con un Supabase simulado (votar, guardar, publicar, comunidad, `/ir`).

**Pendiente de Vic (en este orden):**
1. Supabase → SQL Editor: ejecutar `20261121000000_alertas_y_comunidad.sql`.
2. Supabase → Authentication → URL Configuration: Site URL `https://chollesla.victor-martin-juanas.workers.dev` y Redirect URL `https://chollesla.victor-martin-juanas.workers.dev/**`.
3. Cloudflare → Workers → chollesla → Settings: variables de build `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`; secreto de runtime `SUPABASE_SERVICE_ROLE_KEY`. Relanzar el build.
4. GitHub → repo → Settings → Secrets → Actions: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`; lanzar a mano «Sincronizar Supabase».
5. Resend (cuenta gratis): SMTP en Supabase (Authentication → SMTP) y secretos `RESEND_API_KEY` y `ALERTAS_REMITENTE` en GitHub. Resend solo envía a cualquiera con un **dominio verificado** → hace falta el dominio.
6. AliExpress: tracking ID de Portals y de dónde salen los productos.

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
