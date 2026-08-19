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
      { slug: "energia-solar", label: "Energía solar", template: "SERVICE_JOB" },
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
      { slug: "perifericos", label: "Periféricos", template: "PRODUCT" },
      { slug: "redes", label: "Redes", template: "PRODUCT" },
      { slug: "impresoras", label: "Impresoras", template: "PRODUCT" },
      { slug: "otros", label: "Otros", template: "PRODUCT" },
    ],
  },
  {
    slug: "formacion",
    label: "Formación",
    subcategories: [
      { slug: "cursos", label: "Cursos", template: "SERVICE_JOB" },
      { slug: "idiomas", label: "Idiomas", template: "SERVICE_JOB" },
      { slug: "refuerzo-academico", label: "Refuerzo académico", template: "SERVICE_JOB" },
      { slug: "carreras-tecnicas", label: "Carreras técnicas", template: "SERVICE_JOB" },
      { slug: "otros", label: "Otros", template: "SERVICE_JOB" },
    ],
  },
  {
    slug: "deportes",
    label: "Deportes",
    subcategories: [
      { slug: "equipos", label: "Equipos", template: "PRODUCT" },
      { slug: "ropa-deportiva", label: "Ropa deportiva", template: "PRODUCT" },
      { slug: "bicicletas", label: "Bicicletas", template: "PRODUCT" },
      { slug: "fitness", label: "Fitness", template: "PRODUCT" },
      { slug: "otros", label: "Otros", template: "PRODUCT" },
    ],
  },
  {
    slug: "mascotas",
    label: "Mascotas",
    subcategories: [
      { slug: "perros", label: "Perros", template: "PRODUCT" },
      { slug: "gatos", label: "Gatos", template: "PRODUCT" },
      { slug: "aves", label: "Aves", template: "PRODUCT" },
      { slug: "peces", label: "Peces", template: "PRODUCT" },
      { slug: "roedores", label: "Roedores", template: "PRODUCT" },
      { slug: "accesorios", label: "Accesorios", template: "PRODUCT" },
      { slug: "otros", label: "Otros", template: "PRODUCT" },
    ],
  },
  {
    slug: "bebes",
    label: "Bebés",
    subcategories: [
      { slug: "coches", label: "Coches", template: "PRODUCT" },
      { slug: "cunas", label: "Cunas", template: "PRODUCT" },
      { slug: "ropa", label: "Ropa", template: "PRODUCT" },
      { slug: "juguetes", label: "Juguetes", template: "PRODUCT" },
      { slug: "alimentacion", label: "Alimentación", template: "PRODUCT" },
      { slug: "lactancia", label: "Lactancia", template: "PRODUCT" },
      { slug: "bano", label: "Baño", template: "PRODUCT" },
      { slug: "otros", label: "Otros", template: "PRODUCT" },
    ],
  },
  {
    slug: "moda",
    label: "Moda",
    subcategories: [
      { slug: "mujer", label: "Mujer", template: "PRODUCT" },
      { slug: "hombre", label: "Hombre", template: "PRODUCT" },
      { slug: "ninos", label: "Niños", template: "PRODUCT" },
      { slug: "calzado", label: "Calzado", template: "PRODUCT" },
      { slug: "accesorios", label: "Accesorios", template: "PRODUCT" },
      { slug: "deportiva", label: "Ropa deportiva", template: "PRODUCT" },
      { slug: "lujo", label: "Lujo", template: "PRODUCT" },
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
    slug: "regalos-celebraciones",
    label: "Regalos y celebraciones",
    subcategories: [
      { slug: "velas-y-velones", label: "Velas y velones", template: "PRODUCT" },
      { slug: "regalos", label: "Regalos", template: "PRODUCT" },
      { slug: "flores-y-detalles", label: "Flores y detalles", template: "PRODUCT" },
      { slug: "decoracion-para-fiestas", label: "Decoración para fiestas", template: "PRODUCT" },
      { slug: "pinateria", label: "Piñatería", template: "PRODUCT" },
      { slug: "desayunos-y-sorpresas", label: "Desayunos y sorpresas", template: "PRODUCT" },
      { slug: "globos", label: "Globos", template: "PRODUCT" },
      { slug: "invitaciones-y-papeleria", label: "Invitaciones y papelería", template: "PRODUCT" },
      { slug: "articulos-religiosos", label: "Artículos religiosos", template: "PRODUCT" },
      { slug: "otros", label: "Otros", template: "PRODUCT" },
    ],
  },
  {
    slug: "juguetes",
    label: "Juguetes",
    subcategories: [
      { slug: "peluches", label: "Peluches", template: "PRODUCT" },
      { slug: "munecas-y-figuras", label: "Muñecas y figuras", template: "PRODUCT" },
      { slug: "juegos-de-mesa", label: "Juegos de mesa", template: "PRODUCT" },
      { slug: "didacticos", label: "Didácticos", template: "PRODUCT" },
      { slug: "aire-libre", label: "Aire libre", template: "PRODUCT" },
      { slug: "otros", label: "Otros", template: "PRODUCT" },
    ],
  },
  {
    slug: "papeleria-oficina",
    label: "Papelería y Oficina",
    subcategories: [
      { slug: "utiles-escolares", label: "Útiles escolares", template: "PRODUCT" },
      { slug: "cuadernos-y-papel", label: "Cuadernos y papel", template: "PRODUCT" },
      { slug: "escritura-y-dibujo", label: "Escritura y dibujo", template: "PRODUCT" },
      { slug: "oficina-y-archivo", label: "Oficina y archivo", template: "PRODUCT" },
      { slug: "arte-y-manualidades", label: "Arte y manualidades", template: "PRODUCT" },
      { slug: "otros", label: "Otros", template: "PRODUCT" },
    ],
  },
  {
    slug: "herramientas-ferreteria",
    label: "Herramientas y Ferretería",
    subcategories: [
      { slug: "herramientas-electricas", label: "Herramientas eléctricas", template: "PRODUCT" },
      { slug: "herramientas-manuales", label: "Herramientas manuales", template: "PRODUCT" },
      { slug: "construccion", label: "Construcción", template: "PRODUCT" },
      { slug: "jardineria", label: "Jardinería", template: "PRODUCT" },
      { slug: "seguridad-industrial", label: "Seguridad industrial", template: "PRODUCT" },
      { slug: "otros", label: "Otros", template: "PRODUCT" },
    ],
  },
  {
    slug: "salud-belleza",
    label: "Salud y Belleza",
    subcategories: [
      { slug: "maquillaje", label: "Maquillaje", template: "PRODUCT" },
      { slug: "cuidado-de-la-piel", label: "Cuidado de la piel", template: "PRODUCT" },
      { slug: "cabello", label: "Cabello", template: "PRODUCT" },
      { slug: "aparatos-de-belleza", label: "Aparatos de belleza", template: "PRODUCT" },
      { slug: "salud-y-bienestar", label: "Salud y bienestar", template: "PRODUCT" },
      { slug: "otros", label: "Otros", template: "PRODUCT" },
    ],
  },
];