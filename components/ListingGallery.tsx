"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
};

export default function ListingGallery({ images }: Props) {
  const cleaned = useMemo(() => {
    const unique: string[] = [];

    for (const value of images ?? []) {
      const src = String(value ?? "").trim();
      if (!src) continue;
      if (!unique.includes(src)) unique.push(src);
    }

    return unique.length ? unique : ["/placeholders/listing.jpg"];
  }, [images]);

  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [cleaned]);

  const safeActive = Math.min(active, cleaned.length - 1);
  const main = cleaned[safeActive] ?? cleaned[0];

  function goPrev() {
    setActive((prev) => (prev === 0 ? cleaned.length - 1 : prev - 1));
  }

  function goNext() {
    setActive((prev) => (prev === cleaned.length - 1 ? 0 : prev + 1));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (cleaned.length <= 1) return;

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    }

    if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    }
  }

  return (
    <div className="w-full outline-none" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="relative h-[280px] w-full overflow-hidden bg-slate-100 md:h-[420px] lg:h-[480px]">
        <img
          src={main}
          alt={`Foto ${safeActive + 1} del anuncio`}
          className="block h-full w-full object-cover object-center"
          loading="eager"
        />

        {cleaned.length > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Foto anterior"
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-sm backdrop-blur transition hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label="Foto siguiente"
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-sm backdrop-blur transition hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>

      {cleaned.length > 1 ? (
        <div className="border-t border-slate-100 px-6 py-4">
          <div className="flex gap-2 overflow-x-auto">
            {cleaned.map((src, idx) => {
              const isActive = idx === safeActive;

              return (
                <button
                  key={`${src}-${idx}`}
                  type="button"
                  onClick={() => setActive(idx)}
                  className={[
                    "shrink-0 overflow-hidden rounded-xl border transition-all duration-200",
                    isActive
                      ? "border-slate-900 ring-2 ring-slate-900/20"
                      : "border-slate-200 opacity-80 hover:border-slate-400 hover:opacity-100",
                  ].join(" ")}
                  aria-label={`Ver foto ${idx + 1}`}
                  aria-pressed={isActive}
                >
                  <img
                    src={src}
                    alt={`Miniatura ${idx + 1}`}
                    className="block h-[64px] w-[88px] object-cover object-center"
                    loading="lazy"
                  />
                </button>
              );
            })}
          </div>

          <div className="mt-2 text-xs font-medium text-slate-500">
            {safeActive + 1} de {cleaned.length} fotos
          </div>
        </div>
      ) : null}
    </div>
  );
}