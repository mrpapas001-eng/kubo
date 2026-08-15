import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Phone,
  MessageCircle,
  ShieldCheck,
  Eye,
  Gauge,
  Fuel,
  Settings,
  CalendarDays,
  Crown,
  Camera,
} from "lucide-react";

import { prisma } from "@/lib/db";
import ListingGallery from "@/components/ListingGallery";
import ListingCard from "@/components/ListingCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import ListingMapClient from "@/components/ListingMapClient";
import StartChatButton from "@/components/StartChatButton";
import ReportListingModal from "@/components/ReportListingModal";
import MobileListingActions from "@/components/MobileListingActions";
import FavoriteButton from "@/components/FavoriteButton";

type PageProps = {
  params: Promise<{ id: string }>;
};

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000"
  );
}

function buildPrice(listing: any) {
  if (typeof listing.price === "number") {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: listing.currency ?? "COP",
      maximumFractionDigits: 0,
    }).format(listing.price);
  }

  return listing.price ? String(listing.price) : "Precio a convenir";
}

function buildDescription(listing: any) {
  const parts = [
    listing.title,
    listing.city ? `en ${listing.city}` : "",
    listing.price ? `por ${buildPrice(listing)}` : "",
  ].filter(Boolean);

  const fallback = parts.join(" ");
  const raw = String(listing.description ?? "").trim();
  const finalText = raw || fallback || "Anuncio disponible en Kubo Anuncios";

  return finalText.length > 160 ? `${finalText.slice(0, 157)}...` : finalText;
}

function normalizeCityKey(value: string) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

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

