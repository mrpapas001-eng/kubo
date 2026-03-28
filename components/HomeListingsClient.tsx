"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ListingCard from "@/components/ListingCard";
import SponsoredBanner from "@/components/SponsoredBanner";
import SponsoredCard from "@/components/SponsoredCard";
import ListingCardSkeleton from "@/components/ListingCardSkeleton";

type Props = {
  initialListings: any[];
  sponsors: any[];
  selectedCity: string;
  onCityChange: (city: string) => void;
  cities: string[];
};

export default function HomeListingsClient({
  initialListings,
  sponsors,
  selectedCity,
  onCityChange,
  cities,
}: Props) {
  const searchParams = useSearchParams();
  const searchQuery = (searchParams.get("q") ?? "").trim().toLowerCase();

  const [listings, setListings] = useState<any[]>(initialListings ?? []);
  const [skip, setSkip] = useState<number>((initialListings ?? []).length);
  const [hasMore, setHasMore] = useState<boolean>(
    (initialListings?.length ?? 0) >= 12
  );

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCityListings() {
      setIsRefreshing(true);

      try {
        const res = await fetch(
          `/api/listings?take=12&skip=0&city=${encodeURIComponent(selectedCity)}`,
          {
            cache: "no-store",
          }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const items: any[] = Array.isArray(data.items) ? data.items : [];

        if (cancelled) return;

        setListings(items);
        setSkip(data.nextSkip ?? items.length);
        setHasMore(Boolean(data.hasMore));
      } catch (error) {
        console.error("City load failed", error);

        if (!cancelled) {
          setListings([]);
          setSkip(0);
          setHasMore(false);
        }
      } finally {
        if (!cancelled) setIsRefreshing(false);
      }
    }

    loadCityListings();

    return () => {
      cancelled = true;
    };
  }, [selectedCity]);

  async function loadMore() {
    if (isLoadingMore || isRefreshing || !hasMore) return;

    setIsLoadingMore(true);

    try {
      const res = await fetch(
        `/api/listings?take=12&skip=${skip}&city=${encodeURIComponent(selectedCity)}`,
        {
          cache: "no-store",
        }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const newItems: any[] = Array.isArray(data.items) ? data.items : [];

      setListings((prev) => [...prev, ...newItems]);
      setSkip(data.nextSkip ?? skip + newItems.length);
      setHasMore(Boolean(data.hasMore));
    } catch (error) {
      console.error("Load more failed", error);
    } finally {
      setIsLoadingMore(false);
    }
  }

  const filteredListings = useMemo(() => {
    if (!searchQuery) return listings;

    return listings.filter((item) => {
      let detailsText = "";

      try {
        const parsed =
          typeof item?.details === "string"
            ? JSON.parse(item.details)
            : item?.details ?? {};
        detailsText = JSON.stringify(parsed).toLowerCase();
      } catch {
        detailsText = "";
      }

      const searchable = [
        item?.title ?? "",
        item?.description ?? "",
        item?.city ?? "",
        item?.categorySlug ?? "",
        item?.subcategorySlug ?? "",
        item?.sellerName ?? "",
        detailsText,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(searchQuery);
    });
  }, [listings, searchQuery]);

  const first = filteredListings.slice(0, 3);
  const rest = filteredListings.slice(3);

  return (
    <section className="min-w-0">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="text-sm font-medium text-slate-500">
          Resultados en{" "}
          <span className="font-bold text-slate-800">{selectedCity}</span>
          {searchQuery ? (
            <>
              {" "}
              para{" "}
              <span className="font-bold text-slate-800">“{searchQuery}”</span>
            </>
          ) : null}
        </div>

        <select
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 shadow-sm"
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <SponsoredBanner sponsors={sponsors} />
      </div>

      {isRefreshing ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ListingCardSkeleton key={`refresh-sk-${i}`} />
          ))}
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="text-base font-black text-slate-900">
            No encontramos resultados
          </div>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Prueba con otra ciudad o busca con menos palabras.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {first.map((item, idx) => (
            <ListingCard key={`first-${item.id ?? idx}`} item={item} />
          ))}

          {!searchQuery && sponsors?.length > 0 ? (
            <SponsoredCard sponsors={sponsors} />
          ) : null}

          {rest.map((item, idx) => (
            <ListingCard key={`rest-${item.id ?? idx}`} item={item} />
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-center pb-10">
        {hasMore ? (
          <button
            onClick={loadMore}
            disabled={isLoadingMore || isRefreshing}
            className="h-11 rounded-xl bg-[#0f3c8c] px-6 text-sm font-bold text-white shadow-sm hover:bg-[#0c2f6d] disabled:opacity-60"
          >
            {isLoadingMore ? "Cargando..." : "Cargar más"}
          </button>
        ) : filteredListings.length > 0 ? (
          <div className="text-sm font-medium text-slate-500">
            No hay más anuncios por ahora.
          </div>
        ) : null}
      </div>
    </section>
  );
}