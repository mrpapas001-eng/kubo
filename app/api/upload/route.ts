import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import { put } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const runtime = "nodejs";

const MAX_IMAGE_FILES = 10;
const MAX_IMAGE_SIZE_MB = 8;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

const MAX_VIDEO_FILES = 1;
const MAX_VIDEO_SIZE_MB = 50;
const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;

const MAX_DOCUMENT_FILES = 1;
const MAX_DOCUMENT_SIZE_MB = 10;
const MAX_DOCUMENT_SIZE_BYTES = MAX_DOCUMENT_SIZE_MB * 1024 * 1024;

const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const ALLOWED_VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const ALLOWED_DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "application/pdf": "pdf",
};

function buildSafeFilename(ext: string) {
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString("hex");
  return `${timestamp}-${random}.${ext}`;
}

async function saveFile(file: File, subfolder: string) {
  const ext = MIME_TO_EXT[file.type] || "bin";
  const filename = buildSafeFilename(ext);

  if (subfolder === "images") {
    const blob = await put(`${subfolder}/${filename}`, file, {
      access: "public",
      addRandomSuffix: false,
    });

    return blob.url;
  }

  // Los documentos de verificación (RUT/identidad) no deben quedar públicos.
  const isPrivateDocument = subfolder === "documents";
  const uploadDir = isPrivateDocument
    ? path.join(process.cwd(), "private-uploads", subfolder)
    : path.join(process.cwd(), "public", "uploads", subfolder);

  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, filename);
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await fs.writeFile(filePath, buffer);

  // Documentos privados guardan un identificador interno, no una URL pública.
  return isPrivateDocument
    ? `${subfolder}/${filename}`
    : `/uploads/${subfolder}/${filename}`;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { ok: false, error: "Debes iniciar sesión para subir archivos." },
        { status: 401 }
      );
    }

    const form = await req.formData();

    const rawImageFiles = form.getAll("files");
    const rawVideoFiles = form.getAll("video");
    const rawDocumentFiles = form.getAll("documents");

    const imageFiles = rawImageFiles.filter(
      (item): item is File => item instanceof File
    );

    const videoFiles = rawVideoFiles.filter(
      (item): item is File => item instanceof File
    );

    const documentFiles = rawDocumentFiles.filter(
      (item): item is File => item instanceof File
    );

    if (
      imageFiles.length === 0 &&
      videoFiles.length === 0 &&
      documentFiles.length === 0
    ) {
      return NextResponse.json(
        { ok: false, error: "No llegaron archivos." },
        { status: 400 }
      );
    }

    if (imageFiles.length > MAX_IMAGE_FILES) {
      return NextResponse.json(
        {
          ok: false,
          error: `Solo puedes subir hasta ${MAX_IMAGE_FILES} imágenes.`,
        },
        { status: 400 }
      );
    }

    if (videoFiles.length > MAX_VIDEO_FILES) {
      return NextResponse.json(
        {
          ok: false,
          error: `Solo puedes subir ${MAX_VIDEO_FILES} video.`,
        },
        { status: 400 }
      );
    }

    if (documentFiles.length > MAX_DOCUMENT_FILES) {
      return NextResponse.json(
        {
          ok: false,
          error: `Solo puedes subir ${MAX_DOCUMENT_FILES} documento.`,
        },
        { status: 400 }
      );
    }

    const urls: string[] = [];
    let videoUrl: string | null = null;
    let documentUrl: string | null = null;

    for (const file of imageFiles) {
      if (!file.size || file.size <= 0) {
        return NextResponse.json(
          { ok: false, error: `El archivo "${file.name}" está vacío.` },
          { status: 400 }
        );
      }

      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        return NextResponse.json(
          {
            ok: false,
            error: `El archivo "${file.name}" supera el máximo de ${MAX_IMAGE_SIZE_MB}MB.`,
          },
          { status: 400 }
        );
      }

      if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            ok: false,
            error: `El archivo "${file.name}" no es una imagen permitida. Usa JPG, PNG o WEBP.`,
          },
          { status: 400 }
        );
      }

      const savedUrl = await saveFile(file, "images");
      urls.push(savedUrl);
    }

    if (videoFiles.length > 0) {
      const video = videoFiles[0];

      if (!video.size || video.size <= 0) {
        return NextResponse.json(
          { ok: false, error: `El video "${video.name}" está vacío.` },
          { status: 400 }
        );
      }

      if (video.size > MAX_VIDEO_SIZE_BYTES) {
        return NextResponse.json(
          {
            ok: false,
            error: `El video "${video.name}" supera el máximo de ${MAX_VIDEO_SIZE_MB}MB.`,
          },
          { status: 400 }
        );
      }

      if (!ALLOWED_VIDEO_MIME_TYPES.includes(video.type)) {
        return NextResponse.json(
          {
            ok: false,
            error: `El video "${video.name}" no es válido. Usa MP4, WEBM o MOV.`,
          },
          { status: 400 }
        );
      }

      videoUrl = await saveFile(video, "videos");
    }

    if (documentFiles.length > 0) {
      const document = documentFiles[0];

      if (!document.size || document.size <= 0) {
        return NextResponse.json(
          { ok: false, error: `El documento "${document.name}" esta vacio.` },
          { status: 400 }
        );
      }

      if (document.size > MAX_DOCUMENT_SIZE_BYTES) {
        return NextResponse.json(
          {
            ok: false,
            error: `El documento "${document.name}" supera el maximo de ${MAX_DOCUMENT_SIZE_MB}MB.`,
          },
          { status: 400 }
        );
      }

      if (!ALLOWED_DOCUMENT_MIME_TYPES.includes(document.type)) {
        return NextResponse.json(
          {
            ok: false,
            error: `El documento "${document.name}" no es valido. Usa PDF, JPG, PNG o WEBP.`,
          },
          { status: 400 }
        );
      }

      documentUrl = await saveFile(document, "documents");
    }

    return NextResponse.json({
      ok: true,
      urls,
      videoUrl,
      documentUrl,
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        error: e?.message ?? "Error subiendo archivos.",
      },
      { status: 500 }
    );
  }
}
