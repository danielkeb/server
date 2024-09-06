-- DropForeignKey
ALTER TABLE "Organizations" DROP CONSTRAINT "Organizations_logoId_fkey";

-- DropForeignKey
ALTER TABLE "Organizations" DROP CONSTRAINT "Organizations_permitId_fkey";

-- AlterTable
ALTER TABLE "Organizations" ALTER COLUMN "logoId" DROP NOT NULL,
ALTER COLUMN "permitId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Organizations" ADD CONSTRAINT "Organizations_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "Files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organizations" ADD CONSTRAINT "Organizations_permitId_fkey" FOREIGN KEY ("permitId") REFERENCES "Files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
