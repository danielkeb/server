/*
  Warnings:

  - You are about to drop the column `imageFileId` on the `Badges` table. All the data in the column will be lost.
  - Added the required column `threshold` to the `Badges` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Badges" DROP CONSTRAINT "Badges_imageFileId_fkey";

-- AlterTable
ALTER TABLE "Badges" DROP COLUMN "imageFileId",
ADD COLUMN     "threshold" INTEGER NOT NULL;
