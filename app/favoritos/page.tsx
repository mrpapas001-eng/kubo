import Link from "next/link";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import ListingCard from "@/components/ListingCard";

export default async function FavoritosPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] px-6 pb-28 pt-10 md:py-10">
        <div className="mx-auto max-w-[1100px] rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-black text-slate-900">Mis favoritos</h1>
          <p className="mt-4 text-slate-500">
            Debes iniciar sesion para ver tus favoritos.
          </p>
        </div>
      </div>
    );
  }

  const favorites = await prisma.favorite.findMany({
    where: {
      userEmail: session.user.email,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const listingIds = favorites.map((f) => f.listingId);

  const listings = listingIds.length
    ? await prisma.listing.findMany({
        where: {
          id: { in: listingIds },
          status: "active",
        },
      })
    : [];

  const orderedListings = listingIds
    .map((id) => listings.find((item) => item.id === id))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-6 pb-28 pt-10 md:py-10">
      <div className="mx-auto max-w-[1100px]">
        <h1 className="text-3xl font-black text-slate-900">Mis favoritos</h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Guarda anuncios para revisarlos con calma mas tarde.
        </p>

        {orderedListings.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="text-xl font-black text-slate-900">
              Aun no tienes favoritos
            </div>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
              Cuando guardes un anuncio, aparecera aqui para que puedas volver
              rapido a verlo.
            </p>
            <Link
              href="/buscar"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-[#0f3c8c] px-5 text-sm font-black text-white hover:bg-[#0c2f6d]"
            >
              Buscar anuncios
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {orderedListings.map((item: any) => (
              <ListingCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
