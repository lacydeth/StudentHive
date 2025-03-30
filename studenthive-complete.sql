-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Már 30. 21:17
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
  `Status` int(11) NOT NULL,
  `AppliedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `applications`
--

INSERT INTO `applications` (`Id`, `JobId`, `StudentId`, `Status`, `AppliedAt`) VALUES
(1, 1, 4, 1, '2025-03-28 16:57:09'),
(2, 3, 7, 1, '2025-03-30 19:11:39'),
(3, 2, 7, 2, '2025-03-30 19:11:42');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `categories`
--

CREATE TABLE `categories` (
  `Id` int(11) NOT NULL,
  `CategoryName` varchar(100) NOT NULL,
  `ImagePath` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `categories`
--

INSERT INTO `categories` (`Id`, `CategoryName`, `ImagePath`) VALUES
(1, 'Adminisztratív, irodai', '/categories/irodai-munka.jpg'),
(2, 'Áruházi, bolti, eladói', '/categories/aruhazi-munka.jpg'),
(3, 'Fizikai, gyári, raktári', '/categories/gyari-munka.jpg'),
(4, 'Gazdasági, pénzügyi, marketing', '/categories/marketing-munka.jpg'),
(5, 'Informatikai, mérnöki, műszaki', '/categories/mernok-munka.jpg'),
(6, 'Mezőgazdasági', '/categories/mezogazdasagi-munka.jpg'),
(7, 'Mozi', '/categories/mozi-munka.jpg'),
(8, 'Telefonos munkák, értékesítés, piackutatás', '/categories/piackutatas-munka.jpg'),
(9, 'Promóciós, host/hostess, animátor', '/categories/hostess-munka.jpg'),
(10, 'Vendéglátás, gyorsétterem, idegenforgalom', '/categories/gyorsetterem-munka.jfif'),
(11, 'Egyéb', '/categories/other.jfif');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `description`
--

CREATE TABLE `description` (
  `Id` int(11) NOT NULL,
  `OurOffer` text NOT NULL,
  `MainTaks` text NOT NULL,
  `JobRequirements` text NOT NULL,
  `Advantages` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `description`
--

INSERT INTO `description` (`Id`, `OurOffer`, `MainTaks`, `JobRequirements`, `Advantages`) VALUES
(1, 'Kiemelkedő fizetés', 'Csomagok mozgatása', 'Jó fizikum, állóképesség', 'Nagy ráérés\n'),
(2, 'Fiatalos csapat', 'Vendégek kiszolgálása', 'Rendezett megjelenés', 'Vendéglátós tapasztalat'),
(3, 'Étkezési lehetőség', 'Jegyek ellenőrzése, vendégek koordinálása', 'Angol nyelvtudás', 'Nagy ráérés');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `jobassignments`
--

CREATE TABLE `jobassignments` (
  `Id` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `JobId` int(11) NOT NULL,
  `AssignedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `jobassignments`
--

INSERT INTO `jobassignments` (`Id`, `UserId`, `JobId`, `AssignedAt`) VALUES
(1, 4, 1, '2025-03-28 16:57:40'),
(2, 7, 3, '2025-03-30 19:11:58');

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
  `CategoryId` int(11) NOT NULL,
  `AgentId` int(11) DEFAULT NULL,
  `DescriptionId` int(11) DEFAULT NULL,
  `Title` varchar(255) NOT NULL,
  `City` varchar(50) NOT NULL,
  `Address` varchar(50) NOT NULL,
  `HourlyRate` int(11) NOT NULL,
  `IsActive` tinyint(1) DEFAULT 1,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `jobs`
--

INSERT INTO `jobs` (`Id`, `OrganizationId`, `CategoryId`, `AgentId`, `DescriptionId`, `Title`, `City`, `Address`, `HourlyRate`, `IsActive`, `CreatedAt`) VALUES
(1, 2, 3, 3, 1, 'Árupakolás', 'Debrecen', 'Határ út, 44.', 1960, 1, '2025-03-28 16:54:14'),
(2, 5, 10, 6, 2, 'Pultos munka', 'Hajdúhadház', 'Újrét utca, 10.', 2200, 1, '2025-03-30 19:09:39'),
(3, 5, 7, 6, 3, 'Jegyszedő', 'Debrecen', 'Piac utca 121.', 1620, 1, '2025-03-30 19:10:34');

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
  `IsActive` tinyint(1) DEFAULT 1,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `organizations`
--

INSERT INTO `organizations` (`Id`, `Name`, `Address`, `ContactEmail`, `ContactPhone`, `IsActive`, `CreatedAt`) VALUES
(2, 'MelóDiák Iskolaszövetkezet', 'Debrecen, Piac utca 22.', 'melodiak@ex.com', '+36705357145', 1, '2025-03-28 16:50:33'),
(5, 'Jóker Iskolaszövetkezet', 'Debrecen, Széchényi utca 21.', 'joker@ex.com', '+36701234453', 1, '2025-03-30 19:07:40');

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
  `ShiftStart` datetime NOT NULL,
  `ShiftEnd` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `shifts`
--

INSERT INTO `shifts` (`Id`, `JobId`, `ShiftStart`, `ShiftEnd`) VALUES
(1, 1, '2025-03-31 14:00:00', '2025-03-31 22:00:00');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `studentdetails`
--

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `studentdetails`
--

