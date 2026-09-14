-- Migración PostgreSQL aplicada manualmente a Neon.
-- Fecha: 2026-09-14.
-- Motivo: el historial heredado de prisma/migrations pertenece a SQLite y está bloqueado por P3019.
-- Estado: aplicada correctamente y verificada mediante prisma migrate diff.
-- No volver a ejecutar en producción.

-- CreateEnum
CREATE TYPE "BusinessVideoStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "BusinessVideo" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "description" TEXT NOT NULL,
    "categorySlug" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "status" "BusinessVideoStatus" NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),

    CONSTRAINT "BusinessVideo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessVideo_businessId_key" ON "BusinessVideo"("businessId");

-- CreateIndex
CREATE INDEX "BusinessVideo_status_createdAt_idx" ON "BusinessVideo"("status", "createdAt");

-- CreateIndex
CREATE INDEX "BusinessVideo_city_idx" ON "BusinessVideo"("city");

-- CreateIndex
CREATE INDEX "BusinessVideo_categorySlug_idx" ON "BusinessVideo"("categorySlug");

-- AddForeignKey
ALTER TABLE "BusinessVideo" ADD CONSTRAINT "BusinessVideo_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;
