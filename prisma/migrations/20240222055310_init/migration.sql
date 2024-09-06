-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "gender" "Gender";
