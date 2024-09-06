/*
  Warnings:

  - The `locationPreference` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `timePreference` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "locationPreference",
ADD COLUMN     "locationPreference" "LocationPreference" NOT NULL DEFAULT 'BOTH',
DROP COLUMN "timePreference",
ADD COLUMN     "timePreference" "TimePreference" NOT NULL DEFAULT 'BOTH';
