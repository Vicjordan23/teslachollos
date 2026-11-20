/** Tipos de producto para filtrar chollos. El orden de REGLAS importa: gana la primera que encaja. */
export type IdCategoria =
  | "pantalla"
  | "carga"
  | "iluminacion"
  | "alfombrillas"
  | "soportes"
  | "volante"
  | "asientos"
  | "organizacion"
  | "electronica"
  | "interior"
  | "exterior"
  | "otros";

export interface Categoria {
  id: IdCategoria;
  nombre: string;
}

export const CATEGORIAS: Categoria[] = [
  { id: "alfombrillas", nombre: "Alfombrillas" },
  { id: "pantalla", nombre: "Protectores de pantalla" },
  { id: "carga", nombre: "Carga" },
  { id: "iluminacion", nombre: "Iluminación" },
  { id: "organizacion", nombre: "Organización" },
  { id: "soportes", nombre: "Soportes" },
  { id: "volante", nombre: "Volantes" },
  { id: "asientos", nombre: "Asientos y fundas" },
  { id: "electronica", nombre: "Electrónica" },
  { id: "interior", nombre: "Interior" },
  { id: "exterior", nombre: "Exterior" },
  { id: "otros", nombre: "Otros" },
];

const REGLAS: [IdCategoria, RegExp][] = [
  ["pantalla", /protector(a|es)? (de |para )?(la |el )?(pantalla|camara)|screen protector|cristal templado|tempered glass|pelicula .*pantalla|matte screen/],
  ["carga", /\bcarga\b|cargador|charg|wallbox|\bcable|adaptador|adapter|\bnacs\b|\bccs|tipo ?2|type ?2|j1772|enchufe|\bevse\b/],
  ["iluminacion", /\bluz\b|\bluces\b|\bled\b|\bleds\b|light|lamp|ilumina|ambient/],
  ["alfombrillas", /alfombr|\bmats?\b|tapete|\bliner/],
  ["soportes", /soporte|holder|\bmount|telefono|phone|magsafe|giratori|swivel/],
  ["volante", /volante|steering|\byoke/],
  ["asientos", /asiento|\bseat|reposabrazos|armrest|cojin|cushion|respaldo|almohada|pillow|headrest|reposacabezas/],
  ["organizacion", /organiz|almacenamiento|storage|\bcaja|bandeja|\btray|gancho|\bhook|bolsa|\bbags?\b|papelera|trash|portavasos|cup holder|\bred\b|cargo net/],
  ["electronica", /\bhub\b|\busb\b|\bssd\b|memoria|microsd|refriger|nevera|gamepad|\bmandos?\b|controles de juego|dongle|\baudio\b|altavoz|speaker|subwoofer|entertainment|dashcam|\bhud\b|heads-up|instrument cluster|llavero|\bllave|key ?(card|ring|fob)|stalk|palanca|shifter|\bboton|\bbutton/],
  ["interior", /consola|console|interior|salpicadero|dashboard|tablero|ventilacion|\baire\b|parasol|sunshade|cortina|panel|\bclima\b|reposapies|pedal/],
  ["exterior", /llanta|wheel|tapacubos|spoiler|aleron|faldon|guardabarros|mud ?flap|parachoques|bumper|retrovisor|mirror|espejo|techo|\broof|cubierta|\bcover|embellecedor|\btrim\b|logo|emblem|carbono|carbon|exterior|\btail|\bdoor|puerta|manilla|handle|\bwrap|maletero|trunk|frunk|neumatico|\btire|rejilla|parrilla|grille|umbral|\bsill|valvula|\bvalve|\bjack\b|\bgato\b|pintura|retoque|decal|vinilo|deflector|visor|rain guard|skid plate|matricula|license plate/],
];

function normalizar(texto: string): string {
  return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** Tipo de producto a partir del título (y, si hace falta, la descripción). */
export function categoriaDe(titulo: string, descripcion = ""): IdCategoria {
  for (const texto of [titulo, descripcion]) {
    const t = normalizar(texto);
    for (const [id, regla] of REGLAS) if (regla.test(t)) return id;
  }
  return "otros";
}

export function nombreCategoria(id: IdCategoria): string {
  return CATEGORIAS.find((c) => c.id === id)?.nombre ?? "Otros";
}
