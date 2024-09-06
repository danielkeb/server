/*
  Warnings:

  - A unique constraint covering the columns `[websiteUrl]` on the table `Organizations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contactEmail]` on the table `Organizations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contactPhone]` on the table `Organizations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Organizations_websiteUrl_key" ON "Organizations"("websiteUrl");

-- CreateIndex
CREATE UNIQUE INDEX "Organizations_contactEmail_key" ON "Organizations"("contactEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Organizations_contactPhone_key" ON "Organizations"("contactPhone");
