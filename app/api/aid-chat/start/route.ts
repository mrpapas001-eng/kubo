import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    const helperEmail = session?.user?.email?.toLowerCase().trim();
    const helperName = session?.user?.name ?? null;

    if (!helperEmail) {
      return NextResponse.json(
        {
          ok: false,
          error: "Debes iniciar sesión para ayudar.",
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const requestId = String(body?.requestId ?? "").trim();

    if (!requestId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Falta la solicitud de ayuda.",
        },
        { status: 400 }
      );
    }

    const aidRequest = await prisma.aidRequest.findUnique({
      where: {
        id: requestId,
      },
      select: {
        id: true,
        title: true,
        ownerEmail: true,
        ownerName: true,
        status: true,
        isActive: true,
      },
    });

    if (!aidRequest) {
      return NextResponse.json(
        {
          ok: false,
          error: "Solicitud no encontrada.",
        },
        { status: 404 }
      );
    }

    if (
      !["APPROVED", "MATCHED"].includes(aidRequest.status) ||
      aidRequest.isActive !== true
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "Esta solicitud ya no está disponible para recibir ayuda.",
        },
        { status: 400 }
      );
    }

    const ownerEmail = aidRequest.ownerEmail.toLowerCase().trim();

    if (ownerEmail === helperEmail) {
      return NextResponse.json(
        {
          ok: false,
          error: "No puedes ofrecer ayuda a tu propia solicitud.",
        },
        { status: 400 }
      );
    }

    /*
     * Reutilizamos Conversation.
     * En Kubo Ayuda usamos:
     *
     * listingId = aidRequest.id
     * buyerEmail = persona que quiere ayudar
     * sellerEmail = persona que pidió ayuda
     */
    let conversation = await prisma.conversation.findFirst({
      where: {
        listingId: aidRequest.id,
        buyerEmail: helperEmail,
        sellerEmail: ownerEmail,
      },
    });

    const isNewConversation = !conversation;

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          listingId: aidRequest.id,
          listingTitle: aidRequest.title,
          buyerEmail: helperEmail,
          buyerName: helperName,
          sellerEmail: ownerEmail,
          sellerName: aidRequest.ownerName ?? null,
        },
      });
    }

    /*
     * Solo creamos el mensaje automático la primera vez.
     * Así no se repite cada vez que la persona pulse
     * "Quiero ayudar".
     */
    if (isNewConversation) {
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderEmail: helperEmail,
          senderName: helperName,
          body: `Hola, quiero ayudarte con tu solicitud: "${aidRequest.title}".`,
        },
      });
    }

    return NextResponse.json({
      ok: true,
      conversationId: conversation.id,
    });
  } catch (error: any) {
    console.error("AID CHAT START ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error?.message ?? "Error iniciando conversación de ayuda.",
      },
      { status: 500 }
    );
  }
}