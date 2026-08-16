import Link from "next/link";
import { Crown, Flame, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/db";

type Props = {
  searchParams?: Promise<{
    listingId?: string;
  }>;
};

export default async function PremiumPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const listingId = params.listingId;

  let listing: any = null;
  if (listingId) {
    listing = await prisma.listing.findUnique({ where: { id: listingId } });
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 py-10">
      <div className="mx-auto max-w-[1150px]">
        <Link
          href={listingId ? `/listing/${listingId}` : "/mis-anuncios"}
          className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          ← Volver
        </Link>

        <div className="mt-8 text-center">
          <div className="inline-flex rounded-full bg-yellow-100 px-4 py-2 text-xs font-black uppercase tracking-wide text-yellow-800">
            Promociona tu anuncio
          </div>

          <h1 className="mt-5 text-4xl font-black text-slate-950 md:text-5xl">
            Haz que tu anuncio destaque
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-500">
            Elige cómo quieres promocionar tu anuncio para conseguir más visitas
            y más contactos.
          </p>
        </div>

        {!listingId || !listing ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-center text-sm font-bold text-red-700">
            No se encontró el anuncio. Vuelve a “Mis anuncios” y pulsa
            “Promocionar este anuncio”.
          </div>
        ) : null}

        {listingId && listing && !listing.isBusiness ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-center text-sm font-bold text-red-700">
            Destacado y Premium son beneficios disponibles para anuncios de
            empresa. Si eres particular no puedes activar estas promociones.
          </div>
        ) : null}

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <Flame className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-2xl font-black text-slate-900">
              Destacado
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Ideal para darle más visibilidad a tu anuncio sin pagar mucho.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex gap-2 text-sm font-semibold text-slate-700">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Aparece por encima de anuncios normales
              </div>

              <div className="flex gap-2 text-sm font-semibold text-slate-700">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Badge de destacado
              </div>

              <div className="flex gap-2 text-sm font-semibold text-slate-700">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Más visibilidad en categoría
              </div>
            </div>

              <div className="mt-7 space-y-3">
              <Link
                href={`/api/promote/featured?listingId=${listingId}&days=7`}
                className={`flex h-12 items-center justify-center rounded-2xl text-sm font-black ${
                  listingId && listing && listing.isBusiness
                    ? "bg-slate-100 text-slate-900 hover:bg-slate-200"
                    : "pointer-events-none bg-slate-200 text-slate-400"
                }`}
              >
                7 días — Gratis (Oferta de lanzamiento)
              </Link>

              <Link
                href={`/api/promote/featured?listingId=${listingId}&days=15`}
                className={`flex h-12 items-center justify-center rounded-2xl text-sm font-black ${
                  listingId && listing && listing.isBusiness
                    ? "bg-slate-100 text-slate-900 hover:bg-slate-200"
                    : "pointer-events-none bg-slate-200 text-slate-400"
                }`}
              >
                15 días — Gratis (Oferta de lanzamiento)
              </Link>

              <Link
                href={`/api/promote/featured?listingId=${listingId}&days=30`}
                className={`flex h-12 items-center justify-center rounded-2xl text-sm font-black ${
                  listingId && listing && listing.isBusiness
                    ? "bg-slate-900 text-white hover:bg-slate-700"
                    : "pointer-events-none bg-slate-200 text-slate-400"
                }`}
              >
                30 días — Gratis (Oferta de lanzamiento)
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[28px] border-2 border-yellow-400 bg-gradient-to-b from-yellow-50 to-white p-6 shadow-[0_24px_70px_rgba(245,158,11,0.25)]">
            <div className="absolute right-5 top-5 rounded-full bg-yellow-400 px-3 py-1 text-xs font-black uppercase text-slate-900">
              Más recomendado
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-slate-900">
              <Crown className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-2xl font-black text-slate-900">
              Premium
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Máxima prioridad y diseño especial para recibir más visitas y más
              contactos.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex gap-2 text-sm font-semibold text-slate-800">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Aparece primero en resultados
              </div>

              <div className="flex gap-2 text-sm font-semibold text-slate-800">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Card dorada premium
              </div>

              <div className="flex gap-2 text-sm font-semibold text-slate-800">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Máxima visibilidad en Kubo
              </div>
            </div>

            <div className="mt-7 space-y-3">
              <Link
                href={`/api/promote/premium?listingId=${listingId}&days=7`}
                className={`flex h-12 items-center justify-center rounded-2xl text-sm font-black ${
                  listingId && listing && listing.isBusiness
                    ? "bg-yellow-100 text-slate-900 hover:bg-yellow-200"
                    : "pointer-events-none bg-slate-200 text-slate-400"
                }`}
              >
                7 días — Gratis (Oferta de lanzamiento)
              </Link>

              <Link
                href={`/api/promote/premium?listingId=${listingId}&days=15`}
                className={`flex h-12 items-center justify-center rounded-2xl text-sm font-black ${
                  listingId && listing && listing.isBusiness
                    ? "bg-yellow-100 text-slate-900 hover:bg-yellow-200"
                    : "pointer-events-none bg-slate-200 text-slate-400"
                }`}
              >
                15 días — Gratis (Oferta de lanzamiento)
              </Link>

              <Link
                href={`/api/promote/premium?listingId=${listingId}&days=30`}
                className={`flex h-12 items-center justify-center rounded-2xl text-sm font-black ${
                  listingId && listing && listing.isBusiness
                    ? "bg-yellow-400 text-slate-900 hover:bg-yellow-500"
                    : "pointer-events-none bg-slate-200 text-slate-400"
                }`}
              >
                30 días — Gratis (Oferta de lanzamiento) ⭐ Mejor opción
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-slate-500 font-semibold">
          Oferta de lanzamiento: Destacado y Premium gratis para empresas por
          tiempo limitado.
        </p>
      </div>
    </div>
  );
}