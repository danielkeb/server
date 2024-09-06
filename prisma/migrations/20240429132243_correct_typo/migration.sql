/*
  Warnings:

  - You are about to drop the column `vaccancies` on the `SkillsToProjects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SkillsToProjects" DROP COLUMN "vaccancies",
ADD COLUMN     "vacancies" INTEGER NOT NULL DEFAULT 1;
