import { prisma } from "@/lib/db";
import { attachAccountVerification } from "@/lib/accountVerification";
import ListingCard from "@/components/ListingCard";
import Link from "next/link";
import {
  Search,
  MapPin,
  X,
  ArrowLeft,
  Sparkles,
  Car,
  Home,
  Smartphone,
  Briefcase,
  Wrench,
  Grid3X3,
  Camera,
  Gamepad2,
} from "lucide-react";
import BackButton from "@/components/BackButton";

type Props = {
  searchParams?: Promise<{
    q?: string;
    city?: string;
    category?: string;
    sort?: string;
    min?: string;
    max?: string;
    page?: string;
  }>;
};

const ITEMS_PER_PAGE = 24;

const CITIES = [
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
];

const CATEGORY_OPTIONS = [
  { slug: "motor", label: "Motor" },
  { slug: "inmobiliaria", label: "Inmobiliaria" },
  { slug: "celulares", label: "Celulares" },
  { slug: "electrodomesticos", label: "Electrodomésticos" },
  { slug: "hogar", label: "Hogar" },
  { slug: "empleo", label: "Empleo" },
  { slug: "servicios", label: "Servicios" },
  { slug: "negocios", label: "Negocios" },
  { slug: "informatica", label: "Informática" },
  { slug: "imagen-sonido", label: "Imagen y sonido" },
  { slug: "juegos", label: "Juegos" },
  { slug: "formacion", label: "Formación y libros" },
  { slug: "deportes", label: "Deportes" },
  { slug: "mascotas", label: "Mascotas" },
  { slug: "bebes", label: "Bebés" },
  { slug: "moda", label: "Moda y complementos" },
  { slug: "juguetes", label: "Juguetes" },
  { slug: "papeleria-oficina", label: "Papelería y Oficina" },
  { slug: "herramientas-ferreteria", label: "Herramientas y Ferretería" },
  { slug: "salud-belleza", label: "Salud y Belleza" },
];

const QUICK_CATEGORIES = [
  { slug: "", label: "Todas", icon: Grid3X3 },
  { slug: "motor", label: "Motor", icon: Car },
  { slug: "inmobiliaria", label: "Inmobiliaria", icon: Home },
  { slug: "celulares", label: "Celulares", icon: Smartphone },
  { slug: "electrodomesticos", label: "Electrodomésticos", icon: Camera },
  { slug: "empleo", label: "Empleo", icon: Briefcase },
  { slug: "servicios", label: "Servicios", icon: Wrench },
  { slug: "juegos", label: "Juegos", icon: Gamepad2 },
];

function getCategoryLabel(slug: string) {
  return CATEGORY_OPTIONS.find((item) => item.slug === slug)?.label || slug;
}

