-- AlterTable
ALTER TABLE "Certificates" ADD COLUMN     "projectId" TEXT;

-- AddForeignKey
ALTER TABLE "Certificates" ADD CONSTRAINT "Certificates_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
