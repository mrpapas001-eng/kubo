import Link from "next/link";
import { Crown, Sparkles } from "lucide-react";
import ListingCard from "@/components/ListingCard";

type HomeListing = {
  id?: string;
  isPremium?: boolean;
  premiumUntil?: string | Date | null;
};

type Props = {
  listings: HomeListing[];
};

export default function HomePremiumShowcase({ listings }: Props) {
  const now = new Date();

  const premium = (listings ?? [])
    .filter((item) => {
      if (item?.isPremium !== true) return false;
      if (!item?.premiumUntil) return false;

      return new Date(item.premiumUntil) > now;
    })
    .slice(0, 2);

  if (premium.length === 0) return null;

  return (
    <section className="mt-7">
      <div className="relative overflow-hidden rounded-[28px] border border-amber-200/80 bg-white p-4 shadow-[0_12px_35px_rgba(15,23,42,0.06)] md:p-6">
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-amber-100/60 blur-3xl" />

        <div className="relative flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-900 shadow-sm">
              <Crown className="h-3.5 w-3.5" />
              Selección Premium
            </div>

            <h2 className="mt-2 text-xl font-black tracking-tight text-slate-950 md:text-2xl">
              Anuncios Premium
            </h2>

            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500 md:text-sm">
              Los anuncios con máxima visibilidad en Kubo.
            </p>
          </div>

          <Link
            href="/premium"
            className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-xl border border-amber-300 bg-white px-4 text-xs font-black text-slate-900 shadow-sm transition hover:bg-amber-50"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Consigue tu cupo Premium
          </Link>
        </div>

        <div className="relative mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {premium.map((item, idx) => (
            <div
              key={`premium-${item?.id ?? idx}`}
              className="min-w-0 rounded-[18px] border border-amber-200 bg-white p-1 shadow-[0_8px_24px_rgba(120,80,10,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(120,80,10,0.13)] md:rounded-[20px]"
            >
              <ListingCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}