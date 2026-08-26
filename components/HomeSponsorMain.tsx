"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

type SponsorItem = {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
};

export default function HomeSponsorMain({
  sponsors,
}: {
  sponsors: SponsorItem[];
}) {
  const items =
    Array.isArray(sponsors) && sponsors.length > 0
      ? sponsors
      : [
          {
            id: "sponsor-demo",
            title: "Claro hogar",
            subtitle:
              "Internet Fibra Óptica para disfrutar más velocidad en tu hogar.",
            imageUrl: "/placeholders/claro-demo.jpg",
            ctaText: "Lo quiero",
            ctaUrl: "#",
          },
        ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [items.length]);

  if (items.length === 0) return null;

  const sponsor = items[activeIndex % items.length];

  return (
    <section className="mt-6">
      <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <a
          href={sponsor.ctaUrl ?? "#"}
          target="_blank"
          rel="noreferrer"
          className="group block"
        >
          {sponsor.imageUrl ? (
            <div className="relative w-full overflow-hidden bg-slate-100">
              <div className="relative aspect-[16/8] w-full sm:aspect-[16/7] md:aspect-[16/4]">
                <img
                  src={sponsor.imageUrl}
                  alt={sponsor.title}
className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]"                  loading="lazy"
                />

                <div className="absolute left-2 top-2 z-10 md:left-4 md:top-4">
  <span className="inline-flex items-center rounded-full bg-black/45 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white backdrop-blur-sm md:px-3 md:py-1 md:text-[10px]">
    Patrocinado
  </span>
</div>
              </div>
            </div>
          ) : (
            <div className="relative min-h-[170px] w-full bg-[#0f3c8c] md:min-h-[190px]">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,32,72,0.92)_0%,rgba(15,60,140,0.72)_45%,rgba(15,60,140,0.25)_100%)]" />

              <div className="relative flex min-h-[170px] flex-col justify-center gap-3 px-6 py-6 md:min-h-[190px] md:flex-row md:items-center md:justify-between md:px-10">
                <div className="min-w-0 max-w-2xl text-white">
                  <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-white ring-1 ring-white/25 backdrop-blur">
                    Patrocinado
                  </span>

                  <h3 className="mt-3 line-clamp-2 text-xl font-black leading-tight md:text-2xl">
                    {sponsor.title}
                  </h3>

                  {sponsor.subtitle ? (
                    <p className="mt-1.5 line-clamp-2 text-sm text-white/80 md:text-base">
                      {sponsor.subtitle}
                    </p>
                  ) : null}
                </div>

                <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-[#0f3c8c] shadow-lg transition group-hover:bg-slate-100">
                  {sponsor.ctaText || "Ver oferta"}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          )}
        </a>

        {items.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() =>
                setActiveIndex(
                  (prev) => (prev - 1 + items.length) % items.length
                )
              }
              className="absolute left-3 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md transition hover:bg-white md:flex"
              aria-label="Patrocinado anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveIndex((prev) => (prev + 1) % items.length)
              }
              className="absolute right-3 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md transition hover:bg-white md:flex"
              aria-label="Patrocinado siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={
                    index === activeIndex % items.length
                      ? "h-2 w-5 rounded-full bg-white shadow-sm"
                      : "h-2 w-2 rounded-full bg-white/60 shadow-sm"
                  }
                  aria-label={`Ir al patrocinado ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
