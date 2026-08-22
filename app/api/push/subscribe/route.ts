import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email?.toLowerCase().trim();

    if (!userEmail) {
      return NextResponse.json(
        { ok: false, error: "Debes iniciar sesión." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const endpoint = String(body?.endpoint ?? "").trim();
    const p256dh = String(body?.keys?.p256dh ?? "").trim();
    const auth = String(body?.keys?.auth ?? "").trim();

    if (!endpoint || !p256dh || !auth) {
      return NextResponse.json(
        { ok: false, error: "Suscripción push inválida." },
        { status: 400 }
      );
    }

    await prisma.pushSubscription.upsert({
      where: {
        endpoint,
      },
      update: {
        userEmail,
        p256dh,
        auth,
      },
      create: {
        userEmail,
        endpoint,
        p256dh,
        auth,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("PUSH SUBSCRIBE ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error?.message ?? "No se pudo guardar la suscripción.",
      },
      { status: 500 }
    );
  }
}