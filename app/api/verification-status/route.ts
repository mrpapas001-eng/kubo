import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { ok: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    const email = session.user.email.toLowerCase().trim();

    const verification = await prisma.accountVerification.findFirst({
      where: {
        email,
        type: "PARTICULAR",
        status: "VERIFIED",
      },
      select: {
        whatsappNumber: true,
      },
    });

    return NextResponse.json({
      ok: true,
      isVerified: !!verification,
      whatsappNumber: verification?.whatsappNumber || null,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Error verificando estado" },
      { status: 500 }
    );
  }
}
