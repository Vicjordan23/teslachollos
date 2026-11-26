import type { IdCategoria, IdTienda, IdVersion, PreguntaFrecuente } from "@chollesla/core";
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
  /** Expresión regular (sin barras, insensible a mayúsculas) que debe cumplir el título del producto. */
  buscar?: string;
  /** Solo productos de esta tienda. */
  tienda?: IdTienda;
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
    "Porque mostramos el precio final: el de la tienda con su código de descuento ya aplicado (por ejemplo Hansshow un 20 %, Jowua y Tesery un 5 %). Amazon, AliExpress y Temu no tienen código. Confirma siempre el importe en la tienda antes de pagar, porque los precios cambian.",
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
    titulo: "Alfombrillas para Tesla Model 3 y Model Y: TPE, 3D y juegos completos",
    h1: "Alfombrillas para Tesla Model 3 y Model Y: cómo elegir (TPE, 3D y juegos)",
    descripcion:
      "Cómo elegir alfombrillas para tu Tesla Model 3 o Model Y: de maletero, TPE o 3D, a medida por versión, con el precio final y qué piezas lleva cada juego.",
    resumen: "Ajuste a medida, material y qué juego comprar para el Model 3 y el Model Y, con precios finales.",
    intro: [
      "Las alfombrillas son el accesorio que más se nota con el uso diario: protegen la moqueta del barro y del agua y se limpian en un momento. Pero el suelo de cada generación es distinto, y una alfombrilla que no encaja se mueve y se arruga.",
      "Antes de comprar, decide si quieres solo las de las plazas delanteras o el juego completo con traseras, maletero y frunk. Algunas tiendas venden las piezas por separado y otras en pack: compara el total, no el precio de una pieza.",
      "Las alfombrillas de maletero merecen mención aparte: es la zona donde más se arrastra barro, arena, bolsas de la compra o material deportivo, y una bandeja con borde elevado protege la moqueta y el fondo del maletero. En un Tesla hay además maletero trasero, subsuelo y frunk (el maletero delantero), cada uno con su pieza.",
      "Esta guía sirve tanto para el Model 3 Highland como para el Model Y Juniper. Más abajo tienes los juegos de cada versión, las piezas de maletero y los más baratos, siempre con el precio final tras el código de descuento de cada tienda.",
    ],
    comoElegir: [
      "Versión: el Model 3 Highland (2024 en adelante) y el Model Y Juniper (2025 en adelante) cambian respecto a las generaciones anteriores. Comprueba el año en la ficha.",
      "Ajuste: las alfombrillas a medida cubren los bordes y las zonas de pedal; las universales dejan huecos.",
      "Material: las de TPE o goma son flexibles, fáciles de lavar y retienen agua y barro; las de tela quedan más discretas pero se ensucian antes.",
      "Contenido del juego: plazas delanteras, traseras, maletero y frunk. Cuenta cuántas piezas lleva el pack.",
      "Sujeción: busca anclajes o un reverso antideslizante para que no se desplace bajo el pedal.",
      "Maletero: elige una bandeja con borde elevado si transportas barro, arena o bolsas; comprueba si incluye el subsuelo y el frunk, o si se venden aparte.",
      "TPE o 3D: las de TPE son más finas y flexibles; las 3D o con relieve profundo contienen más líquido, pero son más rígidas y algo más caras.",
      "Olor y acabado: el TPE de calidad no huele a goma; si una opinión en la tienda lo menciona, conviene leerla antes de comprar.",
    ],
    bloques: [
      { titulo: "Alfombrillas para Model Y Juniper", version: "model-y-juniper", categoria: "alfombrillas" },
      { titulo: "Alfombrillas para Model 3 Highland", version: "model-3-highland", categoria: "alfombrillas" },
      { titulo: "Alfombrillas de maletero y frunk", categoria: "alfombrillas", buscar: "maletero|frunk|trunk|cofre" },
      { titulo: "Alfombrillas TPE", categoria: "alfombrillas", buscar: "tpe" },
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
      {
        pregunta: "¿Qué alfombrillas de maletero elijo para mi Tesla?",
        respuesta:
          "Una bandeja a medida con borde elevado, de TPE o goma, que cubra el fondo y los laterales. Comprueba si el juego incluye el maletero trasero, el subsuelo y el frunk, porque a menudo se venden por separado.",
      },
      {
        pregunta: "¿Qué lleva un juego completo de alfombrillas para Tesla?",
        respuesta:
          "Suele incluir las plazas delanteras y traseras, y a veces el maletero y el frunk. Cuenta las piezas del pack y compara el total, no el precio de una sola alfombrilla.",
      },
      {
        pregunta: "¿Cómo se limpian las alfombrillas de TPE o goma?",
        respuesta:
          "Se sacan, se sacuden y se lavan con agua y jabón neutro. Deja que sequen antes de volver a colocarlas y evita productos que las dejen resbaladizas bajo el pedal.",
      },
      {
        pregunta: "¿Valen las mismas alfombrillas para Model 3 y para Model Y?",
        respuesta:
          "No. Aunque comparten mecánica, el suelo y el maletero son distintos. Elige siempre el juego de tu modelo y versión.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
  {
    slug: "alfombrillas-de-maletero-tesla",
    titulo: "Alfombrillas de maletero para Tesla Model Y y Model 3: cuál elegir",
    h1: "Alfombrillas para el maletero de tu Tesla",
    descripcion:
      "Alfombrillas de maletero y frunk para Tesla Model Y Juniper y Model 3 Highland: qué piezas hay, cómo comprobar que encajan y precio final de cada una.",
    resumen: "Maletero, subsuelo, frunk y laterales: qué pieza protege cada zona y cuál encaja en tu versión.",
    intro: [
      "Un Tesla tiene varias zonas de carga y casi siempre cada una lleva su propia alfombrilla: el maletero trasero, el subsuelo, el maletero delantero (frunk) y, en algunos juegos, los respaldos traseros o los laterales.",
      "Antes de comparar precios, mira qué zonas incluye cada producto. Un juego de varias piezas y una sola bandeja pueden parecer lo mismo en la foto.",
    ],
    comoElegir: [
      "Versión y año: el maletero cambia entre el Model Y Juniper y el Model Y anterior, y entre el Model 3 Highland y los anteriores. Elige la variante exacta.",
      "Piezas: comprueba si incluye maletero, subsuelo, frunk, respaldos traseros y laterales, y cuántas piezas son.",
      "Distribución de asientos: si tu coche tiene más de cinco plazas, confirma que la pieza sea para esa configuración.",
      "Borde elevado: contiene agua, arena y líquidos mejor que una alfombrilla plana.",
      "Material: el TPE y la goma se lavan con agua; los acabados textiles son más discretos pero cuesta más limpiarlos.",
      "Si abates los asientos para cargar, elige un juego que cubra también los respaldos.",
    ],
    bloques: [
      { titulo: "Maletero y frunk para Model Y Juniper", version: "model-y-juniper", categoria: "alfombrillas", buscar: "maletero|frunk|trunk|cofre" },
      { titulo: "Maletero y frunk para Model 3 Highland", version: "model-3-highland", categoria: "alfombrillas", buscar: "maletero|frunk|trunk|cofre" },
      { titulo: "Frunk (maletero delantero)", categoria: "alfombrillas", buscar: "frunk|maletero delantero|cofre" },
      { titulo: "Las más baratas para el maletero", categoria: "alfombrillas", buscar: "maletero|frunk|trunk|cofre", orden: "barato" },
    ],
    preguntas: [
      {
        pregunta: "¿Qué alfombrillas de maletero valen para mi Tesla?",
        respuesta: "Las que indiquen tu modelo, versión y año. El maletero cambió con las renovaciones Highland y Juniper, así que no des por hecho que una pieza antigua encaje.",
      },
      {
        pregunta: "¿El frunk necesita su propia alfombrilla?",
        respuesta: "Sí. El maletero delantero tiene una forma distinta y su pieza va aparte o dentro de un juego que la mencione expresamente.",
      },
      {
        pregunta: "¿Es mejor un juego completo o piezas sueltas?",
        respuesta: "Depende de lo que quieras proteger. Suma el precio de las piezas sueltas que necesitas y compáralo con el del juego que las incluye.",
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
      "Comparativa de dónde comprar accesorios para Tesla Model 3 y Model Y en España: Amazon, AliExpress, Temu, Jowua, Hansshow y Tesery, con códigos de descuento y qué comprobar.",
    resumen: "Amazon, AliExpress, Temu y tiendas especializadas: códigos, envíos y qué mirar en cada una.",
    intro: [
      "Los accesorios para Tesla se venden en tres tipos de sitios: grandes tiendas como Amazon, marketplaces como AliExpress y Temu, y tiendas especializadas en Tesla como Jowua, Hansshow o Tesery. Cada una tiene sus ventajas, y el precio no es lo único que cuenta.",
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
  {
    slug: "parasol-para-tesla-model-3-y-model-y",
    titulo: "Parasol para Tesla Model 3 y Model Y: cómo elegirlo y precios",
    h1: "Parasol para tu Tesla: cómo elegir el de parabrisas o el de techo de cristal",
    descripcion:
      "Guía para elegir parasol en un Tesla Model 3 o Model Y: parabrisas o techo panorámico, ajuste a medida y precio final con el código de cada tienda.",
    resumen: "Parabrisas o techo de cristal: qué parasol encaja con tu Tesla y qué comprobar antes de comprarlo.",
    intro: [
      "El techo de cristal y el gran parabrisas de un Tesla dejan pasar mucha luz y calor, sobre todo en verano y con el coche aparcado al sol. Un parasol baja la temperatura del habitáculo y protege la pantalla y el salpicadero, y es de los accesorios más baratos que se notan desde el primer día.",
      "Hay dos zonas distintas: el parabrisas delantero y el techo panorámico. Los productos no son intercambiables, así que lo primero es decidir cuál quieres tapar y comprobar que la ficha indique tu modelo y versión.",
    ],
    comoElegir: [
      "Decide la zona: parabrisas (plegable o enrollable) o techo de cristal (suele fijarse por dentro con clips o ventosas).",
      "Busca el modelo exacto: la forma del parabrisas y del techo cambia entre Model 3 Highland, Model Y Juniper y versiones anteriores.",
      "Mira que lleve capa reflectante exterior y que no deje huecos junto al retrovisor y los sensores de la cámara.",
      "Comprueba cómo se guarda: los plegables caben en la puerta; los rígidos o enrollables ocupan más.",
      "Evita fijaciones que puedan dejar marcas en el cristal o el techo interior.",
    ],
    bloques: [
      { titulo: "Parasoles para Model Y Juniper", version: "model-y-juniper", buscar: "parasol" },
      { titulo: "Parasoles para Model 3 Highland", version: "model-3-highland", buscar: "parasol" },
      { titulo: "Parasoles más baratos", buscar: "parasol", orden: "barato" },
    ],
    preguntas: [
      {
        pregunta: "¿Un parasol universal sirve para un Tesla?",
        respuesta: "Puede tapar, pero deja huecos en los bordes y en la zona de las cámaras. Si hay uno específico para tu modelo y año, suele ajustar mejor.",
      },
      {
        pregunta: "¿Tapa el parasol las cámaras del parabrisas?",
        respuesta: "Se coloca con el coche aparcado, no en marcha. Aun así, comprueba que no obligue a pegar nada junto a las cámaras o sensores.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
  {
    slug: "tesery-para-tesla-que-vende-y-como-comprar",
    titulo: "Tesery para Tesla: qué venden y cómo comprar con el código ACCESORIOSTESLA",
    h1: "Tesery para tu Tesla: qué venden y qué mirar antes de comprar",
    descripcion:
      "Qué accesorios para Tesla Model 3 y Model Y vende Tesery, cómo aplicar el código ACCESORIOSTESLA y qué comprobar antes de pagar: envío, devoluciones y compatibilidad.",
    resumen: "Qué vende Tesery, cómo usar el código ACCESORIOSTESLA y qué revisar antes de pagar.",
    intro: [
      "Tesery es una tienda especializada en accesorios para Tesla con un catálogo muy amplio: alfombrillas, protecciones, volantes, kits de carrocería, iluminación y más. En Chollesla mostramos sus productos con el precio ya calculado tras aplicar el código.",
      "No publicamos valoraciones de compradores ni puntuaciones: aquí solo encontrarás el catálogo, el precio final y los puntos que conviene comprobar en la propia tienda antes de pagar.",
    ],
    comoElegir: [
      "Comprueba que la ficha nombre tu modelo y versión (Highland, Juniper o anterior) antes de añadir al carrito.",
      "Introduce el código ACCESORIOSTESLA en el carrito si la tienda no lo aplica sola; Chollesla muestra ya el precio con ese 5 %.",
      "Revisa en la tienda el plazo y el coste de envío a España y la política de devoluciones antes de pagar.",
      "En ofertas relámpago, confirma que el precio y las variantes siguen vigentes; pueden cambiar sin aviso.",
      "Compara con Amazon o Hansshow si el mismo accesorio es muy barato: a veces cambia el envío más que el precio.",
    ],
    bloques: [
      { titulo: "Lo más destacado de Tesery", tienda: "tesery" },
      { titulo: "Tesery para Model Y Juniper", tienda: "tesery", version: "model-y-juniper" },
      { titulo: "Tesery para Model 3 Highland", tienda: "tesery", version: "model-3-highland" },
      { titulo: "Lo más barato de Tesery", tienda: "tesery", orden: "barato" },
    ],
    preguntas: [
      {
        pregunta: "¿Qué código de descuento tiene Tesery?",
        respuesta: "El código es ACCESORIOSTESLA y da un 5 %. Los precios de Chollesla ya lo llevan descontado; confirma el importe final en el carrito.",
      },
      {
        pregunta: "¿Los enlaces a Tesery son de afiliado?",
        respuesta: "Sí, como el resto. Si compras desde ellos nos llega una pequeña comisión sin coste extra para ti.",
      },
      PREGUNTA_CODIGO,
    ],
  },
  {
    slug: "dashcam-y-modo-centinela-para-tesla",
    titulo: "Dashcam y modo Centinela para Tesla: memorias USB, SSD y accesorios",
    h1: "Dashcam y modo Centinela en tu Tesla: qué necesitas para grabar",
    descripcion:
      "Qué comprar para grabar con la dashcam y el modo Centinela de tu Tesla: memoria USB o SSD, hub USB y cámaras, con el precio final y qué comprobar.",
    resumen: "Memorias, SSD, hubs USB y cámaras para grabar con la dashcam y el modo Centinela.",
    intro: [
      "El Tesla graba con sus cámaras laterales, frontal y trasera, pero necesita una unidad USB para guardar los vídeos de la dashcam y del modo Centinela. La elección de esa unidad es lo que más afecta a la fiabilidad: una memoria inadecuada se llena rápido o falla con el calor.",
      "Aquí reunimos las unidades de almacenamiento, hubs y cámaras del catálogo con su precio final. Consulta siempre en el manual de tu coche los formatos y capacidades admitidos antes de comprar.",
    ],
    comoElegir: [
      "Para grabación continua es mejor un SSD o una memoria pensada para vídeo (alta resistencia de escritura) que un pendrive corriente.",
      "Elige capacidad según cuánto quieras conservar: el Centinela genera muchos clips.",
      "Un hub USB permite conectar a la vez la unidad de grabación y otros dispositivos; comprueba que sea compatible con tu versión de Tesla.",
      "Revisa el formato admitido por el coche y que la ficha mencione compatibilidad con Tesla.",
      "Evita unidades que sobresalgan mucho del puerto: el calor y las vibraciones las dañan antes.",
    ],
    bloques: [
      { titulo: "SSD, memorias y hubs para dashcam", buscar: "dashcam|dash cam|sentry|sentinel|ssd|microsd|otg|grabador|memoria usb|pendrive" },
      { titulo: "Dashcam más barata", buscar: "dashcam|dash cam|sentry|sentinel|ssd|microsd|otg|grabador|memoria usb|pendrive", orden: "barato" },
    ],
    preguntas: [
      {
        pregunta: "¿Qué necesito para que funcione el modo Centinela?",
        respuesta: "Una unidad USB compatible con el formato que indica Tesla y el modo activado en el coche. Consulta el manual de tu modelo para el formato exacto.",
      },
      {
        pregunta: "¿Vale cualquier pendrive?",
        respuesta: "Puede funcionar, pero en grabación continua se desgasta pronto. Un SSD o una unidad pensada para vídeo suele ser más fiable.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
  {
    slug: "fundas-de-asiento-para-tesla-model-3-y-model-y",
    titulo: "Fundas de asiento para Tesla Model 3 y Model Y: cómo elegirlas",
    h1: "Fundas de asiento para tu Tesla: qué comprobar antes de comprar",
    descripcion:
      "Cómo elegir fundas de asiento para Tesla Model 3 y Model Y: ajuste a medida, airbags laterales y calefacción, con el precio final de cada tienda.",
    resumen: "Fundas de asiento a medida: ajuste, airbags y calefacción antes de comprar.",
    intro: [
      "Las fundas protegen la tapicería de roces, manchas y del desgaste diario, y mantienen mejor el valor del coche. En un Tesla es importante elegir bien: los asientos incluyen calefacción y airbags laterales que la funda no debe estorbar.",
      "Lo más seguro es una funda específica para tu modelo y año. Las universales pueden costar menos pero se mueven y arrugan.",
    ],
    comoElegir: [
      "Comprueba modelo, año y número de plazas (cinco plazas o siete en Model Y) en la ficha.",
      "Asegúrate de que respeta los airbags laterales y no tapa los mandos ni la calefacción del asiento.",
      "Busca material fácil de limpiar si hay niños o mascotas.",
      "Mira cómo se fija: bandas elásticas y ganchos sin necesidad de desmontar el asiento son lo más cómodo.",
      "Si solo quieres proteger la parte trasera, valen las fundas de banqueta o los protectores de respaldo.",
    ],
    bloques: [
      { titulo: "Fundas para Model Y Juniper", version: "model-y-juniper", categoria: "asientos" },
      { titulo: "Fundas para Model 3 Highland", version: "model-3-highland", categoria: "asientos" },
      { titulo: "Fundas de asiento más baratas", categoria: "asientos", orden: "barato" },
    ],
    preguntas: [
      {
        pregunta: "¿Una funda interfiere con los airbags laterales?",
        respuesta: "Una funda mal diseñada puede hacerlo. Elige una que indique expresamente compatibilidad con los airbags laterales de tu modelo.",
      },
      {
        pregunta: "¿Se pueden usar con asientos calefactados?",
        respuesta: "Sí, si el material es fino y transpirable. Una funda gruesa o aislante reduce el efecto de la calefacción.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
  {
    slug: "funda-de-llave-y-tarjeta-para-tesla",
    titulo: "Funda de llave y tarjeta para Tesla: llaveros y protectores",
    h1: "Funda de llave y tarjeta para tu Tesla: qué hay y cómo elegir",
    descripcion:
      "Fundas, llaveros y tarjeteros para la llave Tesla y la tarjeta de acceso: materiales, ajuste y precio final de cada tienda para Model 3 y Model Y.",
    resumen: "Fundas y llaveros para la llave y la tarjeta del Tesla, con el precio final.",
    intro: [
      "La llave del Tesla, con su forma de coche en miniatura, y la tarjeta de acceso se rayan y se pierden fácilmente en el bolso o el bolsillo. Una funda o un llavero protege el plástico y ayuda a tenerlas siempre a mano.",
      "Hay dos productos distintos: fundas para el mando con forma de coche y tarjeteros o llaveros para la tarjeta. Comprueba cuál tienes tú antes de elegir.",
    ],
    comoElegir: [
      "Confirma si tu coche usa llave con forma de coche, tarjeta o ambas, y que el producto sea para ese tipo.",
      "El TPU flexible protege del polvo y los arañazos; el cuero o el metal dan mejor aspecto pero pesan más.",
      "Comprueba que la funda deje accesibles los botones y no sobresalga demasiado.",
      "Un tarjetero con llavero evita llevar la tarjeta suelta; elige uno que no obligue a sacarla para usarla.",
    ],
    bloques: [
      { titulo: "Fundas y llaveros para la llave Tesla", buscar: "llavero|tarjetero|tarjeta llave|(funda|cubierta|titular|soporte).{0,30}llave" },
      { titulo: "Llaveros más baratos", buscar: "llavero|tarjetero|tarjeta llave|(funda|cubierta|titular|soporte).{0,30}llave", orden: "barato" },
    ],
    preguntas: [
      {
        pregunta: "¿Funciona la tarjeta con funda?",
        respuesta: "Con fundas finas suele funcionar. Si no lee a la primera, prueba a sacarla de la funda; las muy gruesas o metálicas pueden interferir.",
      },
      {
        pregunta: "¿Qué pasa si pierdo la llave o la tarjeta?",
        respuesta: "Puedes usar el móvil como llave y registrar nuevas llaves desde el coche. Consulta el manual de tu modelo para el procedimiento.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
  {
    slug: "tuning-para-tesla-model-3-y-model-y-aleron-fibra-de-carbono",
    titulo: "Tuning para Tesla Model 3 y Model Y: alerones, fibra de carbono y detalles",
    h1: "Tuning para tu Tesla: alerones, fibra de carbono y detalles de carrocería",
    descripcion:
      "Guía de tuning para Tesla Model 3 y Model Y: alerón, piezas de fibra de carbono, carcasas de retrovisor y detalles exteriores, con precio final y qué comprobar.",
    resumen: "Alerones, fibra de carbono y detalles exteriores: cómo personalizar tu Tesla sin pasarte.",
    intro: [
      "Personalizar el exterior de un Tesla es sencillo porque el diseño es limpio: un alerón, unas carcasas de retrovisor o unos detalles en fibra de carbono cambian mucho el aspecto con poco dinero. Lo importante es que encajen con tu versión y se fijen bien.",
      "Antes de montar nada, consulta la normativa de tu zona sobre modificaciones de la carrocería y la cobertura de tu seguro: algunos cambios exteriores conviene comunicarlos.",
    ],
    comoElegir: [
      "Comprueba que la ficha nombre tu modelo y versión: Highland y Juniper tienen formas distintas de portón y retrovisores.",
      "En piezas de fibra de carbono, distingue la fibra real de los acabados imitación (ABS con acabado de carbono): cambian el precio y el peso.",
      "Mira el sistema de fijación: adhesivo 3M o clips. Un adhesivo exige superficie limpia y seca, y no se recoloca fácilmente.",
      "Si quieres reversibilidad total, prefiere piezas que se montan sobre las originales sin taladrar.",
      "Evita tapar sensores y cámaras con carcasas o adhesivos.",
    ],
    bloques: [
      { titulo: "Alerones y spoilers", buscar: "aler[oó]n|spoiler" },
      { titulo: "Fibra de carbono", buscar: "fibra de carbono|carbono" },
      { titulo: "Carcasas y detalles exteriores", buscar: "retrovisor|embellecedor|cubierta de|difusor", categoria: "exterior" },
      { titulo: "Tuning más barato", categoria: "exterior", orden: "barato" },
    ],
    preguntas: [
      {
        pregunta: "¿Un alerón afecta a la garantía o al seguro?",
        respuesta: "Puede hacerlo si se considera una modificación. Consulta las condiciones de tu seguro y de tu garantía antes de montar piezas que alteren la carrocería.",
      },
      {
        pregunta: "¿La fibra de carbono es real en todos los productos?",
        respuesta: "No. Algunos son fibra real y otros acabado imitación. Lee la descripción de la ficha en la tienda para saber el material.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
  {
    slug: "accesorios-tesla-para-invierno-frio-y-hielo",
    titulo: "Accesorios Tesla para invierno: frío, hielo y nieve",
    h1: "Accesorios para el Tesla en invierno: frío, hielo y nieve",
    descripcion:
      "Qué accesorios ayudan a tu Tesla Model 3 o Model Y en invierno: protección contra el hielo, alfombrillas de goma, carga y calefacción, con precio final.",
    resumen: "Protege tu Tesla del frío: hielo, alfombrillas de goma, carga y detalles de invierno.",
    intro: [
      "En invierno, el hielo en los cristales, la nieve que entra en el habitáculo y el frío al cargar son las molestias más habituales. Algunos accesorios sencillos las reducen sin tocar el coche.",
      "Esta guía reúne los productos del catálogo útiles para la estación fría. Para el uso del coche en bajas temperaturas, sigue siempre las recomendaciones del manual de tu modelo.",
    ],
    comoElegir: [
      "Alfombrillas de goma o TPE con borde elevado: retienen agua y barro y se lavan en segundos.",
      "Una cubierta o manta para el parabrisas ahorra raspar el hielo por la mañana; comprueba que su tamaño encaje con tu modelo.",
      "Para cargar con frío, un cable resistente y flexible a bajas temperaturas es más cómodo de manejar.",
      "Un raspador o cepillo de hielo con mango largo evita rayar el cristal y alcanza todo el parabrisas.",
      "Revisa que los productos de interior no tapen salidas de aire ni sensores.",
    ],
    bloques: [
      { titulo: "Alfombrillas para el invierno", categoria: "alfombrillas" },
      { titulo: "Cadenas de nieve y guardabarros", buscar: "cadenas de nieve|guardabarros|anti-?hielo|invierno" },
      { titulo: "Carga y cables", categoria: "carga" },
      { titulo: "Calefacción y confort", buscar: "calefac|calefactado" },
    ],
    preguntas: [
      {
        pregunta: "¿Qué alfombrillas son mejores para el invierno?",
        respuesta: "Las de goma o TPE con borde elevado, porque contienen el agua y la nieve que entra con las botas y se limpian fácilmente.",
      },
      {
        pregunta: "¿Hace falta algo especial para cargar con frío?",
        respuesta: "No es obligatorio, pero un cable flexible a bajas temperaturas se maneja mejor. Consulta el manual para las recomendaciones de carga con frío.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
  {
    slug: "hansshow-y-jowua-para-tesla-que-vende-cada-una",
    titulo: "Hansshow y Jowua para Tesla: qué vende cada tienda y códigos de descuento",
    h1: "Hansshow y Jowua para tu Tesla: qué vende cada una y qué código usar",
    descripcion:
      "Compara Hansshow (código VICTOR, 20 %) y Jowua (código ACCESORIOSTESLA, 5 %) para Tesla Model 3 y Model Y: qué venden, precios finales y qué revisar antes de comprar.",
    resumen: "Hansshow con VICTOR (20 %) y Jowua con ACCESORIOSTESLA (5 %): qué venden y cuándo conviene cada una.",
    intro: [
      "Hansshow y Jowua son dos tiendas especializadas en accesorios para Tesla con catálogos amplios. Las dos tienen código de descuento, y en Chollesla verás el precio ya calculado con el código aplicado.",
      "Hansshow aplica un 20 % con el código VICTOR y Jowua un 5 % con ACCESORIOSTESLA. El mejor precio final no siempre sale de la tienda con más descuento, así que conviene comparar el mismo tipo de producto.",
    ],
    comoElegir: [
      "Compara el precio final de productos equivalentes entre tiendas, no solo el porcentaje de descuento.",
      "Revisa en cada tienda el plazo y el coste de envío a España y la política de devoluciones antes de pagar.",
      "Introduce el código en el carrito si no se aplica solo y confirma el importe antes de pagar.",
      "Comprueba siempre que la ficha indique tu modelo y versión (Highland, Juniper o anterior).",
      "Si el producto se vende también en Amazon, compara: a veces compensa por plazo de entrega o devolución más sencilla.",
    ],
    bloques: [
      { titulo: "Lo más destacado de Hansshow", tienda: "hansshow" },
      { titulo: "Hansshow más barato", tienda: "hansshow", orden: "barato" },
      { titulo: "Lo más destacado de Jowua", tienda: "jowua" },
      { titulo: "Jowua más barato", tienda: "jowua", orden: "barato" },
    ],
    preguntas: [
      {
        pregunta: "¿Qué código usar en Hansshow y en Jowua?",
        respuesta: "En Hansshow, VICTOR (20 %). En Jowua, ACCESORIOSTESLA (5 %). Los precios de Chollesla ya los llevan aplicados; confirma el importe final en el carrito.",
      },
      {
        pregunta: "¿Cuál es mejor, Hansshow o Jowua?",
        respuesta: "Depende del producto. Compara el precio final de lo que buscas, el plazo de envío y la política de devoluciones de cada tienda.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
  {
    slug: "accesorios-camping-y-viaje-para-tesla",
    titulo: "Accesorios de camping y viaje para Tesla: colchón, nevera y energía",
    h1: "Accesorios de camping y viaje para tu Tesla",
    descripcion:
      "Accesorios para viajar o hacer camping con un Tesla Model 3 o Model Y: colchón, mesa, parasol lateral, inversor y organización del maletero, con precio final.",
    resumen: "Colchón, mesa, sombrillas laterales, inversor y organización para escapadas con tu Tesla.",
    intro: [
      "El maletero amplio y la batería del Tesla lo hacen cómodo para escapadas y noches de camping. Con unos pocos accesorios, el coche pasa de ser transporte a tener un espacio para dormir o descansar.",
      "Consulta siempre el manual de tu modelo antes de usar la batería para alimentar equipos externos, y respeta la normativa local sobre pernoctar en vehículos.",
    ],
    comoElegir: [
      "En un colchón o plataforma, comprueba que sus medidas encajen con tu modelo y con los asientos abatidos.",
      "Las sombrillas y parasoles laterales dan intimidad y frescor, pero solo se usan con el coche aparcado.",
      "Si compras un inversor, comprueba su potencia, la conexión y que sea compatible con tu versión de Tesla.",
      "Organizadores y cajas plegables ayudan a mantener el maletero ordenado en viajes largos.",
      "Una mesa plegable en el respaldo o el maletero es práctica para comer o trabajar durante la parada.",
    ],
    bloques: [
      { titulo: "Colchones, mesas y camping", buscar: "camping|colch[oó]n|mesa|nevera|acampada|picnic" },
      { titulo: "Sombrillas y protección solar", buscar: "sombrilla|parasol" },
      { titulo: "Energía: inversores y tomas", buscar: "inversor|v2l" },
      { titulo: "Organización del maletero", categoria: "organizacion" },
    ],
    preguntas: [
      {
        pregunta: "¿Se puede dormir en un Tesla?",
        respuesta: "Sí, con asientos abatidos y un colchón adecuado, y el modo Camping para climatizar. Consulta el manual para su uso y respeta la normativa local sobre pernoctar.",
      },
      {
        pregunta: "¿Se pueden alimentar equipos desde la batería?",
        respuesta: "Algunos accesorios usan las tomas del coche, pero hay límites de potencia. Consulta el manual de tu modelo antes de conectar nada.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
  {
    slug: "black-friday-tesla-2026-hansshow-codigo-victor",
    titulo: "Black Friday Tesla 2026: 20 % en Hansshow con el código VICTOR",
    h1: "Black Friday Tesla 2026: 20 % en Hansshow con VICTOR",
    descripcion:
      "Black Friday 2026 para Tesla Model 3 y Model Y: 20 % en Hansshow con el código VICTOR, sin pedido mínimo. Soporte giratorio, umbrales LED y luz ambiental.",
    resumen: "El código VICTOR da un 20 % en Hansshow sin pedido mínimo: qué mirar en Black Friday.",
    intro: [
      "En Hansshow, el código VICTOR descuenta un 20 % sin pedido mínimo. Lo comprobamos en su carrito el 26 de noviembre de 2026.",
      "Los precios de esta página ya llevan el código aplicado. Las campañas y los precios cambian estos días, así que confirma el importe en el carrito antes de pagar.",
    ],
    comoElegir: [
      "Comprueba que la ficha indique tu modelo y versión: Highland, Juniper o anterior. Algunas piezas no valen para las versiones Performance.",
      "Escribe VICTOR en la casilla de código del carrito y revisa que el descuento aparezca antes de pagar.",
      "No cuentes con sumar dos códigos ni con aplicar VICTOR sobre artículos en liquidación: Hansshow indica que sus ofertas de campaña no se combinan.",
      "Revisa el plazo y el coste de envío a España y la política de devoluciones.",
    ],
    bloques: [
      { titulo: "Soporte giratorio de pantalla", tienda: "hansshow", buscar: "giratori" },
      { titulo: "Luz ambiental para el interior", tienda: "hansshow", buscar: "ambient" },
      { titulo: "Umbrales de puerta con LED", tienda: "hansshow", buscar: "umbral" },
      { titulo: "Más de Hansshow", tienda: "hansshow" },
    ],
    preguntas: [
      {
        pregunta: "¿Qué descuento tiene el código VICTOR en Black Friday?",
        respuesta: "Un 20 % sin pedido mínimo, comprobado en el carrito de Hansshow el 26 de noviembre de 2026. Confirma el importe antes de pagar.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
  {
    slug: "frunk-electrico-y-cierre-suave-tesla",
    titulo: "Frunk eléctrico y puertas de cierre suave para Tesla: precios y qué mirar",
    h1: "Frunk eléctrico y cierre suave para Tesla",
    descripcion:
      "Frunk eléctrico, cerradura de succión y puertas de cierre suave para Tesla Model 3 y Model Y: precios finales, compatibilidad y qué revisar antes de comprar.",
    resumen: "Capó delantero motorizado y cierre por succión: precios y compatibilidad antes de gastar.",
    intro: [
      "El frunk eléctrico abre y cierra el capó delantero con motor, y el cierre suave termina de cerrar puertas o maleteros sin dar un golpe. Son de las mejoras más caras, así que conviene comprobar bien qué pieza corresponde a tu coche.",
      "Se instalan sobre componentes del vehículo. Antes de comprar, pregunta qué pasa con la garantía y valora que lo monte un taller.",
    ],
    comoElegir: [
      "Confirma modelo, versión y año en las variantes de la ficha: una pieza para Highland no vale necesariamente para Juniper ni para las versiones anteriores.",
      "Revisa qué incluye el kit: solo motorización, cierre por succión, control remoto o sensor de pie. El precio cambia mucho según el contenido.",
      "Lee las instrucciones de montaje y comprueba si exige cortar cables o taladrar.",
      "Comprueba que tenga detección de obstáculos y pruébala con cuidado después de instalarlo.",
      "Mira el plazo de entrega, la garantía de la tienda y quién paga el envío si hay que devolverlo.",
    ],
    bloques: [
      { titulo: "Frunk eléctrico", buscar: "power frunk|frunk el[eé]ctric" },
      { titulo: "Cerraduras de succión y cierre suave", buscar: "cierre suave|cerradura de succi[oó]n" },
    ],
    preguntas: [
      {
        pregunta: "¿Instalar un frunk eléctrico afecta a la garantía?",
        respuesta: "Una avería causada por una pieza de terceros o por su montaje puede quedar fuera de la garantía. Consulta con Tesla o con tu taller antes de instalarlo.",
      },
      {
        pregunta: "¿Lo puedo montar yo?",
        respuesta: "Depende del kit y de tu experiencia. Lee las instrucciones de la tienda antes de comprar y, si hay que tocar el cableado, lo prudente es que lo haga un profesional.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
  {
    slug: "pantalla-de-instrumentos-y-hud-para-tesla",
    titulo: "Pantalla de instrumentos y HUD para Tesla Model 3 y Model Y",
    h1: "Pantalla frente al volante y HUD para tu Tesla",
    descripcion:
      "Pantallas de instrumentos y HUD para Tesla Model 3 Highland y Model Y Juniper: ver la velocidad frente al volante. Precios finales y qué comprobar antes.",
    resumen: "Velocidad y datos frente al volante: pantallas y HUD, con compatibilidad y precio.",
    intro: [
      "El Model 3 y el Model Y muestran la velocidad en la pantalla central. Una pantalla de instrumentos o un HUD de terceros añade esa información delante del conductor.",
      "Qué datos muestra y cómo se conecta depende de cada producto y puede cambiar con las actualizaciones del coche.",
    ],
    comoElegir: [
      "Comprueba el modelo, la versión y el año admitidos en la ficha.",
      "Revisa cómo se alimenta y de dónde obtiene los datos, y si hay que desmontar molduras.",
      "Pregunta a la tienda si sigue funcionando tras las actualizaciones de software y cómo se actualiza.",
      "Colócala sin tapar la visión de la carretera ni zonas de airbag, y ajusta el brillo para la noche.",
      "Si dudas sobre la garantía o la inspección técnica, consúltalo antes de instalarla.",
    ],
    bloques: [
      {
        titulo: "Pantallas y HUD para el conductor",
        buscar: "dashboard display|panel de instrumentos inteligente|pantalla t[aá]ctil .*panel de instrumentos|pantalla del panel de instrumentos|\\bHUD\\b",
      },
    ],
    preguntas: [
      {
        pregunta: "¿Se puede ver la velocidad frente al volante en un Tesla?",
        respuesta: "Con accesorios de terceros, sí: pantallas de instrumentos o proyectores HUD. Comprueba la compatibilidad exacta con tu versión.",
      },
      {
        pregunta: "¿Pueden dejar de funcionar con una actualización?",
        respuesta: "Puede ocurrir, porque dependen de datos del coche. Pregunta a la tienda por su política de actualizaciones y devoluciones antes de comprar.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
  {
    slug: "primera-semana-con-tu-tesla-checklist",
    titulo: "Primera semana con tu Tesla: lista de ajustes y accesorios básicos",
    h1: "Tu primera semana con un Tesla: la lista",
    descripcion:
      "Checklist para tu primera semana con un Tesla Model 3 o Model Y: revisión de entrega, llave, carga en casa y accesorios básicos con precio final.",
    resumen: "Qué revisar, qué configurar y qué comprar (y qué puede esperar) los primeros siete días.",
    intro: [
      "Día 1: revisa pintura, cristales, llantas e interior, anota con fotos lo que veas y comunícalo a Tesla cuanto antes. Configura la llave del móvil, guarda las tarjetas llave y crea tu perfil de conductor.",
      "Días 2 a 4: ajusta el límite de carga y el horario según tu tarifa, decide si activas el modo Centinela y la grabación (consumen batería) y comprueba la presión de los neumáticos.",
      "Días 5 a 7: con unos días de uso ya sabes qué echas en falta. Compra primero lo que protege (alfombrillas y pantalla) y deja lo estético para después.",
      "Si quieres que te avisemos de las bajadas de precio de estos accesorios, únete a nuestro canal de Telegram desde esta página.",
    ],
    comoElegir: [
      "Compra para tu versión exacta: Highland, Juniper y los modelos anteriores no comparten muchas piezas.",
      "Empieza por lo que protege: alfombrillas, protector de pantalla y fundas si viajas con niños o mascotas.",
      "Antes de comprar un cargador, confirma qué enchufe o punto de carga tienes y la potencia disponible en casa.",
      "Para grabar con las cámaras, comprueba si tu coche ya trae memoria USB y qué capacidad tiene.",
    ],
    bloques: [
      { titulo: "1. Alfombrillas", categoria: "alfombrillas" },
      { titulo: "2. Protector de pantalla", buscar: "protector.*pantalla|cristal templado" },
      { titulo: "3. Carga", categoria: "carga" },
      { titulo: "4. Orden en la consola y el maletero", categoria: "organizacion" },
    ],
    preguntas: [
      {
        pregunta: "¿Qué es lo primero que conviene comprar para un Tesla nuevo?",
        respuesta: "Lo que protege desde el primer día, como alfombrillas y protector de pantalla, y lo que necesites para cargar según tu instalación. El resto puede esperar.",
      },
      {
        pregunta: "¿Qué reviso al recibir el coche?",
        respuesta: "Pintura, cristales, llantas, tapicería, puertas y maleteros, y que estén las tarjetas llave. Documenta con fotos cualquier defecto y avisa a Tesla cuanto antes.",
      },
      PREGUNTA_CODIGO,
      PREGUNTA_AFILIADO,
    ],
  },
];

export const GUIA_POR_SLUG = new Map(GUIAS.map((g) => [g.slug, g]));
