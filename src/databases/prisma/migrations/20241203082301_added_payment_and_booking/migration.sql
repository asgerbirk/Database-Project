/*
  Warnings:

  - A unique constraint covering the columns `[BookingID]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `payments_BookingID_key` ON `payments`(`BookingID`);
