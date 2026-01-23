-- DropForeignKey
ALTER TABLE "EventsCategory" DROP CONSTRAINT "EventsCategory_userId_fkey";

-- AlterTable
ALTER TABLE "EventsCategory" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "EventsCategory" ADD CONSTRAINT "EventsCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
