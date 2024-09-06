-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "notificationPreference" JSONB[];

-- DropEnum
DROP TYPE "SocialPlatform";
