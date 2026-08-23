// lib/catalog/recommendCategory.ts
//
// Recomendador de categorías para "¿Qué quieres vender?" en /publish.
// Reglas por palabras clave con normalización y puntuación, sin coste por consulta.
// Las frases específicas pesan más que las palabras sueltas para resolver ambigüedades.

export type CategoryRecommendation = {
  categoryKey: string;
  subcategorySlug: string | null;
  emoji: string;
  confidence: "high" | "medium";
};

type Rule = {
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

const RULES: Rule[] = [
  // Frases específicas primero: deben ganar a palabras ambiguas.
  { terms: ["silla de ruedas", "silla ortopedica"], category: "salud-belleza", subcategory: "salud-y-bienestar", weight: 10 },
  { terms: ["silla para bebe", "silla de bebe", "silla comedor bebe", "silla alta bebe"], category: "bebes", subcategory: "alimentacion", weight: 10 },
  { terms: ["silla gamer", "silla gaming", "silla de oficina", "silla escritorio"], category: "hogar", subcategory: "muebles-de-hogar", weight: 9 },
  { terms: ["carro de juguete", "carros de juguete", "pista de carros"], category: "juguetes", weight: 10 },
  { terms: ["coche de bebe", "coche para bebe", "cochecito"], category: "bebes", subcategory: "coches", weight: 9 },
  { terms: ["teclado musical"], category: "imagen-sonido", subcategory: "musica", weight: 9 },
  { terms: ["monitor de computador"], category: "informatica", weight: 9 },

  // Juguetes
  { terms: ["peluche", "peluches", "osito", "oso de peluche"], category: "juguetes", subcategory: "peluches", weight: 5 },
  { terms: ["muneca", "munecas", "muneco", "munecos", "barbie", "figura de accion", "figuras de accion", "funko"], category: "juguetes", subcategory: "munecas-y-figuras", weight: 5 },
  { terms: ["juego de mesa", "juegos de mesa", "rompecabezas", "puzzle", "lego", "domino infantil"], category: "juguetes", subcategory: "juegos-de-mesa", weight: 6 },
  { terms: ["juguete", "juguetes", "trompo", "yoyo", "patito de goma", "bloques", "bloques didacticos"], category: "juguetes", weight: 4 },
  { terms: ["triciclo infantil", "patineta infantil", "piscina de pelotas"], category: "juguetes", subcategory: "aire-libre", weight: 6 },

  // Papelería y Oficina
  { terms: ["cinta adhesiva", "dispensador de cinta", "cinta pegante", "cinta transparente"], category: "papeleria-oficina", subcategory: "oficina-y-archivo", weight: 6 },
  { terms: ["cuaderno", "cuadernos", "resma", "resmas", "agenda", "agendas", "block", "libreta", "libretas", "papel carta", "papel oficio"], category: "papeleria-oficina", subcategory: "cuadernos-y-papel", weight: 4 },
  { terms: ["archivador", "archivadores", "carpeta", "carpetas", "grapadora", "cosedora", "perforadora", "calculadora", "clip", "clips", "gancho legajador", "porta lapices"], category: "papeleria-oficina", subcategory: "oficina-y-archivo", weight: 4 },
  { terms: ["boligrafo", "boligrafos", "esfero", "esferos", "lapiz", "lapices", "marcador", "marcadores", "resaltador", "resaltadores", "colores", "crayones", "borrador", "sacapuntas"], category: "papeleria-oficina", subcategory: "escritura-y-dibujo", weight: 4 },
  { terms: ["papeleria", "utiles escolares", "kit escolar", "cartuchera", "compas escolar", "regla escolar"], category: "papeleria-oficina", subcategory: "utiles-escolares", weight: 5 },
  { terms: ["pintura acrilica", "acuarela", "lienzo", "pinceles", "foami", "fomi", "silicona para manualidades"], category: "papeleria-oficina", subcategory: "arte-y-manualidades", weight: 5 },

  // Herramientas y Ferretería
  { terms: ["taladro", "taladros", "pulidora", "caladora", "soldadora", "compresor", "rotomartillo", "lijadora", "atornillador electrico", "sierra electrica"], category: "herramientas-ferreteria", subcategory: "herramientas-electricas", weight: 5 },
  { terms: ["martillo", "martillos", "destornillador", "destornilladores", "alicate", "alicates", "llave inglesa", "serrucho", "sierra manual", "juego de copas", "llave de tubo", "llave allen", "metro", "flexometro", "nivel"], category: "herramientas-ferreteria", subcategory: "herramientas-manuales", weight: 5 },
  { terms: ["herramienta", "herramientas", "ferreteria", "caja de herramientas", "tornillo", "tornillos", "tuerca", "tuercas", "chazo", "chazos"], category: "herramientas-ferreteria", weight: 4 },
  { terms: ["guadana", "podadora", "motosierra", "pala jardin", "rastrillo", "manguera jardin"], category: "herramientas-ferreteria", subcategory: "jardineria", weight: 5 },
  { terms: ["escalera de aluminio", "carretilla", "mezcladora de cemento", "andamio", "palustre", "llana", "cincel"], category: "herramientas-ferreteria", subcategory: "construccion", weight: 5 },
  { terms: ["casco industrial", "guantes industriales", "botas de seguridad", "gafas de seguridad", "arnes de seguridad"], category: "herramientas-ferreteria", subcategory: "seguridad-industrial", weight: 5 },

  // Salud y Belleza
  { terms: ["maquillaje", "labial", "labiales", "pestanina", "rimel", "base de maquillaje", "sombras de ojos", "rubor", "corrector", "delineador"], category: "salud-belleza", subcategory: "maquillaje", weight: 5 },
  { terms: ["crema facial", "crema corporal", "protector solar", "serum", "mascarilla facial", "limpiador facial", "agua micelar"], category: "salud-belleza", subcategory: "cuidado-de-la-piel", weight: 5 },
  { terms: ["secador de cabello", "secador de pelo", "plancha de cabello", "plancha de pelo", "onduladora", "rizadora", "cepillo secador"], category: "salud-belleza", subcategory: "aparatos-de-belleza", weight: 6 },
  { terms: ["shampoo", "champu", "tinte", "tintes", "acondicionador", "keratina", "peine", "peines", "cepillo de cabello", "cepillo para cabello", "gel para cabello", "cera para cabello"], category: "salud-belleza", subcategory: "cabello", weight: 5 },
  { terms: ["esmalte", "esmaltes", "manicure", "pedicure", "maquina de afeitar", "afeitadora", "depiladora", "cortapelo", "maquina de cortar cabello"], category: "salud-belleza", subcategory: "aparatos-de-belleza", weight: 4 },
  { terms: ["muletas", "caminador ortopedico", "tensiometro", "glucometro", "termometro", "nebulizador", "oximetro", "faja ortopedica", "rodillera", "tobillera"], category: "salud-belleza", subcategory: "salud-y-bienestar", weight: 6 },

  // Hogar
  { terms: ["silla", "sillas", "mesa", "mesas", "sofa", "sofas", "sofacama", "mueble", "muebles", "comedor", "comedores", "armario", "armarios", "closet", "biblioteca", "escritorio", "escritorios", "mesa de centro", "mesa de noche", "butaca", "banco de cocina", "mecedora"], category: "hogar", subcategory: "muebles-de-hogar", weight: 4 },
  { terms: ["cama", "camas", "camarote", "camarotes", "cabecero", "nochero"], category: "hogar", subcategory: "muebles-de-hogar", weight: 4 },
  { terms: ["colchon", "colchones", "colchoneta para cama"], category: "hogar", subcategory: "colchones", weight: 5 },
  { terms: ["lampara", "lamparas", "bombillo", "bombillos", "lampara de techo", "lampara de mesa"], category: "hogar", subcategory: "iluminacion", weight: 4 },
    { 
    terms: [
      "vajilla", "vajillas",
      "olla", "ollas", "juego de ollas",
      "cubierto", "cubiertos",
      "tenedor", "tenedores",
      "cuchara", "cucharas",
      "cucharita", "cucharitas",
      "cucharon", "cucharones",
      "cuchillo", "cuchillos", "cuchillo de cocina",
      "sarten", "sartenes",
      "tabla de picar",
      "vaso", "vasos",
      "copa", "copas",
      "plato", "platos",
      "taza", "tazas",
      "pocillo", "pocillos",
      "jarra", "jarras",
      "termo", "termos",
      "bandeja", "bandejas",
      "escurridor",
      "colador", "coladores",
      "rallador",
      "abrelatas",
      "destapador",
      "salero",
      "azucarera",
      "recipiente", "recipientes"
    ],
    category: "hogar",
    subcategory: "menaje",
    weight: 4
  },

  {
    terms: [
      "cortina", "cortinas",
      "cojin", "cojines",
      "alfombra", "alfombras",
      "espejo", "espejos", "espejo decorativo",
      "cuadro", "cuadros", "cuadro decorativo", "cuadros decorativos",
      "florero", "floreros",
      "jarron", "jarrones",
      "adorno", "adornos",
      "decoracion hogar",
      "portarretrato", "portarretratos",
      "reloj de pared",
      "tapete", "tapetes",
      "mantel", "manteles",
      "centro de mesa"
    ],
    category: "hogar",
    subcategory: "decoracion",
    weight: 4
  },
  { terms: ["organizador", "organizadores", "caja organizadora", "perchero", "zapatero", "canasta de ropa"], category: "hogar", subcategory: "organizacion", weight: 4 },
  { terms: ["matera", "materas", "maceta", "macetas", "sombrilla de terraza", "mesa de jardin", "silla de jardin"], category: "hogar", subcategory: "jardin-y-terraza", weight: 5 },
  { terms: ["ventilador", "licuadora", "microondas", "nevera", "refrigerador", "lavadora", "cafetera", "tostadora", "freidora de aire", "air fryer", "arrocera", "sanduchera", "plancha de ropa", "aspiradora"], category: "hogar", subcategory: "otros", weight: 4 },

  // Celulares
  { terms: ["iphone", "celular", "celulares", "smartphone", "telefono movil"], category: "celulares", subcategory: "celulares", weight: 5 },
  { terms: ["samsung galaxy", "xiaomi redmi", "motorola celular", "huawei celular", "oppo celular"], category: "celulares", subcategory: "celulares", weight: 5 },

  // Motor
  { terms: ["moto", "motos", "motocicleta", "motocicletas", "scooter moto"], category: "motor", subcategory: "motos", weight: 5 },
  { terms: ["carro", "carros", "camioneta", "camionetas", "automovil", "vehiculo"], category: "motor", subcategory: "carros", weight: 3 },
  { terms: ["repuestos de carro", "repuestos de moto", "rines", "llantas", "farola carro", "espejo retrovisor", "bateria de carro"], category: "motor", subcategory: "repuestos", weight: 5 },

  // Inmobiliaria
  { terms: ["apartamento", "apartamentos", "apartaestudio", "finca", "lote", "casa campestre", "local comercial", "bodega", "casa en venta", "casa en arriendo"], category: "inmobiliaria", weight: 5 },

  // Informática
  { terms: ["portatil", "portatiles", "laptop", "computador portatil"], category: "informatica", weight: 5 },
  { terms: ["computador", "computadores", "pc gamer", "torre de computador", "computador de mesa"], category: "informatica", weight: 4 },
  { terms: ["impresora", "impresoras"], category: "informatica", subcategory: "impresoras", weight: 5 },
  { terms: ["teclado", "mouse", "raton computador", "webcam", "audifonos gamer"], category: "informatica", subcategory: "perifericos", weight: 4 },
  { terms: ["memoria ram", "tarjeta grafica", "disco duro", "ssd", "procesador", "fuente de poder"], category: "informatica", subcategory: "componentes", weight: 5 },
  { terms: ["router", "modem", "repetidor wifi", "switch de red"], category: "informatica", subcategory: "redes", weight: 5 },

  // Imagen y sonido
  { terms: ["televisor", "televisores", "smart tv", "pantalla de tv"], category: "imagen-sonido", subcategory: "imagen", weight: 5 },
  { terms: ["parlante", "parlantes", "bafle", "bafles", "amplificador", "teatro en casa", "barra de sonido", "equipo de sonido"], category: "imagen-sonido", subcategory: "sonido", weight: 5 },
  { terms: ["camara fotografica", "camara profesional", "gopro", "dron"], category: "imagen-sonido", subcategory: "fotografia", weight: 5 },
  { terms: ["guitarra", "bateria musical", "piano", "violin", "ukelele"], category: "imagen-sonido", subcategory: "musica", weight: 5 },

  // Juegos gamer
  { terms: ["playstation", "play station", "xbox", "nintendo", "consola", "consolas", "nintendo switch"], category: "juegos", subcategory: "consolas", weight: 5 },
  { terms: ["videojuego", "videojuegos", "juego de playstation", "juego de xbox"], category: "juegos", subcategory: "videojuegos", weight: 5 },

  // Deportes
  { terms: ["bicicleta", "bicicletas", "cicla", "bici"], category: "deportes", subcategory: "bicicletas", weight: 5 },
  { terms: ["caminadora", "eliptica", "pesas", "mancuernas", "trotadora", "barra olimpica", "banco de pesas"], category: "deportes", subcategory: "fitness", weight: 5 },
  { terms: ["guayos", "balon de futbol", "raqueta", "patines", "casco bicicleta"], category: "deportes", subcategory: "equipos", weight: 5 },
  { terms: ["camiseta deportiva", "licra deportiva", "ropa deportiva"], category: "deportes", subcategory: "ropa-deportiva", weight: 5 },

  // Mascotas
  { terms: ["perro", "perros", "cachorro", "cachorros"], category: "mascotas", subcategory: "perros", weight: 5 },
  { terms: ["gato", "gatos", "gatico", "gaticos"], category: "mascotas", subcategory: "gatos", weight: 5 },
  { terms: ["jaula de ave", "canario", "periquito", "loro"], category: "mascotas", subcategory: "aves", weight: 5 },
  { terms: ["acuario", "pecera", "pez", "peces"], category: "mascotas", subcategory: "peces", weight: 5 },
  { terms: ["hamster", "conejo mascota"], category: "mascotas", subcategory: "roedores", weight: 5 },
  { terms: ["casa para perro", "guacal", "collar para perro", "correa para perro", "comida para perro", "comida para gato", "arenera", "rascador para gato"], category: "mascotas", subcategory: "accesorios", weight: 6 },

  // Bebés
  { terms: ["cuna", "cunas", "corral para bebe"], category: "bebes", subcategory: "cunas", weight: 5 },
  { terms: ["ropa de bebe", "body bebe", "mameluco bebe"], category: "bebes", subcategory: "ropa", weight: 5 },
  { terms: ["tetero", "teteros", "plato para bebe", "vaso entrenador"], category: "bebes", subcategory: "alimentacion", weight: 5 },
  { terms: ["extractor de leche", "cojin de lactancia"], category: "bebes", subcategory: "lactancia", weight: 5 },
  { terms: ["banera bebe", "toalla bebe"], category: "bebes", subcategory: "bano", weight: 5 },
  { terms: ["juguete bebe", "sonajero", "gimnasio para bebe"], category: "bebes", subcategory: "juguetes", weight: 5 },

  // Moda
  { terms: ["perfume", "perfumes", "locion", "lociones"], category: "moda", subcategory: "accesorios", weight: 4 },
  { terms: ["zapatos", "tenis", "botas", "sandalias", "zapatillas", "tacones"], category: "moda", subcategory: "calzado", weight: 4 },
  { terms: ["vestido", "vestidos", "blusa", "blusas", "falda", "faldas", "ropa mujer"], category: "moda", subcategory: "mujer", weight: 4 },
  { terms: ["camisa hombre", "pantalon hombre", "ropa hombre", "corbata"], category: "moda", subcategory: "hombre", weight: 4 },
  { terms: ["ropa nino", "ropa nina", "ropa infantil"], category: "moda", subcategory: "ninos", weight: 5 },
  { terms: ["camisa", "camisas", "pantalon", "pantalones", "chaqueta", "chaquetas", "ropa"], category: "moda", weight: 3 },
  { terms: ["reloj", "relojes", "joyas", "pulsera", "cadena de oro", "aretes", "collar", "bolso", "cartera", "maleta", "mochila", "gorra", "gafas de sol"], category: "moda", subcategory: "accesorios", weight: 4 },

  // Regalos y celebraciones
  { terms: ["globos", "globo metalizado"], category: "regalos-celebraciones", subcategory: "globos", weight: 5 },
  { terms: ["pinateria", "pinata"], category: "regalos-celebraciones", subcategory: "pinateria", weight: 5 },
  { terms: ["velas decorativas", "velon", "velones"], category: "regalos-celebraciones", subcategory: "velas-y-velones", weight: 5 },
  { terms: ["decoracion para fiesta", "guirnalda fiesta", "mantel fiesta"], category: "regalos-celebraciones", subcategory: "decoracion-para-fiestas", weight: 5 },
  { terms: ["desayuno sorpresa", "ancheta"], category: "regalos-celebraciones", subcategory: "desayunos-y-sorpresas", weight: 5 },
  { terms: ["flores", "ramo de flores", "arreglo floral"], category: "regalos-celebraciones", subcategory: "flores-y-detalles", weight: 5 },
];

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
  if (term.includes(" ")) return normalized.includes(term);
  if (tokens.has(term)) return true;
  for (const token of tokens) {
    if (token === `${term}s` || token === `${term}es`) return true;
    if (term === `${token}s` || term === `${token}es`) return true;
  }
  return false;
}

const MIN_SCORE = 3;
const MIN_MARGIN = 2;

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
