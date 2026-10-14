# Tracer 0.3.0 — adatimport és mentett fiókok

Az import a Windows normál profiljában érhető el az oldalsáv **Adatok importálása** gombjával, a beállítások **Adatok és fiókok** részéből, az alkalmazásmenüből vagy a parancspalettából. Helyi művelet: az importált fájl tartalmát a Tracer nem küldi kiszolgálóra.

## Használat

1. Válaszd ki a helyi böngészőprofilt vagy az exportfájl típusát.
2. Az előnézeten ellenőrizd a forrás nevét, a kompatibilis bejegyzések számát és az esetleges kihagyásokat.
3. Kapcsold ki azokat az adattípusokat, amelyeket nem kívánsz átvenni.
4. A **Kiválasztott adatok importálása** gombbal véglegesíts. Az előnézet önmagában nem módosít könyvjelzőt, előzményt, lapot vagy mentett fiókot.

## Támogatott források

| Forrás                                                    | Átvehető adatok                                                | Határok                                                                                                                   |
| --------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Brave, Google Chrome, Microsoft Edge helyi Windows profil | Könyvjelzők, SQLite előzmények, kompatibilis mentett lapcímek  | A normál `Default` és `Profile N` profilok; a forrásböngésző bezárása ajánlott a legfrissebb mentéshez.                   |
| Böngésző könyvjelző-export HTML                           | Könyvjelzőcímek és nevek                                       | Brave/Chrome/Edge/Firefox/Safari szabványos HTML-export; a mappahierarchia a Tracer egyszerű listájába kerül.             |
| Chromium jelszó-export CSV                                | Webhely, felhasználónév, jelszó                                | `url`, `username`, `password` oszlopok; kizárólag HTTPS eredetek. A hibás sorok kimaradnak és szerepelnek az előnézetben. |
| Firefox munkamenet JSON                                   | A lapok kiválasztott navigációjának webcíme, címe és rögzítése | A kibontott `sessionstore` JSON szerkezete; a tömörített `jsonlz4` formátumot nem olvassa.                                |

A Chromium mentett munkamenetéből a korlátozott, világos szöveges SNSS 1/3 formátum olvasható. A titkosított vagy ismeretlen munkamenet nem kerül megkerülésre. Ilyenkor az előnézet jelzi a hiányt; ha a profilban külön induló webcímek vannak beállítva, azok explicit jelzéssel importálhatók. A lapimport URL-betöltés, nem a régi oldal DOM-jának, űrlapjának vagy teljes visszalépési előzményének visszaállítása.

Könyvjelzőkből és előzményekből a Tracer profilja legfeljebb 1000 bejegyzést tart. A címek ellenőrzöttek és a duplikátumok összevonódnak. Egy ablak legfeljebb 100 lapos; az előnézet a még rendelkezésre álló kapacitást jelzi. Az átvett lapok a háttérben alszanak, megnyitásukig nem töltenek weboldalt.

## Fiókok és jelszavak

A forrásböngésző jelszókezelőjének saját exportparancsával készíts CSV-fájlt, majd válaszd a **Mentett fiókok · CSV** importot. A Tracer legfeljebb 1000 fiókot ment, eredet és felhasználónév szerint összevonva. A kiválasztott új jelszó frissítheti a már mentett azonos fiókot.

A teljes fióktár titkosítva kerül lemezre az Electron rendszerkulcstár-kezelésével; Windows alatt ez az aktuális Windows-felhasználóhoz kötött védelem. Titkosítás hiányában a mentés nem folytatódik egyszerű szöveges tartalékkal. A felület csak webhelyet és felhasználónevet kap, a jelszó nem része a böngésző állapotának vagy az import előnézetének.

A **Mentett fiókok** panelen megnyithatod a webhelyet, kérheted a bejelentkezési mezők kitöltését, másolhatod a jelszót vagy törölheted a fiókot. Kitöltés kizárólag az aktív oldal pontos HTTPS eredetén, kattintásra történik. A Tracer nem nyomja meg a bejelentkezési gombot, és nem továbbít jelszót más eredethez vagy egy másik oldalhoz tartozó iframe-be.

A másik böngésző titkosított jelszó-adatbázisa, cookie-ja, kétlépcsős kódja és aktív bejelentkezési munkamenete nem importálódik. A fiók jelszavának átvétele ezért nem jelent automatikus bejelentkezést; a webhely további hitelesítést kérhet. A CSV-export eredeti fájlja titkosítatlan marad, azt az import után a felhasználó kezelheti vagy törölheti. A Tracer nem törli automatikusan a kiválasztott forrásfájlt.

## Izoláció és Ghost

Privát, Tor és sandbox ablakból az import és a mentett fióktár nem érhető el. Az előnézeti token ablakhoz kötött, egyszer használható és öt perc után lejár. Ghost megszakítja a függő importokat, és törli a normál előzményeket és visszaállítható lapcímeket. A mentett könyvjelzők és titkosított fiókok megmaradnak, mint más szándékosan mentett profiladatok. A fióktár nem része a jelenlegi E2EE könyvjelző/előzmény szinkronpayloadnak.

## Forrás és ellenőrzés

A parser: browser-import.cjs (`../desktop/core/browser-import.cjs`), a titkosított tár: passwords.cjs (`../desktop/core/passwords.cjs`), a felület: renderer.js (`../desktop/ui/renderer.js`). Az ellenőrzött forrásformátumok referenciahivatkozásai és a korlátok a parserben találhatók. A Node- és Chromium-próbák szintetikus exportfájlokat, elkülönített profilt és helyi webhelyet használnak; a fejlesztés nem importálta a felhasználó valódi jelszavait vagy böngészőprofilját. A tényleges eredményeket a [VALIDATION.md](VALIDATION.md) rögzíti.
