import Link from "next/link";

const sections = [
  {
    title: "Aceptación y funcionamiento",
    body: "Al usar Kubo Anuncios aceptas estos términos. Kubo es una plataforma de anuncios y marketplace que facilita el contacto entre usuarios. Kubo no es el vendedor ni el comprador de los productos o servicios publicados y, salvo que se indique expresamente otra cosa, no participa en la negociación, el pago, la entrega ni la ejecución de la operación entre usuarios.",
  },
  {
    title: "Cuentas e información",
    body: "Debes proporcionar información veraz, mantener la seguridad de tu cuenta y usar Kubo de forma legal y responsable. Cada usuario responde por sus anuncios, mensajes, acuerdos y actuaciones. No debes suplantar a otra persona, compartir credenciales ni usar la plataforma para engañar o perjudicar a otros.",
  },
  {
    title: "Publicaciones prohibidas",
    body: "No se permite publicar información falsa o engañosa, estafas, contenido fraudulento u ofensivo, productos o servicios ilegales o prohibidos, bienes que infrinjan derechos de terceros, ni contenido que ponga en riesgo a otros usuarios. También está prohibido usar Kubo para spam, suplantación, manipulación de precios o actividades contrarias a la ley.",
  },
  {
    title: "Moderación y reportes",
    body: "Kubo puede revisar reportes y moderar contenido. Cuando corresponda, puede ocultar o eliminar anuncios, restringir funciones o suspender cuentas, especialmente ante fraude, incumplimiento, riesgo para la comunidad o requerimientos legales. Ocultar un anuncio no resuelve automáticamente el reporte: las acciones de moderación y revisión del reporte son independientes.",
  },
  {
    title: "Compras, chat y comportamiento",
    body: "Los pagos, entregas, garantías, revisiones del producto y demás condiciones deben acordarse entre comprador y vendedor. El chat facilita la comunicación, pero cada usuario debe comportarse con respeto y prudencia, sin amenazas, acoso, fraude ni envío de enlaces o información engañosa.",
  },
  {
    title: "Empresas y verificaciones",
    body: "Una empresa puede publicar como empresa sin estar verificada. El sello Empresa verificada significa que Kubo revisó la documentación aportada para el proceso de verificación. No es garantía de solvencia, calidad, autenticidad de todos sus productos, cumplimiento futuro ni ausencia absoluta de fraude.",
  },
  {
    title: "Premium y Destacado",
    body: "Premium y Destacado son herramientas de visibilidad. Pueden ayudar a mostrar un anuncio en posiciones de mayor exposición, pero no garantizan ventas, contactos ni resultados. Tampoco equivalen a recomendación o verificación por parte de Kubo.",
  },
  {
    title: "Responsabilidad y prudencia",
    body: "Kubo procura mantener una plataforma útil y segura, pero no garantiza la identidad de todos los usuarios, la exactitud de cada anuncio, la disponibilidad de productos, el cumplimiento de acuerdos ni la ausencia de fraude. Debes revisar la información, verificar a la contraparte y actuar con prudencia antes de pagar, entregar bienes o compartir datos.",
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
