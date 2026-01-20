/*
  Warnings:

  - You are about to drop the column `eventDate` on the `Events` table. All the data in the column will be lost.
  - Added the required column `eventEndDate` to the `Events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventStartDate` to the `Events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Events" DROP COLUMN "eventDate",
ADD COLUMN     "eventEndDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "eventStartDate" TIMESTAMP(3) NOT NULL;
