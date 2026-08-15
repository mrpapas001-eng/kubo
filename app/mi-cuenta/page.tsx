import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  Home,
  MessageCircle,
  PlusCircle,
  ShieldCheck,
  Store,
  UserRound,
} from "lucide-react";

const accountLinks = [
  {
    href: "/mis-anuncios",
    title: "Mis anuncios",
    description: "Ver, editar y gestionar tus publicaciones.",
    icon: Store,
  },
  {
    href: "/favoritos",
    title: "Mis favoritos",
    description: "Revisa los anuncios que has guardado.",
    icon: Heart,
  },
  {
    href: "/chat",
    title: "Chats",
    description: "Continua conversaciones con compradores y vendedores.",
    icon: MessageCircle,
  },
  {
    href: "/verificar-empresa",
    title: "Verificar empresa",
    description: "Envia el RUT para pedir el sello de empresa verificada.",
    icon: ShieldCheck,
  },
  {
    href: "/verificar-identidad",
    title: "Verificar identidad",
    description: "Confirma tu identidad para generar mas confianza.",
    icon: UserRound,
  },
  {
    href: "/",
    title: "Inicio",
    description: "Volver al marketplace.",
    icon: Home,
  },
];

export default async function MiCuentaPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 pb-28 pt-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-[980px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
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

          <Link
            href="/publish"
            className="mt-8 flex items-center gap-4 rounded-3xl bg-[#0f3c8c] px-5 py-5 text-white shadow-sm hover:bg-[#0c2f6d]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
              <PlusCircle className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="text-lg font-black">Publicar anuncio</div>
              <p className="mt-1 text-sm font-medium text-white/75">
                Crea una nueva publicación en Kubo.
              </p>
            </div>
          </Link>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {accountLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 hover:bg-slate-100"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#0f3c8c] shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg font-black text-slate-900">
                      {item.title}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
            <div className="flex items-center gap-3">
              <UserRound className="h-5 w-5 text-[#0f3c8c]" />
              <div>
                <div className="text-sm font-black text-slate-900">
                  Datos de cuenta
                </div>
                <div className="mt-0.5 text-sm text-slate-500">
                  Tus datos vienen de tu inicio de sesión.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
