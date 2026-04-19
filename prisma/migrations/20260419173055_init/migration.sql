-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "birthdate" DATETIME,
    "gender" TEXT,
    "heightCm" REAL,
    "avatarColor" TEXT NOT NULL DEFAULT '#3b82f6',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Measurement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "weightKg" REAL,
    "waistAboveNavelCm" REAL,
    "waistNavelCm" REAL,
    "rightArmCm" REAL,
    "leftArmCm" REAL,
    "rightForearmCm" REAL,
    "leftForearmCm" REAL,
    "glutesCm" REAL,
    "rightThighCm" REAL,
    "leftThighCm" REAL,
    "rightCalfCm" REAL,
    "leftCalfCm" REAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Measurement_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Measurement_profileId_date_idx" ON "Measurement"("profileId", "date");
