-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Jan 06. 18:16
-- Kiszolgáló verziója: 10.4.28-MariaDB
-- PHP verzió: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `studenthive`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `applications`
--

CREATE TABLE `applications` (
  `Id` int(11) NOT NULL,
  `JobId` int(11) NOT NULL,
  `StudentId` int(11) NOT NULL,
  `Status` enum('Pending','Accepted','Rejected') DEFAULT 'Pending',
  `AppliedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `history`
--

CREATE TABLE `history` (
  `Id` int(11) NOT NULL,
  `StudentId` int(11) NOT NULL,
  `JobId` int(11) NOT NULL,
  `StartDate` date NOT NULL,
  `EndDate` date NOT NULL,
  `PerformanceRating` int(11) NOT NULL DEFAULT 0,
  `Feedback` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `jobreviews`
--

CREATE TABLE `jobreviews` (
  `Id` int(11) NOT NULL,
  `JobId` int(11) NOT NULL,
  `ReviewerId` int(11) NOT NULL,
  `Rating` int(11) NOT NULL,
  `Comment` text DEFAULT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `jobs`
--

CREATE TABLE `jobs` (
  `Id` int(11) NOT NULL,
  `OrganizationId` int(11) NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Category` varchar(255) NOT NULL,
  `Location` varchar(120) NOT NULL,
  `Description` text NOT NULL,
  `HourlyRate` decimal(5,2) NOT NULL,
  `ImagePath` varchar(255) DEFAULT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `organizations`
--

CREATE TABLE `organizations` (
  `Id` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `ContactEmail` varchar(100) DEFAULT NULL,
  `ContactPhone` varchar(15) DEFAULT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `roles`
--

CREATE TABLE `roles` (
  `Id` int(11) NOT NULL,
  `RoleName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `roles`
--

INSERT INTO `roles` (`Id`, `RoleName`) VALUES
(1, 'Admin'),
(3, 'Agent'),
(2, 'Organization'),
(4, 'User');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `shifts`
--

CREATE TABLE `shifts` (
  `Id` int(11) NOT NULL,
  `JobId` int(11) NOT NULL,
  `Date` date NOT NULL,
  `ShiftStart` time NOT NULL,
  `ShiftEnd` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `studentdetails`
--

CREATE TABLE `studentdetails` (
  `Id` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `PhoneNumber` varchar(15) NOT NULL,
  `DateOfBirth` date NOT NULL,
  `BirthName` varchar(100) NOT NULL,
  `MothersName` varchar(100) NOT NULL,
  `CountryOfBirth` varchar(50) NOT NULL,
  `PlaceOfBirth` varchar(100) NOT NULL,
  `Gender` enum('Male','Female','Other') NOT NULL,
  `Citizenship` varchar(50) NOT NULL,
  `TAJNumber` char(9) NOT NULL,
  `StudentCardNumber` varchar(20) NOT NULL,
  `TaxIdentificationNumber` char(10) NOT NULL,
  `BankAccountNumber` varchar(30) NOT NULL,
  `Country` varchar(50) NOT NULL,
  `PostalCode` varchar(10) NOT NULL,
  `City` varchar(50) NOT NULL,
  `Address` varchar(255) NOT NULL,
  `SchoolName` varchar(255) NOT NULL,
  `StudyStartDate` date NOT NULL,
  `StudyEndDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `studentshifts`
--

CREATE TABLE `studentshifts` (
  `Id` int(11) NOT NULL,
  `StudentId` int(11) NOT NULL,
  `ShiftId` int(11) NOT NULL,
  `Approved` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `Id` int(11) NOT NULL,
  `OrganizationId` int(11) DEFAULT NULL,
  `RoleId` int(11) NOT NULL,
  `FirstName` varchar(50) NOT NULL,
  `LastName` varchar(50) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;


--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `JobId` (`JobId`),
  ADD KEY `StudentId` (`StudentId`);

--
-- A tábla indexei `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `StudentId` (`StudentId`),
  ADD KEY `JobId` (`JobId`);

--
-- A tábla indexei `jobreviews`
--
ALTER TABLE `jobreviews`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `JobId` (`JobId`),
  ADD KEY `ReviewerId` (`ReviewerId`);

--
-- A tábla indexei `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `OrganizationId` (`OrganizationId`);

--
-- A tábla indexei `organizations`
--
ALTER TABLE `organizations`
  ADD PRIMARY KEY (`Id`);

--
-- A tábla indexei `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `RoleName` (`RoleName`);

--
-- A tábla indexei `shifts`
--
ALTER TABLE `shifts`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `JobId` (`JobId`);

--
-- A tábla indexei `studentdetails`
--
ALTER TABLE `studentdetails`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `TAJNumber` (`TAJNumber`),
  ADD UNIQUE KEY `StudentCardNumber` (`StudentCardNumber`),
  ADD UNIQUE KEY `TaxIdentificationNumber` (`TaxIdentificationNumber`),
  ADD KEY `UserId` (`UserId`);

--
-- A tábla indexei `studentshifts`
--
ALTER TABLE `studentshifts`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `ShiftId` (`ShiftId`),
  ADD KEY `StudentId` (`StudentId`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD KEY `OrganizationId` (`OrganizationId`),
  ADD KEY `RoleId` (`RoleId`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `applications`
--
ALTER TABLE `applications`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `history`
--
ALTER TABLE `history`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `jobreviews`
--
ALTER TABLE `jobreviews`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `jobs`
--
ALTER TABLE `jobs`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `organizations`
--
ALTER TABLE `organizations`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `roles`
--
ALTER TABLE `roles`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `shifts`
--
ALTER TABLE `shifts`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `studentdetails`
--
ALTER TABLE `studentdetails`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `studentshifts`
--
ALTER TABLE `studentshifts`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`JobId`) REFERENCES `jobs` (`Id`),
  ADD CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`StudentId`) REFERENCES `users` (`Id`);

--
-- Megkötések a táblához `history`
--
ALTER TABLE `history`
  ADD CONSTRAINT `history_ibfk_1` FOREIGN KEY (`StudentId`) REFERENCES `users` (`Id`),
  ADD CONSTRAINT `history_ibfk_2` FOREIGN KEY (`JobId`) REFERENCES `jobs` (`Id`);

--
-- Megkötések a táblához `jobreviews`
--
ALTER TABLE `jobreviews`
  ADD CONSTRAINT `jobreviews_ibfk_1` FOREIGN KEY (`JobId`) REFERENCES `jobs` (`Id`),
  ADD CONSTRAINT `jobreviews_ibfk_2` FOREIGN KEY (`ReviewerId`) REFERENCES `users` (`Id`);

--
-- Megkötések a táblához `jobs`
--
ALTER TABLE `jobs`
  ADD CONSTRAINT `jobs_ibfk_1` FOREIGN KEY (`OrganizationId`) REFERENCES `organizations` (`Id`);

--
-- Megkötések a táblához `shifts`
--
ALTER TABLE `shifts`
  ADD CONSTRAINT `shifts_ibfk_1` FOREIGN KEY (`JobId`) REFERENCES `jobs` (`Id`);

--
-- Megkötések a táblához `studentdetails`
--
ALTER TABLE `studentdetails`
  ADD CONSTRAINT `studentdetails_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `studentshifts`
--
ALTER TABLE `studentshifts`
  ADD CONSTRAINT `studentshifts_ibfk_1` FOREIGN KEY (`ShiftId`) REFERENCES `shifts` (`Id`),
  ADD CONSTRAINT `studentshifts_ibfk_2` FOREIGN KEY (`StudentId`) REFERENCES `users` (`Id`);

--
-- Megkötések a táblához `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`OrganizationId`) REFERENCES `organizations` (`Id`),
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`RoleId`) REFERENCES `roles` (`Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
