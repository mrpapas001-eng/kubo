import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HandHeart, Heart, ShieldCheck, CheckCircle, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Kubo Ayuda - Donaciones y solicitudes de ayuda",
  description: "Conectamos personas que quieren donar con personas que realmente lo necesitan.",
};

export default function AyudaPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] text-slate-900">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[260px] bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.08),_transparent_38%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.08),_transparent_32%),linear-gradient(to_bottom,_#ffffff,_#f5f7fb)]" />
        <div className="pointer-events-none absolute left-[-120px] top-16 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />
        <div className="pointer-events-none absolute right-[-80px] top-10 h-72 w-72 rounded-full bg-cyan-200/20 blur-3xl" />

        <Header />

        <main className="relative pb-10 pt-3 md:pt-4">
          <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8">
            {/* Header */}
            <section className="mt-4">
              <div className="overflow-hidden rounded-[28px] border border-[#0f3c8c]/20 bg-gradient-to-br from-[#0f3c8c] to-[#0c2f6d] p-6 shadow-[0_20px_50px_rgba(15,60,140,0.15)] md:p-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-amber-300 backdrop-blur-sm">
                  <Heart className="h-3.5 w-3.5" />
                  KUBO AYUDA
                </div>

                <h1 className="mt-4 text-3xl font-black leading-tight text-white md:text-4xl lg:text-5xl">
                  Dar una mano puede cambiar mucho.
                </h1>

                <p className="mt-3 text-base leading-6 text-white/80 md:text-lg">
                  Conectamos personas que quieren donar con personas que
                  realmente lo necesitan.
                </p>
              </div>
            </section>

            {/* Two main cards */}
            <section className="mt-6 grid gap-6 md:grid-cols-2">
              {/* Donar card */}
              <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100">
                    <HandHeart className="h-7 w-7 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">
                      QUIERO DONAR
                    </h2>
                    <p className="text-sm text-slate-600">
                      Publica algo que quieras entregar gratuitamente.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    <p className="text-sm leading-5 text-slate-700">
                      La donación debe ser completamente gratuita.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    <p className="text-sm leading-5 text-slate-700">
                      No se permiten cobros ocultos.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    <p className="text-sm leading-5 text-slate-700">
                      El donante deberá tener WhatsApp verificado.
                    </p>
                  </div>
                </div>

                <Link
                  href="/ayuda/donar"
                  className="mt-6 block w-full rounded-2xl bg-[#0f3c8c] px-6 py-4 text-center text-sm font-black text-white transition hover:bg-[#0c2f6d] md:text-base"
                >
                  Quiero donar
                </Link>
              </div>

              {/* Necesito ayuda card */}
              <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100">
                    <Heart className="h-7 w-7 text-rose-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">
                      NECESITO AYUDA
                    </h2>
                    <p className="text-sm text-slate-600">
                      Solicita algo que realmente necesites.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-600" />
                    <p className="text-sm leading-5 text-slate-700">
                      No se permite solicitar dinero.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    <p className="text-sm leading-5 text-slate-700">
                      La solicitud debe ser para una necesidad concreta.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    <p className="text-sm leading-5 text-slate-700">
                      Solo podrá existir una solicitud activa por usuario.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    <p className="text-sm leading-5 text-slate-700">
                      El WhatsApp deberá estar verificado.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                    <p className="text-sm leading-5 text-slate-700">
                      Las solicitudes serán revisadas antes de publicarse.
                    </p>
                  </div>
                </div>

                <button className="mt-6 w-full rounded-2xl bg-[#0f3c8c] px-6 py-4 text-sm font-black text-white transition hover:bg-[#0c2f6d] md:text-base">
                  Necesito ayuda
                </button>
              </div>
            </section>

            {/* How it works */}
            <section className="mt-6">
              <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-xl font-black text-slate-900 md:text-2xl">
                  ¿Cómo funciona Kubo Ayuda?
                </h2>

                <div className="mt-6 space-y-4">
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#0f3c8c] text-sm font-black text-white">
                      1
                    </div>
                    <p className="text-sm leading-5 text-slate-700">
                      Alguien ofrece gratuitamente algo que ya no necesita.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#0f3c8c] text-sm font-black text-white">
                      2
                    </div>
                    <p className="text-sm leading-5 text-slate-700">
                      Otra persona puede solicitar una necesidad concreta.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#0f3c8c] text-sm font-black text-white">
                      3
                    </div>
                    <p className="text-sm leading-5 text-slate-700">
                      Kubo revisa las solicitudes de ayuda antes de publicarlas.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#0f3c8c] text-sm font-black text-white">
                      4
                    </div>
                    <p className="text-sm leading-5 text-slate-700">
                      Podemos conectar una necesidad con una posible donación.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#0f3c8c] text-sm font-black text-white">
                      5
                    </div>
                    <p className="text-sm leading-5 text-slate-700">
                      Cuando se entrega la ayuda, se marca como recibida.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Security and trust */}
            <section className="mt-6">
              <div className="overflow-hidden rounded-[28px] border border-amber-200/50 bg-amber-50 p-6 shadow-sm md:p-8">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-amber-600" />
                  <h2 className="text-xl font-black text-slate-900 md:text-2xl">
                    Seguridad y confianza
                  </h2>
                </div>

                <div className="mt-4 space-y-3">
                  <p className="text-sm leading-5 text-slate-700">
                    <strong className="text-slate-900">
                      Kubo Ayuda nunca te pedirá dinero, contraseñas ni datos
                      bancarios para publicar una solicitud.
                    </strong>
                  </p>
                  <p className="text-sm leading-5 text-slate-700">
                    Kubo no recauda dinero ni gestiona pagos. Kubo Ayuda
                    conecta personas que ofrecen artículos gratuitamente con
                    personas que los necesitan.
                  </p>
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
