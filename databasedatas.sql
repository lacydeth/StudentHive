
-- Organization 1
INSERT INTO `Organizations` (`Name`, `Address`, `ContactEmail`, `ContactPhone`)
VALUES
('Tech Solutions', 'Budapest, Fő utca 12', 'info@techsolutions.hu', '0612345678'),
-- Organization 2
('Creative Agency', 'Debrecen, Kossuth Lajos utca 45', 'contact@creativeagency.hu', '0620123456'),
-- Organization 3
('Munkavállaló Kft.', 'Szeged, Petőfi utca 10', 'hello@munkavallalo.hu', '0630555123');

-- Admin felhasználó
INSERT INTO `Users` (`OrganizationId`, `RoleId`, `FirstName`, `LastName`, `Email`, `PasswordHash`)
VALUES
(1, 1, 'János', 'Kovács', 'janos.kovacs@admin.hu', '$2a$11$2xUzPD4M9vbbXkSOHIVJbumT1O94PS8BpEZJtScPH7ANYdrHQgToy'), 
-- Agent 1
(1, 2, 'László', 'Szabó', 'laszlo.szabo@agent.hu', '$2a$11$2xUzPD4M9vbbXkSOHIVJbumT1O94PS8BpEZJtScPH7ANYdrHQgToy'),
-- Agent 2
(1, 2, 'Péter', 'Tóth', 'peter.toth@agent.hu', '$2a$11$2xUzPD4M9vbbXkSOHIVJbumT1O94PS8BpEZJtScPH7ANYdrHQgToy'),
-- Agent 3
(1, 2, 'Mária', 'Nagy', 'maria.nagy@agent.hu', '$2a$11$2xUzPD4M9vbbXkSOHIVJbumT1O94PS8BpEZJtScPH7ANYdrHQgToy'),
-- User 1
(2, 4, 'Zoltán', 'Horváth', 'zoltan.horvath@user.hu', '$2a$11$2xUzPD4M9vbbXkSOHIVJbumT1O94PS8BpEZJtScPH7ANYdrHQgToy'),
-- User 2
(3, 4, 'Anita', 'Varga', 'anita.varga@user.hu', '$2a$11$2xUzPD4M9vbbXkSOHIVJbumT1O94PS8BpEZJtScPH7ANYdrHQgToy');



-- Description 1
INSERT INTO `Description` (`OurOffer`, `MainTaks`, `JobRequirements`, `Advantages`)
VALUES
('Kínálunk versenyképes órabért és dinamikus munkakörnyezetet.',
 'Feladatod lesz a napi irodai adminisztratív munkák ellátása.',
 'Elvárásaink között szerepel a jó kommunikációs készség és a precíz munkavégzés.',
 'A munkaidő rugalmas, és home office lehetőség is adott.'),
-- Description 2
('Kellemes munkakörnyezet és a csapatmunka támogatása.',
 'A feladatok közé tartozik az eladói tevékenység, vásárlók kiszolgálása.',
 'Képesség a jó kapcsolatok kiépítésére és fenntartására szükséges.',
 'Jó csapat és teljesítmény alapján bónuszok.'),
-- Description 3
('Szabadtéri munka és erőnléti kihívások, rugalmas munkaidő.',
 'A munkavégzéshez szükséges az erőnlét és a fizikai állóképesség.',
 'Elvárás a munkahelyi biztonságra vonatkozó szabályok betartása.',
 'Kiemelkedő juttatások és munkaruha biztosítása.'),
-- Description 4
('Jó csapat és biztos jövő egy nemzetközi cégnél.',
 'Feladatod lesz marketing kampányok koordinálása, közösségi média kezelése.',
 'Szükséges marketing vagy kommunikációs végzettség.',
 'Céges tréningek, nemzetközi projektekben való részvétel.'),
-- Description 5
('Izgalmas kihívások, innovatív mérnöki csapatban.',
 'A feladatod mérnöki megoldások kidolgozása, fejlesztés és tesztelés.',
 'Szükséges mérnöki végzettség és problémamegoldó készségek.',
 'Versenyképes juttatás és szakmai fejlődési lehetőség.'),
-- Description 6
('Szabadon választható munkarend, családbarát munkakörnyezet.',
 'A munkahelyen a mezőgazdasági feladatok ellátása és a terület karbantartása.',
 'Elvárás: alapszintű mezőgazdasági ismeretek.',
 'Hosszú távú munkalehetőség, szállás biztosítása.');
-- Job 1
-- Job 1 (Irodai asszisztens)
INSERT INTO `Jobs` (`OrganizationId`, `CategoryId`, `AgentId`, `DescriptionId`, `Title`, `City`, `Address`, `HourlyRate`)
VALUES
(1, 1, NULL, 1, 'Irodai asszisztens', 'Budapest', 'Fő utca 12', 1500),
-- Job 2 (Eladó)
(1, 2, NULL, 2, 'Eladó', 'Debrecen', 'Kossuth Lajos utca 45', 1200),
-- Job 3 (Raktári munkás)
(1, 3, NULL, 3, 'Raktári munkás', 'Szeged', 'Petőfi utca 10', 1000),
-- Job 4 (Marketing asszisztens)
(2, 4, NULL, 4, 'Marketing asszisztens', 'Budapest', 'Fő utca 12', 1800),
-- Job 5 (Mérnök)
(2, 5, NULL, 5, 'Mérnök', 'Debrecen', 'Kossuth Lajos utca 45', 2000),
-- Job 6 (Mezőgazdasági munkás)
(3, 6, NULL, 6, 'Mezőgazdasági munkás', 'Szeged', 'Petőfi utca 10', 1300);



