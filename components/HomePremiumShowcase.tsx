import Link from "next/link";
import { Crown } from "lucide-react";
import ListingCard from "@/components/ListingCard";

type HomeListing = {
  id?: string;
  isPremium?: boolean;
};

type Props = {
  listings: HomeListing[];
};

export default function HomePremiumShowcase({ listings }: Props) {
  const premium = (listings ?? []).filter((item) => item?.isPremium).slice(0, 3);

  if (premium.length === 0) return null;

  return (
    <section className="mt-6">
      <div className="rounded-[28px] border border-yellow-200/80 bg-[linear-gradient(180deg,#fffbeb_0%,#ffffff_55%)] p-5 shadow-[0_18px_55px_rgba(245,158,11,0.10)] md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="premium-badge-pulse inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-slate-900">
              <Crown className="h-3.5 w-3.5" />
              Premium
            </div>

            <h2 className="mt-3 text-2xl font-black text-slate-900 md:text-3xl">
              Anuncios Premium
            </h2>

            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              La máxima visibilidad de Kubo: anuncios seleccionados con posición
              prioritaria en toda la plataforma.
            </p>
          </div>

          <Link
            href="/premium"
            className="inline-flex h-11 w-fit items-center justify-center rounded-xl border border-yellow-300 bg-white px-5 text-sm font-black text-slate-800 shadow-sm transition hover:bg-yellow-50"
          >
            Consigue tu cupo Premium
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {premium.map((item, idx) => (
            <ListingCard key={`premium-${item?.id ?? idx}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
