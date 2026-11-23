import type { IdCategoria, IdVersion, PreguntaFrecuente } from "@chollesla/core";
import type { IdOrden } from "@/datos/chollos";

/**
 * Guías de compra (páginas editoriales). El texto son consejos generales verdaderos para cualquier unidad;
 * los números (productos, precios, fechas) y los productos de cada bloque se calculan en la página con el catálogo real.
 * Sin puntuaciones ni opiniones inventadas: no hay rankings de «mejores», solo una selección con precio final.
 */

export interface BloqueGuia {
  titulo: string;
  /** Texto breve bajo el título (consejo de compra de la categoría, por ejemplo). */
  texto?: string;
  version?: IdVersion;
  categoria?: IdCategoria;
  /** Precio final máximo en euros. */
  maxEuros?: number;
  orden?: IdOrden;
}

export interface Guia {
  slug: string;
  /** Título de la página (SEO). */
  titulo: string;
  h1: string;
  descripcion: string;
  /** Frase para la tarjeta del índice de guías. */
  resumen: string;
  intro: string[];
  comoElegir: string[];
  bloques: BloqueGuia[];
  preguntas: PreguntaFrecuente[];
  /** Versión a la que se refiere la guía, para enlazar al hub. */
  version?: IdVersion;
}

const PREGUNTA_CODIGO: PreguntaFrecuente = {
  pregunta: "¿Por qué el precio es menor que en la web de la tienda?",
  respuesta:
    "Porque mostramos el precio final: el de la tienda con su código de descuento ya aplicado (por ejemplo Hansshow y EVDANCE un 20 %, Jowua y Tesery un 5 %). Amazon y AliExpress no tienen código. Confirma siempre el importe en la tienda antes de pagar, porque los precios cambian.",
};

const PREGUNTA_AFILIADO: PreguntaFrecuente = {
  pregunta: "¿Los enlaces son de afiliado?",
  respuesta:
    "Sí. Si compras desde uno de nuestros enlaces, la tienda nos paga una pequeña comisión y a ti no te cuesta nada más. Es lo que mantiene la web gratuita. Los productos se eligen por el catálogo y el precio, no por la comisión.",
};

