-- CreateTable
CREATE TABLE `audit_logs` (
    `AuditID` INTEGER NOT NULL AUTO_INCREMENT,
    `TableName` VARCHAR(100) NULL,
    `Action` VARCHAR(50) NULL,
    `Before_data` TEXT NULL,
    `After_data` TEXT NULL,
    `Changed_by` INTEGER NULL,
    `ChangedDate` DATETIME NULL,

    PRIMARY KEY (`AuditID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
