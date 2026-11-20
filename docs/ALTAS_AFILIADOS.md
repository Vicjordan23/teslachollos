# Altas en programas de afiliados (guía para Vic)

Fecha: 20/11/2026. Base: `AFILIADOS_CANDIDATOS.md`.

**Reparto:** Claude abre cada formulario y rellena solo lo público (web, descripción, canales). **Vic** pone nombre y datos fiscales, email, contraseña, PayPal o IBAN, acepta las condiciones, resuelve el captcha y envía. Nunca pegar contraseñas ni claves en el chat.

**Cuándo:** casi todos los programas revisan la web antes de aprobar. Conviene pedir el alta **cuando Chollesla esté publicada** (al menos en `chollesla.<subdominio>.workers.dev`, mejor ya en `chollesla.es`).

## Textos para pegar (iguales en todos)

**Web:** `https://chollesla.es` (mientras tanto, la dirección de workers.dev)

**Descripción del sitio (ES):**
> Chollesla es una web española de chollos de accesorios para Tesla (Model 3, Model Y y resto de modelos). Publicamos ofertas con el precio final tras el código de descuento, la foto real del producto y un aviso de afiliado en cada enlace. La comunidad vota las ofertas y crea alertas. También publicamos en nuestro canal de Telegram y en Facebook (Accesorios Tesla España).

**Descripción (EN), para formularios en inglés:**
> Chollesla is a Spanish deals community for Tesla accessories (Model 3, Model Y and other models). We publish offers with the final price after the store's discount code, the real product photo and an affiliate disclosure on every link. Users vote on deals and set alerts. We also post to our Telegram channel and Facebook page (Accesorios Tesla España).

**Cómo promocionamos:** web de chollos con fichas de producto (SEO), Telegram, Facebook y email de alertas a usuarios registrados. Sin pujas por marcas en Google Ads, sin cashback y sin «clic para ver el cupón».

**Pregunta que conviene incluir** (en el campo de comentarios o por email):
> ¿Podemos publicar vuestro código de descuento junto al enlace en nuestras fichas de chollos? / Can we show your discount code next to the affiliate link on our deal pages?

## Orden recomendado y enlaces de alta

| # | Tienda | Alta | Notas |
|---|---|---|---|
| 1 | Shop4Tesla (UE, en español) | https://partner.shop4tesla.com/create-account | 5 %. **Su código no puede ir en webs de cupones**: usar solo el enlace y preguntar. |
| 2 | AliExpress Portals | https://portals.aliexpress.com/ | Acepta webs de chollos. Pide una cuenta de AliExpress. Hasta 9 %. |
| 3 | Yeslak (almacenes en la UE) | https://yeslak.goaffpro.com/ | 3–10 %, cookie de 30 días. |
| 4 | TESMAG | https://www.teslaacessories.com/affiliate-program/recruit | 2–10 %, con código para seguidores. Envío desde fuera de la UE. |
| 5 | Teslaunch | https://af.uppromote.com/Teslaunch/register | 2–10 %, 30 días. Pide NIF/VAT y PayPal. Aduanas a cargo del cliente. |
| 6 | TeslaGX | https://af.uppromote.com/teslagx/register | 10 %, 30 días. Sin confirmar web ni envíos. |
| 7 | EVBASE | https://evbase.bixgrow.com/login | 5 %, código exclusivo. Envío desde EE. UU. o China. |
| 8 | Tesstudio | https://af.uppromote.com/tesstudio/register | 5 %, solo pedidos de más de 50 $. |
| 9 | TAPTES | https://taptes.refersion.com/ | Restringe webs de cupones: preguntar antes. |

## Después de cada alta (lo hace Claude)

Cuando Vic diga «aprobado en X» (sin pegar claves: el enlace o el código de afiliado son públicos y se pueden pasar):
1. Añadir la tienda a `packages/core/src/tiendas.ts` y a `aplicarAfiliado()` (con sus tests) y a la tabla `tiendas` de Supabase.
2. Si da código para el público, ponerlo en `codigo` y `descuento` para que el precio final salga bien.
3. Importar o publicar sus chollos con foto real y precio final.
