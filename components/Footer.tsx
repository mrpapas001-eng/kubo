import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white pb-20 md:mt-20 md:pb-0">
      <div className="mx-auto max-w-[1400px] px-5 py-8 md:px-6 md:py-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-10">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Kubo Anuncios
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Compra y vende cerca de ti.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 md:border-0 md:bg-transparent md:p-0">
            <h4 className="mb-3 text-sm font-black text-slate-900">
              Categorías
            </h4>

            <ul className="grid grid-cols-2 gap-2 text-sm text-slate-600 md:block md:space-y-2">
              <li>
                <Link href="/categoria/motor">Motor</Link>
              </li>
              <li>
                <Link href="/categoria/inmobiliaria">Inmobiliaria</Link>
              </li>
              <li>
                <Link href="/categoria/empleo">Empleo</Link>
              </li>
              <li>
                <Link href="/categoria/servicios">Servicios</Link>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 md:border-0 md:bg-transparent md:p-0">
            <h4 className="mb-3 text-sm font-black text-slate-900">
              Ciudades
            </h4>

            <ul className="grid grid-cols-2 gap-2 text-sm text-slate-600 md:block md:space-y-2">
              <li>Pereira</li>
              <li>Dosquebradas</li>
              <li>Armenia</li>
              <li>Manizales</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 md:border-0 md:bg-transparent md:p-0">
            <h4 className="mb-3 text-sm font-black text-slate-900">
              Legal
            </h4>

            <ul className="grid grid-cols-2 gap-2 text-sm text-slate-600 md:block md:space-y-2">
              <li>
                <Link href="/terminos">Términos</Link>
              </li>
              <li>
                <Link href="/privacidad">Privacidad</Link>
              </li>
              <li>
                <Link href="/contacto">Contacto</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-5 text-center text-sm text-slate-500 md:mt-10 md:pt-6">
          © {new Date().getFullYear()} Kubo Anuncios
        </div>
      </div>
    </footer>
  );
}