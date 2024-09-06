/*
  Warnings:

  - A unique constraint covering the columns `[profilePictureId]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cvId]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "cvId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Users_profilePictureId_key" ON "Users"("profilePictureId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_cvId_key" ON "Users"("cvId");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "Files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
