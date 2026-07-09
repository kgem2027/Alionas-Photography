/*
  Warnings:

  - Added the required column `shootDate` to the `Bookings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCLED', 'COMPLETED');

-- AlterTable
ALTER TABLE "Bookings" ADD COLUMN     "shootDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
