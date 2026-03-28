import { ArrowRight } from "lucide-react";

export default function SponsoredCard({ sponsor }: { sponsor: any }) {
  const title = sponsor?.title ?? "Patrocinado";
  const subtitle = sponsor?.subtitle ?? "";
  const imageUrl =
    sponsor?.imageUrl ?? "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400";
  const ctaText = sponsor?.ctaText ?? "Conocer más";
  const ctaUrl = sponsor?.ctaUrl ?? "#";

  return (
    <a
      href={ctaUrl}
      target="_blank"
      rel="noreferrer"
      className="relative overflow-hidden rounded-3xl bg-[#E21219] flex flex-col h-full min-h-[420px] shadow-lg group cursor-pointer"
    >
      <div className="p-6 pb-2 text-white z-10">
        <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Patrocinado</span>
        <div className="mt-4">
          <h3 className="text-3xl font-black leading-tight italic">{title}</h3>
          {subtitle ? (
            <p className="text-sm mt-3 font-medium opacity-90 leading-snug max-w-[200px]">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="px-6 z-10 mt-2">
        <div className="bg-white text-slate-900 px-4 py-2 rounded-full font-bold text-xs inline-flex items-center gap-2 hover:scale-105 transition-transform">
          {ctaText}
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>

      <div className="absolute bottom-0 right-0 left-0 h-1/2 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#E21219]/20 to-[#E21219]" />
      </div>

      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full" />
      <div className="absolute top-20 -left-5 w-20 h-20 bg-white opacity-5 rounded-full" />
    </a>
  );
}