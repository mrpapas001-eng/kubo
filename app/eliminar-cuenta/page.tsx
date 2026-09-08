import Link from "next/link";

export default function EliminarCuentaPage() {
  return (
    <main className="min-h-screen bg-[#F8F9FB] px-4 py-8 text-slate-900 md:px-6 md:py-12">
      <div className="mx-auto max-w-[860px]">
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700"
        >
          Volver a Kubo
        </Link>

        <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-9">
          <p className="text-xs font-black uppercase tracking-wide text-[#0f3c8c]">
            Kubo Anuncios
          </p>

          <h1 className="mt-3 text-3xl font-black md:text-4xl">
            Solicitar la eliminación de tu cuenta
          </h1>

          <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600">
            Puedes solicitar la eliminación de tu cuenta de Kubo Anuncios y de
            los datos personales asociados enviándonos un correo desde la misma
            dirección que utilizaste para iniciar sesión.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-black">Cómo solicitarla</h2>

            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm font-medium leading-relaxed text-slate-600">
              <li>
                Pulsa el botón “Solicitar eliminación” que aparece más abajo.
              </li>
              <li>
                Envía el correo desde la cuenta asociada a tu perfil de Kubo.
              </li>
              <li>
                Escribe en el mensaje que deseas eliminar tu cuenta y sus datos.
              </li>
              <li>
                Kubo podrá solicitar información adicional únicamente para
                comprobar que eres el titular de la cuenta.
              </li>
            </ol>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-black">Datos que se eliminarán</h2>

            <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
              Cuando se apruebe la solicitud, eliminaremos o anonimizaremos los
              datos de tu perfil, anuncios, favoritos, solicitudes y demás
              información personal asociada a la cuenta, salvo los datos que
              debamos conservar por obligaciones legales, prevención de fraude,
              seguridad, reclamaciones o investigaciones.
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-black">Plazo y conservación</h2>

            <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
              Procesaremos la solicitud dentro de los plazos establecidos por
              la normativa aplicable. Los datos que deban conservarse por
              razones legales o de seguridad permanecerán protegidos durante el
              periodo necesario y no se utilizarán para otros fines.
            </p>
          </div>

          <a
            href="mailto:contacto.kuboanuncios@gmail.com?subject=Solicitud%20de%20eliminacion%20de%20cuenta%20Kubo"
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#0f3c8c] px-6 py-3 text-center text-sm font-black text-white hover:bg-[#0c2f6d]"
          >
            Solicitar eliminación
          </a>

          <p className="mt-4 text-xs font-medium leading-relaxed text-slate-500">
            También puedes escribir a contacto.kuboanuncios@gmail.com con el
            asunto “Solicitud de eliminación de cuenta Kubo”.
          </p>
        </section>
      </div>
    </main>
  );
}