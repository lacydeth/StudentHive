INSERT INTO `organizations` (`Id`, `Name`, `Address`, `ContactEmail`, `ContactPhone`, `IsActive`, `CreatedAt`) VALUES
(2, 'MelóDiák Iskolaszövetkezet', 'Debrecen, Piac utca 22.', 'melodiak@ex.com', '+36705357145', 1, '2025-03-28 16:50:33'),
(5, 'Jóker Iskolaszövetkezet', 'Debrecen, Széchényi utca 21.', 'joker@ex.com', '+36701234453', 1, '2025-03-30 19:07:40');

INSERT INTO users (Id, OrganizationId, RoleId, FirstName, LastName, Email, PasswordHash, IsActive, CreatedAt) VALUES
(1, NULL, 1, 'Kristóf', 'Nagy', 'admin@ex.com', '$2a$11$wZMm6G1Ie8kGzkR2JqOo1uHSakw5oZ3pNOi6rPRyHk6ezb8jQQpFK', 1, '2025-03-28 16:49:16'),
(2, 2, 2, 'Organization', 'MelóDiák Iskolaszövetkezet', 'melodiak@ex.com', '$2a$11$1jAw0PHWLONmH8p5OQTicOc5TP37rdd0N0YdRaRWMHwo2bytU0pei', 1, '2025-03-28 16:50:33'),
(3, 2, 3, 'Éva', 'Fogarasi', 'fogarasi@ex.com', '$2a$11$Qja1.J9kgJE5bX6/HVIDM.P.kVowhdKXMqbEqlT2OLF50GRDS/IsC', 1, '2025-03-28 16:52:55'),
(4, NULL, 4, 'László', 'Bánkuti', 'user@ex.com', '$2a$11$0biOaGdioNaMkitfb3zz0eoFb7JUNODOEC.vHUb.Wd1JQDkGArfb2', 1, '2025-03-28 16:56:51'),
(5, 5, 2, 'Organization', 'Jóker Iskolaszövetkezet', 'joker@ex.com', '$2a$11$OJhNeqCAjMfcjaTQMrr1j.tUlrh40VVGIiv23sV/ScUx0IegsR09q', 1, '2025-03-30 19:07:40'),
(6, 5, 3, 'István', 'Tóth', 'toth@ex.com', '$2a$11$MgrDNOzbqvOosOUHJPkiA.WHAqBac3X4CduiSDd2aNUc3bJ316VHu', 1, '2025-03-30 19:08:12'),
(7, NULL, 4, 'Imre', 'Kiss', 'user2@ex.com', '$2a$11$/.pFr43Js3pd/dnmOqRfoOKhv5WBqg/MTxuuj79o0aSKRP1CdOa1u', 1, '2025-03-30 19:11:28');

INSERT INTO `description` (`Id`, `OurOffer`, `MainTaks`, `JobRequirements`, `Advantages`) VALUES
(1, 'Kiemelkedő fizetés', 'Csomagok mozgatása', 'Jó fizikum, állóképesség', 'Nagy ráérés'),
(2, 'Fiatalos csapat', 'Vendégek kiszolgálása', 'Rendezett megjelenés', 'Vendéglátós tapasztalat'),
(3, 'Étkezési lehetőség', 'Jegyek ellenőrzése, vendégek koordinálása', 'Angol nyelvtudás', 'Nagy ráérés'),
(4, 'Vízfogyasztási lehetőség', 'Csomagolás', 'Munkavédelmi cipő', 'Érettségi'),
(5, '-', 'Popcorn csomagolása, válogatása', 'Precizitás ', 'Éjszakai munkavégzés előnyben');

INSERT INTO `jobs` (`Id`, `OrganizationId`, `CategoryId`, `AgentId`, `DescriptionId`, `Title`, `City`, `Address`, `HourlyRate`, `IsActive`, `CreatedAt`) VALUES
(1, 2, 3, 3, 1, 'Árupakolás', 'Debrecen', 'Határ út, 44.', 1960, 1, '2025-03-28 16:54:14'),
(2, 5, 10, 6, 2, 'Pultos munka', 'Hajdúhadház', 'Újrét utca, 10.', 2200, 1, '2025-03-30 19:09:39'),
(3, 5, 7, 6, 3, 'Jegyszedő', 'Debrecen', 'Piac utca 121.', 1620, 1, '2025-03-30 19:10:34'),
(4, 2, 3, 3, 4, 'Nyomdai kisegítés', 'Debrecen', 'Nagy utca, 33', 2300, 1, '2025-03-31 11:22:03'),
(5, 2, 3, 3, 5, 'Popcorn gyári munka', 'Budapest', 'Busz út, 35.', 1620, 1, '2025-03-31 11:23:33');

INSERT INTO `shifts` (`Id`, `JobId`, `ShiftStart`, `ShiftEnd`) VALUES
(1, 1, '2025-03-31 14:00:00', '2025-03-31 22:00:00'),
(2, 5, '2025-05-29 14:00:00', '2025-05-29 22:00:00'),
(3, 4, '2025-05-29 14:00:00', '2025-05-29 22:00:00');

INSERT INTO `applications` (`Id`, `JobId`, `StudentId`, `Status`, `AppliedAt`) VALUES
(1, 1, 4, 1, '2025-03-28 16:57:09'),
(2, 3, 7, 1, '2025-03-30 19:11:39'),
(3, 2, 7, 2, '2025-03-30 19:11:42'),
(4, 4, 7, 0, '2025-03-31 11:29:36');

INSERT INTO `jobassignments` (`Id`, `UserId`, `JobId`, `AssignedAt`) VALUES
(1, 4, 1, '2025-03-28 16:57:40'),
(2, 7, 3, '2025-03-30 19:11:58');

INSERT INTO `studentdetails` (`Id`, `UserId`, `PhoneNumber`, `DateOfBirth`, `BirthName`, `MothersName`, `CountryOfBirth`, `PlaceOfBirth`, `Gender`, `Citizenship`, `StudentCardNumber`, `BankAccountNumber`, `Country`, `PostalCode`, `City`, `Address`, `SchoolName`, `StudyStartDate`, `StudyEndDate`) VALUES
(1, 4, '', NULL, '', '', '', '', '', '', NULL, '123456781234567812345678', '', '', '', '', '', NULL, NULL),
(2, 7, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

INSERT INTO `studentshifts` (`Id`, `StudentId`, `ShiftId`, `Approved`) VALUES
(1, 4, 1, 0);
