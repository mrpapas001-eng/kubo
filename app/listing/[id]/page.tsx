import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ListingGallery from "@/components/ListingGallery";
import ListingCard from "@/components/ListingCard";
import ListingMap from "@/components/ListingMap";
import { MapPin, Phone, MessageCircle, ShieldCheck, Eye } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

type PageProps = {
  params: { id: string };
};

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000"
  );
}

function buildPrice(listing: any) {
  return typeof listing.price === "number"
    ? new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: listing.currency ?? "COP",
        maximumFractionDigits: 0,
      }).format(listing.price)
    : String(listing.price ?? "");
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
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = params;

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
    const { id } = await params;
  if (!id) return notFound();

  const listing = await prisma.listing.findUnique({
    where: { id },
  });

  if (!listing) return notFound();

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
      categorySlug: listing.categorySlug ?? undefined,
      city: listing.city ?? undefined,
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

  let details: any = {};
  try {
    details =
      typeof listing.details === "string"
        ? JSON.parse(listing.details)
        : listing.details ?? {};
  } catch {
    details = listing.details ?? {};
  }

  const gallery: string[] = Array.isArray(details?.images) ? details.images : [];
  const images = [listing.imageUrl ?? null, ...gallery].filter(Boolean) as string[];

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

  const phone = (listing as any).phone ?? "";
  const cleanPhone = String(phone).replace(/\D/g, "");

  const whatsappHref = cleanPhone
    ? `https://wa.me/57${cleanPhone}?text=${encodeURIComponent(
        `Hola, me interesa este anuncio: ${listing.title}`
      )}`
    : "#";

  const callHref = cleanPhone ? `tel:${cleanPhone}` : "#";

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
    brand:
      car?.brand ||
      (listing.sellerType === "PARTICULAR" ? "Particular" : "Empresa verificada"),
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
      name:
        listing.sellerType === "PARTICULAR" ? "Particular" : "Empresa verificada",
    },
    areaServed: listing.city ?? "Colombia",
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-6 py-10">
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

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <ListingGallery images={images.length ? images : [fallback]} />
          </div>

          <div className="h-fit rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
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
                {listing.sellerType === "PARTICULAR"
                  ? "Particular"
                  : "Empresa verificada"}
              </span>
            </div>

            <h1 className="text-4xl font-black leading-tight text-slate-900">
              {listing.title}
            </h1>

            <p className="mt-3 text-base font-bold text-slate-500">
              {listing.city ?? "—"}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
              <Eye className="h-4 w-4 text-[#0f3c8c]" />
              {formattedViews} visita{Number(formattedViews.replace(/\D/g, "")) === 1 ? "" : "s"}
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
                className={`flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#0f3c8c] text-sm font-black text-white ${
                  !cleanPhone ? "pointer-events-none opacity-50" : "hover:bg-[#0c2f6d]"
                }`}
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>

              <a
                href={callHref}
                className={`flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700 ${
                  !cleanPhone ? "pointer-events-none opacity-50" : "hover:bg-slate-50"
                }`}
              >
                <Phone className="h-4 w-4" />
                Llamar
              </a>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <div className="text-[11px] font-black uppercase tracking-wide text-slate-500">
                  Teléfono
                </div>
                <div className="mt-1 text-sm font-black text-slate-900">
                  {phone || "No disponible"}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <div className="text-[11px] font-black uppercase tracking-wide text-slate-500">
                  Ubicación
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm font-black text-slate-900">
                  <MapPin className="h-4 w-4 text-[#0f3c8c]" />
                  {listing.city ?? "No disponible"}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <div className="text-[11px] font-black uppercase tracking-wide text-slate-500">
                  Tipo de vendedor
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm font-black text-slate-900">
                  <ShieldCheck className="h-4 w-4 text-[#0f3c8c]" />
                  {listing.sellerType === "PARTICULAR"
                    ? "Particular"
                    : "Empresa verificada"}
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
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">Descripción</h2>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-700">
            {listing.description ?? ""}
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-xl font-black text-slate-900">
            Ubicación aproximada
          </h2>

          <ListingMap lat={coords[0]} lng={coords[1]} title={listing.title} />
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

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900">
              Información del anuncio
            </h3>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <StatCard label="Categoría" value={listing.categorySlug ?? "—"} />
              <StatCard label="Subcategoría" value={listing.subcategorySlug ?? "—"} />
              <StatCard label="Ciudad" value={listing.city ?? "—"} />
              <StatCard
                label="Tipo de vendedor"
                value={
                  listing.sellerType === "PARTICULAR"
                    ? "Particular"
                    : "Empresa verificada"
                }
              />
              <StatCard label="Visitas" value={formattedViews} />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-lg font-black text-slate-900">Contacto rápido</h3>

            <div className="mt-5 space-y-4">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}