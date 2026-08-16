import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json({ ok: true, unreadTotal: 0 });
    }

    const unreadTotal = await prisma.message.count({
      where: {
        senderEmail: {
          not: email,
        },
        readAt: null,
        conversation: {
          OR: [{ buyerEmail: email }, { sellerEmail: email }],
        },
      },
    });

    return NextResponse.json({
      ok: true,
      unreadTotal,
    });
  } catch (error: any) {
    console.error("CHAT UNREAD ERROR:", error);

    return NextResponse.json(
      { ok: false, error: error?.message ?? "Error cargando mensajes no leídos." },
      { status: 500 }
    );
  }
}
