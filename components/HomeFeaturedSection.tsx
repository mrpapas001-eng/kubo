"use client";

import type { SponsorAd } from "@prisma/client";
import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import ListingCard from "@/components/ListingCard";
import SponsoredCard from "@/components/SponsoredCard";
import SponsorFeedCard from "@/components/SponsorFeedCard";
import HomePremiumShowcase from "@/components/HomePremiumShowcase";
import ReelsSection, { type ReelItem } from "@/components/ReelsSection";

const RealMap = dynamic(() => import("@/components/RealMap"), { ssr: false });

type Props = {
  listings: any[];
  sideSponsors: SponsorAd[];
  feedSponsors: SponsorAd[];
  reels: ReelItem[];
  cities: string[];
};

type SortMode = "recent" | "popular" | "nearby";

const CITY_COORDS: Record<string, [number, number]> = {
  Pereira: [4.8133, -75.6961],
  Dosquebradas: [4.8392, -75.6673],
  "Santa Rosa de Cabal": [4.8681, -75.6214],
  "La Virginia": [4.8997, -75.8828],
  Cartago: [4.7464, -75.9117],
  Armenia: [4.5339, -75.6811],
  Bogotá: [4.711, -74.0721],
  Medellín: [6.2442, -75.5812],
  Cali: [3.4516, -76.532],
  Barranquilla: [10.9685, -74.7813],
  Cartagena: [10.391, -75.4794],
  Bucaramanga: [7.1193, -73.1227],
  Manizales: [5.0703, -75.5138],
  "Madrid, Cundinamarca": [4.7325, -74.2642],
};

