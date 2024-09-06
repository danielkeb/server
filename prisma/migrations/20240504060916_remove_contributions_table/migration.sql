/*
  Warnings:

  - You are about to drop the `Contributions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Contributions" DROP CONSTRAINT "Contributions_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Contributions" DROP CONSTRAINT "Contributions_userId_fkey";

-- DropTable
DROP TABLE "Contributions";
