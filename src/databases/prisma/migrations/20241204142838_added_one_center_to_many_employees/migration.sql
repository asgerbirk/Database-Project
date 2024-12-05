-- AlterTable
ALTER TABLE `employees` ADD COLUMN `CenterID` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_CenterID_fkey` FOREIGN KEY (`CenterID`) REFERENCES `centers`(`CenterID`) ON DELETE SET NULL ON UPDATE CASCADE;
