import Link from "next/link";
import { Crown, Flame, CheckCircle2, Clock3 } from "lucide-react";
import { prisma } from "@/lib/db";
import { getLaunchQuota } from "@/lib/launchPromotion";

type Props = { searchParams?: Promise<{ listingId?: string }> };

export default async function PremiumPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};
  const listingId = params.listingId;
  const [listing, quota] = await Promise.all([
    listingId ? prisma.listing.findUnique({ where: { id: listingId } }) : null,
    getLaunchQuota(),
  ]);

  const eligibleToday = Boolean(
    listing && listing.createdAt >= quota.start && listing.createdAt < quota.end
  );
  const baseEligible = Boolean(
    listingId && listing && listing.isBusiness && listing.status === "active" && eligibleToday && quota.active
  );

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 py-10">
      <div className="mx-auto max-w-[1150px]">
        <Link href={listingId ? `/listing/${listingId}` : "/mis-anuncios"} className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
          ← Volver
        </Link>

        <div className="mt-8 text-center">
          <div className="inline-flex rounded-full bg-yellow-100 px-4 py-2 text-xs font-black uppercase tracking-wide text-yellow-800">Promoción de lanzamiento</div>
          <h1 className="mt-5 text-4xl font-black text-slate-950 md:text-5xl">Haz que tu anuncio destaque gratis</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500">Cada día abrimos cupos gratuitos limitados para anuncios de empresa publicados ese mismo día. Cuando se acaban, se acaban.</p>
        </div>

        <div className="mx-auto mt-7 flex max-w-2xl items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-semibold text-blue-900">
          <Clock3 className="mt-0.5 h-5 w-5 shrink-0" />
          <span>La promoción dura 48 horas. Cada cuenta puede conseguir solo una promoción gratuita al día: Destacado o Premium.</span>
        </div>

        {!listingId || !listing ? <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-center text-sm font-bold text-red-700">No se encontró el anuncio. Vuelve a “Mis anuncios” y pulsa “Promocionar este anuncio”.</div> : null}
        {listing && !listing.isBusiness ? <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-center text-sm font-bold text-red-700">Los cupos gratuitos de lanzamiento son para anuncios de empresa.</div> : null}
        {listing && listing.isBusiness && !eligibleToday ? <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-center text-sm font-bold text-amber-800">Este anuncio no fue publicado hoy. Los cupos de cada día son exclusivamente para anuncios nuevos de ese mismo día.</div> : null}
        {!quota.active ? <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-center text-sm font-bold text-slate-700">La promoción gratuita de lanzamiento no está activa en este momento.</div> : null}

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600"><Flame className="h-6 w-6" /></div>
              <div className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-700">{quota.featuredRemaining} de 20 disponibles hoy</div>
            </div>
            <h2 className="mt-5 text-2xl font-black text-slate-900">Destacado</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Más visibilidad durante 48 horas y posición por encima de los anuncios normales.</p>
            <div className="mt-6 space-y-3">
              <div className="flex gap-2 text-sm font-semibold text-slate-700"><CheckCircle2 className="h-5 w-5 text-green-500" />Aparece por encima de anuncios normales</div>
              <div className="flex gap-2 text-sm font-semibold text-slate-700"><CheckCircle2 className="h-5 w-5 text-green-500" />Badge de Destacado</div>
              <div className="flex gap-2 text-sm font-semibold text-slate-700"><CheckCircle2 className="h-5 w-5 text-green-500" />3 cupos nuevos cada día</div>
            </div>
            <Link href={`/api/promote/featured?listingId=${listingId ?? ""}`} className={`mt-7 flex h-12 items-center justify-center rounded-2xl text-sm font-black ${baseEligible && quota.featuredRemaining > 0 ? "bg-slate-900 text-white hover:bg-slate-700" : "pointer-events-none bg-slate-200 text-slate-400"}`}>
              {quota.featuredRemaining > 0 ? "Conseguir Destacado GRATIS" : "Cupos de hoy agotados"}
            </Link>
          </div>

          <div className="relative overflow-hidden rounded-[28px] border-2 border-yellow-400 bg-gradient-to-b from-yellow-50 to-white p-6 shadow-[0_24px_70px_rgba(245,158,11,0.25)]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400 text-slate-900"><Crown className="h-6 w-6" /></div>
              <div className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-slate-900">{quota.premiumRemaining} de 5 disponibles hoy</div>
            </div>
            <h2 className="mt-5 text-2xl font-black text-slate-900">Premium</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">La opción más exclusiva: máxima prioridad y diseño Premium durante 48 horas.</p>
            <div className="mt-6 space-y-3">
              <div className="flex gap-2 text-sm font-semibold text-slate-800"><CheckCircle2 className="h-5 w-5 text-green-500" />Aparece primero en resultados</div>
              <div className="flex gap-2 text-sm font-semibold text-slate-800"><CheckCircle2 className="h-5 w-5 text-green-500" />Card dorada Premium</div>
              <div className="flex gap-2 text-sm font-semibold text-slate-800"><CheckCircle2 className="h-5 w-5 text-green-500" />Solo 2 cupos nuevos cada día</div>
            </div>
            <Link href={`/api/promote/premium?listingId=${listingId ?? ""}`} className={`mt-7 flex h-12 items-center justify-center rounded-2xl text-sm font-black ${baseEligible && quota.premiumRemaining > 0 ? "bg-yellow-400 text-slate-900 hover:bg-yellow-500" : "pointer-events-none bg-slate-200 text-slate-400"}`}>
              {quota.premiumRemaining > 0 ? "Conseguir Premium GRATIS 👑" : "Cupos de hoy agotados"}
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-sm font-semibold text-slate-500">Publicar en Kubo sigue siendo gratis. Estos cupos solo aumentan la visibilidad de anuncios nuevos durante el lanzamiento.</p>
      </div>
    </div>
  );
}
