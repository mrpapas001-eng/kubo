import Link from "next/link";

const tips = [
  "Evita enviar dinero por adelantado a personas que no conoces.",
  "Revisa personalmente el producto cuando sea posible y comprueba su estado.",
  "Comprueba la identidad y la documentación cuando corresponda.",
  "Realiza encuentros en lugares públicos y seguros.",
  "No compartas contraseñas, códigos SMS, WhatsApp ni códigos de autenticación.",
  "Desconfía de enlaces externos sospechosos y no entregues datos bancarios innecesarios.",
  "Verifica los precios demasiado buenos para ser ciertos.",
  "No confíes solo en comprobantes de pago: confirma que el dinero esté realmente abonado antes de entregar un producto.",
  "Utiliza el chat de Kubo cuando sea posible y conserva la información de la conversación.",
  "Reporta anuncios sospechosos y cualquier comportamiento fraudulento.",
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

          <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <h2 className="text-lg font-black text-[#0f3c8c]">
              Empresa y Empresa verificada
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              “Empresa” identifica a quien publica como negocio. “Empresa
              verificada” significa que Kubo revisó la documentación aportada
              para el proceso de verificación. El sello ayuda a generar
              confianza, pero no garantiza la calidad, autenticidad, solvencia
              o cumplimiento futuro de la empresa.
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5">
            <h2 className="text-lg font-black text-red-800">
              ¿Detectaste algo sospechoso?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-red-700">
              Utiliza la opción Reportar del anuncio o escribe a
              contacto.kuboanuncios@gmail.com para que podamos revisar la
              situación.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
