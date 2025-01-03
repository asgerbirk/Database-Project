/*
  Warnings:

  - You are about to drop the `member_bookings` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `ClassID` on table `bookings` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `bookings_ClassID_fkey`;

-- DropForeignKey
ALTER TABLE `member_bookings` DROP FOREIGN KEY `member_bookings_BookingID_fkey`;

-- DropForeignKey
ALTER TABLE `member_bookings` DROP FOREIGN KEY `member_bookings_MemberID_fkey`;

-- AlterTable
ALTER TABLE `bookings` ADD COLUMN `MemberID` INTEGER NULL,
    MODIFY `ClassID` INTEGER NOT NULL;

-- DropTable
DROP TABLE `member_bookings`;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_ClassID_fkey` FOREIGN KEY (`ClassID`) REFERENCES `classes`(`ClassID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_MemberID_fkey` FOREIGN KEY (`MemberID`) REFERENCES `members`(`MemberID`) ON DELETE SET NULL ON UPDATE CASCADE;
