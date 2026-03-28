"use client";

import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
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

export default function HomeMapSection({
  initialListings,
  sponsors,
  initialCity,
  cities,
}: Props) {
  const [selectedCity, setSelectedCity] = useState(initialCity);

  const center = CITY_COORDS[selectedCity] ?? [4.8133, -75.6961];

  const mapListings = useMemo(() => {
    return (initialListings ?? []).map((item: any, index: number) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      city: item.city,
      lat: item.lat ?? center[0] + index * 0.01,
      lng: item.lng ?? center[1] + index * 0.01,
    }));
  }, [initialListings, center]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <div className="min-w-0">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-[52px]">
              Encuentra lo que buscas cerca de ti
            </h1>
            <p className="mt-2 text-[15px] font-medium text-slate-500">
              Mostrando resultados en el radio de 5 km
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

      <aside className="hidden lg:flex self-start lg:sticky lg:top-24 lg:flex-col lg:gap-6">
        <div className="relative h-[600px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
          <RealMap listings={mapListings} center={center} zoom={12} />
        </div>
      </aside>
    </div>
  );
}