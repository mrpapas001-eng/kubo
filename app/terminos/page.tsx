import Link from "next/link";

const sections = [
  {
    title: "Uso de la plataforma",
    body: "Kubo conecta personas y empresas que publican anuncios con usuarios interesados. Cada usuario es responsable de la informacion que publica y de cumplir las normas aplicables.",
  },
  {
    title: "Compras y acuerdos",
    body: "Kubo no es parte directa de la compraventa entre usuarios. Los pagos, entregas, garantias y revisiones del producto deben acordarse entre comprador y vendedor.",
  },
  {
    title: "Verificaciones",
    body: "La verificacion de identidad o empresa ayuda a generar confianza, pero no garantiza la compra, la calidad del producto ni elimina la necesidad de revisar antes de pagar.",
  },
  {
    title: "Contenido prohibido",
    body: "No se permite publicar informacion falsa, productos ilegales, contenido fraudulento, ofensivo o que ponga en riesgo a otros usuarios.",
  },
  {
    title: "Promociones",
    body: "Los anuncios destacados o premium pagan por mayor visibilidad. Eso no significa que el vendedor este verificado ni que Kubo recomiende el producto.",
  },
];

export default function TermsPage() {
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
            Terminos de uso
          </h1>
          <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">
            Reglas basicas para publicar, buscar y contactar dentro de Kubo.
          </p>

          <div className="mt-8 space-y-5">
            {sections.map((section) => (
              <div
                key={section.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <h2 className="text-lg font-black text-slate-900">
                  {section.title}
                </h2>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
                  {section.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
