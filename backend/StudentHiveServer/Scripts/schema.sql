CREATE TABLE `Roles` (
  `Id` INT PRIMARY KEY AUTO_INCREMENT,
  `RoleName` VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE `Categories` (
  `Id` INT PRIMARY KEY AUTO_INCREMENT,
  `CategoryName` VARCHAR(100) UNIQUE NOT NULL,
  `ImagePath` VARCHAR(100) NOT NULL
);
INSERT INTO roles (Id, RoleName) VALUES
(1, 'Admin'),
(2, 'Organization'),
(3, 'Agent'),
(4, 'User');

INSERT INTO Categories (CategoryName, ImagePath) VALUES
('Adminisztratív, irodai', '/categories/irodai-munka.jpg'),
('Áruházi, bolti, eladói', '/categories/aruhazi-munka.jpg'),
('Fizikai, gyári, raktári', '/categories/gyari-munka.jpg'),
('Gazdasági, pénzügyi, marketing', '/categories/marketing-munka.jpg'),
('Informatikai, mérnöki, műszaki', '/categories/mernok-munka.jpg'),
('Mezőgazdasági', '/categories/mezogazdasagi-munka.jpg'),
('Mozi', '/categories/mozi-munka.jpg'),
('Telefonos munkák, értékesítés, piackutatás', '/categories/piackutatas-munka.jpg'),
('Promóciós, host/hostess, animátor', '/categories/hostess-munka.jpg'),
('Vendéglátás, gyorsétterem, idegenforgalom', '/categories/gyorsetterem-munka.jfif'),
('Egyéb', '/categories/other.jfif');
CREATE TABLE `Organizations` (
  `Id` INT PRIMARY KEY AUTO_INCREMENT,
  `Name` VARCHAR(255) NOT NULL,
  `Address` VARCHAR(255),
  `ContactEmail` VARCHAR(100),
  `ContactPhone` VARCHAR(15),
  `IsActive` BOOLEAN DEFAULT true,
  `CreatedAt` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `Users` (
  `Id` INT PRIMARY KEY AUTO_INCREMENT,
  `OrganizationId` INT,
  `RoleId` INT NOT NULL,
  `FirstName` VARCHAR(50) NOT NULL,
  `LastName` VARCHAR(50) NOT NULL,
  `Email` VARCHAR(100) UNIQUE NOT NULL,
  `PasswordHash` VARCHAR(255) NOT NULL,
  `IsActive` BOOLEAN DEFAULT true,
  `CreatedAt` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `Description` (
  `Id` INT PRIMARY KEY AUTO_INCREMENT,
  `OurOffer` TEXT NOT NULL,
  `MainTaks` TEXT NOT NULL,
  `JobRequirements` TEXT NOT NULL,
  `Advantages` TEXT NOT NULL
);

CREATE TABLE `Jobs` (
  `Id` INT PRIMARY KEY AUTO_INCREMENT,
  `OrganizationId` INT NOT NULL,
  `CategoryId` INT NOT NULL,
  `AgentId` INT,
  `DescriptionId` INT,
  `Title` VARCHAR(255) NOT NULL,
  `City` VARCHAR(50) NOT NULL,
  `Address` VARCHAR(50) NOT NULL,
  `HourlyRate` INT NOT NULL,
  `IsActive` BOOLEAN DEFAULT true,
  `CreatedAt` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `Applications` (
  `Id` INT PRIMARY KEY AUTO_INCREMENT,
  `JobId` INT NOT NULL,
  `StudentId` INT NOT NULL,
  `Status` INT NOT NULL,
  `AppliedAt` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `Shifts` (
  `Id` INT PRIMARY KEY AUTO_INCREMENT,
  `JobId` INT NOT NULL,
  `ShiftStart` DATETIME NOT NULL,
  `ShiftEnd` DATETIME NOT NULL
);

CREATE TABLE `StudentShifts` (
  `Id` INT PRIMARY KEY AUTO_INCREMENT,
  `StudentId` INT NOT NULL,
  `ShiftId` INT NOT NULL,
  `Approved` INT NOT NULL
);

CREATE TABLE `JobReviews` (
  `Id` INT PRIMARY KEY AUTO_INCREMENT,
  `JobId` INT NOT NULL,
  `ReviewerId` INT NOT NULL,
  `Rating` INT NOT NULL,
  `Comment` TEXT,
  `CreatedAt` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `studentdetails` (
  `Id` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `PhoneNumber` varchar(15) DEFAULT NULL,
  `DateOfBirth` datetime DEFAULT NULL,
  `BirthName` varchar(100) DEFAULT NULL,
  `MothersName` varchar(100) DEFAULT NULL,
  `CountryOfBirth` varchar(50) DEFAULT NULL,
  `PlaceOfBirth` varchar(100) DEFAULT NULL,
  `Gender` varchar(20) DEFAULT NULL,
  `Citizenship` varchar(50) DEFAULT NULL,
  `StudentCardNumber` varchar(20) DEFAULT NULL,
  `BankAccountNumber` varchar(30) DEFAULT NULL,
  `Country` varchar(50) DEFAULT NULL,
  `PostalCode` varchar(10) DEFAULT NULL,
  `City` varchar(50) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `SchoolName` varchar(255) DEFAULT NULL,
  `StudyStartDate` datetime DEFAULT NULL,
  `StudyEndDate` datetime DEFAULT NULL
);

CREATE TABLE `JobAssignments` (
  `Id` INT PRIMARY KEY AUTO_INCREMENT,
  `UserId` INT NOT NULL,
  `JobId` INT NOT NULL,
  `AssignedAt` TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);


CREATE UNIQUE INDEX `JobAssignments_index_0` ON `JobAssignments` (`UserId`, `JobId`);

ALTER TABLE `Users` ADD FOREIGN KEY (`OrganizationId`) REFERENCES `Organizations` (`Id`);

ALTER TABLE `Users` ADD FOREIGN KEY (`RoleId`) REFERENCES `Roles` (`Id`);

ALTER TABLE `Jobs` ADD FOREIGN KEY (`DescriptionId`) REFERENCES `Description` (`Id`);

ALTER TABLE `Jobs` ADD FOREIGN KEY (`CategoryId`) REFERENCES `Categories` (`Id`);

ALTER TABLE `Jobs` ADD FOREIGN KEY (`OrganizationId`) REFERENCES `Organizations` (`Id`);

ALTER TABLE `Jobs` ADD FOREIGN KEY (`AgentId`) REFERENCES `Users` (`Id`);

ALTER TABLE `Applications` ADD FOREIGN KEY (`JobId`) REFERENCES `Jobs` (`Id`);

ALTER TABLE `Applications` ADD FOREIGN KEY (`StudentId`) REFERENCES `Users` (`Id`);

ALTER TABLE `Shifts` ADD FOREIGN KEY (`JobId`) REFERENCES `Jobs` (`Id`);

ALTER TABLE `StudentShifts` ADD FOREIGN KEY (`ShiftId`) REFERENCES `Shifts` (`Id`);

ALTER TABLE `StudentShifts` ADD FOREIGN KEY (`StudentId`) REFERENCES `Users` (`Id`);

ALTER TABLE `JobReviews` ADD FOREIGN KEY (`JobId`) REFERENCES `Jobs` (`Id`);

ALTER TABLE `JobReviews` ADD FOREIGN KEY (`ReviewerId`) REFERENCES `Users` (`Id`);

ALTER TABLE `StudentDetails` ADD FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE;

ALTER TABLE `JobAssignments` ADD FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE CASCADE;

ALTER TABLE `JobAssignments` ADD FOREIGN KEY (`JobId`) REFERENCES `Jobs` (`Id`) ON DELETE CASCADE;

