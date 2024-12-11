-- DropForeignKey
ALTER TABLE `members` DROP FOREIGN KEY `members_MembershipID_fkey`;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_MembershipID_fkey` FOREIGN KEY (`MembershipID`) REFERENCES `memberships`(`MembershipID`) ON DELETE SET NULL ON UPDATE CASCADE;
