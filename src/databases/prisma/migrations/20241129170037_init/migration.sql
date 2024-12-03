-- CreateTable
CREATE TABLE `bookings` (
    `BookingID` INTEGER NOT NULL AUTO_INCREMENT,
    `ClassID` INTEGER NULL,
    `BookingDate` DATE NULL,
    `Status` VARCHAR(50) NULL,

    INDEX `ClassID`(`ClassID`),
    PRIMARY KEY (`BookingID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `centers` (
    `CenterID` INTEGER NOT NULL AUTO_INCREMENT,
    `CenterName` VARCHAR(100) NULL,
    `Location` VARCHAR(255) NULL,
    `Phone` VARCHAR(15) NULL,
    `Email` VARCHAR(100) NULL,
    `OpeningHours` VARCHAR(100) NULL,
    `ManagerName` VARCHAR(100) NULL,
    `Facilities` VARCHAR(255) NULL,

    PRIMARY KEY (`CenterID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `center_products` (
    `CenterProductID` INTEGER NOT NULL AUTO_INCREMENT,
    `CenterID` INTEGER NOT NULL,
    `ProductID` INTEGER NOT NULL,

    UNIQUE INDEX `center_products_CenterID_ProductID_key`(`CenterID`, `ProductID`),
    PRIMARY KEY (`CenterProductID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classes` (
    `ClassID` INTEGER NOT NULL AUTO_INCREMENT,
    `ClassName` VARCHAR(100) NULL,
    `Description` VARCHAR(255) NULL,
    `ClassType` VARCHAR(50) NULL,
    `Duration` INTEGER NULL,
    `MaxParticipants` INTEGER NULL,
    `EmployeeID` INTEGER NULL,
    `CenterID` INTEGER NULL,
    `ScheduleDate` DATE NULL,
    `StartTime` TIME(0) NULL,
    `EndTime` TIME(0) NULL,

    INDEX `EmployeeID`(`EmployeeID`),
    PRIMARY KEY (`ClassID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `equipment` (
    `MachineID` INTEGER NOT NULL AUTO_INCREMENT,
    `MachineName` VARCHAR(100) NULL,
    `Type` VARCHAR(50) NULL,
    `Location` VARCHAR(100) NULL,
    `Manufacturer` VARCHAR(100) NULL,
    `PurchaseDate` DATE NULL,
    `MaintenanceDate` DATE NULL,
    `Status` VARCHAR(50) NULL,
    `CenterID` INTEGER NOT NULL,

    INDEX `CenterID`(`CenterID`),
    PRIMARY KEY (`MachineID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jobtitles` (
    `JobTitleID` INTEGER NOT NULL AUTO_INCREMENT,
    `JobTitleName` VARCHAR(100) NULL,
    `Description` VARCHAR(255) NULL,

    PRIMARY KEY (`JobTitleID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees` (
    `EmployeeID` INTEGER NOT NULL AUTO_INCREMENT,
    `PersonID` INTEGER NULL,
    `HireDate` DATE NULL,
    `JobTitleID` INTEGER NULL,
    `DepartmentID` INTEGER NULL,
    `Salary` DECIMAL(10, 2) NULL,
    `EmploymentStatus` VARCHAR(50) NULL,

    UNIQUE INDEX `employees_PersonID_key`(`PersonID`),
    INDEX `DepartmentID`(`DepartmentID`),
    INDEX `JobTitleID`(`JobTitleID`),
    PRIMARY KEY (`EmployeeID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `person` (
    `PersonID` INTEGER NOT NULL AUTO_INCREMENT,
    `FirstName` VARCHAR(100) NULL,
    `LastName` VARCHAR(100) NULL,
    `Email` VARCHAR(100) NULL,
    `Password` VARCHAR(100) NULL,
    `Phone` VARCHAR(15) NULL,
    `Address` VARCHAR(255) NULL,
    `DateOfBirth` DATE NULL,
    `Role` ENUM('ADMIN', 'MEMBER', 'MANAGER', 'BASIC') NULL,
    `ImageUrl` VARCHAR(191) NULL,

    UNIQUE INDEX `Email`(`Email`),
    PRIMARY KEY (`PersonID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `members` (
    `MemberID` INTEGER NOT NULL AUTO_INCREMENT,
    `PersonID` INTEGER NULL,
    `JoinDate` DATE NULL,
    `MembershipID` INTEGER NULL,
    `EmergencyContact` VARCHAR(15) NULL,

    UNIQUE INDEX `members_PersonID_key`(`PersonID`),
    INDEX `MembershipID`(`MembershipID`),
    PRIMARY KEY (`MemberID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `member_bookings` (
    `MemberBookingID` INTEGER NOT NULL AUTO_INCREMENT,
    `MemberID` INTEGER NOT NULL,
    `BookingID` INTEGER NOT NULL,

    UNIQUE INDEX `member_bookings_MemberID_BookingID_key`(`MemberID`, `BookingID`),
    PRIMARY KEY (`MemberBookingID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `memberships` (
    `MembershipID` INTEGER NOT NULL AUTO_INCREMENT,
    `MembershipName` VARCHAR(50) NULL,
    `PricePerMonth` DECIMAL(10, 2) NULL,
    `AccessLevel` VARCHAR(50) NULL,
    `Duration` VARCHAR(50) NULL,
    `MaxClassBookings` INTEGER NULL,
    `Description` VARCHAR(255) NULL,

    PRIMARY KEY (`MembershipID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `PaymentID` INTEGER NOT NULL AUTO_INCREMENT,
    `BookingID` INTEGER NOT NULL,
    `PaymentDate` DATE NULL,
    `Amount` DECIMAL(10, 2) NULL,
    `PaymentMethod` VARCHAR(50) NULL,
    `PaymentType` VARCHAR(50) NULL,
    `Status` VARCHAR(50) NULL,

    INDEX `payments_BookingID_idx`(`BookingID`),
    PRIMARY KEY (`PaymentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productcategories` (
    `CategoryID` INTEGER NOT NULL AUTO_INCREMENT,
    `CategoryName` VARCHAR(100) NULL,
    `Description` VARCHAR(255) NULL,

    PRIMARY KEY (`CategoryID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `ProductID` INTEGER NOT NULL AUTO_INCREMENT,
    `ProductName` VARCHAR(100) NULL,
    `Description` VARCHAR(255) NULL,
    `Price` DECIMAL(10, 2) NULL,
    `StockQuantity` INTEGER NULL,
    `CategoryID` INTEGER NOT NULL,
    `PaymentID` INTEGER NULL,

    INDEX `CategoryID`(`CategoryID`),
    INDEX `PaymentID`(`PaymentID`),
    PRIMARY KEY (`ProductID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_ClassID_fkey` FOREIGN KEY (`ClassID`) REFERENCES `classes`(`ClassID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `center_products` ADD CONSTRAINT `center_products_CenterID_fkey` FOREIGN KEY (`CenterID`) REFERENCES `centers`(`CenterID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `center_products` ADD CONSTRAINT `center_products_ProductID_fkey` FOREIGN KEY (`ProductID`) REFERENCES `products`(`ProductID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes` ADD CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `employees`(`EmployeeID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `classes` ADD CONSTRAINT `classes_CenterID_fkey` FOREIGN KEY (`CenterID`) REFERENCES `centers`(`CenterID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipment` ADD CONSTRAINT `equipment_CenterID_fkey` FOREIGN KEY (`CenterID`) REFERENCES `centers`(`CenterID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_PersonID_fkey` FOREIGN KEY (`PersonID`) REFERENCES `person`(`PersonID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_JobTitleID_fkey` FOREIGN KEY (`JobTitleID`) REFERENCES `jobtitles`(`JobTitleID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_MembershipID_fkey` FOREIGN KEY (`MembershipID`) REFERENCES `memberships`(`MembershipID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_PersonID_fkey` FOREIGN KEY (`PersonID`) REFERENCES `person`(`PersonID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member_bookings` ADD CONSTRAINT `member_bookings_MemberID_fkey` FOREIGN KEY (`MemberID`) REFERENCES `members`(`MemberID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `member_bookings` ADD CONSTRAINT `member_bookings_BookingID_fkey` FOREIGN KEY (`BookingID`) REFERENCES `bookings`(`BookingID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_BookingID_fkey` FOREIGN KEY (`BookingID`) REFERENCES `bookings`(`BookingID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_CategoryID_fkey` FOREIGN KEY (`CategoryID`) REFERENCES `productcategories`(`CategoryID`) ON DELETE CASCADE ON UPDATE CASCADE;
