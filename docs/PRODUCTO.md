# Documento de producto (borrador para OK de Vic)

Fecha: 20/11/2026 · Estado: **aprobado con cambios** (ver §0)

## 0. Cambios aprobados por Vic (20/11/2026, segunda ronda): mandan sobre el resto del documento

- **La plataforma es GRATUITA.** No hay cuota de publicador ni destacados de pago, de momento. Se aparcan §3 (planes y precios), la parte de pago de §2 y la Fase 6 del plan. La monetización se decide más adelante.
- **Ver chollos es público, sin cuenta.** La cuenta gratuita sirve para votar, guardar, crear alertas y reportar.
- **Se importa el catálogo actual de Vic** (`productos*.json` + `precios*.json`) como chollos oficiales.
- Nombre y logo: ver `NOMBRES_Y_LOGO.md` (pendiente de elección).
- Arquitectura recomendada aprobada: monorepo Next.js + Expo + Supabase.

### Cómo ganar dinero sin cuotas (propuesta, por orden)
1. **Chollos oficiales con tus afiliados** (Amazon, Jowua, Hansshow, Tesery y EVDANCE): es la base y no cambia nada.
2. **Chollos de la comunidad con TU afiliado** (el modelo clásico de las webs de chollos). Cualquier cuenta gratuita publica un chollo con el enlace normal de la tienda. Si la tienda está en tus programas, la plataforma pone **tu** código de afiliado y quita cualquier otro; si no, el enlace queda limpio. El usuario gana insignias y reputación, y tú la comisión. Se avisa en las condiciones y en cada chollo («Podemos ganar una comisión»). Es lo que más escala, porque la comunidad trabaja para el catálogo.
3. **Más programas de afiliados** de tiendas de accesorios Tesla con envío a España (para que el punto 2 cubra más tiendas).
4. **Más adelante:** destacados patrocinados para tiendas, newsletter patrocinada o publicidad (con banner de cookies).

Ojo, sin re-discutir lo decidido: las comisiones de afiliado ya son ingresos de actividad económica, igual que hasta ahora. Que la web sea gratuita evita cobrar cuotas a usuarios (facturas, IVA y Stripe), pero no cambia lo que ya tienes que declarar de las comisiones. Coméntalo con un gestor cuando crezcan.

## 1. Qué es

Una comunidad de chollos **solo de accesorios para Tesla** (cualquier modelo), en español y para España. Hay tres tipos de chollo:

| Tipo | Quién lo publica | Enlace | Aspecto |
|---|---|---|---|
| **Oficial** | Vic | Afiliados de Vic (Amazon `teslaaccesorios-21`, Jowua, Hansshow, Tesery, EVDANCE) | Tarjeta más vistosa + insignia propia |
| **De publicador** | Usuario de pago | Afiliado del propio publicador | Tarjeta normal + etiqueta «Enlace de afiliado de @alias» |
| **Destacado** | Publicador de pago que paga un extra | El suyo | Fijado arriba X horas, marcado «Destacado» (es publicidad y se rotula como tal) |

Tomamos la **idea** de una comunidad de chollos (temperatura, caducidad, alertas). No copiamos nombre, logo, textos, diseño ni código de ninguna web existente. La lista de funciones es genérica del sector y la redactamos nosotros.

## 2. Usuarios y permisos

| Acción | Visitante sin cuenta | Cuenta gratuita | Cuenta de pago |
|---|---|---|---|
| Ver portada, listados y fichas | **Sí** (recomendado, ver §8) | Sí | Sí |
| Votar temperatura (🔥/❄️) | No | Sí | Sí |
| Guardar chollos | No | Sí | Sí |
| Alertas (email + push) | No | Sí | Sí |
| Reportar chollo (precio mal, caducado, no Tesla, spam) | No | Sí | Sí |
| Publicar chollos con su afiliado | No | No | Sí, hasta el **cupo mensual** |
| Destacar un chollo | No | No | Sí, pago aparte |
| Comentarios | **No existen** (decisión de Vic) | — | — |

- Se publica siempre con **alias**. El nombre real y los datos fiscales solo los ve el admin.
- Sin prueba gratuita (decisión de Vic: evita cuentas duplicadas con otros correos).

