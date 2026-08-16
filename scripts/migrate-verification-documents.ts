import path from "path";
import fs from "fs/promises";
import { prisma } from "../lib/db";

const PUBLIC_DOCUMENTS_DIR = path.join(process.cwd(), "public", "uploads", "documents");
const PRIVATE_DOCUMENTS_DIR = path.join(process.cwd(), "private-uploads", "documents");

type MigratedRow = { table: string; id: string; from: string; to: string };
type MissingFile = { table: string; id: string; url: string; expectedPath: string };

function extractFilenameFromPublicUrl(url: string) {
  // Formato esperado: "/uploads/documents/<filename>"
  const match = url.match(/^\/uploads\/documents\/([^/?#]+)$/);
  return match ? match[1] : null;
}

async function migrateRecords<T extends { id: string }>(
  table: "BusinessVerificationRequest" | "IdentityVerificationRequest",
  records: T[],
  getUrl: (r: T) => string,
  updateOne: (id: string, newIdentifier: string) => Promise<unknown>,
  migrated: MigratedRow[],
  missing: MissingFile[],
  alreadyMigrated: { table: string; id: string; value: string }[]
) {
  for (const record of records) {
    const currentUrl = getUrl(record);
    const filename = extractFilenameFromPublicUrl(currentUrl);

    if (!filename) {
      // Ya migrado (formato "documents/<filename>") u otro valor no reconocido: se deja igual.
      alreadyMigrated.push({ table, id: record.id, value: currentUrl });
      continue;
    }

    const sourcePath = path.join(PUBLIC_DOCUMENTS_DIR, filename);
    const destPath = path.join(PRIVATE_DOCUMENTS_DIR, filename);

    let sourceStat;
    try {
      sourceStat = await fs.stat(sourcePath);
    } catch {
      missing.push({ table, id: record.id, url: currentUrl, expectedPath: sourcePath });
      continue;
    }

    await fs.mkdir(PRIVATE_DOCUMENTS_DIR, { recursive: true });
    await fs.copyFile(sourcePath, destPath);

    const destStat = await fs.stat(destPath);
    if (destStat.size !== sourceStat.size) {
      missing.push({ table, id: record.id, url: currentUrl, expectedPath: sourcePath });
      continue;
    }

    const newIdentifier = `documents/${filename}`;
    await updateOne(record.id, newIdentifier);

    await fs.unlink(sourcePath);

    migrated.push({ table, id: record.id, from: currentUrl, to: newIdentifier });
  }
}

async function main() {
  const migrated: MigratedRow[] = [];
  const missing: MissingFile[] = [];
  const alreadyMigrated: { table: string; id: string; value: string }[] = [];

  const businessRequests = await prisma.businessVerificationRequest.findMany({
    select: { id: true, rutUrl: true },
  });

  const identityRequests = await prisma.identityVerificationRequest.findMany({
    select: { id: true, documentUrl: true },
  });

  console.log(`Encontrados ${businessRequests.length} BusinessVerificationRequest.`);
  console.log(`Encontrados ${identityRequests.length} IdentityVerificationRequest.`);

  await migrateRecords(
    "BusinessVerificationRequest",
    businessRequests,
    (r) => r.rutUrl,
    (id, newIdentifier) =>
      prisma.businessVerificationRequest.update({
        where: { id },
        data: { rutUrl: newIdentifier },
      }),
    migrated,
    missing,
    alreadyMigrated
  );

  await migrateRecords(
    "IdentityVerificationRequest",
    identityRequests,
    (r) => r.documentUrl,
    (id, newIdentifier) =>
      prisma.identityVerificationRequest.update({
        where: { id },
        data: { documentUrl: newIdentifier },
      }),
    migrated,
    missing,
    alreadyMigrated
  );

  console.log("\n=== RESUMEN MIGRACIÓN ===");
  console.log(`Migrados: ${migrated.length}`);
  for (const row of migrated) {
    console.log(`  [${row.table}] ${row.id}: ${row.from} -> ${row.to}`);
  }

  console.log(`\nYa estaban en formato privado / sin archivo público: ${alreadyMigrated.length}`);
  for (const row of alreadyMigrated) {
    console.log(`  [${row.table}] ${row.id}: ${row.value}`);
  }

  console.log(`\nArchivos faltantes: ${missing.length}`);
  for (const row of missing) {
    console.log(`  [${row.table}] ${row.id}: esperado en ${row.expectedPath} (registro NO modificado)`);
  }
}

main()
  .catch((error) => {
    console.error("Error en la migración:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
