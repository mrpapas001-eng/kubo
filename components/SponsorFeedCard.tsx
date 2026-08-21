import { ArrowRight } from "lucide-react";

type SponsorItem = {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
};

// Sponsor card sized like a normal ListingCard so it integrates into the feed grid.
export default function SponsorFeedCard({ sponsor }: { sponsor: SponsorItem }) {
  return (
    <a
      href={sponsor.ctaUrl ?? "#"}
      target="_blank"
      rel="noreferrer"
      className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-[22px] bg-slate-100">
        {sponsor.imageUrl ? (
          <img
            src={sponsor.imageUrl}
            alt={sponsor.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-[linear-gradient(135deg,#0f3c8c,#2563eb)]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

        <div className="absolute left-3 top-3 z-10 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-black tracking-wide text-slate-700 shadow-sm ring-1 ring-black/5 backdrop-blur">
          PATROCINADO
        </div>
      </div>

      <div className="flex flex-1 flex-col space-y-2.5 p-3 md:space-y-3 md:p-4">
        <div className="space-y-1.5">
          <h3 className="line-clamp-2 min-h-[40px] text-[15px] font-extrabold leading-snug text-slate-900 md:min-h-[48px] md:text-[18px]">
            {sponsor.title}
          </h3>

          {sponsor.subtitle ? (
            <p className="line-clamp-2 text-[11px] font-medium text-slate-500 md:text-sm">
              {sponsor.subtitle}
            </p>
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <span className="min-w-0 truncate text-sm font-black text-[#0f3c8c]">
            {sponsor.ctaText || "Conocer más"}
          </span>

          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0f3c8c] text-white transition-transform duration-300 group-hover:translate-x-1">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </a>
  );
}