export const GUIAS: Guia[] = [
  {
    slug: "accesorios-imprescindibles-model-y-juniper",
    titulo: "Accesorios imprescindibles para Tesla Model Y Juniper: guía de compra",
    h1: "Qué accesorios comprar para tu Tesla Model Y Juniper",
    descripcion:
      "Guía para elegir los primeros accesorios del Model Y Juniper: alfombrillas, protector de pantalla, carga y organización, con el precio final y qué comprobar antes de comprar.",
    resumen: "Por dónde empezar con el Model Y Juniper: alfombrillas, pantalla, carga y organización, en orden de prioridad.",
    version: "model-y-juniper",
    intro: [
      "Si acabas de recibir tu Model Y Juniper, la renovación que se vende desde 2025, la pregunta habitual es por dónde empezar. Esta guía ordena los accesorios por prioridad: primero lo que protege el coche, después lo que organiza el día a día y al final los extras.",
      "Nuestro orden recomendado es este: alfombrillas a medida, protector de pantalla, cable o cargador para casa, organizadores de consola y maletero, y por último soportes e iluminación. Es una opinión de compra, no un ranking de calidad: cada producto viene de una tienda real y lo mostramos con su precio final tras el código de descuento.",
    ],
    comoElegir: [
      "Comprueba que la ficha nombre el Model Y Juniper o indique 2025 en adelante. Un accesorio del Model Y de 2020 a 2024 puede no encajar.",
      "Alfombrillas, protectores de pantalla y embellecedores van a medida. Compara el juego completo (plazas delanteras, traseras, maletero y frunk) y no solo el precio.",
      "En cables y cargadores, el conector en Europa es Tipo 2. Mira la potencia que admite tu coche y la longitud del cable.",
      "Si dos productos cuestan parecido, elige la tienda con devolución clara: cambiar una pieza que no encaja es mucho más fácil.",
      "Fíjate en la fecha de revisión del precio de cada ficha: los precios cambian y conviene confirmar el importe en la tienda.",
    ],
    bloques: [
      { titulo: "Alfombrillas para Model Y Juniper", version: "model-y-juniper", categoria: "alfombrillas" },
      { titulo: "Protectores de pantalla para Model Y Juniper", version: "model-y-juniper", categoria: "pantalla" },
      { titulo: "Carga para Model Y Juniper", version: "model-y-juniper", categoria: "carga" },
      { titulo: "Organización para Model Y Juniper", version: "model-y-juniper", categoria: "organizacion" },
      { titulo: "Soportes para Model Y Juniper", version: "model-y-juniper", categoria: "soportes" },
      { titulo: "Iluminación para Model Y Juniper", version: "model-y-juniper", categoria: "iluminacion" },
    ],
    preguntas: [
      {
        pregunta: "¿Qué accesorio compro primero para el Model Y Juniper?",
        respuesta:
          "Las alfombrillas a medida y un protector de pantalla: son lo que más protege desde el primer día y lo más difícil de reponer si el coche ya tiene marcas. Después, un cable de carga adecuado si vas a cargar en casa.",
      },
      {
        pregunta: "¿Valen los accesorios del Model Y de 2020 a 2024?",
        respuesta:
          "Los universales (soportes genéricos, cargadores, organizadores sueltos) suelen valer. Lo que va a medida, como alfombrillas, protectores de pantalla y piezas de exterior, suele ser específico de cada generación. Comprueba el año en la ficha.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
  {
    slug: "accesorios-imprescindibles-model-3-highland",
    titulo: "Accesorios imprescindibles para Tesla Model 3 Highland: guía de compra",
    h1: "Qué accesorios comprar para tu Tesla Model 3 Highland",
    descripcion:
      "Guía para elegir los primeros accesorios del Model 3 Highland: alfombrillas, protector de pantalla, carga y organización, con el precio final y qué comprobar antes de comprar.",
    resumen: "Por dónde empezar con el Model 3 Highland: alfombrillas, pantalla, carga y organización, en orden de prioridad.",
    version: "model-3-highland",
    intro: [
      "El Model 3 Highland, el Model 3 renovado que se vende desde 2024, cambió el frontal, la iluminación y buena parte del interior, incluida una pantalla para los pasajeros de atrás. Por eso muchos accesorios pensados para el Model 3 anterior ya no encajan y conviene elegir con cuidado.",
      "Esta guía sigue el orden que recomendamos: alfombrillas a medida, protector de pantalla, cable o cargador para casa, organizadores de consola y maletero, y al final soportes e iluminación. Es una opinión de compra, no un ranking de calidad: mostramos cada producto con su precio final tras el código de descuento de la tienda.",
    ],
    comoElegir: [
      "Comprueba que la ficha nombre el Model 3 Highland o indique 2024 en adelante. Un accesorio del Model 3 anterior puede no encajar.",
      "Las piezas a medida (alfombrillas, protectores de pantalla, embellecedores) cambian con la renovación. Si el producto no indica año, desconfía.",
      "Si quieres proteger también la pantalla de atrás, busca protectores que la mencionen de forma expresa.",
      "En cables y cargadores, el conector en Europa es Tipo 2. Revisa la potencia que admite tu coche y la longitud del cable.",
      "Mira la fecha de revisión del precio de cada ficha y confirma el importe en la tienda antes de pagar.",
    ],
    bloques: [
      { titulo: "Alfombrillas para Model 3 Highland", version: "model-3-highland", categoria: "alfombrillas" },
      { titulo: "Protectores de pantalla para Model 3 Highland", version: "model-3-highland", categoria: "pantalla" },
      { titulo: "Carga para Model 3 Highland", version: "model-3-highland", categoria: "carga" },
      { titulo: "Organización para Model 3 Highland", version: "model-3-highland", categoria: "organizacion" },
      { titulo: "Soportes para Model 3 Highland", version: "model-3-highland", categoria: "soportes" },
      { titulo: "Iluminación para Model 3 Highland", version: "model-3-highland", categoria: "iluminacion" },
    ],
    preguntas: [
      {
        pregunta: "¿Qué accesorio compro primero para el Model 3 Highland?",
        respuesta:
          "Las alfombrillas a medida y un protector de pantalla. Después, el cable de carga si vas a cargar en casa y un organizador para la consola, que es donde más se acumulan las cosas.",
      },
      {
        pregunta: "¿Valen los accesorios del Model 3 de 2017 a 2023?",
        respuesta:
          "Los universales suelen valer. Lo que va a medida (alfombrillas, protectores, embellecedores y exterior) suele ser específico de cada generación porque el Highland rediseñó el interior. Comprueba el año en la ficha.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
  {
    slug: "accesorios-tesla-baratos-menos-de-20-euros",
    titulo: "Accesorios Tesla baratos: los mejores precios por menos de 20 €",
    h1: "Accesorios para Tesla por menos de 20 €",
    descripcion:
      "Accesorios para Tesla Model 3 y Model Y por 20 € o menos, con el precio final tras el código de descuento. Qué merece la pena comprar barato y qué no.",
    resumen: "Accesorios Tesla por 20 € o menos, con el precio final y consejos para no tirar el dinero.",
    intro: [
      "Hay accesorios para Tesla muy baratos que cumplen y otros que solo son baratos. Esta guía reúne los de 20 € o menos con el precio final tras el código de descuento, para que compares sin hacer cuentas.",
      "Una pauta general: lo universal y sencillo (organizadores, soportes, cables cortos, pequeños detalles) suele salir bien por poco dinero. Lo que va a medida o toca la seguridad merece más cuidado: ahí conviene mirar la ficha entera y la política de devolución de la tienda.",
    ],
    comoElegir: [
      "Lee la descripción completa: un precio bajo no compensa si el producto no indica para qué modelo y año está pensado.",
      "En las tiendas generalistas, comprueba que el envío y la devolución son claros antes de pedir. Un envío caro anula el ahorro.",
      "Para lo que toca la carga o la electricidad, no escatimes: elige productos que indiquen conector y potencia.",
      "Compra por categorías y no por impulso: con 20 € se resuelven varias cosas pequeñas, pero no todas a la vez.",
    ],
    bloques: [
      { titulo: "Los más baratos con descuento", maxEuros: 20, orden: "descuento" },
      { titulo: "Organización por 20 € o menos", maxEuros: 20, categoria: "organizacion" },
      { titulo: "Soportes por 20 € o menos", maxEuros: 20, categoria: "soportes" },
      { titulo: "Iluminación por 20 € o menos", maxEuros: 20, categoria: "iluminacion" },
      { titulo: "Interior por 20 € o menos", maxEuros: 20, categoria: "interior" },
    ],
    preguntas: [
      {
        pregunta: "¿Merece la pena comprar accesorios Tesla baratos?",
        respuesta:
          "Depende del tipo. Los universales y sencillos suelen compensar. Para piezas a medida o relacionadas con la carga, compara bien la ficha y la política de devolución: lo barato que no encaja sale caro.",
      },
      {
        pregunta: "¿Cómo sé si encaja con mi Tesla?",
        respuesta:
          "Mira el modelo y el año que indica la ficha. Para el Model 3 de 2024 en adelante (Highland) y el Model Y de 2025 en adelante (Juniper), muchos accesorios cambian respecto a la generación anterior.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
  {
    slug: "cargadores-y-cables-para-tesla",
    titulo: "Cargadores y cables para Tesla Model 3 y Model Y: guía de compra",
    h1: "Cargadores y cables para Tesla: cómo elegir",
    descripcion:
      "Cómo elegir cable, cargador y adaptadores para tu Tesla Model 3 o Model Y en España: conector Tipo 2, potencia y longitud, con precio final y ofertas.",
    resumen: "Cable Tipo 2, cargador portátil y adaptadores: qué mirar antes de comprar y opciones con precio final.",
    intro: [
      "Elegir un cable o un cargador para el Tesla parece sencillo hasta que aparecen siglas, amperios y longitudes. Esta guía resume lo que importa y reúne las opciones del catálogo con el precio final.",
      "En Europa el conector de carga en corriente alterna es el Tipo 2. Lo que cambia de un producto a otro es la potencia que admite, la longitud del cable, si es monofásico o trifásico y cuánto aguanta a la intemperie. La potencia a la que carga tu coche en corriente alterna depende de él y de la instalación: consúltalo en el manual del vehículo y en la ficha técnica de tu instalación.",
    ],
    comoElegir: [
      "Conector: Tipo 2 para la carga en corriente alterna en Europa. Comprueba que el producto lo indique.",
      "Potencia: un cable que admite más de lo que tu coche o tu instalación pueden dar no carga más rápido; solo te sobra margen.",
      "Longitud: mide la distancia entre la toma y el puerto de carga. Un cable muy largo estorba y uno corto te obliga a aparcar de una manera concreta.",
      "Uso: si lo vas a dejar fuera, busca el grado de protección que indique la ficha y no improvises con alargadores domésticos.",
      "Instalación en casa: para un punto de carga fijo, consulta a un instalador autorizado. Esta guía no sustituye ese consejo.",
    ],
    bloques: [
      { titulo: "Carga para Model Y Juniper", version: "model-y-juniper", categoria: "carga" },
      { titulo: "Carga para Model 3 Highland", version: "model-3-highland", categoria: "carga" },
      { titulo: "Cargadores y cables con más descuento", categoria: "carga", orden: "descuento" },
      { titulo: "Cargadores y cables más baratos", categoria: "carga", orden: "barato" },
    ],
    preguntas: [
      {
        pregunta: "¿Qué conector necesito para cargar un Tesla en España?",
        respuesta:
          "Para la carga en corriente alterna, un cable Tipo 2, que es el estándar europeo. En las estaciones de carga rápida en corriente continua se usa el cable de la propia estación.",
      },
      {
        pregunta: "¿Un cable de más potencia carga más rápido?",
        respuesta:
          "No. La velocidad la limitan el cargador de a bordo del coche y la instalación. Un cable que admite más potencia solo te da margen, no velocidad.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
  {
    slug: "alfombrillas-para-tesla-model-3-y-model-y",
    titulo: "Alfombrillas para Tesla Model 3 y Model Y: guía para elegir bien",
    h1: "Alfombrillas para Tesla Model 3 y Model Y: cómo elegir",
    descripcion:
      "Cómo elegir alfombrillas para tu Tesla Model 3 o Model Y: ajuste a medida, material, plazas y maletero, con el precio final y opciones por versión.",
    resumen: "Ajuste a medida, material y qué juego comprar para el Model 3 y el Model Y, con precios finales.",
    intro: [
      "Las alfombrillas son el accesorio que más se nota con el uso diario: protegen la moqueta del barro y del agua y se limpian en un momento. Pero el suelo de cada generación es distinto, y una alfombrilla que no encaja se mueve y se arruga.",
      "Antes de comprar, decide si quieres solo las de las plazas delanteras o el juego completo con traseras, maletero y frunk. Algunas tiendas venden las piezas por separado y otras en pack: compara el total, no el precio de una pieza.",
    ],
    comoElegir: [
      "Versión: el Model 3 Highland (2024 en adelante) y el Model Y Juniper (2025 en adelante) cambian respecto a las generaciones anteriores. Comprueba el año en la ficha.",
      "Ajuste: las alfombrillas a medida cubren los bordes y las zonas de pedal; las universales dejan huecos.",
      "Material: las de TPE o goma son flexibles, fáciles de lavar y retienen agua y barro; las de tela quedan más discretas pero se ensucian antes.",
      "Contenido del juego: plazas delanteras, traseras, maletero y frunk. Cuenta cuántas piezas lleva el pack.",
      "Sujeción: busca anclajes o un reverso antideslizante para que no se desplace bajo el pedal.",
    ],
    bloques: [
      { titulo: "Alfombrillas para Model Y Juniper", version: "model-y-juniper", categoria: "alfombrillas" },
      { titulo: "Alfombrillas para Model 3 Highland", version: "model-3-highland", categoria: "alfombrillas" },
      { titulo: "Alfombrillas con más descuento", categoria: "alfombrillas", orden: "descuento" },
      { titulo: "Alfombrillas más baratas", categoria: "alfombrillas", orden: "barato" },
    ],
    preguntas: [
      {
        pregunta: "¿Qué es mejor, alfombrilla de goma o de tela?",
        respuesta:
          "Depende del uso. La goma o TPE se lava en segundos y aguanta el agua y el barro. La tela queda más fina y discreta pero se ensucia antes y cuesta más de limpiar.",
      },
      {
        pregunta: "¿Valen las alfombrillas del Model Y antiguo para el Juniper?",
        respuesta:
          "Normalmente no. Las alfombrillas van a medida y el suelo cambió con la renovación. Comprueba que la ficha indique tu versión y año.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
  {
    slug: "organizadores-y-almacenaje-para-tesla",
    titulo: "Organizadores y almacenaje para Tesla: consola, maletero y frunk",
    h1: "Organizadores y almacenaje para tu Tesla",
    descripcion:
      "Organizadores de consola, maletero y frunk para Tesla Model 3 y Model Y: cómo elegir los que encajan y opciones con el precio final.",
    resumen: "Organizadores de consola, maletero y frunk: qué encaja y opciones con precio final.",
    intro: [
      "Un Tesla tiene pocos huecos a la vista: la consola central, los laterales del maletero y el frunk. Si no los organizas, las cosas acaban rodando por el coche. Un buen organizador es de los accesorios que más se agradecen con el tiempo.",
      "La clave es el ajuste: los moldeados a medida aprovechan huecos concretos de cada generación, y los cajones o bolsas genéricos valen para casi cualquier versión. Elige según lo que quieras guardar.",
    ],
    comoElegir: [
      "Decide primero qué quieres guardar (cables, botellas, herramientas, la compra) y busca el hueco donde lo quieres.",
      "Los organizadores de consola suelen ser específicos de cada generación: comprueba el año de la ficha.",
      "En el maletero y el frunk, los cajones plegables o con tapa dan más flexibilidad que los moldeados.",
      "Revisa el material: los rígidos protegen mejor, los de tela pesan menos y se pliegan.",
      "Si tu coche tiene los asientos traseros abatibles, comprueba que el organizador no los bloquea.",
    ],
    bloques: [
      { titulo: "Organización para Model Y Juniper", version: "model-y-juniper", categoria: "organizacion" },
      { titulo: "Organización para Model 3 Highland", version: "model-3-highland", categoria: "organizacion" },
      { titulo: "Organizadores con más descuento", categoria: "organizacion", orden: "descuento" },
      { titulo: "Organizadores más baratos", categoria: "organizacion", orden: "barato" },
    ],
    preguntas: [
      {
        pregunta: "¿Los organizadores de consola valen para todos los Tesla?",
        respuesta:
          "No siempre. La consola cambió con las renovaciones del Model 3 y del Model Y, y los moldeados a medida son específicos. Los cajones genéricos sí valen para casi cualquier versión.",
      },
      {
        pregunta: "¿Qué organizador es mejor para el maletero?",
        respuesta:
          "Depende de lo que lleves. Un cajón plegable con tapa es versátil; uno moldeado aprovecha mejor el hueco pero solo encaja en una generación concreta.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
  {
    slug: "protectores-de-pantalla-para-tesla",
    titulo: "Protectores de pantalla para Tesla Model 3 y Model Y: guía de compra",
    h1: "Protectores de pantalla para Tesla: cómo elegir",
    descripcion:
      "Cómo elegir el protector de pantalla de tu Tesla Model 3 o Model Y: cristal templado, acabado mate o brillo y tamaño, con precio final y opciones por versión.",
    resumen: "Cristal templado, mate o brillo y tamaño exacto: cómo elegir el protector de la pantalla del Tesla.",
    intro: [
      "La pantalla central es lo que más tocas del coche y también lo que más huellas y arañazos acumula. Un protector es barato frente a lo que cuesta reponer la pantalla, pero tiene trampa: hay que elegir el tamaño exacto y colocarlo bien.",
      "Los de cristal templado reducen arañazos y huellas; los de acabado mate quitan reflejos a costa de algo de nitidez. Si tu coche tiene pantalla trasera para los pasajeros, comprueba si el pack la incluye.",
    ],
    comoElegir: [
      "Tamaño y versión: usa el que corresponde a tu modelo y año. Un protector de otra generación no encaja o deja bordes.",
      "Acabado: brillante conserva la nitidez; mate reduce reflejos y marca menos las huellas.",
      "Guía de colocación: un kit con marco o guía reduce el riesgo de burbujas y desalineación.",
      "Colocación: hazlo con la pantalla limpia y sin polvo, y mejor en un sitio cerrado.",
      "Pantalla trasera: si tu versión la tiene y quieres protegerla, busca packs que la mencionen.",
    ],
    bloques: [
      { titulo: "Protectores para Model Y Juniper", version: "model-y-juniper", categoria: "pantalla" },
      { titulo: "Protectores para Model 3 Highland", version: "model-3-highland", categoria: "pantalla" },
      { titulo: "Protectores con más descuento", categoria: "pantalla", orden: "descuento" },
      { titulo: "Protectores más baratos", categoria: "pantalla", orden: "barato" },
    ],
    preguntas: [
      {
        pregunta: "¿Mejor protector mate o brillante?",
        respuesta:
          "El brillante conserva la nitidez; el mate reduce reflejos y huellas. Si conduces con mucho sol, el mate suele resultar más cómodo; si priorizas la imagen, el brillante.",
      },
      {
        pregunta: "¿Cómo se coloca sin burbujas?",
        respuesta:
          "Con la pantalla limpia, sin polvo y apagada, y mejor con una guía o marco de colocación. Si el kit lo incluye, úsalo; despega el protector poco a poco y presiona de un lado al otro.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
];

export const GUIA_POR_SLUG = new Map(GUIAS.map((g) => [g.slug, g]));
