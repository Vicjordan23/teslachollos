# SEO de chollesla.es: guía y checklist reutilizable

Fecha: 23/11/2026 · Responsable: agente 4 (SEO) · Solo contenido real: precios finales tras código, sin estrellas ni reseñas inventadas, sin imágenes de IA.

## 1. Auditoría (23/11/2026)

Puntuación de 0 a 100 por área, medida sobre producción (`https://chollesla.es`) antes de los cambios y sobre el build local después. Los «después» se confirman en producción en la sección 6.

| Área | Antes | Qué fallaba | Después |
|---|---|---|---|
| Rastreo e indexación | 70 | `/modelo/model-s`, `model-x` y `cybertruck` (no se venden en España) con 200 y en el sitemap; 1.574 de 1.896 fichas (83 %) con la frase genérica de plantilla como descripción (riesgo de contenido fino); `http://` y `www` responden 200 en lugar de redirigir | 90 |
| Sitemap | 70 | Incluía las páginas anteriores y todas las fichas; sin `lastmod` en listados | 92 |
| Títulos y metas | 65 | Títulos de ficha con «…» (p. ej. «Organizador de almacenamiento para la… por 13,25 €»); sin imagen Open Graph salvo en fichas; sin hreflang; `<html lang="es">` | 92 |
| Datos estructurados | 60 | Organization y WebSite (con SearchAction hacia `/buscar`, bloqueada en robots), Product y BreadcrumbList solo en fichas; nada en listados | 90 |
| Contenido | 35 | Sin texto editorial en portada, categorías ni modelos; sin páginas para «accesorios Model Y Juniper», «Model 3 Highland», «chollos esta semana» ni «código descuento» | 85 |
| Enlazado interno | 55 | La versión en el menú de modelos llevaba a `/buscar` (bloqueada); sin enlaces a guías; migas solo en fichas | 88 |
| Velocidad (Core Web Vitals) | n/d | PageSpeed API sin cuota; HTML gzip de la portada 32 KB (bien) | ver sección 6 |

## 2. Qué se ha hecho

1. **Puerta de calidad de fichas**: por la mañana del 23/11 una ficha solo era indexable con descripción real (`MIN_DESCRIPCION = 60`, 322 fichas). **Por la tarde la puerta pasó a ser el texto propio generado (sección 9).** Las que no pasan siguen accesibles con `noindex, follow`.
2. **Páginas hub nuevas** (todas con más de 300 palabras útiles, FAQ visible con el mismo texto en JSON-LD, migas y enlaces internos):
   - `/modelo/model-y-juniper` y `/modelo/model-3-highland`: introducción, compatibilidad, resumen real (nº de productos, precio mínimo y máximo, tiendas), una tira por categoría y FAQ.
   - `/modelo/<versión>/<categoría>`: 24 páginas largas de cola (p. ej. «Alfombrillas para Model Y Juniper»). Solo se generan con 8 o más productos reales.
   - `/chollos-tesla-esta-semana`: los 18 con más descuento y los 18 de 20 € o menos, solo con precio revisado en los últimos 7 días.
   - `/codigos-descuento` y `/codigos-descuento/<tienda>` (Hansshow, Jowua, Tesery, EVDANCE): código, porcentaje real, ejemplo con un producto real, productos con más descuento y FAQ.
3. **Categorías, modelos y tiendas**: texto de consejo de compra por categoría, enlaces a las páginas por versión, migas y `CollectionPage` + `ItemList`.
4. **Fichas**: título sin puntos suspensivos, bloque «Datos de este chollo» (tienda, precio de tienda, código y % reales, compatibilidad con enlaces a los hubs, fecha de revisión), `isAccessoryOrSparePartFor` con las versiones compatibles cuando no es universal, descripción de respaldo en el JSON-LD.
5. **Técnico**: `metaPagina()` (canonical propio, hreflang `es-ES` y `x-default`, Open Graph y Twitter con imagen en todas las páginas), imagen Open Graph propia (`public/og-chollesla.png`, logo dibujado a mano sobre HTML, sin IA), `<html lang="es-ES">`, sitemap con `lastmod` real y solo URL indexables, `robots.txt` sin cambios de fondo, `llms.txt` opcional, fuera Model S, Model X y Cybertruck, fuera el SearchAction.
6. **Enlazado**: menú superior («Esta semana», «Códigos»), pie con guías, portada con texto y FAQ, el menú de modelos lleva a los hubs de versión.

