-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userEmail" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Listing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "phone" TEXT,
    "price" REAL,
    "currency" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "location" TEXT,
    "lat" REAL,
    "lng" REAL,
    "categorySlug" TEXT NOT NULL,
    "subcategorySlug" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "sellerType" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT,
    "details" JSONB,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "ownerEmail" TEXT,
    "ownerName" TEXT,
    "ownerImage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Listing" ("categorySlug", "city", "createdAt", "currency", "description", "details", "featured", "id", "imageUrl", "isVerified", "price", "sellerType", "subcategorySlug", "template", "title") SELECT "categorySlug", "city", "createdAt", "currency", "description", "details", "featured", "id", "imageUrl", "isVerified", "price", "sellerType", "subcategorySlug", "template", "title" FROM "Listing";
DROP TABLE "Listing";
ALTER TABLE "new_Listing" RENAME TO "Listing";
CREATE INDEX "Listing_categorySlug_idx" ON "Listing"("categorySlug");
CREATE INDEX "Listing_subcategorySlug_idx" ON "Listing"("subcategorySlug");
CREATE INDEX "Listing_city_idx" ON "Listing"("city");
CREATE INDEX "Listing_ownerEmail_idx" ON "Listing"("ownerEmail");
CREATE INDEX "Listing_createdAt_idx" ON "Listing"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Favorite_userEmail_idx" ON "Favorite"("userEmail");

-- CreateIndex
CREATE INDEX "Favorite_listingId_idx" ON "Favorite"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userEmail_listingId_key" ON "Favorite"("userEmail", "listingId");

-- CreateIndex
CREATE INDEX "SponsorAd_placement_idx" ON "SponsorAd"("placement");

-- CreateIndex
CREATE INDEX "SponsorAd_isActive_idx" ON "SponsorAd"("isActive");

-- CreateIndex
CREATE INDEX "SponsorAd_startAt_idx" ON "SponsorAd"("startAt");

-- CreateIndex
CREATE INDEX "SponsorAd_endAt_idx" ON "SponsorAd"("endAt");
