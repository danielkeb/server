/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Badges` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Badges_name_key" ON "Badges"("name");
