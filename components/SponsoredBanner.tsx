"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Sponsor = {
  id?: string | number;
  title?: string;
  description?: string;
  image?: string;
  url?: string;
};

const FALLBACK_SPONSORS: Sponsor[] = [
  {
    id: "fallback-1",
    title: "Claro empresas",
    description: "Encuentra equipos nuevos con entrega rápida y mejores precios.",
    image:
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?q=80&w=1200&auto=format&fit=crop",
    url: "#",
  },
  {
    id: "fallback-2",
    title: "Planes móviles desde $20.000",
    description: "Internet rápido, llamadas ilimitadas y equipos en promoción.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop",
    url: "#",
  },
  {
    id: "fallback-3",
    title: "Conectividad para tu negocio",
    description: "Soluciones de telefonía e internet para empresas y emprendedores.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop",
    url: "#",
  },
];

export default function SponsoredBanner({ sponsors }: { sponsors: Sponsor[] }) {
  const items = useMemo(() => {
    if (Array.isArray(sponsors) && sponsors.length > 0) {
      return sponsors.map((s, index) => ({
        ...s,
        id: s.id ?? `sponsor-${index}`,
        title: s.title ?? FALLBACK_SPONSORS[index % FALLBACK_SPONSORS.length].title,
        description:
          s.description ??
          FALLBACK_SPONSORS[index % FALLBACK_SPONSORS.length].description,
        image:
          s.image ?? FALLBACK_SPONSORS[index % FALLBACK_SPONSORS.length].image,
        url: s.url ?? "#",
      }));
    }

    return FALLBACK_SPONSORS;
  }, [sponsors]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [items.length]);

  function goPrev() {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }

  function goNext() {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }

  const sponsor = items[activeIndex];

  return (
    <div className="relative h-full overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
      <Link
        href={sponsor?.url ?? "#"}
        className="group block h-full overflow-hidden"
      >
        <div className="relative h-[420px] w-full overflow-hidden bg-slate-100">
          <img
            src={sponsor?.image ?? FALLBACK_SPONSORS[0].image!}
            alt={sponsor?.title ?? "Patrocinado"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

          <div className="absolute left-4 top-4 rounded-full bg-[#0f3c8c] px-3 py-1 text-[11px] font-bold text-white shadow-sm">
            Patrocinado
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
            <div className="max-w-[560px] text-white">
              <h3 className="line-clamp-2 text-xl font-extrabold md:text-2xl">
                {sponsor?.title ?? "Oferta destacada"}
              </h3>

              <p className="mt-2 line-clamp-2 text-sm text-white/85 md:text-base">
                {sponsor?.description ?? "Descubre esta oferta especial."}
              </p>

              <div className="mt-4">
                <span className="inline-flex items-center rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#0f3c8c] transition group-hover:bg-slate-100">
                  Ver oferta
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {items.length > 1 ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md transition hover:bg-white"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={goNext}
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md transition hover:bg-white"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {items.map((item, index) => (
              <button
                key={String(item.id)}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={
                  index === activeIndex
                    ? "h-2.5 w-6 rounded-full bg-white"
                    : "h-2.5 w-2.5 rounded-full bg-white/50"
                }
                aria-label={`Ir al patrocinado ${index + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}