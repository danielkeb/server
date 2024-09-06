/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Organizations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[organizationId]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Organizations" DROP CONSTRAINT "Organizations_ownerId_fkey";

-- DropIndex
DROP INDEX "Organizations_ownerId_key";

-- AlterTable
ALTER TABLE "Organizations" DROP COLUMN "ownerId";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "organizationId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Users_organizationId_key" ON "Users"("organizationId");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
