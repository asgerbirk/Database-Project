-- CreateTable
CREATE TABLE `archived_bookings` (
    `BookingID` INTEGER NOT NULL,
    `ClassID` INTEGER NULL,
    `BookingDate` DATETIME(3) NULL,
    `Status` VARCHAR(50) NULL,

    PRIMARY KEY (`BookingID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
