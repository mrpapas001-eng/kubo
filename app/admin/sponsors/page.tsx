import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Megaphone,
  Plus,
} from "lucide-react";

import { authOptions } from "@/lib/authOptions";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/db";

export default async function AdminSponsorsPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase().trim();

  if (!isAdminEmail(email)) {
    redirect("/");
  }

  const sponsors = await prisma.sponsorAd.findMany({
    orderBy: [
      { isActive: "desc" },
      { priority: "desc" },
      { createdAt: "desc" },
    ],
  });

  const now = new Date();

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 pb-28 pt-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/admin"
              className="mb-4 inline-flex items-center gap-2 text-sm font-black text-[#0f3c8c]"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al panel
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700">
                <Megaphone className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-wide text-[#0f3c8c]">
                  Kubo admin
                </p>

                <h1 className="text-3xl font-black text-slate-900 md:text-4xl">
                  Sponsors
                </h1>
              </div>
            </div>

            <p className="mt-3 max-w-2xl text-sm font-medium text-slate-500">
              Gestiona la publicidad patrocinada de Kubo y decide a dónde
              llegará el usuario cuando pulse cada sponsor.
            </p>
          </div>

          <Link
            href="/admin/sponsors/nuevo"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#0f3c8c] px-5 text-sm font-black text-white shadow-sm hover:bg-[#0c2f6d]"
          >
            <Plus className="h-4 w-4" />
            Nuevo sponsor
          </Link>
        </div>

        {sponsors.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <Megaphone className="mx-auto h-10 w-10 text-slate-300" />

            <h2 className="mt-4 text-xl font-black text-slate-900">
              No hay sponsors
            </h2>

            <p className="mt-2 text-sm font-medium text-slate-500">
              Cuando crees el primero aparecerá aquí.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {sponsors.map((sponsor) => {
              const currentlyActive =
                sponsor.isActive &&
                sponsor.startAt <= now &&
                sponsor.endAt >= now;

              return (
                <div
                  key={sponsor.id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="grid gap-0 md:grid-cols-[220px_minmax(0,1fr)]">
                    <div className="min-h-[150px] bg-slate-100">
                      {sponsor.imageUrl ? (
                        <img
                          src={sponsor.imageUrl}
                          alt={sponsor.title}
                          className="h-full min-h-[150px] w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full min-h-[150px] items-center justify-center">
                          <Megaphone className="h-9 w-9 text-slate-300" />
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-lg font-black text-slate-900">
                              {sponsor.title}
                            </h2>

                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${
                                currentlyActive
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {currentlyActive ? "Activo" : "Inactivo"}
                            </span>
                          </div>

                          {sponsor.subtitle ? (
                            <p className="mt-1 text-sm font-medium text-slate-500">
                              {sponsor.subtitle}
                            </p>
                          ) : null}

                          <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                            <span className="rounded-lg bg-slate-100 px-2.5 py-1.5">
                              {sponsor.placement}
                            </span>

                            <span className="rounded-lg bg-slate-100 px-2.5 py-1.5">
                              Prioridad {sponsor.priority}
                            </span>

                            {sponsor.categorySlug ? (
                              <span className="rounded-lg bg-slate-100 px-2.5 py-1.5">
                                {sponsor.categorySlug}
                              </span>
                            ) : null}
                          </div>

                          {sponsor.ctaUrl ? (
                            <div className="mt-4 flex items-center gap-2 text-sm font-bold text-[#0f3c8c]">
                              <ExternalLink className="h-4 w-4 shrink-0" />
                              <span className="break-all">
                                {sponsor.ctaUrl}
                              </span>
                            </div>
                          ) : (
                            <div className="mt-4 text-sm font-bold text-red-600">
                              Sin destino configurado
                            </div>
                          )}
                        </div>

                        <Link
                          href={`/admin/sponsors/${sponsor.id}`}
                          className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50"
                        >
                          Editar
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}