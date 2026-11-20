# Arquitectura, servicios, costes y dominio (borrador para OK de Vic)

Fecha: 20/11/2026 · Estado: **pendiente de OK**

## 1. Elección: monorepo TypeScript con Next.js (web) + Expo (apps) + Supabase

```
teslachollos/
  apps/web      → Next.js (web, SEO, pagos Stripe, panel admin)        ← Fase 3, primero
  apps/movil    → Expo / React Native (iOS + Android)                   ← después
  packages/core → tipos, validación (zod), reglas de negocio, cliente de la API, textos legales
  supabase/     → esquema SQL, políticas RLS, funciones, migraciones
```

### Por qué no «solo Expo para todo»

Pediste una sola base de código. He comparado dos opciones:

| | A) Solo Expo Router (web + apps) | **B) Monorepo Next.js + Expo (recomendada)** |
|---|---|---|
| Código compartido | ~90 % | ~50–60 % (lógica, tipos, validación, API; no la UI) |
| SEO de miles de fichas | Expo web hace renderizado estático o en servidor, pero menos maduro y con menos documentación | Next.js es el estándar: fichas renderizadas en servidor, sitemap y datos estructurados |
| Stripe Checkout, webhooks, admin | Posible con rutas API de Expo (EAS Hosting) | Muy documentado |
| Hosting gratis | EAS Hosting (plan gratis limitado) | Cloudflare (gratis, permite uso comercial) |
| Riesgo | Si la web no posiciona, el negocio de afiliados no arranca | Bajo |

La web es la fase 1 y vive del SEO y de los pagos. Por eso recomiendo B: la parte crítica va con la herramienta más probada, y las apps se hacen después con Expo, compartiendo todo lo que no es pantalla. Si prefieres A igualmente, es viable; dímelo y lo cambio.

### Piezas

| Pieza | Elección | Motivo |
|---|---|---|
| Lenguaje | TypeScript | Un solo lenguaje en web, apps y funciones |
| Web | Next.js (App Router) + Tailwind | SEO, renderizado en servidor, ecosistema |
| Apps | Expo (React Native) + Expo Router | Una base para iOS y Android, builds en la nube (EAS) sin Mac |
| Base de datos y auth | **Supabase** (Postgres, región UE Frankfurt) | Auth con email y Google/Apple, RLS (cada usuario solo toca lo suyo), almacenamiento de imágenes, cron, funciones; gratis al empezar |
| Pagos | **Stripe** Checkout + Billing + Customer Portal | Suscripción, baja y facturas sin programar formularios de tarjeta |
| Emails | Resend (gratis hasta 3.000/mes) | Alertas y emails de la cuenta |
| Push | Web Push (VAPID, gratis); en apps, Expo Push (gratis) | |
| Hosting web | Cloudflare Workers (OpenNext) | Gratis y permite uso comercial (Vercel Hobby no lo permite) |
| Analítica | Cloudflare Web Analytics | Sin cookies, así que no requiere banner por analítica |
| Errores | Sentry (plan gratis) | |
| Seguridad de enlaces | Google Safe Browsing API | Gratis |
| CI | GitHub Actions: lint, tests y build en cada push | |

### Modelo de datos (inicial)

`perfiles` (alias, rol: gratis/publicador/admin, avisos) · `suscripciones` (espejo de Stripe) · `tiendas` (dominio, lista blanca, parámetro de afiliado, aviso específico) · `chollos` (tipo, enlace, URL final, precio final en céntimos, código, modelos, categoría, estado, fechas, publicador) · `votos` (usuario, chollo, ±1) · `guardados` · `alertas` · `reportes` · `moderacion` (decisión, motivo: exigido por la DSA) · `clics` · `destacados` · `insignias`.

Todas las tablas con RLS activado desde el primer commit.

## 2. Seguridad

- Secretos (Stripe, Supabase service key, Resend, Safe Browsing) solo en **secretos de Cloudflare y GitHub**. `.env.local` en `.gitignore` y `.env.example` sin valores.
- La clave de servicio de Supabase nunca llega al navegador.
- Los webhooks de Stripe se verifican por firma. El estado de pago solo lo cambia el webhook, nunca el cliente.
- Límites de frecuencia en votos, reportes y publicación.
- Los enlaces de salida pasan por `/ir/<id>` con `rel="sponsored nofollow noopener"`.

## 3. Servicios y coste mensual estimado

| Servicio | Inicio (sin pagos) | Con pagos activos | Notas |
|---|---|---|---|
| Supabase | 0 € | ~23 € (Pro, 25 $) | El plan gratis se pausa tras 7 días sin actividad y no tiene copias diarias. Pasar a Pro al lanzar pagos |
| Cloudflare Workers | 0 € | 0–5 € | 5 $ si pasamos de 100.000 peticiones al día |
| Resend | 0 € | 0 € | Hasta 3.000 emails/mes |
| Sentry, Analytics, Safe Browsing | 0 € | 0 € | |
| Dominio | ~1 €/mes | ~1 €/mes | ~10–15 €/año |
| Stripe | Sin cuota | Por cobro: ~1,5 % + 0,25 € (tarjeta UE) + 0,7 % Billing | En una cuota de 9,95 € ≈ 0,47 € |
| **Total** | **~1 €/mes** | **~25–30 €/mes** | Dentro del tope de 30 € |
| Apps (aparte) | — | Apple 99 $/año · Google 25 $ una vez | Solo cuando lleguen las apps |

Las tarifas son las públicas que conozco a fecha de hoy. Compruébalas al contratar, porque cambian.

## 4. Números rápidos de la cuota (9,95 € IVA incluido)

9,95 € → IVA 21 % 1,73 € → base 8,22 € → Stripe ~0,47 € → **~7,75 € netos por mes y publicador**, antes del IRPF y de la cuota de autónomo. Con ~25 € de SaaS, a partir de **4 publicadores** se cubre la infraestructura.

## 5. Nombre y dominio

Un nombre que **no empiece por la marca Tesla** reduce el riesgo legal y permite ampliar algún día. Comprobado hoy en el registro de .com (sin registrar = probablemente libre; los .es los compruebas tú al comprar):

| Nombre | .com | Comentario |
|---|---|---|
| **chollosev.com / .es** | libre | Mi favorito: corto, sin marca ajena, vale si algún día se amplía a otros eléctricos. Lema «Chollos en accesorios para tu Tesla» (uso descriptivo) |
| chollovolt.com | libre | Con más personalidad |
| chollosparatesla.com | libre | «para Tesla» es uso descriptivo y más defendible, pero sigue dependiendo de la marca |
| teslachollos.com | libre | El nombre del repo. **No recomendado**: «Tesla» al principio parece marca oficial |

Dónde comprar: el .es en un registrador acreditado (DonDominio, Arsys…, ~8–12 €/año). Después, los DNS se gestionan en Cloudflare (gratis). Esto lo haces tú.

**Logo:** propongo un logo nuevo en SVG hecho a mano (un rayo con una etiqueta de precio y los colores rojo y negro de tu logo actual), sin el emblema ni la tipografía de Tesla. No será imagen de IA.
