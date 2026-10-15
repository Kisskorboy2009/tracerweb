# Tracer 0.3.2 — megjelenés és helyi böngészőeszközök

A Megjelenés gomb megnyitja a paletta-, kiemelőszín- és háttérválasztót. A beállítás azonnal érvényesül és a helyi profilban megmarad. A panel a böngésző kezelőfelületét és az új lapot módosítja; a meglátogatott oldalak saját stílusát nem írja át.

Az új lap kapcsolható háttere, gyorslinkjei és widgetjei a Brave dokumentált testreszabásához hasonló lehetőségeket adnak, saját Tracer felülettel és helyi adatkezeléssel. Ez nem teljes Brave-paritás. [Brave: új lap testreszabása](https://support.brave.app/hc/en-us/articles/360040912932-How-do-I-customize-my-New-Tab-Page).

## Paletták és kiemelőszínek

A 17 külön paletta önálló háttér-, felület-, szöveg-, másodlagos szöveg-, keret- és hover-színeket tartalmaz. A kiemelőszín ettől függetlenül választható.

| Sötét paletták         | Világos paletták      |
| ---------------------- | --------------------- |
| Graphite (`graphite`)  | Cloud (`cloud`)       |
| Midnight (`midnight`)  | Dune (`sand`)         |
| Pure Black (`oled`)    | Lavender (`lavender`) |
| Nord (`nord`)          | Sage (`mint`)         |
| Deep Forest (`forest`) | Glacier (`ice`)       |
| Ocean (`ocean`)        | Peach (`peach`)       |
| Velvet (`plum`)        | Paper (`paper`)       |
| Rose Noir (`rose`)     |                       |
| Ember (`ember`)        |                       |
| Espresso (`coffee`)    |                       |

A külön Rendszertéma (`system`) az operációs rendszer világos/sötét választását követi: Cloud vagy Graphite palettára vált, a weboldal újratöltése nélkül.

A 14 kiemelőszín: **Ibolya, Kék, Cián, Menta, Lime, Arany, Mandarin, Korall, Rózsaszín, Orgona, Petrol, Rubin, Ezüst, Monokróm**. A katalógus mindegyikhez külön világos és sötét változatot ad.

## Helyi háttérgaléria és saját képek

Az öt korábbi kép helyett öt, interneten talált és alkotói **CC0** licenccel ellenőrzött kép szerepel a csomagban. A galéria külön, legfeljebb 480×270-es JPEG-előnézeteket használ; a nagy kép kiválasztáskor töltődik be helyi erőforrásból. Új képgenerálás és felnagyítás nem történt.

| Név             | Fájl az assets/wallpapers könyvtárban | Tényleges csomagolt felbontás |
| --------------- | ------------------------------------- | ----------------------------- |
| Alpesi tó       | `alpine-lake.jpg`                     | **3840×2160, 4K**             |
| Ködös erdő      | `misty-forest.webp`                   | **3840×2160, 4K**             |
| Azúr szurdok    | `azure-canyon.webp`                   | 1920×1080, Full HD            |
| Ezüst hegyvidék | `silver-peaks.webp`                   | 1920×1080, Full HD            |
| Manga város     | `manga-city.webp`                     | 1920×1080, Full HD            |

A természetfotók nagyobb forrásból 16:9 arányra vágott, lefelé méretezett példányok. A két fantasy táj korábban publikált illusztráció; a manga város saját Blender-render. A HD illusztrációk nem kapnak 4K címkét. A kutatás ingyenes, natív 4K alkotói CC0 animeképet nem igazolt. Pontos források, alkotók és licencbizonyíték: [háttérképek licencei](wallpapers/LICENSES.md).

A „Nincs háttér” választás a paletta saját háttérszínét használja. A sötétítés **0–85%** között állítható, hogy a szöveg a választott képen is olvasható legyen. Alapból Ködös erdő és 24% sötétítés aktív. A már nem létező korábbi háttérválasztás erre áll vissza; a saját importált kép megmarad.

Saját kép hozzáadásakor a Windows natív fájlválasztója nyílik meg. JPEG, PNG és WebP importálható, legfeljebb **25 MiB** fájlmérettel és **60 megapixellel**. A profil maximum **10 saját képet** tárol. A mentett példány aránytartóan legfeljebb **3840×2160**, felnagyítás nélkül; a natív dekóder JPEG-ként újrakódolja, eredeti EXIF- és más képmetaadatok nélkül. A forrásfájl megmarad.

A saját példányok az Electron `userData/wallpapers` könyvtárában, generált fájlnévvel és helyi `index.json` katalógussal élnek. Ez helyi tárolás, titkosítás nélkül. Saját kép törölhető a galériából; az éppen használt kép törlése Ködös erdőre állít vissza. A mellékelt képek a UI-ból nem törölhetők. Tartós képimport és törlés normál ablakból érhető el.

A kezdőlap nem tölt le képet vagy külső favicont. A Ghost üríti a böngészési munkamenetet, de a megjelenési választást és saját háttérképeket megőrzi. A képek nem részei az E2EE szinkroncsomagnak.

## Kapcsolók és alapgyorslinkek

A kezdőlapi lapkák × gombja egyenként elrejti a promóciókat. A Testreszabás panelen hat kapcsoló, „Összes elrejtése” és „Alapértelmezettek visszaállítása” művelet van. Az `appearance.hiddenShortcuts` pontos katalógus-URL-eket tárol; alapértéke `[]`. Elrejtés után a promó a kezdőlapról, gyorselérési sávból, címajánlásokból és parancspalettából is kikerül. Az ugyanarra az URL-re szándékosan mentett saját könyvjelző és előzmény megmarad. A választás újraindítás és Ghost után is megmarad.

Az óra, adatvédelmi összesítő, gyorslinkek és könyvjelzősáv külön elrejthető. A könyvjelzősáv változása a tényleges webnézet helyét is módosítja, így a sáv nem takarja a weboldal tetejét.

A könyvjelzősáv egy gombja legfeljebb **150 px** széles, a felirat legfeljebb **112 px** helyet kap. A hosszú név ellipszissel rövidül, a webhelyikon mérete megmarad. Az egérrel megjeleníthető tooltip a teljes nevet és a webcímet mutatja; a mentett könyvjelző eredeti címe változatlan.

A kezdőlap órája 48 px-es betűméretet használ; 1150 px-nél keskenyebb ablakban 36 px-re vált. A tabuláris számjegyek az idő változásakor is megőrzik a kijelzés szélességét.

A hat promóciós alapgyorslink helyi katalógusból jelenik meg, betűmonogram helyett az oldal tényleges ikonjával vagy képével. A 128×128 PNG-k a csomag `assets/sites` könyvtárában vannak, ezért a kezdőlap megnyitása nem indít külső favicon- vagy képkérést; a céloldalt csak megnyitáskor keresi fel:

| Címke       | Cél                                            |
| ----------- | ---------------------------------------------- |
| Kisskorboy  | [kisskorboy.hu](https://kisskorboy.hu)         |
| Overclock   | [overclockgame.hu](https://overclockgame.hu)   |
| Solaryn     | [solaryn.hu](https://solaryn.hu)               |
| SolarCenter | [center.solaryn.hu](https://center.solaryn.hu) |
| Asthetic    | [asthetic.hu](https://asthetic.hu)             |
| Kounee      | [kounee.hu](https://kounee.hu)                 |

Az Asthetic sötét márkajele világos lapkán jelenik meg. A Kounee 2026-10-10-én parkolóoldalt szolgál ki, ezért az ott ténylegesen megjelenő illusztrációt használjuk. A képek ellenőrzött forrásait és kézi frissítését az [assets/sites/README.md](sites/README.md) dokumentálja.

A weboldalak megnyitásakor a fülsáv és a könyvjelzősáv az oldal tényleges faviconját is használja. A letöltés a lap saját Chromium munkamenetén keresztül történik, méret- és időkorláttal; a külső ikonszolgáltató helyett az oldal megadott ikonja vagy `/favicon.ico` szerepel. Az SVG és ICO is kis PNG-vé alakul. A normál profil legfeljebb 128 eredet ikonját tartja memóriában hat órán át, a privát/Tor/sandbox ablakok saját memóriatárral dolgoznak. Az ikonok nem kerülnek lemezre; hiányzó ikon esetén földgömb jelenik meg.

A keresőmező fókuszba kerülve **240 ms** alatt kissé előrébb emelkedik és nagyobb lesz. A cím, gyorslinkek, óra és alsó kártyák elhalványulnak; közben `inert` állapotuk miatt billentyűzettel sem lehet a láthatatlan vezérlőkre lépni. A mező és a keresés gomb között a fókusz megtartható; `Escape` vagy a keresőből kilépés visszaállítja a kezdőlapot. Az átmenet CSS `transform`/`opacity` használatával működik, folyamatos animációs ciklus nélkül.

A többi rövid felületi átmenet jellemzően 150–220 ms. A `system` mozgásmód alapból követi a rendszer csökkentett mozgás beállítását; külön `reduced` és `full` választás is van. Csökkentett mozgással az animáció és átmenet kikapcsol, a fókuszállapot közvetlenül változik. Ez a shell animációira vonatkozik.

## Oldalsáv és bezárási megerősítés

A Beállítások **Oldalsáv** kártyájában a sáv balra vagy jobbra helyezhető, elrejthető és 56–240 px között méretezhető. A belső szélét egérrel húzva a weboldal nézete is követi a szélességet, újratöltés nélkül. 120 px-től az ikonok mellett a feliratok is látszanak. Az egér felengedése ment; Escape, megszakított húzás vagy fókuszvesztés visszaállítja a mentett méretet. A fókuszált húzóélen a nyilak, Home/End és Shift+nyíl is használható. A rejtett oldalsáv a címsor jobb szélén található menü **Beállítások** pontjából visszakapcsolható.

Az új és bezárt fülek, panelváltások, menük és gombok rövid, véges animációkat kaptak. A rendszer csökkentett mozgás jelzése és a **Csökkentett mozgás** választás ezeket, valamint a bezárási ablak és hátterének animációját is kikapcsolja.

Két vagy több nyitott lap mellett az ablak tényleges bezárása előtt lapszámot mutató párbeszéd jelenik meg. Az **Elvetés** és Escape megőrzi az ablakot; a **Ne kérdezze meg többször** csak az **Összes bezárása** megerősítésével mentődik. A Beállítások → **Indítás és munkamenet** alatt a kérdés ismét bekapcsolható. A teljes alkalmazáskilépés az összes ablak lapjait számolja; a háttérasszisztens miatti elrejtés nem zár lapokat. A Ghost a kifejezetten kért törlést végzi, és érvényteleníti a korábbi bezárási kérdést.

## Beállítási választók

A keresőmotor, DNS-mód, erőforráskorlátok és mozgásmód legördülői a választott palettához illeszkedő, saját listákat használnak. A választott értéket pipa jelzi, a lista a rendelkezésre álló hely szerint felfelé vagy lefelé nyílik. A vezérlők `combobox`/`listbox`/`option` szerepeket, nyitott állapotot és aktív elemjelzést adnak az akadálymentesítési API-nak.

`Enter`, `Space` vagy a nyilak nyitják a listát; a nyilak, `Home` és `End` mozgatják a kijelölést. Gépeléssel egy opció elejére lehet keresni, `Enter` vagy `Space` választ, `Escape` bezár és a vezérlőn tartja a fókuszt. `Tab`, külső kattintás, panelgörgetés vagy ablakméretezés bezárja a listát. Ez implementált billentyűzetkezelés; külön képernyőolvasóval végzett tanúsító vizsgálat nincs.

## Globális védelem és munkamenet-visszaállítás

A kezdőlap Tracer Shields kártyája és a Shields panel felső összesítője a **teljes helyi normál profil** mért blokkolásait, HTTPS-váltásait és követési paraméterektől megtisztított címeit mutatja. Minden normál ablak ugyanazokat a számlálókat kapja; azok ablakbezárás és újraindítás után is megmaradnak. A számlálók nem tárolnak webcímeket, és a privát, Tor vagy sandbox munkamenetek kérései nem növelik őket. Ghost után az összesített számlálók megmaradnak. A címsor melletti kis pajzs és a Privacy Receipt továbbra is az aktuális lap részleteit mutatja, saját feliratokkal.

A Beállításokban a **Folytatás, ahol abbahagytad** alapból bekapcsolt. A normál ablakok URL-je, lapcíme, aktív lapja, rögzítése, némítása és zoomja a helyi profilba kerül; legfeljebb 20 ablak, ablakonként 100 lap és összesen 500 lap állítható vissza. Induláskor ablakonként az aktív oldal töltődik be; a többi weboldal csak a fülére kattintva kap Chromium-nézetet. Az előző DOM, kitöltött űrlap, oldal görgetési pozíciója és navigációs előzmény nem áll vissza. A mentett URL-lista helyi, titkosítás nélküli profiladat.

A privát, Tor és sandbox ablakok kimaradnak a mentésből. A kapcsoló kikapcsolása törli a mentett laplistát, és a Ghost is üríti azt. A kezdőlap gomb az ablak már létező új lapjára vált; ennek hiányában az aktuális fül válik kezdőlappá, a lapok száma nem nő. Új fül csak teljesen üres ablaknál szükséges. A kezdőlap újratöltése frissíti a helyi felületet, közben a többi megnyitott lap megmarad.

## Lapok, parancspaletta és oldaleszközök

A felső fülek **210 px** szélesek, rövid vagy hosszú lapcímmel és rögzített állapotban is. A cím ellipszissel rövidül, a teljes név a fül tooltipjében látszik. Új lap nyitásakor a fül szélessége és láthatósága körülbelül **190 ms** alatt nő; bezáráskor a fordított átmenet fut. A tényleges weboldal már a bezárási kéréskor megszűnik, az eltűnő fül csak a rövid vizuális átmenetet fejezi be, és közben nem kattintható vagy fókuszálható. Csökkentett mozgással nincs nyitó/záró animáció; a Ghost és az ablak elrejtése is megszakítja a futó átmeneteket.

Lapcím-, favicon- vagy betöltésiállapot-frissítéskor a fül meglévő DOM-elemei maradnak. A cím változása nem indít új lapnyitási animációt és nem veszi el a fülön vagy bezárógombján tartott fókuszt.

A böngésző saját kezelőfelületén nincs szövegkijelölés vagy helyi jobbklikkmenü. A címsor, kereső- és beállítási szövegmezők szerkeszthetők maradnak: a kijelölés, másolás, beillesztés és `Ctrl+A` ezekben működik. A weboldalak tartalmának kijelölése és képműveletei külön, a weboldal nézetében továbbra is elérhetők.

| Művelet                              | Elérés és működés                                                                              |
| ------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Lap rögzítése, némítása, duplikálása | Felső böngészőmenü; az aktív lapra érvényes, a duplikálás új URL-betöltés                      |
| Lap altatása vagy ébresztése         | Felső böngészőmenü vagy Lapkezelő                                                              |
| Lap bezárása                         | Fül × gombja, felső böngészőmenü vagy `Ctrl+W`                                                 |
| Lapkezelő                            | Felső böngészőmenü, oldalsáv vagy parancspaletta                                               |
| Bezárt lap újranyitása               | `Ctrl+Shift+T` vagy felső böngészőmenü; ablakonként legfeljebb 20 rekord RAM-ban               |
| Parancspaletta                       | `Ctrl+K`; parancsok, nyitott lapok, könyvjelzők és alapgyorslinkek helyi keresése              |
| Címsor                               | `Ctrl+L`; előzményekből és könyvjelzőkből készülő helyi javaslatok                             |
| Keresés az oldalon                   | `Ctrl+F`; a Chromium találatszámmal és előző/következő vezérléssel keres                       |
| Zoom                                 | `Ctrl++`, `Ctrl+-`, `Ctrl+0`; 50–200%, alaphelyzet 100%                                        |
| Képernyőkép                          | „Képernyőkép mentése” menüpont; aktív látható terület PNG-ben, natív mentési párbeszéddel      |
| Adatok importálása                   | Oldalsáv, Beállítások vagy parancspaletta; helyi profil/export előnézete és külön véglegesítés |
| Mentett fiókok                       | Külön panel; webhely/felhasználónév lista, kattintásra HTTPS kitöltés, másolás és törlés       |

A helyi javaslatok gépelése nem küld lekérdezést keresőszolgáltatónak. A keresés elküldésekor a kiválasztott kereső normál hálózati navigációval nyílik meg. Újranyitáskor a cím, rögzítés, némítás és zoom visszaállhat, a korábbi DOM, űrlap és navigációs előzmény nem. Az újranyitási lista Ghostkor és ablakbezáráskor megszűnik, lemezre nem kerül.

A főfolyamat az új IPC-műveleteknél is ellenőrzi a helyi shell küldőjét, a lap ablakhoz tartozását, valamint az adat típusát és határait. A képernyőkép- és képimport-művelet az aszinkron párbeszéd után ismét ellenőrzi a munkamenetet; Ghost után a függő művelet nem fejezheti be a mentést.

## Böngészőadatok és mentett fiókok

A Windows normál profilja helyi Brave, Chrome és Edge profilból könyvjelzőket, SQLite előzményeket és kompatibilis mentett lapcímeket vehet át. Külön fájlból könyvjelző HTML, Chromium jelszó CSV és kibontott Firefox munkamenet JSON olvasható. Az előnézet megmutatja a darabszámokat és korlátokat; az import csak külön véglegesítéssel módosítja a profilt. Az új lapok háttérben alszanak, kiválasztásukig nem töltenek weboldalt. A részletes támogatás és használat az [IMPORT.md](IMPORT.md) fájlban található.

A mentett fióktár legfeljebb 1000 bejelentkezést őriz, pontos HTTPS eredet és felhasználónév szerint összevonva. A teljes tár rendszerkulcstárral titkosítva kerül lemezre; Windows alatt az aktuális Windows-felhasználó védelmét használja. Titkosítás hiányában nincs egyszerű szöveges tartalék. A kezelőfelület csak webhelyet és felhasználónevet kap. Kitöltés a kiválasztott fióknál, az aktív oldal pontos HTTPS eredetén történik, automatikus űrlapelküldés nélkül. Másoláskor a főfolyamat ír a vágólapra; a jelszó nem válik IPC-válasszá.

A másik böngésző titkosított jelszó-adatbázisa, sütije és aktív bejelentkezési munkamenete nem kerül át. Jelszóhoz a forrásböngésző CSV-exportja szükséges; az eredeti CSV titkosítatlan marad. Privát, Tor és sandbox ablakból az import és a fióktár nem érhető el. Ghost megszakítja az előnézeteket, de a szándékosan mentett titkosított fiókokat a könyvjelzőkhöz hasonlóan megőrzi.

## Konfiguráció és generálás

A kanonikus katalógus: shared/appearance.json (`../shared/appearance.json`). A profilindulási alapértékek: shared/config.json (`../shared/config.json`).

```json
{
  "appearance": {
    "themeId": "graphite",
    "accentId": "violet",
    "backgroundId": "misty-forest",
    "dim": 24,
    "motion": "system",
    "showClock": true,
    "showStats": true,
    "showShortcuts": true,
    "showBookmarks": true,
    "hiddenShortcuts": []
  },
  "restoreSession": true
}
```

A `scripts/appearance.mjs` generálja a `desktop/ui/appearance.js` adatfájlt. Az `npm start`, `npm run check`, `npm run test:browser`, `npm run build:win` és `npm run build:dir` előtt ezt az npm hook automatikusan lefuttatja. Kézi generálás a projekt gyökeréből:

```powershell
node scripts/appearance.mjs
npm run build:icons
```

A logó egyetlen összefüggő, fekete geometrikus jel. Az SVG, PNG és hétméretes ICO ugyanabból a `scripts/icons.mjs` geometriából készül. Az Android vektor és az iOS alkalmazásikon ugyanezt a jelet használja.

A meglévő háttérkatalógus és előnézetek ellenőrzése Python és Pillow használatával:

```powershell
python scripts/wallpapers.py --verify
```

## Mobil állapot és ellenőrzés

Az Android és iOS forrás **nyolc natív palettát**, világos/sötét/rendszermódot, saját helyi képimportot és a hat alapgyorslinket tartalmazza. Ezek platformonként külön implementációk és külön importkorlátokkal dolgoznak; a teljes desktop-galériát és 17 palettát nem adják. Az APK/AAB/IPA build és fizikai eszközteszt ebben a Windows környezetben még nem futott. A konkrét buildparancsok és eszközellenőrzések a [mobil README-ben](mobile/README.md) szerepelnek.

A tényleges Windows teszt-, Chromium- és csomagolási eredmények forrása a VALIDATION.md (`VALIDATION.md`); ez a leírás az implementált viselkedést és annak korlátait dokumentálja.
