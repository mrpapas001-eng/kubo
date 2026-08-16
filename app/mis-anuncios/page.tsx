import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import ListingCard from "@/components/ListingCard";
import DeleteListingButton from "@/components/DeleteListingButton";
import ReactivateListingButton from "@/components/ReactivateListingButton";

export default async function MisAnunciosPage() {
  const session = await getServerSession(authOptions);

  const myEmail = session?.user?.email?.toLowerCase().trim() ?? null;

  if (!myEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FB] px-6 pb-28 pt-10 md:py-10">
        <div className="rounded-3xl bg-white p-8 shadow">
          <p className="text-lg font-bold text-slate-900">
            Debes iniciar sesión
          </p>
        </div>
      </div>
    );
  }

  const listings = await prisma.listing.findMany({
    where: {
      ownerEmail: myEmail,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const now = new Date();

  const hasUnverifiedBusiness = listings.some(
    (item: any) => item.isBusiness && !item.businessVerified
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-6 pb-28 pt-10 md:py-10">
      <div className="mx-auto max-w-[1100px]">
        <div>
          <div className="mb-4 flex items-center gap-4">
            <BackButton className="text-sm font-medium text-slate-700" />
            <Link
              href="/"
              className="text-sm font-medium text-slate-700 hover:underline"
            >
              Inicio
            </Link>
          </div>

          <h1 className="text-3xl font-black text-slate-900">Mis anuncios</h1>

          <p className="mt-2 text-sm font-medium text-slate-500">
            Gestiona, edita y promociona tus publicaciones.
          </p>
        </div>

        {hasUnverifiedBusiness ? (
          <Link
            href="/verificar-empresa"
            className="mt-6 flex items-center gap-4 rounded-3xl bg-[#0f3c8c] px-5 py-5 text-white shadow-sm hover:bg-[#0c2f6d]"
          >
            <div className="min-w-0">
              <div className="text-base font-black">
                Verifica tu empresa y obtén el sello Empresa verificada.
              </div>
              <p className="mt-1 text-sm font-medium text-white/75">
                Envía tu RUT y da más confianza a tus compradores.
              </p>
            </div>
          </Link>
        ) : null}

        {listings.length === 0 ? (
          <p className="mt-6 text-slate-500">
            Aún no has publicado anuncios.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((item: any) => {
              const premiumActive =
                item.isPremium &&
                item.premiumUntil &&
                new Date(item.premiumUntil).getTime() > now.getTime();

              const featuredActive =
                item.isFeatured &&
                item.featuredUntil &&
                new Date(item.featuredUntil).getTime() > now.getTime();

              const status = item.status || "active";
              const isHidden = status === "hidden";
              const isDeleted = status === "deleted";

              const statusLabel =
                status === "hidden"
                  ? "Oculto"
                  : status === "deleted"
                    ? "Eliminado"
                    : "Activo";

              const statusClass =
                status === "hidden"
                  ? "bg-yellow-50 text-yellow-700 ring-yellow-200"
                  : status === "deleted"
                    ? "bg-red-50 text-red-700 ring-red-200"
                    : "bg-green-50 text-green-700 ring-green-200";

              return (
                <div
                  key={item.id}
                  className={isDeleted ? "opacity-60 grayscale" : ""}
                >
                  <div
                    className={
                      isDeleted
                        ? "hidden pointer-events-none md:block"
                        : ""
                    }
                  >
                    <ListingCard item={item} />
                  </div>

                  {/* Status / badges: integrate visually in mobile by removing top margin */}
                  {isDeleted ? (
                    <div className="mt-3 hidden md:block rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${statusClass}`}
                        >
                          {statusLabel}
                        </span>

                        {premiumActive ? (
                          <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-black text-yellow-700 ring-1 ring-yellow-200">
                            Premium activo
                          </span>
                        ) : null}

                        {featuredActive ? (
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700 ring-1 ring-blue-200">
                            Destacado activo
                          </span>
                        ) : null}

                        <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-black text-slate-600 ring-1 ring-slate-200">
                          {Number(item.views || 0).toLocaleString("es-CO")} vistas
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="-mt-3 md:mt-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ring-1 ${statusClass}`}
                        >
                          {statusLabel}
                        </span>

                        {premiumActive ? (
                          <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-black text-yellow-700 ring-1 ring-yellow-200">
                            Premium activo
                          </span>
                        ) : null}

                        {featuredActive ? (
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700 ring-1 ring-blue-200">
                            Destacado activo
                          </span>
                        ) : null}

                        <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-black text-slate-600 ring-1 ring-slate-200">
                          {Number(item.views || 0).toLocaleString("es-CO")} vistas
                        </span>
                      </div>
                    </div>
                  )}

                  {isDeleted ? (
                    <>
                      {/* Compact mobile row for deleted items */}
                      <div className="mt-2 md:hidden flex items-center gap-3 rounded-2xl bg-white p-2">
                        <div className="w-16 h-12 flex-shrink-0 overflow-hidden rounded-sm bg-slate-100">
                          <img
                            src={item.imageUrl || "/placeholders/listing.jpg"}
                            alt={item.title || "Anuncio"}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold line-clamp-2 text-slate-900">
                            {item.title || "Sin título"}
                          </div>

                          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                            <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-red-700 text-[11px] font-bold">
                              Desactivado
                            </span>
                            <span className="text-[11px]">
                              {Number(item.views || 0).toLocaleString("es-CO")} vistas
                            </span>
                          </div>

                          <ReactivateListingButton listingId={item.id} />
                        </div>
                      </div>

                      {/* Desktop large message preserved */}
                      <div className="mt-3 hidden md:block rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                        Este anuncio fue eliminado y ya no tiene acciones disponibles.
                      </div>
                    </>
                  ) : (
                    <div
                      className={`mt-2 md:mt-3 grid gap-2 ${
                        isHidden ? "grid-cols-1" : "grid-cols-[1fr_auto_auto]"
                      }`}
                    >
                      {!isHidden ? (
                        <>
                          {item.isBusiness ? (
                            <Link
                              href={`/premium?listingId=${item.id}`}
                              className="flex h-10 md:h-11 items-center justify-center rounded-2xl border border-yellow-200 bg-white text-sm font-black text-yellow-700 shadow-sm hover:bg-yellow-50"
                            >
                              {premiumActive || featuredActive
                                ? "🔁 Renovar promoción"
                                : "🚀 Promocionar"}
                            </Link>
                          ) : null}

                          <Link
                            href={`/listing/${item.id}/edit`}
                            className="flex h-10 md:h-11 items-center justify-center rounded-2xl bg-slate-900 px-4 text-sm font-bold text-white shadow hover:bg-slate-800"
                          >
                            Editar
                          </Link>
                        </>
                      ) : null}

                      <DeleteListingButton listingId={item.id} status={item.status} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/publish"
            className="inline-flex rounded-xl bg-[#0f3c8c] px-5 py-3 font-bold text-white"
          >
            Publicar nuevo anuncio
          </Link>
        </div>
      </div>
    </div>
  );
}
