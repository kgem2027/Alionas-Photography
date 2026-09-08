-- AlterTable
ALTER TABLE "Bookings" ADD COLUMN     "endTime" TIMESTAMP(3);

-- Backfill existing rows with a default 2-hour duration
UPDATE "Bookings" SET "endTime" = "shootDate" + INTERVAL '2 hours' WHERE "endTime" IS NULL;

-- Enforce NOT NULL now that existing rows are backfilled
ALTER TABLE "Bookings" ALTER COLUMN "endTime" SET NOT NULL;
