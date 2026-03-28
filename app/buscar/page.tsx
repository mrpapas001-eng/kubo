import { prisma } from "@/lib/db";
import ListingCard from "@/components/ListingCard";
import Link from "next/link";

type Props = {
  searchParams?: {
    q?: string;
    city?: string;
    category?: string;
  };
};

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
];

export default async function BuscarPage({ searchParams }: Props) {
  const params = searchParams ?? {};

  const q = String(params.q ?? "").trim().toLowerCase();
  const city = String(params.city ?? "").trim();
  const category = String(params.category ?? "").trim();

  const normalizedCity = city.toLowerCase();
  const normalizedCategory = category.toLowerCase();

  const allListings = await prisma.listing.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: 300,
  });

  const listings = allListings.filter((item: any) => {
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
    if (
      normalizedCity &&
      String(item.city ?? "").trim().toLowerCase() !== normalizedCity
    )
      return false;
    if (
      normalizedCategory &&
      String(item.categorySlug ?? "").trim().toLowerCase() !== normalizedCategory
    )
      return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-6 py-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-slate-900">
            Resultados de búsqueda
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-500">
            {q ? (
              <>
                Buscando:{" "}
                <span className="font-bold text-slate-800">“{q}”</span>
              </>
            ) : (
              "Explora los anuncios disponibles."
            )}
          </p>
        </div>

        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <form className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="text-sm font-bold text-slate-700">
                Qué buscas
              </label>
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Ej: Mazda, apartamento, iPhone..."
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">Ciudad</label>
              <select
                name="city"
                defaultValue={city}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
              >
                <option value="">Todas</option>
                {CITIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Categoría
              </label>
              <select
                name="category"
                defaultValue={category}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
              >
                <option value="">Todas</option>
                {CATEGORY_OPTIONS.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-3">
              <button
                type="submit"
                className="h-11 rounded-xl bg-[#0f3c8c] px-5 text-sm font-bold text-white hover:bg-[#0c2f6d]"
              >
                Filtrar
              </button>

              <Link
                href="/buscar"
                className="flex h-11 items-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Limpiar
              </Link>
            </div>
          </form>
        </div>

        {listings.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <div className="text-lg font-bold text-slate-800">
              No encontramos anuncios
            </div>
            <p className="mt-2 text-slate-500">
              Intenta con otra búsqueda o cambia los filtros.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm font-medium text-slate-500">
              {listings.length} resultado{listings.length === 1 ? "" : "s"}{" "}
              encontrado{listings.length === 1 ? "" : "s"}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {listings.map((item) => (
                <ListingCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}