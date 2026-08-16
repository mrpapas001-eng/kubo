import Link from "next/link";

const sections = [
  {
    title: "Responsable y marco aplicable",
    body: "El responsable del tratamiento es JAVIER ALONSO COMESAÑA, persona natural, en Colombia. Kubo Anuncios trata los datos personales conforme al marco general de protección de datos personales aplicable en Colombia, incluyendo la Ley 1581 de 2012 y sus normas reglamentarias. Para consultas, solicitudes o reclamaciones sobre privacidad: contacto.kuboanuncios@gmail.com.",
  },
  {
    title: "Información que podemos recopilar",
    body: "Según el uso de Kubo, podemos recopilar nombre, correo electrónico, datos asociados al inicio de sesión, teléfono, ciudad o ubicación proporcionada, información de anuncios, fotografías y videos, chats y mensajes dentro de Kubo, favoritos e interacciones necesarias para el funcionamiento, información empresarial, RUT y documentos usados en verificaciones, además de información técnica necesaria para la seguridad y el funcionamiento de la plataforma cuando corresponda.",
  },
  {
    title: "Finalidades del tratamiento",
    body: "Usamos la información para crear y administrar cuentas, publicar anuncios, facilitar el contacto entre usuarios, operar el chat, prevenir fraude y abuso, moderar contenido y revisar reportes, tramitar verificaciones, prestar soporte, proteger la seguridad de Kubo y cumplir obligaciones legales aplicables.",
  },
  {
    title: "RUT y documentos de verificación",
    body: "Los documentos de identidad y RUT no son públicos. Se almacenan de forma privada y solo pueden ser consultados por personal autorizado para revisar la solicitud de verificación. Se utilizan para esa finalidad y se conservan durante el tiempo necesario para ella y para las obligaciones aplicables. No se publica el contenido de estos documentos en los anuncios.",
  },
  {
    title: "Derechos del titular",
    body: "El titular puede conocer, acceder y solicitar información sobre el tratamiento de sus datos; actualizar y rectificar información; presentar consultas o reclamos; solicitar la supresión cuando proceda; y revocar la autorización cuando legalmente sea posible. Las solicitudes pueden enviarse a contacto.kuboanuncios@gmail.com. Algunas supresiones pueden estar limitadas cuando la conservación sea necesaria para seguridad, reportes u obligaciones legales.",
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
          <p className="mt-3 text-xs font-bold text-slate-400">
            Última actualización: 16 de agosto de 2026
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
