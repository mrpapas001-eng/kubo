import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Resend } from "resend";

import { authOptions } from "@/lib/authOptions";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/db";

const ACCESS_LINK = "https://www.kuboanuncios.com/empresa";
const FROM_EMAIL = "Kubo Anuncios <acceso@kuboanuncios.com>";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase().trim();

  if (!isAdminEmail(email)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id } = await params;

    const business = await prisma.business.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        ownerEmail: true,
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Empresa no encontrada." },
        { status: 404 }
      );
    }

    const ownerEmail = business.ownerEmail?.trim();

    if (!ownerEmail) {
      return NextResponse.json(
        { error: "La empresa no tiene un correo del propietario registrado." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "No está configurada la clave RESEND_API_KEY." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <p>Hola,</p>
        <p>
          Te invitamos a acceder al panel de empresa de Kubo Anuncios para gestionar tus anuncios.
        </p>
        <p>
          Debes iniciar sesión con Google usando exactamente este correo: <strong>${ownerEmail}</strong>.
        </p>
        <p>
          <a href="${ACCESS_LINK}" style="display: inline-block; background-color: #0f3c8c; color: #ffffff; padding: 12px 18px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Acceder a mi panel
          </a>
        </p>
        <p>
          Desde tu panel podrás administrar tus anuncios y consultar visitas, clics y estadísticas de rendimiento.
        </p>
        <p>
          Si tienes dudas, responde a este correo y te ayudaremos.
        </p>
        <p>Gracias,<br />Kubo Anuncios</p>
      </div>
    `;

    const text = [
      "Hola,",
      "Te invitamos a acceder al panel de empresa de Kubo Anuncios para gestionar tus anuncios.",
      `Debes iniciar sesión con Google usando exactamente este correo: ${ownerEmail}`,
      `Enlace de acceso: ${ACCESS_LINK}`,
      "Desde tu panel podrás administrar tus anuncios y consultar visitas, clics y estadísticas.",
      "Gracias,",
      "Kubo Anuncios",
    ].join("\n\n");

    await resend.emails.send({
      from: FROM_EMAIL,
      to: [ownerEmail],
      subject: "Acceso a tu panel de empresa en Kubo Anuncios",
      html,
      text,
    });

    return NextResponse.json({
      ok: true,
      recipient: ownerEmail,
      businessName: business.name,
    });
  } catch (error) {
    console.error("Error sending business access email:", error);

    const message =
      error instanceof Error && error.message
        ? error.message
        : "No se pudo enviar el correo de acceso.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
