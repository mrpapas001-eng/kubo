import Link from "next/link";

const contactTopics = [
  "Soporte",
  "Privacidad y datos personales",
  "Reclamaciones",
  "Reportes",
  "Consultas generales",
];

export default function ContactPage() {
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
          <h1 className="mt-3 text-3xl font-black md:text-4xl">Contacto</h1>
          <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">
            Este es el canal oficial para comunicarte con Kubo Anuncios.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-black text-slate-900">¿En qué podemos ayudarte?</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {contactTopics.map((topic) => (
                <div
                  key={topic}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700"
                >
                  {topic}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <h2 className="text-lg font-black text-[#0f3c8c]">Correo oficial</h2>
            <a
              href="mailto:contacto.kuboanuncios@gmail.com"
              className="mt-2 inline-block break-all text-base font-black text-[#0f3c8c] hover:underline"
            >
              contacto.kuboanuncios@gmail.com
            </a>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Kubo Anuncios es operado por JAVIER ALONSO COMESAÑA, persona natural en Colombia.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}