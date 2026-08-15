"use client";

import {
  Play,
  Sparkles,
  X,
  Volume2,
  VolumeX,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type ReelItem = {
  id: number | string;
  title: string;
  image: string;
  videoUrl?: string;
  badge?: string;
  href?: string;
  contactLabel?: string;
  contactUrl?: string;
};

type Props = {
  items?: ReelItem[];
};

const DEFAULT_REELS: ReelItem[] = [
  {
    id: 1,
    title: "Apartamento con vista increíble",
    image: "/reels/apartamento.jpg",
    videoUrl: "/reels/apartamento.mp4",
    badge: "Reel",
    href: "",
    contactLabel: "Contactar",
    contactUrl: "https://wa.me/34600000000?text=Hola%20me%20interesa%20el%20apartamento",
  },
  {
    id: 2,
    title: "BMW listo para entrega inmediata",
    image: "/reels/carro.jpg",
    videoUrl: "/reels/carro.mp4",
    badge: "Reel",
    href: "",
    contactLabel: "Contactar",
    contactUrl: "https://wa.me/34600000000?text=Hola%20me%20interesa%20el%20BMW",
  },
  {
    id: 3,
    title: "iPhone en excelente estado",
    image: "/reels/iphone.jpg",
    videoUrl: "/reels/iphone.mp4",
    badge: "Reel",
    href: "",
    contactLabel: "Contactar",
    contactUrl: "https://wa.me/34600000000?text=Hola%20me%20interesa%20el%20iPhone",
  },
  {
    id: 4,
    title: "Moto seminueva en oferta",
    image: "/reels/moto.jpg",
    videoUrl: "/reels/moto.mp4",
    badge: "Reel",
    href: "",
    contactLabel: "Contactar",
    contactUrl: "https://wa.me/34600000000?text=Hola%20me%20interesa%20la%20moto",
  },
  {
    id: 5,
    title: "Local comercial en zona top",
    image: "/reels/local.jpg",
    videoUrl: "/reels/local.mp4",
    badge: "Reel",
    href: "",
    contactLabel: "Contactar",
    contactUrl: "https://wa.me/34600000000?text=Hola%20me%20interesa%20el%20local",
  },
];

export default function ReelsSection({ items = DEFAULT_REELS }: Props) {
  const router = useRouter();
  const reels = useMemo(() => items, [items]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  function openReel(index: number) {
    setActiveIndex(index);
    setMuted(true);
    setViewerOpen(true);

    requestAnimationFrame(() => {
      const container = viewerRef.current;
      if (!container) return;
      const sections = container.querySelectorAll("[data-reel-screen]");
      const target = sections[index] as HTMLElement | undefined;
      if (target) {
        target.scrollIntoView({ behavior: "instant", block: "start" });
      }
    });
  }

  function closeViewer() {
    setViewerOpen(false);
    setMuted(true);
  }

  function handleViewListing(reel: ReelItem) {
    if (!reel.href || reel.href === "#") {
      alert("Este anuncio aún no está disponible.");
      return;
    }

    closeViewer();

    try {
      router.push(reel.href);
    } catch {
      alert("Página no disponible todavía.");
    }
  }

  function handleContact(reel: ReelItem) {
    if (!reel.contactUrl) {
      alert("Este contacto aún no está disponible.");
      return;
    }

    closeViewer();
    window.open(reel.contactUrl, "_blank", "noopener,noreferrer");
  }

  useEffect(() => {
    if (!viewerOpen) return;

    const container = viewerRef.current;
    if (!container) return;

    const sections = Array.from(
      container.querySelectorAll<HTMLElement>("[data-reel-screen]")
    );

    const observer = new IntersectionObserver(
      (entries) => {
        let visibleIndex = activeIndex;

        entries.forEach((entry) => {
          const idx = Number(entry.target.getAttribute("data-index"));
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            visibleIndex = idx;
          }
        });

        setActiveIndex((prev) => (prev === visibleIndex ? prev : visibleIndex));
      },
      {
        root: container,
        threshold: [0.6],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [viewerOpen, activeIndex]);

  useEffect(() => {
    if (!viewerOpen) return;

    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      video.muted = muted;

      if (index === activeIndex) {
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(() => {});
        }
      } else {
        video.pause();
        try {
          video.currentTime = 0;
        } catch {}
      }
    });
  }, [activeIndex, muted, viewerOpen]);

  return (
    <>
      <section
        id="reels"
        className="scroll-mt-24 rounded-[28px] border-2 border-[#0f3c8c]/20 bg-white p-5 shadow-sm md:p-6"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-slate-700">
              <Sparkles className="h-3.5 w-3.5" />
              Nuevo formato
            </div>

            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              Reels y videos cortos
            </h2>

            <p className="mt-2 max-w-2xl text-sm text-slate-500 md:text-base">
              Descubre anuncios en formato visual rápido y entretenido.
            </p>
          </div>

          <a
            href="#reels"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0f3c8c] px-5 text-sm font-bold text-white shadow-sm hover:bg-[#0c2f6d]"
          >
            Ver todos los reels
          </a>
        </div>

  <div className="mt-6 overflow-hidden">
  <div className="flex w-max animate-[reels-marquee_28s_linear_infinite] gap-4 pb-2 hover:[animation-play-state:paused]">
    {[...reels, ...reels].map((reel, index) => (
              <button
                key={`${reel.id}-${index}`}
                type="button"
                onClick={() => openReel(index)}
                className="group w-[220px] shrink-0 overflow-hidden rounded-[26px] border border-slate-200 bg-slate-950 text-left shadow-sm transition hover:-translate-y-1"
              >
                <div className="relative aspect-[9/16] overflow-hidden">
                  <img
                    src={reel.image}
                    alt={reel.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  <div className="absolute left-3 top-3">
                    <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur">
                      {reel.badge ?? "Reel"}
                    </span>
                  </div>

                  <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
                    <div className="line-clamp-3 text-sm font-bold leading-snug text-white md:text-base">
                      {reel.title}
                    </div>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg">
                      <Play className="ml-0.5 h-4 w-4 fill-current" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
      <style jsx>{`
  @keyframes reels-marquee {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }
`}</style>

      {viewerOpen ? (
        <div className="fixed inset-0 z-[120] bg-black">
          <button
            type="button"
            onClick={closeViewer}
            className="absolute right-3 top-3 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur"
            aria-label="Cerrar reels"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => setMuted((prev) => !prev)}
            className="absolute right-3 top-16 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur"
            aria-label={muted ? "Activar sonido" : "Silenciar"}
          >
            {muted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </button>

          <div
            ref={viewerRef}
            className="h-screen overflow-y-auto snap-y snap-mandatory"
          >
            {reels.map((reel, index) => (
              <section
                key={reel.id}
                data-reel-screen
                data-index={index}
                className="relative flex h-screen snap-start items-center justify-center bg-black"
              >
                <div className="relative h-full w-full max-w-[420px] overflow-hidden bg-black">
                  {reel.videoUrl ? (
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el;
                      }}
                      src={reel.videoUrl}
                      className="h-full w-full object-cover"
                      autoPlay={index === activeIndex}
                      loop
                      playsInline
                      muted={muted}
                      preload="auto"
                      poster={reel.image}
                    />
                  ) : (
                    <img
                      src={reel.image}
                      alt={reel.title}
                      className="h-full w-full object-cover"
                    />
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur">
                    {reel.badge ?? "Reel"}
                  </div>

                  <div className="absolute inset-x-4 bottom-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <div className="max-w-[240px] text-lg font-extrabold leading-tight text-white">
                            {reel.title}
                          </div>
                          <div className="mt-2 text-sm text-white/75">
                            Desliza hacia arriba o abajo para seguir viendo reels.
                          </div>
                        </div>

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-slate-900 shadow-xl">
                          <Play className="ml-0.5 h-5 w-5 fill-current" />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleViewListing(reel)}
                          disabled={!reel.href || reel.href === "#"}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Ver anuncio
                        </button>

                        <button
                          type="button"
                          onClick={() => handleContact(reel)}
                          disabled={!reel.contactUrl}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0f3c8c] px-4 py-3 text-sm font-bold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <MessageCircle className="h-4 w-4" />
                          {reel.contactLabel ?? "Contactar"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}
