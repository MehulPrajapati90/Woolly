-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('REGISTERED', 'CANCELLED', 'CHECKED_IN', 'WAITLISTED');

-- CreateTable
CREATE TABLE "RegisterEvents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'REGISTERED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegisterEvents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RegisterEvents_eventId_idx" ON "RegisterEvents"("eventId");

-- CreateIndex
CREATE INDEX "RegisterEvents_userId_idx" ON "RegisterEvents"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RegisterEvents_userId_eventId_key" ON "RegisterEvents"("userId", "eventId");

-- AddForeignKey
ALTER TABLE "RegisterEvents" ADD CONSTRAINT "RegisterEvents_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegisterEvents" ADD CONSTRAINT "RegisterEvents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
