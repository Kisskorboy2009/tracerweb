# Tracer 0.3.6 — kattintható felső sáv, helyes előnézet és mentés másként

A 0.3.6 a felső kezelősáv kattintásait, a letöltési buborék mögötti oldal előnézetét és a kézi fájlmentést javítja. **569/569 Node-teszt sikeres; a forrásból és a csomagolt alkalmazásból futó változat egyaránt 143 natív integrációs ellenőrzést teljesített.** Az újraindítási próba 11 ellenőrzést és 4 folyamatindítást teljesített. A telepítő tartalma és ellenőrzőösszege is ellenőrzött; bizonyítékok az ellenőrzési jegyzőkönyvben (`VALIDATION.md`).

## Felső sáv és kezdőlap

A felső lapfülek és ablakvezérlők kattintható területe a látható gombhoz igazodik. A felső élhez közel végzett kattintást nem az ablak húzható címsorának területe kezeli a gomb helyett.

A kezdőlap órája közepesen félkövér, **600-as betűvastagságot** használ. A **Megjelenés → Teret a fókusznak** kapcsoló külön elrejti vagy megjeleníti a Lapkezelő, Live Sandbox és Surge gyorsgombokat tartalmazó kezdőlapi kártyát. A választás a megjelenési beállításokkal együtt megmarad; az óra és az adatvédelmi kártya továbbra is külön kapcsolható.

## Letöltési buborék és az oldal helyzete

A letöltésikonra kattintva megnyílik a legutóbbi letöltések listája. A buborék bezárógombja, az **Escape**, az ikon ismételt megnyomása vagy a felületen kívüli kattintás visszatér az oldalhoz. Az Escape a még készülő, késve visszaérkező előnézetet is visszavonja, hogy a buborék ne nyíljon meg utólag.

A korábbi elcsúszásnak konkrét okai voltak:

- Az előnézeti kép méretezését és ismétlési beállítását egy későbbi CSS háttér-rövidítés lenullázta. A háttérszín most megtartja a kép beállításait.
- Nyitott **Ctrl+F keresősávnál** a natív oldal 44 képponttal lejjebb kezdődött, az előnézet viszont a keresősáv nélküli helyen maradt. Az előnézet pozíciója és magassága most a keresősávot is figyelembe veszi.
- A képrögzítés közben változó ablakméret, könyvjelzősáv, oldalsáv, alsó sáv vagy webcím után régi kép érkezhetett vissza. Az előnézet az aktuális laphoz, URL-hez és natív oldalhatárokhoz kötött; a közben érvénytelenné vált képet nem használja.

A letöltési állapot frissítése nem változtatja meg az oldal natív méretét. A százalék, sebesség és szüneteltetés továbbra is a buborékban és a teljes Letöltések panelen látható.

## Képek, hivatkozások és média mentése

A korábbi **Kép mentése másként…** parancs közvetlenül a Letöltések mappába indított letöltést, így nem kínált fájlnév- és helyválasztást. A kézi mentés most a Windows natív mentési párbeszédablakát használja.

- Képen jobb kattintás → **Kép mentése másként…**.
- Hivatkozáson jobb kattintás → **Hivatkozás mentése másként…**.
- Közvetlenül menthető hangon vagy videón jobb kattintás → **Hang mentése másként…** vagy **Videó mentése másként…**.
- Az aktív oldalhoz **Ctrl+S**, illetve a böngészőmenü **Oldal mentése másként…** pontja használható.

A párbeszédablakban válaszd ki a célmappát és a fájlnevet, majd ments. Az **Elvetés** nem indít letöltést. A kijelölt útvonalat az adott mentés őrzi meg; a szokásos, külön webes fájlletöltések továbbra is egyedi névvel kerülnek a Letöltések mappába. A mentés a lap saját Chromium-munkamenetét használja, így a webhely eredete és a bejelentkezési cookie-k ellenőrzése megmarad.

Oldalmentésnél teljes HTML-oldal és **MHTML** választható. A teljes HTML a szükséges helyi erőforrásokat külön, egyedi nevű mappába mentheti, és a HTML hivatkozásai erre a mappára mutatnak. Meglévő célfájl csak a sikeres mentés végén, atomi cserével íródik felül; korábbi erőforrásmappák nem íródnak felül. Az MHTML `.mhtml` vagy `.mht` fájlba csomagolja az oldalt. Ez a motor oldalmentési művelete, nem ugyanaz, mint a látható terület PNG-képernyőképe. Az oldalmentés saját állapotot kap a letöltési listában; nem kínál a motor által nem támogatott szüneteltetést vagy megszakítást.

A HTTP/HTTPS, adat- és a saját laphoz tartozó blob-forrás mentési útja a natív letöltéskezelőt használja. Az **iframe-ben létrehozott blob** az eredeti natív keretből indított letöltéssel menthető; ezt valódi kerethez tartozó helyi menüvel és a kiválasztott fájl pontos bájtjaival ellenőriztük. A mentési kérés az eredeti laphoz, kerethez és forráshoz kötött. Más forrás vagy időközben eltűnt keret nem használhatja fel a kiválasztott fájlhelyet. A közvetlen médiafájl mentése nem DRM-es műsor, teljes streaming szolgáltatás vagy MediaSource-lejátszás exportja.

A kézi mentés normál és privát ablakban használható; privát mentés is fájlt hagy a lemezen. Tor és Live Sandbox ablakban a mentés tiltott. A normál lapon megnyitott helyi HTML engedélyezett saját mappájából származó képek és fájlok menthetők; ez nem ad más helyi mappákhoz általános hozzáférést. Ha a lap a helyválasztás alatt navigál, bezárul, vagy a Ghost megszakítja a munkamenetet, a régi mentési kérés nem folytatódhat az új oldalon.

## Változatlan korlátok

A 0.3.5 nagyobb bővítménykerete változatlan: **128 MiB tömörített CRX, 256 MiB kibontott csomag, 64 MiB fájlonként, 8192 fájl**, 120 másodperces áruházi előkészítési határidővel. A szokásos webes fájlletöltéshez továbbra sincs Tracer által bevezetett bájtkorlát. A hivatalos áruházi URL-, aláírás-, store-proof-, útvonal- és tényleges méretellenőrzések megmaradnak. A bővítmény API-k támogatása és korlátai a [0.3.5 útmutatóban](UPDATE_0.3.5.md), illetve a [kompatibilitási jelentésben](CHROME_COMPATIBILITY.md) olvashatók.

## Kézi frissítés

Windows x64 telepítő: Tracer-Setup-0.3.6-x64.exe (`../dist/Tracer-Setup-0.3.6-x64.exe`), **155 816 894 bájt**. SHA-256: `dbac4b9c23fbd844a24ccb151b549bbf80628ade6f1e4e5faa9c360e573db655`. Az ellenőrzőösszeg a kiadási manifesttel és a `.sha256` kísérőfájllal egyezik. Futtasd kézzel a telepítőt, majd indítsd újra a Tracert. A futó böngészőt nem zárjuk be, és a gépre telepített példányt nem frissítjük automatikusan.

A helyi fejlesztői NSIS telepítő **Authenticode-aláírás nélkül** készült; a mért állapot `NotSigned`, ezért a Windows ismeretlen kiadót jelezhet. A verzióhoz kötött végleges ellenőrzési eredmények az ellenőrzési jegyzőkönyvben (`VALIDATION.md`) szerepelnek.
