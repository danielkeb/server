/*
  Warnings:

  - You are about to drop the column `isRemote` on the `Projects` table. All the data in the column will be lost.
  - You are about to drop the column `openPositions` on the `Projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Projects" DROP COLUMN "isRemote",
DROP COLUMN "openPositions";
