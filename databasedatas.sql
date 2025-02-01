

INSERT INTO `Users` (`OrganizationId`, `RoleId`, `FirstName`, `LastName`, `Email`, `PasswordHash`)
VALUES (NULL, 1, 'Admin', 'User', 'admin@domain.com', '$2a$11$mqnkjwfQykPQZCf/yP29XuevK1ESD2QwPqY2085FAdECTG/12G2wW');

-- Szervezetek hozzáadása
INSERT INTO `Organizations` (`Name`, `Address`, `ContactEmail`, `ContactPhone`)
VALUES 
('Szervezet A', 'Szervezet A cím 1', 'contactA@domain.com', '987654321'),
('Szervezet B', 'Szervezet B cím 2', 'contactB@domain.com', '123456789');

-- Felhasználók hozzáadása
INSERT INTO `Users` (`OrganizationId`, `RoleId`, `FirstName`, `LastName`, `Email`, `PasswordHash`)
VALUES 
(1, 2, 'Organization', 'User A', 'orguserA@domain.com', '$2a$11$mqnkjwfQykPQZCf/yP29XuevK1ESD2QwPqY2085FAdECTG/12G2wW'),
(2, 2, 'Organization', 'User B', 'orguserB@domain.com', '$2a$11$mqnkjwfQykPQZCf/yP29XuevK1ESD2QwPqY2085FAdECTG/12G2wW');

-- Leírások hozzáadása
INSERT INTO `Description` (`OurOffer`, `MainTaks`, `JobRequirements`, `Advantages`)
VALUES 
('Kiemelkedő munkahelyi környezetet biztosítunk.', 'Az eladó feladata az áruk eladása, a bolt rendben tartása.', 'Rendelkezzen alapvető kommunikációs készségekkel.', 'Rugalmasság és bónusz lehetőség.');

-- Munkák hozzáadása
INSERT INTO `Jobs` (`OrganizationId`, `CategoryId`, `AgentId`, `DescriptionId`, `Title`, `City`, `Address`, `HourlyRate`)
VALUES 
(1, 2, NULL, LAST_INSERT_ID(), 'Eladó', 'Budapest', 'Fő utca 12.', 1500),
(1, 2, NULL, LAST_INSERT_ID(), 'Raktáros', 'Budapest', 'Fő utca 12.', 1600),
(1, 2, NULL, LAST_INSERT_ID(), 'Ügyfélszolgálatos', 'Budapest', 'Fő utca 12.', 1700);

-- Leírások hozzáadása
INSERT INTO `Description` (`OurOffer`, `MainTaks`, `JobRequirements`, `Advantages`)
VALUES 
('Rugalmas munkaidőt és versenyképes bérezést kínálunk.', 'A munkavállaló felelős lesz a termékek kiszállításáért és a raktár kezeléseért.', 'Jó fizikai állapot és csapatmunka készség szükséges.', 'Szuper csapat és fejlődési lehetőségek.');

-- Munkák hozzáadása
INSERT INTO `Jobs` (`OrganizationId`, `CategoryId`, `AgentId`, `DescriptionId`, `Title`, `City`, `Address`, `HourlyRate`)
VALUES 
(2, 3, NULL, LAST_INSERT_ID(), 'Kiszállító', 'Budapest', 'Kossuth utca 45.', 1800),
(2, 3, NULL, LAST_INSERT_ID(), 'Raktáros', 'Budapest', 'Kossuth utca 45.', 1600),
(2, 3, NULL, LAST_INSERT_ID(), 'Szállítmányozási koordinátor', 'Budapest', 'Kossuth utca 45.', 1900);

INSERT INTO `Users` (`OrganizationId`, `RoleId`, `FirstName`, `LastName`, `Email`, `PasswordHash`)
VALUES 
(1, 3, 'Agent', 'A1', 'agentA1@domain.com', '$2a$11$mqnkjwfQykPQZCf/yP29XuevK1ESD2QwPqY2085FAdECTG/12G2wW'),
(1, 3, 'Agent', 'A2', 'agentA2@domain.com', '$2a$11$mqnkjwfQykPQZCf/yP29XuevK1ESD2QwPqY2085FAdECTG/12G2wW');

INSERT INTO `Users` (`OrganizationId`, `RoleId`, `FirstName`, `LastName`, `Email`, `PasswordHash`)
VALUES 
(2, 3, 'Agent', 'B1', 'agentB1@domain.com', '$2a$11$mqnkjwfQykPQZCf/yP29XuevK1ESD2QwPqY2085FAdECTG/12G2wW'),
(2, 3, 'Agent', 'B2', 'agentB2@domain.com', '$2a$11$mqnkjwfQykPQZCf/yP29XuevK1ESD2QwPqY2085FAdECTG/12G2wW');

