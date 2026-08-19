import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronLeft, Heart } from "lucide-react";
import { prisma } from "@/lib/db";
import AidRequestCard from "@/components/AidRequestCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Necesidades verificadas - Kubo Ayuda",
  description: "Solicitudes de ayuda revisadas y aprobadas por Kubo.",
};

export default async function NecesidadesPage() {
  const requests = await prisma.aidRequest.findMany({
    where: { status: { in: ["APPROVED", "MATCHED"] } },
    orderBy: { createdAt: "desc" },
    take: 48,
    select: {
      id: true,
      title: true,
      category: true,
      city: true,
      description: true,
      contextImageUrl: true,
      status: true,
      ownerName: true,
      createdAt: true,
    },
  });

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-slate-900">
      <Header />

      <main className="pb-16 pt-3 md:pt-4">
        <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8">
          <Link
            href="/ayuda"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Volver a Kubo Ayuda
          </Link>

          <section className="mt-4">
            <div className="overflow-hidden rounded-[28px] border border-rose-200/60 bg-gradient-to-br from-rose-600 to-rose-700 p-6 shadow-sm md:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white">
                <Heart className="h-3.5 w-3.5" />
                Necesidades verificadas
              </div>
              <h1 className="mt-4 text-2xl font-black leading-tight text-white md:text-3xl">
                Solicitudes revisadas y aprobadas por Kubo
              </h1>
              <p className="mt-2 text-sm leading-6 text-white/80 md:text-base">
                Cada solicitud fue revisada antes de publicarse. Nunca se pide dinero: solo artículos y ayuda material concreta.
              </p>
            </div>
          </section>

          <section className="mt-6">
            {requests.length === 0 ? (
              <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-sm">
                <Heart className="mx-auto h-10 w-10 text-rose-300" />
                <p className="mt-4 text-lg font-black text-slate-900">
                  No hay necesidades publicadas por ahora
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Vuelve pronto o publica una donación para ayudar.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {requests.map((request) => (
                  <AidRequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
