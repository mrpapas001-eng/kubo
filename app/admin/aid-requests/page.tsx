import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Heart, MapPin } from "lucide-react";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { isAdminEmail } from "@/lib/admin";
import { AID_CATEGORIES } from "@/lib/aidRequestPolicy";
import AdminAidRequestActions from "@/components/AdminAidRequestActions";

const STATUS_BADGES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  MATCHED: "bg-blue-100 text-blue-700",
  REJECTED: "bg-red-100 text-red-700",
  COMPLETED: "bg-slate-100 text-slate-600",
  CANCELLED: "bg-slate-100 text-slate-600",
};

function categoryLabel(slug: string): string {
  return AID_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

export default async function AdminAidRequestsPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!isAdminEmail(email)) {
    redirect("/");
  }

  const requests = await prisma.aidRequest.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 100,
  });

  const pending = requests.filter((r) => r.status === "PENDING");
  const active = requests.filter((r) =>
    ["APPROVED", "MATCHED"].includes(r.status)
  );
  const closed = requests.filter((r) =>
    ["REJECTED", "COMPLETED", "CANCELLED"].includes(r.status)
  );

  const sections: Array<{ title: string; items: typeof requests }> = [
    { title: "Pendientes de revisión", items: pending },
    { title: "Publicadas (aprobadas / en proceso)", items: active },
    { title: "Historial (rechazadas / completadas / canceladas)", items: closed },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 pb-24 pt-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 md:text-4xl">
              Solicitudes de ayuda
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Revisa, aprueba o rechaza las solicitudes de Kubo Ayuda antes de publicarlas.
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700"
          >
            Panel
          </Link>
        </div>

        <div className="mb-7 rounded-3xl border border-yellow-200 bg-yellow-50 p-5">
          <div className="text-xs font-black uppercase text-yellow-700">
            Pendientes
          </div>
          <div className="mt-2 text-2xl font-black text-yellow-800">
            {pending.length}
          </div>
        </div>

        {sections.map((section) => (
          <div key={section.title} className="mb-8">
            <h2 className="mb-3 text-xl font-black text-slate-900">
              {section.title}
            </h2>

            {section.items.length ? (
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-black uppercase text-rose-700">
                            <Heart className="h-3.5 w-3.5" />
                            {categoryLabel(item.category)}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black uppercase ${STATUS_BADGES[item.status] ?? "bg-slate-100 text-slate-600"}`}
                          >
                            {item.status}
                          </span>
                        </div>

                        <p className="mt-3 text-lg font-black text-slate-900">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {item.description}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {item.city}
                          </span>
                          <span>{item.ownerEmail}</span>
                          <span>WhatsApp: {item.whatsappNumber}</span>
                          <span>
                            Enviada: {item.createdAt.toLocaleString("es-CO")}
                          </span>
                        </div>

                        {item.contextImageUrl ? (
                          <a
                            href={item.contextImageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-block text-sm font-black text-[#0f3c8c] hover:underline"
                          >
                            Ver foto de contexto
                          </a>
                        ) : null}

                        {item.rejectionReason ? (
                          <p className="mt-2 text-sm text-red-600">
                            Motivo de rechazo: {item.rejectionReason}
                          </p>
                        ) : null}

                        {item.adminNotes ? (
                          <p className="mt-2 text-sm italic text-slate-500">
                            Nota interna: {item.adminNotes}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row lg:items-center">
                        <AdminAidRequestActions
                          requestId={item.id}
                          status={item.status}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center text-sm font-medium text-slate-500">
                Sin solicitudes en esta sección.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