## 3. Checklist reutilizable (antes de publicar cualquier página nueva)

**Intención y calidad**
- [ ] ¿Responde a una búsqueda real? (modelo + accesorio, «código descuento X», «chollos esta semana»).
- [ ] Más de 300 palabras útiles propias (no solo la rejilla) y al menos 30-40 % distinto de la página hermana.
- [ ] Datos reales calculados del catálogo (conteos, mínimo y máximo, fecha de revisión). Nada de «solo hoy».
- [ ] Mínimo de productos (8) para páginas de cola; si no llega, no se genera.
- [ ] Sin puntuaciones, estrellas ni reseñas. Opiniones solo si son resúmenes de compradores reales.

**Etiquetas**
- [ ] `<title>` único, 50-65 caracteres, sin «…»: `acortarSinPuntos()`. Marca al final (la plantilla añade « · Chollesla»).
- [ ] Meta descripción única, 120-158 caracteres, con dato real (precio, nº de productos, código).
- [ ] `metaPagina()` en la página: canonical propio, hreflang `es-ES` + `x-default`, Open Graph y Twitter con imagen.
- [ ] Un solo `<h1>` que coincide con la intención.

**Datos estructurados** (siempre con `JsonLd`, que escapa `<`)
- [ ] Ficha: `Product` + `Offer` (precio final EUR, `itemCondition`, `seller`) + `BreadcrumbList`. Sin `aggregateRating` ni `review`.
- [ ] Listados y hubs: `CollectionPage` + `ItemList` + `BreadcrumbList`. **No** se marca un listado como `Product` ni se usa `AggregateOffer`: solo valdría con varias ofertas reales del mismo producto (hoy no hay).
- [ ] `FAQPage` solo con preguntas visibles y el mismo texto (`<Faq>`).
- [ ] Todo campo coincide con lo que se ve en la página.

**Enlazado**
- [ ] Migas visibles (`<Migas>`) y entrada en el pie o el menú si es un hub.
- [ ] Cada ficha enlaza a su categoría, a sus hubs de versión y, si hay código, a `/codigos-descuento/<tienda>`.
- [ ] Cada hub enlaza a sus fichas y a los otros hubs. Anclas descriptivas y variadas.

**Enlaces de salida y avisos**
- [ ] Enlaces de afiliado con `rel="sponsored nofollow noopener"`; cada tienda con SU enlace (nunca mezclar).
- [ ] Aviso de afiliados visible en el pie de todas las páginas, con el texto literal de Amazon.

**Indexación**
- [ ] Entra en `sitemap.ts` solo si es indexable y devuelve 200. Las páginas `noindex` no entran.
- [ ] Rutas inexistentes: 404 real (`dynamicParams = false`).
- [ ] Sin parámetros en las URL de contenido; `/buscar` y `/ir/` bloqueadas en robots.

**Rendimiento**
- [ ] Solo las 3 primeras fotos con `priority`; el resto perezosas. Imágenes con tamaño reservado (sin CLS).
- [ ] Sin scripts de terceros antes del consentimiento de cookies (GTM carga al aceptar).

## 4. Plantillas

**Ficha** `/chollo/<slug>`: `{producto} por {precio final}` · «{producto}: {precio} (-{n} %) con el precio final ya calculado usando el código {CÓDIGO} en {tienda}. Compatible con {modelos}.» Contenido: foto, precio final, precio tachado, código, bloque de datos, relacionados.

**Hub de versión** `/modelo/{versión}`: «Accesorios para {versión completa}: {n} chollos» · introducción de 3 párrafos, resumen real, una tira por categoría, FAQ de 4 preguntas.

**Versión × categoría** `/modelo/{versión}/{categoría}`: «{Categoría} para {versión}: {n} opciones desde {mínimo}» · consejo de compra de la categoría, nota de compatibilidad de la versión, resumen real, hasta 36 productos, FAQ con precios y tiendas reales.

