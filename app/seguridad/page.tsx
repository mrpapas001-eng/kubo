import Link from "next/link";

const tips = [
  "Revisa el producto en persona antes de pagar.",
  "Evita enviar dinero por adelantado si no conoces al vendedor.",
  "Usa el chat o WhatsApp para pedir mas informacion, fotos y ubicacion.",
  "Desconfia de precios demasiado bajos o urgencias para pagar rapido.",
  "Reporta anuncios sospechosos para que el equipo de Kubo los revise.",
];

export default function SafetyPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FB] px-4 py-8 text-slate-900 md:px-6 md:py-12">
      <div className="mx-auto max-w-[860px]">
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700"
        >
          Volver
        </Link>

        <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-9">
          <p className="text-xs font-black uppercase tracking-wide text-[#0f3c8c]">
            Kubo Anuncios
          </p>
          <h1 className="mt-3 text-3xl font-black md:text-4xl">
            Consejos de seguridad
          </h1>
          <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">
            La verificacion ayuda, pero comprar seguro tambien depende de
            revisar, comparar y no pagar a ciegas.
          </p>

          <div className="mt-8 space-y-3">
            {tips.map((tip) => (
              <div
                key={tip}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-bold text-slate-700"
              >
                {tip}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
