# Puntos delicados: pagos en apps, enlaces de publicadores, legal y Stripe

Fecha: 20/11/2026 · Estado: **borrador**. No soy abogado ni gestor: esto ordena lo que hay que hacer, pero los textos legales y el alta fiscal los debe revisar un profesional antes de cobrar el primer euro.

---

## 0. Lo primero: «como particular» no es posible para cobrar cuotas

Cobrar una suscripción mensual de forma continuada es una **actividad económica habitual**. En España eso exige:

1. **Alta en Hacienda** (censo, modelo 036/037) con el epígrafe adecuado. Lo confirma el gestor; probablemente servicios de publicidad o portales web.
2. **Alta como autónomo** en la Seguridad Social (RETA). Con la cuota reducida del primer año sale a ~80 €/mes. Hay una zona gris si los ingresos no llegan al salario mínimo anual, pero la tendencia de la Seguridad Social y los tribunales es exigir el alta. Pregúntalo al gestor.
3. Emitir **facturas** (Stripe las genera) y presentar **IVA trimestral** (modelo 303) e **IRPF** (modelo 130 o retenciones).

Las comisiones de afiliado que ya cobras también son rendimientos de actividad económica: conviene regularizarlas a la vez.

| Forma | Cuándo tiene sentido | Coste fijo aprox. |
|---|---|---|
| Particular | Solo para probar la web **sin cobrar cuotas** | 0 € |
| **Autónomo** (recomendado al lanzar pagos) | Hasta ~40–60 k€/año de beneficio | ~80 €/mes el primer año + gestor (~40–60 €/mes) |
| Sociedad limitada | Mucho volumen, socios o querer limitar responsabilidad | Constitución ~300–600 € + gestoría más cara + impuesto de sociedades |

**Recomendación:** construir y lanzar la web gratis (fase de tráfico) como hasta ahora y darte de **alta como autónomo justo antes de activar las cuotas**. Stripe pide estos datos al activar la cuenta. Además, el aviso legal debe incluir tu nombre, NIF y dirección (LSSI art. 10): como persona física se publican tus datos. Ese es otro motivo para valorar más adelante una sociedad.

---

## 1. Suscripción dentro de las apps (Apple y Google)

Lo que vendemos (poder publicar chollos) es una función digital que se usa dentro de la app. Por eso, si se compra **dentro** de la app, Apple y Google exigen en principio su sistema de pago.

| Opción | Cómo funciona | Comisión | Valoración |
|---|---|---|---|
| **A. Pago solo en la web** (recomendada) | La app no muestra precios ni botones de compra. El publicador paga en la web y en la app solo inicia sesión y publica (regla de «servicios multiplataforma») | 0 % de Apple/Google | Lo hacen Spotify, Netflix… Sencillo y sin riesgo de rechazo |
| B. Compra dentro de la app | StoreKit (Apple) / Play Billing (Google) | 15 % (programas de pequeñas empresas, < 1 M$/año) | Más conversión, pero −15 % y dos sistemas de suscripción que sincronizar con Stripe |
| C. Enlace externo por la DMA (UE) | La app enlaza a tu web para pagar, con permiso especial de Apple / programa de ofertas externas de Google | Reducida pero **no nula** (Apple y Google cobran tasas de varios puntos sobre las compras que vienen de la app) | Las condiciones cambiaron varias veces en 2024–2026. Revisarlas cuando lleguen las apps |

**Recomendación:** A en las apps. Si los datos muestran que se pierden muchas altas desde la app, se estudia C.

---

## 2. Enlaces de afiliado de publicadores: fraude, spam y DSA

### Medidas técnicas (ver `PRODUCTO.md` §6)
Lista blanca de tiendas · resolución de redirecciones en el servidor · Safe Browsing · comprobación de que es para Tesla · comparación de precio cuando la página lo publica · premoderación de los 5 primeros chollos · cupo mensual · límites de frecuencia · detección de duplicados · reportes de la comunidad · 3 avisos y suspensión.

### Aviso de afiliado obligatorio
- La publicidad debe ser **identificable** (LSSI art. 20 y Ley de Competencia Desleal). El aviso lo pinta **la plataforma** en cada chollo, no depende de que el publicador lo escriba: «Enlace de afiliado de @alias».
- Amazon exige que cada asociado muestre su aviso. En los enlaces de Amazon de publicadores se añade automáticamente: «En calidad de Afiliado de Amazon, @alias obtiene ingresos por las compras adscritas que cumplen los requisitos.» Las condiciones del publicador le obligan a ser asociado válido y a cumplir las normas de su programa.
- Los destacados de pago llevan además la etiqueta «Destacado · publicidad».

