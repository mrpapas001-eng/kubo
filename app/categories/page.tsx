import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ListingDetail({ params }: PageProps) {
  const { id } = await params;

  if (!id) return notFound();

  const listing = await prisma.listing.findUnique({
    where: { id },
  });

  if (!listing) return notFound();

  const image = listing.imageUrl ?? "/placeholders/listing.jpg";

  const formattedPrice =
    typeof listing.price === "number"
      ? new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: listing.currency ?? "COP",
          maximumFractionDigits: 0,
        }).format(listing.price)
      : String(listing.price ?? "");

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <main className="max-w-[1000px] mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="h-[420px] w-full overflow-hidden">
            <img
              src={image}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8">
            <h1 className="text-4xl font-black text-slate-900">
              {listing.title}
            </h1>
            <p className="text-slate-500 mt-2 font-medium">{listing.city}</p>

            <div className="mt-6 text-3xl font-black text-slate-900">
              {formattedPrice}
            </div>

            <p className="mt-6 text-slate-700 leading-relaxed">
              {listing.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {listing.categorySlug ? (
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase">
                  {listing.categorySlug}
                </span>
              ) : null}

              {listing.subcategorySlug ? (
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase">
                  {listing.subcategorySlug}
                </span>
              ) : null}

              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase">
                {listing.sellerType === "PARTICULAR"
                  ? "Particular"
                  : "Empresa verificada"}
              </span>
            </div>

            <div className="mt-8">
              <a
                href="/"
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-slate-900"
              >
                ← Volver a la home
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}