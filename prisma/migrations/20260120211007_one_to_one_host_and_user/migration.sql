/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Host` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Host_userId_key" ON "Host"("userId");
