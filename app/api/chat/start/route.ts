import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    const userEmail = session?.user?.email?.toLowerCase().trim();
    const userName = session?.user?.name ?? null;

    if (!userEmail) {
      return NextResponse.json(
        { ok: false, error: "Debes iniciar sesión para chatear." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const listingId = String(body?.listingId ?? "").trim();
    const message = String(body?.message ?? "Hola, ¿sigue disponible?").trim();

    if (!listingId) {
      return NextResponse.json(
        { ok: false, error: "Falta el anuncio." },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json(
        { ok: false, error: "Anuncio no encontrado." },
        { status: 404 }
      );
    }

    if (listing.status !== "active") {
      return NextResponse.json(
        { ok: false, error: "Este anuncio no esta disponible." },
        { status: 404 }
      );
    }

    const sellerEmail = listing.ownerEmail?.toLowerCase().trim();

    if (!sellerEmail) {
      return NextResponse.json(
        { ok: false, error: "Este anuncio no tiene vendedor asociado." },
        { status: 400 }
      );
    }

    if (sellerEmail === userEmail) {
      return NextResponse.json(
        { ok: false, error: "No puedes iniciar chat con tu propio anuncio." },
        { status: 400 }
      );
    }

    let conversation = await prisma.conversation.findFirst({
      where: {
        listingId: listing.id,
        buyerEmail: userEmail,
        sellerEmail,
      },
    });

    const isNewConversation = !conversation;

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          listingId: listing.id,
          listingTitle: listing.title,
          buyerEmail: userEmail,
          buyerName: userName,
          sellerEmail,
          sellerName: listing.ownerName ?? null,
        },
      });
    }

    if (isNewConversation && message) {
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderEmail: userEmail,
          senderName: userName,
          body: message,
        },
      });
    }

    return NextResponse.json({
      ok: true,
      conversationId: conversation.id,
    });
  } catch (error: any) {
    console.error("CHAT START ERROR:", error);

    return NextResponse.json(
      { ok: false, error: error?.message ?? "Error iniciando chat." },
      { status: 500 }
    );
  }
}
