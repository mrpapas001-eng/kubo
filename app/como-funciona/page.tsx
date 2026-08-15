import Link from "next/link";
import { Search, PlusCircle, MessageCircle, ShieldCheck } from "lucide-react";

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] text-slate-900">
      <div className="mx-auto max-w-[1100px] px-4 py-10 md:px-6 lg:px-8">

        {/* NAV */}
        <div className="mb-6 flex items-center gap-3">
          <Link
            href="/"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            ← Inicio
          </Link>
        </div>

        {/* HEADER */}
        <div className="text-center">
          <h1 className="text-4xl font-black md:text-5xl">
            ¿Cómo funciona Kubo?
          </h1>

          <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
            Compra, vende o encuentra servicios cerca de ti de forma fácil,
            rápida y segura.
          </p>
        </div>

        {/* STEPS */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">

          {/* PASO 1 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <Search className="h-6 w-6 text-[#0f3c8c]" />
            </div>

            <h3 className="mt-4 text-lg font-black">
              1. Busca lo que necesitas
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Usa el buscador o navega por categorías para encontrar anuncios
              cerca de ti.
            </p>
          </div>

          {/* PASO 2 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <MessageCircle className="h-6 w-6 text-[#0f3c8c]" />
            </div>

            <h3 className="mt-4 text-lg font-black">
              2. Contacta directamente
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Habla con el vendedor por WhatsApp o llamada sin intermediarios.
            </p>
          </div>

          {/* PASO 3 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <PlusCircle className="h-6 w-6 text-[#0f3c8c]" />
            </div>

            <h3 className="mt-4 text-lg font-black">
              3. Publica tu anuncio
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Vende lo que ya no usas o promociona tus servicios en minutos.
            </p>
          </div>
        </div>

        {/* SEGURIDAD */}
        <div className="mt-14 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-[#0f3c8c]" />
            <h2 className="text-xl font-black">
              Seguridad y confianza
            </h2>
          </div>

          <p className="mt-4 text-slate-500 max-w-2xl">
            En Kubo promovemos anuncios reales entre personas reales. Te
            recomendamos siempre verificar la información y realizar
            encuentros en lugares seguros.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-black">
            ¿Listo para empezar?
          </h3>

          <div className="mt-4 flex justify-center gap-4">
            <Link
              href="/buscar"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Buscar anuncios
            </Link>

            <Link
              href="/publish"
              className="rounded-xl bg-[#0f3c8c] px-6 py-3 text-sm font-bold text-white hover:bg-[#0c2f6d]"
            >
              Publicar anuncio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}