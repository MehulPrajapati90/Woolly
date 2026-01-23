/*
  Warnings:

  - Made the column `userId` on table `EventsCategory` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "EventsCategory" DROP CONSTRAINT "EventsCategory_userId_fkey";

-- AlterTable
ALTER TABLE "EventsCategory" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "EventsCategory" ADD CONSTRAINT "EventsCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
