/*
  Warnings:

  - You are about to drop the column `goals` on the `Projects` table. All the data in the column will be lost.
  - You are about to drop the column `timeComitment` on the `Projects` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isRemote` to the `Projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeCommitment` to the `Projects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Projects" DROP CONSTRAINT "Projects_locationId_fkey";

-- AlterTable
ALTER TABLE "Projects" DROP COLUMN "goals",
DROP COLUMN "timeComitment",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isRemote" BOOLEAN NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "timeCommitment" "TimePreference" NOT NULL,
ALTER COLUMN "locationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
