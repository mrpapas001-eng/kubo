// components/RealMap.tsx
"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Importar imágenes de marker (el bundler las resolverá en cliente)
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

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

export default function RealMap({
  listings = [],
  center = [4.8143, -75.6946],
  zoom = 12,
}: Props) {
  useEffect(() => {
    // importar CSS sólo en cliente
    import("leaflet/dist/leaflet.css");

    // Fix iconos por defecto de Leaflet (necesario en bundlers modernos)
    // eliminamos _getIconUrl para forzar mergeOptions a funcionar
    try {
      // @ts-ignore
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl,
        iconUrl,
        shadowUrl,
      });
    } catch (e) {
      // no hacer nada si falla — esto sólo es un fallback
      // console.warn("Leaflet icon merge failed", e);
    }
  }, []);

  return (
    <div className="h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {Array.isArray(listings) &&
          listings.map((l) => {
            const lat = Number(l.lat ?? 0);
            const lng = Number(l.lng ?? 0);
            if (!lat || !lng) return null;

            const priceText =
              typeof l.price === "number"
                ? new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: l.currency ?? "COP",
                    maximumFractionDigits: 0,
                  }).format(l.price)
                : l.price ?? "";

            return (
              <Marker key={l.id} position={[lat, lng]}>
                <Popup>
                  <div className="max-w-xs">
                    <div className="font-bold">{l.title ?? "Anuncio"}</div>
                    {priceText ? <div className="mt-1">{priceText}</div> : null}
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
}