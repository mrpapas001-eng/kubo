import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  BadgeCheck,
  Building2,
  Eye,
  FileWarning,
  Flag,
  Heart,
  IdCard,
  Megaphone,
  ShieldCheck,
  Store,
} from "lucide-react";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { isAdminEmail } from "@/lib/admin";

function StatCard({
  label,
  value,
  tone = "slate",
}: {
  label: string;
  value: string | number;
  tone?: "slate" | "yellow" | "emerald" | "red" | "blue";
}) {
  const tones = {
    slate: "border-slate-200 bg-white text-slate-900",
    yellow: "border-yellow-200 bg-yellow-50 text-yellow-800",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
    red: "border-red-200 bg-red-50 text-red-800",
    blue: "border-blue-200 bg-blue-50 text-blue-800",
  };

  return (
    <div className={`rounded-3xl border p-5 shadow-sm ${tones[tone]}`}>
      <div className="text-xs font-black uppercase tracking-wide opacity-70">
        {label}
      </div>
      <div className="mt-2 text-3xl font-black">{value}</div>
    </div>
  );
}

function AdminLink({
  href,
  title,
  description,
  icon: Icon,
  badge,
  actionLabel,
}: {
  href: string;
  title: string;
  description: string;
  icon: any;
  badge?: string | number;
  actionLabel?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f0ff] text-[#0f3c8c]">
        <Icon className="h-6 w-6" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-black text-slate-900">{title}</h2>

          {badge !== undefined ? (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-black text-yellow-800">
              {badge}
            </span>
          ) : null}
        </div>

        <p className="mt-1 text-sm font-medium leading-relaxed text-slate-500">
          {description}
        </p>

        {actionLabel ? (
          <div className="mt-4 text-sm font-black text-[#0f3c8c]">
            {actionLabel} →
          </div>
        ) : null}
      </div>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase().trim();

  if (!isAdminEmail(email)) {
    redirect("/");
  }

  const [
    totalListings,
    activeListings,
    hiddenListings,
    deletedListings,
    premiumListings,
    featuredListings,
    pendingReports,
    pendingIdentity,
    pendingBusiness,
    pendingAccountVerifications,
    pendingAidRequests,
    totalConversations,
    totalViews,
  ] = await Promise.all([
    prisma.listing.count(),
    prisma.listing.count({ where: { status: "active" } }),
    prisma.listing.count({ where: { status: "hidden" } }),
    prisma.listing.count({ where: { status: "deleted" } }),
    prisma.listing.count({
      where: { isPremium: true, status: "active" },
    }),
    prisma.listing.count({
      where: { isFeatured: true, status: "active" },
    }),
    prisma.listingReport.count({
      where: { status: "pending" },
    }),
    prisma.identityVerificationRequest.count({
      where: { status: "pending" },
    }),
    prisma.businessVerificationRequest.count({
      where: { status: "pending" },
    }),
    prisma.accountVerification.count({
      where: { status: "PENDING" },
    }),
    prisma.aidRequest.count({
      where: { status: "PENDING" },
    }),
    prisma.conversation.count(),
    prisma.listing.aggregate({
      _sum: { views: true },
    }),
  ]);

  const pendingTotal =
    pendingReports +
    pendingIdentity +
    pendingBusiness +
    pendingAccountVerifications +
    pendingAidRequests;

  const views = totalViews._sum.views ?? 0;

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 pb-28 pt-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-[#0f3c8c]">
              Kubo admin
            </p>

            <h1 className="mt-2 text-3xl font-black text-slate-900 md:text-4xl">
              Panel de control
            </h1>

            <p className="mt-2 text-sm font-medium text-slate-500">
              Gestiona reportes, verificaciones y estado general del marketplace.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Ver marketplace
          </Link>
        </div>

        {pendingTotal > 0 ? (
          <div className="mb-6 rounded-3xl border border-yellow-200 bg-yellow-50 p-5">
            <div className="flex items-start gap-3">
              <FileWarning className="mt-0.5 h-6 w-6 shrink-0 text-yellow-700" />

              <div>
                <div className="text-lg font-black text-yellow-900">
                  Hay {pendingTotal} tarea
                  {pendingTotal === 1 ? "" : "s"} pendiente
                </div>

                <p className="mt-1 text-sm font-medium text-yellow-800">
                  Revisa reportes y solicitudes de verificación antes de
                  publicar cambios importantes.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-4">
          <StatCard label="Anuncios" value={totalListings} />
          <StatCard
            label="Activos"
            value={activeListings}
            tone="emerald"
          />
          <StatCard
            label="Ocultos"
            value={hiddenListings}
            tone="yellow"
          />
          <StatCard
            label="Eliminados"
            value={deletedListings}
            tone="red"
          />
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-4">
          <StatCard
            label="Premium"
            value={premiumListings}
            tone="yellow"
          />
          <StatCard
            label="Destacados"
            value={featuredListings}
            tone="blue"
          />
          <StatCard
            label="Chats"
            value={totalConversations}
          />
          <StatCard
            label="Visitas"
            value={views.toLocaleString("es-CO")}
          />
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-[#0f3c8c]" />

            <h2 className="text-xl font-black text-slate-900">
              Verificaciones
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            <AdminLink
              href="/admin/reports"
              title="Reportes"
              description="Revisa anuncios reportados, oculta, resuelve o elimina publicaciones."
              icon={Flag}
              badge={pendingReports}
            />

            <AdminLink
              href="/admin/identity-verifications"
              title="Identidades"
              description="Revisa documentos y verifica usuarios."
              icon={IdCard}
              badge={pendingIdentity}
              actionLabel="Gestionar identidades"
            />

            <AdminLink
              href="/admin/business-verifications"
              title="Empresas"
              description="Revisa RUT y aprueba empresas."
              icon={Building2}
              badge={pendingBusiness}
              actionLabel="Gestionar empresas"
            />

            <AdminLink
              href="/admin/account-verifications"
              title="Verificaciones pendientes"
              description="Revisa solicitudes de cuenta por WhatsApp y RUT."
              icon={ShieldCheck}
              badge={pendingAccountVerifications}
              actionLabel="Gestionar solicitudes"
            />

            <AdminLink
              href="/admin/aid-requests"
              title="Solicitudes de ayuda"
              description="Revisa y aprueba solicitudes de Kubo Ayuda antes de publicarlas."
              icon={Heart}
              badge={pendingAidRequests}
              actionLabel="Gestionar solicitudes"
            />
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-[#0f3c8c]" />

              <h2 className="text-xl font-black text-slate-900">
                Confianza
              </h2>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <StatCard
                label="Identidades pendientes"
                value={pendingIdentity}
                tone={pendingIdentity ? "yellow" : "emerald"}
              />

              <StatCard
                label="Empresas pendientes"
                value={pendingBusiness}
                tone={pendingBusiness ? "yellow" : "emerald"}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Megaphone className="h-6 w-6 text-yellow-700" />

              <h2 className="text-xl font-black text-slate-900">
                Visibilidad
              </h2>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <StatCard
                label="Premium activos"
                value={premiumListings}
                tone="yellow"
              />

              <StatCard
                label="Destacados activos"
                value={featuredListings}
                tone="blue"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <AdminLink
            href="/buscar"
            title="Buscar anuncios"
            description="Vista pública para revisar cómo aparecen los anuncios activos."
            icon={Eye}
          />

          <AdminLink
            href="/mis-anuncios"
            title="Mis anuncios"
            description="Acceso rápido a tus propias publicaciones de prueba."
            icon={Store}
          />

          <AdminLink
            href="/verificar-empresa"
            title="Probar verificación"
            description="Enviar una solicitud de empresa para comprobar el flujo."
            icon={BadgeCheck}
          />
        </div>
      </div>
    </div>
  );
}