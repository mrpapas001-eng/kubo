// lib/catalog/recommendCategory.ts
//
// Recomendador de categorías para "¿Qué quieres vender?" en /publish.
// Primera versión: reglas por palabras clave con normalización y puntuación,
// sin coste por consulta. La interfaz (recommendCategory) está pensada para
// poder sustituirse o complementarse en el futuro con un servicio de IA sin
// cambiar el formulario: basta con devolver el mismo tipo CategoryRecommendation.

export type CategoryRecommendation = {
  categoryKey: string;
  subcategorySlug: string | null;
  emoji: string;
  confidence: "high" | "medium";
};

type Rule = {
  /** Frases o palabras ya normalizadas (minúsculas, sin tildes). */
  terms: string[];
  category: string;
  subcategory?: string;
  weight: number;
};

const CATEGORY_EMOJI: Record<string, string> = {
  juguetes: "🧸",
  "papeleria-oficina": "📎",
  "herramientas-ferreteria": "🛠️",
  "salud-belleza": "💄",
  hogar: "🛋️",
  celulares: "📱",
  motor: "🚗",
  inmobiliaria: "🏠",
  informatica: "💻",
  "imagen-sonido": "📺",
  juegos: "🎮",
  deportes: "🚴",
  mascotas: "🐾",
  bebes: "👶",
  moda: "👗",
  "regalos-celebraciones": "🎁",
};

/**
 * Reglas de coincidencia. Las frases de varias palabras pesan más que las
 * palabras sueltas para evitar falsos positivos (p. ej. "carro de juguete"
 * debe ganar a "carro").
 */
