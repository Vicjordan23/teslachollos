# Funciones observadas en una web de chollos de referencia

Fecha: 20/11/2026 · Método: REA 6.10.1 (`inspect-web-page`, solo DOM y árbol de accesibilidad) sobre la **portada pública** de chollometro.com, en un Chrome aislado sin sesión. `robots.txt` permite esa página.

**Qué no se hizo:** no se analizaron bundles ni código, no se capturaron peticiones a su API, no se guardaron chollos ni textos, y no se entró en zonas con sesión. Los datos en bruto quedaron fuera del repo y se borran con el scratchpad. Lo que sigue es una **lista de funciones redactada por nosotros**: no se copian nombres, textos ni diseño.

## Lo que se ve en la portada

| Función | Qué hace | ¿En Chollesla? |
|---|---|---|
| Tarjeta de chollo | Foto, título, precio, precio anterior y % de descuento, tienda, gastos de envío, fecha de publicación, autor con avatar, número de comentarios | Sí, **sin comentarios** (decisión de Vic) |
| Temperatura | Dos botones por chollo (subir / bajar) y valor en grados | Sí (v1) |
| Guardar | Marcador por chollo | Sí (v1) |
| Ir al chollo | Botón principal de salida a la tienda | Sí, por `/ir/<id>` |
| Código de descuento | Código oculto o visible y botón «copiar + ir» | Sí: el código de Vic se ve siempre, con botón copiar |
| Compartir | Botón por chollo | Sí (v1.1) |
| Filtro por tienda | Tiendas destacadas en barra lateral | Sí (pocas tiendas: lista fija) |
| Orden y secciones | «Lo más votado», novedades, destacados, carrusel horizontal | Sí: «Lo más caliente» (24 h / 7 días) y «Nuevos» |
| Buscador con sugerencias | Caja de búsqueda con autocompletado de palabras clave | Sí (v1, sin autocompletado al principio) |
| Alertas por palabra clave | Acceso directo a «mis alertas» y creación rápida desde la búsqueda | Sí (v1) |
| Categorías, cupones y gratis | Secciones por tipo | Categorías sí; cupones como tipo de chollo; «gratis» no aplica |
| Etiquetas | Local, caducado, envío, descuento | Sí: caducado, envío a España, «Desde» |
| Paginación | Primera, anterior, actual, siguiente, última | Sí |
| Perfil corto del autor | Tarjeta emergente al pasar sobre el avatar | v1.1 (con insignias) |
| Insignias | Distintivos visuales | Sí (v1.1) |
| Contador en tiempo real | Actualización de votos sin recargar | Más adelante |
| Foro de discusión, club de recompensas, temporada (Black Friday) | Comunidad y campañas | Sin foro (no hay comentarios); campañas sí, a mano |
| Widget de Telegram | Enlace a su canal | Sí: canal nuevo de Chollesla cuando exista |
| App móvil | Promoción de la app | Fase 8 |
| Publicidad y aviso de monetización en el pie | Banners y nota de afiliación | Aviso de afiliación sí; publicidad más adelante |
| Banner de cookies | Consentimiento | No hace falta mientras no haya cookies publicitarias |

## Ideas útiles para nuestro diseño (sin copiar)
- El precio, el % y la tienda tienen que verse sin abrir la ficha.
- Votar y guardar con un clic desde la lista, sin entrar.
- El código se copia y se sale a la tienda en un solo gesto.
- La creación de alertas sale de la propia búsqueda («avísame de esto»).

## Pendiente
- No se capturó una **ficha** individual: REA filtra los enlaces del DOM y habría que navegar a mano. Para la v1 basta con la portada; si hace falta, se repite con una ficha concreta.
