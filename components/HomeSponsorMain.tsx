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

export default function HomeSponsorMain({ sponsors }: { sponsors: SponsorItem[] }) {
  const items = Array.isArray(sponsors) ? sponsors : [];
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
      <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-[#0f3c8c] shadow-sm">
        <a
          href={sponsor.ctaUrl ?? "#"}
          target="_blank"
          rel="noreferrer"
          className="group block"
        >
          <div className="relative min-h-[170px] w-full md:min-h-[190px]">
            {sponsor.imageUrl ? (
              <img
                src={sponsor.imageUrl}
                alt={sponsor.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                loading="lazy"
              />
            ) : null}

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
        </a>

        {items.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() =>
                setActiveIndex((prev) => (prev - 1 + items.length) % items.length)
              }
              className="absolute left-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md transition hover:bg-white md:flex"
              aria-label="Patrocinado anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev + 1) % items.length)}
              className="absolute right-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md transition hover:bg-white md:flex"
              aria-label="Patrocinado siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={
                    index === activeIndex % items.length
                      ? "h-2 w-5 rounded-full bg-white"
                      : "h-2 w-2 rounded-full bg-white/50"
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
