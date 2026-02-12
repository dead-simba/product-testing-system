-- CreateTable
CREATE TABLE "Tester" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "location" TEXT,
    "skinType" TEXT NOT NULL,
    "primaryConcern" TEXT NOT NULL,
    "secondaryConcerns" TEXT NOT NULL,
    "allergies" TEXT,
    "medications" TEXT,
    "reliabilityScore" REAL NOT NULL DEFAULT 100.0,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Manufacturer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "notes" TEXT,
    "qualityScore" REAL NOT NULL DEFAULT 0.0
);

-- CreateTable
CREATE TABLE "Product" (
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
    "manufacturerId" TEXT NOT NULL,
    CONSTRAINT "Product_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Test" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" DATETIME,
    "durationDays" INTEGER NOT NULL,
    "feedbackSchedule" TEXT NOT NULL,
    "testerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Test_testerId_fkey" FOREIGN KEY ("testerId") REFERENCES "Tester" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Test_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BaselineAssessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "testId" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metrics" TEXT NOT NULL,
    "photos" TEXT,
    "notes" TEXT,
    CONSTRAINT "BaselineAssessment_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FinalAssessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "testId" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metrics" TEXT NOT NULL,
    "improvements" TEXT NOT NULL,
    "overallScore" REAL NOT NULL,
    "photos" TEXT,
    "notes" TEXT,
    CONSTRAINT "FinalAssessment_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FeedbackEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "testId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "data" TEXT,
    "photos" TEXT,
    CONSTRAINT "FeedbackEntry_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "BaselineAssessment_testId_key" ON "BaselineAssessment"("testId");

-- CreateIndex
CREATE UNIQUE INDEX "FinalAssessment_testId_key" ON "FinalAssessment"("testId");
