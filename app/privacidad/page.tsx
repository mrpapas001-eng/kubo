import Link from "next/link";

const sections = [
  {
    title: "Datos que podemos pedir",
    body: "Para usar Kubo podemos guardar datos de cuenta, anuncios publicados, mensajes, favoritos, reportes y archivos que el usuario suba. Si una persona pide verificar identidad o una empresa pide verificacion, tambien podemos recibir documento de identidad o RUT.",
  },
  {
    title: "Para que usamos los datos",
    body: "Usamos la informacion para operar la plataforma, mostrar anuncios, permitir contacto entre usuarios, prevenir abuso, revisar reportes y validar solicitudes de verificacion.",
  },
  {
    title: "Documentos de verificacion",
    body: "Los documentos de identidad y RUT se usan solo para revisar la solicitud de verificacion. No deben mostrarse publicamente en los anuncios.",
  },
  {
    title: "Derechos del usuario",
    body: "El usuario puede solicitar correccion, actualizacion o eliminacion de sus datos. Las solicitudes deben revisarse antes de borrar informacion necesaria para seguridad, reportes o cumplimiento legal.",
  },
  {
    title: "Aviso importante",
    body: "Esta pagina es una base inicial para lanzamiento. Antes de operar publicamente con documentos reales, conviene revisarla con asesoria legal y ajustar la politica de tratamiento de datos.",
  },
];

export default function PrivacyPage() {
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
            Politica de privacidad
          </h1>
          <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">
            Esta pagina explica de forma simple como Kubo trata los datos de
            usuarios, vendedores y empresas.
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
