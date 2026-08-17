import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { getListings } from "@/lib/queries/home";
import HomeListingsClient from "@/components/HomeListingsClient";
import BackButton from "@/components/BackButton";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getCategoryDescription(slug: string, label: string) {
  if (slug === "motor") {
    return "Encuentra carros, motos y repuestos en tu ciudad. Explora, compara y descubre tu próximo vehículo.";
  }

  if (slug === "inmobiliaria") {
    return "Encuentra casas, apartamentos, locales, fincas y lotes con una experiencia más clara, visual y confiable.";
  }

  if (slug === "celulares") {
    return "Encuentra celulares nuevos y usados, compara marcas, precios y descubre oportunidades cerca de ti con una experiencia más rápida y confiable.";
  }

  if (slug === "electrodomesticos") {
    return "Encuentra neveras, lavadoras, hornos, microondas, equipos industriales y más electrodomésticos para tu hogar o negocio con una experiencia visual, clara y confiable.";
  }

  if (slug === "hogar") {
    return "Encuentra muebles de hogar, decoración, colchones, iluminación, jardín y más productos para transformar tus espacios con una experiencia visual, clara y confiable.";
  }

  if (slug === "empleo") {
    return "Encuentra oportunidades laborales o publica vacantes con una experiencia clara, rápida y pensada para conectar talento con empresas.";
  }

  if (slug === "servicios") {
    return "Encuentra servicios para hogar, personas, empresas, motor o bicicleta con una experiencia clara, rápida y visual para conectar oferta y necesidad.";
  }

  if (slug === "negocios") {
    return "Encuentra oportunidades de inversión, traspasos, franquicias y negocios en venta o arriendo con una experiencia clara, visual y confiable.";
  }

  if (slug === "informatica") {
    return "Encuentra laptops, PCs, componentes, accesorios, redes e impresoras con una experiencia visual, clara y confiable para comprar tecnología cerca de ti.";
  }

  if (slug === "imagen-sonido") {
    return "Encuentra televisores, audio, cámaras, video, accesorios e instrumentos con una experiencia visual, clara y confiable para comprar entretenimiento y tecnología cerca de ti.";
  }

  if (slug === "juegos") {
    return "Encuentra consolas, videojuegos, accesorios y más con una experiencia visual, clara y confiable para comprar y vender entretenimiento gamer cerca de ti.";
  }

  if (slug === "formacion") {
    return "Encuentra cursos, idiomas, refuerzo académico y programas técnicos con una experiencia clara, visual y confiable para aprender cerca de ti.";
  }

  if (slug === "deportes") {
    return "Encuentra equipos deportivos, bicicletas, ropa deportiva y artículos fitness con una experiencia clara, visual y confiable cerca de ti.";
  }

  if (slug === "mascotas") {
    return "Encuentra perros, gatos, aves, peces, roedores y accesorios con una experiencia visual, clara y confiable para descubrir publicaciones reales cerca de ti.";
  }

  if (slug === "bebes") {
    return "Encuentra coches, cunas, ropa, juguetes y accesorios para bebés con una experiencia visual, clara y confiable para descubrir publicaciones reales cerca de ti.";
  }

  if (slug === "moda") {
    return "Encuentra ropa, calzado, accesorios y prendas de moda con una experiencia visual, clara y confiable para descubrir publicaciones reales cerca de ti.";
  }

  return `Explora anuncios reales dentro de ${label.toLowerCase()} con una experiencia más visual, rápida y clara.`;
}

