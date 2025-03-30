

# StudentHive - Telepítési és indítási útmutató

A **StudentHive** egy többplatformos alkalmazás, amely webes és asztali környezetben is működik. Ez a dokumentáció végigvezet a telepítési és indítási folyamaton.

---

## Repository Struktúra

A repository a következő fő mappákat és fájlokat tartalmazza:

```
StudentHive/
│── backend/          # ASP.NET backend
│── desktop/          # WPF alapú asztali alkalmazás
│── frontend/         # React + Vite frontend
│── README.md         # Ez a dokumentáció
│── STUDENTHIVE Dokumentáció.docx  # Részletes dokumentáció
│── studenthive.sql   # Adatbázis dump fájl
```

- **backend/**: Az ASP.NET backend forráskódja.
- **desktop/**: Az asztali alkalmazás forráskódja (WPF és C#).
- **frontend/**: A React alapú frontend forráskódja.
- **README.md**: Ez a fájl tartalmazza a telepítési és indítási információkat.
- **STUDENTHIVE Dokumentáció.docx**: Részletesebb dokumentáció a projektről.
- **studenthive.sql**: Az adatbázis sémájának és alapadatainak exportja.

## Alapvető szoftverek telepítése

### Node.js telepítése
A Node.js egy futtatókörnyezet, amelyre a StudentHive alkalmazás működéséhez szükség van.
1. Nyisd meg a böngésződet, és menj a következő oldalra:
   https://nodejs.org/
2. Töltsd le a Latest (LTS) verziót (ajánlott stabil verzió).
3. Futtasd a letöltött telepítőt (.msi Windowsra, .pkg Macre, vagy a megfelelő Linux csomagot).
4. Kövesd a telepítő utasításait, és engedélyezd a PATH beállítások módosítását, ha kéri.
5. Telepítés után ellenőrizd a verziókat:
   ```
   node -v
   npm -v
   ```
   Ha a két parancs sikeresen kiírja a verziószámokat (pl. v18.17.0), akkor a Node.js és az npm sikeresen telepítve van.

### Git telepítése (ha szükséges)
A Git nem kötelező, de segít a projekt letöltésében és kezelésében.
1. Nyisd meg: https://git-scm.com/
2. Töltsd le és telepítsd a megfelelő verziót az operációs rendszeredhez.
3. A telepítés után ellenőrizd, hogy sikeresen települt:
   ```
   git --version
   ```
   Ha verziószámot ad vissza (pl. git version 2.39.1), akkor minden rendben.

### Kódszerkesztő (ajánlott: Visual Studio Code)
Ha nincs telepítve fejlesztői környezeted, ajánlott a VS Code használata:
1. Nyisd meg: https://code.visualstudio.com/
2. Töltsd le és telepítsd a legfrissebb verziót.

### Visual Studio 2022 telepítése
Az ASP.NET és WPF futtatásához szükség van a Visual Studio 2022 fejlesztői környezetre.
1. Nyisd meg a következő oldalt:
   https://visualstudio.microsoft.com/downloads/
2. Töltsd le a Visual Studio 2022 Community verziót (ingyenes).
3. Indítsd el a letöltött telepítőt.
4. Telepítés közben válaszd ki a szükséges fejlesztői csomagot:
   - ASP.NET and web development
   - .NET desktop development 
   - Data storage and processing 
5. Kattints a Telepítés gombra, és várd meg, amíg a folyamat befejeződik.

Amennyiben már telepítve van:
1. Nyisd meg a Visual Studio Installert
2. A Visual Studio 2022 Community-nél Modify gombra kattinva lehet módosítani a fejlesztői csomagokon, illetve a .NET verziókon.

**Fontos!** A backend .NET6 verzió fut, tehát telepítve kell lennie. Ha nincs így telepíthető:
1. Nyisd meg:
   https://dotnet.microsoft.com/en-us/download/dotnet/6.0
2. Töltsd le a .NET 6 SDK (SDK 6.0.428) verziót az operációs rendszeredhez.
3. Futtasd a telepítőt, és kövesd az utasításokat.
4. Telepítés után ellenőrizd, hogy sikeresen feltelepült:
   ```
   dotnet --version
   ```
   Ha a parancs kiír egy verziószámot (pl. 6.0.412), akkor a .NET SDK telepítve van.

### XAMPP letöltése és telepítése
1. Nyisd meg a következő oldalt:
   https://www.apachefriends.org/download.html
2. Válaszd ki a Windows verziót, és töltsd le az XAMPP 8.x.x telepítőt.
3. Futtasd a letöltött xampp-windows-x64-x.x.x.exe fájlt.
4. A telepítés során válaszd ki a szükséges komponenseket (Apache, MySQL legyen kiválasztva, a többi opcionális).
5. Telepítés után kattints a Finish gombra.

## A projekt letöltése

### A kód letöltése Git segítségével
Ha Git telepítve van, akkor klónozhatod a projektet:
```
git clone https://github.com/lacydeth/StudentHive.git
```

Ha nincs Git, töltsd le manuálisan:
1. Nyisd meg a GitHub oldalt.
2. Kattints a Code gombra, majd válaszd a Download ZIP opciót.
3. Csomagold ki egy tetszőleges mappába.

Ezután lépj be a projekt könyvtárába:
```
cd StudentHive
```

## Frontend megnyitása

### A React projekt megnyitása CMD-vel
Ha a VS Code telepítve van (belépés a projektmappába, majd kódszerkesztő megnyitása):
```
cd frontend
code .
```

### A React projekt megnyitása kódszerkesztőből
Ha a VS Code telepítve van:
1. VS Code futtatása új ablakban
2. File → Open folder
3. Leklónozott StudentHive mappában a frontend mappa kiválasztása
4. Mappaválasztás gomb megnyomása

### Szükséges csomagok telepítése
A projekt működéséhez különböző npm csomagok szükségesek. Ezeket a package.json fájl tartalmazza, és egyszerűen telepíthetők:
```
npm install
```
Ez letölti az összes szükséges függőséget.
Ha a telepítés sikeres, egy node_modules/ mappa jön létre, amely az összes szükséges könyvtárat tartalmazza.

### Frontend futtatása
Fejlesztői mód indítása:
A fejlesztői szerver indításához futtasd az alábbi parancsot:
```
npm run dev
```
Ez elindítja a Vite fejlesztői szervert, és meg kell jelennie egy üzenetnek:
```
VITE v6.0.6  ready in 1380 ms

➜  Local:   http://localhost:3000/
➜  Network: http://192.168.6.5:3000/
➜  Network: http://172.28.16.1:3000/
➜  Network: http://172.27.0.1:3000/
➜  press h + enter to show help
```
Nyisd meg a böngészőt, és látogasd meg a http://localhost:3000/ címet.

## Adatbázis indítása és tesztelése

### XAMPP Control Panel megnyitása
1. Keresd meg az XAMPP Control Panel-t a Start menüben, és indítsd el.
2. A vezérlőpanelen két fő szolgáltatást kell elindítani:
   - Apache (webszerver)
   - MySQL (adatbázis)
3. Kattints a Start gombra az Apache és MySQL mellett.
4. Ha minden rendben van, a modul zöld háttérrel jelenik meg.

### Apache tesztelése (webszerver)
1. Nyiss meg egy böngészőt, és írd be:
   http://localhost
2. Ha az XAMPP alapértelmezett oldala betöltődik, az Apache sikeresen fut.

### MySQL tesztelése (adatbázis)
1. Nyisd meg a phpMyAdmin felületet:
   http://localhost/phpmyadmin
2. Ha az oldal megnyílik, a MySQL szerver működik.

## A backend projekt megnyitása
Amennyiben a XAMPP sikeresen elindult következhet a backend indítása. A projekt a backend/ mappában található.

Ha Visual Studio 2022-t használsz:
1. Nyisd meg a Visual Studio-t.
2. Kattints a "Open a project or solution" opcióra.
3. Navigálj a backend mappába, és válaszd ki a .sln fájlt.
4. Kattints a Megnyitás gombra.

Másik opció:
1. A lehúzott repositoryban a backend mappa megnyitása.
2. StudentHiveServer.sln fájl megnyitásával elindul a projekt.

### Backend futtatása
Ha Visual Studio-t használsz:
1. Kattints a Zöld Indítás gombra (F5), vagy válaszd ki a Debug → Start Debugging opciót.
2. A szerver elindul a https://localhost:7067 címen, és megjelenik egy terminál.

Amennyiben a XAMPP fut a backend automatikusan létrehozza az üres adatbázist, ennek a sikerességéről üzenetben tájékoztat (Az adatbázis sikeresen létrehozva). Továbba elindul a Swagger is, megjelenítve az összes API route-ot.

## WPF projekt megnyitása
Amennyiben a XAMPP sikeresen elindult következhet a desktop indítása. A projekt a desktop/ mappában található.

Ha Visual Studio 2022-t használsz:
1. Nyisd meg a Visual Studio-t.
2. Kattints a "Open a project or solution" opcióra.
3. Navigálj a desktop mappába, és válaszd ki a .sln fájlt.
4. Kattints a Megnyitás gombra.

Másik opció:
1. A lehúzott repositoryban a desktop mappa megnyitása.
2. StudentHiveWpf.sln fájl megnyitásával elindul a projekt.

### WPF futtatása
Ha Visual Studio-t használsz:
1. Kattints a Zöld Indítás gombra (F5), vagy válaszd ki a Debug → Start Debugging opciót.
2. A program elindul és megjelenik egy bejelentkezési ablak.

