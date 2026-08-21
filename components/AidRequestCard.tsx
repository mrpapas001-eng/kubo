import Link from "next/link";
import {
  Heart,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowRight,
  UserRound,
  Sparkles,
} from "lucide-react";
import { AID_CATEGORIES } from "@/lib/aidRequestPolicy";

export type PublicAidRequest = {
  id: string;
  title: string;
  category: string;
  city: string;
  description: string;
  contextImageUrl: string | null;
  status: string;
  ownerName: string | null;
  createdAt: string | Date;
};

function categoryLabel(slug: string): string {
  return AID_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

function formatRelativeDate(value: string | Date): string {
  const createdAt = new Date(value);
  const now = new Date();

  const diffMs = now.getTime() - createdAt.getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / 86_400_000));

  if (diffDays === 0) return "Publicado hoy";
  if (diffDays === 1) return "Publicado hace 1 día";

  return `Publicado hace ${diffDays} días`;
}

export default function AidRequestCard({
  request,
}: {
  request: PublicAidRequest;
}) {
  const isMatched = request.status === "MATCHED";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-blue-100/80 bg-white shadow-[0_12px_35px_rgba(15,60,140,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_50px_rgba(15,60,140,0.15)]">
      
      {/* Imagen */}
      <div className="relative overflow-hidden">
        {request.contextImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={request.contextImageUrl}
            alt={request.title}
            className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="relative flex h-44 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#eef5ff] via-white to-[#e9f7ff]">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-200/40 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-cyan-200/40 blur-2xl" />

            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-blue-100 bg-white shadow-[0_10px_30px_rgba(21,87,214,0.12)]">
              <Heart className="h-10 w-10 fill-blue-100 text-[#1557d6]" />
            </div>
          </div>
        )}

        {/* Degradado inferior */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Categoría */}
        <div className="absolute left-4 top-4">
          <span className="inline-flex items-center rounded-full border border-white/70 bg-white/95 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-[#1557d6] shadow-sm backdrop-blur">
            {categoryLabel(request.category)}
          </span>
        </div>

        {/* Corazón */}
        <div className="absolute right-4 top-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/80 bg-gradient-to-br from-[#2469e8] to-[#0f3c8c] text-white shadow-[0_8px_20px_rgba(15,60,140,0.28)]">
            <Heart className="h-5 w-5 fill-current" />
          </div>
        </div>

        {/* Estado */}
        {isMatched && (
          <div className="absolute bottom-3 left-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-black text-[#0f3c8c] shadow-sm backdrop-blur">
              <Clock className="h-3.5 w-3.5" />
              Ayuda en proceso
            </span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-5">
        
        {/* Verificación */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-1.5 text-[11px] font-extrabold text-[#1557d6]">
            <ShieldCheck className="h-4 w-4" />
            Verificado por Kubo
          </span>
        </div>

        {/* Título */}
        <h3 className="mt-4 line-clamp-2 text-lg font-black leading-tight text-slate-900 md:text-xl">
          {request.title}
        </h3>

        {/* Descripción */}
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
          {request.description}
        </p>

        {/* Datos */}
        <div className="mt-4 space-y-2.5 rounded-2xl bg-[#f7faff] p-3.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm">
              <MapPin className="h-4 w-4 text-[#1557d6]" />
            </div>
            <span>{request.city}</span>
          </div>

          {request.ownerName ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm">
                <UserRound className="h-4 w-4 text-[#1557d6]" />
              </div>
              <span>Publicado por {request.ownerName}</span>
            </div>
          ) : null}

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm">
              <Clock className="h-4 w-4 text-[#1557d6]" />
            </div>
            <span>{formatRelativeDate(request.createdAt)}</span>
          </div>
        </div>

        {/* Mensaje confianza */}
        <div className="mt-4 flex items-start gap-2 text-[11px] font-medium leading-4 text-slate-500">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#1557d6]" />
          <span>
            Solicitud revisada antes de ser publicada.
          </span>
        </div>

        {/* Botón */}
        <div className="mt-auto pt-5">
          <Link
            href={`/ayuda/necesidades/${request.id}`}
            className="group/button flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1b63dd] to-[#0f3c8c] px-5 py-3.5 text-center text-sm font-black text-white shadow-[0_10px_24px_rgba(21,87,214,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(21,87,214,0.32)]"
          >
            Quiero ayudar
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}