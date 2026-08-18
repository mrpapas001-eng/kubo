"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  MapPin,
  ShieldCheck,
  Clock3,
  Gauge,
  Fuel,
  Settings,
  CalendarDays,
  Crown,
  BadgeCheck,
} from "lucide-react";
import FavoriteButton from "./FavoriteButton";

type ListingCardProps = {
  item: any;
  hideLocationBelowTitleOnMobile?: boolean;
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

function formatPrice(price: unknown, currency?: string, details?: unknown) {
  const numeric = Number(price);
  const parsedDetails = parseDetails(details);
  const isDonation = parsedDetails?.kuboAyuda?.type === "DONATION";

  if (isDonation) {
    return "GRATIS";
  }

  if (!Number.isNaN(numeric) && numeric > 0) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: currency ?? "COP",
      maximumFractionDigits: 0,
    }).format(numeric);
  }

  return "Consultar precio";
}

function formatPublishedDate(value: unknown) {
  if (!value) return null;

  const date = new Date(value as string);
  if (Number.isNaN(date.getTime())) return null;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  if (diffDays === 0) return "Publicado hoy";
  if (diffDays === 1) return "Publicado hace 1 día";
  if (diffDays < 30) return `Publicado hace ${diffDays} días`;

  return `Publicado el ${date.toLocaleDateString("es-CO")}`;
}

