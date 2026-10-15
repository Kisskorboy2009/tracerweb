# Tracer 0.3.5 — lapfülek, alsó sáv, letöltések és bővítmények

## Lapfülek

A húzott fül követi az egeret, a szomszédos fülek animálva elmozdulnak, elengedéskor a fül a helyére kerül. A csökkentett mozgás beállítása és a Windows megfelelő beállítása kikapcsolja az animációt. Escape visszavonja a húzást; a rögzített lapok saját csoportjukban maradnak.

Hosszú fülsornál a két oldalsó nyíllal és az egérgörgővel a régebbi fülekhez is vissza lehet menni. A lapcím, ikon vagy betöltési állapot frissülése megőrzi a kézzel kiválasztott görgetési helyet. Az újonnan aktivált fül láthatóvá válik; a húzás a fülsor széleinél továbbra is görget.

## Alsó állapotsáv

Az alsó sáv felső szélét húzva a magassága 24–160 képpixel között változtatható. A jobb széli bezárógomb elrejti. A böngészőmenü vagy a Beállítások felület **Alsó állapotsáv** kapcsolója ismét megjeleníti. A sáv elrejtésekor a weboldal és a kezdőlap kitölti a felszabaduló helyet. A magasság és a láthatóság normál munkamenetben újraindítás után is megmarad; a húzás Escape-pel visszavonható. A felső szél billentyűzettel is állítható.

## Letöltések

A Bővítmények és a Shields gomb közé új letöltésikon került. A kör és a számláló az aktív letöltéseket mutatja; kattintásra megnyílik a legutóbbi öt letöltés listája. Látható a letöltött méret, ismert teljes méretnél a százalék, az aktuális sebesség és az állapot. A lista szüneteltetést, folytatást, megszakítást, elkészült fájlnál megnyitást és mappában megmutatást kínál. Az összes munkameneti letöltés a teljes Letöltések panelen érhető el.

A fájlok a Windows Letöltések mappájába kerülnek. Azonos névnél számozott fájlnév készül, a meglévő fájl megmarad. A szokásos webes fájlletöltéshez nincs Tracer által bevezetett bájtkorlát. A privát ablak saját listát használ; a Ghost megszakítja az aktív letöltéseket és kiüríti a munkameneti listát.

## Bővítmények

A közös csomagkorlát **128 MiB letöltött CRX**, **256 MiB kibontott tartalom**, **64 MiB egy fájl** és **8192 fájl**, 120 másodperces előkészítési határidővel. Ugyanazok a korlátok érvényesek az áruházi kibontás és a kezelt mappába másolás során. A CRX3/Google proof, fájlútvonal, CRC és tényleges kibontási méret ellenőrzése megmarad. A megszakítás együttműködő worker-jelzést használ; a futó natív zlib művelet lezárulhat, majd a worker biztonságosan kilép.

Valódi weboldali `contextMenus` támogatás készült, beleértve a szülőmenüt, kiválasztott szöveget, jelölő- és rádiómenüt, URL-szűrést és a bővítmény kattintási eseményét. A motorból leállított Manifest V3 háttérszolgáltatás a menü kattintásakor újraindítható. Az eszköztár/lapfül menükörnyezetek nem tartoznak ehhez a megvalósításhoz.

Az opcionális `tabs`, `notifications` és webhelyengedélyek külön natív jóváhagyást kérhetnek. A támogatott értesítések valódi rendszerértesítések. Stabil kulccsal rendelkező bővítménynél a jóváhagyott webhelyengedélyek külön, frissen ellenőrzött futtatási másolatban lépnek érvénybe, natív újrabetöltéssel. Az eredeti hitelesített csomag változatlan marad. A megnyitott bővítményoldalak újratöltődnek; a jóváhagyás megmarad, és az opcionális jogok visszavonhatók. Kulcs nélküli helyi csomag opcionális webhelyengedélyét a böngésző nem változtatja meg, mert az útvonalváltás megváltoztatná a bővítmény azonosítóját.

A `tabCapture.capture({audio:true}, callback)` előtérbeli bővítményfelületen valódi hangfolyamot adhat a tulajdonos ablak aktív normál lapjáról, külön felhasználói jóváhagyás után. A tíz másodpercig érvényes natív azonosító a kérő felülethez kötött. Mikrofon- vagy rendszerhang-hozzáférést ez az út nem ad. A háttérszolgáltatás/offscreen `getMediaStreamId` átadása, videórögzítés és egyedi médiakorlátok még nem támogatottak. Az alapja a motor [WebContents hangfolyam-azonosítója](https://raw.githubusercontent.com/electron/electron/v44.7.0/docs/api/web-contents.md).

### A megadott két bővítmény

- **SynQ 4.0.8**, `jcdmcpefbebkldopabclefjaggejocff`: a hiteles csomag első beállítása opcionális lap-, értesítés- és webhelyengedélyt kér. A beállítási felületen az Accept után hagyd jóvá a Tracer párbeszédablakában kért hozzáférést. Az eredeti bővítményen ellenőriztük a Spotify, Apple Music, YouTube Music és Amazon Music választójának megjelenését, a natív webhely-hozzáférést és a relatív `tabs/onboard.html` beállítási oldal betöltését. A zenei szolgáltatásokkal való fiókos kapcsolat még nincs tesztelve.
- **Shazam 2.7.0**, `mmioliijnhnoblpgimnlajmefafdfilb`: indíts hangot az aktív normál lapon, majd nyisd meg a bővítményt és hagyd jóvá a lap hangjának rögzítését. A hiteles csomag saját AudioContextje valódi, csak hangot tartalmazó MediaStreamet kapott a natív próbán; a leállítás után a hangsávok lezárultak. Az online dalfelismerés nincs igazolva. A bővítmény saját egyszeres stop útvonala kétszer zárja ugyanazt az AudioContextet, ami figyelmeztetést ad; az adapter a hangfolyamot ettől függetlenül rendben leállítja.

Az eredeti, változatlan csomagok futtatási bizonyítékai és képei: SynQ/Shazam natív jelentés (`../artifacts/extension-compatibility-0.3.5/vendor-runtime-report.json`). Ez a próba helyi hangot és weboldalt használt, tiltott külső hálózattal; nem küldött fiókadatot vagy hangmintát a szolgáltatóknak.

A Bitwarden 2026.9.3 ellenőrzött csomagja kibontva 86,4 MB, és kötelező `contextMenus` engedélyt kér; a korábbi méretkeret és API-elutasítás megszűnik. A Dark Reader, uBlock Lite és Bitwarden csomageredete és mérete is ellenőrzött, teljes működésük nincs igazolva. A Proton Pass fiókos belépése és automatikus kitöltése továbbra is külön élő próba tárgya. Teljes Chrome Web Store/API-kompatibilitás nem állítható. Részletes csomagadatok: `artifacts/extension-compatibility-0.3.5/report.json`.

## Telepítés és ellenőrzés

Az új telepítő: Tracer 0.3.5 Windows x64 (`../dist/Tracer-Setup-0.3.5-x64.exe`). A telepítés után indítsd újra a Tracert. A futó böngészőt nem zárjuk be automatikusan. A végleges mérési eredmények és a csomag ellenőrzőösszege az ellenőrzési jegyzőkönyvben (`VALIDATION.md`) szerepelnek.
