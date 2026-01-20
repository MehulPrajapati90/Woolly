/*
  Warnings:

  - You are about to drop the `test` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('FACEBOOK', 'TWITTER', 'INSTAGRAM', 'PEERLIST', 'LINKEDIN', 'WEBSITE');

-- AlterTable
ALTER TABLE "Events" ADD COLUMN     "calendarId" TEXT;

-- DropTable
DROP TABLE "test";

-- CreateTable
CREATE TABLE "EventCalendar" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "coverImageUrl" TEXT,
    "locationUTC" TEXT,
    "timezone" TEXT,
    "standardTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventCalendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventsCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "coverImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventsCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventCalendarCategory" (
    "calendarId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventCalendarCategory_pkey" PRIMARY KEY ("calendarId","categoryId")
);

-- CreateTable
CREATE TABLE "CalendarSocialLinks" (
    "id" TEXT NOT NULL,
    "calendarId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarSocialLinks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventsCategory_name_key" ON "EventsCategory"("name");

-- CreateIndex
CREATE INDEX "Events_hostId_status_idx" ON "Events"("hostId", "status");

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "EventCalendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventCalendarCategory" ADD CONSTRAINT "EventCalendarCategory_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "EventCalendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventCalendarCategory" ADD CONSTRAINT "EventCalendarCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "EventsCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalendarSocialLinks" ADD CONSTRAINT "CalendarSocialLinks_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "EventCalendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
