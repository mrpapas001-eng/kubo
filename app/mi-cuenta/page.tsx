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
import { prisma } from "@/lib/db";

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

  const myEmail = session.user.email?.toLowerCase().trim() ?? null;

  const businessListings = myEmail
    ? await prisma.listing.findMany({
        where: {
          ownerEmail: myEmail,
          isBusiness: true,
        },
        select: { businessVerified: true },
      })
    : [];

  const hasBusiness = businessListings.length > 0;
  const hasVerifiedBusiness = businessListings.some(
    (item) => item.businessVerified
  );

  const accountVerifications = myEmail
    ? await prisma.accountVerification.findMany({
        where: { email: myEmail },
        orderBy: { submittedAt: "desc" },
      })
    : [];

  const personalVerification = accountVerifications.find(
    (item) => item.type === "PARTICULAR"
  );
  const businessVerification = accountVerifications.find(
    (item) => item.type === "EMPRESA"
  );

  const verificationSummary = personalVerification ?? businessVerification;

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

          {verificationSummary ? (
            <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-[#0f3c8c]" />
                <div className="text-base font-black text-slate-900">
                  {verificationSummary.status === "VERIFIED"
                    ? "Tu cuenta ya está verificada."
                    : verificationSummary.status === "PENDING"
                      ? "Solicitud de verificación pendiente."
                      : "Tu última verificación fue rechazada. Puedes volver a enviarla."}
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {verificationSummary.type === "PARTICULAR"
                  ? "Verificación de usuario."
                  : "Verificación de empresa."}
                {verificationSummary.status === "PENDING"
                  ? " Estamos revisando tu información."
                  : verificationSummary.status === "REJECTED"
                    ? " Puedes enviar una nueva solicitud desde la opción correspondiente."
                    : " Puedes seguir usando Kubo normalmente."}
              </p>
            </div>
          ) : null}

          {hasBusiness && !hasVerifiedBusiness ? (
            <Link
              href="/verificar-empresa"
              className="mt-4 flex items-center gap-4 rounded-3xl border border-[#0f3c8c] bg-[#e8f0ff] px-5 py-5 text-[#0f3c8c] shadow-sm hover:bg-[#dbe8ff]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="text-lg font-black">
                  Verifica tu empresa y obtén el sello Empresa verificada.
                </div>
                <p className="mt-1 text-sm font-medium text-[#0f3c8c]/80">
                  Envía tu RUT para que Kubo lo revise.
                </p>
              </div>
            </Link>
          ) : hasVerifiedBusiness ? (
            <div className="mt-4 flex items-center gap-4 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-5 text-emerald-800">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="text-lg font-black">Empresa verificada</div>
                <p className="mt-1 text-sm font-medium text-emerald-700">
                  RUT revisado por Kubo.
                </p>
              </div>
            </div>
          ) : null}

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {accountLinks.map((item) => {
              if (item.href === "/verificar-empresa" && hasVerifiedBusiness) {
                return null;
              }

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
