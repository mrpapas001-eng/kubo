"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type ListingItem = {
  id: string;
  title?: string;
  price?: number | string | null;
  currency?: string | null;
  lat?: number;
  lng?: number;
};

type Props = {
  listings?: ListingItem[];
  center?: [number, number];
  zoom?: number;
};

function MapUpdater({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: false });
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }, [map, center, zoom]);

  return null;
}

export default function RealMap({
  listings = [],
  center = [4.8143, -75.6946],
  zoom = 12,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const safeListings = useMemo(() => {
    return Array.isArray(listings) ? listings : [];
  }, [listings]);

  const safeCenter = useMemo<[number, number]>(() => {
    const lat = Number(center?.[0] ?? 4.8143);
    const lng = Number(center?.[1] ?? -75.6946);
    return [lat, lng];
  }, [center]);

  if (!mounted) {
    return <div className="h-full w-full bg-slate-100" />;
  }

  return (
    <div className="h-full w-full">
      <MapContainer
        key={`${safeCenter[0]}-${safeCenter[1]}-${zoom}`}
        center={safeCenter}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater center={safeCenter} zoom={zoom} />

        {safeListings.map((l) => {
          const lat = Number(l.lat ?? 0);
          const lng = Number(l.lng ?? 0);

          if (!lat || !lng) return null;

          return (
            <CircleMarker
              key={l.id}
              center={[lat, lng]}
              radius={7}
              pathOptions={{
                color: "#ffffff",
                weight: 3,
                fillColor: "#2563eb",
                fillOpacity: 1,
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
}