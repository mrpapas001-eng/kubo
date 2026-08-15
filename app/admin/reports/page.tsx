import Link from "next/link";
import { prisma } from "@/lib/db";
import AdminReportActions from "@/components/AdminReportActions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function AdminReportsPage() {
    const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase().trim();

  const isAdmin = email === "mr.papas001@gmail.com";

  if (!isAdmin) {
    redirect("/");
  }
  const reports = await prisma.listingReport.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      listing: true,
    },
  });

  const pendingCount = reports.filter((report) => report.status === "pending").length;
  const resolvedCount = reports.filter((report) => report.status === "resolved").length;

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 pb-28 pt-8 md:px-6 md:py-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-black text-slate-900">
                Reportes de anuncios
              </h1>

              <p className="mt-2 text-sm font-medium text-slate-500">
                Gestiona anuncios reportados dentro de Kubo.
              </p>
            </div>

            <Link
              href="/admin"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Panel admin
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <div className="text-xs font-black uppercase tracking-wide text-slate-400">
                Total
              </div>
              <div className="mt-1 text-2xl font-black text-slate-900">
                {reports.length}
              </div>
            </div>

            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-4 shadow-sm">
              <div className="text-xs font-black uppercase tracking-wide text-yellow-700">
                Pendientes
              </div>
              <div className="mt-1 text-2xl font-black text-yellow-800">
                {pendingCount}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 shadow-sm">
              <div className="text-xs font-black uppercase tracking-wide text-emerald-700">
                Resueltos
              </div>
              <div className="mt-1 text-2xl font-black text-emerald-800">
                {resolvedCount}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-black uppercase tracking-wide text-red-500">
                      Reporte
                    </div>

                    <h2 className="mt-1 text-xl font-black text-slate-900">
                      {report.listing?.title || "Anuncio eliminado"}
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <div className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600">
                      {report.reason}
                    </div>

                    <div
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        report.status === "resolved"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      Estado: {report.status}
                    </div>

                    <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                      Reportes: {report.listing?.reportedCount || 0}
                    </div>

                    {report.listing?.status === "deleted" ? (
                      <div className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700">
                        Anuncio eliminado
                      </div>
                    ) : null}
                  </div>

                  {report.details ? (
                    <p className="max-w-[700px] text-sm font-medium leading-relaxed text-slate-600">
                      {report.details}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-3">
                  {report.listing ? (
                    <Link
                      href={`/listing/${report.listing.id}`}
                      className="flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 hover:bg-slate-50"
                    >
                      Ver anuncio
                    </Link>
                  ) : null}

{report.listing ? (
  <AdminReportActions
    listingId={report.listing.id}
    reportId={report.id}
    reportStatus={report.status}
    listingStatus={report.listing.status}
  />
) : null}
                </div>
              </div>
            </div>
          ))}

          {reports.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="text-2xl font-black text-slate-900">
                No hay reportes
              </div>

              <p className="mt-2 text-sm font-medium text-slate-500">
                Todo limpio por ahora 🚀
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
