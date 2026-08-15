import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    const userEmail = session?.user?.email?.toLowerCase().trim();

    if (!userEmail) {
      return NextResponse.json(
        { ok: false, error: "Debes iniciar sesión." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const conversationId = String(searchParams.get("conversationId") ?? "").trim();

    if (!conversationId) {
      return NextResponse.json(
        { ok: false, error: "Falta el chat." },
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

    const isParticipant =
      conversation.buyerEmail === userEmail ||
      conversation.sellerEmail === userEmail;

    if (!isParticipant) {
      return NextResponse.json(
        { ok: false, error: "No tienes acceso a este chat." },
        { status: 403 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      ok: true,
      messages,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message ?? "Error cargando mensajes." },
      { status: 500 }
    );
  }
}