function getCategoryHeroImage(slug: string) {
  if (slug === "motor") return "/hilux.jpg";
  if (slug === "inmobiliaria") return "/inmobiliaria-hero.jpg";
  if (slug === "celulares") return "/celulares-hero.jpg";
  if (slug === "electrodomesticos") return "/electrodomesticos-hero.jpg";
  if (slug === "hogar") return "/hogar-hero.jpg";
  if (slug === "empleo") return "/empleo-hero.jpg";
  if (slug === "servicios") return "/servicios-hero.jpg";
  if (slug === "negocios") return "/negocios-hero.jpg";
  if (slug === "informatica") return "/informatica-hero.jpg";
  if (slug === "imagen-sonido") return "/imagen-sonido-hero.jpg";
  if (slug === "juegos") return "/juegos-hero.jpg";
  if (slug === "formacion") return "/formacion-hero.jpg";
  if (slug === "deportes") return "/deportes-hero.jpg";
  if (slug === "mascotas") return "/mascotas-hero.jpg";
  if (slug === "bebes") return "/bebes-hero.jpg";
  if (slug === "moda") return "/moda-hero.jpg";
  return null;
}

function getSubcategoryImage(categorySlug: string, subSlug: string) {
  if (categorySlug === "motor") {
    if (subSlug === "carros") return "/hilux.jpg";
    if (subSlug === "motos") return "/motos-hero.jpg";
    if (subSlug === "repuestos") return "/repuestos-hero.jpg";
  }

  if (categorySlug === "inmobiliaria") {
    if (subSlug === "casa") return "/inmo-casa.jpg";
    if (subSlug === "apartamento") return "/inmo-apartamento.jpg";
    if (subSlug === "apartaestudio") return "/inmo-apartaestudio.jpg";
    if (subSlug === "local-comercial") return "/inmo-local.jpg";
    if (subSlug === "finca") return "/inmo-finca.jpg";
    if (subSlug === "lote") return "/inmo-lote.jpg";
    if (subSlug === "casa-campestre") return "/inmo-casa.jpg";
    if (subSlug === "bodega") return "/inmo-local.jpg";
    if (subSlug === "otros-inmuebles") return "/inmobiliaria-hero.jpg";
  }

if (categorySlug === "celulares") {
  if (subSlug === "celulares") return "/celulares-card.jpg";
  if (subSlug === "repuestos") return "/celulares-hero.jpg";
  if (subSlug === "telefono-fijo") return "/celulares-hero.jpg";
}

  if (categorySlug === "electrodomesticos") {
    if (subSlug === "neveras") return "/electrodomesticos-neveras.jpg";
    if (subSlug === "lavadoras") return "/electrodomesticos-lavadoras.jpg";
    if (subSlug === "secadoras") return "/electrodomesticos-secadoras.jpg";
    if (subSlug === "cocinas") return "/electrodomesticos-cocinas.jpg";
    if (subSlug === "hornos") return "/electrodomesticos-hornos.jpg";
    if (subSlug === "microondas") return "/electrodomesticos-microondas.jpg";
    if (subSlug === "aires-acondicionados") return "/electrodomesticos-aires.jpg";
    if (subSlug === "pequenos-electrodomesticos")
      return "/electrodomesticos-pequenos.jpg";
    if (subSlug === "industrial") return "/electrodomesticos-industrial.jpg";
    if (subSlug === "otros") return "/electrodomesticos-hero.jpg";
  }

  if (categorySlug === "hogar") {
    if (subSlug === "muebles-de-hogar") return "/hogar-muebles.jpg";
    if (subSlug === "decoracion") return "/hogar-decoracion.jpg";
    if (subSlug === "colchones") return "/hogar-colchones.jpg";
    if (subSlug === "iluminacion") return "/hogar-iluminacion.jpg";
    if (subSlug === "menaje") return "/hogar-menaje.jpg";
    if (subSlug === "organizacion") return "/hogar-organizacion.jpg";
    if (subSlug === "jardin-y-terraza") return "/hogar-jardin.jpg";
    if (subSlug === "otros") return "/hogar-hero.jpg";
  }

  if (categorySlug === "empleo") {
    if (subSlug === "busco-empleo") return "/empleo-busco.jpg";
    if (subSlug === "ofrezco-empleo") return "/empleo-ofrezco.jpg";
  }

  if (categorySlug === "servicios") {
    if (subSlug === "hogar") return "/servicios-hogar.jpg";
    if (subSlug === "personas") return "/servicios-personas.jpg";
    if (subSlug === "empresas") return "/servicios-empresas.jpg";
    if (subSlug === "energia-solar") return "/energia-solar.jpg";
    if (subSlug === "electricos") return "/servicios-electricos.jpg";
    if (subSlug === "motor") return "/servicios-motor.jpg";
    if (subSlug === "bicicleta") return "/servicios-bicicleta.jpg";
    if (subSlug === "otros") return "/servicios-otros.jpg";
  }

  if (categorySlug === "negocios") {
    if (subSlug === "venta-de-negocios") return "/negocios-venta.jpg";
    if (subSlug === "traspasos") return "/negocios-traspasos.jpg";
    if (subSlug === "franquicias") return "/negocios-franquicias.jpg";
    if (subSlug === "arriendo-de-negocio") return "/negocios-arriendo.jpg";
    if (subSlug === "financiacion") return "/negocios-financiacion.jpg";
  }

  if (categorySlug === "informatica") {
    if (subSlug === "laptops") return "/informatica-laptops.jpg";
    if (subSlug === "pc-escritorio") return "/informatica-pc.jpg";
    if (subSlug === "componentes") return "/informatica-componentes.jpg";
    if (subSlug === "perifericos") return "/informatica-perifericos.jpg";
    if (subSlug === "accesorios") return "/informatica-accesorios.jpg";
    if (subSlug === "redes") return "/informatica-redes.jpg";
    if (subSlug === "impresoras") return "/informatica-impresoras.jpg";
    if (subSlug === "otros") return "/informatica-otros.jpg";
  }

  if (categorySlug === "regalos-celebraciones") {
    if (subSlug === "velas-y-velones") return "/velas-velones.jpg";
    if (subSlug === "regalos") return "/regalos.jpg";
    if (subSlug === "flores-y-detalles") return "/flores-detalles.jpg";
    if (subSlug === "decoracion-para-fiestas") return "/decoracion-fiestas.jpg";
    if (subSlug === "pinateria") return "/pinateria.jpg";
    if (subSlug === "desayunos-y-sorpresas") return "/desayunos-sorpresas.jpg";
    if (subSlug === "globos") return "/globos.jpg";
    if (subSlug === "invitaciones-y-papeleria") return "/invitaciones-papeleria.jpg";
    if (subSlug === "articulos-religiosos") return "/articulos-religiosos.jpg";
    if (subSlug === "otros") return "/otros-regalos.jpg";
  }

  if (categorySlug === "imagen-sonido") {
    if (subSlug === "televisores") return "/imagen-sonido-televisores.jpg";
    if (subSlug === "audio") return "/imagen-sonido-audio.jpg";
    if (subSlug === "camaras") return "/imagen-sonido-camaras.jpg";
    if (subSlug === "video") return "/imagen-sonido-video.jpg";
    if (subSlug === "accesorios") return "/imagen-sonido-accesorios.jpg";
    if (subSlug === "instrumentos") return "/imagen-sonido-instrumentos.jpg";
    if (subSlug === "otros") return "/imagen-sonido-otros.jpg";
  }

  if (categorySlug === "juegos") {
    if (subSlug === "consolas") return "/juegos-consolas.jpg";
    if (subSlug === "videojuegos") return "/juegos-videojuegos.jpg";
    if (subSlug === "accesorios") return "/juegos-accesorios.jpg";
    if (subSlug === "otros") return "/juegos-otros.jpg";
  }

  if (categorySlug === "formacion") {
    if (subSlug === "cursos") return "/formacion-cursos.jpg";
    if (subSlug === "idiomas") return "/formacion-idiomas.jpg";
    if (subSlug === "refuerzo-academico") return "/formacion-refuerzo.jpg";
    if (subSlug === "carreras-tecnicas") return "/formacion-tecnicas.jpg";
    if (subSlug === "otros") return "/formacion-otros.jpg";
  }

  if (categorySlug === "deportes") {
    if (subSlug === "equipos") return "/deportes-equipos.jpg";
    if (subSlug === "ropa-deportiva") return "/deportes-ropa.jpg";
    if (subSlug === "bicicletas") return "/deportes-bicicletas.jpg";
    if (subSlug === "fitness") return "/deportes-fitness.jpg";
    if (subSlug === "otros") return "/deportes-otros.jpg";
  }

  if (categorySlug === "mascotas") {
    if (subSlug === "perros") return "/mascotas-perros.jpg";
    if (subSlug === "gatos") return "/mascotas-gatos.jpg";
    if (subSlug === "aves") return "/mascotas-aves.jpg";
    if (subSlug === "peces") return "/mascotas-peces.jpg";
    if (subSlug === "roedores") return "/mascotas-roedores.jpg";
    if (subSlug === "accesorios") return "/mascotas-accesorios.jpg";
    if (subSlug === "otros") return "/mascotas-otros.jpg";
  }

  if (categorySlug === "bebes") {
    if (subSlug === "coches") return "/bebes-coches.jpg";
    if (subSlug === "cunas") return "/bebes-cunas.jpg";
    if (subSlug === "ropa") return "/bebes-ropa.jpg";
    if (subSlug === "juguetes") return "/bebes-juguetes.jpg";
    if (subSlug === "alimentacion") return "/bebes-alimentacion.jpg";
    if (subSlug === "lactancia") return "/bebes-lactancia.jpg";
    if (subSlug === "bano") return "/bebes-bano.jpg";
    if (subSlug === "otros") return "/bebes-otros.jpg";
  }

  if (categorySlug === "moda") {
    if (subSlug === "mujer") return "/moda-mujer.jpg";
    if (subSlug === "hombre") return "/moda-hombre.jpg";
    if (subSlug === "ninos") return "/moda-ninos.jpg";
    if (subSlug === "calzado") return "/moda-calzado.jpg";
    if (subSlug === "accesorios") return "/moda-accesorios.jpg";
    if (subSlug === "deportiva") return "/moda-deportiva.jpg";
    if (subSlug === "lujo") return "/moda-lujo.jpg";
    if (subSlug === "otros") return "/moda-otros.jpg";
  }

  return "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2070";
}

