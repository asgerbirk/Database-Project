-- CreateTable
CREATE TABLE `bookings` (
    `BookingID` INTEGER NOT NULL AUTO_INCREMENT,
    `MemberID` INTEGER NULL,
    `ClassID` INTEGER NULL,
    `BookingDate` DATE NULL,
    `Status` VARCHAR(50) NULL,

    INDEX `ClassID`(`ClassID`),
    INDEX `MemberID`(`MemberID`),
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
CREATE TABLE `classes` (
    `ClassID` INTEGER NOT NULL AUTO_INCREMENT,
    `ClassName` VARCHAR(100) NULL,
    `Description` VARCHAR(255) NULL,
    `ClassType` VARCHAR(50) NULL,
    `Duration` INTEGER NULL,
    `MaxParticipants` INTEGER NULL,
    `EmployeeID` INTEGER NULL,
    `ScheduleDate` DATE NULL,
    `StartTime` TIME(0) NULL,
    `EndTime` TIME(0) NULL,

    INDEX `EmployeeID`(`EmployeeID`),
    PRIMARY KEY (`ClassID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `departments` (
    `DepartmentID` INTEGER NOT NULL AUTO_INCREMENT,
    `DepartmentName` VARCHAR(100) NULL,
    `ManagerID` INTEGER NULL,

    INDEX `ManagerID`(`ManagerID`),
    PRIMARY KEY (`DepartmentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees` (
    `EmployeeID` INTEGER NOT NULL AUTO_INCREMENT,
    `PersonId` INTEGER NULL,
    `HireDate` DATE NULL,
    `JobTitleID` INTEGER NULL,
    `DepartmentID` INTEGER NULL,
    `Salary` DECIMAL(10, 2) NULL,
    `EmploymentStatus` VARCHAR(50) NULL,

    INDEX `DepartmentID`(`DepartmentID`),
    INDEX `JobTitleID`(`JobTitleID`),
    INDEX `PersonId`(`PersonId`),
    PRIMARY KEY (`EmployeeID`)
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
    `CenterID` INTEGER NULL,

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
CREATE TABLE `members` (
    `MemberID` INTEGER NOT NULL AUTO_INCREMENT,
    `PersonId` INTEGER NULL,
    `JoinDate` DATE NULL,
    `MembershipID` INTEGER NULL,
    `EmergencyContact` VARCHAR(15) NULL,

    INDEX `MembershipID`(`MembershipID`),
    INDEX `PersonId`(`PersonId`),
    PRIMARY KEY (`MemberID`)
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
    `MemberID` INTEGER NULL,
    `PaymentDate` DATE NULL,
    `Amount` DECIMAL(10, 2) NULL,
    `PaymentMethod` VARCHAR(50) NULL,
    `PaymentType` VARCHAR(50) NULL,
    `Status` VARCHAR(50) NULL,

    INDEX `MemberID`(`MemberID`),
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
    `CategoryID` INTEGER NULL,
    `PaymentID` INTEGER NULL,

    INDEX `CategoryID`(`CategoryID`),
    INDEX `PaymentID`(`PaymentID`),
    PRIMARY KEY (`ProductID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `person` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `FirstName` VARCHAR(100) NULL,
    `LastName` VARCHAR(100) NULL,
    `Email` VARCHAR(100) NULL,
    `Phone` VARCHAR(15) NULL,
    `Address` VARCHAR(255) NULL,
    `DateOfBirth` DATE NULL,

    UNIQUE INDEX `Email`(`Email`),
    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`MemberID`) REFERENCES `members`(`MemberID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`ClassID`) REFERENCES `classes`(`ClassID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `classes` ADD CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `employees`(`EmployeeID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `departments` ADD CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`ManagerID`) REFERENCES `employees`(`EmployeeID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_ibfk_3` FOREIGN KEY (`PersonId`) REFERENCES `person`(`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`JobTitleID`) REFERENCES `jobtitles`(`JobTitleID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `employees` ADD CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`DepartmentID`) REFERENCES `departments`(`DepartmentID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `equipment` ADD CONSTRAINT `equipment_ibfk_1` FOREIGN KEY (`CenterID`) REFERENCES `centers`(`CenterID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_ibfk_1` FOREIGN KEY (`MembershipID`) REFERENCES `memberships`(`MembershipID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_ibfk_2` FOREIGN KEY (`PersonId`) REFERENCES `person`(`Id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`MemberID`) REFERENCES `members`(`MemberID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`CategoryID`) REFERENCES `productcategories`(`CategoryID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`PaymentID`) REFERENCES `payments`(`PaymentID`) ON DELETE NO ACTION ON UPDATE NO ACTION;
