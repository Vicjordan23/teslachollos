import type { IdCategoria, IdTienda, IdVersion, PreguntaFrecuente } from "@chollesla/core";

/**
 * Textos editoriales de las páginas de entrada (hubs). Son consejos generales de compra, sin datos inventados:
 * los números (productos, precios, fechas) se calculan aparte con el catálogo real.
 */

export interface HubVersion {
  version: IdVersion;
  /** «Model Y Juniper». */
  nombre: string;
  /** Texto corto para títulos: «Tesla Model Y Juniper (2025 en adelante)». */
  completo: string;
  /** Modelo padre, para enlazar. */
  modelo: "model-y" | "model-3";
  parrafos: string[];
  preguntas: PreguntaFrecuente[];
  /** Párrafo que cambia según la versión en las páginas de categoría. */
  nota: string;
}

export const HUBS_VERSION: Record<string, HubVersion> = {
  "model-y-juniper": {
    version: "model-y-juniper",
    nombre: "Model Y Juniper",
    completo: "Tesla Model Y Juniper (2025 en adelante)",
    modelo: "model-y",
    parrafos: [
      "Juniper es el nombre en clave de la renovación del Model Y que se vende desde 2025. Cambió el frontal y la zaga, la iluminación y varios detalles del interior, y por eso muchos accesorios pensados para el Model Y anterior (2020 a 2024) ya no encajan igual.",
      "En esta página reunimos los accesorios cuya ficha dice que valen para el Model Y Juniper, con el precio final después del código de descuento de cada tienda. Están agrupados por tipo de producto: alfombrillas, protectores de pantalla, carga, iluminación, organizadores y más. Cada ficha enlaza a la tienda, donde conviene confirmar el año y la versión antes de pagar.",
      "Una regla útil: lo que va a medida (alfombrillas, protectores de pantalla, embellecedores, piezas de exterior) suele ser específico de cada generación, mientras que soportes, organizadores universales y cargadores suelen servir en cualquier versión. Si dudas, mira el año que indica la tienda.",
    ],
    preguntas: [
      {
        pregunta: "¿Qué es el Model Y Juniper?",
        respuesta:
          "Es el nombre en clave de la renovación del Tesla Model Y que se vende desde 2025. Se distingue del Model Y anterior (2020 a 2024) por el rediseño exterior y por varios cambios de interior, así que muchos accesorios a medida son distintos.",
      },
      {
        pregunta: "¿Valen los accesorios del Model Y de 2020 a 2024?",
        respuesta:
          "Depende del accesorio. Los soportes, organizadores universales y cargadores suelen servir. Las alfombrillas, los protectores de pantalla, los embellecedores y las piezas de exterior suelen ser específicos de cada generación: comprueba el año y la versión en la ficha de la tienda antes de comprar.",
      },
      {
        pregunta: "¿Y la versión Standard del Model Y?",
        respuesta:
          "En Chollesla la Standard se trata como una versión aparte. Solo marcamos un accesorio como compatible con ella si la ficha de la tienda la nombra de forma expresa.",
      },
      {
        pregunta: "¿El precio que veo es el final?",
        respuesta:
          "Sí: es el precio de la tienda con el código de descuento ya aplicado cuando la tienda tiene uno. Los precios se revisan con frecuencia, pero pueden cambiar; confirma siempre el importe en la tienda antes de pagar.",
      },
    ],
    nota: "Para el Model Y Juniper, fíjate en que el producto indique 2025 o posterior (o la palabra Juniper). Un accesorio del Model Y de 2020 a 2024 puede no encajar.",
  },
  "model-3-highland": {
    version: "model-3-highland",
    nombre: "Model 3 Highland",
    completo: "Tesla Model 3 Highland (2024 en adelante)",
    modelo: "model-3",
    parrafos: [
      "Highland es el nombre en clave del Model 3 renovado que se vende desde 2024. Trae un frontal y una zaga rediseñados, nueva iluminación, pantalla para los pasajeros de atrás y un interior distinto, por lo que muchos accesorios del Model 3 anterior no valen.",
      "En esta página reunimos los accesorios cuya ficha dice que valen para el Model 3 Highland, con el precio final después del código de descuento de cada tienda. Están agrupados por tipo de producto para que llegues antes a lo que buscas, y cada ficha te lleva a la tienda, donde conviene confirmar el año antes de pagar.",
      "Una regla útil: lo que va a medida (alfombrillas, protectores de pantalla, embellecedores, piezas de exterior) suele ser específico de cada generación, mientras que soportes, organizadores universales y cargadores suelen servir en cualquier versión.",
    ],
    preguntas: [
      {
        pregunta: "¿Qué es el Model 3 Highland?",
        respuesta:
          "Es el nombre en clave del Tesla Model 3 renovado que se vende desde 2024. Cambia el diseño exterior, la iluminación y varios elementos del interior respecto al Model 3 anterior, y eso afecta a los accesorios a medida.",
      },
      {
        pregunta: "¿Valen los accesorios del Model 3 de 2017 a 2023?",
        respuesta:
          "Los universales (soportes, organizadores genéricos, cargadores) suelen valer. Las alfombrillas, los protectores de pantalla, los embellecedores y las piezas de exterior suelen ser específicos de cada generación; comprueba el año en la ficha de la tienda.",
      },
      {
        pregunta: "¿Y el Model 3 Standard?",
        respuesta:
          "En Chollesla la versión Standard se trata aparte. Solo marcamos un accesorio como compatible con ella si la ficha de la tienda la nombra de forma expresa.",
      },
      {
        pregunta: "¿El precio que veo es el final?",
        respuesta:
          "Sí: es el precio de la tienda con el código de descuento ya aplicado cuando la tienda tiene uno. Los precios se revisan con frecuencia, pero pueden cambiar; confirma siempre el importe en la tienda antes de pagar.",
      },
    ],
    nota: "Para el Model 3 Highland, fíjate en que el producto indique 2024 o posterior (o la palabra Highland). Un accesorio del Model 3 anterior puede no encajar.",
  },
};

