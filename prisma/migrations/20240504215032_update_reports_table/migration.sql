/*
  Warnings:

  - You are about to drop the column `reportedEntity` on the `Reports` table. All the data in the column will be lost.
  - You are about to drop the column `reportedEntityType` on the `Reports` table. All the data in the column will be lost.
  - Added the required column `contentId` to the `Reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentType` to the `Reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reason` to the `Reports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Reports` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReportContentTypes" AS ENUM ('USER', 'ORGANIZATION', 'PROJECT', 'REVIEWS');

-- CreateEnum
CREATE TYPE "ReportReasons" AS ENUM ('FAKE', 'SCAM', 'INAPPROPRIATE_CONTENT', 'SPAM', 'IMPERSONATION', 'PRIVACY_VIOLATION', 'OTHER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('ACTIVE', 'RESOLVED');

-- AlterTable
ALTER TABLE "Reports" DROP COLUMN "reportedEntity",
DROP COLUMN "reportedEntityType",
ADD COLUMN     "contentId" TEXT NOT NULL,
ADD COLUMN     "contentType" "ReportContentTypes" NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "reason" "ReportReasons" NOT NULL,
ADD COLUMN     "status" "ReportStatus" NOT NULL;
