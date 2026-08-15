"use client";

import { useMemo, useState } from "react";
import { MapPin, ChevronRight } from "lucide-react";
import ReelsSection, { type ReelItem } from "@/components/ReelsSection";
import HomeListingsClient from "@/components/HomeListingsClient";
import dynamic from "next/dynamic";

const RealMap = dynamic(() => import("@/components/RealMap"), { ssr: false });

type Props = {
  initialListings: any[];
  sponsors: any[];
  initialCity: string;
  cities: string[];
};

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

function getListingVideo(item: any, details: any) {
  return (
    item?.videoUrl ||
    item?.video ||
    details?.videoUrl ||
    details?.video ||
    details?.reelVideo ||
    details?.media?.video ||
    details?.media?.videoUrl ||
    null
  );
}

function getListingImages(item: any, details: any) {
  const detailImages = Array.isArray(details?.images) ? details.images : [];
  const mediaImages = Array.isArray(details?.media?.images)
    ? details.media.images
    : [];
  const all = [item?.imageUrl, ...detailImages, ...mediaImages].filter(Boolean);
  return all;
}

function buildWhatsappUrl(item: any) {
  const rawPhone = String(item?.phone ?? item?.sellerPhone ?? "").trim();
  const cleanPhone = rawPhone.replace(/\D/g, "");

  if (!cleanPhone) return null;

  return `https://wa.me/57${cleanPhone}?text=${encodeURIComponent(
    `Hola, me interesa este anuncio: ${item?.title ?? "Anuncio"}`
  )}`;
}

export default function HomeMapSection({
  initialListings,
  sponsors,
  initialCity,
  cities,
}: Props) {
  const [selectedCity, setSelectedCity] = useState(initialCity);

  const center = CITY_COORDS[selectedCity] ?? [4.8133, -75.6961];

const mapListings = useMemo(() => {
  return (initialListings ?? [])
    .filter((item: any) => item.lat && item.lng) // 👈 solo los que tienen coordenadas reales
    .map((item: any) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      city: item.city,
      imageUrl: item.imageUrl,
      lat: item.lat,
      lng: item.lng,
    }));
}, [initialListings]);

  const reelItems = useMemo<ReelItem[]>(() => {
    return (initialListings ?? [])
      .map((item: any) => {
        const details = parseDetails(item?.details);
        const videoUrl = getListingVideo(item, details);
        const images = getListingImages(item, details);
        const image = images[0] || "/placeholders/listing.jpg";

        if (!videoUrl) return null;

        return {
          id: item.id,
          title: item.title || "Anuncio",
          image,
          videoUrl,
          badge: "Reel",
          href: item?.id ? `/listing/${item.id}` : null,
          contactLabel: "Contactar",
          contactUrl: buildWhatsappUrl(item),
        };
      })
      .filter(Boolean) as ReelItem[];
  }, [initialListings]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="min-w-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                Resultados
              </div>
              <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-4xl">
                Explora anuncios cerca de ti
              </h2>
              <p className="mt-2 text-[15px] font-medium text-slate-500">
                Mostrando resultados en el radio de 5 km en {selectedCity}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="flex h-[56px] items-center rounded-2xl border border-slate-200 bg-white px-4 shadow-sm">
            <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
              <MapPin className="h-4 w-4 text-[#0f3c8c]" />
              <span className="text-[16px] font-bold text-slate-800">
                {selectedCity}
              </span>
            </div>

            <div className="flex flex-1 items-center gap-3 pl-4">
              <input
                type="range"
                min="1"
                max="5"
                defaultValue="5"
                className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-[#0f3c8c] accent-[#0f3c8c]"
              />
              <span className="whitespace-nowrap text-[14px] font-medium text-slate-500">
                5 km
              </span>
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <HomeListingsClient
            initialListings={initialListings}
            sponsors={sponsors}
            selectedCity={selectedCity}
            onCityChange={setSelectedCity}
            cities={cities}
          />
        </div>

        <aside className="hidden self-start lg:sticky lg:top-24 lg:flex lg:flex-col lg:gap-6">
          <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Mapa de anuncios
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Explora opciones cercanas en {selectedCity}
                </p>
              </div>
            </div>

            <div className="relative h-[600px] w-full overflow-hidden bg-slate-100">
              {mapListings.length > 0 ? (
                <RealMap listings={mapListings} center={center} zoom={12} />
              ) : null}

              <div className="pointer-events-none absolute inset-x-4 bottom-4 z-[500]">
                <div className="rounded-2xl bg-white/95 px-4 py-4 shadow-lg backdrop-blur">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-base font-extrabold text-slate-900">
                        Ofertas cerca de ti
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        Ubica anuncios rápidamente en el mapa.
                      </div>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <ReelsSection items={reelItems.length > 0 ? reelItems : undefined} />
    </div>
  );
}