export const IDS_HUBS_VERSION = Object.keys(HUBS_VERSION);

/** Consejo de compra por tipo de producto (genérico y verdadero para cualquier versión). */
export const CONSEJOS_CATEGORIA: Record<IdCategoria, string> = {
  alfombrillas:
    "Las alfombrillas a medida cubren mejor el suelo y retienen el agua y el barro, pero cada generación del coche tiene un suelo distinto: comprueba el año y si el juego incluye plazas traseras y maletero. Las de TPE o goma se limpian con agua; las de tela abrigan más pero ensucian antes.",
  pantalla:
    "Un protector de cristal templado reduce arañazos y huellas, y el acabado mate quita reflejos a costa de algo de nitidez. Elige el tamaño exacto de tu pantalla y fíjate en si trae guía de colocación: ponerlo recto a la primera es lo más difícil.",
  carga:
    "Antes de comprar un cargador o un cable, mira el conector (Tipo 2 en Europa), la potencia máxima que admite tu coche y el largo del cable. Un cable de más potencia que la de tu coche no carga más rápido, simplemente no se aprovecha.",
  iluminacion:
    "Las luces de ambiente, las de umbral y las de cortesía se conectan de formas distintas: unas van por USB o por el enchufe de 12 V y otras sustituyen la bombilla original. Comprueba que el producto indique tu año y versión, porque el cableado cambia entre generaciones.",
  organizacion:
    "Los organizadores de consola, maletero y frunk aprovechan huecos concretos del coche, así que el ajuste depende de la generación. Los cajones y bolsas genéricos valen para cualquier versión; los moldeados a medida solo para la que indican.",
  soportes:
    "Para el móvil o la tablet, mira cómo se sujeta (imán, pinza, rejilla) y dónde va montado: algunos soportes tapan salidas de aire o los sensores. Si usas carga inalámbrica, comprueba que el soporte no la bloquee.",
  volante:
    "Las fundas y los cubrevolantes cambian el tacto y el diámetro. Asegúrate de que sean para el volante de tu generación: el de los modelos renovados tiene otra forma y otros mandos, y una funda que no encaja resulta incómoda y poco segura.",
  asientos:
    "Las fundas de asiento a medida respetan airbags laterales y calefacción; las universales no siempre lo hacen. Revisa que indiquen compatibilidad con tu año, el número de plazas y si cubren también los asientos traseros.",
  electronica:
    "Cámaras, hubs USB y accesorios electrónicos dependen de los puertos de tu coche: no todos los Tesla actuales tienen los mismos USB ni la misma ubicación. Comprueba el tipo de conector y que el producto indique tu generación.",
  interior:
    "Los accesorios de interior (embellecedores, fundas, protectores) suelen ser específicos de cada generación, porque la consola, las puertas y el salpicadero cambian con las renovaciones. Fíjate en el año que indica la tienda.",
  exterior:
    "En exterior (protectores, embellecedores, cubiertas, láminas) el ajuste manda: una pieza para otra generación no encaja o queda mal. Comprueba el año, y si es adhesiva, que la superficie esté limpia al colocarla.",
  otros:
    "En esta categoría hay productos variados que no encajan en las demás: revisa en cada ficha para qué modelo y año están pensados antes de comprar.",
};

export interface InfoCodigo {
  tienda: IdTienda;
  /** Texto de «cómo funciona» propio de la tienda. */
  como: string;
  /** Aviso honesto sobre envíos, plazos o límites conocidos. */
  aviso: string;
}

export const CODIGOS: Partial<Record<IdTienda, InfoCodigo>> = {
  jowua: {
    tienda: "jowua",
    como: "Jowua vende accesorios para Tesla desde su propia tienda online. Nuestro enlace ya viaja con el código en la dirección, y si la tienda te lo pide en el carrito, escríbelo en el campo de código de descuento.",
    aviso: "Revisa en el carrito que el descuento aparece antes de pagar y confirma los gastos de envío a España.",
  },
  hansshow: {
    tienda: "hansshow",
    como: "Hansshow vende accesorios y mejoras para Tesla: volantes y piezas de fibra de carbono, iluminación, soportes de pantalla y piezas de exterior. El 20 % se aplica con el código en el carrito; los precios de Chollesla ya lo incluyen.",
    aviso: "Es el mayor descuento de nuestras tiendas. Confirma en el carrito que el código se aplica y revisa envío y plazos.",
  },
  tesery: {
    tienda: "tesery",
    como: "Tesery es una tienda especializada en accesorios para Tesla con un catálogo muy amplio (alfombrillas, protectores, iluminación, organización). Los precios de Chollesla ya llevan el 5 % del código aplicado.",
    aviso: "Las tiendas suelen limitar un solo código por pedido: no se acumulan. Confirma el importe final en el carrito.",
  },
  evdance: {
    tienda: "evdance",
    como: "EVDANCE vende wallboxes y cargadores portátiles para coches eléctricos. El 20 % se aplica con el código en el carrito y los precios de Chollesla ya lo incluyen.",
    aviso: "EVDANCE envía desde la Unión Europea y cobra gastos de envío a España: súmalos al precio antes de decidir.",
  },
};

export const IDS_CODIGOS = Object.keys(CODIGOS) as IdTienda[];
