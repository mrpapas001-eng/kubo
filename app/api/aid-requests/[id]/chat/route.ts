import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";

// Endpoint autenticado para iniciar un chat de Kubo con el solicitante de una
// necesidad aprobada. Reutiliza el modelo Conversation existente guardando el
// id de la AidRequest en listingId.
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const viewerEmail = session?.user?.email?.toLowerCase().trim() ?? null;
    const viewerName = session?.user?.name ?? null;

    if (!viewerEmail) {
      return NextResponse.json(
        { ok: false, error: "Debes iniciar sesión para chatear con el solicitante." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const aidRequest = await prisma.aidRequest.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        title: true,
        ownerEmail: true,
        ownerName: true,
      },
    });

    if (!aidRequest || !["APPROVED", "MATCHED"].includes(aidRequest.status)) {
      return NextResponse.json(
        { ok: false, error: "Solicitud no disponible." },
        { status: 404 }
      );
    }

    const ownerEmail = aidRequest.ownerEmail.toLowerCase().trim();

    if (ownerEmail === viewerEmail) {
      return NextResponse.json(
        { ok: false, error: "No puedes iniciar un chat con tu propia solicitud." },
        { status: 400 }
      );
    }

    let message = "";
    try {
      const body = await req.json();
      message = String(body?.message ?? "").trim();
    } catch {
      message = "";
    }
    if (!message) {
      message = `Hola, vi tu solicitud "${aidRequest.title}" en Kubo Ayuda y quiero ayudarte.`;
    }

    let conversation = await prisma.conversation.findFirst({
      where: {
        listingId: aidRequest.id,
        buyerEmail: viewerEmail,
        sellerEmail: ownerEmail,
      },
    });

    const isNewConversation = !conversation;

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          listingId: aidRequest.id,
          listingTitle: `Kubo Ayuda: ${aidRequest.title}`,
          buyerEmail: viewerEmail,
          buyerName: viewerName,
          sellerEmail: ownerEmail,
          sellerName: aidRequest.ownerName ?? null,
        },
      });
    }

    if (isNewConversation) {
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderEmail: viewerEmail,
          senderName: viewerName,
          body: message,
        },
      });
    }

    return NextResponse.json({ ok: true, conversationId: conversation.id });
  } catch (error) {
    console.error("POST /api/aid-requests/[id]/chat error:", error);
    return NextResponse.json(
      { ok: false, error: "Error iniciando el chat." },
      { status: 500 }
    );
  }
}