**Código de descuento** `/codigos-descuento/{tienda}`: «Código descuento {tienda} {CÓDIGO}: {n} % en accesorios Tesla» · código con botón copiar, cómo funciona, ejemplo con un producto real del catálogo, avisos honestos (envío, un código por pedido), productos con más descuento, FAQ.

**Chollos de la semana**: ordenados por descuento real (código) y por precio; solo productos con precio revisado en 7 días; se regenera con la importación diaria.

## 5. Palabras clave y SERP (observación manual, 23/11/2026)

- Intención dominante en «accesorios Model Y Juniper»: colecciones de tiendas especializadas (Tesery, Teslaunch, Shop4Tesla, Green Drive). Todas insisten en que alfombrillas, protectores de pantalla y piezas de exterior son específicas de cada generación: por eso las páginas de versión × categoría llevan la nota de compatibilidad.
- «Código descuento Tesery/Hansshow/Jowua»: resultados mezclados con códigos de terceros y de hace años. Nuestra ventaja es mostrar solo códigos propios con el precio final calculado y fecha de revisión.
- Sin volúmenes de búsqueda (no hay herramienta de pago conectada): priorizar por intención y revisar en Search Console tras 3-4 semanas qué consultas aparecen.

## 6. Verificación en producción

Comprobado el 23/11/2026 con `curl` sobre `https://chollesla.es` tras el despliegue (commit 22af959):

- `robots.txt` y `sitemap.xml` (374 URL: hubs, 24 paginas de version x categoria, codigos, fichas indexables) responden 200; `og-chollesla.png` y `llms.txt` 200.
- 13 URL nuevas o cambiadas dan 200 (`/modelo/model-s` y `/modelo/<version>/otros` dan 404). Un `<h1>` por pagina, canonical propio, descripcion de 134-158 caracteres, titulos unicos sin «...».
- Palabras utiles en `<main>`: hubs y paginas de version x categoria 1.900-2.300; `/codigos-descuento/<tienda>` 930-1.740; `/codigos-descuento` 498.
- JSON-LD valido (se parsea con `json.loads`) y coherente con la pagina: Product (fichas), CollectionPage + ItemList, BreadcrumbList y FAQPage con el mismo texto visible.
- Pendiente de comprobar por Vic o en la siguiente vuelta: errores de consola en Chrome y Lighthouse/CrUX (la API de PageSpeed no tenia cuota). El HTML gzip de la portada pesa 32 KB.

## 7. Enlazado desde y hacia el canal `t.me/teslaaccesorios`

- **Hacia el canal** (hecho): banner superior, botón en la cabecera y línea en el pie.
- **Desde el canal** (otro agente / Vic): poner `https://chollesla.es` en la descripción del canal y en el mensaje fijado; que las publicaciones enlacen a `/chollo/<slug>` solo cuando la decisión de Vic lo permita; usar las páginas hub como enlace del mensaje fijado (`/chollos-tesla-esta-semana`, `/codigos-descuento`).

## 8. Pasos manuales de Vic

1. Search Console (propiedad `chollesla.es` ya verificada): enviar de nuevo `https://chollesla.es/sitemap.xml` tras el despliegue y usar «Inspección de URL» + «Solicitar indexación» en `/modelo/model-y-juniper`, `/modelo/model-3-highland`, `/chollos-tesla-esta-semana` y `/codigos-descuento`.
2. Cloudflare → SSL/TLS → Edge Certificates → activar «Always Use HTTPS» (hoy `http://chollesla.es` responde 200) y una regla de redirección `www.chollesla.es/*` → `https://chollesla.es/$1` (301).
3. Con 3-4 semanas de datos: revisar Rendimiento (consultas, CTR) y Páginas («Rastreada, actualmente sin indexar»); si las 1.262 fichas de la oleada 1 se indexan bien, pasar `OLEADA_INDEXACION` a 2 (sección 9.1). Tras el despliegue del texto propio: reenviar `sitemap.xml` y pedir indexación de 5-10 fichas de ejemplo.
4. Bing Webmaster Tools: importar la propiedad desde Search Console (opcional).

## 9. Texto propio por ficha (23/11/2026, tarde)

