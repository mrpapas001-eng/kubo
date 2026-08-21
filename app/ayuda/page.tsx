import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AidHelpButton from "@/components/AidHelpButton";
import {
  HandHeart,
  Heart,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  SearchCheck,
  Handshake,
  PackageCheck,
  Gift,
  MapPin,
  Clock,
  UserRound,
  BadgeCheck,
  PackageOpen,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { AID_CATEGORIES } from "@/lib/aidRequestPolicy";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kubo Ayuda - Donaciones y solicitudes de ayuda",
  description:
    "Conectamos personas que quieren donar con personas que realmente lo necesitan.",
};

function categoryLabel(slug: string): string {
  return AID_CATEGORIES.find((category) => category.slug === slug)?.label ?? slug;
}

function formatRelativeDate(value: string | Date): string {
  const createdAt = new Date(value);
  const now = new Date();

  const diffMs = now.getTime() - createdAt.getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / 86_400_000));

  if (diffDays === 0) return "Publicado hoy";
  if (diffDays === 1) return "Publicado hace 1 día";

  return `Publicado hace ${diffDays} días`;
}

export default async function AyudaPage() {
  const approvedNeeds = await prisma.aidRequest.findMany({
    where: { status: { in: ["APPROVED", "MATCHED"] } },
    orderBy: { createdAt: "desc" },
    take: 4,
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
    <div className="min-h-screen bg-[#F4F8FF] text-slate-900">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.12),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(34,211,238,0.12),_transparent_30%),linear-gradient(to_bottom,_#ffffff,_#f4f8ff)]" />

        <div className="pointer-events-none absolute -left-40 top-36 h-96 w-96 rounded-full bg-blue-200/20 blur-3xl" />

        <div className="pointer-events-none absolute -right-36 top-24 h-96 w-96 rounded-full bg-cyan-200/20 blur-3xl" />

        <Header />

        <main className="relative pb-16 pt-4">
          <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8">
            {/* HERO */}
            <section className="mt-3">
              <div className="relative overflow-hidden rounded-[34px] border border-blue-400/20 bg-gradient-to-br from-[#174ea6] via-[#0f3c8c] to-[#071f4e] shadow-[0_28px_70px_rgba(15,60,140,0.25)]">
                <div className="pointer-events-none absolute -right-24 -top-28 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />
                <div className="pointer-events-none absolute bottom-[-160px] left-[32%] h-96 w-96 rounded-full bg-cyan-300/10 blur-3xl" />

                <div className="relative grid min-h-[310px] items-center gap-8 px-7 py-9 md:px-10 lg:grid-cols-[1.15fr_.85fr] lg:px-12 lg:py-10">
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/30 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-blue-100 backdrop-blur">
                      <Heart className="h-3.5 w-3.5 fill-cyan-300 text-cyan-300" />
                      Kubo Ayuda
                    </div>

                    <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.02] text-white md:text-5xl lg:text-[54px]">
                      Dar una mano
                      <span className="mt-1 block bg-gradient-to-r from-[#7dd3fc] via-[#67e8f9] to-[#bfdbfe] bg-clip-text text-transparent">
                        puede cambiar mucho.
                      </span>
                    </h1>

                    <p className="mt-5 max-w-xl text-base leading-7 text-blue-50/90 md:text-lg">
                      Conectamos personas que quieren donar con personas que
                      realmente lo necesitan.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-white/90 backdrop-blur">
                        <ShieldCheck className="h-4 w-4 text-cyan-300" />
                        Solicitudes revisadas
                      </div>

                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-white/90 backdrop-blur">
                        <Heart className="h-4 w-4 fill-cyan-300 text-cyan-300" />
                        Ayuda entre personas
                      </div>
                    </div>
                  </div>

                  <div className="relative hidden min-h-[250px] items-center justify-center lg:flex">
                    <div className="absolute h-56 w-56 rounded-full bg-blue-300/20 blur-3xl" />

                    <div className="relative z-10 flex h-48 w-48 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.22)] backdrop-blur-md">
                      <HandHeart className="h-28 w-28 stroke-[1.6] text-white" />
                    </div>

                    <div className="absolute right-[12%] top-[8%] flex h-16 w-16 rotate-6 items-center justify-center rounded-[20px] border border-white/20 bg-gradient-to-br from-[#4a8cff] to-[#1765e8] shadow-xl">
                      <Heart className="h-8 w-8 fill-white text-white" />
                    </div>

                    <div className="absolute bottom-[12%] left-[12%] flex h-14 w-14 -rotate-6 items-center justify-center rounded-[18px] border border-white/20 bg-cyan-400 shadow-xl">
                      <Sparkles className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ACCIONES PRINCIPALES */}
            <section className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="group relative overflow-hidden rounded-[32px] border border-blue-200 bg-white shadow-[0_18px_50px_rgba(15,60,140,0.09)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(15,60,140,0.15)]">
                <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-blue-100/70 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-0 h-[55%] w-[40%] rounded-tl-[140px] bg-gradient-to-br from-blue-50/90 to-cyan-50/70" />

                <div className="relative grid min-h-[370px] grid-cols-1 gap-5 p-6 md:grid-cols-[1.28fr_.72fr] md:p-8">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-[20px] border border-blue-100 bg-gradient-to-br from-[#edf4ff] to-[#dceaff] shadow-sm">
                        <HandHeart className="h-8 w-8 text-[#1557d6]" />
                      </div>

                      <div>
                        <div className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#3b82f6]">
                          Tengo algo para compartir
                        </div>

                        <h2 className="text-2xl font-black tracking-tight text-[#0f3c8c] md:text-[30px]">
                          QUIERO DONAR
                        </h2>

                        <p className="mt-1 text-sm text-slate-600">
                          Publica algo que quieras entregar gratuitamente.
                        </p>
                      </div>
                    </div>

                    <div className="mt-7 space-y-3.5">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 text-[#1557d6]" />
                        <p className="text-sm leading-5 text-slate-700">
                          La donación debe ser completamente gratuita.
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 text-[#1557d6]" />
                        <p className="text-sm leading-5 text-slate-700">
                          No se permiten cobros ocultos.
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 text-[#1557d6]" />
                        <p className="text-sm leading-5 text-slate-700">
                          El donante deberá tener WhatsApp verificado.
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/ayuda/donar"
                      className="mt-auto flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1765e8] via-[#1557d6] to-[#0f3c8c] px-6 py-4 text-sm font-black text-white shadow-[0_12px_28px_rgba(21,87,214,0.24)] transition-all duration-300 hover:-translate-y-0.5"
                    >
                      Quiero donar
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="relative hidden items-center justify-center md:flex">
                    <div className="absolute bottom-8 h-28 w-44 rounded-[50%] bg-blue-200/50 blur-2xl" />

                    <div className="relative h-56 w-full">
                      <div className="absolute bottom-4 left-1/2 h-[86px] w-[145px] -translate-x-1/2 rounded-b-[24px] rounded-t-[10px] bg-gradient-to-b from-[#DFA45F] to-[#BB7E3D]" />
                      <div className="absolute bottom-[76px] left-[18%] h-16 w-[88px] rotate-[-10deg] rounded-[12px] bg-[#E9B56F]" />
                      <div className="absolute bottom-[76px] right-[18%] h-16 w-[88px] rotate-[10deg] rounded-[12px] bg-[#D99C55]" />
                      <div className="absolute bottom-[94px] left-[23%] h-24 w-12 rotate-[-10deg] rounded-[18px] bg-gradient-to-b from-[#79AEFF] to-[#4387ED]" />
                      <div className="absolute bottom-[92px] right-[22%] h-[88px] w-10 rounded-[16px] bg-gradient-to-b from-[#6CA6FF] to-[#276FD7]" />

                      <div className="absolute bottom-[96px] left-1/2 h-[88px] w-[72px] -translate-x-1/2 rounded-[38px] bg-[#B8814C]">
                        <div className="absolute -left-2 top-0 h-7 w-7 rounded-full bg-[#A87140]" />
                        <div className="absolute -right-2 top-0 h-7 w-7 rounded-full bg-[#A87140]" />
                        <div className="absolute left-1/2 top-7 h-11 w-12 -translate-x-1/2 rounded-full bg-[#E1B580]" />
                      </div>

                      <div className="absolute right-0 top-8 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1557d6] shadow-lg">
                        <Heart className="h-6 w-6 fill-white text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-[32px] border border-blue-200 bg-white shadow-[0_18px_50px_rgba(15,60,140,0.09)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(15,60,140,0.15)]">
                <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-cyan-100/70 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-0 h-[55%] w-[40%] rounded-tl-[140px] bg-gradient-to-br from-blue-50/90 to-cyan-50/70" />

                <div className="relative grid min-h-[370px] grid-cols-1 gap-5 p-6 md:grid-cols-[1.28fr_.72fr] md:p-8">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-[20px] border border-blue-100 bg-gradient-to-br from-[#edf4ff] to-[#dceaff] shadow-sm">
                        <Heart className="h-8 w-8 text-[#1557d6]" />
                      </div>

                      <div>
                        <div className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#3b82f6]">
                          Hoy necesito una mano
                        </div>

                        <h2 className="text-2xl font-black tracking-tight text-[#0f3c8c] md:text-[30px]">
                          NECESITO AYUDA
                        </h2>

                        <p className="mt-1 text-sm text-slate-600">
                          Cuéntanos qué necesitas y revisaremos tu solicitud.
                        </p>
                      </div>
                    </div>

                    <div className="mt-7 space-y-3.5">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 text-[#1557d6]" />
                        <p className="text-sm font-semibold leading-5 text-slate-700">
                          No se permite solicitar dinero.
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 text-[#1557d6]" />
                        <p className="text-sm leading-5 text-slate-700">
                          La solicitud debe ser para una necesidad concreta.
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 text-[#1557d6]" />
                        <p className="text-sm leading-5 text-slate-700">
                          Solo podrá existir una solicitud activa por usuario.
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 text-[#1557d6]" />
                        <p className="text-sm leading-5 text-slate-700">
                          El WhatsApp deberá estar verificado.
                        </p>
                      </div>

                      <div className="flex items-start gap-3">
                        <ShieldCheck className="mt-0.5 h-5 w-5 text-[#1557d6]" />
                        <p className="text-sm leading-5 text-slate-700">
                          Las solicitudes serán revisadas antes de publicarse.
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/ayuda/necesito"
                      className="mt-auto flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1765e8] via-[#1557d6] to-[#0f3c8c] px-6 py-4 text-sm font-black text-white shadow-[0_12px_28px_rgba(21,87,214,0.24)] transition-all duration-300 hover:-translate-y-0.5"
                    >
                      Necesito ayuda
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="relative hidden items-center justify-center md:flex">
                    <div className="absolute h-44 w-44 rounded-full bg-blue-200/50 blur-2xl" />

                    <div className="relative flex h-56 w-full items-center justify-center">
                      <div className="absolute bottom-6 left-[22%] h-24 w-12 rotate-[14deg] rounded-[24px] bg-gradient-to-b from-[#78A7F7] to-[#437EDB]" />
                      <div className="absolute bottom-6 right-[22%] h-24 w-12 rotate-[-14deg] rounded-[24px] bg-gradient-to-b from-[#78A7F7] to-[#437EDB]" />
                      <div className="relative z-10 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-[#4A8EFF] via-[#246FEF] to-[#0F4EB8] shadow-[0_22px_45px_rgba(21,87,214,0.30)]">
                        <Heart className="h-20 w-20 fill-white text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SOLICITUDES REVISADAS */}
            {approvedNeeds.length > 0 && (
              <section className="mt-7">
                <div className="overflow-hidden rounded-[32px] border border-blue-100 bg-white p-5 shadow-[0_18px_50px_rgba(15,60,140,0.08)] md:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#1765e8] to-[#0f3c8c] shadow-[0_10px_24px_rgba(21,87,214,0.25)]">
                        <ShieldCheck className="h-7 w-7 text-white" />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-2xl font-black text-[#0f3c8c] md:text-3xl">
                            Solicitudes revisadas por Kubo
                          </h2>

                          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-[#1557d6]">
                            <BadgeCheck className="h-4 w-4" />
                            Revisadas antes de publicarse
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-600">
                          Solicitudes públicas revisadas antes de aparecer en Kubo.
                          Nunca se pide dinero.
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/ayuda/necesidades"
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black text-[#1557d6] transition hover:bg-blue-50"
                    >
                      Ver todas
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="mt-6 space-y-4">
                    {approvedNeeds.map((request) => {
                      const isMatched = request.status === "MATCHED";

                      return (
                        <article
                          key={request.id}
                          className="group overflow-hidden rounded-[26px] border border-blue-100 bg-gradient-to-r from-white via-white to-[#f5f9ff] transition-all duration-300 hover:border-blue-200 hover:shadow-[0_16px_35px_rgba(15,60,140,0.09)]"
                        >
                          <div className="grid gap-0 lg:grid-cols-[280px_1fr_280px]">
                            {/* IMAGEN */}
                            <div className="relative min-h-[230px] overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50">
                              {request.contextImageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={request.contextImageUrl}
                                  alt={request.title}
                                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                />
                              ) : (
                                <div className="flex h-full min-h-[230px] items-center justify-center">
                                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg">
                                    <Heart className="h-12 w-12 fill-blue-100 text-[#1557d6]" />
                                  </div>
                                </div>
                              )}

                              <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1557d6] text-white shadow-lg">
                                <Heart className="h-6 w-6 fill-white" />
                              </div>
                            </div>

                            {/* TEXTO */}
                            <div className="flex flex-col justify-center p-6">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#1557d6]">
                                  {categoryLabel(request.category)}
                                </span>

                                {isMatched && (
                                  <span className="rounded-full bg-cyan-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-cyan-700">
                                    Ayuda en proceso
                                  </span>
                                )}
                              </div>

                              <h3 className="mt-3 text-xl font-black text-slate-900 md:text-2xl">
                                {request.title}
                              </h3>

                              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                                {request.description}
                              </p>

                              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-500">
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="h-4 w-4 text-[#1557d6]" />
                                  {request.city}
                                </div>

                                {request.ownerName ? (
                                  <div className="flex items-center gap-1.5">
                                    <UserRound className="h-4 w-4 text-[#1557d6]" />
                                    Publicado por {request.ownerName}
                                  </div>
                                ) : null}

                                <div className="flex items-center gap-1.5">
                                  <Clock className="h-4 w-4 text-[#1557d6]" />
                                  {formatRelativeDate(request.createdAt)}
                                </div>
                              </div>
                            </div>

                            {/* VERIFICACIÓN */}
                            <div className="flex flex-col justify-center border-t border-blue-100 bg-blue-50/50 p-5 lg:border-l lg:border-t-0">
                              <div className="rounded-2xl border border-blue-100 bg-white p-4">
                                <div className="flex items-start gap-3">
                                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
                                    <ShieldCheck className="h-5 w-5 text-[#1557d6]" />
                                  </div>

                                  <div>
                                    <div className="text-sm font-black text-[#0f3c8c]">
                                      Revisada por Kubo
                                    </div>

                                    <div className="mt-0.5 text-xs leading-5 text-slate-500">
                                      Solicitud revisada antes de publicarse.
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-3 border-t border-slate-100 pt-3">
                                  <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
                                      <Clock className="h-5 w-5 text-[#1557d6]" />
                                    </div>

                                    <div>
                                      <div className="text-sm font-black text-slate-800">
                                        {formatRelativeDate(request.createdAt)}
                                      </div>

                                      <div className="mt-0.5 text-xs text-slate-500">
                                        Solicitud activa
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <AidHelpButton requestId={request.id} />
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* CÓMO FUNCIONA */}
            <section className="mt-7">
              <div className="overflow-hidden rounded-[32px] border border-blue-100 bg-white p-6 shadow-[0_18px_50px_rgba(15,60,140,0.07)] md:p-8">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#1557d6]">
                    <Sparkles className="h-4 w-4" />
                    Fácil, humano y seguro
                  </div>

                  <h2 className="mt-3 text-2xl font-black text-[#0f3c8c] md:text-3xl">
                    ¿Cómo funciona Kubo Ayuda?
                  </h2>

                  <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    Creamos un puente sencillo entre quien puede ayudar y quien
                    realmente lo necesita.
                  </p>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {[
                    {
                      number: "1",
                      icon: Gift,
                      title: "Alguien dona",
                      text: "Una persona ofrece gratuitamente algo que ya no necesita.",
                    },
                    {
                      number: "2",
                      icon: Heart,
                      title: "Alguien lo necesita",
                      text: "Otra persona publica una necesidad concreta.",
                    },
                    {
                      number: "3",
                      icon: SearchCheck,
                      title: "Kubo revisa",
                      text: "Revisamos las solicitudes antes de publicarlas.",
                    },
                    {
                      number: "4",
                      icon: Handshake,
                      title: "Los conectamos",
                      text: "Acercamos una necesidad a una posible donación.",
                    },
                    {
                      number: "5",
                      icon: PackageCheck,
                      title: "Ayuda entregada",
                      text: "Cuando se recibe la ayuda, se marca como entregada.",
                    },
                  ].map((step) => {
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.number}
                        className="relative rounded-[24px] border border-blue-100 bg-gradient-to-b from-[#f8fbff] to-white p-5 text-center transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(15,60,140,0.10)]"
                      >
                        <div className="absolute right-4 top-4 text-xs font-black text-blue-200">
                          {step.number.padStart(2, "0")}
                        </div>

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e5efff] to-[#d9e9ff]">
                          <Icon className="h-7 w-7 text-[#1557d6]" />
                        </div>

                        <h3 className="mt-4 text-base font-black text-[#0f3c8c]">
                          {step.title}
                        </h3>

                        <p className="mt-2 text-xs leading-5 text-slate-600">
                          {step.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* SEGURIDAD */}
            <section className="mt-7">
              <div className="relative overflow-hidden rounded-[32px] border border-blue-200 bg-gradient-to-r from-[#eaf3ff] via-white to-[#eef9ff] p-6 shadow-[0_16px_45px_rgba(15,60,140,0.07)] md:p-8">
                <div className="relative flex flex-col gap-5 md:flex-row md:items-center">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#1765e8] to-[#0f3c8c] shadow-[0_10px_25px_rgba(21,87,214,0.25)]">
                    <ShieldCheck className="h-8 w-8 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="text-xs font-black uppercase tracking-[0.14em] text-[#3979dc]">
                      Tu seguridad es primero
                    </div>

                    <h2 className="mt-1 text-2xl font-black text-[#0f3c8c]">
                      Seguridad y confianza
                    </h2>

                    <p className="mt-3 text-sm font-bold leading-6 text-slate-800">
                      Kubo Ayuda nunca te pedirá dinero, contraseñas ni datos
                      bancarios para publicar una solicitud.
                    </p>

                    <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
                      Kubo no recauda dinero ni gestiona pagos. Kubo Ayuda
                      conecta personas que ofrecen artículos gratuitamente con
                      personas que los necesitan.
                    </p>
                  </div>

                  <div className="hidden h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-white/70 md:flex">
                    <PackageOpen className="h-9 w-9 text-[#1557d6]" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}