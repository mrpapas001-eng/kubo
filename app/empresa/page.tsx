import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  Eye,
  MapPin,
  Plus,
  Store,
} from "lucide-react";

import { authOptions } from "@/lib/authOptions";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/db";

export default async function BusinessOwnerDashboardPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase().trim();

  if (!email) {
    redirect("/api/auth/signin?callbackUrl=/empresa");
  }

  const isAdmin = isAdminEmail(email);

  const businesses = await prisma.business.findMany({
    where: isAdmin
      ? {
          isActive: true,
        }
      : {
          ownerEmail: {
            equals: email,
            mode: "insensitive",
          },
          isActive: true,
        },
    include: {
      listings: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (businesses.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] px-4 pb-24 pt-8 md:px-6 md:py-12">
        <div className="mx-auto max-w-[760px] rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm md:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#e8f0ff] text-[#0f3c8c]">
            <Building2 className="h-8 w-8" />
          </div>

          <h1 className="mt-5 text-2xl font-black text-slate-900">
            Tu cuenta todavía no tiene una empresa asociada
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-relaxed text-slate-500">
            Iniciaste sesión con <strong>{email}</strong>. Para entrar al panel,
            ese correo debe estar registrado como responsable de una empresa en
            Kubo.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#0f3c8c] px-5 text-sm font-black text-white"
            >
              Volver a Kubo
            </Link>

            <Link
              href="/contacto"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700"
            >
              Contactar a Kubo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 pb-24 pt-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-[1180px] space-y-8">
        <header>
          <p className="text-xs font-black uppercase tracking-wide text-[#0f3c8c]">
            Kubo Empresas
          </p>

          <h1 className="mt-1 text-3xl font-black text-slate-900 md:text-4xl">
            Panel de empresa
          </h1>

          <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-slate-500">
            Consulta tus publicaciones y el rendimiento de tu inventario en
            Kubo Anuncios.
          </p>

          {isAdmin ? (
            <div className="mt-4 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
              Vista de administrador
            </div>
          ) : null}
        </header>

        {businesses.map((business) => {
          const activeListings = business.listings.filter(
            (listing) => listing.status === "active"
          );
          const hiddenListings = business.listings.filter(
            (listing) => listing.status !== "active"
          );
          const totalViews = business.listings.reduce(
            (total, listing) => total + (listing.views || 0),
            0
          );

          return (
            <section
              key={business.id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="border-b border-slate-200 p-5 md:p-7">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    {business.logo ? (
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <Image
                          src={business.logo}
                          alt={`Logo de ${business.name}`}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#e8f0ff] text-[#0f3c8c]">
                        <Store className="h-8 w-8" />
                      </div>
                    )}

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-2xl font-black text-slate-900">
                          {business.name}
                        </h2>

                        {business.isVerified ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        ) : null}
                      </div>

                      <p className="mt-1 text-sm font-black capitalize text-[#0f3c8c]">
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

                  <Link
                    href={`/publish?businessId=${business.id}`}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#0f3c8c] px-5 text-sm font-black text-white shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Publicar vehículo
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 bg-slate-50 p-5 sm:grid-cols-2 md:grid-cols-4 md:p-7">
                <MetricCard label="Anuncios totales" value={business.listings.length} />
                <MetricCard label="Activos" value={activeListings.length} tone="green" />
                <MetricCard label="No activos" value={hiddenListings.length} />
                <MetricCard label="Visitas" value={totalViews} tone="blue" icon />
              </div>

              <div className="p-5 md:p-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">
                      Publicaciones
                    </h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      Inventario publicado por {business.name}.
                    </p>
                  </div>
                </div>

                {business.listings.length === 0 ? (
                  <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                    <p className="text-sm font-bold text-slate-600">
                      Esta empresa todavía no tiene publicaciones.
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {business.listings.map((listing) => (
                      <article
                        key={listing.id}
                        className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3"
                      >
                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                          {listing.imageUrl ? (
                            <img
                              src={listing.imageUrl}
                              alt={listing.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-slate-400">
                              <Store className="h-7 w-7" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="line-clamp-2 text-sm font-black text-slate-900">
                            {listing.title}
                          </h4>

                          <p className="mt-1 text-sm font-black text-[#0f3c8c]">
                            {listing.price !== null
                              ? `$${listing.price.toLocaleString("es-CO")}`
                              : "Consultar precio"}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500">
                            <span
                              className={`rounded-full px-2 py-1 ${
                                listing.status === "active"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {listing.status === "active"
                                ? "Activo"
                                : "No activo"}
                            </span>

                            <span>{listing.views || 0} visitas</span>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <Link
                              href={`/listing/${listing.id}`}
                              className="inline-flex h-8 items-center justify-center rounded-lg bg-slate-100 px-3 text-xs font-black text-slate-700"
                            >
                              Ver anuncio
                            </Link>

                            {listing.status !== "deleted" ? (
                              <Link
                                href={`/listing/${listing.id}/edit`}
                                className="inline-flex h-8 items-center justify-center rounded-lg bg-[#0f3c8c] px-3 text-xs font-black text-white"
                              >
                                Editar anuncio
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  tone = "slate",
  icon = false,
}: {
  label: string;
  value: number;
  tone?: "slate" | "green" | "blue";
  icon?: boolean;
}) {
  const colors = {
    slate: "border-slate-200 bg-white text-slate-900",
    green: "border-emerald-200 bg-emerald-50 text-emerald-800",
    blue: "border-blue-200 bg-blue-50 text-blue-800",
  };

  return (
    <div className={`rounded-2xl border p-4 ${colors[tone]}`}>
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide opacity-70">
        {icon ? <Eye className="h-4 w-4" /> : null}
        {label}
      </div>

      <div className="mt-2 text-3xl font-black">
        {value.toLocaleString("es-CO")}
      </div>
    </div>
  );
}
