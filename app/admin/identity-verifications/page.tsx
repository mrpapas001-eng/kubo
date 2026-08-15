import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FileText, IdCard } from "lucide-react";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import AdminIdentityVerificationActions from "@/components/AdminIdentityVerificationActions";

export default async function AdminIdentityVerificationsPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase().trim();

  if (email !== "mr.papas001@gmail.com") {
    redirect("/");
  }

  const requests = await prisma.identityVerificationRequest.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = requests.length;
  const pending = requests.filter((item) => item.status === "pending").length;
  const approved = requests.filter((item) => item.status === "approved").length;

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 pb-24 pt-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 md:text-4xl">
              Verificacion de identidad
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Revisa documentos y aprueba el sello de vendedor verificado.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/admin"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700"
            >
              Panel
            </Link>
            <Link
              href="/admin/business-verifications"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700"
            >
              Empresas
            </Link>
            <Link
              href="/admin/reports"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700"
            >
              Reportes
            </Link>
          </div>
        </div>

        <div className="mb-7 grid gap-3 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <div className="text-xs font-black uppercase text-slate-400">
              Total
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900">
              {total}
            </div>
          </div>
          <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-5">
            <div className="text-xs font-black uppercase text-yellow-700">
              Pendientes
            </div>
            <div className="mt-2 text-2xl font-black text-yellow-800">
              {pending}
            </div>
          </div>
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="text-xs font-black uppercase text-emerald-700">
              Aprobadas
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-800">
              {approved}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {requests.length ? (
            requests.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f0ff] px-3 py-1 text-xs font-black uppercase text-[#0f3c8c]">
                        <IdCard className="h-3.5 w-3.5" />
                        Identidad
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                          item.status === "approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : item.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h2 className="mt-3 text-xl font-black text-slate-900">
                      {item.ownerName || "Usuario"}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      {item.ownerEmail}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row lg:items-center">
                    <a
                      href={item.documentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 hover:bg-slate-50"
                    >
                      <FileText className="h-4 w-4" />
                      Ver documento
                    </a>

                    <AdminIdentityVerificationActions
                      requestId={item.id}
                      status={item.status}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
              <div className="text-xl font-black text-slate-900">
                No hay solicitudes
              </div>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Cuando un vendedor envie su documento aparecera aqui.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
