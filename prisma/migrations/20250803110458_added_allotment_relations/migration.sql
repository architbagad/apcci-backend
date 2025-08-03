-- AddForeignKey
ALTER TABLE "public"."Allotment" ADD CONSTRAINT "Allotment_binId_fkey" FOREIGN KEY ("binId") REFERENCES "public"."ScanBin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
