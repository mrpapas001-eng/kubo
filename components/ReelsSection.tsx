"use client";

import {
  Pause,
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
  externalUrl?: string;
  externalPlayerUrl?: string;
  badge?: string;
  href?: string;
  contactLabel?: string;
  contactUrl?: string;
  ctaLabel?: string;
  description?: string;
  businessName?: string;
  location?: string;
};

type Props = {
  items?: ReelItem[];
  viewAllHref?: string;
  autoOpen?: boolean;
  hideGallery?: boolean;
  closeHref?: string;
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
    contactUrl:
      "https://wa.me/34600000000?text=Hola%20me%20interesa%20el%20apartamento",
  },
  {
    id: 2,
    title: "BMW listo para entrega inmediata",
    image: "/reels/carro.jpg",
    videoUrl: "/reels/carro.mp4",
    badge: "Reel",
    href: "",
    contactLabel: "Contactar",
    contactUrl:
      "https://wa.me/34600000000?text=Hola%20me%20interesa%20el%20BMW",
  },
  {
    id: 3,
    title: "iPhone en excelente estado",
    image: "/reels/iphone.jpg",
    videoUrl: "/reels/iphone.mp4",
    badge: "Reel",
    href: "",
    contactLabel: "Contactar",
    contactUrl:
      "https://wa.me/34600000000?text=Hola%20me%20interesa%20el%20iPhone",
  },
  {
    id: 4,
    title: "Moto seminueva en oferta",
    image: "/reels/moto.jpg",
    videoUrl: "/reels/moto.mp4",
    badge: "Reel",
    href: "",
    contactLabel: "Contactar",
    contactUrl:
      "https://wa.me/34600000000?text=Hola%20me%20interesa%20la%20moto",
  },
  {
    id: 5,
    title: "Local comercial en zona top",
    image: "/reels/local.jpg",
    videoUrl: "/reels/local.mp4",
    badge: "Reel",
    href: "",
    contactLabel: "Contactar",
    contactUrl:
      "https://wa.me/34600000000?text=Hola%20me%20interesa%20el%20local",
  },
];

