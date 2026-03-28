import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    // ✅ múltiples: "files"
    const files = form.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No llegaron archivos" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const urls: string[] = [];

    for (const file of files.slice(0, 10)) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const safeExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";

      const filename = `${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}.${safeExt}`;

      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);

      urls.push(`/uploads/${filename}`);
    }

    return NextResponse.json({ ok: true, urls });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Error subiendo" },
      { status: 500 }
    );
  }
}