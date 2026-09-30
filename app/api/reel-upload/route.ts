import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";

export const runtime = "nodejs";

const MAX_REEL_SIZE_BYTES = 25 * 1024 * 1024;
const ALLOWED_REEL_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
          throw new Error("Debes iniciar sesión para subir un reel.");
        }

        return {
          allowedContentTypes: ALLOWED_REEL_TYPES,
          maximumSizeInBytes: MAX_REEL_SIZE_BYTES,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // El anuncio guarda la URL del blob después de completar la subida.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message ?? "No se pudo subir el reel.",
      },
      { status: 400 }
    );
  }
}
