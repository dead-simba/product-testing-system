/*
  Warnings:

  - You are about to drop the column `ingredients` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BaselineAssessment" ADD COLUMN "testerSnapshot" TEXT;

-- AlterTable
ALTER TABLE "Manufacturer" ADD COLUMN "contactName" TEXT;
ALTER TABLE "Manufacturer" ADD COLUMN "email" TEXT;

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "sku" TEXT,
    "formulaVersion" TEXT,
    "manufacturingDate" DATETIME,
    "expirationDate" DATETIME,
    "ingredients" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "primaryClaim" TEXT NOT NULL,
    "secondaryClaims" TEXT,
    "usageInstructions" TEXT,
    "volume" TEXT,
    "effectivenessScore" REAL NOT NULL DEFAULT 0.0,
    "safetyScore" REAL NOT NULL DEFAULT 100.0,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "manufacturerId" TEXT NOT NULL,
    CONSTRAINT "Product_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("category", "createdAt", "effectivenessScore", "id", "manufacturerId", "name", "primaryClaim", "safetyScore", "status", "updatedAt", "usageInstructions", "volume") SELECT "category", "createdAt", "effectivenessScore", "id", "manufacturerId", "name", "primaryClaim", "safetyScore", "status", "updatedAt", "usageInstructions", "volume" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE TABLE "new_Test" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATETIME,
    "durationDays" INTEGER NOT NULL,
    "feedbackSchedule" TEXT NOT NULL,
    "productSize" TEXT,
    "testerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productVariantId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Test_testerId_fkey" FOREIGN KEY ("testerId") REFERENCES "Tester" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Test_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Test_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Test" ("createdAt", "durationDays", "endDate", "feedbackSchedule", "id", "productId", "startDate", "status", "testerId", "updatedAt") SELECT "createdAt", "durationDays", "endDate", "feedbackSchedule", "id", "productId", "startDate", "status", "testerId", "updatedAt" FROM "Test";
DROP TABLE "Test";
ALTER TABLE "new_Test" RENAME TO "Test";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "ProductVariant"("sku");
