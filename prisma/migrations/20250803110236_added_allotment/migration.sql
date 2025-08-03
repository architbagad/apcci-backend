/*
  Warnings:

  - A unique constraint covering the columns `[tag]` on the table `ScanBin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tag` to the `ScanBin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ScanBin" ADD COLUMN     "tag" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ScanBin_tag_key" ON "public"."ScanBin"("tag");

-- CreateIndex
CREATE INDEX "ScanBin_tag_idx" ON "public"."ScanBin"("tag");