**Qué es.** Cada ficha (1.896) muestra ahora entre 200 y 250 palabras de texto propio (el mínimo exigido es 120) y 3 preguntas frecuentes, generados **en el build** por una función pura: `generarTextoFicha()` en `packages/core/src/texto-ficha.ts` (18 tests). Nada se guarda en `oficiales.json` (el importador diario lo reescribe): `apps/web/src/datos/textos.ts` llama al generador con `CHOLLOS` y las opiniones, y la página `/chollo/<slug>` lo pinta bajo «Qué debes saber antes de comprarlo» (h2, un h3 por bloque) más un `<Faq>` visible con el mismo texto en JSON-LD. `Product.description` del JSON-LD es el primer párrafo visible. Sin AggregateRating ni reviews.

**Solo datos reales.** Entradas: título (decodificando `&amp;`), compatibilidad que declara la tienda (se cita entre «») y su clasificación en versiones, categoría, tienda, precio de tienda y final con el código, «desde», fecha de revisión, estadísticas del propio catálogo (nº de productos de la categoría, mínimo, máximo, mediana, puesto por precio, tercio, comparación con la misma versión y la misma tienda, otras tiendas con la categoría) y, si existen, opiniones reales de compradores de Amazon.es (`datos/opiniones.json`, 37 productos, copia del opiniones.json del agente de Telegram; el texto se marca «no una valoración de Chollesla»). Del título solo se extraen datos que están escritos en él (piezas, kW/A/m/pulgadas, materiales y características de un léxico cerrado, color) y se atribuyen al título de la tienda. Los consejos de compra por categoría son comprobaciones («mira que…»), nunca afirmaciones sobre el producto; en las categorías donde la clasificación automática falla a veces (alfombrillas, carga) van en condicional («Si es un cargador…»). El envío UE de EVDANCE y la comisión de afiliado se dicen tal cual. No hay especificaciones, materiales ni compatibilidades inventados, ni «solo hoy», ni puntuaciones.

**Variación real.** 3 variantes del resumen, 3 del bloque de precio, 2-3 del bloque de compra por tipo de tienda (con código, Amazon, AliExpress), 3 consejos por cada una de las 12 categorías, 2 órdenes de bloques, bloques condicionales (título, opiniones, historial, «desde», EVDANCE) y, sobre todo, las cifras y citas propias de cada ficha. La variante se elige con un hash del id: es estable entre builds. Si el texto pasa de 250 palabras se acorta primero el bloque de precio y luego se quitan bloques de menor prioridad.

**Historial de precios.** El generador acepta `historial` (cambio de precio registrado) y lo añade como bloque si existe, pero **hoy no está conectado**: `historial_precios.json` vive en tesla-telegram y el importador no lo trae. Pendiente (ver HANDOFF).

### 9.1 Puerta de indexación

`fichaIndexable()` (`datos/textos.ts`) devuelve true si: el texto valida (120-250 palabras, sin `undefined/NaN/null`, sin HTML ni llaves, sin puntuación rota, 2-3 FAQ completas), no es casi duplicado de otra ficha de la misma categoría y tienda (Jaccard de shingles de 5 palabras >= 0,8; de cada pareja se indexa la de slug menor), no está en «Otros» salvo con descripción real, **y entra en la oleada vigente**. `OLEADA_INDEXACION = 1`: solo fichas con algún dato propio además del precio (descripción real, datos citados en el título u opinión de compradores). Pasar a `2` indexa todas las que pasan la puerta; hacerlo cuando Search Console confirme que Google indexa bien la oleada 1 (sin «Rastreada, actualmente sin indexar» en masa).

| | Fichas |
|---|---|
| Fichas del catálogo | 1.896 |
| Con texto propio válido | 1.896 |
| Casi duplicadas (>= 0,8; mismo producto dado de alta dos veces) | 6 pares (una de cada par se queda en noindex) |
| **Indexables ahora (oleada 1)** | **1.262** (antes 322): Amazon 197, Jowua 149, Hansshow 338, Tesery 413, EVDANCE 11, AliExpress 154 |
| Indexables con la oleada 2 | 1.803 |

### 9.2 Informe de unicidad

`node scripts/informe-unicidad.mjs` (tras `npm run build -w packages/core`; opciones `--oleada=2`, `--muestra=slug1,slug2`). No va en `npm test` porque depende del catálogo, que cambia cada día (bloquearía la importación diaria). Medido con los datos del 23/11/2026; similitud = Jaccard de shingles de 5 palabras:

