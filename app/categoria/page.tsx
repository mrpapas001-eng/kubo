import Link from "next/link";
import {
  Car,
  Home,
  Smartphone,
  Briefcase,
  Wrench,
  BarChart3,
  Laptop,
  GraduationCap,
  Dumbbell,
  PawPrint,
  Baby,
  Shirt,
  Tv,
  Gamepad2,
  ChevronRight,
} from "lucide-react";
import { CATEGORIES } from "@/data/categories";

type IconType = React.ComponentType<{ className?: string }>;

function getCategoryIcon(slug: string): IconType {
  if (slug === "motor") return Car;
  if (slug === "inmobiliaria") return Home;
  if (slug === "celulares") return Smartphone;
  if (slug === "empleo") return Briefcase;
  if (slug === "servicios") return Wrench;
  if (slug === "negocios") return BarChart3;
  if (slug === "informatica") return Laptop;
  if (slug === "formacion") return GraduationCap;
  if (slug === "deportes") return Dumbbell;
  if (slug === "mascotas") return PawPrint;
  if (slug === "bebes") return Baby;
  if (slug === "moda") return Shirt;
  if (slug === "imagen-sonido") return Tv;
  if (slug === "juegos") return Gamepad2;
  return ChevronRight;
}

function getCategoryDescription(slug: string, label: string) {
  if (slug === "motor") {
    return "Carros, motos y repuestos para comprar y vender cerca de ti.";
  }

  if (slug === "inmobiliaria") {
    return "Casas, apartamentos, lotes y más opciones inmobiliarias.";
  }

  if (slug === "celulares") {
    return "Celulares, repuestos y equipos para hogar u oficina.";
  }

  if (slug === "empleo") {
    return "Vacantes y perfiles para conectar talento y oportunidades.";
  }

  if (slug === "servicios") {
    return "Servicios para hogar, personas, empresas, motor y bicicleta.";
  }

  if (slug === "negocios") {
    return "Venta, traspasos, franquicias y oportunidades de inversión.";
  }

  if (slug === "informatica") {
    return "Laptops, PCs, componentes, periféricos e impresoras.";
  }

  if (slug === "formacion") {
    return "Cursos, idiomas y formación para crecer profesionalmente.";
  }

  if (slug === "deportes") {
    return "Bicicletas, equipos, ropa deportiva y artículos fitness.";
  }

  if (slug === "mascotas") {
    return "Mascotas, accesorios y productos para su cuidado.";
  }

  if (slug === "bebes") {
    return "Coches, cunas, ropa, juguetes y accesorios para bebé.";
  }

  if (slug === "moda") {
    return "Ropa, calzado y accesorios para mujer, hombre y niños.";
  }

  if (slug === "imagen-sonido") {
    return "Televisores, audio, cámaras, video e instrumentos.";
  }

  if (slug === "juegos") {
    return "Consolas, videojuegos, accesorios y productos gamer.";
  }

  return `Explora anuncios en ${label.toLowerCase()} con una experiencia clara y visual.`;
}

function getCategoryImage(slug: string) {
  if (slug === "motor") return "/hilux.jpg";
  if (slug === "inmobiliaria") return "/inmobiliaria-hero.jpg";
  if (slug === "celulares") return "/celulares-hero.jpg";
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
  return "/hero-home.jpg";
}

const EXTRA_CATEGORIES = [
  {
    slug: "imagen-sonido",
    label: "Imagen y sonido",
    subcategories: [
      { slug: "televisores", label: "Televisores" },
      { slug: "audio", label: "Audio" },
      { slug: "camaras", label: "Cámaras" },
      { slug: "video", label: "Video" },
      { slug: "accesorios", label: "Accesorios" },
      { slug: "instrumentos", label: "Instrumentos" },
      { slug: "otros", label: "Otros" },
    ],
  },
  {
    slug: "juegos",
    label: "Juegos",
    subcategories: [
      { slug: "consolas", label: "Consolas" },
      { slug: "videojuegos", label: "Videojuegos" },
      { slug: "accesorios", label: "Accesorios" },
      { slug: "otros", label: "Otros" },
    ],
  },
];

const ALL_CATEGORIES = [...CATEGORIES, ...EXTRA_CATEGORIES];

export default function CategoriaPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] text-slate-900">
      <div className="mx-auto max-w-[1280px] px-4 py-10 md:px-6 lg:px-8">
        <div className="mb-4 flex items-center gap-3">
          <Link
            href="/"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            ← Inicio
          </Link>
        </div>

        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="relative min-h-[260px] md:min-h-[320px]">
            <img
              src="/hero-home.jpg"
              alt="Todas las categorías"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,31,74,0.88)_0%,rgba(11,49,112,0.68)_45%,rgba(8,31,74,0.22)_100%)]" />

            <div className="relative px-6 py-10 text-white md:px-10 md:py-12">
              <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white/90 backdrop-blur-md">
                Explora Kubo
              </div>

              <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
                Todas las categorías
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85 md:text-base">
                Encuentra lo que buscas navegando por categorías y subcategorías.
                Explora anuncios reales publicados por la comunidad cerca de ti.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {ALL_CATEGORIES.map((category) => {
            const Icon = getCategoryIcon(category.slug);

            return (
              <div
                key={category.slug}
                className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <Link
                  href={`/categoria/${category.slug}`}
                  className="group block"
                >
                  <div className="relative h-[180px] overflow-hidden">
                    <img
                      src={getCategoryImage(category.slug)}
                      alt={category.label}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 shadow-sm">
                      <Icon className="h-6 w-6 text-[#0f3c8c]" />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <h2 className="text-2xl font-black">{category.label}</h2>
                      <p className="mt-2 max-w-sm text-sm leading-6 text-white/85">
                        {getCategoryDescription(category.slug, category.label)}
                      </p>
                    </div>
                  </div>
                </Link>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      href={`/categoria/${category.slug}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-200"
                    >
                      Ver categoría
                      <ChevronRight className="h-4 w-4" />
                    </Link>

                    <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      {category.subcategories.length} subcategorías
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {category.subcategories.slice(0, 6).map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/categoria/${category.slug}/${sub.slug}`}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100"
                      >
                        {sub.label}
                      </Link>
                    ))}

                    {category.subcategories.length > 6 ? (
                      <Link
                        href={`/categoria/${category.slug}`}
                        className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#0f3c8c] transition hover:bg-slate-50"
                      >
                        +{category.subcategories.length - 6} más
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}