import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import ListingCard from "@/components/ListingCard";

export default async function FavoritosPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] px-6 py-10">
        <div className="mx-auto max-w-[1100px] rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-black text-slate-900">Mis favoritos</h1>
          <p className="mt-4 text-slate-500">
            Debes iniciar sesión para ver tus favoritos.
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
        },
      })
    : [];

  const orderedListings = listingIds
    .map((id) => listings.find((item) => item.id === id))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-6 py-10">
      <div className="mx-auto max-w-[1100px]">
        <h1 className="text-3xl font-black text-slate-900">Mis favoritos</h1>

        {orderedListings.length === 0 ? (
          <p className="mt-6 text-slate-500">
            Aún no has guardado anuncios en favoritos.
          </p>
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