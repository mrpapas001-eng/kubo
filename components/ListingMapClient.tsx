"use client";

import dynamic from "next/dynamic";

const ListingMap = dynamic(() => import("@/components/ListingMap"), {
  ssr: false,
});

type Props = {
  lat: number;
  lng: number;
  title: string;
};

export default function ListingMapClient({ lat, lng, title }: Props) {
  return <ListingMap lat={lat} lng={lng} title={title} />;
}