function formatPublishedDate(date: Date | string | null | undefined) {
  if (!date) return null;

  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  if (!id) {
    return {
      title: "Anuncio | Kubo Anuncios",
    };
  }

  const listing = await prisma.listing.findUnique({
    where: { id },
  });

  if (!listing) {
    return {
      title: "Anuncio no encontrado | Kubo Anuncios",
    };
  }

  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/listing/${listing.id}`;
  const title = `${listing.title} | Kubo Anuncios`;
  const description = buildDescription(listing);
  const image = listing.imageUrl || `${baseUrl}/placeholders/listing.jpg`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Kubo Anuncios",
      type: "website",
      locale: "es_CO",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: listing.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  if (value === null || value === undefined || value === "") return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
      <div className="text-[11px] font-black uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-black text-slate-900">{value}</div>
    </div>
  );
}

export default async function ListingDetail({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  const currentUserEmail = session?.user?.email?.toLowerCase().trim() ?? null;

  const { id } = await params;

  if (!id) return notFound();

  const listing = await prisma.listing.findUnique({
    where: { id },
  });

  if (!listing) return notFound();

  const isOwner =
    currentUserEmail &&
    listing.ownerEmail?.toLowerCase().trim() === currentUserEmail;
  const isAdmin = currentUserEmail === "mr.papas001@gmail.com";
  const listingStatus = (listing as any).status ?? "active";

  if (listingStatus !== "active" && !isOwner && !isAdmin) {
    return notFound();
  }

  await prisma.listing.update({
    where: { id },
    data: {
      views: {
        increment: 1,
      },
    },
  });

  const similarListings = await prisma.listing.findMany({
    where: {
      id: { not: listing.id },
      categorySlug: listing.categorySlug,
      city: listing.city,
      status: "active",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });

  const fallback = "/placeholders/listing.jpg";
  const baseUrl = getBaseUrl();
  const pageUrl = `${baseUrl}/listing/${listing.id}`;
  const seoImage = listing.imageUrl || `${baseUrl}${fallback}`;

  const details: any = parseDetails(listing.details);
  const reelUrl = typeof details?.reelUrl === "string" ? details.reelUrl : "";

  const gallery: string[] = Array.isArray(details?.images) ? details.images : [];
  const images = [listing.imageUrl, ...gallery].filter(Boolean) as string[];

  const formattedPrice = buildPrice(listing);

  const isCar =
    listing.categorySlug === "motor" && listing.subcategorySlug === "carros";

  const isRealEstate = listing.categorySlug === "inmobiliaria";

  const car = details?.motor ?? null;
  const re = details?.realEstate ?? null;

  const kmFormatted =
    car?.km !== null && car?.km !== undefined && car?.km !== ""
      ? `${new Intl.NumberFormat("es-CO").format(Number(car.km))} km`
      : null;

  const dealText =
    re?.deal === "arriendo"
      ? "Arriendo"
      : re?.deal === "venta"
        ? "Venta"
        : null;

  const formattedViews = new Intl.NumberFormat("es-CO").format(
    Number((listing.views ?? 0) + 1)
  );

  const publishedDate = formatPublishedDate(listing.createdAt);

  const phone = String((listing as any).phone ?? "");
  const cleanPhone = phone.replace(/\D/g, "");

  const whatsappHref = cleanPhone
    ? `https://wa.me/57${cleanPhone}?text=${encodeURIComponent(
        `: ${listing.title}`
      )}`
    : "#";

  const callHref = cleanPhone ? `tel:${cleanPhone}` : "#";
  const sellerLabel =
    listing.sellerType === "PARTICULAR"
      ? listing.isVerified
        ? "Identidad verificada"
        : "Particular"
      : listing.businessVerified
        ? "Empresa verificada"
        : "Empresa";

  const trustDescription = listing.businessVerified
    ? "Kubo reviso el RUT de esta empresa."
    : listing.isVerified
      ? "Kubo reviso la identidad de este vendedor."
      : listing.sellerType === "PARTICULAR"
        ? "Este vendedor aun no ha verificado su identidad."
        : "Esta empresa aun no ha verificado su RUT.";

  const cityCoords: Record<string, [number, number]> = {
    pereira: [4.8143, -75.6946],
    bogota: [4.711, -74.0721],
    medellin: [6.2442, -75.5812],
    cali: [3.4516, -76.532],
    armenia: [4.5339, -75.6811],
    manizales: [5.0703, -75.5138],
    dosquebradas: [4.8392, -75.6673],
    cartago: [4.7464, -75.9112],
    "madrid, cundinamarca": [4.7325, -74.2642],
    barranquilla: [10.9685, -74.7813],
    cartagena: [10.391, -75.4794],
    bucaramanga: [7.1193, -73.1227],
    "santa rosa de cabal": [4.8681, -75.6214],
    "la virginia": [4.8997, -75.8828],
  };

  const cityKey = normalizeCityKey(String(listing.city ?? ""));
  const coords = cityCoords[cityKey] ?? [4.8143, -75.6946];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: buildDescription(listing),
    image: [seoImage],
    url: pageUrl,
    category: listing.categorySlug ?? "Anuncios",
    brand: car?.brand || sellerLabel,
    offers: {
      "@type": "Offer",
      priceCurrency: listing.currency ?? "COP",
      price:
        typeof listing.price === "number"
          ? listing.price
          : Number(listing.price) || 0,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/UsedCondition",
      url: pageUrl,
    },
    seller: {
      "@type": "Organization",
      name: sellerLabel,
    },
    areaServed: listing.city ?? "Colombia",
  };
const now = new Date();

const isPremiumListing =
  Boolean((listing as any).isPremium) &&
  Boolean((listing as any).premiumUntil) &&
  new Date((listing as any).premiumUntil).getTime() > now.getTime();

const isFeaturedListing =
  Boolean((listing as any).isFeatured) &&
  Boolean((listing as any).featuredUntil) &&
  new Date((listing as any).featuredUntil).getTime() > now.getTime();

const visibilityLabel = isPremiumListing
  ? "Premium"
  : isFeaturedListing
    ? "Destacado"
    : "Normal";

const visibilityDescription = isPremiumListing
  ? "Este anuncio pago por mayor visibilidad."
  : isFeaturedListing
    ? "Este anuncio aparece destacado por mayor visibilidad."
    : "Este anuncio no tiene promocion activa.";

  const motorFuel = car?.fuel || car?.fuelType || "Gasolina";
  const motorTransmission = car?.transmission || "Mecánica";
  const motorYear = car?.year || "—";

  if (isPremiumListing) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] px-4 py-6 md:px-6 md:py-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="mx-auto max-w-[1180px]">
          <Breadcrumbs
            category={listing.categorySlug}
            subcategory={listing.subcategorySlug}
            title={listing.title}
          />

          <div className="premium-shell overflow-hidden rounded-[32px] shadow-[0_28px_90px_rgba(245,158,11,0.28)]">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
              <div className="premium-photo-shine relative min-h-[420px] overflow-hidden bg-slate-100">
                <ListingGallery images={images.length ? images : [fallback]} />

                <div className="premium-ribbon pointer-events-none absolute left-0 top-0 z-20 rounded-br-[30px] bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 px-8 py-4 text-xl font-black uppercase text-slate-900 shadow-[0_18px_45px_rgba(245,158,11,0.42)]">
                  <Crown className="mr-2 inline h-6 w-6" />
                  Premium
                </div>

                <div className="pointer-events-none absolute bottom-5 left-5 z-20 inline-flex items-center gap-2 rounded-xl bg-black/70 px-4 py-2 text-sm font-black text-white backdrop-blur">
                  <Camera className="h-4 w-4" />
                  1/{images.length || 1}
                </div>
              </div>

              <div className="relative overflow-hidden bg-[radial-gradient(circle_at_90%_0%,rgba(250,204,21,0.22),transparent_34%),linear-gradient(180deg,#fffaf0,#ffffff_42%)] p-6 md:p-8">
                <div className="pointer-events-none absolute right-6 top-6 h-24 w-24 rounded-full border border-yellow-300/40 opacity-60" />
                <div className="pointer-events-none absolute right-12 top-12 h-10 w-10 rounded-full bg-yellow-300/20 blur-md" />
                <div className="mb-4 flex flex-wrap gap-2">
                  {isPremiumListing ? (
  <span className="premium-badge-pulse inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-slate-900">
    <Crown className="h-3.5 w-3.5" />
    Anuncio premium
  </span>
) : null}


                  {listing.categorySlug ? (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-slate-700">
                      {listing.categorySlug}
                    </span>
                  ) : null}

                  {listing.subcategorySlug ? (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-slate-700">
                      {listing.subcategorySlug}
                    </span>
                  ) : null}
                </div>

                <h1 className="text-4xl font-black leading-tight text-slate-900">
                  {listing.title}
                </h1>

                <p className="mt-2 text-lg font-bold text-slate-500">
  {[listing.categorySlug, listing.subcategorySlug, listing.city]
    .filter(Boolean)
    .join(" · ")}
</p>

<div className="mt-5 bg-gradient-to-r from-[#4f32c8] via-[#7c3aed] to-[#d97706] bg-clip-text text-4xl font-black text-transparent">
  {formattedPrice}
</div>

{listing.categorySlug === "motor" ? (
  <div className="mt-6 grid grid-cols-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
    <div className="flex flex-col items-center gap-1 border-r border-slate-200 p-4 text-center">
      <Gauge className="h-6 w-6 text-slate-800" />
      <span className="text-xs font-black text-slate-700">
        {kmFormatted || "—"}
      </span>
    </div>

    <div className="flex flex-col items-center gap-1 border-r border-slate-200 p-4 text-center">
      <Fuel className="h-6 w-6 text-slate-800" />
      <span className="text-xs font-black text-slate-700">{motorFuel}</span>
    </div>

    <div className="flex flex-col items-center gap-1 border-r border-slate-200 p-4 text-center">
      <Settings className="h-6 w-6 text-slate-800" />
      <span className="text-xs font-black text-slate-700">
        {motorTransmission}
      </span>
    </div>

    <div className="flex flex-col items-center gap-1 p-4 text-center">
      <CalendarDays className="h-6 w-6 text-slate-800" />
      <span className="text-xs font-black text-slate-700">{motorYear}</span>
    </div>
  </div>
) : listing.categorySlug === "inmobiliaria" ? (
  <div className="mt-6 grid grid-cols-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
    <div className="flex flex-col items-center gap-1 border-r border-slate-200 p-4 text-center">
      <span className="text-xs font-black text-slate-500">Alcobas</span>
      <span className="text-xs font-black text-slate-700">
        {details?.realEstate?.rooms ?? "—"}
      </span>
    </div>

    <div className="flex flex-col items-center gap-1 border-r border-slate-200 p-4 text-center">
      <span className="text-xs font-black text-slate-500">Baños</span>
      <span className="text-xs font-black text-slate-700">
        {details?.realEstate?.baths ?? "—"}
      </span>
    </div>

    <div className="flex flex-col items-center gap-1 border-r border-slate-200 p-4 text-center">
      <span className="text-xs font-black text-slate-500">m²</span>
      <span className="text-xs font-black text-slate-700">
        {details?.realEstate?.sqm ?? "—"}
      </span>
    </div>

    <div className="flex flex-col items-center gap-1 p-4 text-center">
      <span className="text-xs font-black text-slate-500">Parqueadero</span>
      <span className="text-xs font-black text-slate-700">
        {details?.realEstate?.parking ? "Sí" : "No"}
      </span>
    </div>
  </div>
) : null}

                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex h-13 items-center justify-center gap-2 rounded-2xl bg-green-500 text-sm font-black text-white ${
                      !cleanPhone ? "pointer-events-none opacity-50" : "hover:bg-green-600"
                    }`}
                  >
                    <MessageCircle className="h-5 w-5" />
                    WhatsApp
                  </a>

                  <a
                    href={callHref}
                    className={`flex h-13 items-center justify-center gap-2 rounded-2xl border border-[#4f32c8]/40 bg-white text-sm font-black text-[#4f32c8] ${
                      !cleanPhone ? "pointer-events-none opacity-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <Phone className="h-5 w-5" />
                    Llamar
                  </a>
                  {reelUrl ? (
  <a
    href={reelUrl}
    target="_blank"
    rel="noreferrer"
    className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-black text-sm font-black text-white hover:bg-slate-800 sm:col-span-2"
  >
    ▶ Ver reel
  </a>
) : null}
</div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4">
                    <div className="text-[11px] font-black uppercase tracking-wide text-emerald-700">
                      Confianza del vendedor
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm font-black text-slate-900">
                      <ShieldCheck className="h-4 w-4 text-emerald-700" />
                      {listing.sellerType !== "PARTICULAR" && listing.businessSlug ? (
                        <Link
                          href={`/company/${listing.businessSlug}`}
                          className="text-[#0f3c8c] hover:underline"
                        >
                          {listing.businessName || sellerLabel}
                        </Link>
                      ) : (
                        <span>{sellerLabel}</span>
                      )}
                    </div>
                    <p className="mt-2 text-xs font-medium leading-relaxed text-slate-600">
                      {trustDescription}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-4">
                    <div className="text-[11px] font-black uppercase tracking-wide text-yellow-700">
                      Visibilidad del anuncio
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm font-black text-slate-900">
                      <Crown className="h-4 w-4 text-yellow-700" />
                      {visibilityLabel}
                    </div>
                    <p className="mt-2 text-xs font-medium leading-relaxed text-slate-600">
                      {visibilityDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 border-t border-yellow-200 bg-yellow-50 px-6 py-4 text-sm font-bold text-slate-700 md:grid-cols-4">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Visto {formattedViews} veces
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {listing.city ?? "Colombia"}
              </div>

              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                {publishedDate || "Publicado recientemente"}
              </div>

              <div className="flex items-center gap-2 font-black text-yellow-800">
                <Crown className="h-5 w-5" />
                Anuncio premium
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="text-xl font-black text-slate-900">Descripción</h2>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-700">
                {listing.description || "El vendedor no agregó una descripción."}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-sm font-black text-slate-900">
                  Ubicación aproximada
                </h3>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-500">
                  {listing.city ?? "Colombia"}
                </span>
              </div>

              <div className="h-[180px] overflow-hidden rounded-2xl">
                <ListingMapClient
                  lat={coords[0]}
                  lng={coords[1]}
                  title={listing.title}
                />
              </div>
            </div>
          </div>

          {similarListings.length > 0 ? (
            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-black text-slate-900">
                Anuncios similares
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {similarListings.map((item) => (
                  <ListingCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <MobileListingActions
          listingId={listing.id}
          title={listing.title}
          url={pageUrl}
          whatsappHref={whatsappHref}
          canUseWhatsapp={Boolean(cleanPhone)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 py-6 md:px-6 md:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-[1100px]">
        <Breadcrumbs
          category={listing.categorySlug}
          subcategory={listing.subcategorySlug}
          title={listing.title}
        />

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <div className="order-1 space-y-5 md:space-y-6">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-sm md:p-4">
              <ListingGallery images={images.length ? images : [fallback]} />
            </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
  {/* 🔥 BLOQUE BENEFICIOS PREMIUM */}
  {isOwner ? (
  <div className="mb-5 rounded-3xl border border-yellow-200 bg-yellow-50 p-5">
    <div className="mb-3 text-sm font-black text-yellow-800">
      🚀 Destaca tu anuncio
    </div>

    <div className="grid grid-cols-1 gap-2 text-sm font-semibold text-slate-700">
      <div>🔥 Aparece primero en resultados</div>
      <div>👀 Más visibilidad en la plataforma</div>
      <div>📞 Recibe más contactos de compradores</div>
    </div>
  </div>
  ) : null}

  <h2 className="text-xl font-black text-slate-900">Descripción</h2>
  <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-700">
    {listing.description || "El vendedor no agregó una descripción."}
  </p>
</div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-sm font-black text-slate-900">
                  Ubicación aproximada
                </h3>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-500">
                  {listing.city ?? "Colombia"}
                </span>
              </div>

              <div className="h-[160px] overflow-hidden rounded-2xl md:h-[180px]">
                <ListingMapClient
                  lat={coords[0]}
                  lng={coords[1]}
                  title={listing.title}
                />
              </div>
            </div>

            {isOwner ? (
            <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-[#0f3c8c] to-[#071a3e] p-5 text-white shadow-sm">
              <div className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-black uppercase tracking-wide">
                Patrocinado
              </div>
              <h3 className="mt-3 text-lg font-black">
                ¿Quieres que tu anuncio destaque?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                Publica o impulsa tu anuncio para llegar a más personas cerca de ti.
              </p>
              <Link
                href="/publish"
                className="mt-4 inline-flex h-11 items-center justify-center rounded-2xl bg-white px-5 text-sm font-black text-[#0f3c8c] hover:bg-slate-100"
              >
                Publicar anuncio
              </Link>
            </div>
            ) : null}
          </div>

          <div className="order-2 h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 lg:sticky lg:top-24">
            <div className="mb-4 flex flex-wrap gap-2">
              {listing.categorySlug ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-slate-700">
                  {listing.categorySlug}
                </span>
              ) : null}

              {listing.subcategorySlug ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-slate-700">
                  {listing.subcategorySlug}
                </span>
              ) : null}

              <span className="rounded-full bg-[#e8f0ff] px-3 py-1 text-[11px] font-black uppercase tracking-wide text-[#0f3c8c]">
                {sellerLabel}
              </span>

              {isFeaturedListing ? (
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-yellow-800">
                  Destacado
                </span>
              ) : null}
            </div>

            <h1 className="text-3xl font-black leading-tight text-slate-900 md:text-4xl">
              {listing.title}
            </h1>

            <div className="mt-3 space-y-1">
              <p className="text-base font-bold text-slate-500">
                {listing.city ?? "—"}
              </p>

              {publishedDate ? (
                <p className="text-sm font-medium text-slate-400">
                  Publicado el {publishedDate}
                </p>
              ) : null}
            </div>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
              <Eye className="h-4 w-4 text-[#0f3c8c]" />
              {formattedViews} visita
              {Number(formattedViews.replace(/\D/g, "")) === 1 ? "" : "s"}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4">
                <div className="text-[11px] font-black uppercase tracking-wide text-emerald-700">
                  Confianza del vendedor
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm font-black text-slate-900">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  {listing.sellerType !== "PARTICULAR" && listing.businessSlug ? (
                    <Link
                      href={`/company/${listing.businessSlug}`}
                      className="text-[#0f3c8c] hover:underline"
                    >
                      {listing.businessName || sellerLabel}
                    </Link>
                  ) : (
                    <span>{sellerLabel}</span>
                  )}
                </div>
                <p className="mt-2 text-xs font-medium leading-relaxed text-slate-600">
                  {trustDescription}
                </p>
              </div>

              <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-4">
                <div className="text-[11px] font-black uppercase tracking-wide text-yellow-700">
                  Visibilidad del anuncio
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm font-black text-slate-900">
                  <Crown className="h-4 w-4 text-yellow-700" />
                  {visibilityLabel}
                </div>
                <p className="mt-2 text-xs font-medium leading-relaxed text-slate-600">
                  {visibilityDescription}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-[#0b1736] px-5 py-5 text-white">
              <div className="text-xs font-black uppercase tracking-wide text-slate-300">
                Precio
              </div>
              <div className="mt-1 text-3xl font-black">{formattedPrice}</div>
            </div>

            {isCar || isRealEstate ? (
              <div className="mt-6">
                <div className="mb-3 text-sm font-black text-slate-900">
                  Características
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {isCar ? (
                    <>
                      <StatCard label="Marca" value={car?.brand ?? null} />
                      <StatCard label="Modelo" value={car?.model ?? null} />
                      <StatCard label="Año" value={car?.year ?? null} />
                      <StatCard label="Kilometraje" value={kmFormatted} />
                      <StatCard label="Combustible" value={car?.fuel ?? null} />
                      <StatCard label="Transmisión" value={car?.transmission ?? null} />
                    </>
                  ) : null}

                  {isRealEstate ? (
                    <>
                      <StatCard label="Tipo" value={dealText} />
                      <StatCard label="Alcobas" value={re?.rooms ?? null} />
                      <StatCard label="Baños" value={re?.baths ?? null} />
                      <StatCard
                        label="Metros²"
                        value={re?.sqm ? `${re.sqm} m²` : null}
                      />
                      <StatCard
                        label="Parqueadero"
                        value={re?.parking ? "Sí" : "No"}
                      />
                    </>
                  ) : null}
                </div>
              </div>
            ) : null}

<div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
  <a
    href={whatsappHref}
    target="_blank"
    rel="noreferrer"
    className={`flex h-12 items-center justify-center gap-2 rounded-2xl bg-green-500 text-sm font-black text-white ${
      !cleanPhone ? "pointer-events-none opacity-50" : "hover:bg-green-600"
    }`}
  >
    <MessageCircle className="h-4 w-4" />
    WhatsApp
  </a>

  <StartChatButton listingId={listing.id} />

  <FavoriteButton listingId={listing.id} variant="inline" />

  {reelUrl ? (
    <a
      href={reelUrl}
      target="_blank"
      rel="noreferrer"
      className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-black text-sm font-black text-white hover:bg-slate-800"
    >
      ▶ Ver reel
    </a>
  ) : null}
</div>

{/* 🔥 BOTÓN PROMOCIONAR */}
{isOwner && !isPremiumListing && (
  <Link
    href={`/premium?listingId=${listing.id}`}
    className="mt-4 flex w-full items-center justify-center rounded-2xl bg-yellow-400 px-4 py-3 text-sm font-black text-slate-900 hover:bg-yellow-500"
  >
    🚀 Promocionar este anuncio
  </Link>
)}

<div className="mt-8 border-t border-slate-100 pt-6">
  <h3 className="text-lg font-black text-slate-900">
    Información del anuncio
  </h3>

  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
    <StatCard label="Categoría" value={listing.categorySlug ?? "—"} />
    <StatCard
      label="Subcategoría"
      value={listing.subcategorySlug ?? "—"}
    />
    <StatCard label="Ciudad" value={listing.city ?? "—"} />
    <StatCard label="Publicado" value={publishedDate} />
    <StatCard
      label="Tipo de vendedor"
      value={sellerLabel}
    />
    <StatCard label="Visitas" value={formattedViews} />
  </div>
</div>

            <div className="mt-8 border-t border-slate-100 pt-6">
              <h3 className="text-lg font-black text-slate-900">
                Contacto rápido
              </h3>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <div className="text-[11px] font-black uppercase tracking-wide text-slate-500">
                    WhatsApp
                  </div>
                  <div className="mt-1 text-sm font-black text-slate-900">
                    {phone || "No disponible"}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <div className="text-[11px] font-black uppercase tracking-wide text-slate-500">
                    Llamadas
                  </div>
                  <div className="mt-1 text-sm font-black text-slate-900">
                    {phone || "No disponible"}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-4 sm:col-span-2">
                  <div className="text-[11px] font-black uppercase tracking-wide text-slate-500">
                    Ubicación
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm font-black text-slate-900">
                    <MapPin className="h-4 w-4 text-[#0f3c8c]" />
                    {listing.city ?? "No disponible"}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-black text-slate-700 hover:bg-slate-50"
              >
                Volver a la home
              </Link>

<ReportListingModal listingId={listing.id} />
            </div>
          </div>
        </div>
        {similarListings.length > 0 ? (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Anuncios similares
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Más anuncios en {listing.city ?? "tu zona"} de la categoría{" "}
                  {listing.categorySlug ?? "relacionada"}.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {similarListings.map((item) => (
                <ListingCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <MobileListingActions
        listingId={listing.id}
        title={listing.title}
        url={pageUrl}
        whatsappHref={whatsappHref}
        canUseWhatsapp={Boolean(cleanPhone)}
      />
    </div>
  );
}