const RULES: Rule[] = [
  // ── Juguetes ──────────────────────────────────────────────
  { terms: ["peluche", "peluches"], category: "juguetes", subcategory: "peluches", weight: 5 },
  { terms: ["muneca", "munecas", "muneco", "munecos", "barbie"], category: "juguetes", subcategory: "munecas-y-figuras", weight: 5 },
  { terms: ["figura de accion", "figuras de accion", "funko"], category: "juguetes", subcategory: "munecas-y-figuras", weight: 5 },
  { terms: ["juego de mesa", "juegos de mesa", "rompecabezas", "lego"], category: "juguetes", subcategory: "juegos-de-mesa", weight: 6 },
  { terms: ["juguete", "juguetes", "juguete didactico", "trompo", "balon de juguete"], category: "juguetes", weight: 4 },
  { terms: ["carro de juguete", "carros de juguete", "pista de carros"], category: "juguetes", weight: 7 },

  // ── Papelería y Oficina ───────────────────────────────────
  { terms: ["cinta adhesiva", "dispensador de cinta", "cinta pegante"], category: "papeleria-oficina", subcategory: "oficina-y-archivo", weight: 6 },
  { terms: ["cuaderno", "cuadernos", "resma", "resmas", "agenda", "agendas"], category: "papeleria-oficina", subcategory: "cuadernos-y-papel", weight: 4 },
  { terms: ["archivador", "archivadores", "carpeta", "carpetas", "grapadora", "cosedora", "perforadora", "calculadora"], category: "papeleria-oficina", subcategory: "oficina-y-archivo", weight: 4 },
  { terms: ["boligrafo", "boligrafos", "esfero", "esferos", "lapiz", "lapices", "marcador", "marcadores", "resaltador", "resaltadores"], category: "papeleria-oficina", subcategory: "escritura-y-dibujo", weight: 4 },
  { terms: ["papeleria", "utiles escolares", "kit escolar"], category: "papeleria-oficina", subcategory: "utiles-escolares", weight: 5 },

  // ── Herramientas y Ferretería ─────────────────────────────
  { terms: ["taladro", "taladros", "pulidora", "caladora", "soldadora", "compresor", "rotomartillo"], category: "herramientas-ferreteria", subcategory: "herramientas-electricas", weight: 5 },
  { terms: ["martillo", "martillos", "destornillador", "destornilladores", "alicate", "alicates", "llave inglesa", "serrucho", "sierra manual", "juego de copas"], category: "herramientas-ferreteria", subcategory: "herramientas-manuales", weight: 5 },
  { terms: ["herramienta", "herramientas", "ferreteria", "caja de herramientas"], category: "herramientas-ferreteria", weight: 4 },
  { terms: ["guadana", "podadora", "motosierra"], category: "herramientas-ferreteria", subcategory: "jardineria", weight: 5 },
  { terms: ["escalera de aluminio", "carretilla", "mezcladora de cemento", "andamio"], category: "herramientas-ferreteria", subcategory: "construccion", weight: 5 },

  // ── Salud y Belleza ───────────────────────────────────────
  { terms: ["maquillaje", "labial", "labiales", "pestanina", "base de maquillaje", "sombras de ojos", "rubor"], category: "salud-belleza", subcategory: "maquillaje", weight: 5 },
  { terms: ["crema facial", "crema corporal", "protector solar", "serum", "mascarilla facial"], category: "salud-belleza", subcategory: "cuidado-de-la-piel", weight: 5 },
  { terms: ["secador de cabello", "plancha de cabello", "onduladora", "rizadora"], category: "salud-belleza", subcategory: "aparatos-de-belleza", weight: 6 },
  { terms: ["shampoo", "champu", "tinte", "tintes", "acondicionador", "keratina"], category: "salud-belleza", subcategory: "cabello", weight: 4 },
  { terms: ["esmalte", "esmaltes", "manicure", "pedicure", "maquina de afeitar", "afeitadora", "depiladora"], category: "salud-belleza", subcategory: "aparatos-de-belleza", weight: 4 },
  { terms: ["silla de ruedas", "caminador ortopedico", "muletas", "tensiometro", "glucometro"], category: "salud-belleza", subcategory: "salud-y-bienestar", weight: 6 },

  // ── Hogar ─────────────────────────────────────────────────
  { terms: ["sofa", "sofas", "sofacama", "mueble", "muebles", "comedor", "comedores", "armario", "armarios", "closet", "biblioteca", "mesa de centro", "mesa de noche"], category: "hogar", subcategory: "muebles-de-hogar", weight: 4 },
  { terms: ["cama", "camas", "camarote", "camarotes"], category: "hogar", subcategory: "muebles-de-hogar", weight: 3 },
  { terms: ["colchon", "colchones"], category: "hogar", subcategory: "colchones", weight: 5 },
  { terms: ["lampara", "lamparas"], category: "hogar", subcategory: "iluminacion", weight: 4 },
  { terms: ["vajilla", "ollas", "juego de ollas", "cubiertos"], category: "hogar", subcategory: "menaje", weight: 4 },

  // ── Celulares ─────────────────────────────────────────────
  { terms: ["iphone", "celular", "celulares", "smartphone", "telefono movil"], category: "celulares", subcategory: "celulares", weight: 5 },
  { terms: ["samsung galaxy", "xiaomi redmi", "motorola"], category: "celulares", subcategory: "celulares", weight: 4 },

  // ── Motor ─────────────────────────────────────────────────
  { terms: ["moto", "motos", "motocicleta", "motocicletas"], category: "motor", subcategory: "motos", weight: 5 },
  { terms: ["carro", "carros", "camioneta", "camionetas", "automovil", "vehiculo"], category: "motor", subcategory: "carros", weight: 3 },
  { terms: ["repuestos de carro", "repuestos de moto", "rines", "llantas"], category: "motor", subcategory: "repuestos", weight: 5 },

  // ── Inmobiliaria ──────────────────────────────────────────
  { terms: ["apartamento", "apartamentos", "apartaestudio", "finca", "lote", "casa campestre", "local comercial"], category: "inmobiliaria", weight: 5 },

  // ── Informática ───────────────────────────────────────────
  { terms: ["portatil", "portatiles", "laptop", "computador portatil"], category: "informatica", subcategory: "portatiles", weight: 5 },
  { terms: ["computador", "computadores", "pc gamer", "torre de computador"], category: "informatica", weight: 4 },
  { terms: ["tablet", "tablets", "ipad"], category: "informatica", subcategory: "tablets", weight: 5 },
  { terms: ["teclado", "mouse", "monitor de computador"], category: "informatica", subcategory: "accesorios", weight: 4 },

  // ── Imagen y sonido ───────────────────────────────────────
  { terms: ["televisor", "televisores", "smart tv", "pantalla de tv"], category: "imagen-sonido", subcategory: "imagen", weight: 5 },
  { terms: ["parlante", "parlantes", "bafle", "bafles", "amplificador", "teatro en casa", "barra de sonido"], category: "imagen-sonido", subcategory: "sonido", weight: 5 },
  { terms: ["camara fotografica", "camara profesional", "gopro", "dron"], category: "imagen-sonido", subcategory: "fotografia", weight: 5 },
  { terms: ["guitarra", "bateria musical", "piano", "teclado musical", "violin"], category: "imagen-sonido", subcategory: "musica", weight: 5 },

  // ── Juegos (gamer) ────────────────────────────────────────
  { terms: ["playstation", "play station", "xbox", "nintendo", "consola", "consolas", "nintendo switch"], category: "juegos", subcategory: "consolas", weight: 5 },
  { terms: ["videojuego", "videojuegos", "juego de playstation", "juego de xbox"], category: "juegos", subcategory: "videojuegos", weight: 5 },

  // ── Deportes ──────────────────────────────────────────────
  { terms: ["bicicleta", "bicicletas", "cicla", "bici"], category: "deportes", subcategory: "bicicletas", weight: 5 },
  { terms: ["caminadora", "eliptica", "pesas", "mancuernas", "trotadora"], category: "deportes", subcategory: "gimnasio", weight: 5 },
  { terms: ["guayos", "balon de futbol"], category: "deportes", subcategory: "futbol", weight: 5 },

  // ── Mascotas ──────────────────────────────────────────────
  { terms: ["perro", "perros", "cachorro", "cachorros"], category: "mascotas", subcategory: "perros", weight: 5 },
  { terms: ["gato", "gatos", "gatico", "gaticos"], category: "mascotas", subcategory: "gatos", weight: 5 },
  { terms: ["casa para perro", "guacal", "collar para perro", "comida para perro", "comida para gato"], category: "mascotas", subcategory: "varios", weight: 6 },

  // ── Bebés ─────────────────────────────────────────────────
  { terms: ["coche de bebe", "coche para bebe", "cochecito"], category: "bebes", subcategory: "coches-de-bebe", weight: 6 },
  { terms: ["cuna", "cunas", "corral para bebe"], category: "bebes", subcategory: "habitacion-bebes", weight: 5 },
  { terms: ["ropa de bebe", "panales", "tetero", "teteros"], category: "bebes", subcategory: "higiene-y-cuidado", weight: 5 },

  // ── Moda ──────────────────────────────────────────────────
  { terms: ["perfume", "perfumes", "locion", "lociones"], category: "moda", subcategory: "perfumes", weight: 5 },
  { terms: ["zapatos", "tenis", "botas", "sandalias", "zapatillas"], category: "moda", subcategory: "calzado", weight: 4 },
  { terms: ["vestido", "vestidos", "blusa", "blusas", "falda", "faldas"], category: "moda", subcategory: "moda-mujer", weight: 4 },
  { terms: ["camisa", "camisas", "pantalon", "pantalones", "chaqueta", "chaquetas", "ropa"], category: "moda", weight: 3 },
  { terms: ["disfraz", "disfraces"], category: "moda", subcategory: "disfraces", weight: 5 },
  { terms: ["reloj", "relojes", "joyas", "pulsera", "cadena de oro"], category: "moda", subcategory: "joyeria-bisuteria", weight: 4 },

  // ── Regalos y celebraciones ───────────────────────────────
  { terms: ["globos", "pinateria", "pinata", "velas decorativas", "decoracion para fiesta", "desayuno sorpresa"], category: "regalos-celebraciones", weight: 5 },
];

