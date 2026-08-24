import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";

export default async function ChatSidebar() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase().trim();

  if (!email) return null;

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

  const conversationsWithUnread = await Promise.all(
    conversations.map(async (conversation) => {
      const unreadCount = await prisma.message.count({
        where: {
          conversationId: conversation.id,
          senderEmail: {
            not: email,
          },
          readAt: null,
        },
      });

      return {
        ...conversation,
        unreadCount,
      };
    })
  );

  return (
    <aside className="hidden h-full w-[360px] shrink-0 border-r border-slate-200 bg-white p-6 lg:block">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
          <Image
            src="/brand/kubo-symbol.png"
            alt="Kubo anuncios"
            width={24}
            height={24}
            className="h-6 w-6 object-contain"
          />
        </div>

        <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-200">
          {user?.image ? (
            <Image
              src={user.image}
              alt="Usuario"
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-black text-slate-600">
              {user?.name?.[0] ?? "U"}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <h1 className="text-3xl font-black text-slate-900">
          Conversaciones
        </h1>

        <Link
          href="/"
          className="shrink-0 rounded-xl bg-slate-900 px-3 py-2 text-xs font-black text-white hover:bg-slate-700"
        >
          Salir
        </Link>
      </div>

      <p className="mt-2 text-sm font-medium text-slate-500">
        Conecta directamente con personas reales.
      </p>

      <div className="mt-6 rounded-3xl bg-white px-4 py-4 shadow-sm ring-1 ring-slate-100">
        <div className="text-sm font-bold text-slate-400">
          🔍 Buscar conversaciones...
        </div>
      </div>

      <div className="mt-6 space-y-3 overflow-y-auto">
        {conversationsWithUnread.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 p-5 text-center">
            <div className="text-sm font-black text-slate-900">
              Aún no tienes chats
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Cuando escribas a alguien aparecerá aquí.
            </p>
          </div>
        ) : (
          conversationsWithUnread.map((conversation) => {
            const lastMessage = conversation.messages[0];
            const hasUnread = conversation.unreadCount > 0;

            return (
              <Link
                key={conversation.id}
                href={`/chat/${conversation.id}`}
                className={`flex items-center gap-4 rounded-[26px] p-4 shadow-sm ring-1 ring-slate-100 transition hover:bg-[#f5f1ff] ${
                  hasUnread ? "bg-[#f5f1ff]" : "bg-white"
                }`}
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#0f3c8c] text-lg font-black text-white">
                  {conversation.listingTitle?.[0] ?? "K"}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`truncate text-sm ${
                        hasUnread
                          ? "font-black text-slate-950"
                          : "font-black text-slate-900"
                      }`}
                    >
                      {conversation.listingTitle}
                    </div>

                    {hasUnread ? (
                      <div className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#4f32c8] px-2 text-[11px] font-black text-white">
                        {conversation.unreadCount}
                      </div>
                    ) : null}
                  </div>

                  <div
                    className={`mt-1 truncate text-sm ${
                      hasUnread
                        ? "font-black text-slate-800"
                        : "text-slate-500"
                    }`}
                  >
                    {lastMessage?.body ?? "Sin mensajes"}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </aside>
  );
}