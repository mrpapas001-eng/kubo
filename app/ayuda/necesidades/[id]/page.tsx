import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronLeft, Clock, Heart, MapPin, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/db";
import { AID_CATEGORIES } from "@/lib/aidRequestPolicy";
import AidRequestHelpActions from "@/components/AidRequestHelpActions";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

function categoryLabel(slug: string): string {
  return AID_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

export default async function NecesidadDetallePage({ params }: PageProps) {
  const { id } = await params;

  if (!id) return notFound();

  const request = await prisma.aidRequest.findUnique({
    where: { id },
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

  if (!request || !["APPROVED", "MATCHED"].includes(request.status)) {
    return notFound();
  }

  const isMatched = request.status === "MATCHED";

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-slate-900">
      <Header />

      <main className="pb-16 pt-3 md:pt-4">
        <div className="mx-auto max-w-[900px] px-4 md:px-6 lg:px-8">
          <Link
            href="/ayuda/necesidades"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Volver a necesidades verificadas
          </Link>

          <section className="mt-4 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            {request.contextImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={request.contextImageUrl}
                alt={request.title}
                className="h-64 w-full object-cover"
              />
            ) : (
              <div className="flex h-40 w-full items-center justify-center bg-rose-50">
                <Heart className="h-12 w-12 text-rose-300" />
              </div>
            )}

            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-rose-100 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-rose-700">
                  {categoryLabel(request.category)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-emerald-700">
                  <ShieldCheck className="h-3 w-3" />
                  Revisada por Kubo
                </span>
                {isMatched && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-amber-700">
                    <Clock className="h-3 w-3" />
                    En proceso
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-2xl font-black leading-tight text-slate-900 md:text-3xl">
                {request.title}
              </h1>

              <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-slate-500">
                <MapPin className="h-4 w-4" />
                {request.city}
                {request.ownerName ? <span>· {request.ownerName}</span> : null}
              </div>

              <p className="mt-4 whitespace-pre-line text-base leading-7 text-slate-700">
                {request.description}
              </p>

              {isMatched && (
                <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm leading-5 text-amber-800">
                  Ya hay una ayuda en curso para esta solicitud, pero puedes
                  contactar por si se necesita algo más.
                </p>
              )}
            </div>
          </section>

          <section className="mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-lg font-black text-slate-900">
              Quiero ayudar con esta necesidad
            </h2>
            <p className="mt-1 text-sm leading-5 text-slate-600">
              Estás respondiendo a esta solicitud concreta. No necesitas llenar
              ningún formulario: contacta directamente a la persona y acuerden
              la entrega.
            </p>

            <div className="mt-5">
              <AidRequestHelpActions requestId={request.id} />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
