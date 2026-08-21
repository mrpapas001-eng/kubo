import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";

export default async function ChatListPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase().trim();

  if (!email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8fc] p-6">
        <div className="rounded-[32px] bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">
            Conversaciones
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Inicia sesión para ver tus chats.
          </p>
        </div>
      </div>
    );
  }

  const user = session?.user;

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ buyerEmail: email }, { sellerEmail: email }],
    },
    orderBy: { createdAt: "desc" },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const aidRequestIds = new Set(
    (
      await prisma.aidRequest.findMany({
        where: { id: { in: conversations.map((c) => c.listingId) } },
        select: { id: true },
      })
    ).map((r) => r.id)
  );

  return (
    <div className="h-screen w-full border-r border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div className="text-4xl font-black tracking-tight text-slate-900">
          kubo
        </div>

        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-slate-200">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user?.name ?? "Usuario"}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-black text-slate-600">
              {user?.name?.[0] ?? "U"}
            </span>
          )}
        </div>
      </div>

      <div className="mt-10 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Conversaciones
          </h1>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
            Conecta directamente con personas reales.
          </p>
        </div>

        <Link
          href="/publish"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#4f32c8] text-3xl font-black text-white shadow-[0_12px_30px_rgba(79,50,200,0.35)] hover:bg-[#3f28a0]"
        >
          +
        </Link>
      </div>

      <div className="mt-8 rounded-3xl bg-white px-4 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.07)] ring-1 ring-slate-100">
        <div className="text-sm font-bold text-slate-400">
          🔍 Buscar conversaciones...
        </div>
      </div>

      <div className="mt-7 space-y-3 overflow-y-auto pr-1">
        {conversations.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 p-6 text-center">
            <div className="text-lg font-black text-slate-900">
              Aún no tienes chats
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Cuando escribas por chat interno, aparecerán aquí.
            </p>
          </div>
        ) : (
          conversations.map((conversation) => {
            const lastMessage = conversation.messages[0];

            const otherName =
              conversation.buyerEmail === email
                ? conversation.sellerName || "Vendedor"
                : conversation.buyerName || "Comprador";

return (
  <div
    key={conversation.id}
    className="rounded-[28px] bg-white p-4 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ring-1 ring-slate-100"
  >
    {/* CLICK PARA ENTRAR AL CHAT */}
    <Link
      href={`/chat/${conversation.id}`}
      className="flex items-center gap-4"
    >
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#0f3c8c] text-xl font-black text-white">
        {conversation.listingTitle?.[0] ?? "K"}

        <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="truncate text-sm font-black text-slate-900">
            {conversation.listingTitle}
          </div>
          <div className="text-xs font-bold text-slate-400">
            {lastMessage
              ? new Intl.DateTimeFormat("es-CO", {
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(lastMessage.createdAt))
              : ""}
          </div>
        </div>

        <div className="mt-1 text-sm font-semibold text-slate-700">
          {otherName}
        </div>

        <div className="mt-1 truncate text-sm text-slate-500">
          {lastMessage?.body ?? "Sin mensajes todavía"}
        </div>
      </div>
    </Link>

    {/* 🔥 BOTÓN VER ANUNCIO */}
    <div className="mt-3">
      <Link
        href={
          aidRequestIds.has(conversation.listingId)
            ? `/ayuda/necesidades/${conversation.listingId}`
            : `/listing/${conversation.listingId}`
        }
        className="text-xs font-black text-[#0f3c8c] hover:underline"
      >
        {aidRequestIds.has(conversation.listingId) ? "Ver solicitud" : "Ver anuncio"}
      </Link>
    </div>
  </div>
);
          })
        )}
      </div>
    </div>
  );
}