export default async function BuscarPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};

  const q = String(params.q ?? "").trim().toLowerCase();
  const city = String(params.city ?? "").trim();
  const category = String(params.category ?? "").trim();
  const sort = String(params.sort ?? "recent").trim();
  const min = Number(params.min ?? 0);
  const max = Number(params.max ?? 0);
  const currentPage = Math.max(1, Number(params.page ?? 1) || 1);

  const normalizedCity = city.toLowerCase();
  const normalizedCategory = category.toLowerCase();

  function buildPageHref(page: number) {
    const search = new URLSearchParams();

    if (q) search.set("q", q);
    if (city) search.set("city", city);
    if (category) search.set("category", category);
    if (sort && sort !== "recent") search.set("sort", sort);
    if (min) search.set("min", String(min));
    if (max) search.set("max", String(max));
    if (page > 1) search.set("page", String(page));

    const query = search.toString();
    return query ? `/buscar?${query}` : "/buscar";
  }

  const rawListings = await prisma.listing.findMany({
    where: {
      status: "active",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 300,
  });
  const listingsWithVerification = await attachAccountVerification(rawListings);

  const now = new Date();

  const allListings = listingsWithVerification.map((item: any) => {
    const isPremiumActive =
      item.isPremium &&
      item.premiumUntil &&
      new Date(item.premiumUntil).getTime() > now.getTime();

    const isFeaturedActive =
      item.isFeatured &&
      item.featuredUntil &&
      new Date(item.featuredUntil).getTime() > now.getTime();

    return {
      ...item,
      isPremium: isPremiumActive,
      isFeatured: isFeaturedActive,
    };
  });

  let listings = allListings.filter((item: any) => {
    let details: any = {};

    try {
      details =
        typeof item.details === "string"
          ? JSON.parse(item.details)
          : item.details ?? {};
    } catch {
      details = {};
    }

    const haystack = [
      item.title,
      item.description,
      item.city,
      item.categorySlug,
      item.subcategorySlug,
      details?.motor?.brand,
      details?.motor?.model,
      details?.cellphone?.brand,
      details?.cellphone?.model,
      details?.realEstate?.deal,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (q && !haystack.includes(q)) return false;

    const price = Number(item.price || 0);

    if (min && price < min) return false;
    if (max && price > max) return false;

    if (
      normalizedCity &&
      String(item.city ?? "").trim().toLowerCase() !== normalizedCity
    ) {
      return false;
    }

    if (
      normalizedCategory &&
      String(item.categorySlug ?? "").trim().toLowerCase() !==
        normalizedCategory
    ) {
      return false;
    }

    return true;
  });

  listings = [...listings].sort((a: any, b: any) => {
    if (a.isPremium !== b.isPremium) return a.isPremium ? -1 : 1;
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;

    if (sort === "price_asc") {
      return Number(a.price || 0) - Number(b.price || 0);
    }

    if (sort === "price_desc") {
      return Number(b.price || 0) - Number(a.price || 0);
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalListings = listings.length;
  const totalPages = Math.max(1, Math.ceil(totalListings / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedListings = listings.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const hasPrevPage = safeCurrentPage > 1;
  const hasNextPage = safeCurrentPage < totalPages;

  const hasFilters = Boolean(q || city || category || min || max);

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-slate-900">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_18%_0%,rgba(37,99,235,0.14),transparent_32%),radial-gradient(circle_at_88%_6%,rgba(124,58,237,0.14),transparent_32%),linear-gradient(to_bottom,#ffffff,#f2f7ff_58%,#f5f7fb)]" />

        <div className="relative mx-auto max-w-[1440px] px-4 pb-28 pt-5 md:px-6 md:pb-5 lg:px-8">
          <div className="mb-5 flex items-center gap-3">
            <Link
              href="/"
              className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 md:inline-flex"
            >
              <ArrowLeft className="h-4 w-4" />
              Inicio
            </Link>

            <BackButton className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50" />
          </div>

          <section className="relative overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.10)]">
            <img
              src="/hero-home.jpg"
              alt="Kubo búsqueda"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.99)_0%,rgba(255,255,255,0.94)_46%,rgba(255,255,255,0.34)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_46%,rgba(37,99,235,0.22),transparent_32%),radial-gradient(circle_at_89%_74%,rgba(124,58,237,0.22),transparent_29%)]" />

            <div className="pointer-events-none absolute right-[9%] top-16 hidden lg:block">
              <div className="relative h-[260px] w-[430px]">
                <div className="absolute bottom-0 left-10 h-28 w-72 rounded-[50%] bg-gradient-to-r from-blue-500/25 to-violet-500/25 blur-xl" />

                <div className="absolute left-5 top-10 rotate-[-10deg] rounded-[28px] bg-white/90 p-4 shadow-[0_24px_55px_rgba(15,23,42,0.18)]">
                  <Smartphone className="h-12 w-12 text-[#0f3c8c]" />
                </div>

                <div className="absolute right-16 top-2 rotate-[10deg] rounded-[28px] bg-white/90 p-4 shadow-[0_24px_55px_rgba(15,23,42,0.18)]">
                  <Camera className="h-12 w-12 text-violet-500" />
                </div>

                <div className="absolute bottom-5 left-20 rounded-[32px] bg-white p-5 shadow-[0_30px_70px_rgba(15,23,42,0.20)]">
                  <Car className="h-24 w-24 text-[#0f3c8c]" />
                </div>

                <div className="absolute bottom-12 right-0 rotate-[7deg] rounded-[28px] bg-white/95 p-4 shadow-[0_24px_55px_rgba(15,23,42,0.18)]">
                  <Gamepad2 className="h-14 w-14 text-blue-500" />
                </div>

                <div className="absolute bottom-[-10px] right-20 rounded-full bg-gradient-to-br from-[#0f3c8c] to-violet-500 px-6 py-5 text-white shadow-[0_24px_60px_rgba(15,60,140,0.28)]">
                  <div className="text-2xl font-black">+12K</div>
                  <div className="text-xs font-bold text-white/80">
                    anuncios activos
                  </div>
                </div>
              </div>
            </div>

            <div className="relative px-5 py-6 md:px-12 md:py-12 lg:px-14 lg:py-14">
              <div className="max-w-[720px]">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#0f3c8c] md:px-4 md:py-2 md:text-[11px] md:tracking-[0.18em]">
                  <Sparkles className="h-3.5 w-3.5" />
                  El lugar para comprar, vender y encontrar
                </div>

                <h1 className="mt-4 text-3xl font-black leading-[1.04] tracking-[-0.04em] text-slate-950 md:mt-5 md:text-6xl md:tracking-[-0.05em] lg:text-[68px]">
                  Encuentra lo que buscas,{" "}
                  <span className="bg-gradient-to-r from-[#0f3c8c] via-blue-500 to-violet-500 bg-clip-text text-transparent">
                    cerca de ti
                  </span>
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 md:mt-5 md:text-base md:leading-8">
                  Miles de anuncios reales en Pereira y toda Colombia. Fácil,
                  rápido y seguro.
                </p>

                <form className="mt-5 max-w-[880px] overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_22px_55px_rgba(15,23,42,0.13)] md:mt-8 lg:w-[900px]">
                  <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr_0.7fr_0.7fr_auto]">
                    <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5 md:border-b-0 md:border-r">
                      <Search className="h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        name="q"
                        defaultValue={q}
                        placeholder="¿Qué estás buscando?"
                        className="h-full w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                      />
                    </div>

                    <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5 md:border-b-0 md:border-r">
                      <select
                        name="category"
                        defaultValue={category}
                        className="h-full w-full bg-transparent text-sm font-semibold text-slate-800 outline-none"
                      >
                        <option value="">Todas las categorías</option>
                        {CATEGORY_OPTIONS.map((item) => (
                          <option key={item.slug} value={item.slug}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5 md:border-b-0 md:border-r">
                      <MapPin className="h-5 w-5 text-slate-400" />
                      <select
                        name="city"
                        defaultValue={city}
                        className="h-full w-full bg-transparent text-sm font-semibold text-slate-800 outline-none"
                      >
                        <option value="">Todas las ciudades</option>
                        {CITIES.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-4 md:border-b-0 md:border-r">
                      <input
                        type="number"
                        name="min"
                        defaultValue={min || ""}
                        placeholder="Precio mín"
                        className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                      />
                    </div>

                    <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-4 md:border-b-0 md:border-r">
                      <input
                        type="number"
                        name="max"
                        defaultValue={max || ""}
                        placeholder="Precio máx"
                        className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                      />
                    </div>

                    <div className="flex items-center gap-2 p-3">
                      <button
                        type="submit"
                        className="h-12 rounded-2xl bg-gradient-to-r from-[#0f3c8c] to-violet-500 px-8 text-sm font-black text-white shadow-[0_14px_30px_rgba(15,60,140,0.26)] transition hover:scale-[1.01]"
                      >
                        Buscar
                      </button>

                      {hasFilters ? (
                        <Link
                          href="/buscar"
                          className="flex h-12 items-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                        >
                          <X className="h-4 w-4" />
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </form>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">
                    <Search className="h-4 w-4 text-slate-400" />
                    Búsquedas populares:
                  </span>

                  <Link
                    href="/buscar?q=iphone"
                    className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-white"
                  >
                    iPhone
                  </Link>
                  <Link
                    href="/buscar?category=inmobiliaria"
                    className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-white"
                  >
                    Apartamento
                  </Link>
                  <Link
                    href="/buscar?category=motor"
                    className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-white"
                  >
                    Moto
                  </Link>
                  <Link
                    href="/buscar?category=empleo"
                    className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-white"
                  >
                    Empleo
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-950">
                Explora por categorías
              </h2>

              <Link
                href="/categorias"
                className="text-sm font-black text-[#0f3c8c]"
              >
                Ver todas
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
              {QUICK_CATEGORIES.map((item) => {
                const Icon = item.icon;
                const active = category === item.slug;

                return (
                  <Link
                    key={item.label}
                    href={item.slug ? `/buscar?category=${item.slug}` : "/buscar"}
                    className={`flex min-h-[104px] flex-col items-center justify-center rounded-2xl border bg-white px-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                      active
                        ? "border-[#0f3c8c] text-[#0f3c8c]"
                        : "border-slate-200 text-slate-700"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="mt-3 text-sm font-black">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="mt-9">
            {totalListings === 0 ? (
              <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-sm">
                <div className="text-lg font-black text-slate-800">
                  No encontramos anuncios
                </div>
                <p className="mt-2 text-slate-500">
                  Intenta con otra búsqueda o cambia los filtros.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      <Sparkles className="h-4 w-4 text-amber-400" />
                      Resultados de búsqueda
                    </div>

                    <h2 className="mt-1 text-2xl font-black text-slate-950 md:text-3xl">
                      {totalListings} anuncio
                      {totalListings === 1 ? "" : "s"} encontrado
                      {totalListings === 1 ? "" : "s"}
                    </h2>

                    {hasFilters ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {q ? (
                          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-bold text-[#0f3c8c]">
                            {q}
                          </span>
                        ) : null}

                        {city ? (
                          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-700">
                            {city}
                          </span>
                        ) : null}

                        {category ? (
                          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-700">
                            {getCategoryLabel(category)}
                          </span>
                        ) : null}

                        {min ? (
                          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-700">
                            Desde ${min.toLocaleString("es-CO")}
                          </span>
                        ) : null}

                        {max ? (
                          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-bold text-slate-700">
                            Hasta ${max.toLocaleString("es-CO")}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>

                  <form className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                    <input type="hidden" name="q" value={q} />
                    <input type="hidden" name="city" value={city} />
                    <input type="hidden" name="category" value={category} />
                    <input type="hidden" name="min" value={min || ""} />
                    <input type="hidden" name="max" value={max || ""} />

                    <select
                      name="sort"
                      defaultValue={sort}
                      className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none"
                    >
                      <option value="recent">Más recientes</option>
                      <option value="price_asc">Precio: menor a mayor</option>
                      <option value="price_desc">Precio: mayor a menor</option>
                    </select>

                    <button
                      type="submit"
                      className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-black text-white transition hover:bg-slate-700"
                    >
                      Aplicar
                    </button>
                  </form>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {paginatedListings.map((item) => (
                    <ListingCard key={item.id} item={item} />
                  ))}
                </div>

                {totalPages > 1 ? (
                  <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row">
                    <div className="text-sm font-bold text-slate-600">
                      Página {safeCurrentPage} de {totalPages}
                    </div>

                    <div className="flex items-center gap-3">
                      {hasPrevPage ? (
                        <Link
                          href={buildPageHref(safeCurrentPage - 1)}
                          className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                        >
                          Anterior
                        </Link>
                      ) : (
                        <span className="cursor-not-allowed rounded-2xl border border-slate-100 bg-slate-50 px-5 py-3 text-sm font-black text-slate-300">
                          Anterior
                        </span>
                      )}

                      {hasNextPage ? (
                        <Link
                          href={buildPageHref(safeCurrentPage + 1)}
                          className="rounded-2xl bg-[#0f3c8c] px-5 py-3 text-sm font-black text-white transition hover:bg-blue-800"
                        >
                          Siguiente
                        </Link>
                      ) : (
                        <span className="cursor-not-allowed rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-300">
                          Siguiente
                        </span>
                      )}
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
