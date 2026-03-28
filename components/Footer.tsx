import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-[1400px] px-6 py-10">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          <div>
            <h3 className="text-lg font-black text-slate-900">
              Kubo Anuncios
            </h3>

            <p className="mt-3 text-sm text-slate-500">
              Compra y vende cerca de ti.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-black text-slate-900 mb-3">
              Categorías
            </h4>

            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/categoria/motor">Motor</Link></li>
              <li><Link href="/categoria/inmobiliaria">Inmobiliaria</Link></li>
              <li><Link href="/categoria/empleo">Empleo</Link></li>
              <li><Link href="/categoria/servicios">Servicios</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black text-slate-900 mb-3">
              Ciudades
            </h4>

            <ul className="space-y-2 text-sm text-slate-600">
              <li>Pereira</li>
              <li>Dosquebradas</li>
              <li>Armenia</li>
              <li>Manizales</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black text-slate-900 mb-3">
              Legal
            </h4>

            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/terminos">Términos</Link></li>
              <li><Link href="/privacidad">Privacidad</Link></li>
              <li><Link href="/contacto">Contacto</Link></li>
            </ul>
          </div>

        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Kubo Anuncios
        </div>

      </div>
    </footer>
  );
}