"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ListingCard from "@/components/ListingCard";
import ListingCardSkeleton from "@/components/ListingCardSkeleton";
import StateEmpty from "@/components/StateEmpty";
import StateError from "@/components/StateError";

type Props = {
  initialListings: any[];
  sponsors?: any[];
  selectedCity?: string;
  onCityChange?: (city: string) => void;
  cities?: string[];
  variant?: "home" | "category";
  title?: string;
  subtitle?: string;
  sortMode?: "recent" | "popular" | "nearby";
  categorySlug?: string;
};

function parseDetails(details: unknown) {
  try {
    if (!details) return {};
    if (typeof details === "string") return JSON.parse(details);
    if (typeof details === "object") return details;
    return {};
  } catch {
    return {};
  }
}

function dedupeListings(items: any[]) {
  const seen = new Set<string>();
  const result: any[] = [];

  for (const item of items) {
    const id = String(item?.id ?? "");
    if (!id) {
      result.push(item);
      continue;
    }

    if (!seen.has(id)) {
      seen.add(id);
      result.push(item);
    }
  }

  return result;
}

function normalizeText(text: string) {
  return String(text ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function isSponsorVisible(sponsor: any) {
  if (!sponsor) return false;
  if (!sponsor.isActive) return false;

  const now = Date.now();
  const startAt = sponsor.startAt ? new Date(sponsor.startAt).getTime() : null;
  const endAt = sponsor.endAt ? new Date(sponsor.endAt).getTime() : null;

  if (startAt && Number.isFinite(startAt) && now < startAt) return false;
  if (endAt && Number.isFinite(endAt) && now > endAt) return false;

  return true;
}

function SponsorBlock({
  sponsor,
  compact = false,
}: {
  sponsor: any;
  compact?: boolean;
}) {
  if (!sponsor || !isSponsorVisible(sponsor)) return null;

  const imageUrl = sponsor?.imageUrl || "/electrodomesticos-hero.jpg";
  const title = sponsor?.title || "Patrocinado";
  const subtitle = sponsor?.subtitle || "";
  const ctaText = sponsor?.ctaText || "Ver más";
  const ctaUrl = sponsor?.ctaUrl || "/";

  if (compact) {
    return (
      <a
        href={ctaUrl}
        className="group block overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="relative h-[180px] w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />
          <div className="absolute left-3 top-3 rounded-full bg-[#0f3c8c] px-3 py-1 text-xs font-black text-white">
            Patrocinado
          </div>
        </div>

        <div className="space-y-2 p-5">
          <h3 className="text-xl font-black text-slate-900">{title}</h3>
          {subtitle ? (
            <p className="text-sm leading-6 text-slate-600">{subtitle}</p>
          ) : null}
          <span className="inline-flex rounded-xl bg-[#0f3c8c] px-4 py-2 text-sm font-black text-white">
            {ctaText}
          </span>
        </div>
      </a>
    );
  }

  return (
    <a
      href={ctaUrl}
      className="group block overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative min-h-[420px] w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute left-5 top-5 rounded-full bg-[#0f3c8c] px-3 py-1 text-xs font-black text-white">
          Patrocinado
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-4xl font-black tracking-tight">{title}</h3>
          {subtitle ? (
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/90">
              {subtitle}
            </p>
          ) : null}

          <div className="mt-5 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-900">
            {ctaText}
          </div>
        </div>
      </div>
    </a>
  );
}

export default function HomeListingsClient({
  initialListings,
  sponsors = [],
  categorySlug,
  selectedCity = "Pereira",
  onCityChange,
  cities = [],
  variant = "home",
  title,
  subtitle,
  sortMode = "recent",
}: Props) {
  const searchParams = useSearchParams();
  const searchQuery = (searchParams.get("q") ?? "").trim().toLowerCase();

  const isCategoryView = variant === "category";
  const isHomeView = variant === "home";
  const canChangeCity = !isCategoryView && typeof onCityChange === "function";

  const [listings, setListings] = useState<any[]>(initialListings ?? []);
  const [skip, setSkip] = useState<number>((initialListings ?? []).length);
  const [hasMore, setHasMore] = useState<boolean>(
    (initialListings?.length ?? 0) >= 12
  );

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [motorFuel, setMotorFuel] = useState("");
  const [motorTransmission, setMotorTransmission] = useState("");
  const [motorYearMin, setMotorYearMin] = useState("");
  const [motorKmMax, setMotorKmMax] = useState("");
  const [realEstateDeal, setRealEstateDeal] = useState("");
  const [realEstateRoomsMin, setRealEstateRoomsMin] = useState("");
  const [realEstateBathsMin, setRealEstateBathsMin] = useState("");
  const [realEstateSqmMin, setRealEstateSqmMin] = useState("");
  const [realEstateParking, setRealEstateParking] = useState("");
  const [cellBrandFilter, setCellBrandFilter] = useState("");

  useEffect(() => {
    setListings(initialListings ?? []);
    setSkip((initialListings ?? []).length);
    setHasMore((initialListings?.length ?? 0) >= 12);
  }, [initialListings]);

  useEffect(() => {
    if (isCategoryView) return;
    if (!selectedCity) return;
    if (!onCityChange) return;

    let cancelled = false;

    async function loadCityListings() {
      setIsRefreshing(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/listings?take=12&skip=0&city=${encodeURIComponent(selectedCity)}`,
          {
            cache: "no-store",
          }
        );

        const raw = await res.text();
        let data: any = null;

        try {
          data = JSON.parse(raw);
        } catch {
          throw new Error("La API de listings no devolvió JSON válido.");
        }

        if (!res.ok) {
          throw new Error(data?.error ?? `HTTP ${res.status}`);
        }

        const items: any[] = Array.isArray(data?.items) ? data.items : [];

        if (cancelled) return;

        setListings(dedupeListings(items));
        setSkip(typeof data?.nextSkip === "number" ? data.nextSkip : items.length);
        setHasMore(Boolean(data?.hasMore));
      } catch (error: any) {
        console.error("City load failed", error);

        if (!cancelled) {
          setError(error?.message ?? "Error cargando anuncios");
          setListings([]);
          setSkip(0);
          setHasMore(false);
        }
      } finally {
        if (!cancelled) {
          setIsRefreshing(false);
        }
      }
    }

    loadCityListings();

    return () => {
      cancelled = true;
    };
  }, [selectedCity, onCityChange, isCategoryView]);

  async function loadMore() {
    if (isLoadingMore || isRefreshing || !hasMore) return;

    setIsLoadingMore(true);

    try {
      const base = isCategoryView
        ? `/api/listings?take=12&skip=${skip}`
        : `/api/listings?take=12&skip=${skip}&city=${encodeURIComponent(selectedCity)}`;

      const res = await fetch(base, {
        cache: "no-store",
      });

      const raw = await res.text();
      let data: any = null;

      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("La API de listings no devolvió JSON válido.");
      }

      if (!res.ok) {
        throw new Error(data?.error ?? `HTTP ${res.status}`);
      }

      const newItems: any[] = Array.isArray(data?.items) ? data.items : [];

      setListings((prev) => dedupeListings([...prev, ...newItems]));
      setSkip(
        typeof data?.nextSkip === "number" ? data.nextSkip : skip + newItems.length
      );
      setHasMore(Boolean(data?.hasMore));
    } catch (error: any) {
      console.error("Load more failed", error);
      setError("Error cargando más anuncios");
    } finally {
      setIsLoadingMore(false);
    }
  }

  const filteredListings = useMemo(() => {
    let result = [...listings];

    if (searchQuery) {
      const query = normalizeText(searchQuery);

      result = result.filter((item) => {
        const details = parseDetails(item?.details);
        const detailsText = JSON.stringify(details);

        const searchable = normalizeText(
          [
            item?.title,
            item?.description,
            item?.city,
            item?.categorySlug,
            item?.subcategorySlug,
            item?.sellerName,
            item?.ownerName,
            detailsText,
          ].join(" ")
        );

        return searchable.includes(query);
      });
    }
    if (isCategoryView) {
      if (motorFuel || motorTransmission || motorYearMin || motorKmMax) {
        result = result.filter((item) => {
          if (item?.categorySlug !== "motor") return true;

          const details = parseDetails(item?.details);
          const motor = details?.motor ?? {};

          const itemFuel = String(motor?.fuel ?? "");
          const itemTransmission = String(motor?.transmission ?? "");
          const itemYear = Number(motor?.year ?? 0);
          const itemKm = Number(motor?.km ?? 0);

          if (motorFuel && itemFuel !== motorFuel) return false;
          if (motorTransmission && itemTransmission !== motorTransmission) return false;
          if (motorYearMin && itemYear < Number(motorYearMin)) return false;
          if (motorKmMax && itemKm > Number(motorKmMax)) return false;

          return true;
        });
      }
    }
    if (isCategoryView) {
  if (cellBrandFilter) {
    result = result.filter((item) => {
      if (item?.categorySlug !== "celulares") return true;

      const details = parseDetails(item?.details);
      const cell = details?.cellphone ?? {};

      const itemBrand = String(cell?.brand ?? "");

      if (cellBrandFilter && itemBrand !== cellBrandFilter) return false;

      return true;
    });
  }
}
        if (isCategoryView) {
      if (
        realEstateDeal ||
        realEstateRoomsMin ||
        realEstateBathsMin ||
        realEstateSqmMin ||
        realEstateParking
      ) {
        result = result.filter((item) => {
          if (item?.categorySlug !== "inmobiliaria") return true;

          const details = parseDetails(item?.details);
          const realEstate = details?.realEstate ?? {};

          const itemDeal = String(realEstate?.deal ?? "");
          const itemRooms = Number(realEstate?.rooms ?? 0);
          const itemBaths = Number(realEstate?.baths ?? 0);
          const itemSqm = Number(realEstate?.sqm ?? 0);
          const itemParking = Boolean(realEstate?.parking);

          if (realEstateDeal && itemDeal !== realEstateDeal) return false;
          if (realEstateRoomsMin && itemRooms < Number(realEstateRoomsMin)) return false;
          if (realEstateBathsMin && itemBaths < Number(realEstateBathsMin)) return false;
          if (realEstateSqmMin && itemSqm < Number(realEstateSqmMin)) return false;
          if (realEstateParking === "si" && !itemParking) return false;
          if (realEstateParking === "no" && itemParking) return false;

          return true;
        });
      }
    }

    if (sortMode === "popular") {
      result.sort((a: any, b: any) => {
        const aFeatured = a?.featured ? 1 : 0;
        const bFeatured = b?.featured ? 1 : 0;
        const aViews = Number(a?.views ?? 0);
        const bViews = Number(b?.views ?? 0);

        if (bFeatured !== aFeatured) return bFeatured - aFeatured;
        if (bViews !== aViews) return bViews - aViews;

        return (
          new Date(b?.createdAt ?? 0).getTime() -
          new Date(a?.createdAt ?? 0).getTime()
        );
      });
    } else if (sortMode === "nearby") {
      result.sort((a: any, b: any) => {
        const aCity = normalizeText(a?.city ?? "");
        const bCity = normalizeText(b?.city ?? "");
        const selected = normalizeText(selectedCity ?? "");

        const aMatch = aCity === selected ? 1 : 0;
        const bMatch = bCity === selected ? 1 : 0;

        if (bMatch !== aMatch) return bMatch - aMatch;

        return (
          new Date(b?.createdAt ?? 0).getTime() -
          new Date(a?.createdAt ?? 0).getTime()
        );
      });
    } else {
      result.sort((a: any, b: any) => {
        return (
          new Date(b?.createdAt ?? 0).getTime() -
          new Date(a?.createdAt ?? 0).getTime()
        );
      });
    }

    return result;
  }, [listings, searchQuery, sortMode, selectedCity]);

  const primarySponsor = sponsors.find((s) => isSponsorVisible(s)) ?? null;
  const secondarySponsor =
    sponsors.filter((s) => isSponsorVisible(s))[1] ?? null;

  const firstGrid = isHomeView ? filteredListings.slice(0, 6) : filteredListings;
  const sideListing = isHomeView ? filteredListings[6] : null;
  const secondGrid = isHomeView ? filteredListings.slice(7, 13) : [];
  const remainingGrid = isHomeView ? filteredListings.slice(13) : [];

  const headerTitle = title
    ? title
    : isCategoryView
    ? "Anuncios disponibles"
    : `Resultados en ${selectedCity}`;

  const headerSubtitle = subtitle
    ? subtitle
    : isCategoryView
    ? "Explora publicaciones reales dentro de esta sección."
    : searchQuery
    ? `Mostrando resultados para “${searchQuery}” en ${selectedCity}`
    : "Explora anuncios recientes y opciones destacadas cerca de ti.";

  return (
    <section className="min-w-0">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
              {headerTitle}
            </h2>

            <p className="mt-2 text-sm text-slate-500">{headerSubtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {canChangeCity ? (
              <select
                value={selectedCity}
                onChange={(e) => onCityChange?.(e.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm outline-none"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            ) : null}

            <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
              {filteredListings.length} resultados
            </div>
          </div>
        </div>

        {isCategoryView && categorySlug === "motor" ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 text-sm font-black text-slate-900">
              Filtros de motor
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <select
                value={motorFuel}
                onChange={(e) => setMotorFuel(e.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"
              >
                <option value="">Combustible</option>
                <option value="Gasolina">Gasolina</option>
                <option value="Diésel">Diésel</option>
                <option value="Gas">Gas</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Eléctrico">Eléctrico</option>
                <option value="Eléctrica">Eléctrica</option>
              </select>

              <select
                value={motorTransmission}
                onChange={(e) => setMotorTransmission(e.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"
              >
                <option value="">Transmisión</option>
                <option value="Mecánica">Mecánica</option>
                <option value="Automática">Automática</option>
                <option value="Semiautomática">Semiautomática</option>
              </select>

              <input
                value={motorYearMin}
                onChange={(e) => setMotorYearMin(e.target.value.replace(/\D/g, ""))}
                placeholder="Año mínimo"
                inputMode="numeric"
                className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700"
              />

              <input
                value={motorKmMax}
                onChange={(e) => setMotorKmMax(e.target.value.replace(/\D/g, ""))}
                placeholder="Km máximo"
                inputMode="numeric"
                className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setMotorFuel("");
                setMotorTransmission("");
                setMotorYearMin("");
                setMotorKmMax("");
              }}
              className="mt-3 rounded-xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-200"
            >
              Limpiar filtros
            </button>
          </div>
        ) : null}
        {isRefreshing ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ListingCardSkeleton key={`refresh-sk-${i}`} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <StateError
              message={error}
              onRetry={() => window.location.reload()}
            />
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <StateEmpty
              title={
                searchQuery
                  ? "No encontramos resultados para tu búsqueda"
                  : "No hay anuncios disponibles"
              }
              subtitle={
                searchQuery
                  ? "Prueba con menos palabras o cambia los filtros."
                  : isCategoryView
                  ? "Todavía no hay anuncios en esta sección."
                  : `Todavía no hay anuncios en ${selectedCity}.`
              }
            />
          </div>
        ) : isHomeView ? (
          <div className="space-y-6">
            {firstGrid.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {firstGrid.map((item, idx) => (
                  <ListingCard key={`${item?.id ?? idx}`} item={item} />
                ))}
              </div>
            ) : null}
{isCategoryView && categorySlug === "inmobiliaria" ? (
  <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-3 text-sm font-black text-slate-900">
      Filtros de inmobiliaria
    </div>

    <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
      <select
        value={realEstateDeal}
        onChange={(e) => setRealEstateDeal(e.target.value)}
        className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"
      >
        <option value="">Venta / arriendo</option>
        <option value="venta">Venta</option>
        <option value="arriendo">Arriendo</option>
      </select>

      <input
        value={realEstateRoomsMin}
        onChange={(e) => setRealEstateRoomsMin(e.target.value.replace(/\D/g, ""))}
        placeholder="Alcobas mín."
        inputMode="numeric"
        className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700"
      />

      <input
        value={realEstateBathsMin}
        onChange={(e) => setRealEstateBathsMin(e.target.value.replace(/\D/g, ""))}
        placeholder="Baños mín."
        inputMode="numeric"
        className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700"
      />

      <input
        value={realEstateSqmMin}
        onChange={(e) => setRealEstateSqmMin(e.target.value.replace(/\D/g, ""))}
        placeholder="Metros² mín."
        inputMode="numeric"
        className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700"
      />

      <select
        value={realEstateParking}
        onChange={(e) => setRealEstateParking(e.target.value)}
        className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"
      >
        <option value="">Parqueadero</option>
        <option value="si">Con parqueadero</option>
        <option value="no">Sin parqueadero</option>
      </select>
    </div>

    <button
      type="button"
      onClick={() => {
        setRealEstateDeal("");
        setRealEstateRoomsMin("");
        setRealEstateBathsMin("");
        setRealEstateSqmMin("");
        setRealEstateParking("");
      }}
      className="mt-3 rounded-xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-200"
    >
      Limpiar filtros
    </button>
  </div>
) : null}
{isCategoryView && categorySlug === "celulares" ? (
  <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="mb-3 text-sm font-black text-slate-900">
      Filtros de celulares
    </div>

    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <select
        value={cellBrandFilter}
        onChange={(e) => setCellBrandFilter(e.target.value)}
        className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"
      >
        <option value="">Marca</option>
        <option value="SAMSUNG">Samsung</option>
        <option value="APPLE">Apple</option>
        <option value="XIAOMI">Xiaomi</option>
        <option value="MOTOROLA">Motorola</option>
        <option value="HUAWEI">Huawei</option>
        <option value="OPPO">Oppo</option>
        <option value="VIVO">Vivo</option>
        <option value="REALME">Realme</option>
        <option value="NOKIA">Nokia</option>
        <option value="LG">LG</option>
        <option value="OTRA">Otra</option>
      </select>
    </div>

    <button
      type="button"
      onClick={() => setCellBrandFilter("")}
      className="mt-3 rounded-xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-200"
    >
      Limpiar filtros
    </button>
  </div>
) : null}

            {primarySponsor || sideListing ? (
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
                <div className="xl:col-span-3">
                  {primarySponsor ? (
                    <SponsorBlock sponsor={primarySponsor} />
                  ) : (
                    <div className="h-full min-h-[420px] rounded-[28px] border border-dashed border-slate-300 bg-slate-50" />
                  )}
                </div>

                <div className="xl:col-span-1">
                  {sideListing ? (
                    <ListingCard item={sideListing} />
                  ) : (
                    <div className="h-full min-h-[420px] rounded-[28px] border border-dashed border-slate-300 bg-slate-50" />
                  )}
                </div>
              </div>
            ) : null}

            {secondGrid.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {secondGrid.map((item, idx) => (
                  <ListingCard key={`${item?.id ?? idx}`} item={item} />
                ))}
              </div>
            ) : null}

            {secondarySponsor ? (
              <SponsorBlock sponsor={secondarySponsor} compact />
            ) : null}

            {remainingGrid.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {remainingGrid.map((item, idx) => (
                  <ListingCard key={`${item?.id ?? idx}`} item={item} />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredListings.map((item, idx) => (
              <ListingCard key={`${item?.id ?? idx}`} item={item} />
            ))}
          </div>
        )}

        <div className="flex justify-center pt-2">
          {hasMore ? (
            <button
              onClick={loadMore}
              disabled={isLoadingMore || isRefreshing}
              className="h-11 rounded-xl bg-[#0f3c8c] px-6 text-sm font-bold text-white shadow-sm transition hover:bg-[#0c2f6d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoadingMore ? "Cargando..." : "Cargar más"}
            </button>
          ) : filteredListings.length > 0 ? (
            <div className="text-sm font-medium text-slate-500">
              No hay más anuncios por ahora.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}