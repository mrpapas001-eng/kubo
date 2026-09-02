import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Plus,
  Store,
} from "lucide-react";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { isAdminEmail } from "@/lib/admin";

export default async function AdminBusinessesPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase().trim();

  if (!isAdminEmail(email)) {
    redirect("/");
  }

  const businesses = await prisma.business.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          listings: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 pb-24 pt-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/admin"
              className="mb-4 inline-flex items-center gap-2 text-sm font-black text-[#0f3c8c]"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al panel
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f0ff] text-[#0f3c8c]">
                <Building2 className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wide text-[#0f3c8c]">
                  Kubo Empresas
                </p>

                <h1 className="text-3xl font-black text-slate-900">
                  Empresas
                </h1>
              </div>
            </div>

            <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-slate-500">
              Administra concesionarios, inmobiliarias, tiendas y otras empresas
              que publican dentro de Kubo.
            </p>
          </div>

          <Link
            href="/admin/businesses/new"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#0f3c8c] px-5 text-sm font-black text-white shadow-sm transition hover:opacity-95"
          >
            <Plus className="h-5 w-5" />
            Nueva empresa
          </Link>
        </div>

        <div className="mb-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-black uppercase tracking-wide text-slate-500">
              Total empresas
            </div>

            <div className="mt-2 text-3xl font-black text-slate-900">
              {businesses.length}
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <div className="text-xs font-black uppercase tracking-wide text-emerald-700">
              Activas
            </div>

            <div className="mt-2 text-3xl font-black text-emerald-800">
              {businesses.filter((business) => business.isActive).length}
            </div>
          </div>

          <div className="rounded-3xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
            <div className="text-xs font-black uppercase tracking-wide text-blue-700">
              Verificadas
            </div>

            <div className="mt-2 text-3xl font-black text-blue-800">
              {businesses.filter((business) => business.isVerified).length}
            </div>
          </div>
        </div>

        {businesses.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-500">
              <Store className="h-8 w-8" />
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-900">
              Todavía no hay empresas
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-relaxed text-slate-500">
              Crea la primera empresa de Kubo. Empezaremos con Movil Autos.
            </p>

            <Link
              href="/admin/businesses/new"
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#0f3c8c] px-5 text-sm font-black text-white"
            >
              <Plus className="h-4 w-4" />
              Crear primera empresa
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {businesses.map((business) => (
              <Link
                key={business.id}
                href={`/admin/businesses/${business.id}`}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f0ff] text-[#0f3c8c]">
                      <Building2 className="h-6 w-6" />
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-black text-slate-900">
                        {business.name}
                      </h2>

                      <p className="truncate text-sm font-medium text-slate-500">
                        {business.businessType || "Empresa"}
                      </p>
                    </div>
                  </div>

                  {business.isVerified ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                  ) : null}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <div className="text-xs font-bold text-slate-500">
                      Anuncios
                    </div>

                    <div className="mt-1 text-xl font-black text-slate-900">
                      {business._count.listings}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3">
                    <div className="text-xs font-bold text-slate-500">
                      Estado
                    </div>

                    <div className="mt-1 text-sm font-black text-slate-900">
                      {business.isActive ? "Activa" : "Inactiva"}
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-sm font-black text-[#0f3c8c]">
                  Administrar empresa →
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}