import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  Building2,
  FileText,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import AdminAccountVerificationActions from "@/components/AdminAccountVerificationActions";

const WHATSAPP_PARTICULAR_MESSAGE =
  "Hola, somos Kubo Anuncios. Recibimos tu solicitud de verificación. Para continuar, por favor responde a este mensaje confirmando que este número de WhatsApp te pertenece. Gracias.";

const WHATSAPP_BUSINESS_MESSAGE =
  "Hola, somos Kubo Anuncios. Recibimos tu solicitud para verificar tu empresa en Kubo. Para continuar con la verificación, por favor responde a este mensaje confirmando que este número de WhatsApp pertenece a la empresa. Gracias.";

function getWhatsAppHref(
  value: string | null,
  type: "PARTICULAR" | "EMPRESA"
) {
  const digits = String(value ?? "").replace(/\D/g, "");
  const normalized = digits.startsWith("0") ? digits.slice(1) : digits;

  const number = /^3\d{9}$/.test(normalized)
    ? `57${normalized}`
    : /^57\d{10}$/.test(normalized)
      ? normalized
      : normalized;

  const message =
    type === "EMPRESA"
      ? WHATSAPP_BUSINESS_MESSAGE
      : WHATSAPP_PARTICULAR_MESSAGE;

  return number
    ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
    : null;
}

export default async function AdminAccountVerificationsPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase().trim();

  if (email !== "mr.papas001@gmail.com") {
    redirect("/");
  }

  const requests = await prisma.accountVerification.findMany({
    where: { status: "PENDING" },
    orderBy: { submittedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 pb-24 pt-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 md:text-4xl">
              Verificaciones pendientes
            </h1>

            <p className="mt-2 text-sm font-medium text-slate-500">
              Revisa las solicitudes de verificación de cuenta pendientes.
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
            {requests.length}
          </div>
        </div>

        <div className="space-y-4">
          {requests.length ? (
            requests.map((item) => {
              const isBusiness = item.type === "EMPRESA";

              const whatsappHref = getWhatsAppHref(
                item.whatsappNumber,
                item.type
              );

              return (
                <div
                  key={item.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f0ff] px-3 py-1 text-xs font-black uppercase text-[#0f3c8c]">
                          {isBusiness ? (
                            <Building2 className="h-3.5 w-3.5" />
                          ) : (
                            <UserRound className="h-3.5 w-3.5" />
                          )}

                          {isBusiness ? "Empresa" : "Particular"}
                        </span>

                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-black uppercase text-yellow-700">
                          {item.status}
                        </span>
                      </div>

                      <p className="mt-3 text-lg font-black text-slate-900">
                        {item.email}
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-600">
                        WhatsApp: {item.whatsappNumber || "No informado"}
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-500">
                        Solicitud:{" "}
                        {item.submittedAt.toLocaleString("es-CO")}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row lg:items-center">
                      {whatsappHref ? (
                        <a
                          href={whatsappHref}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-11 items-center justify-center rounded-2xl bg-[#25D366] px-5 text-sm font-black text-white hover:bg-[#1fb85a]"
                        >
                          Verificar por WhatsApp
                        </a>
                      ) : null}

                      {isBusiness && item.rutUrl ? (
                        <a
                          href={`/api/admin/verification-document?type=account-business&requestId=${item.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 hover:bg-slate-50"
                        >
                          <FileText className="h-4 w-4" />
                          Ver RUT
                        </a>
                      ) : null}

                      <AdminAccountVerificationActions
  requestId={item.id}
  status={item.status}
  whatsappNumber={item.whatsappNumber}
  accountType={item.type}
/>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
              <ShieldCheck className="mx-auto h-8 w-8 text-emerald-600" />

              <div className="mt-3 text-xl font-black text-slate-900">
                No hay verificaciones pendientes
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}