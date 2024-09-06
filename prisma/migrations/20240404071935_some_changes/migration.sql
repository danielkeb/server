/*
  Warnings:

  - A unique constraint covering the columns `[ownerId]` on the table `Organizations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `Organizations` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Organizations_contactEmail_key";

-- DropIndex
DROP INDEX "Organizations_contactPhone_key";

-- DropIndex
DROP INDEX "Organizations_websiteUrl_key";

-- AlterTable
ALTER TABLE "Organizations" ADD COLUMN     "ownerId" TEXT NOT NULL,
ALTER COLUMN "contactEmail" DROP NOT NULL,
ALTER COLUMN "foundingDate" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Organizations_ownerId_key" ON "Organizations"("ownerId");

-- AddForeignKey
ALTER TABLE "Organizations" ADD CONSTRAINT "Organizations_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
