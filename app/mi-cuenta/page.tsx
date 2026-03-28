import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function MiCuentaPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-6 py-10">
      <div className="mx-auto max-w-[900px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name ?? "Usuario"}
                width={88}
                height={88}
                className="h-[88px] w-[88px] rounded-full border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-2xl font-black text-slate-700">
                {(session.user.name?.[0] ?? "U").toUpperCase()}
              </div>
            )}

            <div>
              <h1 className="text-3xl font-black text-slate-900">
                Mi cuenta
              </h1>
              <p className="mt-2 text-lg font-bold text-slate-800">
                {session.user.name ?? "Usuario"}
              </p>
              <p className="text-sm text-slate-500">
                {session.user.email ?? ""}
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link
              href="/mis-anuncios"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 hover:bg-slate-100"
            >
              <div className="text-lg font-black text-slate-900">
                Mis anuncios
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Ver, editar y eliminar tus anuncios.
              </p>
            </Link>

            <Link
              href="/favoritos"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 hover:bg-slate-100"
            >
              <div className="text-lg font-black text-slate-900">
                Mis favoritos
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Revisa los anuncios que has guardado.
              </p>
            </Link>

            <Link
              href="/publish"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 hover:bg-slate-100"
            >
              <div className="text-lg font-black text-slate-900">
                Publicar anuncio
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Sube un nuevo anuncio a Kubo.
              </p>
            </Link>

            <Link
              href="/"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 hover:bg-slate-100"
            >
              <div className="text-lg font-black text-slate-900">
                Volver a la home
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Regresar al inicio del marketplace.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}