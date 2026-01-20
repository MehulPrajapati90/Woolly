/*
  Warnings:

  - Added the required column `visibility` to the `Events` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE', 'UNLISTED');

-- AlterTable
ALTER TABLE "Events" ADD COLUMN     "visibility" "Visibility" NOT NULL;
