import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import MotorFilters from "@/components/MotorFilters";
import { getListings } from "@/lib/queries/home";
import { CATEGORIES } from "@/data/categories";
import BackButton from "@/components/BackButton";

type PageProps = {
  params: Promise<{
    slug: string;
    subslug: string;
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};


function getSubcategoryHeroImage(slug: string, subslug: string) {
  if (slug === "motor" && subslug === "carros") return "/hilux.jpg";
  if (slug === "motor" && subslug === "motos") return "/motos-hero.jpg";
  if (slug === "motor" && subslug === "repuestos") return "/repuestos-hero.jpg";

  if (slug === "inmobiliaria") {
    if (subslug === "casa") return "/inmo-casa.jpg";
    if (subslug === "apartamento") return "/inmo-apartamento.jpg";
    if (subslug === "apartaestudio") return "/inmo-apartaestudio.jpg";
    if (subslug === "local-comercial") return "/inmo-local.jpg";
    if (subslug === "finca") return "/inmo-finca.jpg";
    if (subslug === "lote") return "/inmo-lote.jpg";
    return "/inmobiliaria-hero.jpg";
  }

  if (slug === "celulares") {
    if (subslug === "celulares") return "/celulares-hero.jpg";
    if (subslug === "repuestos") return "/celulares-repuestos-hero.jpg";
    if (subslug === "telefono-fijo") return "/celulares-fijo-hero.jpg";
    return "/celulares-hero.jpg";
  }

  if (slug === "electrodomesticos") {
    if (subslug === "neveras") return "/electrodomesticos-neveras.jpg";
    if (subslug === "lavadoras") return "/electrodomesticos-lavadoras.jpg";
    if (subslug === "secadoras") return "/electrodomesticos-secadoras.jpg";
    if (subslug === "cocinas") return "/electrodomesticos-cocinas.jpg";
    if (subslug === "hornos") return "/electrodomesticos-hornos.jpg";
    if (subslug === "microondas") return "/electrodomesticos-microondas.jpg";
    if (subslug === "aires-acondicionados") return "/electrodomesticos-aires.jpg";
    if (subslug === "pequenos-electrodomesticos") return "/electrodomesticos-pequenos.jpg";
    if (subslug === "industrial") return "/electrodomesticos-industrial.jpg";
    if (subslug === "otros") return "/electrodomesticos-hero.jpg";
    return "/electrodomesticos-hero.jpg";
  }

if (slug === "hogar") {
  if (subslug === "muebles-de-hogar") return "/hogar-muebles.jpg";
  if (subslug === "decoracion") return "/hogar-decoracion.jpg";
  if (subslug === "colchones") return "/hogar-colchones.jpg";
  if (subslug === "iluminacion") return "/hogar-iluminacion.jpg";
  if (subslug === "menaje") return "/hogar-menaje.jpg";
  if (subslug === "organizacion") return "/hogar-organizacion.jpg";
  if (subslug === "jardin-y-terraza") return "/hogar-jardin.jpg";
  if (subslug === "otros") return "/hogar-hero.jpg";
  return "/hogar-hero.jpg";
}

  if (slug === "empleo") {
    if (subslug === "busco-empleo") return "/empleo-busco.jpg";
    if (subslug === "ofrezco-empleo") return "/empleo-ofrezco.jpg";
    return "/empleo-hero.jpg";
  }

  if (slug === "servicios") {
    if (subslug === "hogar") return "/servicios-hogar.jpg";
    if (subslug === "personas") return "/servicios-personas.jpg";
    if (subslug === "empresas") return "/servicios-empresas.jpg";
    if (subslug === "electricos") return "/servicios-electricos.jpg";
    if (subslug === "motor") return "/servicios-motor.jpg";
    if (subslug === "bicicleta") return "/servicios-bicicleta.jpg";
    if (subslug === "otros") return "/servicios-otros.jpg";
    return "/servicios-hero.jpg";
  }

  if (slug === "negocios") {
    if (subslug === "venta-de-negocios") return "/negocios-venta.jpg";
    if (subslug === "traspasos") return "/negocios-traspasos.jpg";
    if (subslug === "franquicias") return "/negocios-franquicias.jpg";
    if (subslug === "arriendo-de-negocio") return "/negocios-arriendo.jpg";
    if (subslug === "financiacion") return "/negocios-financiacion.jpg";
    return "/negocios-hero.jpg";
  }

  if (slug === "informatica") {
    if (subslug === "laptops") return "/informatica-laptops.jpg";
    if (subslug === "pc-escritorio") return "/informatica-pc.jpg";
    if (subslug === "componentes") return "/informatica-componentes.jpg";
    if (subslug === "perifericos") return "/informatica-perifericos.jpg";
    if (subslug === "accesorios") return "/informatica-accesorios.jpg";
    if (subslug === "impresoras") return "/informatica-impresoras.jpg";
    if (subslug === "redes") return "/informatica-redes.jpg";
    if (subslug === "otros") return "/informatica-otros.jpg";
    return "/informatica-hero.jpg";
  }

  if (slug === "imagen-sonido") {
    if (subslug === "televisores") return "/imagen-sonido-televisores.jpg";
    if (subslug === "audio") return "/imagen-sonido-audio.jpg";
    if (subslug === "camaras") return "/imagen-sonido-camaras.jpg";
    if (subslug === "video") return "/imagen-sonido-video.jpg";
    if (subslug === "accesorios") return "/imagen-sonido-accesorios.jpg";
    if (subslug === "instrumentos") return "/imagen-sonido-instrumentos.jpg";
    if (subslug === "otros") return "/imagen-sonido-otros.jpg";
    return "/imagen-sonido-hero.jpg";
  }

  if (slug === "juegos") {
    if (subslug === "consolas") return "/juegos-consolas.jpg";
    if (subslug === "videojuegos") return "/juegos-videojuegos.jpg";
    if (subslug === "accesorios") return "/juegos-accesorios.jpg";
    if (subslug === "otros") return "/juegos-otros.jpg";
    return "/juegos-hero.jpg";
  }

  if (slug === "formacion") {
    if (subslug === "cursos") return "/formacion-cursos.jpg";
    if (subslug === "idiomas") return "/formacion-idiomas.jpg";
    if (subslug === "refuerzo-academico") return "/formacion-refuerzo.jpg";
    if (subslug === "carreras-tecnicas") return "/formacion-tecnicas.jpg";
    if (subslug === "otros") return "/formacion-otros.jpg";
    return "/formacion-hero.jpg";
  }

  if (slug === "deportes") {
    if (subslug === "equipos") return "/deportes-equipos.jpg";
    if (subslug === "ropa-deportiva") return "/deportes-ropa.jpg";
    if (subslug === "bicicletas") return "/deportes-bicicletas.jpg";
    if (subslug === "fitness") return "/deportes-fitness.jpg";
    if (subslug === "otros") return "/deportes-otros.jpg";
    return "/deportes-hero.jpg";
  }

  if (slug === "mascotas") {
    if (subslug === "perros") return "/mascotas-perros.jpg";
    if (subslug === "gatos") return "/mascotas-gatos.jpg";
    if (subslug === "aves") return "/mascotas-aves.jpg";
    if (subslug === "peces") return "/mascotas-peces.jpg";
    if (subslug === "roedores") return "/mascotas-roedores.jpg";
    if (subslug === "accesorios") return "/mascotas-accesorios.jpg";
    if (subslug === "otros") return "/mascotas-otros.jpg";
    return "/mascotas-hero.jpg";
  }

  if (slug === "bebes") {
    if (subslug === "coches") return "/bebes-coches.jpg";
    if (subslug === "cunas") return "/bebes-cunas.jpg";
    if (subslug === "ropa") return "/bebes-ropa.jpg";
    if (subslug === "juguetes") return "/bebes-juguetes.jpg";
    if (subslug === "alimentacion") return "/bebes-alimentacion.jpg";
    if (subslug === "lactancia") return "/bebes-lactancia.jpg";
    if (subslug === "bano") return "/bebes-bano.jpg";
    if (subslug === "otros") return "/bebes-otros.jpg";
    return "/bebes-hero.jpg";
  }

  if (slug === "moda") {
    if (subslug === "mujer") return "/moda-mujer.jpg";
    if (subslug === "hombre") return "/moda-hombre.jpg";
    if (subslug === "ninos") return "/moda-ninos.jpg";
    if (subslug === "calzado") return "/moda-calzado.jpg";
    if (subslug === "accesorios") return "/moda-accesorios.jpg";
    if (subslug === "deportiva") return "/moda-deportiva.jpg";
    if (subslug === "lujo") return "/moda-lujo.jpg";
    if (subslug === "otros") return "/moda-otros.jpg";
    return "/moda-hero.jpg";
  }

  return null;
}

function getSubcategoryDescription(categoryLabel: string, subcategoryLabel: string) {
  const sub = subcategoryLabel.toLowerCase();
  const cat = categoryLabel.toLowerCase();

  if (sub === "carros") {
    return "Descubre carros publicados cerca de ti, compara opciones reales y encuentra oportunidades con una experiencia más visual y potente.";
  }

  if (sub === "motos") {
    return "Explora motos destacadas, compara estilos y encuentra la opción ideal para ciudad, trabajo o carretera.";
  }

  if (sub === "repuestos" && cat === "motor") {
    return "Encuentra repuestos, piezas y accesorios para mantener tu vehículo en marcha con publicaciones reales cerca de ti.";
  }

  if (cat === "inmobiliaria") {
    return `Explora ${sub} disponibles en tu ciudad. Compara precios, características y encuentra opciones reales para comprar o arrendar.`;
  }

  if (cat === "celulares" && sub === "celulares") {
    return "Explora celulares nuevos y usados, compara marcas, modelos y precios para encontrar la mejor opción cerca de ti.";
  }

  if (cat === "celulares" && sub === "repuestos") {
    return "Encuentra repuestos, pantallas, baterías, cargadores y piezas para reparar o mejorar tu equipo.";
  }

  if (cat === "celulares" && sub === "teléfono fijo") {
    return "Descubre teléfonos fijos y equipos para hogar u oficina con publicaciones reales y precios competitivos.";
  }

  if (cat === "empleo" && sub === "busco empleo") {
    return "Explora perfiles de personas que están buscando trabajo y conecta con talento real en tu ciudad.";
  }

  if (cat === "empleo" && sub === "ofrezco empleo") {
    return "Encuentra vacantes activas y oportunidades laborales publicadas por negocios y empresas de la comunidad.";
  }

  if (cat === "servicios" && sub === "para hogar") {
    return "Encuentra servicios para limpieza, reparaciones, mantenimiento y necesidades del hogar con publicaciones reales cerca de ti.";
  }

  if (cat === "servicios" && sub === "para personas") {
    return "Explora servicios personales como belleza, bienestar, acompañamiento, clases y apoyo especializado.";
  }

  if (cat === "servicios" && sub === "para empresas") {
    return "Descubre servicios profesionales para negocios, oficinas, comercios y operación empresarial.";
  }

  if (cat === "servicios" && sub === "servicios eléctricos") {
    return "Encuentra electricistas, instalaciones, mantenimiento y soluciones eléctricas publicadas por profesionales y negocios.";
  }

  if (cat === "servicios" && sub === "para motor") {
    return "Explora servicios para carros y motos como mecánica, lavado, latonería, pintura y mantenimiento.";
  }

  if (cat === "servicios" && sub === "para bicicleta") {
    return "Descubre servicios para bicicletas como reparación, mantenimiento, ajuste y personalización.";
  }

  if (cat === "servicios" && sub === "otros servicios") {
    return "Encuentra otros servicios publicados por la comunidad para resolver necesidades específicas de forma rápida y cercana.";
  }

  if (cat === "negocios" && sub === "venta de negocios") {
    return "Explora negocios en venta publicados por la comunidad y descubre oportunidades reales para invertir o emprender.";
  }

  if (cat === "negocios" && sub === "traspasos") {
    return "Encuentra oportunidades de traspaso de negocios, locales y operaciones activas cerca de ti.";
  }

  if (cat === "negocios" && sub === "franquicias") {
    return "Descubre franquicias disponibles para invertir, operar o expandir tu presencia comercial.";
  }

  if (cat === "negocios" && sub === "arriendo de negocio") {
    return "Explora oportunidades de arriendo de negocio y espacios comerciales con enfoque práctico y visual.";
  }

  if (cat === "negocios" && sub === "financiación") {
    return "Encuentra opciones de financiación y apoyo económico para negocios, inversión y crecimiento.";
  }

  if (cat === "informática" || cat === "informatica") {
    return `Explora ${sub} disponibles en tu ciudad. Encuentra equipos, accesorios y tecnología con publicaciones reales cerca de ti.`;
  }

  if (cat === "imagen y sonido") {
    return `Explora ${sub} disponibles en tu ciudad. Encuentra equipos de entretenimiento, audio, video y fotografía con publicaciones reales cerca de ti.`;
  }

  if (cat === "juegos" && sub === "consolas") {
    return "Explora consolas PlayStation, Xbox, Nintendo y más con publicaciones reales cerca de ti.";
  }

  if (cat === "juegos" && sub === "videojuegos") {
    return "Encuentra videojuegos por plataforma y marca, con publicaciones reales para consola y PC cerca de ti.";
  }

  if (cat === "juegos" && sub === "accesorios") {
    return "Descubre controles, audífonos, cargadores, bases y accesorios gamer publicados por la comunidad.";
  }

  if (cat === "juegos" && sub === "otros") {
    return "Explora otros productos gamer y oportunidades publicadas cerca de ti con una experiencia rápida y visual.";
  }

  if (cat === "mascotas" && sub === "perros") {
    return "Encuentra perros de distintas razas, edades y tamaños con publicaciones reales cerca de ti.";
  }

  if (cat === "mascotas" && sub === "gatos") {
    return "Explora gatos de distintas razas y edades con publicaciones reales para adopción o venta cerca de ti.";
  }

  if (cat === "mascotas" && sub === "aves") {
    return "Descubre aves y pajaritos con publicaciones reales cerca de ti, desde ornamentales hasta de compañía.";
  }

  if (cat === "mascotas" && sub === "peces") {
    return "Encuentra peces, acuarios y especies ornamentales con publicaciones reales cerca de ti.";
  }

  if (cat === "mascotas" && sub === "roedores") {
    return "Explora hámsters, conejos, cobayas y otros roedores con publicaciones reales cerca de ti.";
  }

  if (cat === "mascotas" && sub === "accesorios") {
    return "Descubre collares, camas, jaulas, juguetes, alimento y accesorios para mascotas publicados por la comunidad.";
  }

  if (cat === "mascotas" && sub === "otros") {
    return "Encuentra otras mascotas y productos relacionados con publicaciones reales cerca de ti.";
  }

  if (cat === "bebés" || cat === "bebes") {
    if (sub === "coches") {
      return "Encuentra coches para bebé publicados por la comunidad, ideales para paseos, viajes y uso diario.";
    }

    if (sub === "cunas") {
      return "Explora cunas, corrales y opciones de descanso para bebé con publicaciones reales cerca de ti.";
    }

    if (sub === "ropa") {
      return "Descubre ropa para bebé, conjuntos, pijamas y prendas esenciales con publicaciones reales cerca de ti.";
    }

    if (sub === "juguetes") {
      return "Encuentra juguetes, gimnasios, sonajeros y artículos de estimulación para bebé publicados por la comunidad.";
    }

    if (sub === "alimentación" || sub === "alimentacion") {
      return "Explora sillas, vajillas, biberones y productos de alimentación para bebé con publicaciones reales cerca de ti.";
    }

    if (sub === "lactancia") {
      return "Descubre extractores, cojines, protectores y accesorios de lactancia publicados por la comunidad.";
    }

    if (sub === "baño" || sub === "bano") {
      return "Encuentra tinas, toallas, cambiadores y productos para el baño del bebé con publicaciones reales.";
    }

    if (sub === "otros") {
      return "Explora otros productos para bebé publicados por la comunidad con una experiencia visual y clara.";
    }
  }

  if (cat === "moda") {
    if (sub === "mujer") {
      return "Explora vestidos, blusas, jeans, conjuntos y prendas para mujer con publicaciones reales cerca de ti.";
    }

    if (sub === "hombre") {
      return "Encuentra camisas, camisetas, jeans, chaquetas y prendas para hombre publicadas por la comunidad.";
    }

    if (sub === "niños" || sub === "ninos") {
      return "Descubre ropa, conjuntos y prendas infantiles con publicaciones reales y opciones cerca de ti.";
    }

    if (sub === "calzado") {
      return "Explora tenis, botas, tacones, sandalias y calzado publicado por la comunidad cerca de ti.";
    }

    if (sub === "accesorios") {
      return "Encuentra bolsos, relojes, gafas, gorras, joyería y accesorios de moda con publicaciones reales.";
    }

    if (sub === "ropa deportiva") {
      return "Descubre prendas deportivas, conjuntos de gimnasio, leggings, sudaderas y ropa activa cerca de ti.";
    }

    if (sub === "lujo") {
      return "Explora piezas premium, marcas reconocidas y artículos de lujo publicados por la comunidad.";
    }

    if (sub === "otros") {
      return "Encuentra otras prendas y productos de moda publicados por la comunidad con una experiencia visual y clara.";
    }
  }

  return `Explora anuncios de ${sub} dentro de ${cat} con una experiencia visual más clara y rápida.`;
}

function getParam(
  params: Record<string, string | string[] | undefined>,
  key: string
) {
  const value = params[key];
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function parseDetails(details: unknown) {
  try {
    if (!details) return {};
    if (typeof details === "string") return JSON.parse(details);
    if (typeof details === "object") return details;
    return {};
  } catch {
    return {};
  }
}

function getMotorData(item: any) {
  const details = parseDetails(item?.details);
  return details?.motor ?? {};
}

function getRealEstateData(item: any) {
  const details = parseDetails(item?.details);
  return details?.realEstate ?? {};
}

function getCellphoneData(item: any) {
  const details = parseDetails(item?.details);
  return details?.cellphone ?? {};
}

function getJobData(item: any) {
  const details = parseDetails(item?.details);
  return details?.job ?? {};
}

function getServiceData(item: any) {
  const details = parseDetails(item?.details);
  return details?.service ?? {};
}

function getBusinessData(item: any) {
  const details = parseDetails(item?.details);
  return details?.business ?? {};
}

function getProductData(item: any) {
  const details = parseDetails(item?.details);
  return details?.product ?? {};
}

function getPetData(item: any) {
  const details = parseDetails(item?.details);
  return details?.pet ?? {};
}

function normalizeText(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function normalizeSlug(value: unknown) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function toNumber(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function uniq(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "es")
  );
}

function getCategoryLabel(category: any) {
  return category?.label ?? category?.name ?? "";
}

function getSubcategoryLabel(subcategory: any) {
  return subcategory?.label ?? subcategory?.name ?? "";
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { slug, subslug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};

const category =
  CATEGORIES.find((c: any) => c.slug === slug) ||
  (slug === "imagen-sonido"
    ? {
        slug: "imagen-sonido",
        label: "Imagen y sonido",
        subcategories: [
          { slug: "televisores", label: "Televisores", template: "PRODUCT" as const },
          { slug: "audio", label: "Audio", template: "PRODUCT" as const },
          { slug: "camaras", label: "Cámaras", template: "PRODUCT" as const },
          { slug: "video", label: "Video", template: "PRODUCT" as const },
          { slug: "accesorios", label: "Accesorios", template: "PRODUCT" as const },
          { slug: "instrumentos", label: "Instrumentos", template: "PRODUCT" as const },
          { slug: "otros", label: "Otros", template: "PRODUCT" as const },
        ],
      }
    : slug === "juegos"
    ? {
        slug: "juegos",
        label: "Juegos",
        subcategories: [
          { slug: "consolas", label: "Consolas", template: "PRODUCT" as const },
          { slug: "videojuegos", label: "Videojuegos", template: "PRODUCT" as const },
          { slug: "accesorios", label: "Accesorios", template: "PRODUCT" as const },
          { slug: "otros", label: "Otros", template: "PRODUCT" as const },
        ],
      }
    : slug === "mascotas"
    ? {
        slug: "mascotas",
        label: "Mascotas",
        subcategories: [
          { slug: "perros", label: "Perros", template: "PRODUCT" as const },
          { slug: "gatos", label: "Gatos", template: "PRODUCT" as const },
          { slug: "aves", label: "Aves", template: "PRODUCT" as const },
          { slug: "peces", label: "Peces", template: "PRODUCT" as const },
          { slug: "roedores", label: "Roedores", template: "PRODUCT" as const },
          { slug: "accesorios", label: "Accesorios", template: "PRODUCT" as const },
          { slug: "otros", label: "Otros", template: "PRODUCT" as const },
        ],
      }
    : slug === "bebes"
    ? {
        slug: "bebes",
        label: "Bebés",
        subcategories: [
          { slug: "coches", label: "Coches", template: "PRODUCT" as const },
          { slug: "cunas", label: "Cunas", template: "PRODUCT" as const },
          { slug: "ropa", label: "Ropa", template: "PRODUCT" as const },
          { slug: "juguetes", label: "Juguetes", template: "PRODUCT" as const },
          { slug: "alimentacion", label: "Alimentación", template: "PRODUCT" as const },
          { slug: "lactancia", label: "Lactancia", template: "PRODUCT" as const },
          { slug: "bano", label: "Baño", template: "PRODUCT" as const },
          { slug: "otros", label: "Otros", template: "PRODUCT" as const },
        ],
      }
    : slug === "moda"
    ? {
        slug: "moda",
        label: "Moda",
        subcategories: [
          { slug: "mujer", label: "Mujer", template: "PRODUCT" as const },
          { slug: "hombre", label: "Hombre", template: "PRODUCT" as const },
          { slug: "ninos", label: "Niños", template: "PRODUCT" as const },
          { slug: "calzado", label: "Calzado", template: "PRODUCT" as const },
          { slug: "accesorios", label: "Accesorios", template: "PRODUCT" as const },
          { slug: "deportiva", label: "Ropa deportiva", template: "PRODUCT" as const },
          { slug: "lujo", label: "Lujo", template: "PRODUCT" as const },
          { slug: "otros", label: "Otros", template: "PRODUCT" as const },
        ],
      }
    : slug === "electrodomesticos"
    ? {
        slug: "electrodomesticos",
        label: "Electrodomésticos",
        subcategories: [
          { slug: "neveras", label: "Neveras", template: "PRODUCT" as const },
          { slug: "lavadoras", label: "Lavadoras", template: "PRODUCT" as const },
          { slug: "secadoras", label: "Secadoras", template: "PRODUCT" as const },
          { slug: "cocinas", label: "Cocinas", template: "PRODUCT" as const },
          { slug: "hornos", label: "Hornos", template: "PRODUCT" as const },
          { slug: "microondas", label: "Microondas", template: "PRODUCT" as const },
          { slug: "aires-acondicionados", label: "Aires acondicionados", template: "PRODUCT" as const },
          {
            slug: "pequenos-electrodomesticos",
            label: "Pequeños electrodomésticos",
            template: "PRODUCT" as const,
          },
          {
            slug: "industrial",
            label: "Industrial y restauración",
            template: "PRODUCT" as const,
          },
          { slug: "otros", label: "Otros", template: "PRODUCT" as const },
        ],
      }
    : slug === "hogar"
    ? {
        slug: "hogar",
        label: "Hogar",
        subcategories: [
          { slug: "muebles-de-hogar", label: "Muebles de hogar", template: "PRODUCT" as const },
          { slug: "decoracion", label: "Decoración", template: "PRODUCT" as const },
          { slug: "colchones", label: "Colchones", template: "PRODUCT" as const },
          { slug: "iluminacion", label: "Iluminación", template: "PRODUCT" as const },
          { slug: "menaje", label: "Menaje", template: "PRODUCT" as const },
          { slug: "organizacion", label: "Organización", template: "PRODUCT" as const },
          { slug: "jardin-y-terraza", label: "Jardín y terraza", template: "PRODUCT" as const },
          { slug: "otros", label: "Otros", template: "PRODUCT" as const },
        ],
      }
    : null);

const subcategory =
  category?.subcategories.find((s: any) => s.slug === subslug) ||
  (slug === "imagen-sonido"
    ? [
        { slug: "televisores", label: "Televisores", template: "PRODUCT" as const },
        { slug: "audio", label: "Audio", template: "PRODUCT" as const },
        { slug: "camaras", label: "Cámaras", template: "PRODUCT" as const },
        { slug: "video", label: "Video", template: "PRODUCT" as const },
        { slug: "accesorios", label: "Accesorios", template: "PRODUCT" as const },
        { slug: "instrumentos", label: "Instrumentos", template: "PRODUCT" as const },
        { slug: "otros", label: "Otros", template: "PRODUCT" as const },
      ].find((s: any) => s.slug === subslug)
    : slug === "juegos"
    ? [
        { slug: "consolas", label: "Consolas", template: "PRODUCT" as const },
        { slug: "videojuegos", label: "Videojuegos", template: "PRODUCT" as const },
        { slug: "accesorios", label: "Accesorios", template: "PRODUCT" as const },
        { slug: "otros", label: "Otros", template: "PRODUCT" as const },
      ].find((s: any) => s.slug === subslug)
    : slug === "mascotas"
    ? [
        { slug: "perros", label: "Perros", template: "PRODUCT" as const },
        { slug: "gatos", label: "Gatos", template: "PRODUCT" as const },
        { slug: "aves", label: "Aves", template: "PRODUCT" as const },
        { slug: "peces", label: "Peces", template: "PRODUCT" as const },
        { slug: "roedores", label: "Roedores", template: "PRODUCT" as const },
        { slug: "accesorios", label: "Accesorios", template: "PRODUCT" as const },
        { slug: "otros", label: "Otros", template: "PRODUCT" as const },
      ].find((s: any) => s.slug === subslug)
    : slug === "bebes"
    ? [
        { slug: "coches", label: "Coches", template: "PRODUCT" as const },
        { slug: "cunas", label: "Cunas", template: "PRODUCT" as const },
        { slug: "ropa", label: "Ropa", template: "PRODUCT" as const },
        { slug: "juguetes", label: "Juguetes", template: "PRODUCT" as const },
        { slug: "alimentacion", label: "Alimentación", template: "PRODUCT" as const },
        { slug: "lactancia", label: "Lactancia", template: "PRODUCT" as const },
        { slug: "bano", label: "Baño", template: "PRODUCT" as const },
        { slug: "otros", label: "Otros", template: "PRODUCT" as const },
      ].find((s: any) => s.slug === subslug)
    : slug === "moda"
    ? [
        { slug: "mujer", label: "Mujer", template: "PRODUCT" as const },
        { slug: "hombre", label: "Hombre", template: "PRODUCT" as const },
        { slug: "ninos", label: "Niños", template: "PRODUCT" as const },
        { slug: "calzado", label: "Calzado", template: "PRODUCT" as const },
        { slug: "accesorios", label: "Accesorios", template: "PRODUCT" as const },
        { slug: "deportiva", label: "Ropa deportiva", template: "PRODUCT" as const },
        { slug: "lujo", label: "Lujo", template: "PRODUCT" as const },
        { slug: "otros", label: "Otros", template: "PRODUCT" as const },
      ].find((s: any) => s.slug === subslug)
    : slug === "electrodomesticos"
    ? [
        { slug: "neveras", label: "Neveras", template: "PRODUCT" as const },
        { slug: "lavadoras", label: "Lavadoras", template: "PRODUCT" as const },
        { slug: "secadoras", label: "Secadoras", template: "PRODUCT" as const },
        { slug: "cocinas", label: "Cocinas", template: "PRODUCT" as const },
        { slug: "hornos", label: "Hornos", template: "PRODUCT" as const },
        { slug: "microondas", label: "Microondas", template: "PRODUCT" as const },
        { slug: "aires-acondicionados", label: "Aires acondicionados", template: "PRODUCT" as const },
        {
          slug: "pequenos-electrodomesticos",
          label: "Pequeños electrodomésticos",
          template: "PRODUCT" as const,
        },
        {
          slug: "industrial",
          label: "Industrial y restauración",
          template: "PRODUCT" as const,
        },
        { slug: "otros", label: "Otros", template: "PRODUCT" as const },
      ].find((s: any) => s.slug === subslug)
    : slug === "hogar"
    ? [
        { slug: "muebles-de-hogar", label: "Muebles de hogar", template: "PRODUCT" as const },
        { slug: "decoracion", label: "Decoración", template: "PRODUCT" as const },
        { slug: "colchones", label: "Colchones", template: "PRODUCT" as const },
        { slug: "iluminacion", label: "Iluminación", template: "PRODUCT" as const },
        { slug: "menaje", label: "Menaje", template: "PRODUCT" as const },
        { slug: "organizacion", label: "Organización", template: "PRODUCT" as const },
        { slug: "jardin-y-terraza", label: "Jardín y terraza", template: "PRODUCT" as const },
        { slug: "otros", label: "Otros", template: "PRODUCT" as const },
      ].find((s: any) => s.slug === subslug)
    : null);

if (!category || !subcategory) {
  return notFound();
}

  const categoryLabel = getCategoryLabel(category);
  const subcategoryLabel = getSubcategoryLabel(subcategory);

  const allListings = await getListings({
    categorySlug: slug,
    subcategorySlug: subslug,
    take: 100,
  });

  const heroImage = getSubcategoryHeroImage(slug, subslug);
  const description = getSubcategoryDescription(categoryLabel, subcategoryLabel);

  const brand = getParam(resolvedSearchParams, "brand");
  const year = getParam(resolvedSearchParams, "year");
  const kmMax = getParam(resolvedSearchParams, "kmMax");
  const fuel = getParam(resolvedSearchParams, "fuel");
  const transmission = getParam(resolvedSearchParams, "transmission");
  const cc = getParam(resolvedSearchParams, "cc");
  const partType = getParam(resolvedSearchParams, "partType");
  const compatibleBrand = getParam(resolvedSearchParams, "compatibleBrand");

  const priceMax = getParam(resolvedSearchParams, "priceMax");
  const rooms = getParam(resolvedSearchParams, "rooms");
  const baths = getParam(resolvedSearchParams, "baths");
  const sqmMin = getParam(resolvedSearchParams, "sqmMin");
  const sqmMax = getParam(resolvedSearchParams, "sqmMax");
  const parking = getParam(resolvedSearchParams, "parking");
  const deal = getParam(resolvedSearchParams, "deal");

  const model = getParam(resolvedSearchParams, "model");
  const storage = getParam(resolvedSearchParams, "storage");
  const condition = getParam(resolvedSearchParams, "condition");
  const phoneType = getParam(resolvedSearchParams, "phoneType");

  const modality = getParam(resolvedSearchParams, "modality");
  const schedule = getParam(resolvedSearchParams, "schedule");

  const serviceType = getParam(resolvedSearchParams, "serviceType");
  const urgency = getParam(resolvedSearchParams, "urgency");

  const businessType = getParam(resolvedSearchParams, "businessType");
  const operationType = getParam(resolvedSearchParams, "operationType");

  const breed = getParam(resolvedSearchParams, "breed");
  const petAge = getParam(resolvedSearchParams, "petAge");
  const sex = getParam(resolvedSearchParams, "sex");
  const size = getParam(resolvedSearchParams, "size");

  const ageStage = getParam(resolvedSearchParams, "ageStage");
  const sizeModa = getParam(resolvedSearchParams, "sizeModa");

  const order = getParam(resolvedSearchParams, "order") || "recent";

  const isCar = slug === "motor" && subslug === "carros";
  const isMoto = slug === "motor" && subslug === "motos";
  const isPart = slug === "motor" && subslug === "repuestos";

  const isRealEstate = slug === "inmobiliaria";
  const isHouse = slug === "inmobiliaria" && subslug === "casa";
  const isApartment = slug === "inmobiliaria" && subslug === "apartamento";
  const isStudio = slug === "inmobiliaria" && subslug === "apartaestudio";
  const isCommercial = slug === "inmobiliaria" && subslug === "local-comercial";
  const isFarm = slug === "inmobiliaria" && subslug === "finca";
  const isLot = slug === "inmobiliaria" && subslug === "lote";

  const isCellphones = slug === "celulares";
  const isCellphoneMain = slug === "celulares" && subslug === "celulares";
  const isCellphoneParts = slug === "celulares" && subslug === "repuestos";
  const isLandline = slug === "celulares" && subslug === "telefono-fijo";

  const isImageSound = slug === "imagen-sonido";

  const isEmployment = slug === "empleo";
  const isOfferingJob = slug === "empleo" && subslug === "ofrezco-empleo";

  const isServices = slug === "servicios";
  const isBusiness = slug === "negocios";

  const isGames = slug === "juegos";
  const isGameConsoles = slug === "juegos" && subslug === "consolas";
  const isGameVideogames = slug === "juegos" && subslug === "videojuegos";
  const isGameAccessories = slug === "juegos" && subslug === "accesorios";

  const isPets = slug === "mascotas";
  const isDogs = slug === "mascotas" && subslug === "perros";
  const isCats = slug === "mascotas" && subslug === "gatos";
  const isBirds = slug === "mascotas" && subslug === "aves";
  const isFish = slug === "mascotas" && subslug === "peces";
  const isRodents = slug === "mascotas" && subslug === "roedores";

  const isBabies = slug === "bebes";
  const isFashion = slug === "moda";

  const availableBrands = uniq(
    allListings.map((item) => String(getMotorData(item)?.brand ?? ""))
  );

  const availableCellBrands = uniq(
    allListings.map((item) => String(getCellphoneData(item)?.brand ?? ""))
  );

  const availableImageBrands = uniq(
    allListings.map((item) => String(getProductData(item)?.brand ?? ""))
  );

  const availableGameBrands = uniq(
    allListings.map((item) => String(getProductData(item)?.brand ?? ""))
  );

  const availablePetBreeds = uniq(
    allListings.map((item) => String(getPetData(item)?.breed ?? ""))
  );

  const availableServiceTypes = uniq(
    allListings.map((item) => String(getServiceData(item)?.type ?? ""))
  );

  const availableBusinessTypes = uniq(
    allListings.map((item) => String(getBusinessData(item)?.type ?? ""))
  );

  const availableBabyBrands = uniq(
    allListings.map((item) => String(getProductData(item)?.brand ?? ""))
  );

  const availableFashionBrands = uniq(
    allListings.map((item) => String(getProductData(item)?.brand ?? ""))
  );

  let listings = allListings.filter((item) => {
    if (isCar || isMoto || isPart) {
      const motor = getMotorData(item);
      const itemBrand = normalizeText(motor?.brand);
      const itemYear = toNumber(motor?.year);
      const itemKm = toNumber(motor?.km);
      const itemFuel = normalizeText(motor?.fuel);
      const itemTransmission = normalizeText(motor?.transmission);
      const itemCc = toNumber(motor?.cc);
      const itemPartType = normalizeText(motor?.partType);
      const itemCompatibleBrand = normalizeText(motor?.brand);
      const itemPrice = toNumber(item?.price);

      if (brand && itemBrand !== normalizeText(brand)) return false;
      if (year && itemYear !== Number(year)) return false;
      if (kmMax && itemKm !== null && itemKm > Number(kmMax)) return false;
      if (fuel && itemFuel !== normalizeText(fuel)) return false;
      if (transmission && itemTransmission !== normalizeText(transmission)) return false;
      if (cc && itemCc !== null && itemCc !== Number(cc)) return false;
      if (partType && itemPartType !== normalizeText(partType)) return false;
      if (compatibleBrand && itemCompatibleBrand !== normalizeText(compatibleBrand)) return false;
      if (priceMax && itemPrice !== null && itemPrice > Number(priceMax)) return false;

      return true;
    }

    if (isRealEstate) {
      const realEstate = getRealEstateData(item);
      const itemPrice = toNumber(item?.price);
      const itemRooms = toNumber(realEstate?.rooms);
      const itemBaths = toNumber(realEstate?.baths);
      const itemSqm = toNumber(realEstate?.sqm);
      const itemParking = Boolean(realEstate?.parking);
      const itemDeal = normalizeText(realEstate?.deal);

      if (priceMax && itemPrice !== null && itemPrice > Number(priceMax)) return false;
      if (rooms && itemRooms !== null && itemRooms < Number(rooms)) return false;
      if (baths && itemBaths !== null && itemBaths < Number(baths)) return false;
      if (sqmMin && itemSqm !== null && itemSqm < Number(sqmMin)) return false;
      if (sqmMax && itemSqm !== null && itemSqm > Number(sqmMax)) return false;
      if (parking === "si" && !itemParking) return false;
      if (parking === "no" && itemParking) return false;
      if (deal && itemDeal !== normalizeText(deal)) return false;

      return true;
    }

    if (isCellphones) {
      const cellphone = getCellphoneData(item);
      const itemPrice = toNumber(item?.price);
      const itemBrand = normalizeText(cellphone?.brand);
      const itemModel = normalizeText(cellphone?.model);
      const itemStorage = normalizeText(cellphone?.storage);
      const itemCondition = normalizeText(cellphone?.condition);
      const itemPhoneType = normalizeText(cellphone?.type);
      const itemPartType = normalizeText(cellphone?.partType);
      const itemCompatibleBrand = normalizeText(cellphone?.compatibleBrand);

      if (priceMax && itemPrice !== null && itemPrice > Number(priceMax)) return false;

      if (isCellphoneMain) {
        if (brand && itemBrand !== normalizeText(brand)) return false;
        if (model && !itemModel.includes(normalizeText(model))) return false;
        if (storage && itemStorage !== normalizeText(storage)) return false;
        if (condition && itemCondition !== normalizeText(condition)) return false;
      }

      if (isCellphoneParts) {
        if (partType && itemPartType !== normalizeText(partType)) return false;
        if (compatibleBrand && itemCompatibleBrand !== normalizeText(compatibleBrand)) return false;
      }

      if (isLandline) {
        if (phoneType && itemPhoneType !== normalizeText(phoneType)) return false;
        if (condition && itemCondition !== normalizeText(condition)) return false;
      }

      return true;
    }

    if (isImageSound) {
      const product = getProductData(item);
      const itemBrand = normalizeText(product?.brand);
      const itemPrice = toNumber(item?.price);

      if (brand && itemBrand !== normalizeText(brand)) return false;
      if (priceMax && itemPrice !== null && itemPrice > Number(priceMax)) return false;

      return true;
    }

    if (isGames) {
      const product = getProductData(item);
      const itemBrand = normalizeText(product?.brand);
      const itemPrice = toNumber(item?.price);

      if ((isGameConsoles || isGameVideogames || isGameAccessories) && brand) {
        if (itemBrand !== normalizeText(brand)) return false;
      }

      if (priceMax && itemPrice !== null && itemPrice > Number(priceMax)) return false;

      return true;
    }

    if (isPets) {
      const pet = getPetData(item);
      const itemBreed = normalizeText(pet?.breed);
      const itemAge = normalizeText(pet?.age);
      const itemSex = normalizeText(pet?.sex);
      const itemSize = normalizeText(pet?.size);
      const itemPrice = toNumber(item?.price);

      if ((isDogs || isCats) && breed && itemBreed !== normalizeText(breed)) return false;
      if ((isDogs || isCats || isBirds || isFish || isRodents) && petAge && itemAge !== normalizeText(petAge)) return false;
      if ((isDogs || isCats) && sex && itemSex !== normalizeText(sex)) return false;
      if ((isDogs || isCats) && size && itemSize !== normalizeText(size)) return false;
      if (priceMax && itemPrice !== null && itemPrice > Number(priceMax)) return false;

      return true;
    }

    if (isBabies) {
      const product = getProductData(item);
      const itemBrand = normalizeText(product?.brand);
      const itemCondition = normalizeText(product?.condition);
      const itemAgeStage = normalizeText(product?.ageStage);
      const itemPrice = toNumber(item?.price);

      if (brand && itemBrand !== normalizeText(brand)) return false;
      if (condition && itemCondition !== normalizeText(condition)) return false;
      if (ageStage && itemAgeStage !== normalizeText(ageStage)) return false;
      if (priceMax && itemPrice !== null && itemPrice > Number(priceMax)) return false;

      return true;
    }

    if (isFashion) {
      const product = getProductData(item);
      const itemBrand = normalizeText(product?.brand);
      const itemCondition = normalizeText(product?.condition);
      const itemSizeModa = normalizeText(product?.size);
      const itemPrice = toNumber(item?.price);

      if (brand && itemBrand !== normalizeText(brand)) return false;
      if (condition && itemCondition !== normalizeText(condition)) return false;
      if (sizeModa && itemSizeModa !== normalizeText(sizeModa)) return false;
      if (priceMax && itemPrice !== null && itemPrice > Number(priceMax)) return false;

      return true;
    }

    if (isEmployment) {
      const job = getJobData(item);
      const itemPrice = toNumber(item?.price);
      const itemModality = normalizeText(job?.modality);
      const itemSchedule = normalizeText(job?.schedule);

      if (priceMax && itemPrice !== null && itemPrice > Number(priceMax)) return false;
      if (modality && itemModality !== normalizeText(modality)) return false;
      if (schedule && itemSchedule !== normalizeText(schedule)) return false;

      return true;
    }

    if (isServices) {
      const service = getServiceData(item);
      const itemPrice = toNumber(item?.price);
      const itemServiceType = normalizeText(service?.type);
      const itemUrgency = normalizeText(service?.urgency);

      if (priceMax && itemPrice !== null && itemPrice > Number(priceMax)) return false;
      if (serviceType && itemServiceType !== normalizeText(serviceType)) return false;
      if (urgency && itemUrgency !== normalizeText(urgency)) return false;

      return true;
    }

    if (isBusiness) {
      const business = getBusinessData(item);
      const itemPrice = toNumber(item?.price);
      const itemBusinessType = normalizeText(business?.type);
      const itemOperationType = normalizeText(business?.operationType);

      if (priceMax && itemPrice !== null && itemPrice > Number(priceMax)) return false;
      if (businessType && itemBusinessType !== normalizeText(businessType)) return false;
      if (operationType && itemOperationType !== normalizeText(operationType)) return false;

      return true;
    }

    return true;
  });

listings = listings.sort((a, b) => {
  // 1. Premium primero
  if (a.isPremium && !b.isPremium) return -1;
  if (!a.isPremium && b.isPremium) return 1;

  // 2. Destacados después
  if (a.isFeatured && !b.isFeatured) return -1;
  if (!a.isFeatured && b.isFeatured) return 1;

  // 3. Luego orden normal
  if (order === "price-asc") {
    return (Number(a?.price ?? 0) || 0) - (Number(b?.price ?? 0) || 0);
  }

  if (order === "price-desc") {
    return (Number(b?.price ?? 0) || 0) - (Number(a?.price ?? 0) || 0);
  }

  if (order === "popular") {
    return (Number(b?.views ?? 0) || 0) - (Number(a?.views ?? 0) || 0);
  }

  // por defecto: más recientes
  return (
    new Date(b?.createdAt ?? 0).getTime() -
    new Date(a?.createdAt ?? 0).getTime()
  );
});

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <div className="mx-auto max-w-[1280px] px-4 pb-10 pt-6 md:px-6">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 shadow-sm">
          {heroImage ? (
            <div className="relative min-h-[320px] md:min-h-[380px]">
              <img
                src={heroImage}
                alt={subcategoryLabel}
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div
                className={
                  isRealEstate
                    ? "absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent"
                    : isCellphones
                    ? "absolute inset-0 bg-gradient-to-r from-[#071226]/90 via-[#0b2d61]/55 to-transparent"
                    : isEmployment
                    ? "absolute inset-0 bg-gradient-to-r from-[#0a1f44]/90 via-[#123b7a]/55 to-transparent"
                    : isServices
                    ? "absolute inset-0 bg-gradient-to-r from-[#0b1f2a]/90 via-[#14506b]/50 to-transparent"
                    : isBusiness
                    ? "absolute inset-0 bg-gradient-to-r from-[#1d1307]/90 via-[#5a3410]/50 to-transparent"
                    : isImageSound
                    ? "absolute inset-0 bg-gradient-to-r from-[#180b2c]/90 via-[#5a2f91]/45 to-transparent"
                    : isGames
                    ? "absolute inset-0 bg-gradient-to-r from-[#0c1020]/90 via-[#283b7a]/45 to-transparent"
                    : isPets
                    ? "absolute inset-0 bg-gradient-to-r from-[#2a160a]/90 via-[#8b5a2b]/45 to-transparent"
                    : isBabies
                    ? "absolute inset-0 bg-gradient-to-r from-[#2b1731]/90 via-[#c06aa1]/45 to-transparent"
                    : isFashion
                    ? "absolute inset-0 bg-gradient-to-r from-[#1a0e1d]/90 via-[#7a3f8f]/45 to-transparent"
                    : "absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent"
                }
              />

              <div className="relative px-6 py-8 text-white md:px-10 md:py-10">
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-extrabold text-white backdrop-blur-md transition hover:bg-white/15"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Volver a inicio
                  </Link>

                  <div className="[&_button]:inline-flex [&_button]:items-center [&_button]:gap-2 [&_button]:rounded-full [&_button]:border [&_button]:border-white/20 [&_button]:bg-white/10 [&_button]:px-4 [&_button]:py-2 [&_button]:text-sm [&_button]:font-extrabold [&_button]:text-white [&_button]:backdrop-blur-md [&_button]:transition hover:[&_button]:bg-white/15">
                    <BackButton />
                  </div>

                  <Link
                    href={`/categoria/${category.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-extrabold text-white backdrop-blur-md transition hover:bg-white/15"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Volver a {categoryLabel}
                  </Link>
                </div>

                <div className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-white/70">
                  {categoryLabel} / {subcategoryLabel}
                </div>

                <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
                  {subcategoryLabel}
                </h1>

                <p className="mt-4 max-w-2xl text-sm font-medium leading-6 text-white/85 md:text-base">
                  {description}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-white backdrop-blur-md">
                    {listings.length} anuncio{listings.length === 1 ? "" : "s"}
                  </div>

                  <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-white/95 backdrop-blur-md">
                    Publicaciones reales
                  </div>

                  <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-white/95 backdrop-blur-md">
                    Cerca de ti
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {isCar || isMoto || isPart ? (
          <MotorFilters
            type={isCar ? "carros" : isMoto ? "motos" : "repuestos"}
            availableBrands={availableBrands}
          />
        ) : null}

        {isRealEstate ? (
          <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <form method="GET" className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Filtros</div>
                  <h2 className="mt-2 text-2xl font-black text-slate-900">Refina tu búsqueda</h2>
                  <p className="mt-2 text-sm text-slate-500">Encuentra la propiedad ideal con filtros más precisos.</p>
                </div>

                <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
                  {listings.length} resultados
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {isHouse || isApartment || isStudio || isCommercial || isFarm ? (
                  <select name="deal" defaultValue={deal} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                    <option value="">Venta / Arriendo</option>
                    <option value="venta">Venta</option>
                    <option value="arriendo">Arriendo</option>
                  </select>
                ) : null}

                {isHouse || isApartment || isStudio || isFarm ? (
                  <>
                    <input
                      name="rooms"
                      type="number"
                      defaultValue={rooms}
                      placeholder="Habitaciones mín."
                      className="h-10 w-[160px] rounded-xl border border-slate-200 bg-white px-3 text-sm"
                    />
                    <input
                      name="baths"
                      type="number"
                      defaultValue={baths}
                      placeholder="Baños mín."
                      className="h-10 w-[140px] rounded-xl border border-slate-200 bg-white px-3 text-sm"
                    />
                  </>
                ) : null}

                {isHouse || isApartment || isStudio || isCommercial || isFarm || isLot ? (
                  <>
                    <input
                      name="sqmMin"
                      type="number"
                      defaultValue={sqmMin}
                      placeholder="m² mín."
                      className="h-10 w-[120px] rounded-xl border border-slate-200 bg-white px-3 text-sm"
                    />
                    <input
                      name="sqmMax"
                      type="number"
                      defaultValue={sqmMax}
                      placeholder="m² máx."
                      className="h-10 w-[120px] rounded-xl border border-slate-200 bg-white px-3 text-sm"
                    />
                  </>
                ) : null}

                {isHouse || isApartment || isStudio || isCommercial || isFarm ? (
                  <select name="parking" defaultValue={parking} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                    <option value="">Parqueadero</option>
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                  </select>
                ) : null}

                <input
                  name="priceMax"
                  type="number"
                  defaultValue={priceMax}
                  placeholder="Precio máx"
                  className="h-10 w-[140px] rounded-xl border border-slate-200 bg-white px-3 text-sm"
                />

                <select name="order" defaultValue={order} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold">
                  <option value="recent">Más recientes</option>
                  <option value="price-asc">Menor precio</option>
                  <option value="price-desc">Mayor precio</option>
                  <option value="popular">Más populares</option>
                </select>

                <button type="submit" className="h-10 rounded-xl bg-[#0f3c8c] px-4 text-sm font-black text-white hover:bg-[#0c2f6d]">
                  Aplicar
                </button>

                <Link
                  href={`/categoria/${category.slug}/${subcategory.slug}`}
                  className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50"
                >
                  Limpiar
                </Link>
              </div>
            </form>
          </div>
        ) : null}

        {isCellphones ? (
          <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <form method="GET" className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Filtros</div>
                  <h2 className="mt-2 text-2xl font-black text-slate-900">Refina tu búsqueda</h2>
                  <p className="mt-2 text-sm text-slate-500">Encuentra el equipo ideal filtrando por marca, estado y precio.</p>
                </div>

                <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
                  {listings.length} resultados
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {isCellphoneMain ? (
                  <>
                    <select name="brand" defaultValue={brand} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                      <option value="">Marca</option>
                      {availableCellBrands.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>

                    <input
                      name="model"
                      type="text"
                      defaultValue={model}
                      placeholder="Modelo"
                      className="h-10 w-[150px] rounded-xl border border-slate-200 bg-white px-3 text-sm"
                    />

                    <select name="storage" defaultValue={storage} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                      <option value="">Almacenamiento</option>
                      <option value="64gb">64 GB</option>
                      <option value="128gb">128 GB</option>
                      <option value="256gb">256 GB</option>
                      <option value="512gb">512 GB</option>
                    </select>

                    <select name="condition" defaultValue={condition} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                      <option value="">Estado</option>
                      <option value="nuevo">Nuevo</option>
                      <option value="usado">Usado</option>
                      <option value="reacondicionado">Reacondicionado</option>
                    </select>
                  </>
                ) : null}

                {isCellphoneParts ? (
                  <>
                    <select name="partType" defaultValue={partType} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                      <option value="">Tipo de repuesto</option>
                      <option value="pantalla">Pantalla</option>
                      <option value="bateria">Batería</option>
                      <option value="cargador">Cargador</option>
                      <option value="camara">Cámara</option>
                      <option value="flex">Flex</option>
                      <option value="tapa">Tapa</option>
                      <option value="otros">Otros</option>
                    </select>

                    <select name="compatibleBrand" defaultValue={compatibleBrand} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                      <option value="">Marca compatible</option>
                      {availableCellBrands.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </>
                ) : null}

                {isLandline ? (
                  <>
                    <select name="phoneType" defaultValue={phoneType} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                      <option value="">Tipo</option>
                      <option value="hogar">Hogar</option>
                      <option value="oficina">Oficina</option>
                      <option value="inalambrico">Inalámbrico</option>
                    </select>

                    <select name="condition" defaultValue={condition} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                      <option value="">Estado</option>
                      <option value="nuevo">Nuevo</option>
                      <option value="usado">Usado</option>
                    </select>
                  </>
                ) : null}

                <input
                  name="priceMax"
                  type="number"
                  defaultValue={priceMax}
                  placeholder="Precio máx"
                  className="h-10 w-[140px] rounded-xl border border-slate-200 bg-white px-3 text-sm"
                />

                <select name="order" defaultValue={order} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold">
                  <option value="recent">Más recientes</option>
                  <option value="price-asc">Menor precio</option>
                  <option value="price-desc">Mayor precio</option>
                  <option value="popular">Más populares</option>
                </select>

                <button type="submit" className="h-10 rounded-xl bg-[#0f3c8c] px-4 text-sm font-black text-white hover:bg-[#0c2f6d]">
                  Aplicar
                </button>

                <Link
                  href={`/categoria/${category.slug}/${subcategory.slug}`}
                  className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50"
                >
                  Limpiar
                </Link>
              </div>
            </form>
          </div>
        ) : null}

        {isImageSound ? (
          <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <form method="GET" className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Filtros</div>
                  <h2 className="mt-2 text-2xl font-black text-slate-900">Refina tu búsqueda</h2>
                  <p className="mt-2 text-sm text-slate-500">Encuentra el equipo ideal filtrando por marca y precio.</p>
                </div>

                <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
                  {listings.length} resultados
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select name="brand" defaultValue={brand} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                  <option value="">Marca</option>
                  {availableImageBrands.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>

                <input
                  name="priceMax"
                  type="number"
                  defaultValue={priceMax}
                  placeholder="Precio máx"
                  className="h-10 w-[140px] rounded-xl border border-slate-200 bg-white px-3 text-sm"
                />

                <select name="order" defaultValue={order} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold">
                  <option value="recent">Más recientes</option>
                  <option value="price-asc">Menor precio</option>
                  <option value="price-desc">Mayor precio</option>
                  <option value="popular">Más populares</option>
                </select>

                <button type="submit" className="h-10 rounded-xl bg-[#0f3c8c] px-4 text-sm font-black text-white hover:bg-[#0c2f6d]">
                  Aplicar
                </button>

                <Link
                  href={`/categoria/${category.slug}/${subcategory.slug}`}
                  className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50"
                >
                  Limpiar
                </Link>
              </div>
            </form>
          </div>
        ) : null}

        {isGames ? (
          <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <form method="GET" className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Filtros</div>
                  <h2 className="mt-2 text-2xl font-black text-slate-900">Refina tu búsqueda</h2>
                  <p className="mt-2 text-sm text-slate-500">Encuentra consolas, videojuegos y accesorios filtrando por marca y precio.</p>
                </div>

                <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
                  {listings.length} resultados
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {isGameConsoles || isGameVideogames || isGameAccessories ? (
                  <select name="brand" defaultValue={brand} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                    <option value="">Marca</option>
                    {availableGameBrands.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                ) : null}

                <input
                  name="priceMax"
                  type="number"
                  defaultValue={priceMax}
                  placeholder="Precio máx"
                  className="h-10 w-[140px] rounded-xl border border-slate-200 bg-white px-3 text-sm"
                />

                <select name="order" defaultValue={order} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold">
                  <option value="recent">Más recientes</option>
                  <option value="price-asc">Menor precio</option>
                  <option value="price-desc">Mayor precio</option>
                  <option value="popular">Más populares</option>
                </select>

                <button type="submit" className="h-10 rounded-xl bg-[#0f3c8c] px-4 text-sm font-black text-white hover:bg-[#0c2f6d]">
                  Aplicar
                </button>

                <Link
                  href={`/categoria/${category.slug}/${subcategory.slug}`}
                  className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50"
                >
                  Limpiar
                </Link>
              </div>
            </form>
          </div>
        ) : null}

        {isPets ? (
          <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <form method="GET" className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Filtros</div>
                  <h2 className="mt-2 text-2xl font-black text-slate-900">Refina tu búsqueda</h2>
                  <p className="mt-2 text-sm text-slate-500">Encuentra mascotas y accesorios filtrando por raza, edad, sexo, tamaño y precio.</p>
                </div>

                <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
                  {listings.length} resultados
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {isDogs || isCats ? (
                  <select name="breed" defaultValue={breed} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                    <option value="">Raza</option>
                    {availablePetBreeds.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                ) : null}

                {isDogs || isCats || isBirds || isFish || isRodents ? (
                  <select name="petAge" defaultValue={petAge} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                    <option value="">Edad</option>
                    <option value="cachorro">Cachorro</option>
                    <option value="joven">Joven</option>
                    <option value="adulto">Adulto</option>
                  </select>
                ) : null}

                {isDogs || isCats ? (
                  <select name="sex" defaultValue={sex} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                    <option value="">Sexo</option>
                    <option value="macho">Macho</option>
                    <option value="hembra">Hembra</option>
                  </select>
                ) : null}

                {isDogs || isCats ? (
                  <select name="size" defaultValue={size} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                    <option value="">Tamaño</option>
                    <option value="pequeño">Pequeño</option>
                    <option value="mediano">Mediano</option>
                    <option value="grande">Grande</option>
                  </select>
                ) : null}

                <input
                  name="priceMax"
                  type="number"
                  defaultValue={priceMax}
                  placeholder="Precio máx"
                  className="h-10 w-[140px] rounded-xl border border-slate-200 bg-white px-3 text-sm"
                />

                <select name="order" defaultValue={order} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold">
                  <option value="recent">Más recientes</option>
                  <option value="price-asc">Menor precio</option>
                  <option value="price-desc">Mayor precio</option>
                  <option value="popular">Más populares</option>
                </select>

                <button type="submit" className="h-10 rounded-xl bg-[#0f3c8c] px-4 text-sm font-black text-white hover:bg-[#0c2f6d]">
                  Aplicar
                </button>

                <Link
                  href={`/categoria/${category.slug}/${subcategory.slug}`}
                  className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50"
                >
                  Limpiar
                </Link>
              </div>
            </form>
          </div>
        ) : null}

        {isBabies ? (
          <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <form method="GET" className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Filtros</div>
                  <h2 className="mt-2 text-2xl font-black text-slate-900">Refina tu búsqueda</h2>
                  <p className="mt-2 text-sm text-slate-500">Encuentra productos para bebé filtrando por marca, estado, etapa y precio.</p>
                </div>

                <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
                  {listings.length} resultados
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select name="brand" defaultValue={brand} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                  <option value="">Marca</option>
                  {availableBabyBrands.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>

                <select name="condition" defaultValue={condition} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                  <option value="">Estado</option>
                  <option value="nuevo">Nuevo</option>
                  <option value="usado">Usado</option>
                </select>

                <select name="ageStage" defaultValue={ageStage} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                  <option value="">Etapa</option>
                  <option value="recien-nacido">Recién nacido</option>
                  <option value="0-3-meses">0 a 3 meses</option>
                  <option value="3-6-meses">3 a 6 meses</option>
                  <option value="6-12-meses">6 a 12 meses</option>
                  <option value="12m+">12 meses o más</option>
                </select>

                <input
                  name="priceMax"
                  type="number"
                  defaultValue={priceMax}
                  placeholder="Precio máx"
                  className="h-10 w-[140px] rounded-xl border border-slate-200 bg-white px-3 text-sm"
                />

                <select name="order" defaultValue={order} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold">
                  <option value="recent">Más recientes</option>
                  <option value="price-asc">Menor precio</option>
                  <option value="price-desc">Mayor precio</option>
                  <option value="popular">Más populares</option>
                </select>

                <button type="submit" className="h-10 rounded-xl bg-[#0f3c8c] px-4 text-sm font-black text-white hover:bg-[#0c2f6d]">
                  Aplicar
                </button>

                <Link
                  href={`/categoria/${category.slug}/${subcategory.slug}`}
                  className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50"
                >
                  Limpiar
                </Link>
              </div>
            </form>
          </div>
        ) : null}

        {isFashion ? (
          <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <form method="GET" className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Filtros</div>
                  <h2 className="mt-2 text-2xl font-black text-slate-900">Refina tu búsqueda</h2>
                  <p className="mt-2 text-sm text-slate-500">Encuentra prendas, calzado y accesorios filtrando por marca, talla, estado y precio.</p>
                </div>

                <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
                  {listings.length} resultados
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select name="brand" defaultValue={brand} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                  <option value="">Marca</option>
                  {availableFashionBrands.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>

                <select name="sizeModa" defaultValue={sizeModa} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                  <option value="">Talla</option>
                  <option value="xs">XS</option>
                  <option value="s">S</option>
                  <option value="m">M</option>
                  <option value="l">L</option>
                  <option value="xl">XL</option>
                  <option value="xxl">XXL</option>
                  <option value="28">28</option>
                  <option value="30">30</option>
                  <option value="32">32</option>
                  <option value="34">34</option>
                  <option value="36">36</option>
                  <option value="38">38</option>
                  <option value="40">40</option>
                </select>

                <select name="condition" defaultValue={condition} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                  <option value="">Estado</option>
                  <option value="nuevo">Nuevo</option>
                  <option value="usado">Usado</option>
                </select>

                <input
                  name="priceMax"
                  type="number"
                  defaultValue={priceMax}
                  placeholder="Precio máx"
                  className="h-10 w-[140px] rounded-xl border border-slate-200 bg-white px-3 text-sm"
                />

                <select name="order" defaultValue={order} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold">
                  <option value="recent">Más recientes</option>
                  <option value="price-asc">Menor precio</option>
                  <option value="price-desc">Mayor precio</option>
                  <option value="popular">Más populares</option>
                </select>

                <button type="submit" className="h-10 rounded-xl bg-[#0f3c8c] px-4 text-sm font-black text-white hover:bg-[#0c2f6d]">
                  Aplicar
                </button>

                <Link
                  href={`/categoria/${category.slug}/${subcategory.slug}`}
                  className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50"
                >
                  Limpiar
                </Link>
              </div>
            </form>
          </div>
        ) : null}

        {isEmployment ? (
          <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <form method="GET" className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Filtros</div>
                  <h2 className="mt-2 text-2xl font-black text-slate-900">Refina tu búsqueda</h2>
                  <p className="mt-2 text-sm text-slate-500">Encuentra ofertas o perfiles con filtros rápidos y claros.</p>
                </div>

                <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
                  {listings.length} resultados
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select name="modality" defaultValue={modality} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                  <option value="">Modalidad</option>
                  <option value="presencial">Presencial</option>
                  <option value="remoto">Remoto</option>
                  <option value="hibrido">Híbrido</option>
                </select>

                <select name="schedule" defaultValue={schedule} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                  <option value="">Jornada</option>
                  <option value="tiempo-completo">Tiempo completo</option>
                  <option value="medio-tiempo">Medio tiempo</option>
                  <option value="por-horas">Por horas</option>
                  <option value="freelance">Freelance</option>
                </select>

                <input
                  name="priceMax"
                  type="number"
                  defaultValue={priceMax}
                  placeholder={isOfferingJob ? "Salario máx" : "Aspiración máx"}
                  className="h-10 w-[160px] rounded-xl border border-slate-200 bg-white px-3 text-sm"
                />

                <select name="order" defaultValue={order} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold">
                  <option value="recent">Más recientes</option>
                  <option value="price-asc">Menor salario</option>
                  <option value="price-desc">Mayor salario</option>
                  <option value="popular">Más populares</option>
                </select>

                <button type="submit" className="h-10 rounded-xl bg-[#0f3c8c] px-4 text-sm font-black text-white hover:bg-[#0c2f6d]">
                  Aplicar
                </button>

                <Link
                  href={`/categoria/${category.slug}/${subcategory.slug}`}
                  className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50"
                >
                  Limpiar
                </Link>
              </div>
            </form>
          </div>
        ) : null}

        {isServices ? (
          <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <form method="GET" className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Filtros</div>
                  <h2 className="mt-2 text-2xl font-black text-slate-900">Refina tu búsqueda</h2>
                  <p className="mt-2 text-sm text-slate-500">Encuentra el servicio ideal con filtros rápidos y claros.</p>
                </div>

                <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
                  {listings.length} resultados
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select name="serviceType" defaultValue={serviceType} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                  <option value="">Tipo de servicio</option>
                  {availableServiceTypes.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>

                <select name="urgency" defaultValue={urgency} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                  <option value="">Urgencia</option>
                  <option value="normal">Normal</option>
                  <option value="hoy">Hoy</option>
                  <option value="urgente">Urgente</option>
                </select>

                <input
                  name="priceMax"
                  type="number"
                  defaultValue={priceMax}
                  placeholder="Precio máx"
                  className="h-10 w-[140px] rounded-xl border border-slate-200 bg-white px-3 text-sm"
                />

                <select name="order" defaultValue={order} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold">
                  <option value="recent">Más recientes</option>
                  <option value="price-asc">Menor precio</option>
                  <option value="price-desc">Mayor precio</option>
                  <option value="popular">Más populares</option>
                </select>

                <button type="submit" className="h-10 rounded-xl bg-[#0f3c8c] px-4 text-sm font-black text-white hover:bg-[#0c2f6d]">
                  Aplicar
                </button>

                <Link
                  href={`/categoria/${category.slug}/${subcategory.slug}`}
                  className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50"
                >
                  Limpiar
                </Link>
              </div>
            </form>
          </div>
        ) : null}

        {isBusiness ? (
          <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <form method="GET" className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Filtros</div>
                  <h2 className="mt-2 text-2xl font-black text-slate-900">Refina tu búsqueda</h2>
                  <p className="mt-2 text-sm text-slate-500">Encuentra la oportunidad ideal con filtros rápidos y claros.</p>
                </div>

                <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
                  {listings.length} resultados
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select name="businessType" defaultValue={businessType} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                  <option value="">Tipo de negocio</option>
                  {availableBusinessTypes.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>

                <select name="operationType" defaultValue={operationType} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm">
                  <option value="">Operación</option>
                  <option value="venta">Venta</option>
                  <option value="traspaso">Traspaso</option>
                  <option value="franquicia">Franquicia</option>
                  <option value="arriendo">Arriendo</option>
                  <option value="financiacion">Financiación</option>
                </select>

                <input
                  name="priceMax"
                  type="number"
                  defaultValue={priceMax}
                  placeholder="Precio máx"
                  className="h-10 w-[140px] rounded-xl border border-slate-200 bg-white px-3 text-sm"
                />

                <select name="order" defaultValue={order} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold">
                  <option value="recent">Más recientes</option>
                  <option value="price-asc">Menor precio</option>
                  <option value="price-desc">Mayor precio</option>
                  <option value="popular">Más populares</option>
                </select>

                <button type="submit" className="h-10 rounded-xl bg-[#0f3c8c] px-4 text-sm font-black text-white hover:bg-[#0c2f6d]">
                  Aplicar
                </button>

                <Link
                  href={`/categoria/${category.slug}/${subcategory.slug}`}
                  className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50"
                >
                  Limpiar
                </Link>
              </div>
            </form>
          </div>
        ) : null}

        <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          {listings.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <div className="text-xl font-black text-slate-900">No encontramos anuncios con esos filtros</div>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Prueba con otros valores o limpia los filtros aplicados.
              </p>

              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href={`/categoria/${category.slug}/${subcategory.slug}`}
                  className="inline-flex h-11 items-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 hover:bg-slate-50"
                >
                  Limpiar filtros
                </Link>

                <Link
                  href="/publish"
                  className="inline-flex h-11 items-center rounded-xl bg-[#0f3c8c] px-5 text-sm font-black text-white hover:bg-[#0c2f6d]"
                >
                  Publicar anuncio
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Resultados</div>
                  <h2 className="mt-2 text-2xl font-black text-slate-900">
                    {listings.length} anuncio{listings.length === 1 ? "" : "s"} en {subcategoryLabel}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {listings.map((item, idx) => (
                  <ListingCard key={`${item?.id ?? idx}`} item={item} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}