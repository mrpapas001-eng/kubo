import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { MessageCircle } from "lucide-react";

export default async function ChatListPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase().trim();

  if (!email) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center bg-[#f6f8fc] p-6">
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
        where: {
          id: {
            in: conversations.map((c) => c.listingId),
          },
        },
        select: {
          id: true,
        },
      })
    ).map((r) => r.id)
  );

  return (
    <>
      {/* PC: el listado ya está en ChatSidebar */}
      <div className="hidden h-full flex-1 items-center justify-center bg-slate-50/60 p-8 lg:flex">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e8f0ff] text-[#0f3c8c]">
            <MessageCircle className="h-9 w-9" />
          </div>

          <h2 className="mt-6 text-2xl font-black text-slate-900">
            Tus conversaciones
          </h2>

          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
            Selecciona una conversación de la izquierda para continuar
            hablando con compradores o vendedores.
          </p>
        </div>
      </div>

      {/* MÓVIL / TABLET ESTRECHA */}
      <div className="h-full w-full overflow-y-auto bg-white p-5 lg:hidden">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              Conversaciones
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Conecta directamente con personas reales.
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-slate-200">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name ?? "Usuario"}
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

        <div className="mt-6 rounded-3xl bg-white px-4 py-4 shadow-sm ring-1 ring-slate-100">
          <div className="text-sm font-bold text-slate-400">
            🔍 Buscar conversaciones...
          </div>
        </div>

        <div className="mt-6 space-y-3">
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
                  className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-slate-100"
                >
                  <Link
                    href={`/chat/${conversation.id}`}
                    className="flex items-center gap-4"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#0f3c8c] text-lg font-black text-white">
                      {conversation.listingTitle?.[0] ?? "K"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div className="truncate text-sm font-black text-slate-900">
                          {conversation.listingTitle}
                        </div>

                        <div className="text-[11px] font-bold text-slate-400">
                          {lastMessage
                            ? new Intl.DateTimeFormat("es-CO", {
                                hour: "2-digit",
                                minute: "2-digit",
                              }).format(
                                new Date(lastMessage.createdAt)
                              )
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

                  <div className="mt-3">
                    <Link
                      href={
                        aidRequestIds.has(conversation.listingId)
                          ? `/ayuda/necesidades/${conversation.listingId}`
                          : `/listing/${conversation.listingId}`
                      }
                      className="text-xs font-black text-[#0f3c8c] hover:underline"
                    >
                      {aidRequestIds.has(conversation.listingId)
                        ? "Ver solicitud"
                        : "Ver anuncio"}
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}