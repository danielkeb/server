/*
  Warnings:

  - Changed the type of `locationPreference` on the `Users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `timePreference` on the `Users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "locationPreference",
ADD COLUMN     "locationPreference" TEXT NOT NULL,
DROP COLUMN "timePreference",
ADD COLUMN     "timePreference" TEXT NOT NULL;
