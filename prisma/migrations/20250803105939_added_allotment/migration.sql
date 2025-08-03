/*
  Warnings:

  - You are about to drop the column `userId` on the `ScanBin` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ScanBin" DROP CONSTRAINT "ScanBin_userId_fkey";

-- DropIndex
DROP INDEX "public"."ScanBin_userId_idx";

-- AlterTable
ALTER TABLE "public"."ScanBin" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "public"."Allotment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "binId" TEXT NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Allotment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Allotment_userId_idx" ON "public"."Allotment"("userId");

-- CreateIndex
CREATE INDEX "Allotment_binId_idx" ON "public"."Allotment"("binId");

-- AddForeignKey
ALTER TABLE "public"."Allotment" ADD CONSTRAINT "Allotment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
