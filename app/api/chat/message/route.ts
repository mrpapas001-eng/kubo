import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { sendPushToUser } from "@/lib/push";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const senderEmail = session?.user?.email?.toLowerCase().trim();
    const senderName = session?.user?.name ?? null;

    if (!senderEmail) {
      return NextResponse.json(
        { ok: false, error: "Debes iniciar sesión." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const conversationId = String(body?.conversationId ?? "").trim();
    const message = String(body?.message ?? "").trim();

    if (!conversationId || !message) {
      return NextResponse.json(
        { ok: false, error: "Falta información." },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
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
      buyerEmail === senderEmail || sellerEmail === senderEmail;

    if (!isParticipant) {
      return NextResponse.json(
        { ok: false, error: "No tienes acceso a este chat." },
        { status: 403 }
      );
    }

    const savedMessage = await prisma.message.create({
      data: {
        conversationId,
        senderEmail,
        senderName,
        body: message,
      },
    });

    const recipientEmail =
      senderEmail === buyerEmail ? sellerEmail : buyerEmail;

    try {
      console.log("CHAT PUSH DEBUG:", {
        senderEmail,
        recipientEmail,
        conversationId,
      });

      await sendPushToUser(recipientEmail, {
        title: "Nuevo mensaje en Kubo",
        body: `${senderName?.trim() || "Alguien"}: ${message}`,
        url: `/chat/${conversation.id}`,
      });
    } catch (pushError) {
      console.error(
        "No se pudo enviar la notificación push:",
        pushError
      );
    }

    return NextResponse.json({
      ok: true,
      message: savedMessage,
    });
  } catch (error: any) {
    console.error("CHAT MESSAGE ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error?.message ?? "Error enviando mensaje.",
      },
      { status: 500 }
    );
  }
}