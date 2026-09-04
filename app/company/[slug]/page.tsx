import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  Building2,
  Clock3,
  ExternalLink,
  Facebook,
  Globe,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { prisma } from "@/lib/db";
import { attachAccountVerification } from "@/lib/accountVerification";
import ListingCard from "@/components/ListingCard";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function normalizeExternalUrl(url: string) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

export default async function CompanyPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) return notFound();

  const business = await prisma.business.findUnique({
    where: {
      slug,
    },
    include: {
      listings: {
        where: {
          status: "active",
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!business || !business.isActive) return notFound();

  const listings = business.listings;

  const listingsWithVerification = await attachAccountVerification(listings);

  const businessName = business.name;
  const businessType = business.businessType || "Empresa";
  const businessLogo = business.logo || "";
  const isVerified = business.isVerified;
  const city = business.city || listings[0]?.city || "Colombia";
  const address = business.address || "";
  const phone = business.phone || "";
  const businessDescription =
    business.description || "Empresa en Kubo Anuncios.";
  const businessWebsite = normalizeExternalUrl(business.website || "");
  const businessInstagram = normalizeExternalUrl(business.instagram || "");
  const businessFacebook = normalizeExternalUrl(business.facebook || "");
  const businessWhatsapp = business.whatsapp || "";

  const totalViews = listings.reduce((sum, item) => {
    return sum + Number(item.views || 0);
  }, 0);

  const whatsappNumber = businessWhatsapp || phone;
  const cleanWhatsapp = String(whatsappNumber).replace(/\D/g, "");
  const whatsappCountryNumber =
    cleanWhatsapp.length === 10 ? `57${cleanWhatsapp}` : cleanWhatsapp;
  const whatsappHref = whatsappCountryNumber
    ? `https://wa.me/${whatsappCountryNumber}`
    : "#";
  const hasSocialLinks =
    Boolean(businessWebsite) ||
    Boolean(businessInstagram) ||
    Boolean(businessFacebook);

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 pb-28 pt-4 text-slate-900 md:px-6 md:py-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Link
            href="/buscar"
            className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Volver
          </Link>

          <Link
            href="/publish"
            className="inline-flex h-10 items-center rounded-xl bg-[#0f3c8c] px-4 text-sm font-black text-white shadow-sm hover:bg-[#0c2f6d]"
          >
            Publicar
          </Link>
        </div>

        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] md:rounded-[34px]">
          <div className="bg-[#10244d] px-5 py-6 text-white md:px-9 md:py-9">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-white p-2 shadow-xl ring-4 ring-white/15 md:h-28 md:w-28">
                  {businessLogo ? (
                    <Image
                      src={businessLogo}
                      alt={businessName}
                      width={112}
                      height={112}
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-slate-100">
                      <Building2 className="h-11 w-11 text-[#0f3c8c]" />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase text-[#0f3c8c] shadow-sm">
                    {isVerified ? <BadgeCheck className="h-3.5 w-3.5" /> : null}
                    {isVerified ? "Empresa verificada" : "Empresa en Kubo"}
                  </div>

                  <h1 className="mt-4 max-w-[760px] break-words text-3xl font-black leading-tight md:text-5xl">
                    {businessName}
                  </h1>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold text-white/90">
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 className="h-4 w-4" />
                      {businessType}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {city}
                    </span>

                    {phone ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="h-4 w-4" />
                        {phone}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:min-w-[280px]">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-center">
                  <div className="text-3xl font-black">{listings.length}</div>
                  <div className="mt-1 text-xs font-bold text-white/75">
                    Anuncios activos
                  </div>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 text-center">
                  <div className="text-3xl font-black">
                    {totalViews.toLocaleString("es-CO")}
                  </div>
                  <div className="mt-1 text-xs font-bold text-white/75">
                    Visitas totales
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-b border-slate-200 bg-white px-5 py-5 md:grid-cols-3 md:px-9">
            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0f3c8c]" />
              <div>
                <div className="font-black text-slate-900">
                  Perfil revisado
                </div>
                <div className="mt-1 text-sm font-medium text-slate-500">
                  {isVerified
                    ? "Empresa validada dentro de Kubo."
                    : "Perfil publico de empresa en Kubo."}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
              <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0f3c8c]" />
              <div>
                <div className="font-black text-slate-900">
                  Anuncios activos
                </div>
                <div className="mt-1 text-sm font-medium text-slate-500">
                  Publicaciones disponibles para contactar.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
              <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[#0f3c8c]" />
              <div>
                <div className="font-black text-slate-900">
                  Atencion directa
                </div>
                <div className="mt-1 text-sm font-medium text-slate-500">
                  Chat, WhatsApp y contacto desde sus anuncios.
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 bg-white px-5 py-6 md:px-9 lg:grid-cols-[minmax(0,1fr)_330px]">
            <div>
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    Anuncios de {businessName}
                  </h2>

                  <p className="mt-2 text-sm font-medium text-slate-500">
                    Publicaciones activas de esta empresa dentro de Kubo.
                  </p>
                </div>

                <div className="inline-flex w-fit items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black uppercase text-slate-500">
                  Mas recientes
                </div>
              </div>

              {listingsWithVerification.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {listingsWithVerification.map((item) => (
                    <ListingCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <h3 className="text-lg font-black text-slate-900">
                    No hay anuncios activos en este momento
                  </h3>

                  <p className="mt-2 text-sm font-medium text-slate-500">
                    Vuelve pronto para consultar nuevas publicaciones de {businessName}.
                  </p>
                </div>
              )}
            </div>

            <aside className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-black text-slate-900">
                  Sobre {businessName}
                </h3>

                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
                  {businessDescription}
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-black text-slate-900">
                  Contacto
                </h3>

                <div className="mt-4 space-y-3 text-sm font-bold text-slate-600">
                  {phone ? (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 shrink-0 text-[#0f3c8c]" />
                      <span className="break-all">{phone}</span>
                    </div>
                  ) : null}

                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 shrink-0 text-[#0f3c8c]" />
                    <span>
                      {address ? `${address}, ${city}` : city}
                    </span>
                  </div>
                </div>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className={`mt-5 flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#10b981] px-5 text-sm font-black text-white hover:bg-[#0d966a] ${
                    !cleanWhatsapp ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-black text-slate-900">
                  Redes y sitio web
                </h3>

                {hasSocialLinks ? (
                  <div className="mt-4 flex flex-col gap-3">
                    {businessWebsite ? (
                      <a
                        href={businessWebsite}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
                      >
                        <span className="inline-flex items-center gap-3">
                          <Globe className="h-4 w-4 text-[#0f3c8c]" />
                          Sitio web
                        </span>
                        <ExternalLink className="h-4 w-4 text-slate-400" />
                      </a>
                    ) : null}

                    {businessInstagram ? (
                      <a
                        href={businessInstagram}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
                      >
                        <span className="inline-flex items-center gap-3">
                          <Instagram className="h-4 w-4 text-pink-500" />
                          Instagram
                        </span>
                        <ExternalLink className="h-4 w-4 text-slate-400" />
                      </a>
                    ) : null}

                    {businessFacebook ? (
                      <a
                        href={businessFacebook}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
                      >
                        <span className="inline-flex items-center gap-3">
                          <Facebook className="h-4 w-4 text-blue-600" />
                          Facebook
                        </span>
                        <ExternalLink className="h-4 w-4 text-slate-400" />
                      </a>
                    ) : null}
                  </div>
                ) : (
                  <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">
                    Esta empresa aun no agrego redes sociales.
                  </p>
                )}
              </div>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}
