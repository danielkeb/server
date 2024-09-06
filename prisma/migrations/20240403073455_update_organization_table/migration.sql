/*
  Warnings:

  - A unique constraint covering the columns `[logoId]` on the table `Organizations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[permitId]` on the table `Organizations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `foundingDate` to the `Organizations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permitId` to the `Organizations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organizations" ADD COLUMN     "foundingDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "permitId" TEXT NOT NULL,
ALTER COLUMN "mission" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Organizations_logoId_key" ON "Organizations"("logoId");

-- CreateIndex
CREATE UNIQUE INDEX "Organizations_permitId_key" ON "Organizations"("permitId");

-- AddForeignKey
ALTER TABLE "Organizations" ADD CONSTRAINT "Organizations_permitId_fkey" FOREIGN KEY ("permitId") REFERENCES "Files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
