-- AlterTable
ALTER TABLE "Organizations" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Projects" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
