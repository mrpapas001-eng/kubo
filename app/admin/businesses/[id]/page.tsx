import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Eye,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Plus,
} from "lucide-react";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { isAdminEmail } from "@/lib/admin";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminBusinessDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase().trim();

  if (!isAdminEmail(email)) {
    redirect("/");
  }

  const { id } = await params;

  const business = await prisma.business.findUnique({
    where: {
      id,
    },
    include: {
      listings: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!business) {
    notFound();
  }

  const activeListings = business.listings.filter(
    (listing) => listing.status === "active"
  );

  const totalViews = business.listings.reduce(
    (total, listing) => total + (listing.views || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 pb-24 pt-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-7">
          <Link
            href="/admin/businesses"
            className="mb-5 inline-flex items-center gap-2 text-sm font-black text-[#0f3c8c]"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a empresas
          </Link>

          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
            {business.logo ? (
  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
    <Image
      src={business.logo}
      alt={`Logo de ${business.name}`}
      fill
      sizes="80px"
      className="object-cover"
    />
  </div>
) : (
  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-[#e8f0ff] text-[#0f3c8c]">
    <Building2 className="h-8 w-8" />
  </div>
)}

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-black text-slate-900 md:text-4xl">
                    {business.name}
                  </h1>

                  {business.isVerified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      Verificada
                    </span>
                  ) : null}
                </div>

                <p className="mt-2 text-sm font-black uppercase tracking-wide text-[#0f3c8c]">
                  {business.businessType || "Empresa"}
                </p>

                {business.city ? (
                  <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-500">
                    <MapPin className="h-4 w-4" />
                    {business.city}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/admin/businesses/${business.id}/edit`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 shadow-sm"
              >
                <Pencil className="h-4 w-4" />
                Editar empresa
              </Link>

              <Link
                href={`/publish?businessId=${business.id}`}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#0f3c8c] px-4 text-sm font-black text-white shadow-sm"
              >
                <Plus className="h-4 w-4" />
                Publicar para esta empresa
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-black uppercase tracking-wide text-slate-500">
              Anuncios totales
            </div>

            <div className="mt-2 text-3xl font-black text-slate-900">
              {business.listings.length}
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <div className="text-xs font-black uppercase tracking-wide text-emerald-700">
              Activos
            </div>

            <div className="mt-2 text-3xl font-black text-emerald-800">
              {activeListings.length}
            </div>
          </div>

          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-blue-700">
              <Eye className="h-4 w-4" />
              Visitas
            </div>

            <div className="mt-2 text-3xl font-black text-blue-800">
              {totalViews.toLocaleString("es-CO")}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-black uppercase tracking-wide text-slate-500">
              Estado
            </div>

            <div className="mt-2 text-lg font-black text-slate-900">
              {business.isActive ? "Activa" : "Inactiva"}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Publicaciones
                </h2>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  Anuncios asociados a {business.name}.
                </p>
              </div>

              <Link
                href={`/publish?businessId=${business.id}`}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-[#0f3c8c] px-4 text-sm font-black text-white"
              >
                <Plus className="h-4 w-4" />
                Publicar
              </Link>
            </div>

            {business.listings.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <h3 className="text-lg font-black text-slate-900">
                  Todavía no hay anuncios
                </h3>

                <p className="mt-2 text-sm font-medium text-slate-500">
                  Cuando publiquemos los vehículos de {business.name}, aparecerán
                  aquí.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {business.listings.map((listing) => (
  <div
    key={listing.id}
    className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50"
  >
    <div className="min-w-0">
      <div className="truncate font-black text-slate-900">
        {listing.title}
      </div>

      <div className="mt-1 text-xs font-medium text-slate-500">
        {listing.city} · {listing.views || 0} visitas
      </div>
    </div>

    <div className="flex shrink-0 items-center gap-2">
      <Link
        href={`/listing/${listing.id}`}
        className="rounded-xl px-3 py-2 text-xs font-black text-[#0f3c8c] hover:bg-blue-50"
      >
        Ver →
      </Link>

      <Link
        href={`/listing/${listing.id}/edit`}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 hover:border-[#0f3c8c] hover:text-[#0f3c8c]"
      >
        Editar
      </Link>
    </div>
  </div>
))}
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-xl font-black text-slate-900">
              Datos de la empresa
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <div className="text-xs font-black uppercase tracking-wide text-slate-400">
                  Responsable
                </div>

                <div className="mt-1 font-bold text-slate-900">
                  {business.ownerName || "Sin nombre"}
                </div>

                <div className="text-sm font-medium text-slate-500">
                  {business.ownerEmail}
                </div>
              </div>

              {business.whatsapp ? (
                <div>
                  <div className="text-xs font-black uppercase tracking-wide text-slate-400">
                    WhatsApp
                  </div>

                  <div className="mt-1 flex items-center gap-2 font-bold text-slate-900">
                    <MessageCircle className="h-4 w-4 text-emerald-600" />
                    {business.whatsapp}
                  </div>
                </div>
              ) : null}

              {business.phone ? (
                <div>
                  <div className="text-xs font-black uppercase tracking-wide text-slate-400">
                    Teléfono
                  </div>

                  <div className="mt-1 flex items-center gap-2 font-bold text-slate-900">
                    <Phone className="h-4 w-4" />
                    {business.phone}
                  </div>
                </div>
              ) : null}

              {business.address ? (
                <div>
                  <div className="text-xs font-black uppercase tracking-wide text-slate-400">
                    Dirección
                  </div>

                  <div className="mt-1 font-bold text-slate-900">
                    {business.address}
                  </div>
                </div>
              ) : null}

              {business.description ? (
                <div>
                  <div className="text-xs font-black uppercase tracking-wide text-slate-400">
                    Descripción
                  </div>

                  <p className="mt-1 text-sm font-medium leading-relaxed text-slate-600">
                    {business.description}
                  </p>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}