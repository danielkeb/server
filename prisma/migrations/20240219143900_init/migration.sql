/*
  Warnings:

  - The values [LinkedIn,GitHub,Behance,Dribbble,Instagram,Website] on the enum `SocialPlatform` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SocialPlatform_new" AS ENUM ('LINKEDIN', 'GUTHUB', 'BEHANCE', 'DRIBBBLE', 'INSTAGRAM', 'WEBSITE');
ALTER TYPE "SocialPlatform" RENAME TO "SocialPlatform_old";
ALTER TYPE "SocialPlatform_new" RENAME TO "SocialPlatform";
DROP TYPE "SocialPlatform_old";
COMMIT;
