export const AID_CATEGORIES: Array<{ slug: string; label: string }> = [
  { slug: "alimentos-y-mercado", label: "Alimentos y mercado" },
  { slug: "ropa-y-calzado", label: "Ropa y calzado" },
  { slug: "muebles-y-hogar", label: "Muebles y hogar" },
  { slug: "electrodomesticos", label: "Electrodomésticos" },
  { slug: "bebes-y-ninos", label: "Bebés y niños" },
  { slug: "salud-y-movilidad", label: "Salud y movilidad" },
  { slug: "estudio-y-libros", label: "Estudio y libros" },
  { slug: "herramientas-de-trabajo", label: "Herramientas de trabajo" },
  { slug: "vivienda-y-alojamiento-temporal", label: "Vivienda y alojamiento temporal" },
  { slug: "mascotas", label: "Mascotas" },
  { slug: "otros", label: "Otros" },
];

export const AID_CATEGORY_SLUGS = AID_CATEGORIES.map((c) => c.slug);

export const AID_CITIES = [
  "Pereira",
  "Dosquebradas",
  "Santa Rosa de Cabal",
  "La Virginia",
  "Cartago",
  "Armenia",
  "Bogotá",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Cartagena",
  "Bucaramanga",
  "Manizales",
  "Madrid, Cundinamarca",
  "Otra",
];

// Patrones que indican solicitudes de dinero/transferencias, prohibidas en Kubo Ayuda.
// Se evalúan sobre texto normalizado (minúsculas, sin tildes).
const MONEY_PATTERNS: RegExp[] = [
  /\bdinero\b/,
  /\bplata\b/,
  /\befectivo\b/,
  /\btransferencias?\b/,
  /\bconsignaci(on|ones)\b/,
  /\bconsignar\b/,
  /\bnequi\b/,
  /\bdaviplata\b/,
  /\bbancolombia\b/,
  /\bdavivienda\b/,
  /\bcuenta bancaria\b/,
  /\bnumero de cuenta\b/,
  /\bgiros?\b/,
  /\bprestamos?\b/,
  /\bprestar\b/,
  /\brecargas?\b/,
  /\bpaypal\b/,
  /\bbitcoin\b/,
  /\bcripto\w*\b/,
  /\bdeudas?\b/,
  /\bpagar (el|la|mi|una?) (arriendo|renta|cuota|factura|recibo|deuda|matricula)\b/,
  /\bpagarme\b/,
  /\bdonaci(on|ones) en dinero\b/,
  /\bapoyo economico\b/,
  /\bayuda economica\b/,
  /\bmonetari[oa]s?\b/,
  /\bsuscripci(on|ones)\b/,
  /\bvaki\b/,
  /\bgofundme\b/,
  /\b\$ ?\d{3,}\b/,
];

export function normalizeAidText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Devuelve el primer patrón prohibido encontrado, o null si el texto es válido.
export function findMoneyRequest(text: string): string | null {
  const normalized = normalizeAidText(text);
  for (const pattern of MONEY_PATTERNS) {
    const match = normalized.match(pattern);
    if (match) return match[0];
  }
  return null;
}

export const AID_ACTIVE_STATUSES = ["PENDING", "APPROVED", "MATCHED"] as const;
export const AID_PUBLIC_STATUSES = ["APPROVED", "MATCHED"] as const;

export const AID_REJECTED_COOLDOWN_HOURS = 24;