function getSectionTitle(slug: string) {
  if (slug === "motor") return "Elige lo que te mueve";
  if (slug === "inmobiliaria") return "Explora por tipo de inmueble";
  if (slug === "celulares") return "Explora por tipo de dispositivo";
  if (slug === "electrodomesticos")
    return "Explora por tipo de electrodoméstico";
  if (slug === "hogar") return "Explora por tipo de producto para el hogar";
  if (slug === "empleo") return "Explora oportunidades laborales";
  if (slug === "servicios") return "Explora por tipo de servicio";
  if (slug === "negocios") return "Explora oportunidades de negocio";
  if (slug === "informatica") return "Explora por tipo de equipo";
  if (slug === "imagen-sonido") return "Explora por tipo de equipo";
  if (slug === "juegos") return "Explora por tipo de producto gamer";
  if (slug === "formacion") return "Explora por tipo de formación";
  if (slug === "deportes") return "Explora por tipo de deporte";
  if (slug === "mascotas") return "Explora por tipo de mascota";
  if (slug === "bebes") return "Explora por tipo de producto para bebé";
  if (slug === "moda") return "Explora por estilo y tipo de prenda";
  return "Explora subcategorías";
}

function getResultsTitle(slug: string, label: string) {
  if (slug === "inmobiliaria") return `Propiedades destacadas en ${label}`;
  if (slug === "celulares") return "Celulares y accesorios destacados";
  if (slug === "electrodomesticos") return "Electrodomésticos destacados";
  if (slug === "hogar") return "Hogar destacado";
  if (slug === "empleo") return "Vacantes y perfiles destacados";
  if (slug === "servicios") return "Servicios destacados";
  if (slug === "negocios") return "Negocios y oportunidades destacadas";
  if (slug === "informatica") return "Tecnología destacada";
  if (slug === "imagen-sonido") return "Imagen y sonido destacados";
  if (slug === "juegos") return "Juegos y consolas destacados";
  if (slug === "formacion") return "Formación destacada";
  if (slug === "deportes") return "Artículos deportivos destacados";
  if (slug === "mascotas") return "Mascotas y accesorios destacados";
  if (slug === "bebes") return "Productos para bebés destacados";
  if (slug === "moda") return "Moda destacada";
  return `Lo más reciente en ${label}`;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const fallbackCategory =
    slug === "electrodomesticos"
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
            {
              slug: "aires-acondicionados",
              label: "Aires acondicionados",
              template: "PRODUCT" as const,
            },
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
            {
              slug: "muebles-de-hogar",
              label: "Muebles de hogar",
              template: "PRODUCT" as const,
            },
            { slug: "decoracion", label: "Decoración", template: "PRODUCT" as const },
            { slug: "colchones", label: "Colchones", template: "PRODUCT" as const },
            { slug: "iluminacion", label: "Iluminación", template: "PRODUCT" as const },
            { slug: "menaje", label: "Menaje", template: "PRODUCT" as const },
            { slug: "organizacion", label: "Organización", template: "PRODUCT" as const },
            {
              slug: "jardin-y-terraza",
              label: "Jardín y terraza",
              template: "PRODUCT" as const,
            },
            { slug: "otros", label: "Otros", template: "PRODUCT" as const },
          ],
        }
      : null;

  const category = CATEGORIES.find((c) => c.slug === slug) || fallbackCategory;

  if (!category) return notFound();

  const heroImage = getCategoryHeroImage(category.slug);
  const listings = await getListings({ categorySlug: category.slug, take: 12 });

  const sponsorListing =
    listings.find((item: any) => item?.isPremium) ||
    listings.find((item: any) => item?.isFeatured) ||
    null;

  const visibleListings = sponsorListing
    ? listings.filter((item: any) => item.id !== sponsorListing.id)
    : listings;

  const isRealEstate = category.slug === "inmobiliaria";
  const isCellphones = category.slug === "celulares";
  const isElectro = category.slug === "electrodomesticos";
  const isHome = category.slug === "hogar";
  const isEmployment = category.slug === "empleo";
  const isServices = category.slug === "servicios";
  const isBusiness = category.slug === "negocios";
  const isInformatics = category.slug === "informatica";
  const isImageSound = category.slug === "imagen-sonido";
  const isGames = category.slug === "juegos";
  const isFormation = category.slug === "formacion";
  const isSports = category.slug === "deportes";
  const isPets = category.slug === "mascotas";
  const isBabies = category.slug === "bebes";
  const isFashion = category.slug === "moda";

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <div className="mx-auto max-w-[1280px] px-4 pt-6 md:px-6">
        <div className="mb-4 flex items-center gap-3">
          <Link
            href="/"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            ← Inicio
          </Link>

          <BackButton className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50" />
        </div>
      </div>

      {heroImage ? (
        <div className="relative w-full overflow-hidden">
          <div className="relative h-[380px] md:h-[420px]">
            <img
              src={heroImage}
              alt={category.label}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div
              className={
                isRealEstate
                  ? "absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent"
                  : isCellphones
                  ? "absolute inset-0 bg-gradient-to-r from-[#071226]/90 via-[#0b2d61]/50 to-transparent"
                  : isElectro
                  ? "absolute inset-0 bg-gradient-to-r from-[#111827]/90 via-[#334155]/45 to-transparent"
                  : isHome
                  ? "absolute inset-0 bg-gradient-to-r from-[#2a1f16]/90 via-[#7c5a42]/40 to-transparent"
                  : isEmployment
                  ? "absolute inset-0 bg-gradient-to-r from-[#0a1f44]/90 via-[#123b7a]/50 to-transparent"
                  : isServices
                  ? "absolute inset-0 bg-gradient-to-r from-[#0b1f2a]/90 via-[#14506b]/45 to-transparent"
                  : isBusiness
                  ? "absolute inset-0 bg-gradient-to-r from-[#1b1028]/90 via-[#4b2a7a]/45 to-transparent"
                  : isInformatics
                  ? "absolute inset-0 bg-gradient-to-r from-[#07111f]/90 via-[#173b6d]/45 to-transparent"
                  : isImageSound
                  ? "absolute inset-0 bg-gradient-to-r from-[#180b2c]/90 via-[#5a2f91]/45 to-transparent"
                  : isGames
                  ? "absolute inset-0 bg-gradient-to-r from-[#0c1020]/90 via-[#283b7a]/45 to-transparent"
                  : isFormation
                  ? "absolute inset-0 bg-gradient-to-r from-[#102018]/90 via-[#2f7a57]/45 to-transparent"
                  : isSports
                  ? "absolute inset-0 bg-gradient-to-r from-[#0f1f14]/90 via-[#2d7a4b]/45 to-transparent"
                  : isPets
                  ? "absolute inset-0 bg-gradient-to-r from-[#1a1208]/90 via-[#8a5a2b]/45 to-transparent"
                  : isBabies
                  ? "absolute inset-0 bg-gradient-to-r from-[#2b1731]/90 via-[#c06aa1]/40 to-transparent"
                  : isFashion
                  ? "absolute inset-0 bg-gradient-to-r from-[#1a0e1d]/90 via-[#7a3f8f]/40 to-transparent"
                  : "absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"
              }
            />

            <div className="relative mx-auto flex h-full max-w-[1280px] items-end px-6 py-10 text-white md:px-8">
              <div className="max-w-3xl">
                <div className="text-xs uppercase tracking-[0.22em] text-white/70">
                  Categoría
                </div>

                <h1 className="mt-3 text-5xl font-black md:text-7xl">
                  {category.label}
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85 md:text-base">
                  {getCategoryDescription(category.slug, category.label)}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm font-black text-white backdrop-blur-md">
                    {listings.length} anuncios activos
                  </div>

                  <div className="inline-flex rounded-full border border-white/15 bg-white px-5 py-2 text-sm font-black text-slate-900">
                    Publicaciones reales
                  </div>

                  <div className="inline-flex rounded-full border border-white/15 bg-white px-5 py-2 text-sm font-black text-slate-900">
                    Cerca de ti
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-[1280px] px-4 pb-10 pt-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Subcategorías
              </div>
              <h2 className="mt-2 text-2xl font-black text-slate-900 md:text-3xl">
                {getSectionTitle(category.slug)}
              </h2>
            </div>

            <Link
              href={`/buscar?category=${category.slug}`}
              className="inline-flex items-center justify-center rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-200"
            >
              Ver todos
            </Link>
          </div>

          <div
            className={
              isRealEstate
                ? "mt-6 grid grid-cols-2 gap-4 md:grid-cols-2 xl:grid-cols-3"
                : isCellphones
                ? "mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-3"
                : isElectro
                ? "mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4"
                : isHome
                ? "mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4"
                : isEmployment
                ? "mt-6 grid grid-cols-2 gap-4 md:grid-cols-2 xl:grid-cols-2"
                : isServices
                ? "mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5"
                : isBusiness
                ? "mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5"
                : isInformatics
                ? "mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5"
                : isImageSound
                ? "mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5"
                : isGames
                ? "mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4"
                : isFormation
                ? "mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5"
                : isSports
                ? "mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5"
                : isPets
                ? "mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5"
                : isBabies
                ? "mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4"
                : isFashion
                ? "mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4"
                : "mt-6 grid gap-4 md:grid-cols-3"
            }
          >
            {category.subcategories.map((sub) => (
              <Link
                key={sub.slug}
                href={`/categoria/${category.slug}/${sub.slug}`}
                className={
                  isRealEstate ||
                  isCellphones ||
                  isElectro ||
                  isHome ||
                  isEmployment ||
                  isServices ||
                  isBusiness ||
                  isInformatics ||
                  isImageSound ||
                  isGames ||
                  isFormation ||
                  isSports ||
                  isPets ||
                  isBabies ||
                  isFashion
                    ? "group rounded-[22px] border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    : "group relative overflow-hidden rounded-2xl"
                }
              >
                {isRealEstate ||
                isCellphones ||
                isElectro ||
                isHome ||
                isEmployment ||
                isServices ||
                isBusiness ||
                isInformatics ||
                isImageSound ||
                isGames ||
                isFormation ||
                isSports ||
                isPets ||
                isBabies ||
                isFashion ? (
                  <>
                    <div className="overflow-hidden rounded-2xl">
                      <img
                        src={getSubcategoryImage(category.slug, sub.slug)}
                        alt={sub.label}
                        className="h-[120px] w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-base font-black text-slate-900">
                          {sub.label}
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                          Ver anuncios
                        </div>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition group-hover:bg-[#0f3c8c] group-hover:text-white">
                        <ChevronRight className="h-5 w-5" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={getSubcategoryImage(category.slug, sub.slug)}
                      className="h-[220px] w-full object-cover transition duration-500 group-hover:scale-110"
                      alt={sub.label}
                    />

                    <div className="absolute inset-0 bg-black/40" />

                    <div className="absolute bottom-0 p-5 text-white">
                      <div className="text-xl font-black">{sub.label}</div>
                      <div className="mt-2 text-sm text-white/80">
                        Ver anuncios
                      </div>
                    </div>

                    <div className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white backdrop-blur">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </>
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Anuncios destacados
              </div>
              <h2 className="mt-2 text-2xl font-black text-slate-900 md:text-3xl">
                {getResultsTitle(category.slug, category.label)}
              </h2>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Explora publicaciones reales dentro de esta categoría.
              </p>
            </div>

            <div className="inline-flex rounded-2xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700">
              {listings.length} resultado{listings.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="mt-6">
            {sponsorListing ? (
              <Link
                href={`/listing/${sponsorListing.id}`}
                className="mb-6 grid overflow-hidden rounded-[28px] border border-yellow-200 bg-gradient-to-br from-yellow-50 to-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md lg:grid-cols-[1.05fr_0.95fr]"
              >
                <div className="relative min-h-[260px] overflow-hidden bg-slate-100">
                  <img
                    src={sponsorListing.imageUrl || "/placeholders/listing.jpg"}
                    alt={sponsorListing.title || "Anuncio patrocinado"}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />

                  <div className="absolute left-4 top-4 rounded-full bg-yellow-400 px-4 py-2 text-xs font-black uppercase text-white shadow">
                    ⭐ Premium
                  </div>

                  <div className="absolute bottom-4 left-4 rounded-full bg-black/65 px-4 py-2 text-xs font-black text-white backdrop-blur">
                    Patrocinado
                  </div>
                </div>

                <div className="flex flex-col justify-center p-6">
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-yellow-600">
                    Anuncio destacado
                  </div>

                  <h3 className="mt-2 text-3xl font-black text-slate-900">
                    {sponsorListing.title}
                  </h3>

                  <p className="mt-2 text-sm font-bold text-slate-500">
                    {sponsorListing.city}
                  </p>

                  <div className="mt-5 text-3xl font-black text-[#0f3c8c]">
                    {sponsorListing.price
                      ? new Intl.NumberFormat("es-CO", {
                          style: "currency",
                          currency: sponsorListing.currency ?? "COP",
                          maximumFractionDigits: 0,
                        }).format(Number(sponsorListing.price))
                      : "Consultar precio"}
                  </div>

                  <div className="mt-6 inline-flex w-fit rounded-2xl bg-[#0f3c8c] px-5 py-3 text-sm font-black text-white">
                    Ver anuncio
                  </div>
                </div>
              </Link>
            ) : null}

            {listings.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                <div className="text-xl font-black text-slate-900">
                  Aún no hay anuncios en esta categoría
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Todavía no hay publicaciones en {category.label.toLowerCase()}.
                  Puedes explorar otra sección o publicar el primer anuncio.
                </p>

                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    href="/"
                    className="inline-flex h-11 items-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 hover:bg-slate-50"
                  >
                    Volver al inicio
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
              <HomeListingsClient
                initialListings={visibleListings}
                variant="category"
                categorySlug={slug}
                title={
                  isRealEstate
                    ? "Propiedades destacadas"
                    : isCellphones
                    ? "Celulares destacados"
                    : isElectro
                    ? "Electrodomésticos destacados"
                    : isHome
                    ? "Hogar destacado"
                    : isEmployment
                    ? "Oportunidades destacadas"
                    : isServices
                    ? "Servicios destacados"
                    : isBusiness
                    ? "Negocios destacados"
                    : isInformatics
                    ? "Equipos destacados"
                    : isImageSound
                    ? "Equipos destacados"
                    : isGames
                    ? "Juegos destacados"
                    : isFormation
                    ? "Formación destacada"
                    : isSports
                    ? "Deportes destacados"
                    : isPets
                    ? "Mascotas destacadas"
                    : isBabies
                    ? "Bebés destacados"
                    : isFashion
                    ? "Moda destacada"
                    : `Resultados en ${category.label}`
                }
                subtitle={
                  isRealEstate
                    ? "Explora opciones recientes y oportunidades cerca de ti."
                    : isCellphones
                    ? "Descubre celulares, repuestos y equipos publicados por la comunidad."
                    : isElectro
                    ? "Descubre neveras, lavadoras, cocinas, microondas, equipos industriales y otros electrodomésticos publicados por la comunidad."
                    : isHome
                    ? "Descubre muebles de hogar, decoración, colchones, iluminación y más productos para tus espacios publicados por la comunidad."
                    : isEmployment
                    ? "Explora vacantes y perfiles publicados por la comunidad."
                    : isServices
                    ? "Descubre servicios útiles publicados por la comunidad y negocios locales."
                    : isBusiness
                    ? "Explora oportunidades de inversión, traspasos y negocios publicados por la comunidad."
                    : isInformatics
                    ? "Descubre tecnología publicada por la comunidad, desde laptops hasta componentes y accesorios."
                    : isImageSound
                    ? "Descubre televisores, audio, cámaras, video e instrumentos publicados por la comunidad."
                    : isGames
                    ? "Descubre consolas, videojuegos y accesorios publicados por la comunidad."
                    : isFormation
                    ? "Descubre cursos, clases e instituciones publicadas por la comunidad."
                    : isSports
                    ? "Descubre equipos, bicicletas, ropa deportiva y artículos fitness publicados por la comunidad."
                    : isPets
                    ? "Descubre perros, gatos, aves, peces, roedores y accesorios publicados por la comunidad."
                    : isBabies
                    ? "Descubre coches, cunas, ropa, juguetes y accesorios para bebés publicados por la comunidad."
                    : isFashion
                    ? "Descubre ropa, calzado, accesorios y prendas publicadas por la comunidad."
                    : `Explora publicaciones reales dentro de ${category.label.toLowerCase()}.`
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}