import { prisma } from "@/lib/db";
import ListingCard from "@/components/ListingCard";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

const CATEGORY_LABELS: Record<string, string> = {
  motor: "Motor",
  inmobiliaria: "Inmobiliaria",
  celulares: "Celulares",
  empleo: "Empleo",
  servicios: "Servicios",
  negocios: "Negocios",
  informatica: "Informática",
  "imagen-sonido": "Imagen y sonido",
  juegos: "Juegos",
  formacion: "Formación y libros",
  deportes: "Deportes",
  mascotas: "Mascotas",
  bebes: "Bebés",
  moda: "Moda y complementos",
};

export default async function CategoriaPage({ params }: Props) {
  const { slug } = await params;

  const categoryTitle = CATEGORY_LABELS[slug];

  if (!categoryTitle) {
    return notFound();
  }

  const listings = await prisma.listing.findMany({
    where: {
      categorySlug: slug,
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: 50,
  });

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-6 py-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-slate-900">
            {categoryTitle}
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-500">
            Explora anuncios publicados en la categoría {categoryTitle}.
          </p>
        </div>

        {listings.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <div className="text-lg font-bold text-slate-800">
              No hay anuncios en esta categoría
            </div>
            <p className="mt-2 text-slate-500">
              Aún no se han publicado anuncios en {categoryTitle}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((item) => (
              <ListingCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}