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

1. **Puerta de calidad de fichas** (`MIN_DESCRIPCION = 60` en `datos/chollos.ts`): una ficha solo es indexable y entra en el sitemap si tiene descripción real. Las demás siguen accesibles con `noindex, follow`. Es una constante: cuando haya más texto propio o Search Console confirme que Google indexa bien, se baja el umbral.
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
3. Con 3-4 semanas de datos: revisar Rendimiento (consultas, CTR) y Páginas («Rastreada, actualmente sin indexar»); si las fichas `noindex` no hacen falta, bajar `MIN_DESCRIPCION`.
4. Bing Webmaster Tools: importar la propiedad desde Search Console (opcional).
