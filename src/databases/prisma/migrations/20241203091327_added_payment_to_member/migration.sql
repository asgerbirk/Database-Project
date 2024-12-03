/*
  Warnings:

  - You are about to drop the column `BookingID` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[MembershipID]` on the table `members` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `members` DROP FOREIGN KEY `members_MembershipID_fkey`;

-- DropForeignKey
ALTER TABLE `payments` DROP FOREIGN KEY `payments_BookingID_fkey`;

-- AlterTable
ALTER TABLE `payments` DROP COLUMN `BookingID`,
    ADD COLUMN `MemberID` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `members_MembershipID_key` ON `members`(`MembershipID`);

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_MembershipID_fkey` FOREIGN KEY (`MembershipID`) REFERENCES `memberships`(`MembershipID`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_MemberID_fkey` FOREIGN KEY (`MemberID`) REFERENCES `members`(`MemberID`) ON DELETE CASCADE ON UPDATE CASCADE;
