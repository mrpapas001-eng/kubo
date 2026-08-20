import { ArrowRight } from "lucide-react";

type Props = {
  sponsors?: any[];
  sponsor?: any;
};

export default function SponsoredCard({ sponsors, sponsor }: Props) {
  const item = sponsor ?? (Array.isArray(sponsors) ? sponsors[0] : null);

  const title = item?.title ?? "Patrocinado";
  const subtitle = item?.subtitle ?? "";
  const imageUrl =
    item?.imageUrl ??
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400";
  const ctaText = item?.ctaText ?? "Conocer más";
  const ctaUrl = item?.ctaUrl ?? "#";

  return (
    <a
      href={ctaUrl}
      target="_blank"
      rel="noreferrer"
      className="group block h-full overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative flex h-full flex-col">
        <div className="relative h-[220px] overflow-hidden bg-slate-100">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />

          <div className="absolute left-3 top-3 z-10 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-black tracking-wide text-slate-900 shadow-sm ring-1 ring-black/5 backdrop-blur">
            PATROCINADO
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex-1">
            <h3 className="line-clamp-2 text-[22px] font-black leading-tight tracking-tight text-slate-900">
              {title}
            </h3>

            {subtitle ? (
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                {subtitle}
              </p>
            ) : (
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Descubre esta recomendación destacada y accede a más información.
              </p>
            )}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
            <span className="text-sm font-bold text-slate-900">{ctaText}</span>

            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0f3c8c] text-white transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}