/*
  Warnings:

  - You are about to drop the column `standardTime` on the `EventCalendar` table. All the data in the column will be lost.
  - You are about to drop the `Events` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `hostId` to the `EventCalendar` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "Events" DROP CONSTRAINT "Events_calendarId_fkey";

-- DropForeignKey
ALTER TABLE "Events" DROP CONSTRAINT "Events_hostId_fkey";

-- AlterTable
ALTER TABLE "EventCalendar" DROP COLUMN "standardTime",
ADD COLUMN     "hostId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "Events";

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "eventStartDate" TIMESTAMP(3) NOT NULL,
    "eventEndDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "visibility" "Visibility" NOT NULL,
    "coverMedia" "CoverMediaType",
    "coverMediaUrl" TEXT,
    "calendarId" TEXT,
    "status" "EventStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_hostId_status_idx" ON "Event"("hostId", "status");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "EventCalendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventCalendar" ADD CONSTRAINT "EventCalendar_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Host"("id") ON DELETE CASCADE ON UPDATE CASCADE;
