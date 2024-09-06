/*
  Warnings:

  - Added the required column `projectId` to the `Reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reviews" ADD COLUMN     "projectId" TEXT NOT NULL,
ADD COLUMN     "rating" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
