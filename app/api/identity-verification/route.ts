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
    const whatsappNumber = String(body.whatsappNumber || "").replace(/\D/g, "").trim();

    if (!whatsappNumber) {
      return NextResponse.json(
        { error: "Escribe tu numero de WhatsApp para verificar tu cuenta." },
        { status: 400 }
      );
    }

    const existingRequest = await prisma.accountVerification.findUnique({
      where: {
        email_type: {
          email: ownerEmail,
          type: "PARTICULAR",
        },
      },
    });

    if (existingRequest?.status === "PENDING") {
      return NextResponse.json(
        { error: "Ya tienes una solicitud pendiente." },
        { status: 400 }
      );
    }

    if (existingRequest?.status === "VERIFIED") {
      return NextResponse.json(
        { error: "Tu cuenta ya está verificada." },
        { status: 400 }
      );
    }

    if (existingRequest?.status === "REJECTED") {
      await prisma.accountVerification.update({
        where: {
          id: existingRequest.id,
        },
        data: {
          status: "PENDING",
          whatsappNumber,
          documentUrl: null,
          reviewedAt: null,
          adminNote: null,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({ ok: true, message: "Solicitud reenviada." });
    }

    await prisma.accountVerification.create({
      data: {
        email: ownerEmail,
        type: "PARTICULAR",
        status: "PENDING",
        whatsappNumber,
        documentUrl: null,
      },
    });

    return NextResponse.json({ ok: true, message: "Solicitud enviada." });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo enviar la solicitud." },
      { status: 500 }
    );
  }
}
