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
  {
    slug: "accesorios-tesla-model-y-y-model-3-standard",
    titulo: "Accesorios para Tesla Model Y y Model 3 Standard: guía de compra",
    h1: "Accesorios para tu Tesla Model Y o Model 3 Standard",
    descripcion:
      "Qué accesorios comprar para el Tesla Model Y o Model 3 Standard, la versión básica: cómo comprobar la compatibilidad y opciones con el precio final.",
    resumen: "Model Y y Model 3 Standard, la versión básica: cómo comprobar que un accesorio encaja y por dónde empezar.",
    version: "model-y-standard",
    intro: [
      "El Model Y y el Model 3 Standard son las versiones básicas de cada modelo. Comparten buena parte de la carrocería con las versiones renovadas (Juniper en el Model Y y Highland en el Model 3), pero el equipamiento y algunos detalles pueden cambiar, así que no todo lo que se vende para la versión completa encaja sin más.",
      "Por eso en esta guía la regla es una: comprobar la compatibilidad antes de comprar. Si la ficha nombra el Standard, perfecto; si solo nombra Juniper o Highland, confirma con la tienda que valga para tu versión. Después, el orden habitual: alfombrillas, protector de pantalla, carga y organización.",
    ],
    comoElegir: [
      "Busca fichas que nombren expresamente Model Y Standard o Model 3 Standard. Si solo indican Juniper o Highland, pregunta a la tienda antes de pagar.",
      "Las piezas a medida (alfombrillas, protectores de pantalla, embellecedores) dependen del año y de la versión: no te fíes de una ficha que no indique el año.",
      "Los accesorios universales (soportes, organizadores sueltos, cables y cargadores) suelen valer para cualquier versión.",
      "Para la carga, el conector en Europa es Tipo 2: mira la potencia que admite tu coche y la longitud del cable.",
      "Revisa la política de devolución de la tienda: cambiar una pieza que no encaja es mucho más fácil si la devolución está clara.",
    ],
    bloques: [
      { titulo: "Accesorios para Model Y Standard", version: "model-y-standard", texto: "Productos del catálogo que indican el Model Y Standard. Confirma siempre la versión en la ficha." },
      { titulo: "Accesorios para Model 3 Standard", version: "model-3-standard", texto: "Productos del catálogo que indican el Model 3 Standard. Confirma siempre la versión en la ficha." },
      { titulo: "Alfombrillas para Model Y y Model 3", categoria: "alfombrillas" },
      { titulo: "Cargadores y cables", categoria: "carga" },
    ],
    preguntas: [
      {
        pregunta: "¿Valen los accesorios del Model Y Juniper para el Model Y Standard?",
        respuesta:
          "A veces sí, sobre todo los universales y los que van al exterior de la misma carrocería, pero no hay garantía. Mira que la ficha nombre el Standard o confirma con la tienda antes de comprar.",
      },
      {
        pregunta: "¿Qué accesorio compro primero para un Tesla Standard?",
        respuesta:
          "Unas alfombrillas a medida y un protector de pantalla: son lo que más protege desde el primer día. Después, un cable de carga adecuado y un organizador de consola.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
  {
    slug: "tapacubos-para-tesla-model-3-y-model-y",
    titulo: "Tapacubos para Tesla Model 3 y Model Y: cómo elegirlos",
    h1: "Tapacubos para tu Tesla: cómo elegir los que encajan",
    descripcion:
      "Cómo elegir los tapacubos de tu Tesla Model 3 o Model Y: diámetro de llanta, ajuste y montaje, con opciones del catálogo y precio final.",
    resumen: "Diámetro de llanta, ajuste y montaje: cómo elegir los tapacubos del Tesla.",
    intro: [
      "Los tapacubos cambian el aspecto del coche sin tocar la llanta y protegen el diseño original del polvo y los roces. Son un accesorio sencillo, pero el ajuste importa: uno de otro diámetro no encaja o se suelta.",
      "Lo primero es saber qué llanta llevas. Cada versión y acabado de Tesla monta un diámetro distinto, y el tapacubos tiene que coincidir con él. Si tienes dudas, el diámetro viene marcado en el lateral del neumático.",
    ],
    comoElegir: [
      "Mide o comprueba el diámetro de tu llanta (en pulgadas) y elige un tapacubos de ese mismo diámetro; el de otro tamaño no encaja.",
      "Comprueba que la ficha nombre tu modelo y versión, porque el diseño de la llanta cambia entre generaciones.",
      "Mira cómo se monta: los de ajuste a presión se colocan sin herramientas; otros llevan clips o tornillos.",
      "Fíjate en que el tapacubos deje accesible la válvula del neumático y no tape sensores ni los orificios de ventilación del freno.",
      "Compra el juego de cuatro y revisa que incluya todas las piezas de montaje.",
    ],
    bloques: [
      { titulo: "Accesorios de exterior para Model Y Juniper", version: "model-y-juniper", categoria: "exterior", texto: "Incluye tapacubos y otras piezas de exterior. Comprueba el diámetro de tu llanta en cada ficha." },
      { titulo: "Accesorios de exterior para Model 3 Highland", version: "model-3-highland", categoria: "exterior", texto: "Incluye tapacubos y otras piezas de exterior. Comprueba el diámetro de tu llanta en cada ficha." },
      { titulo: "Exterior con más descuento", categoria: "exterior", orden: "descuento" },
      { titulo: "Exterior más barato", categoria: "exterior", orden: "barato" },
    ],
    preguntas: [
      {
        pregunta: "¿Cómo sé qué diámetro de tapacubos necesito?",
        respuesta:
          "Es el de tu llanta. Viene marcado en el lateral del neumático (por ejemplo, el número después de la R). Si tienes dudas, confírmalo en el manual del coche o con la tienda.",
      },
      {
        pregunta: "¿Se pueden poner sin herramientas?",
        respuesta:
          "Los de ajuste a presión sí. Otros llevan clips o tornillos, y la ficha de cada producto indica el sistema de montaje.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
  {
    slug: "soportes-de-movil-para-tesla",
    titulo: "Soportes de móvil para Tesla Model 3 y Model Y: guía de compra",
    h1: "Soportes de móvil para tu Tesla: cómo elegir",
    descripcion:
      "Cómo elegir el soporte de móvil de tu Tesla Model 3 o Model Y: imán o MagSafe, dónde colocarlo y qué comprobar, con precio final.",
    resumen: "Imán, MagSafe o pinza, y dónde colocarlo sin tapar nada: cómo elegir el soporte de móvil del Tesla.",
    intro: [
      "Un Tesla no trae soporte para el móvil, y lo habitual es colocarlo en la consola o junto a la pantalla. Hay soportes magnéticos, compatibles con MagSafe, de pinza y de ventosa, y la mejor opción depende de tu móvil y de cómo lo uses.",
      "Elige uno que encaje con tu modelo y que no tape la pantalla, las salidas de aire ni ningún sensor. Si cargas el móvil sin cable, comprueba además que el soporte no lo impide.",
    ],
    comoElegir: [
      "Si tu móvil es compatible con MagSafe, un soporte MagSafe se sujeta sin placas extra. Si no lo es, los imanes necesitan una placa metálica pegada al móvil o a la funda.",
      "Mira dónde se coloca: algunos se fijan a la pantalla, otros a la consola o a una salida de aire. Comprueba que no tape la pantalla ni los sensores.",
      "Revisa que la ficha nombre tu modelo y versión, porque la forma de la consola y de la pantalla cambia con las renovaciones.",
      "Si usas carga inalámbrica, comprueba que el soporte no bloquee el cargador ni lo recaliente.",
      "Los soportes con rótula permiten girar el móvil a vertical u horizontal; si usas mucho el navegador, es cómodo.",
    ],
    bloques: [
      { titulo: "Soportes para Model Y Juniper", version: "model-y-juniper", categoria: "soportes" },
      { titulo: "Soportes para Model 3 Highland", version: "model-3-highland", categoria: "soportes" },
      { titulo: "Soportes con más descuento", categoria: "soportes", orden: "descuento" },
      { titulo: "Soportes más baratos", categoria: "soportes", orden: "barato" },
    ],
    preguntas: [
      {
        pregunta: "¿Qué soporte de móvil es mejor para un Tesla?",
        respuesta:
          "Depende del móvil y de dónde lo quieras. Con un móvil compatible con MagSafe, uno MagSafe es lo más cómodo; si no, uno magnético con placa o uno de pinza. Lo importante es que no tape la pantalla ni los sensores.",
      },
      {
        pregunta: "¿Los soportes magnéticos dañan el móvil?",
        respuesta:
          "Los imanes de estos soportes no suelen dañar un móvil actual. Aun así, evita colocar tarjetas con banda magnética entre el móvil y el imán.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
  {
    slug: "luz-ambiental-y-led-para-tesla",
    titulo: "Luz ambiental y LED para Tesla Model 3 y Model Y: guía de compra",
    h1: "Luz ambiental y LED para tu Tesla: cómo elegir",
    descripcion:
      "Cómo elegir luces de ambiente, tiras LED y luces de cortesía para tu Tesla Model 3 o Model Y: conexión, compatibilidad y opciones con el precio final.",
    resumen: "Luces de ambiente, tiras LED y luces de umbral: cómo se conectan y qué comprobar antes de comprar.",
    intro: [
      "La iluminación interior es de los cambios que más se notan en un Tesla: una tira de luz ambiental, unas luces en las puertas o en el maletero cambian por completo el aspecto de la cabina. Hay opciones muy distintas en precio y en cómo se instalan.",
      "Antes de comprar conviene saber cómo se alimenta cada una: unas van por USB o por el enchufe de 12 V, otras funcionan con pilas o batería recargable y otras se conectan a la instalación del coche. Cuanto más sencilla la conexión, menos riesgo de problemas.",
    ],
    comoElegir: [
      "Mira cómo se conecta: USB, enchufe de 12 V, pilas o conexión a la instalación del coche. Las que no tocan el cableado son más fáciles de quitar si cambias de opinión.",
      "Comprueba que la ficha nombre tu modelo y versión. En las luces que sustituyen una pieza del coche, el ajuste cambia con las renovaciones.",
      "Si quieres controlar el color y el brillo, busca las que traen mando o aplicación; las más baratas suelen ser de un solo color.",
      "Evita instalaciones que obliguen a cortar o empalmar cables del coche si no estás seguro: pueden afectar a la garantía.",
      "Fíjate en el brillo y en dónde va colocada: una luz demasiado intensa puede molestar al conducir de noche.",
    ],
    bloques: [
      { titulo: "Iluminación para Model Y Juniper", version: "model-y-juniper", categoria: "iluminacion" },
      { titulo: "Iluminación para Model 3 Highland", version: "model-3-highland", categoria: "iluminacion" },
      { titulo: "Iluminación con más descuento", categoria: "iluminacion", orden: "descuento" },
      { titulo: "Iluminación más barata", categoria: "iluminacion", orden: "barato" },
    ],
    preguntas: [
      {
        pregunta: "¿Las luces LED afectan a la garantía del Tesla?",
        respuesta:
          "Las que se conectan por USB o por el enchufe de 12 V no tocan el cableado del coche. Las que se empalman a la instalación pueden dar problemas, así que mejor elegir las que no requieren modificar nada.",
      },
      {
        pregunta: "¿Qué luz ambiental es mejor para un Tesla?",
        respuesta:
          "Depende de dónde la quieras y de cuánto quieras controlar. Las de varios colores con mando o aplicación dan más juego; las sencillas de un color son más baratas y fáciles de poner.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
  {
    slug: "compatibilidad-accesorios-tesla-highland-juniper-legacy",
    titulo: "Accesorios Tesla Model 3 y Model Y: compatibilidad Highland, Juniper y versiones anteriores",
    h1: "¿Encaja en mi Tesla? Compatibilidad entre Highland, Juniper y versiones anteriores",
    descripcion:
      "Cómo saber si un accesorio encaja en tu Tesla Model 3 o Model Y: diferencias entre Highland, Juniper y las versiones anteriores, y qué mirar en cada ficha.",
    resumen: "Highland, Juniper y versiones anteriores: cómo saber si un accesorio encaja en tu Tesla.",
    intro: [
      "Tanto el Model 3 como el Model Y se han renovado: el Model 3 Highland se vende desde 2024 y el Model Y Juniper desde 2025. Las renovaciones cambiaron el frontal, la iluminación y buena parte del interior, así que un accesorio pensado para la versión anterior puede no encajar en la nueva, y al revés.",
      "En esta guía no hay trucos: la regla es mirar el año y la versión de cada ficha. Los accesorios universales suelen valer para todas; los que van a medida (alfombrillas, protectores de pantalla, piezas de consola y de exterior) son específicos de cada generación.",
    ],
    comoElegir: [
      "Anota tu versión: Model 3 anterior (2017-2023) o Highland (2024 en adelante); Model Y anterior (2020-2024), Juniper (2025 en adelante) o versión Standard.",
      "Busca fichas que nombren tu versión de forma expresa. Si solo indican «Model 3» o «Model Y» sin año, pregunta a la tienda.",
      "Las piezas a medida cambian entre generaciones: alfombrillas, protectores de pantalla, consola, puertas y exterior.",
      "Los accesorios universales (soportes, cargadores, cables, organizadores sueltos) suelen valer para cualquier versión.",
      "Antes de pagar, revisa la devolución: cambiar una pieza que no encaja es mucho más fácil con una política clara.",
    ],
    bloques: [
      { titulo: "Para Model 3 Highland (2024 en adelante)", version: "model-3-highland" },
      { titulo: "Para Model Y Juniper (2025 en adelante)", version: "model-y-juniper" },
      { titulo: "Para Model 3 anterior (2017-2023)", version: "model-3-legacy" },
      { titulo: "Para Model Y anterior (2020-2024)", version: "model-y-legacy" },
    ],
    preguntas: [
      {
        pregunta: "¿Sirven los accesorios del Model 3 anterior para el Highland?",
        respuesta:
          "Los universales sí; los que van a medida normalmente no, porque la renovación cambió la consola, las puertas y el frontal. Comprueba que la ficha nombre el Highland o el año 2024 en adelante.",
      },
      {
        pregunta: "¿Y los del Model Y anterior para el Juniper?",
        respuesta:
          "Ocurre lo mismo: lo universal suele valer y lo hecho a medida suele ser específico de cada generación. Busca fichas que nombren el Juniper o el año 2025 en adelante.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
  {
    slug: "cubrecoche-y-proteccion-exterior-para-tesla",
    titulo: "Cubrecoche y protección exterior para Tesla Model 3 y Model Y: guía de compra",
    h1: "Cubrecoche y protección exterior para tu Tesla",
    descripcion:
      "Cómo elegir el cubrecoche y los protectores exteriores de tu Tesla Model 3 o Model Y: ajuste, materiales y qué comprobar, con opciones y precio final.",
    resumen: "Cubrecoche, protectores y piezas de exterior: ajuste, material y qué comprobar antes de comprar.",
    intro: [
      "Un Tesla aparcado en la calle acumula polvo, lluvia y sol. Un cubrecoche a medida y unos protectores de exterior alargan la vida de la pintura y de las piezas, pero el ajuste es lo que decide si funcionan o no.",
      "En exterior, más que en ningún otro tipo de accesorio, importa que la pieza sea para tu modelo y tu versión: una pieza de otra generación no encaja o queda mal.",
    ],
    comoElegir: [
      "Elige un cubrecoche específico para tu modelo y comprueba que deje libres los retrovisores y el puerto de carga si quieres cargar sin quitarlo.",
      "Mira el material: los impermeables protegen de la lluvia, pero si no transpiran pueden retener humedad; los transpirables son mejores para uso prolongado.",
      "En protectores y embellecedores, comprueba el año y la versión. Si es adhesivo, la superficie debe estar limpia y seca al colocarlo.",
      "Revisa que la ficha indique cómo se fija: con clips, ventosas, adhesivo o ajuste a presión.",
      "Si lo vas a usar en el exterior mucho tiempo, busca materiales resistentes a los rayos UV.",
    ],
    bloques: [
      { titulo: "Exterior para Model Y Juniper", version: "model-y-juniper", categoria: "exterior" },
      { titulo: "Exterior para Model 3 Highland", version: "model-3-highland", categoria: "exterior" },
      { titulo: "Exterior con más descuento", categoria: "exterior", orden: "descuento" },
      { titulo: "Exterior más barato", categoria: "exterior", orden: "barato" },
    ],
    preguntas: [
      {
        pregunta: "¿Un cubrecoche puede dañar la pintura?",
        respuesta:
          "Un cubrecoche limpio y del tamaño correcto protege la pintura. Si está sucio o es demasiado ajustado, puede rozarla; conviene ponerlo con el coche limpio.",
      },
      {
        pregunta: "¿Puedo cargar el coche con el cubrecoche puesto?",
        respuesta:
          "Depende del diseño. Algunos dejan el puerto de carga accesible; otros obligan a retirarlo. Mira lo que indica la ficha.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
  {
    slug: "donde-comprar-accesorios-tesla-amazon-aliexpress-temu-tiendas-oficiales",
    titulo: "Dónde comprar accesorios para Tesla: Amazon, AliExpress, Temu y tiendas especializadas",
    h1: "Dónde comprar accesorios para tu Tesla: qué ofrece cada tienda",
    descripcion:
      "Comparativa de dónde comprar accesorios para Tesla Model 3 y Model Y en España: Amazon, AliExpress, Temu, Jowua, Hansshow, Tesery y EVDANCE, con códigos de descuento y qué comprobar.",
    resumen: "Amazon, AliExpress, Temu y tiendas especializadas: códigos, envíos y qué mirar en cada una.",
    intro: [
      "Los accesorios para Tesla se venden en tres tipos de sitios: grandes tiendas como Amazon, marketplaces como AliExpress y Temu, y tiendas especializadas en Tesla como Jowua, Hansshow, Tesery o EVDANCE. Cada una tiene sus ventajas, y el precio no es lo único que cuenta.",
      "En Chollesla mostramos el precio final: el de la tienda con su código de descuento ya aplicado cuando lo hay. Amazon, AliExpress y Temu no llevan código; las tiendas especializadas suelen ofrecer uno, que ya está incluido en el precio de la ficha.",
    ],
    comoElegir: [
      "Compara el precio final, no el de lista: las tiendas especializadas con código pueden salir más baratas que su precio original.",
      "Mira el envío y el plazo: en marketplaces depende del vendedor, y alguna tienda de la UE cobra gastos de envío a España aparte del precio.",
      "Revisa la política de devolución antes de pagar, sobre todo en piezas a medida que pueden no encajar.",
      "Comprueba que la ficha nombre tu modelo y versión; es más importante que la tienda.",
      "En marketplaces, elige la variante correcta en la página del producto antes de añadir al carrito.",
    ],
    bloques: [
      { titulo: "Los más baratos del catálogo", orden: "barato" },
      { titulo: "Con más descuento", orden: "descuento" },
    ],
    preguntas: [
      {
        pregunta: "¿Qué tienda es más barata para accesorios Tesla?",
        respuesta:
          "Depende del producto. Las tiendas especializadas con código de descuento suelen ser competitivas en piezas a medida; los marketplaces destacan en accesorios sencillos. Compara siempre el precio final y el envío.",
      },
      {
        pregunta: "¿Hay que pagar el código de descuento?",
        respuesta:
          "No. El código no se paga: es un descuento que la tienda aplica. En Chollesla el precio de cada ficha ya lo incluye, y si la tienda te lo pide al pagar, lo copias y lo pegas.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
  {
    slug: "cargador-y-cable-tipo-2-para-tesla-en-espana",
    titulo: "Cargador y cable Tipo 2 para Tesla en España: qué comprar",
    h1: "Cargador y cable Tipo 2 para tu Tesla en España",
    descripcion:
      "Qué cable o cargador Tipo 2 comprar para tu Tesla Model 3 o Model Y en España: potencia, longitud y qué comprobar antes de comprar, con opciones y precio final.",
    resumen: "Conector Tipo 2, potencia y longitud: cómo elegir el cable o el cargador del Tesla.",
    intro: [
      "En Europa, los Tesla se cargan con el conector Tipo 2, el mismo de la mayoría de puntos de carga públicos. Para cargar en casa o en destino necesitas un cable adecuado o un cargador portátil, y ahí hay opciones muy distintas en potencia, longitud y precio.",
      "Lo importante es que el cable o el cargador soporte la potencia que admite tu coche y la que ofrece tu instalación. Un cable de más potencia que la de tu coche no carga más rápido, simplemente no se aprovecha.",
    ],
    comoElegir: [
      "Comprueba que el conector sea Tipo 2 y que la ficha indique compatibilidad con Tesla.",
      "Fíjate en la potencia (kW o amperios) que admite el cable, y que sea suficiente para tu coche y tu instalación.",
      "Mira si es monofásico o trifásico, según la instalación donde vayas a cargar.",
      "Elige una longitud cómoda: un cable demasiado corto limita dónde aparcas y uno demasiado largo es incómodo de guardar.",
      "En cargadores portátiles, revisa que traigan protecciones y certificados, y que el cable de alimentación sea adecuado.",
    ],
    bloques: [
      { titulo: "Carga para Model Y Juniper", version: "model-y-juniper", categoria: "carga" },
      { titulo: "Carga para Model 3 Highland", version: "model-3-highland", categoria: "carga" },
      { titulo: "Carga con más descuento", categoria: "carga", orden: "descuento" },
      { titulo: "Carga más barata", categoria: "carga", orden: "barato" },
    ],
    preguntas: [
      {
        pregunta: "¿Qué conector necesita un Tesla en España?",
        respuesta:
          "El Tipo 2, que es el estándar europeo de la mayoría de puntos de carga. Para cargar en casa o en destino necesitas un cable o cargador con ese conector.",
      },
      {
        pregunta: "¿Un cable de más potencia carga más rápido?",
        respuesta:
          "No. La velocidad la marca el cargador interno del coche, la potencia del punto de carga y la instalación. Un cable de más potencia no acelera nada, pero tampoco hace daño.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
  {
    slug: "regalos-para-duenos-de-tesla",
    titulo: "Regalos para dueños de Tesla: ideas por presupuesto",
    h1: "Qué regalar a quien tiene un Tesla: ideas por presupuesto",
    descripcion:
      "Ideas de regalo para dueños de un Tesla Model 3 o Model Y: accesorios útiles por presupuesto, con el precio final y consejos para acertar con la versión.",
    resumen: "Ideas de regalo para quien tiene un Tesla, por presupuesto, y cómo acertar con la versión.",
    intro: [
      "Acertar con un regalo para alguien que tiene un Tesla es más fácil de lo que parece: los accesorios útiles se agradecen más que los decorativos, y hay opciones desde unos pocos euros.",
      "La clave es saber qué versión tiene: Model 3 o Model Y, y si es la renovada (Highland o Juniper) o una anterior. Con eso, un organizador, un soporte, un protector de pantalla o unas alfombrillas a medida son siempre buena idea.",
    ],
    comoElegir: [
      "Averigua el modelo y el año del coche antes de comprar. Es lo único imprescindible para acertar con piezas a medida.",
      "Si no estás seguro, elige algo universal: soportes, organizadores sueltos, cables o luces.",
      "Ten en cuenta lo que ya tiene: un accesorio repetido no sirve, así que mejor preguntar con disimulo.",
      "Revisa la devolución de la tienda, por si el regalo no encaja.",
      "Para sorprender de verdad, elige algo que use todos los días: soporte de móvil, organizador de consola o protector de pantalla.",
    ],
    bloques: [
      { titulo: "Regalos por menos de 20 €", maxEuros: 20, orden: "destacados" },
      { titulo: "Regalos por menos de 50 €", maxEuros: 50, orden: "destacados" },
      { titulo: "Los que más descuento tienen", orden: "descuento" },
    ],
    preguntas: [
      {
        pregunta: "¿Qué es lo más útil para regalar a un dueño de Tesla?",
        respuesta:
          "Los accesorios que usa a diario: un soporte de móvil, un organizador de consola, un protector de pantalla o unas alfombrillas a medida.",
      },
      {
        pregunta: "¿Cómo acierto con la versión si no estoy seguro?",
        respuesta:
          "Pregunta el modelo y el año del coche, o elige un accesorio universal que valga para cualquier versión.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
  {
    slug: "protectores-de-interior-para-tesla-consola-umbral-y-asientos",
    titulo: "Protectores de interior para Tesla: consola, umbrales y asientos",
    h1: "Protectores de interior para tu Tesla: consola, umbrales y asientos",
    descripcion:
      "Cómo elegir protectores de interior para tu Tesla Model 3 o Model Y: consola central, umbrales de puerta y fundas de asiento, con precio final y qué comprobar.",
    resumen: "Consola, umbrales y asientos: cómo elegir los protectores de interior del Tesla.",
    intro: [
      "El interior de un Tesla es minimalista, y por eso las zonas de uso diario, como la consola central, los umbrales de las puertas y los asientos, se marcan antes de lo que parece. Los protectores evitan arañazos y desgaste, y suelen ser baratos frente a lo que cuesta reponer la pieza.",
      "Como casi todo lo que va a medida, el ajuste depende de la generación: la consola, las puertas y los asientos cambian con las renovaciones, así que hay que comprobar el modelo y el año.",
    ],
    comoElegir: [
      "Comprueba que la ficha nombre tu modelo y versión; el diseño interior cambia con las renovaciones.",
      "En fundas de asiento, comprueba que respeten los airbags laterales y la calefacción de los asientos.",
      "Los protectores de umbral y de consola de materiales flexibles se adaptan mejor y son fáciles de limpiar.",
      "Mira cómo se fijan: adhesivo, clips o ajuste a presión. El adhesivo exige superficie limpia y seca.",
      "Si el producto es para la zona de los pies o los asientos traseros, busca materiales resistentes a patadas y roces.",
    ],
    bloques: [
      { titulo: "Interior para Model Y Juniper", version: "model-y-juniper", categoria: "interior" },
      { titulo: "Interior para Model 3 Highland", version: "model-3-highland", categoria: "interior" },
      { titulo: "Fundas y protectores de asiento", categoria: "asientos" },
      { titulo: "Interior más barato", categoria: "interior", orden: "barato" },
    ],
    preguntas: [
      {
        pregunta: "¿Las fundas de asiento universales valen para un Tesla?",
        respuesta:
          "Algunas sí, pero las específicas respetan mejor los airbags laterales y la calefacción. Si el modelo está indicado en la ficha, mejor.",
      },
      {
        pregunta: "¿Cómo se coloca un protector adhesivo sin que se despegue?",
        respuesta:
          "Con la superficie limpia, seca y sin grasa, y presionando bien desde el centro hacia los bordes. Evita colocarlo con mucho frío o calor.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
];

export const GUIA_POR_SLUG = new Map(GUIAS.map((g) => [g.slug, g]));
