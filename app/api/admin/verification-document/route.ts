import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";

const ADMIN_EMAIL = "mr.papas001@gmail.com";

const MIME_BY_EXT: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

function resolvePrivateDocumentPath(identifier: string) {
  // Identificador esperado: "documents/<filename>" (sin ".." ni rutas absolutas).
  const normalized = identifier.replace(/\\/g, "/");

  if (
    !normalized.startsWith("documents/") ||
    normalized.includes("..") ||
    normalized.includes("\0")
  ) {
    return null;
  }

  return path.join(process.cwd(), "private-uploads", normalized);
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase().trim();

  if (!email) {
    return NextResponse.json({ ok: false, error: "Debes iniciar sesión." }, { status: 403 });
  }

  if (email !== ADMIN_EMAIL) {
    return NextResponse.json({ ok: false, error: "No autorizado." }, { status: 403 });
  }

  const url = new URL(req.url);
  const type = String(url.searchParams.get("type") ?? "").trim();
  const requestId = String(url.searchParams.get("requestId") ?? "").trim();

  if (!requestId || !["business", "identity"].includes(type)) {
    return NextResponse.json({ ok: false, error: "Parámetros inválidos." }, { status: 400 });
  }

  const record =
    type === "business"
      ? await prisma.businessVerificationRequest.findUnique({ where: { id: requestId } })
      : await prisma.identityVerificationRequest.findUnique({ where: { id: requestId } });

  if (!record) {
    return NextResponse.json({ ok: false, error: "Solicitud no encontrada." }, { status: 404 });
  }

  const identifier = type === "business"
    ? (record as { rutUrl: string }).rutUrl
    : (record as { documentUrl: string }).documentUrl;

  const filePath = resolvePrivateDocumentPath(identifier ?? "");

  if (!filePath) {
    return NextResponse.json({ ok: false, error: "Documento no encontrado." }, { status: 404 });
  }

  let buffer: Buffer;

  try {
    buffer = await fs.readFile(filePath);
  } catch {
    return NextResponse.json({ ok: false, error: "Documento no encontrado." }, { status: 404 });
  }

  const ext = path.extname(filePath).replace(".", "").toLowerCase();
  const contentType = MIME_BY_EXT[ext] ?? "application/octet-stream";

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": "inline",
      "Cache-Control": "private, no-store",
    },
  });
}