export default function ReelsSection({
  items = DEFAULT_REELS,
  viewAllHref = "/reels",
  autoOpen = false,
  hideGallery = false,
  closeHref,
}: Props) {
  const router = useRouter();
  const reels = useMemo(() => items, [items]);
  const [viewerOpen, setViewerOpen] = useState(autoOpen && reels.length > 0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  function openReel(index: number) {
    setActiveIndex(index);
    setMuted(true);
    setPaused(false);
    setViewerOpen(true);
  }

  function stopViewer() {
    videoRefs.current.forEach((video) => video?.pause());
    setViewerOpen(false);
    setMuted(true);
    setPaused(false);
  }

  function closeViewer() {
    stopViewer();

    if (closeHref) {
      router.push(closeHref);
    }
  }

  function handleViewListing(reel: ReelItem) {
    if (!reel.href || reel.href === "#") {
      alert("Este anuncio aún no está disponible.");
      return;
    }

    stopViewer();

    try {
      router.push(reel.href);
    } catch {
      alert("Página no disponible todavía.");
    }
  }

  function openExternalReel(reel: ReelItem) {
    if (!reel.externalUrl) return;
    window.open(reel.externalUrl, "_blank", "noopener,noreferrer");
  }

  function handleContact(reel: ReelItem) {
    if (!reel.contactUrl) {
      alert("Este contacto aún no está disponible.");
      return;
    }

    window.open(reel.contactUrl, "_blank", "noopener,noreferrer");
  }

  function togglePlayback() {
    setPaused((prev) => !prev);
  }

  useEffect(() => {
    if (autoOpen && reels.length > 0) {
      setViewerOpen(true);
    }
  }, [autoOpen, reels.length]);

  useEffect(() => {
    if (!viewerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [viewerOpen]);

  useEffect(() => {
    if (!viewerOpen) return;

    const container = viewerRef.current;
    if (!container) return;

    const sections = container.querySelectorAll<HTMLElement>("[data-reel-screen]");
    const target = sections[activeIndex];

    if (target) {
      target.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, [viewerOpen]);

  useEffect(() => {
    if (!viewerOpen) return;

    const container = viewerRef.current;
    if (!container) return;

    const sections = Array.from(
      container.querySelectorAll<HTMLElement>("[data-reel-screen]")
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible || visible.intersectionRatio < 0.6) return;

        const idx = Number(visible.target.getAttribute("data-index"));
        if (!Number.isFinite(idx)) return;

        setActiveIndex((prev) => (prev === idx ? prev : idx));
      },
      {
        root: container,
        threshold: [0.6, 0.75, 0.9],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [viewerOpen]);

  useEffect(() => {
    if (!viewerOpen) return;
    setPaused(false);
  }, [activeIndex, viewerOpen]);

  useEffect(() => {
    if (!viewerOpen) return;

    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      video.muted = muted;

      if (index === activeIndex) {
        if (paused) {
          video.pause();
          return;
        }

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
  }, [activeIndex, muted, paused, viewerOpen]);

  if (reels.length === 0) return null;

  const activeReel = reels[activeIndex];

  const gallery = hideGallery ? null : (
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
          href={viewAllHref}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0f3c8c] px-5 text-sm font-bold text-white shadow-sm hover:bg-[#0c2f6d]"
        >
          Ver todos los reels
        </a>
      </div>

      <div className="mt-5 overflow-x-auto pb-2">
        <div className="flex w-max snap-x snap-mandatory gap-4">
          {reels.map((reel, index) => (
            <button
              key={reel.id}
              type="button"
              onClick={() => openReel(index)}
              className="group w-[150px] shrink-0 snap-start overflow-hidden rounded-[22px] border border-slate-200 bg-slate-950 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:w-[160px] md:w-[170px] lg:w-[180px]"
            >
              <div className="relative aspect-[9/16] overflow-hidden">
                <img
                  src={reel.image}
                  alt={reel.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                <div className="absolute left-3 top-3">
                  <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
                    {reel.badge ?? "Reel"}
                  </span>
                </div>

                <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
                  <div className="line-clamp-2 text-xs font-bold leading-snug text-white md:text-sm">
                    {reel.title}
                  </div>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg">
                    <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <>
      {gallery}

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

          {activeReel?.videoUrl ? (
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
          ) : null}

          <div
            ref={viewerRef}
            className="h-[100dvh] overflow-y-auto snap-y snap-mandatory"
          >
            {reels.map((reel, index) => {
              const hasContact =
                Boolean(reel.contactUrl) && reel.contactUrl !== reel.videoUrl;

              return (
                <section
                  key={reel.id}
                  data-reel-screen
                  data-index={index}
                  className="relative flex h-[100dvh] snap-start items-center justify-center bg-black"
                >
                  <div className="relative h-full w-full max-w-[420px] overflow-hidden bg-black">
                    {reel.videoUrl ? (
                      <video
                        ref={(el) => {
                          videoRefs.current[index] = el;
                        }}
                        src={reel.videoUrl}
                        className="h-full w-full cursor-pointer object-cover"
                        autoPlay={index === activeIndex && !paused}
                        loop
                        playsInline
                        muted={muted}
                        preload={
                          Math.abs(index - activeIndex) <= 1 ? "metadata" : "none"
                        }
                        poster={reel.image}
                        onClick={togglePlayback}
                        onCanPlay={(event) => {
                          if (index !== activeIndex || paused) return;
                          event.currentTarget.muted = muted;
                          event.currentTarget.play().catch(() => {});
                        }}
                      />
                    ) : reel.externalPlayerUrl && index === activeIndex ? (
                      <iframe
                        key={`${reel.id}-${activeIndex}`}
                        src={reel.externalPlayerUrl}
                        title={reel.title}
                        className="h-full w-full border-0"
                        allow="autoplay; encrypted-media; picture-in-picture; fullscreen; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => openExternalReel(reel)}
                        className="block h-full w-full"
                        aria-label="Abrir reel original"
                      >
                        <img
                          src={reel.image}
                          alt={reel.title}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    )}

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur">
                      {reel.badge ?? "Reel"}
                    </div>

                    <div className="absolute inset-x-4 bottom-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-end justify-between gap-3">
                          <div>
                            <div className="max-w-[260px] text-lg font-extrabold leading-tight text-white">
                              {reel.title}
                            </div>

                            {reel.businessName ? (
                              <div className="mt-1 text-sm font-bold text-white/90">
                                {reel.businessName}
                                {reel.location ? ` · ${reel.location}` : ""}
                              </div>
                            ) : null}

                            {reel.description ? (
                              <div className="mt-2 line-clamp-2 max-w-[280px] text-sm text-white/75">
                                {reel.description}
                              </div>
                            ) : (
                              <div className="mt-2 text-sm text-white/75">
                                Desliza hacia arriba o abajo para seguir viendo reels.
                              </div>
                            )}
                          </div>

                          {reel.videoUrl ? (
                            <button
                              type="button"
                              onClick={togglePlayback}
                              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-slate-900 shadow-xl"
                              aria-label={paused ? "Reproducir reel" : "Pausar reel"}
                            >
                              {paused ? (
                                <Play className="ml-0.5 h-5 w-5 fill-current" />
                              ) : (
                                <Pause className="h-5 w-5 fill-current" />
                              )}
                            </button>
                          ) : reel.externalPlayerUrl ? null : reel.externalUrl ? (
                            <button
                              type="button"
                              onClick={() => openExternalReel(reel)}
                              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-slate-900 shadow-xl"
                              aria-label="Abrir reel original"
                            >
                              <Play className="ml-0.5 h-5 w-5 fill-current" />
                            </button>
                          ) : null}
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => handleViewListing(reel)}
                            disabled={!reel.href || reel.href === "#"}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-900 shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <ExternalLink className="h-4 w-4" />
                            {reel.ctaLabel ?? "Ver anuncio"}
                          </button>

                          {hasContact ? (
                            <button
                              type="button"
                              onClick={() => handleContact(reel)}
                              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0f3c8c] px-4 py-3 text-sm font-bold text-white shadow-lg"
                            >
                              <MessageCircle className="h-4 w-4" />
                              {reel.contactLabel ?? "Contactar"}
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
}
