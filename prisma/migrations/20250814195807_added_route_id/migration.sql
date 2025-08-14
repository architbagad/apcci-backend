/*
  Warnings:

  - Added the required column `routeId` to the `Allotment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Allotment" ADD COLUMN     "routeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Allotment" ADD CONSTRAINT "Allotment_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "public"."Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
