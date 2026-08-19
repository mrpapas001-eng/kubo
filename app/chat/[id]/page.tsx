import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import ChatBox from "@/components/ChatBox";

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatPrice(price: unknown, currency?: string) {
  const numeric = Number(price);

  if (!Number.isNaN(numeric) && numeric > 0) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: currency ?? "COP",
      maximumFractionDigits: 0,
    }).format(numeric);
  }

  return "Precio a convenir";
}

export default async function ChatPage({ params }: PageProps) {
  const { id } = await params;

  if (!id) return notFound();

  const session = await getServerSession(authOptions);
  const currentUserEmail = session?.user?.email?.toLowerCase().trim() ?? "";

  if (!currentUserEmail) {
    redirect("/api/auth/signin");
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!conversation) return notFound();

  const buyerEmail = conversation.buyerEmail?.toLowerCase().trim();
  const sellerEmail = conversation.sellerEmail?.toLowerCase().trim();

  const isParticipant =
    currentUserEmail === buyerEmail || currentUserEmail === sellerEmail;

  if (!isParticipant) {
    return notFound();
  }

  await prisma.message.updateMany({
    where: {
      conversationId: conversation.id,
      senderEmail: {
        not: currentUserEmail,
      },
      readAt: null,
    },
    data: {
      readAt: new Date(),
    },
  });

  const listing = await prisma.listing.findUnique({
    where: { id: conversation.listingId },
  });

  const aidRequest = listing
    ? null
    : await prisma.aidRequest.findUnique({
        where: { id: conversation.listingId },
        select: { id: true, contextImageUrl: true },
      });

  const headerImageUrl = listing?.imageUrl ?? aidRequest?.contextImageUrl ?? null;

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-white px-5 py-4">
        <Link
          href="/chat"
          className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-slate-100 px-4 text-sm font-black text-slate-700 hover:bg-slate-200"
        >
          ⟵ Chats
        </Link>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0f3c8c] text-lg font-black text-white">
          {headerImageUrl ? (
            <Image
              src={headerImageUrl}
              alt={conversation.listingTitle}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          ) : (
            conversation.listingTitle?.[0] ?? "K"
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate text-base font-black text-slate-900">
            {conversation.listingTitle}
          </div>
          <div className="text-xs font-bold text-green-500">● En línea</div>
        </div>

        <Link
          href="/"
          className="flex h-10 shrink-0 items-center justify-center rounded-full bg-slate-100 px-4 text-sm font-black text-slate-700 hover:bg-slate-200"
        >
          Salir
        </Link>
      </div>

      <div className="border-b border-slate-100 bg-white/80 p-4">
        <div className="flex items-center gap-4 rounded-[28px] bg-gradient-to-r from-slate-50 to-blue-50 p-4 shadow-sm">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-200">
            {headerImageUrl ? (
              <Image
                src={headerImageUrl}
                alt={conversation.listingTitle}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>

          <div className="min-w-0 flex-1">
            <div className="truncate text-base font-black text-slate-900">
              {conversation.listingTitle}
            </div>

            <div className="mt-1 text-sm font-bold text-slate-500">
              {listing
                ? formatPrice(listing.price, listing.currency)
                : aidRequest
                  ? "Kubo Ayuda"
                  : "Anuncio"}
            </div>

            <Link
              href={
                aidRequest
                  ? `/ayuda/necesidades/${conversation.listingId}`
                  : `/listing/${conversation.listingId}`
              }
              className="mt-3 inline-flex rounded-full bg-[#0f3c8c] px-4 py-2 text-xs font-black text-white hover:bg-[#0c2f6d]"
            >
              {aidRequest ? "Ver solicitud" : "Ver anuncio"}
            </Link>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <ChatBox
          conversationId={conversation.id}
          initialMessages={conversation.messages}
          currentUserEmail={currentUserEmail}
        />
      </div>
    </div>
  );
}