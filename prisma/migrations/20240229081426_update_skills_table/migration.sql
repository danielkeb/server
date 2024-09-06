/*
  Warnings:

  - Added the required column `categoryId` to the `Skills` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Skills` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Skills" ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "SkillCategories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillCategories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SkillCategories_name_key" ON "SkillCategories"("name");

-- AddForeignKey
ALTER TABLE "Skills" ADD CONSTRAINT "Skills_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "SkillCategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
