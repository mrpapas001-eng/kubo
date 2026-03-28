import Link from "next/link";
import Image from "next/image";
import { Building2, MapPin, ShieldCheck } from "lucide-react";
import FavoriteButton from "./FavoriteButton";

export default function ListingCard({ item }: { item: any }) {
  if (!item) return null;

  const image = item?.imageUrl ?? "/placeholders/listing.jpg";

  const formattedPrice =
    typeof item?.price === "number"
      ? new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: item?.currency ?? "COP",
          maximumFractionDigits: 0,
        }).format(item.price)
      : "Consultar precio";

  const href = item?.id ? `/listing/${item.id}` : "#";

  let details: any = {};
  try {
    details =
      typeof item?.details === "string"
        ? JSON.parse(item.details)
        : item?.details ?? {};
  } catch {
    details = item?.details ?? {};
  }

  const city = item?.city ?? "Sin ciudad";
  const distance = item?.distance ?? null;

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
    if (km) {
      parts.push(`${new Intl.NumberFormat("es-CO").format(Number(km))} km`);
    }

    extraLine = parts.join(" · ");
  }

  if (item?.categorySlug === "inmobiliaria") {
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
  }

  if (
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
    item?.sellerName ??
    (item?.sellerType === "PARTICULAR"
      ? "Particular"
      : "Empresa verificada");

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-60 w-full overflow-hidden bg-slate-100">
        <FavoriteButton listingId={item.id} />

        {item.featured && (
          <div className="absolute left-3 top-3 z-20 rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-yellow-900 shadow">
            DESTACADO
          </div>
        )}

        <Image
          src={image}
          alt={item?.title ?? "Anuncio"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-transparent" />

        {distance ? (
          <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-[13px] font-bold text-slate-800 shadow-lg backdrop-blur-md ring-1 ring-black/5">
            <MapPin className="h-4 w-4 text-[#0f3c8c]" />
            {distance}
          </div>
        ) : null}
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 min-h-[56px] text-[18px] font-extrabold leading-tight text-slate-900">
          {item?.title ?? "Sin título"}
        </h3>

        <div className="mt-2 flex items-start gap-2 text-[15px] font-medium text-slate-500">
          <MapPin className="mt-[3px] h-4 w-4 text-slate-400" />
          <div className="leading-tight">
            <div>{city}</div>
            {extraLine ? (
              <div className="mt-1 text-[14px] text-slate-500">{extraLine}</div>
            ) : null}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-[15px] font-medium text-slate-500">
          <ShieldCheck className="h-4 w-4 text-[#0f3c8c]" />
          <span>
            {item?.sellerType === "PARTICULAR"
              ? "Particular"
              : "Empresa verificada"}
          </span>
        </div>

        <div className="mt-3 border-t border-slate-200 pt-3">
          <div className="flex items-end justify-between gap-3">
            <div className="text-[20px] font-extrabold tracking-tight text-slate-900 md:text-[24px]">
              {formattedPrice}
            </div>
          </div>
        </div>

        <div className="mt-3 overflow-hidden rounded-2xl bg-[#0f3c8c] text-white">
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-2 px-4 py-3">
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="truncate text-[15px] font-bold">
                {sellerName}
              </span>
            </div>

            {distance ? (
              <div className="border-l border-white/10 bg-[#0c2f6d] px-4 py-3 text-[14px] font-bold">
                {distance}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}