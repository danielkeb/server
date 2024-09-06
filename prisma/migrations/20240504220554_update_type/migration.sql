/*
  Warnings:

  - The values [REVIEWS] on the enum `ReportContentTypes` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReportContentTypes_new" AS ENUM ('USER', 'ORGANIZATION', 'PROJECT', 'REVIEW');
ALTER TABLE "Reports" ALTER COLUMN "contentType" TYPE "ReportContentTypes_new" USING ("contentType"::text::"ReportContentTypes_new");
ALTER TYPE "ReportContentTypes" RENAME TO "ReportContentTypes_old";
ALTER TYPE "ReportContentTypes_new" RENAME TO "ReportContentTypes";
DROP TYPE "ReportContentTypes_old";
COMMIT;