## 3. Planes y precios (propuesta, IVA incluido)

| Plan | Precio | Equivale a | Ahorro |
|---|---|---|---|
| Gratuito | 0 € | — | — |
| Publicador, 1 mes | **9,95 €** | 9,95 €/mes | — |
| Publicador, 3 meses | 26,95 € | 8,98 €/mes | 10 % |
| Publicador, 6 meses | 49,95 € | 8,33 €/mes | 16 % |
| Publicador, 12 meses | 89,95 € | 7,50 €/mes | 25 % |

> Entendí «6 años» como **6 meses**. Corrígeme si no es así.

- **Cupo propuesto:** 30 chollos/mes por publicador (1 al día de media). Se ajusta con datos.
- **Destacar (propuesta):** 2,95 € por 24 h y 6,95 € por 72 h. Máximo 3 destacados a la vez en portada.
- Renovación automática y baja en un clic desde el portal de Stripe: sigue activo hasta el final del periodo pagado.
- Derecho de desistimiento de 14 días: en el pago, casilla obligatoria «quiero empezar ya y pierdo el desistimiento al publicar» (detalle en `LEGAL_Y_PAGOS.md`).

## 4. Funciones de la v1 (web)

**Chollos**
- Ficha: título, foto del producto (de la tienda enlazada, ver §7), **precio final** tras el código, precio anterior opcional, % de ahorro calculado, código de descuento con botón copiar, tienda, modelos compatibles (3, Y, S, X, Cybertruck, varios), categoría, fecha de inicio y de fin opcionales, gastos de envío a España, publicador y temperatura.
- Botón «Ir al chollo» con enlace de afiliado. Sale por `/ir/<id>` para contar clics y añadir `rel="sponsored nofollow"`.
- Avisos automáticos (el publicador no puede quitarlos):
  - Todo chollo: «Enlace de afiliado de @alias» (o «de Accesorios Tesla» en los oficiales).
  - Amazon: «En calidad de Afiliado de Amazon, @alias obtiene ingresos por las compras adscritas que cumplen los requisitos.» En los oficiales, el texto literal de Vic.
- Estados: activo → **caducado** (por fecha, por el publicador o por suficientes reportes verificados) → archivado. Lo caducado se ve en gris y no puntúa.
- Marcas de calidad: «Precio verificado» si el sistema pudo comprobarlo, y aviso rojo «Varios usuarios dicen que el precio no es correcto» cuando hay reportes.

**Temperatura**
- Un voto por cuenta y chollo (caliente +1 / frío −1), que se puede cambiar.
- La temperatura en grados es la suma ponderada: las cuentas nuevas o sin email verificado pesan menos.
- Secciones: «Lo más caliente» (24 h / 7 días), «Nuevos», «Oficiales», por categoría y por modelo.

**Insignias** (solo hechos medibles, nada inventado)
- Publicador: «Primer chollo», «10/50/100 chollos», «Chollo de 100°/500°», «Publicador del mes» (más temperatura acumulada).
- Oficial: insignia propia de la marca.

**Alertas**
- Por palabra clave, por categoría, por modelo y por precio máximo.
- Envío por email (resumen o al momento) y push web.
- Los emails enlazan a la **ficha** en la web, nunca directo al enlace de afiliado (ver regla de Amazon en `LEGAL_Y_PAGOS.md`).

**Publicar (cuenta de pago)**
- Formulario: pegar el enlace → el sistema detecta tienda, foto, título y precio cuando puede → el publicador completa precio final, código, modelos y categoría → verificación (§6) → publicado o a cola de moderación.
- Panel del publicador: cupo restante, clics por chollo, temperatura e historial.

**Admin (Vic)**
- Cola de moderación, reportes, bloqueo de dominios, suspensión de cuentas, gestión de chollos oficiales.
- Importación de chollos oficiales desde los catálogos actuales (`productos*.json`, `precios*.json`). **Pendiente de tu OK**: dijiste que Telegram y Facebook van aparte, pero reutilizar el catálogo ahorra mucho trabajo.

**Legal en la web**: aviso legal, privacidad, cookies, condiciones de uso, condiciones del publicador, formulario de denuncia (DSA) y punto de contacto.

