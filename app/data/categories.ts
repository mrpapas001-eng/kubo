export type ListingTemplate =
  | "VEHICLE"
  | "PROPERTY"
  | "PRODUCT"
  | "SERVICE_JOB";

export interface SubCategory {
  slug: string;
  label: string;
  template: ListingTemplate;
}

export interface Category {
  slug: string;
  label: string;
  subcategories: SubCategory[];
}

export const CATEGORIES: Category[] = [
  {
    slug: "motor",
    label: "Motor",
    subcategories: [
      { slug: "carros", label: "Carros", template: "VEHICLE" },
      { slug: "motos", label: "Motos", template: "VEHICLE" },
      { slug: "repuestos", label: "Repuestos", template: "PRODUCT" },
    ],
  },
  {
    slug: "inmobiliaria",
    label: "Inmobiliaria",
    subcategories: [
      { slug: "casa", label: "Casa", template: "PROPERTY" },
      { slug: "apartamento", label: "Apartamento", template: "PROPERTY" },
      { slug: "apartaestudio", label: "Apartaestudio", template: "PROPERTY" },
      { slug: "local-comercial", label: "Local comercial", template: "PROPERTY" },
      { slug: "finca", label: "Finca", template: "PROPERTY" },
      { slug: "lote", label: "Lote", template: "PROPERTY" },
      { slug: "casa-campestre", label: "Casa campestre", template: "PROPERTY" },
      { slug: "bodega", label: "Bodega", template: "PROPERTY" },
      { slug: "otros-inmuebles", label: "Otros inmuebles", template: "PROPERTY" },
    ],
  },
  {
    slug: "celulares",
    label: "Celulares",
    subcategories: [
      { slug: "celulares", label: "Celulares", template: "PRODUCT" },
      { slug: "repuestos", label: "Repuestos", template: "PRODUCT" },
      { slug: "telefono-fijo", label: "Teléfono fijo", template: "PRODUCT" },
    ],
  },
  {
    slug: "electrodomesticos",
    label: "Electrodomésticos",
    subcategories: [
      { slug: "neveras", label: "Neveras", template: "PRODUCT" },
      { slug: "lavadoras", label: "Lavadoras", template: "PRODUCT" },
      { slug: "secadoras", label: "Secadoras", template: "PRODUCT" },
      { slug: "cocinas", label: "Cocinas", template: "PRODUCT" },
      { slug: "hornos", label: "Hornos", template: "PRODUCT" },
      { slug: "microondas", label: "Microondas", template: "PRODUCT" },
      { slug: "aires-acondicionados", label: "Aires acondicionados", template: "PRODUCT" },
      {
        slug: "pequenos-electrodomesticos",
        label: "Pequeños electrodomésticos",
        template: "PRODUCT",
      },
      {
        slug: "industrial",
        label: "Industrial y restauración",
        template: "PRODUCT",
      },
      { slug: "otros", label: "Otros", template: "PRODUCT" },
    ],
  },
  {
    slug: "hogar",
    label: "Hogar",
    subcategories: [
      { slug: "muebles-de-hogar", label: "Muebles de hogar", template: "PRODUCT" },
      { slug: "decoracion", label: "Decoración", template: "PRODUCT" },
      { slug: "colchones", label: "Colchones", template: "PRODUCT" },
      { slug: "iluminacion", label: "Iluminación", template: "PRODUCT" },
      { slug: "menaje", label: "Menaje", template: "PRODUCT" },
      { slug: "organizacion", label: "Organización", template: "PRODUCT" },
      { slug: "jardin-y-terraza", label: "Jardín y terraza", template: "PRODUCT" },
      { slug: "otros", label: "Otros", template: "PRODUCT" },
    ],
  },
  {
    slug: "empleo",
    label: "Empleo",
    subcategories: [
      { slug: "ofrezco-empleo", label: "Ofrezco empleo", template: "SERVICE_JOB" },
      { slug: "busco-empleo", label: "Busco empleo", template: "SERVICE_JOB" },
    ],
  },
  {
    slug: "servicios",
    label: "Servicios",
    subcategories: [
      { slug: "hogar", label: "Para hogar", template: "SERVICE_JOB" },
      { slug: "personas", label: "Para personas", template: "SERVICE_JOB" },
      { slug: "empresas", label: "Para empresas", template: "SERVICE_JOB" },
      { slug: "electricos", label: "Servicios eléctricos", template: "SERVICE_JOB" },
      { slug: "motor", label: "Para motor", template: "SERVICE_JOB" },
      { slug: "bicicleta", label: "Para bicicleta", template: "SERVICE_JOB" },
      { slug: "otros", label: "Otros servicios", template: "SERVICE_JOB" },
    ],
  },
  {
    slug: "negocios",
    label: "Negocios",
    subcategories: [
      { slug: "venta-de-negocios", label: "Venta de negocios", template: "SERVICE_JOB" },
      { slug: "traspasos", label: "Traspasos", template: "SERVICE_JOB" },
      { slug: "franquicias", label: "Franquicias", template: "SERVICE_JOB" },
      { slug: "arriendo-de-negocio", label: "Arriendo de negocio", template: "SERVICE_JOB" },
      { slug: "financiacion", label: "Financiación", template: "SERVICE_JOB" },
    ],
  },
  {
    slug: "informatica",
    label: "Informática",
    subcategories: [
      { slug: "laptops", label: "Laptops", template: "PRODUCT" },
      { slug: "pc-escritorio", label: "PC de escritorio", template: "PRODUCT" },
      { slug: "componentes", label: "Componentes", template: "PRODUCT" },
      { slug: "accesorios", label: "Accesorios", template: "PRODUCT" },
      { slug: "impresoras", label: "Impresoras", template: "PRODUCT" },
      { slug: "redes", label: "Redes", template: "PRODUCT" },
      { slug: "otros", label: "Otros", template: "PRODUCT" },
    ],
  },
  {
    slug: "imagen-sonido",
    label: "Imagen y sonido",
    subcategories: [
      { slug: "televisores", label: "Televisores", template: "PRODUCT" },
      { slug: "audio", label: "Audio", template: "PRODUCT" },
      { slug: "camaras", label: "Cámaras", template: "PRODUCT" },
      { slug: "video", label: "Video", template: "PRODUCT" },
      { slug: "accesorios", label: "Accesorios", template: "PRODUCT" },
      { slug: "instrumentos", label: "Instrumentos", template: "PRODUCT" },
      { slug: "otros", label: "Otros", template: "PRODUCT" },
    ],
  },
  {
    slug: "juegos",
    label: "Juegos",
    subcategories: [
      { slug: "consolas", label: "Consolas", template: "PRODUCT" },
      { slug: "videojuegos", label: "Videojuegos", template: "PRODUCT" },
      { slug: "accesorios", label: "Accesorios", template: "PRODUCT" },
      { slug: "otros", label: "Otros", template: "PRODUCT" },
    ],
  },
];