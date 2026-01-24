/*
  Warnings:

  - You are about to drop the column `location` on the `Event` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('GOOGLE', 'ZOOM', 'TEAMS');

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "location",
ADD COLUMN     "locationType" "LocationType",
ADD COLUMN     "locationUrl" TEXT;
