-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_profilePictureId_fkey";

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "profilePictureId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_profilePictureId_fkey" FOREIGN KEY ("profilePictureId") REFERENCES "Files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
