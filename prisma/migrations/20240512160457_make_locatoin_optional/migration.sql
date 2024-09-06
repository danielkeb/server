-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_locationId_fkey";

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "locationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
