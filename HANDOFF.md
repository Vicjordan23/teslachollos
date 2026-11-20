# HANDOFF

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