export default function ListingCard({
  item,
  hideLocationBelowTitleOnMobile = false,
}: ListingCardProps) {
  if (!item) return null;

  const now = new Date();

  const isPremium =
    Boolean(item?.isPremium) &&
    Boolean(item?.premiumUntil) &&
    new Date(item.premiumUntil).getTime() > now.getTime();

  const isFeatured =
    Boolean(item?.isFeatured) &&
    Boolean(item?.featuredUntil) &&
    new Date(item.featuredUntil).getTime() > now.getTime();

  const isBusiness = Boolean(item?.isBusiness);
  const accountVerificationType = item?.accountVerificationType;
  const businessVerified = accountVerificationType === "EMPRESA";
  const identityVerified = accountVerificationType === "PARTICULAR";

  const image = item?.imageUrl || "/placeholders/listing.jpg";
  const href = item?.id ? `/listing/${item.id}` : "#";
  const details: any = parseDetails(item?.details);
  const formattedPrice = formatPrice(item?.price, item?.currency, details);
  const isDonation = details?.kuboAyuda?.type === "DONATION";
  const reelUrl = typeof details?.reelUrl === "string" ? details.reelUrl : "";

  const motor = details?.motor || {};

  const km =
    motor?.km !== null && motor?.km !== undefined
      ? `${new Intl.NumberFormat("es-CO").format(Number(motor.km))} km`
      : null;

  const fuel = motor?.fuel || motor?.fuelType || null;
  const transmission = motor?.transmission || null;
  const year = motor?.year || null;

  const isMotor =
    item?.categorySlug === "motor" &&
    ["carros", "motos"].includes(item?.subcategorySlug);

  const city = item?.city || "Sin ciudad";
  const distance = item?.distance || null;
  const publishedLabel = formatPublishedDate(item?.createdAt);

  let extraLine = "";

  if (
    item?.categorySlug === "motor" &&
    ["carros", "motos"].includes(item?.subcategorySlug)
  ) {
    const brand = details?.motor?.brand;
    const model = details?.motor?.model;
    const year = details?.motor?.year;
    const km = details?.motor?.km;

    const parts: string[] = [];

    if (brand) parts.push(String(brand));
    if (model) parts.push(String(model));
    if (year) parts.push(String(year));
    if (km !== null && km !== undefined && km !== "") {
      parts.push(`${new Intl.NumberFormat("es-CO").format(Number(km))} km`);
    }

    extraLine = parts.join(" · ");
  } else if (item?.categorySlug === "inmobiliaria") {
    const rooms = details?.realEstate?.rooms;
    const baths = details?.realEstate?.baths;
    const sqm = details?.realEstate?.sqm;
    const deal = details?.realEstate?.deal;

    const parts: string[] = [];

    if (deal) parts.push(deal === "arriendo" ? "Arriendo" : "Venta");
    if (rooms) parts.push(`${rooms} hab.`);
    if (baths) parts.push(`${baths} baños`);
    if (sqm) parts.push(`${sqm} m²`);

    extraLine = parts.join(" · ");
  } else if (
    item?.categorySlug === "celulares" &&
    item?.subcategorySlug === "celulares"
  ) {
    const brand = details?.cellphone?.brand;
    const model = details?.cellphone?.model;

    const parts: string[] = [];

    if (brand) parts.push(String(brand));
    if (model) parts.push(String(model));

    extraLine = parts.join(" · ");
  }

  const sellerName =
    item?.businessName?.trim() ||
    item?.ownerName?.trim() ||
    item?.sellerName?.trim() ||
    (isBusiness ? "Empresa" : "Particular");

  const sellerLabel = businessVerified
    ? "Empresa verificada"
    : "Usuario verificado";

  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden rounded-[24px] transition-all duration-300 hover:-translate-y-1 ${
        isPremium
          ? "border-2 border-yellow-400 bg-gradient-to-b from-yellow-50 via-white to-white shadow-[0_18px_60px_rgba(245,158,11,0.28)] hover:shadow-[0_26px_90px_rgba(245,158,11,0.38)]"
          : isFeatured
            ? "border border-[#0f3c8c]/30 bg-white shadow-[0_18px_55px_rgba(15,60,140,0.18)]"
            : "border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]"
      }`}
    >
      {isPremium ? (
        <div className="absolute left-0 top-0 z-30 rounded-br-[24px] bg-gradient-to-r from-yellow-300 to-yellow-500 px-5 py-3 text-sm font-black uppercase tracking-wide text-slate-950 shadow-[0_10px_30px_rgba(245,158,11,0.35)]">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Premium
          </div>
        </div>
      ) : null}

      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-[22px] bg-slate-100">
        {item?.id ? <FavoriteButton listingId={item.id} /> : null}

                {isDonation ? (
          <div className="absolute left-3 top-3 z-30 rounded-full bg-amber-400 px-3 py-1.5 text-[11px] font-black tracking-wide text-slate-900 shadow-sm ring-1 ring-black/5 backdrop-blur">
            💛 DONACIÓN
          </div>
        ) : isFeatured && !isPremium ? (
          <div className="absolute left-3 top-3 z-20 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-black tracking-wide text-slate-900 shadow-sm ring-1 ring-black/5 backdrop-blur">
            DESTACADO
          </div>
        ) : null}


        <Image
          src={image}
          alt={item?.title || "Anuncio"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 ${
            isPremium ? "group-hover:scale-[1.06]" : "group-hover:scale-[1.03]"
          }`}
        />

        <div
          className={
            isPremium
              ? "absolute inset-0 bg-gradient-to-t from-yellow-300/30 via-transparent to-transparent"
              : "absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
          }
        />

        {distance ? (
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <MapPin className="h-3.5 w-3.5 text-[#0f3c8c]" />
            {distance}
          </div>
        ) : null}

        {reelUrl ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(reelUrl, "_blank", "noopener,noreferrer");
            }}
            className="absolute bottom-3 right-3 z-20 rounded-full bg-black/70 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-white shadow-md backdrop-blur hover:bg-black"
          >
            ▶ Ver reel
          </button>
        ) : null}
      </div>

      <div className="space-y-3 p-4">
        <div className="space-y-1.5">
          <h3
            className={`line-clamp-2 min-h-[48px] text-[18px] font-extrabold leading-snug ${
              isPremium ? "text-slate-950" : "text-slate-900"
            }`}
          >
            {item?.title || "Sin título"}
          </h3>

          <div
            className={`text-sm font-medium text-slate-500 ${
              hideLocationBelowTitleOnMobile ? "hidden md:block" : ""
            }`}
          >
            {extraLine || city}
          </div>

          {accountVerificationType ? (
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-black shadow-sm ${
                  businessVerified ? "bg-[#0f3c8c] text-white" : "bg-emerald-600 text-white"
                }`}
              >
                <BadgeCheck className="h-3.5 w-3.5" />
                {sellerLabel}
              </span>
            </div>
          ) : null}



        </div>

        <div
          className={`flex items-end justify-between gap-3 border-t pt-3 ${
            isPremium ? "border-yellow-200" : "border-slate-100"
          }`}
        >
          <div
            className={`text-[23px] font-black tracking-tight ${
              isPremium
                ? "bg-gradient-to-r from-violet-700 to-blue-600 bg-clip-text text-transparent"
                : "text-slate-900"
            }`}
          >
            {formattedPrice}
          </div>

          <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500">
            <MapPin className="h-4 w-4 text-slate-400" />
            {city}
          </div>
        </div>
      </div>
    </Link>
  );
}