INSERT INTO `studentdetails` (`Id`, `UserId`, `PhoneNumber`, `DateOfBirth`, `BirthName`, `MothersName`, `CountryOfBirth`, `PlaceOfBirth`, `Gender`, `Citizenship`, `StudentCardNumber`, `BankAccountNumber`, `Country`, `PostalCode`, `City`, `Address`, `SchoolName`, `StudyStartDate`, `StudyEndDate`) VALUES
(0, 4, '', NULL, '', '', '', '', '', '', NULL, '123456781234567812345678', '', '', '', '', '', NULL, NULL),
(0, 7, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `studentshifts`
--

CREATE TABLE `studentshifts` (
  `Id` int(11) NOT NULL,
  `StudentId` int(11) NOT NULL,
  `ShiftId` int(11) NOT NULL,
  `Approved` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `studentshifts`
--

INSERT INTO `studentshifts` (`Id`, `StudentId`, `ShiftId`, `Approved`) VALUES
(1, 4, 1, 0);

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
  `IsActive` tinyint(1) DEFAULT 1,
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`Id`, `OrganizationId`, `RoleId`, `FirstName`, `LastName`, `Email`, `PasswordHash`, `IsActive`, `CreatedAt`) VALUES
(1, NULL, 1, 'Kristóf', 'Nagy', 'admin@ex.com', '$2a$11$wZMm6G1Ie8kGzkR2JqOo1uHSakw5oZ3pNOi6rPRyHk6ezb8jQQpFK', 1, '2025-03-28 16:49:16'),
(2, 2, 2, 'Organization', 'MelóDiák Iskolaszövetkezet', 'melodiak@ex.com', '$2a$11$1jAw0PHWLONmH8p5OQTicOc5TP37rdd0N0YdRaRWMHwo2bytU0pei', 1, '2025-03-28 16:50:33'),
(3, 2, 3, 'Éva', 'Fogarasi', 'fogarasi@ex.com', '$2a$11$Qja1.J9kgJE5bX6/HVIDM.P.kVowhdKXMqbEqlT2OLF50GRDS/IsC', 1, '2025-03-28 16:52:55'),
(4, NULL, 4, 'László', 'Bánkuti', 'user@ex.com', '$2a$11$0biOaGdioNaMkitfb3zz0eoFb7JUNODOEC.vHUb.Wd1JQDkGArfb2', 1, '2025-03-28 16:56:51'),
(5, 5, 2, 'Organization', 'Jóker Iskolaszövetkezet', 'joker@ex.com', '$2a$11$OJhNeqCAjMfcjaTQMrr1j.tUlrh40VVGIiv23sV/ScUx0IegsR09q', 1, '2025-03-30 19:07:40'),
(6, 5, 3, 'István', 'Tóth', 'toth@ex.com', '$2a$11$MgrDNOzbqvOosOUHJPkiA.WHAqBac3X4CduiSDd2aNUc3bJ316VHu', 1, '2025-03-30 19:08:12'),
(7, NULL, 4, 'Imre', 'Kiss', 'user2@ex.com', '$2a$11$/.pFr43Js3pd/dnmOqRfoOKhv5WBqg/MTxuuj79o0aSKRP1CdOa1u', 1, '2025-03-30 19:11:28');

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
-- A tábla indexei `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `CategoryName` (`CategoryName`);

--
-- A tábla indexei `description`
--
ALTER TABLE `description`
  ADD PRIMARY KEY (`Id`);

--
-- A tábla indexei `jobassignments`
--
ALTER TABLE `jobassignments`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `JobAssignments_index_0` (`UserId`,`JobId`),
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
  ADD KEY `DescriptionId` (`DescriptionId`),
  ADD KEY `CategoryId` (`CategoryId`),
  ADD KEY `OrganizationId` (`OrganizationId`),
  ADD KEY `AgentId` (`AgentId`);

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
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `categories`
--
ALTER TABLE `categories`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT a táblához `description`
--
ALTER TABLE `description`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `jobassignments`
--
ALTER TABLE `jobassignments`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `jobreviews`
--
ALTER TABLE `jobreviews`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `jobs`
--
ALTER TABLE `jobs`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `organizations`
--
ALTER TABLE `organizations`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `roles`
--
ALTER TABLE `roles`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `shifts`
--
ALTER TABLE `shifts`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `studentshifts`
--
ALTER TABLE `studentshifts`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
-- Megkötések a táblához `jobassignments`
--
ALTER TABLE `jobassignments`
  ADD CONSTRAINT `jobassignments_ibfk_1` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `jobassignments_ibfk_2` FOREIGN KEY (`JobId`) REFERENCES `jobs` (`Id`) ON DELETE CASCADE;

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
  ADD CONSTRAINT `jobs_ibfk_1` FOREIGN KEY (`DescriptionId`) REFERENCES `description` (`Id`),
  ADD CONSTRAINT `jobs_ibfk_2` FOREIGN KEY (`CategoryId`) REFERENCES `categories` (`Id`),
  ADD CONSTRAINT `jobs_ibfk_3` FOREIGN KEY (`OrganizationId`) REFERENCES `organizations` (`Id`),
  ADD CONSTRAINT `jobs_ibfk_4` FOREIGN KEY (`AgentId`) REFERENCES `users` (`Id`);

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