/** Normaliza: minúsculas, sin tildes, solo letras/números y espacios simples. */
export function normalizeSellQuery(text: string): string {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9ñ\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasTerm(normalized: string, tokens: Set<string>, term: string): boolean {
  if (term.includes(" ")) {
    return normalized.includes(term);
  }
  if (tokens.has(term)) return true;
  // plegado simple de plurales: "cuadernos" coincide con "cuaderno"
  for (const token of tokens) {
    if (token === `${term}s` || token === `${term}es`) return true;
    if (term === `${token}s` || term === `${token}es`) return true;
  }
  return false;
}

const MIN_SCORE = 3;
const MIN_MARGIN = 2;

/**
 * Devuelve la categoría recomendada para un texto libre, o null si no hay
 * suficiente certeza (en ese caso el formulario muestra el selector normal).
 */
export function recommendCategory(text: string): CategoryRecommendation | null {
  const normalized = normalizeSellQuery(text);
  if (normalized.length < 3) return null;

  const tokens = new Set(normalized.split(" "));

  const scores = new Map<string, number>();
  const bestSub = new Map<string, { slug: string; weight: number }>();

  for (const rule of RULES) {
    const matched = rule.terms.some((term) => hasTerm(normalized, tokens, term));
    if (!matched) continue;

    scores.set(rule.category, (scores.get(rule.category) ?? 0) + rule.weight);

    if (rule.subcategory) {
      const current = bestSub.get(rule.category);
      if (!current || rule.weight > current.weight) {
        bestSub.set(rule.category, { slug: rule.subcategory, weight: rule.weight });
      }
    }
  }

  if (scores.size === 0) return null;

  const ranking = [...scores.entries()].sort((a, b) => b[1] - a[1]);
  const [topCategory, topScore] = ranking[0];
  const secondScore = ranking[1]?.[1] ?? 0;

  if (topScore < MIN_SCORE) return null;
  if (topScore - secondScore < MIN_MARGIN) return null;

  return {
    categoryKey: topCategory,
    subcategorySlug: bestSub.get(topCategory)?.slug ?? null,
    emoji: CATEGORY_EMOJI[topCategory] ?? "🏷️",
    confidence: topScore >= 5 ? "high" : "medium",
  };
}
