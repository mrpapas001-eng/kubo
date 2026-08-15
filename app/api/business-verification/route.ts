import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const ownerEmail = session?.user?.email?.toLowerCase().trim();

  if (!ownerEmail) {
    return NextResponse.json({ error: "Debes iniciar sesion." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const businessName = String(body.businessName || "").trim();
    const businessDescription = String(body.businessDescription || "").trim();
    const rutUrl = String(body.rutUrl || "").trim();

    if (businessName.length < 3) {
      return NextResponse.json(
        { error: "Escribe el nombre de la empresa." },
        { status: 400 }
      );
    }

    if (!rutUrl) {
      return NextResponse.json(
        { error: "Sube el RUT de la empresa." },
        { status: 400 }
      );
    }

    const businessSlug = slugify(businessName);

    if (!businessSlug) {
      return NextResponse.json(
        { error: "El nombre de empresa no es valido." },
        { status: 400 }
      );
    }

    const activeRequest = await prisma.businessVerificationRequest.findFirst({
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

    await prisma.businessVerificationRequest.create({
      data: {
        ownerEmail,
        ownerName: session?.user?.name || null,
        businessName,
        businessSlug,
        businessDescription: businessDescription || null,
        rutUrl,
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
