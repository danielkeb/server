/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Locations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Locations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Locations" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Locations_code_key" ON "Locations"("code");
