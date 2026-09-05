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
  Camera,
  PlayCircle,
} from "lucide-react";

import { prisma } from "@/lib/db";
import { attachAccountVerification } from "@/lib/accountVerification";
import ListingGallery from "@/components/ListingGallery";
import ListingCard from "@/components/ListingCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import ListingMapClient from "@/components/ListingMapClient";
import MobileListingActions from "@/components/MobileListingActions";
import TrackedContactLink from "@/components/TrackedContactLink";
import StartChatButton from "@/components/StartChatButton";
import BackToResultsButton from "@/components/BackToResultsButton";
import { isAdminEmail } from "@/lib/admin";

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
  const details = parseDetails(listing.details);
  const isDonation = details?.kuboAyuda?.type === "DONATION";

  if (isDonation) {
    return "GRATIS";
  }

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

function similarityScore(source: any, candidate: any) {
  let score = 0;
  const sourceDetails: any = parseDetails(source.details);
  const candidateDetails: any = parseDetails(candidate.details);

  if (normalizeCityKey(source.city) === normalizeCityKey(candidate.city)) {
    score += 20;
  }

  if (source.template && source.template === candidate.template) {
    score += 10;
  }

  const sourcePrice = Number(source.price);
  const candidatePrice = Number(candidate.price);

  if (sourcePrice > 0 && candidatePrice > 0) {
    const difference = Math.abs(sourcePrice - candidatePrice) / sourcePrice;
    score += Math.max(0, 50 - difference * 50);
  }

  if (source.categorySlug === "motor") {
    const sourceMotor = sourceDetails?.motor ?? {};
    const candidateMotor = candidateDetails?.motor ?? {};

    if (
      sourceMotor.brand &&
      String(sourceMotor.brand).toLowerCase() ===
        String(candidateMotor.brand ?? "").toLowerCase()
    ) {
      score += 15;
    }

    const sourceYear = Number(sourceMotor.year);
    const candidateYear = Number(candidateMotor.year);
    if (sourceYear > 0 && candidateYear > 0) {
      score += Math.max(0, 10 - Math.abs(sourceYear - candidateYear));
    }
  }

  if (source.categorySlug === "inmobiliaria") {
    const sourceDeal = sourceDetails?.realEstate?.deal;
    const candidateDeal = candidateDetails?.realEstate?.deal;
    if (sourceDeal && sourceDeal === candidateDeal) score += 15;
  }

  return score;
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
    <div className="rounded-md px-3 py-2 md:rounded-2xl md:border md:border-slate-200 md:bg-slate-50 md:px-4 md:py-4">
      <div className="text-[10px] md:text-[11px] font-black uppercase tracking-wide text-slate-500">
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

  let listing = await prisma.listing.findUnique({
    where: { id },
  });

  if (!listing) return notFound();

  const isOwner =
    currentUserEmail &&
    listing.ownerEmail?.toLowerCase().trim() === currentUserEmail;
  const isAdmin = isAdminEmail(currentUserEmail);
  const listingStatus = (listing as any).status ?? "active";

  if (listingStatus !== "active" && !isOwner && !isAdmin) {
    return notFound();
  }

  const [listingWithVerification] = await attachAccountVerification([listing]);
  listing = listingWithVerification;

  await prisma.$transaction([
    prisma.listing.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    }),
    prisma.listingAnalyticsEvent.create({
      data: {
        type: "VIEW",
        listingId: listing.id,
        businessId: listing.businessId,
      },
    }),
  ]);

  const similarCandidates = await prisma.listing.findMany({
    where: {
      id: { not: listing.id },
      categorySlug: listing.categorySlug,
      subcategorySlug: listing.subcategorySlug,
      status: "active",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 36,
  });
  const similarListings = similarCandidates
    .sort(
      (a, b) =>
        similarityScore(listing, b) - similarityScore(listing, a)
    )
    .slice(0, 6);
  const similarListingsWithVerification = await attachAccountVerification(similarListings);

  const fallback = "/placeholders/listing.jpg";
  const baseUrl = getBaseUrl();
  const pageUrl = `${baseUrl}/listing/${listing.id}`;
  const seoImage = listing.imageUrl || `${baseUrl}${fallback}`;

  const details: any = parseDetails(listing.details);
  const isDonation = details?.kuboAyuda?.type === "DONATION";
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

const contactUrl = String((listing as any).contactUrl ?? "").trim();

const whatsappHref = cleanPhone
  ? `https://wa.me/57${cleanPhone}?text=${encodeURIComponent(
      `: ${listing.title}`
    )}`
  : "#";

const callHref = cleanPhone ? `tel:${cleanPhone}` : "#";


  
    const linkedBusiness = listing.businessId
  ? await prisma.business.findUnique({
      where: { id: listing.businessId },
      select: {
        name: true,
        slug: true,
        isVerified: true,
        isActive: true,
      },
    })
  : null;

const publicBusiness = linkedBusiness?.isActive ? linkedBusiness : null;
const isVerifiedBusiness = Boolean(publicBusiness?.isVerified);

const accountVerificationType =
  listingWithVerification.accountVerificationType;

const sellerLabel =
  isVerifiedBusiness || accountVerificationType === "EMPRESA"
    ? "Empresa verificada"
    : accountVerificationType === "PARTICULAR"
      ? "Usuario verificado"
      : "Vendedor en Kubo";

const trustDescription =
  isVerifiedBusiness || accountVerificationType === "EMPRESA"
    ? "Empresa verificada por Kubo."
    : accountVerificationType === "PARTICULAR"
      ? "Kubo verificó esta cuenta."
      : "Esta cuenta aún no tiene una verificación aprobada.";

const showBusinessVerificationCta = Boolean(
  isOwner &&
    listing.isBusiness &&
    !isVerifiedBusiness &&
    accountVerificationType !== "EMPRESA"
);

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

  const motorFuel = car?.fuel || car?.fuelType || "Gasolina";
  const motorTransmission = car?.transmission || "Mecánica";
  const motorYear = car?.year || "—";

  {
    return (
      <div className="min-h-screen bg-[#F8F9FB] px-4 py-6 md:px-6 md:py-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="mx-auto max-w-[1180px]">
          <div className="hidden md:block">
            <Breadcrumbs
              category={listing.categorySlug}
              subcategory={listing.subcategorySlug}
              title={listing.title}
            />
          </div>
          <div className="mb-3 origin-left scale-90 md:mb-5 md:scale-100">
            <BackToResultsButton />
          </div>

          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
              <div className="relative min-h-[420px] overflow-hidden bg-slate-100">
                <ListingGallery images={images.length ? images : [fallback]} />

                {reelUrl ? (
                  <a
                    href={reelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Ver video del anuncio"
                    className="group absolute left-3 top-3 z-30 inline-flex items-center gap-2 rounded-full bg-black/75 p-1.5 pr-3 text-white shadow-lg ring-1 ring-white/30 backdrop-blur transition hover:bg-black/90 md:left-5 md:top-5"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition group-hover:bg-red-700">
                      <PlayCircle className="h-5 w-5 fill-white/20" />
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider md:text-[11px]">
                      Ver video
                    </span>
                  </a>
                ) : null}

                <div className="pointer-events-none absolute bottom-5 left-5 z-20 inline-flex items-center gap-2 rounded-xl bg-black/70 px-4 py-2 text-sm font-black text-white backdrop-blur">
                  <Camera className="h-4 w-4" />
                  1/{images.length || 1}
                </div>
              </div>

              <div className="relative overflow-hidden bg-white p-4 md:p-8">
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
                </div>

                <h1 className="text-2xl font-black leading-tight text-slate-900 md:text-4xl">
                  {listing.title}
                </h1>

                <p className="mt-2 text-sm font-bold text-slate-500 md:text-lg">
  {[listing.categorySlug, listing.subcategorySlug, listing.city]
    .filter(Boolean)
    .join(" · ")}
</p>

<div className="mt-4 text-3xl font-black text-[#4f32c8] md:mt-5 md:text-4xl">
  {formattedPrice}
</div>

{listing.categorySlug === "motor" ? (
  <div className="mt-5 grid grid-cols-4 overflow-hidden rounded-2xl border border-slate-200 bg-white md:mt-6">
    <div className="flex flex-col items-center gap-1 border-r border-slate-200 p-2 text-center md:p-4">
      <Gauge className="h-5 w-5 text-slate-800 md:h-6 md:w-6" />
      <span className="text-xs font-black text-slate-700">
        {kmFormatted || "—"}
      </span>
    </div>

    <div className="flex flex-col items-center gap-1 border-r border-slate-200 p-2 text-center md:p-4">
      <Fuel className="h-5 w-5 text-slate-800 md:h-6 md:w-6" />
      <span className="text-xs font-black text-slate-700">{motorFuel}</span>
    </div>

    <div className="flex flex-col items-center gap-1 border-r border-slate-200 p-2 text-center md:p-4">
      <Settings className="h-5 w-5 text-slate-800 md:h-6 md:w-6" />
      <span className="text-xs font-black text-slate-700">
        {motorTransmission}
      </span>
    </div>

    <div className="flex flex-col items-center gap-1 p-2 text-center md:p-4">
      <CalendarDays className="h-5 w-5 text-slate-800 md:h-6 md:w-6" />
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

                <div className="mt-8 hidden gap-3 md:grid md:grid-cols-3">
  {cleanPhone ? (
    <>
      <TrackedContactLink
        listingId={listing.id}
        eventType="WHATSAPP_CLICK"
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        className="flex h-13 items-center justify-center gap-2 rounded-2xl bg-green-500 text-sm font-black text-white hover:bg-green-600"
      >
        <MessageCircle className="h-5 w-5" />
        WhatsApp
      </TrackedContactLink>

      <TrackedContactLink
        listingId={listing.id}
        eventType="PHONE_CLICK"
        href={callHref}
        className="flex h-13 items-center justify-center gap-2 rounded-2xl border border-[#4f32c8]/40 bg-white text-sm font-black text-[#4f32c8] hover:bg-slate-50"
      >
        <Phone className="h-5 w-5" />
        Llamar
      </TrackedContactLink>
    </>
  ) : contactUrl ? (
    <a
      href={contactUrl}
      target="_blank"
      rel="noopener noreferrer"
    className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#4f32c8] text-sm font-black text-white hover:bg-[#3f28a8] md:col-span-2"
    >
      <MessageCircle className="h-5 w-5" />
      Contactar al vendedor
    </a>
  ) : null}

  <StartChatButton listingId={listing.id} />
</div>

                <div className="mt-6">
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4">
                    <div className="text-[11px] font-black uppercase tracking-wide text-emerald-700">
                      Confianza del vendedor
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm font-black text-slate-900">
                      <ShieldCheck className="h-4 w-4 text-emerald-700" />
                      {publicBusiness ? (
                        <Link
                          href={`/company/${publicBusiness.slug}`}
                          className="text-[#0f3c8c] hover:underline"
                        >
                          {publicBusiness.name}
                        </Link>
                      ) : (
                        <span>{sellerLabel}</span>
                      )}
                    </div>
                    <p className="mt-2 text-xs font-medium leading-relaxed text-slate-600">
                      {trustDescription}
                    </p>

                    {publicBusiness ? (
                      <Link
                        href={`/company/${publicBusiness.slug}`}
                        className="mt-3 inline-flex h-9 items-center justify-center rounded-xl bg-white px-4 text-xs font-black text-[#0f3c8c] shadow-sm ring-1 ring-emerald-200 hover:bg-emerald-100"
                      >
                        Ver todos los vehículos de {publicBusiness.name} →
                      </Link>
                    ) : null}
                  </div>
                </div>
                </div>
              </div>

            <div className="grid gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 text-sm font-bold text-slate-700 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-[#4f32c8]" />
                Visto {formattedViews} veces
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#4f32c8]" />
                {listing.city ?? "Colombia"}
              </div>

              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-[#4f32c8]" />
                {publishedDate || "Publicado recientemente"}
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
                {similarListingsWithVerification.map((item) => (
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
          contactUrl={contactUrl}
        />
      </div>
    );
  }
}