### Reglas de Amazon que nos afectan (programa de Vic)
- **Precios e imágenes de Amazon:** solo se pueden mostrar si vienen de su API (PA-API, que exige 3 ventas en 180 días) o con fecha y hora visibles («precio a 20/11/2026 10:00, puede cambiar»). No rastrear amazon.es.
- **Enlaces de afiliado en emails:** Amazon no permite sus enlaces especiales en emails. Las alertas enlazan a nuestra ficha.
- Hay que **añadir el dominio nuevo y luego las apps** a la lista de sitios de tu cuenta de Afiliados (lo haces tú en el panel).

### Ley de Servicios Digitales (DSA)
Somos «plataforma en línea»: alojamos contenido de terceros y lo difundimos al público. Mientras seamos micro o pequeña empresa (< 50 personas y < 10 M€), quedan exentas muchas obligaciones (arts. 19 y 29), pero estas **sí** aplican:
- Punto de contacto para autoridades y usuarios (arts. 11–12): un email en el aviso legal.
- Condiciones de uso claras sobre qué se modera y cómo (art. 14).
- **Mecanismo de notificación** de contenido ilegal (art. 16): botón «Denunciar» en cada chollo y un formulario.
- **Motivación** de cada retirada o suspensión al afectado (art. 17): por eso existe la tabla `moderacion` con el motivo.
- Exención de responsabilidad (art. 6) si retiramos con diligencia lo ilegal cuando lo conocemos.

Aunque estemos exentos de identificar a los comerciantes (art. 30), lo haremos igualmente: los publicadores pagan con Stripe y piden factura, así que tendremos nombre y NIF.

---

## 3. Documentos legales necesarios en la web

| Documento | Para qué | Notas |
|---|---|---|
| Aviso legal (LSSI) | Identificar al titular | Nombre o razón social, NIF, dirección, email |
| Política de privacidad (RGPD/LOPDGDD) | Qué datos, para qué, base legal, plazos, derechos | Encargados: Supabase, Stripe, Resend, Cloudflare (todos ofrecen contrato de encargo y región UE o garantías) |
| Registro de actividades de tratamiento | Documento interno | Plantilla de la AEPD (herramienta «Facilita») |
| Política de cookies | Solo cookies técnicas + analítica sin cookies | **Sin banner**, siempre que no se añadan cookies publicitarias. Con publicidad, banner obligatorio |
| Condiciones de uso (todos) | Reglas, votos, reportes, suspensión | |
| **Condiciones del publicador** | Contrato de suscripción | Precio, renovación, baja, cupo, contenido prohibido, obligación de cumplir su programa de afiliados, avisos y suspensión sin reembolso por fraude, **desistimiento** |
| Condiciones de contratación | Venta a consumidores a distancia | Precio con IVA, desistimiento de 14 días y su renuncia expresa al empezar el servicio |

Los redacto como borrador en la fase de construcción. Debe revisarlos un abogado o un servicio de plantillas profesional antes de cobrar.

### IVA de servicios digitales
- Venta a consumidores en **España**: IVA del 21 %, incluido en el precio mostrado (9,95 €).
- Consumidores de **otros países de la UE**: se aplica el IVA de su país vía **ventanilla única (OSS)**. Mientras las ventas a otros países de la UE no superen **10.000 €/año** en total, puedes aplicar el IVA español. Como solo vendemos en España, esto no aplica al principio.
- Publicadores que son **empresas** de otro país de la UE con NIF-IVA válido: inversión del sujeto pasivo (factura sin IVA). Stripe Tax lo automatiza (~0,5 % por transacción), pero al principio no hace falta.

---

## 4. Pagos con Stripe

- **Productos:** «Publicador» con 4 precios recurrentes (1, 3, 6 y 12 meses) + «Destacado 24 h / 72 h» como pago único.
- **Checkout** (página de pago de Stripe), **Customer Portal** (cambiar de plan, ver facturas y darse de baja él mismo) y **facturas automáticas** con datos fiscales del cliente.
- **Sin prueba gratuita** (decisión de Vic). En el pago, casilla obligatoria de renuncia al desistimiento al empezar a publicar.
- **Bajas:** al final del periodo pagado. Sin reembolsos parciales salvo error o desistimiento válido.
- **Impagos:** Stripe reintenta el cobro. El webhook pasa la cuenta a gratuita si el pago falla definitivamente; sus chollos activos siguen hasta caducar.
- **Moneda y país:** EUR y España. Métodos: tarjeta, Apple Pay, Google Pay y Bizum, si Stripe lo ofrece en tu cuenta.
- **Qué haces tú:** crear la cuenta de Stripe, completar la verificación con tus datos fiscales y aceptar sus términos. Primero en **modo de prueba**: yo lo programo con claves de prueba que tú guardas como secretos.
