/*
  Warnings:

  - You are about to drop the column `date_given` on the `UsersToBadges` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UsersToBadges" DROP COLUMN "date_given",
ADD COLUMN     "dateGiven" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
