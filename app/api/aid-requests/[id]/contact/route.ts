import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";

// Endpoint autenticado para acceder al WhatsApp de una solicitud aprobada.
// El número nunca viaja en el listado público; solo se entrega aquí, con sesión.
// En el futuro este endpoint permitirá registrar quién accedió al contacto.
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const viewerEmail = session?.user?.email?.toLowerCase().trim() ?? null;

    if (!viewerEmail) {
      return NextResponse.json(
        { ok: false, error: "Debes iniciar sesión para contactar al solicitante." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const aidRequest = await prisma.aidRequest.findUnique({
      where: { id },
      select: { id: true, status: true, whatsappNumber: true, title: true },
    });

    if (!aidRequest || !["APPROVED", "MATCHED"].includes(aidRequest.status)) {
      return NextResponse.json(
        { ok: false, error: "Solicitud no disponible." },
        { status: 404 }
      );
    }

    const digits = String(aidRequest.whatsappNumber).replace(/\D/g, "");
    const international = digits.startsWith("57") ? digits : `57${digits}`;
    const message = encodeURIComponent(
      `Hola, vi tu solicitud "${aidRequest.title}" en Kubo Ayuda y quiero ayudarte.`
    );

    return NextResponse.json({
      ok: true,
      whatsappNumber: digits,
      whatsappUrl: `https://wa.me/${international}?text=${message}`,
      inProcess: aidRequest.status === "MATCHED",
    });
  } catch (error) {
    console.error("POST /api/aid-requests/[id]/contact error:", error);
    return NextResponse.json(
      { ok: false, error: "Error obteniendo el contacto." },
      { status: 500 }
    );
  }
}
