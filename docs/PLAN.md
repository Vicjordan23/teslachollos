# Plan por fases

Fecha: 20/11/2026 · Estado: **pendiente de OK**

Modelo recomendado por fase:
- **Opus, esfuerzo alto:** diseño, seguridad (RLS, Stripe, webhooks), moderación y revisión de código antes de lanzar pagos.
- **Sonnet, esfuerzo medio:** construcción del día a día (pantallas, componentes, importadores, tests).

| Fase | Qué | Quién | Modelo | Resultado |
|---|---|---|---|---|
| **0. Preparación** | Comprar el dominio · crear cuentas de Supabase (región UE), Cloudflare, Resend y Sentry · decidir nombre y logo | **Vic** (yo te digo qué y dónde) | — | Cuentas listas, secretos guardados por Vic |
| **1. Esqueleto** | Monorepo, Next.js, Tailwind, `packages/core`, CI en GitHub Actions, despliegue de prueba en Cloudflare | Claude | Sonnet medio | Web vacía desplegada y CI verde |
| **2. Datos y auth** | Esquema SQL con RLS, migraciones, registro e inicio de sesión (email + Google), perfiles con alias | Claude | **Opus alto** | Usuarios pueden registrarse; tests de RLS |
| **3. Chollos oficiales** | Fichas, listados, categorías y modelos, `/ir/<id>`, avisos, importador del catálogo actual, SEO (sitemap, datos estructurados) | Claude | Sonnet medio | Web pública con tus chollos |
| **4. Comunidad gratuita** | Temperatura, guardados, alertas (email), reportes, caducidad | Claude | Sonnet medio | v1 gratuita lista |
| **5. Legal** | Borradores de aviso legal, privacidad, cookies y condiciones · formulario DSA | Claude redacta, **abogado revisa** | Opus alto | Textos publicados |
| **— Lanzamiento gratuito —** | Search Console, Afiliados de Amazon (añadir dominio) | Vic | | Tráfico y comisiones |
| **6. Publicadores de pago** | Stripe (modo de prueba → real), Checkout, portal, webhooks, formulario de publicar, verificación de enlaces, cola de moderación, panel del publicador | Claude | **Opus alto** (pagos) + Sonnet | Requiere alta de autónomo **antes** del modo real |
| **7. Extras** | Destacados, insignias, push web | Claude | Sonnet medio | v1.1 |
| **8. Apps** | Expo, login, ver, votar, alertas push, publicar (sin pagos dentro de la app) | Claude; Vic crea cuentas de Apple y Google | Sonnet medio | v1.2 en tiendas |

Cada fase va en commits pequeños, con tests y build verdes, y se anota en `HANDOFF.md`.

## Funciones observadas en comunidades de chollos (para inspirar, no copiar)

Lista genérica del sector, redactada por nosotros: publicar oferta con enlace, precio y código · votos de popularidad («temperatura») · orden por popularidad o novedad · caducidad · categorías · alertas por palabra clave · guardados · insignias y niveles de usuario · destacados · reportar · perfiles públicos de usuario. Los comentarios quedan fuera por decisión de Vic.
