/*
  Warnings:

  - You are about to drop the column `imageUrls` on the `Listing` table. All the data in the column will be lost.
  - You are about to alter the column `details` on the `Listing` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Listing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "currency" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "categorySlug" TEXT NOT NULL,
    "subcategorySlug" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "sellerType" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL,
    "imageUrl" TEXT,
    "details" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Listing" ("categorySlug", "city", "createdAt", "currency", "description", "details", "id", "imageUrl", "isVerified", "price", "sellerType", "subcategorySlug", "template", "title") SELECT "categorySlug", "city", "createdAt", "currency", "description", "details", "id", "imageUrl", "isVerified", "price", "sellerType", "subcategorySlug", "template", "title" FROM "Listing";
DROP TABLE "Listing";
ALTER TABLE "new_Listing" RENAME TO "Listing";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