function normalizeText(text: string) {
  return String(text ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getListingPriority(item: any) {
  if (item?.isPremium) return 3;
  if (item?.isFeatured) return 2;
  return 1;
}

export default function HomeFeaturedSection({
  listings,
  sideSponsors,
  feedSponsors,
  reels,
  cities,
}: Props) {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const [extraVisibleCount, setExtraVisibleCount] = useState(8);

  const [allListings, setAllListings] = useState<any[]>(listings ?? []);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreFromServer, setHasMoreFromServer] = useState(true);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const activeCity = selectedCity || "Pereira";
  const center = CITY_COORDS[activeCity] ?? [4.8133, -75.6961];

  const categories = useMemo(() => {
    const unique = new Set<string>();

    allListings?.forEach((item: any) => {
      if (item?.category) unique.add(item.category);
    });

    return Array.from(unique).sort();
  }, [allListings]);

  const sortedListings = useMemo(() => {
    const selected = normalizeText(selectedCity);
    const category = normalizeText(selectedCategory);
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;

    const result = [...(allListings ?? [])].filter((item: any) => {
      const itemCity = normalizeText(item?.city ?? "");
      const itemCategory = normalizeText(item?.category ?? "");
      const itemPrice = Number(item?.price ?? 0);

      const matchesCity = !selected || itemCity === selected;
      const matchesCategory = !category || itemCategory === category;
      const matchesMin = min === null || itemPrice >= min;
      const matchesMax = max === null || itemPrice <= max;

      return matchesCity && matchesCategory && matchesMin && matchesMax;
    });

    result.sort((a: any, b: any) => {
      const priorityDiff = getListingPriority(b) - getListingPriority(a);
      if (priorityDiff !== 0) return priorityDiff;

      if (sortMode === "popular") {
        const viewsDiff = Number(b?.views ?? 0) - Number(a?.views ?? 0);
        if (viewsDiff !== 0) return viewsDiff;
      }

      if (sortMode === "nearby" && selected) {
        const aMatch = normalizeText(a?.city ?? "") === selected ? 1 : 0;
        const bMatch = normalizeText(b?.city ?? "") === selected ? 1 : 0;

        if (bMatch !== aMatch) return bMatch - aMatch;
      }

      return (
        new Date(b?.createdAt ?? 0).getTime() -
        new Date(a?.createdAt ?? 0).getTime()
      );
    });

    return result;
  }, [
    allListings,
    selectedCity,
    selectedCategory,
    minPrice,
    maxPrice,
    sortMode,
  ]);

  const mapListings = useMemo(() => {
    return sortedListings.slice(0, 6).map((item: any, index: number) => ({
      id: item?.id,
      title: item?.title,
      price: item?.price,
      city: item?.city,
      imageUrl: item?.imageUrl,
      lat: item?.lat ?? center[0] + index * 0.01,
      lng: item?.lng ?? center[1] + index * 0.01,
    }));
  }, [sortedListings, center]);

  const topListings = sortedListings.slice(0, 6);
  const extraPool = sortedListings.slice(6);
  const extraListings = extraPool.slice(0, extraVisibleCount);
  const sideSponsor = sideSponsors?.[0] ?? {
    id: "side-demo",
    title: "Claro hogar",
    subtitle: "Fibra óptica para tu hogar con mayor velocidad.",
    imageUrl: "/placeholders/claro-demo.jpg",
    ctaText: "Ver oferta",
    ctaUrl: "#",
  };

  const demoFeedSponsors =
    feedSponsors?.length > 0
      ? feedSponsors
      : [
          {
            id: "feed-demo",
            title: "Claro hogar",
            subtitle: "Fibra óptica para tu hogar con mayor velocidad.",
            imageUrl: "/placeholders/claro-demo.jpg",
            ctaText: "Ver oferta",
            ctaUrl: "#",
          },
        ];

  async function loadMoreFromServer() {
    if (loadingMore || !hasMoreFromServer) return;

    try {
      setLoadingMore(true);

      const res = await fetch(
        `/api/listings?take=12&skip=${allListings.length}&balanced=1`,
      );

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        throw new Error("No se pudieron cargar más anuncios");
      }

      const newListings = Array.isArray(data.items) ? data.items : [];

      if (newListings.length === 0) {
        setHasMoreFromServer(false);
        return;
      }

      setAllListings((prev) => {
        const existingIds = new Set(prev.map((item: any) => item.id));

        const uniqueNew = newListings.filter(
          (item: any) => !existingIds.has(item.id),
        );

        return [...prev, ...uniqueNew];
      });

      if (newListings.length < 12 || data.hasMore === false) {
        setHasMoreFromServer(false);
      }
    } catch (error) {
      console.error("Error cargando más anuncios:", error);
    } finally {
      setLoadingMore(false);
    }
  }

  const hasMoreExtra = extraVisibleCount < extraPool.length;

  useEffect(() => {
  const target = loadMoreRef.current;

  if (!target) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries[0]?.isIntersecting) return;

      if (hasMoreExtra) {
        const nextVisibleCount = Math.min(
          extraVisibleCount + 8,
          extraPool.length,
        );

        setExtraVisibleCount(nextVisibleCount);

        if (
          nextVisibleCount >= extraPool.length &&
          hasMoreFromServer &&
          !loadingMore
        ) {
          loadMoreFromServer();
        }

        return;
      }

      if (hasMoreFromServer && !loadingMore) {
        loadMoreFromServer();
      }
    },
    {
      rootMargin: "300px",
    },
  );

  observer.observe(target);

  return () => observer.disconnect();
}, [
  hasMoreExtra,
  extraPool.length,
  extraVisibleCount,
  hasMoreFromServer,
  loadingMore,
  allListings.length,
]);

  function clearFilters() {
    setSelectedCity("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setExtraVisibleCount(8);
  }

  function getTabClass(tab: SortMode) {
    return sortMode === tab
      ? "rounded-xl bg-[#0f3c8c] px-4 py-2 text-sm font-black text-white shadow-sm"
      : "rounded-xl px-4 py-2 text-sm font-black text-slate-500 transition hover:bg-blue-50 hover:text-[#0f3c8c]";
  }

  function getTitle() {
    if (sortMode === "popular") return "Anuncios populares";
    if (sortMode === "nearby") return "Anuncios cerca de ti";
    return "Anuncios destacados";
  }

  return (
    <section className="mt-6">
      <div className="rounded-[28px] border border-blue-100 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_42%)] p-5 shadow-[0_14px_40px_rgba(15,60,140,0.06)] md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#0f3c8c]">
              Anuncios destacados
            </div>

            <h2 className="mt-2 text-2xl font-black text-slate-900 md:text-3xl">
              {getTitle()}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSortMode("recent")}
              className={getTabClass("recent")}
            >
              Recientes
            </button>

            <button
              type="button"
              onClick={() => setSortMode("popular")}
              className={getTabClass("popular")}
            >
              Populares
            </button>

            <button
              type="button"
              onClick={() => setSortMode("nearby")}
              className={getTabClass("nearby")}
            >
              Cerca de ti
            </button>
          </div>
        </div>

        <div className="hidden mt-5 md:grid md:grid-cols-2 lg:grid-cols-5 gap-3">
          <select
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setExtraVisibleCount(8);
            }}
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm outline-none"
          >
            <option value="">Todas las ciudades</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setExtraVisibleCount(8);
            }}
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm outline-none"
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              setExtraVisibleCount(8);
            }}
            placeholder="Precio mínimo"
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm outline-none"
          />

          <input
            type="number"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              setExtraVisibleCount(8);
            }}
            placeholder="Precio máximo"
            className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm outline-none"
          />

          <button
            type="button"
            onClick={clearFilters}
            className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-black text-slate-600 transition hover:bg-slate-100"
          >
            Limpiar filtros
          </button>
        </div>

        <div className="mt-4 text-sm font-semibold text-slate-500">
          {sortedListings.length} anuncio
          {sortedListings.length === 1 ? "" : "s"} encontrado
          {sortedListings.length === 1 ? "" : "s"}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <p className="mb-5 text-sm text-slate-500">
              Explora anuncios recientes y opciones destacadas cerca de ti.
            </p>

            {topListings.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {topListings.map((item, idx) => (
                  <ListingCard key={`top-${item?.id ?? idx}`} item={item} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
                <h3 className="text-lg font-black text-slate-800">
                  No hay anuncios con esos filtros
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Prueba con otra ciudad, categoría o rango de precio.
                </p>
              </div>
            )}
          </div>

          <aside className="hidden lg:flex lg:flex-col lg:gap-6">
            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Ofertas cerca de ti
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Explora anuncios cercanos en {activeCity}
                    </p>
                  </div>

                  <span className="text-sm font-black text-[#0f3c8c]">
                    Ver en mapa
                  </span>
                </div>
              </div>

              <div className="h-[300px] w-full bg-slate-100">
                {mapListings.length > 0 ? (
                  <RealMap listings={mapListings} center={center} zoom={12} />
                ) : null}
              </div>

              <div className="border-t border-slate-100 px-4 py-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <MapPin className="h-3.5 w-3.5" />
                  Actualizado hace 2 min
                </div>
              </div>
            </div>

            {sideSponsor ? <SponsoredCard sponsor={sideSponsor} /> : null}
          </aside>
        </div>
      </div>

      {sideSponsor ? (
        <div className="mt-5 lg:hidden">
          <SponsoredCard sponsor={sideSponsor} />
        </div>
      ) : null}

      <HomePremiumShowcase listings={listings} />

      <div className="mt-6">
        <ReelsSection items={reels} />
      </div>

      {extraListings.length > 0 ? (
        <div className="mt-6">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-black text-slate-900 md:text-3xl">
              Más anuncios
            </h2>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {extraListings.map((item, idx) => {
              const sponsor =
                demoFeedSponsors.length > 0 && (idx + 1) % 8 === 0
                  ? demoFeedSponsors[
                      Math.floor(idx / 8) % demoFeedSponsors.length
                    ]
                  : null;

              return [
                <ListingCard key={`extra-${item?.id ?? idx}`} item={item} />,
                sponsor ? (
                  <SponsorFeedCard
                    key={`feed-sponsor-${sponsor.id}-${idx}`}
                    sponsor={sponsor}
                  />
                ) : null,
              ];
            })}
          </div>
        </div>
      ) : null}

      <div ref={loadMoreRef} className="h-1 w-full" aria-hidden="true" />
    </section>
  );
}
