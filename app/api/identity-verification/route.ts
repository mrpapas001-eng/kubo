import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const ownerEmail = session?.user?.email?.toLowerCase().trim();

  if (!ownerEmail) {
    return NextResponse.json({ error: "Debes iniciar sesion." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const documentUrl = String(body.documentUrl || "").trim();
    const consent = Boolean(body.consent);

    if (!documentUrl) {
      return NextResponse.json(
        { error: "Sube una foto o PDF de tu documento." },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { error: "Debes aceptar el tratamiento de datos para verificarte." },
        { status: 400 }
      );
    }

    const activeRequest = await prisma.identityVerificationRequest.findFirst({
      where: {
        ownerEmail,
        status: "pending",
      },
    });

    if (activeRequest) {
      return NextResponse.json(
        { error: "Ya tienes una solicitud pendiente." },
        { status: 400 }
      );
    }

    await prisma.identityVerificationRequest.create({
      data: {
        ownerEmail,
        ownerName: session?.user?.name || null,
        documentUrl,
        status: "pending",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo enviar la solicitud." },
      { status: 500 }
    );
  }
}
