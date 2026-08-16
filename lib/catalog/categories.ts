// lib/catalog/categories.ts

export type CategoryKey =
  | "motor"
  | "inmobiliaria"
  | "celulares"
  | "empleo"
  | "servicios"
  | "negocios"
  | "informatica"
  | "imagen_sonido"
  | "juegos"
  | "formacion_libros"
  | "deportes"
  | "mascotas"
  | "bebes"
  | "moda"
  | "regalos_celebraciones";

export type Category = {
  key: CategoryKey;
  label: string;
  subcategories: { key: string; label: string }[];
};

export const CATEGORIES: Category[] = [
  {
    key: "motor",
    label: "Motor",
    subcategories: [
      { key: "carros", label: "Carros" },
      { key: "motos", label: "Motos" },
      { key: "repuestos", label: "Repuestos" },
    ],
  },
  {
    key: "inmobiliaria",
    label: "Inmobiliaria",
    subcategories: [
      { key: "casa", label: "Casa" },
      { key: "apartamento", label: "Apartamento" },
      { key: "apartaestudio", label: "Apartaestudio" },
      { key: "local_comercial", label: "Local comercial" },
      { key: "finca", label: "Finca" },
      { key: "lote", label: "Lote" },
      { key: "casa_campestre", label: "Casa campestre" },
      { key: "bodegas", label: "Bodegas" },
      { key: "otros_inmuebles", label: "Otros inmuebles" },
    ],
  },
  {
    key: "celulares",
    label: "Celulares",
    subcategories: [
      { key: "celulares", label: "Celulares" },
      { key: "repuestos", label: "Repuestos" },
      { key: "telefono_fijo", label: "Teléfono fijo" },
    ],
  },
  {
    key: "empleo",
    label: "Empleo",
    subcategories: [
      { key: "ofrezco", label: "Estoy ofreciendo" },
      { key: "busco", label: "Estoy buscando" },
    ],
  },
  {
    key: "servicios",
    label: "Servicios",
    subcategories: [
      { key: "hogar", label: "Hogar" },
      { key: "personas", label: "Personas" },
      { key: "empresas", label: "Empresas" },
      { key: "electricos", label: "Eléctricos" },
      { key: "motor", label: "Motor" },
      { key: "bicicleta", label: "Bicicleta" },
    ],
  },
  {
    key: "negocios",
    label: "Negocios",
    subcategories: [
      { key: "venta", label: "Venta de negocios" },
      { key: "traspasos", label: "Traspasos" },
      { key: "franquicias", label: "Franquicias" },
      { key: "arriendo", label: "Arriendo de negocio" },
      { key: "financiacion", label: "Financiación" },
    ],
  },
  {
    key: "informatica",
    label: "Informática",
    subcategories: [
      { key: "portatiles", label: "Portátiles" },
      { key: "todo_en_uno", label: "Todo en uno" },
      { key: "escritorio", label: "Escritorio" },
      { key: "tablets", label: "Tablets" },
      { key: "mac", label: "Mac" },
      { key: "accesorios", label: "Accesorios" },
      { key: "software", label: "Software" },
      { key: "gaming", label: "Gaming" },
    ],
  },
  {
    key: "imagen_sonido",
    label: "Imagen y sonido",
    subcategories: [
      { key: "fotografia", label: "Fotografía" },
      { key: "imagen", label: "Imagen" },
      { key: "sonido", label: "Sonido" },
      { key: "musica", label: "Música" },
    ],
  },
  {
    key: "juegos",
    label: "Juegos",
    subcategories: [
      { key: "consolas", label: "Consolas" },
      { key: "videojuegos", label: "Videojuegos" },
      { key: "accesorios", label: "Accesorios" },
    ],
  },
  {
    key: "formacion_libros",
    label: "Formación y libros",
    subcategories: [
      { key: "clases_particulares", label: "Clases particulares" },
      { key: "libros", label: "Libros" },
      { key: "idiomas", label: "Idiomas" },
      { key: "cursos", label: "Cursos" },
      { key: "autoescuelas", label: "Autoescuelas" },
    ],
  },
  {
    key: "deportes",
    label: "Deportes",
    subcategories: [
      { key: "bicicletas", label: "Bicicletas" },
      { key: "futbol", label: "Fútbol" },
      { key: "otros", label: "Otros deportes" },
    ],
  },
  {
    key: "mascotas",
    label: "Mascotas",
    subcategories: [
      { key: "perros", label: "Perros" },
      { key: "gatos", label: "Gatos" },
      { key: "caballos", label: "Caballos" },
      { key: "adopciones", label: "Adopciones" },
      { key: "peces", label: "Peces" },
      { key: "varios", label: "Varios" },
    ],
  },
  {
    key: "bebes",
    label: "Bebés",
    subcategories: [
      { key: "habitacion", label: "Habitación" },
      { key: "camara_vigilancia", label: "Cámara de vigilancia" },
      { key: "coches", label: "Coches" },
      { key: "juguetes", label: "Juguetes" },
      { key: "higiene_cuidado", label: "Higiene y cuidado" },
      { key: "varios", label: "Varios" },
    ],
  },
  {
    key: "moda",
    label: "Moda y complementos",
    subcategories: [
      { key: "hombre", label: "Moda hombre" },
      { key: "mujer", label: "Moda mujer" },
      { key: "perfumes", label: "Perfumes" },
      { key: "calzado", label: "Calzado" },
      { key: "disfraces", label: "Disfraces" },
      { key: "joyas_bisuteria", label: "Joyas / bisutería" },
      { key: "sex_shop", label: "Sex shop" },
      { key: "otros", label: "Otros" },
    ],
  },
  {
    key: "regalos_celebraciones",
    label: "Regalos y celebraciones",
    subcategories: [
      { key: "velas_y_velones", label: "Velas y velones" },
      { key: "regalos", label: "Regalos" },
      { key: "flores_y_detalles", label: "Flores y detalles" },
      { key: "decoracion_para_fiestas", label: "Decoración para fiestas" },
      { key: "pinateria", label: "Piñatería" },
      { key: "desayunos_y_sorpresas", label: "Desayunos y sorpresas" },
      { key: "globos", label: "Globos" },
      { key: "invitaciones_y_papeleria", label: "Invitaciones y papelería" },
      { key: "articulos_religiosos", label: "Artículos religiosos" },
      { key: "otros", label: "Otros" },
    ],
  },
];

export function getCategory(key: CategoryKey) {
  return CATEGORIES.find((c) => c.key === key) ?? null;
}