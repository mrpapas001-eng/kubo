import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email?.toLowerCase().trim();

    if (!userEmail) {
      return NextResponse.json(
        { ok: false, error: "Debes iniciar sesión." },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    const conversationId =
      url.searchParams.get("conversationId")?.trim() ?? "";

    if (!conversationId) {
      return NextResponse.json(
        { ok: false, error: "Falta la conversación." },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { ok: false, error: "Chat no encontrado." },
        { status: 404 }
      );
    }

    const buyerEmail = conversation.buyerEmail.toLowerCase().trim();
    const sellerEmail = conversation.sellerEmail.toLowerCase().trim();

    const isParticipant =
      buyerEmail === userEmail || sellerEmail === userEmail;

    if (!isParticipant) {
      return NextResponse.json(
        { ok: false, error: "No tienes acceso a este chat." },
        { status: 403 }
      );
    }

    // Cuando el usuario tiene abierta la conversación,
    // marcamos como leídos los mensajes que recibió.
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderEmail: {
          not: userEmail,
        },
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        body: true,
        senderEmail: true,
        senderName: true,
        createdAt: true,
        readAt: true,
      },
    });

    return NextResponse.json({
      ok: true,
      messages,
    });
  } catch (error: any) {
    console.error("CHAT MESSAGES GET ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error?.message ?? "Error cargando mensajes.",
      },
      { status: 500 }
    );
  }
}