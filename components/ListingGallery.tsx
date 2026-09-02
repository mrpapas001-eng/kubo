"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);

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

  useEffect(() => {
    if (!isOpen) return;

    function handleLightboxKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }

      if (e.key === "ArrowLeft" && cleaned.length > 1) {
        goPrev();
      }

      if (e.key === "ArrowRight" && cleaned.length > 1) {
        goNext();
      }
    }

    document.addEventListener("keydown", handleLightboxKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleLightboxKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, cleaned.length]);

  return (
    <>
      <div
        className="w-full outline-none"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div className="relative h-[280px] w-full overflow-hidden bg-slate-100 md:h-[420px] lg:h-[480px]">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="block h-full w-full cursor-zoom-in"
            aria-label="Ampliar foto"
          >
            <img
              src={main}
              alt={`Foto ${safeActive + 1} del anuncio`}
              className="block h-full w-full object-cover object-center"
              loading="eager"
            />
          </button>

          <div className="pointer-events-none absolute right-3 top-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur md:h-9 md:w-9">
              <Maximize2 className="h-4 w-4" />
            </div>
          </div>

          {cleaned.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Foto anterior"
                className="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md backdrop-blur transition hover:bg-white md:left-4 md:top-1/2 md:h-10 md:w-10 md:-translate-y-1/2"
              >
                <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Foto siguiente"
                className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md backdrop-blur transition hover:bg-white md:right-4 md:top-1/2 md:h-10 md:w-10 md:-translate-y-1/2"
              >
                <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </>
          ) : null}
        </div>

        {cleaned.length > 1 ? (
          <div className="border-t border-slate-100 px-3 py-3 md:px-6 md:py-4">
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
                      className="block h-[58px] w-[76px] object-cover object-center md:h-[64px] md:w-[88px]"
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

      {isOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-2 md:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Galería de fotos ampliada"
          onClick={() => setIsOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 z-[110] flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/25"
            aria-label="Cerrar foto ampliada"
          >
            <X className="h-6 w-6" />
          </button>

          <div
            className="relative flex h-full w-full items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={main}
              alt={`Foto ${safeActive + 1} ampliada`}
              className="max-h-[92vh] max-w-full object-contain"
            />

            {cleaned.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Foto anterior"
                  className="absolute bottom-5 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg md:left-6 md:top-1/2 md:h-12 md:w-12 md:-translate-y-1/2"
                >
                  <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Foto siguiente"
                  className="absolute bottom-5 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg md:right-6 md:top-1/2 md:h-12 md:w-12 md:-translate-y-1/2"
                >
                  <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </>
            ) : null}

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/65 px-4 py-2 text-xs font-black text-white backdrop-blur">
              {safeActive + 1} / {cleaned.length}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}