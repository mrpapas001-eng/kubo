import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    await prisma.userPresence.upsert({
      where: { email },
      update: {
        lastSeen: new Date(),
      },
      create: {
        email,
        lastSeen: new Date(),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PRESENCE ERROR:", error);

    return NextResponse.json(
      { ok: false, error: "No se pudo actualizar presencia" },
      { status: 500 }
    );
  }
}