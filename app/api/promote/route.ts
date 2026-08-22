import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const MONETIZATION_START = "2026-10-01";

function colombiaDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      {
        ok: false,
        error: "Debes iniciar sesión.",
      },
      { status: 401 }
    );
  }

  const today = colombiaDateKey();

  if (today < MONETIZATION_START) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Las promociones de pago todavía no están activas. Durante esta etapa Kubo está en periodo de lanzamiento.",
      },
      { status: 403 }
    );
  }

  return NextResponse.json(
    {
      ok: false,
      error:
        "El sistema de promociones de pago todavía no ha sido habilitado.",
    },
    { status: 503 }
  );
}