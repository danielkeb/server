/*
  Warnings:

  - The values [IN_PROGRESS] on the enum `TaskStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `asignedToId` on the `Tasks` table. All the data in the column will be lost.
  - Added the required column `assignedToId` to the `Tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TaskStatus_new" AS ENUM ('OPEN', 'COMPLETED');
ALTER TABLE "Tasks" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Tasks" ALTER COLUMN "status" TYPE "TaskStatus_new" USING ("status"::text::"TaskStatus_new");
ALTER TYPE "TaskStatus" RENAME TO "TaskStatus_old";
ALTER TYPE "TaskStatus_new" RENAME TO "TaskStatus";
DROP TYPE "TaskStatus_old";
ALTER TABLE "Tasks" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;

-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_asignedToId_fkey";

-- AlterTable
ALTER TABLE "Tasks" DROP COLUMN "asignedToId",
ADD COLUMN     "assignedToId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
