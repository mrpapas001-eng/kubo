// app/mis-anuncios/page.tsx
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import ListingCard from "@/components/ListingCard";

export default async function MisAnunciosPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-bold">Debes iniciar sesión</p>
      </div>
    );
  }

  // Traemos todos los anuncios (ordenados por fecha)
  const allListings = await prisma.listing.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Normalizamos el e-mail del usuario (minúsculas y sin espacios)
  const myEmail = String(session.user?.email ?? "").toLowerCase().trim();

  // Filtramos: aceptamos tanto ownerEmail (campo top-level)
  // como details.ownerEmail (dentro del JSON details)
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

    const ownerTop = item.ownerEmail
      ? String(item.ownerEmail).toLowerCase().trim()
      : null;
    const ownerDetail = details?.ownerEmail
      ? String(details.ownerEmail).toLowerCase().trim()
      : null;

    return ownerTop === myEmail || ownerDetail === myEmail;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-6 py-10">
      <div className="max-w-[1100px] mx-auto">
        <h1 className="text-3xl font-black text-slate-900">Mis anuncios</h1>

        {listings.length === 0 && (
          <p className="mt-6 text-slate-500">Aún no has publicado anuncios.</p>
        )}

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((item) => (
            <div key={item.id} className="relative">
              <ListingCard item={item} />

              <div className="absolute right-3 top-3 z-30 flex gap-2">
                <Link
                  href={`/listing/${item.id}/edit`}
                  className="rounded-lg bg-slate-900 px-3 py-1 text-sm font-bold text-white shadow hover:bg-slate-800"
                >
                  Editar
                </Link>

                <form action={`/api/listings/delete?id=${item.id}`} method="POST">
                  <button
                    type="submit"
                    className="rounded-lg bg-red-600 px-3 py-1 text-sm font-bold text-white shadow hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/publish"
            className="rounded-xl bg-[#0f3c8c] px-5 py-3 font-bold text-white"
          >
            Publicar nuevo anuncio
          </Link>
        </div>
      </div>
    </div>
  );
}