| Conjunto de pares | Pares | Media | P95 | Máx. | % por debajo de 0,5 | Pares >= 0,8 |
|---|---|---|---|---|---|---|
| Misma categoría y tienda, **todas** las fichas (antes de la puerta) | 60.589 | 0,338 | 0,494 | 0,837 | 95,4 % | 6 |
| Misma categoría y tienda, **indexables** | 27.382 | 0,333 | 0,489 | 0,783 | 95,8 % | **0** |
| Misma categoría (cualquier tienda), indexables | 87.437 | 0,231 | 0,418 | 0,783 | 98,7 % | **0** |
| Misma tienda (cualquier categoría), indexables | 184.199 | 0,293 | 0,420 | 0,783 | 99,1 % | **0** |

Los 6 pares >= 0,8 son el mismo producto dado de alta dos veces con título casi igual (dos protectores de silicona de AliExpress con distinto id, dos volantes Yoke de Hansshow…). Longitud: mínimo 201, mediana 239, máximo 250 palabras. Limitación honesta: la unicidad medida es léxica; el texto es útil, pero lo original lo aportan los datos (título citado, cifras de precio, posición en el catálogo, compatibilidad declarada) y no un análisis experto de cada producto. Por eso la indexación es progresiva.

### 9.3 Revisión manual de 10 fichas reales

Se leyó el texto completo y se contrastó cada afirmación con los datos de origen: Amazon / pantalla (`protector-de-pantalla-mate-spigen-ez-fit-15-4`, con opinión), Amazon / alfombrillas (`alfombrillas-completas-3w-para-model-y-juniper`, con opinión), Jowua / carga (`compresor-de-aire-portatil-con-kit-de-carga-jowua`), Jowua / interior (`pack-completo-de-parasoles-para-model-y-juniper-jowua`), Hansshow / volante (`model-3-y-carbon-fiber-steering-wheel-d-shaped-round-…`), Hansshow / iluminación (`model-3-y-led-illuminated-welcome-pedal-door-sill-protector`), Tesery / alfombrillas (`oem-wheel-arch-liner-for-tesla-model-y-model-y-juniper`), Tesery / organización (`kit-de-ganchos-de-almacenamiento-interior-para-tesla-model-3-premium-2`), EVDANCE / carga (`evdance-wallbox-11-kw-tipo-2-trifasica-16-a-con-wifi-bluetooth-y-rfid`) y AliExpress / alfombrillas (`teksy-1-2-3-4-6-7-8-piezas-…-022854`). Todas las cifras (precio final, descuento, ahorro, puestos, mínimos, máximos, medianas, piezas, kW) salen de los datos o del catálogo.

Defectos encontrados en la revisión y corregidos: 2 títulos con `&amp;`; «3W» (marca) leído como potencia; «fibra de carbono y carbono» repetido; consejo de cargadores aplicado a un compresor mal clasificado como Carga (ahora condicional); títulos recortados con palabras colgando; concordancia de «pensado según la tienda»; porcentaje absurdo (701 %) en un wallbox (ahora «unas 8,0 veces la mediana»); compatibilidad vacía (ahora se dice que la tienda no la detalla).

### 9.4 Cómo cambiar el criterio

- Indexar todas las válidas: `OLEADA_INDEXACION = 2` en `apps/web/src/datos/textos.ts`.
- Volver a la puerta antigua: en `fichaIndexable`, devolver solo `c.descripcion.trim().length >= MIN_DESCRIPCION`.
- Umbral de duplicado: `UMBRAL_DUPLICADO` en `packages/core/src/texto-ficha.ts`.

### 9.5 Verificación en producción (23/11/2026)

Tras el despliegue del commit 4a6e24b: `sitemap.xml` con 1.314 URL (1.262 fichas, sin duplicados, bien formado, muy por debajo de 50.000). 8 fichas de ejemplo (Amazon, Jowua, Hansshow, Tesery, EVDANCE, AliExpress): 200, un solo `h1`, canonical propio, sin `noindex`, presentes en el sitemap, texto visible, sin `undefined/NaN`, JSON-LD parseable (Product, BreadcrumbList, FAQPage; sin AggregateRating). Pendiente de Vic: errores de consola en Chrome.
