/*
  Warnings:

  - Added the required column `updatedAt` to the `Manufacturer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Manufacturer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "notes" TEXT,
    "qualityScore" REAL NOT NULL DEFAULT 0.0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Manufacturer" ("id", "name", "notes", "qualityScore", "website") SELECT "id", "name", "notes", "qualityScore", "website" FROM "Manufacturer";
DROP TABLE "Manufacturer";
ALTER TABLE "new_Manufacturer" RENAME TO "Manufacturer";
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "primaryClaim" TEXT NOT NULL,
    "ingredients" TEXT NOT NULL,
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
INSERT INTO "new_Product" ("category", "effectivenessScore", "id", "ingredients", "manufacturerId", "name", "primaryClaim", "safetyScore", "status", "usageInstructions", "volume") SELECT "category", "effectivenessScore", "id", "ingredients", "manufacturerId", "name", "primaryClaim", "safetyScore", "status", "usageInstructions", "volume" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