## 5. Después de la v1

| Fase | Función |
|---|---|
| v1.1 | Destacar chollo (pago único), insignias completas, push web |
| v1.2 | Apps iOS y Android (Expo), push nativo |
| v1.3 | Historial de precio de cada producto (cuando lo tengamos de forma legal), seguimiento de un producto concreto |
| v2 | Publicidad, plan «Tienda» para marcas (ver §9), canales nuevos de Telegram y Facebook alimentados por la plataforma |
| Fuera de alcance | Comentarios, otros coches |

## 6. Control de enlaces de publicadores (resumen; detalle en `LEGAL_Y_PAGOS.md` §2)

1. **Lista blanca de tiendas.** Al principio: Amazon.es, Jowua, Hansshow, Tesery, EVDANCE, Tesla Shop y AliExpress. Una tienda nueva se pide y la aprueba el admin.
2. **Resolución de redirecciones en el servidor.** Se siguen los acortadores y las redes de afiliados (Awin, GoAffPro, etc.) hasta la URL final, que debe estar en la lista blanca. Se rechazan los acortadores que no se puedan resolver.
3. **Comprobación de seguridad** con Google Safe Browsing (gratis).
4. **Coherencia de producto.** Título y página deben contener «Tesla» o «Model 3/Y/S/X» o «Cybertruck»; si no, va a moderación manual.
5. **Precio.** Si la página publica datos estructurados de producto (schema.org), se compara con el precio declarado. Diferencia de más del 5 % → moderación. Amazon no se rastrea (lo prohíben sus condiciones), así que se queda como «precio declarado» y lo vigila la comunidad.
6. **Premoderación.** Los 5 primeros chollos de cada publicador los revisa el admin. Después se publican al momento y se revisan si hay reportes.
7. **Sanciones.** Sistema de 3 avisos. Al tercero se suspende la cuenta sin reembolso del periodo en curso (debe constar en las condiciones).

## 7. Imágenes

- Foto del producto tomada de la `og:image` de la página enlazada, que la tienda publica para compartir. Se guarda una copia reducida en nuestro almacenamiento y se cita la tienda.
- Amazon: **no** descargamos sus fotos. Las imágenes de Amazon solo se permiten mediante su API (PA-API) o SiteStripe. Hasta tener PA-API: foto subida por el publicador (con declaración de que tiene derechos sobre ella) o tarjeta sin foto con el icono de la categoría.
- Sin imágenes generadas por IA.

## 8. Decisiones que necesitan tu OK

1. **Ver sin cuenta.** Dijiste «hace falta cuenta para todo eso». Recomiendo que **ver** chollos sea público y que la cuenta solo haga falta para votar, guardar, alertas y reportar. Si las fichas piden cuenta, Google no las indexa y perdemos el tráfico gratis, que es el que genera comisiones de afiliado.
2. **Nombre y logo.** El logo que pasaste usa el emblema «T» y la palabra «TESLA» con su tipografía, que son marcas registradas de Tesla. Para un negocio de pago es un riesgo real: reclamación, cierre del dominio o retirada de las apps de Apple y Google, que revisan esto. Recomiendo un nombre y un logo propios con uso descriptivo («accesorios **para** Tesla»). Ver `ARQUITECTURA.md` §5.
3. **Importar tu catálogo actual** como chollos oficiales iniciales.
4. **Cupo** de 30 al mes y precios de destacado.

## 9. Recomendación de negocio (sinceridad)

- El mercado de publicadores de pago es pequeño: en España hay pocos creadores con afiliados de accesorios Tesla. Los ingresos de cuotas serán modestos al principio. Lo que más rinde a corto plazo son **tus** chollos oficiales con buen SEO.
- Los clientes de pago más probables son **las propias tiendas** (Jowua, Hansshow, Tesery, tiendas españolas). Propongo un plan «Tienda» en la v2 (más cupo, logo verificado, destacados incluidos), a 29–49 €/mes.
- **Otros coches:** no ampliar hasta tener tracción. Si algún día se amplía, que sea a «accesorios para coche eléctrico». Por eso conviene un nombre que no dependa de Tesla.
