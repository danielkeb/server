/*
  Warnings:

  - The `notificationPreference` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `socialLinks` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "notificationPreference",
ADD COLUMN     "notificationPreference" JSONB[],
DROP COLUMN "socialLinks",
ADD COLUMN     "socialLinks" JSONB[];
