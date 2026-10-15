# Tracer 0.3.4 — áruház, HTML-fájlok és lapsorrend

## Bővítmény hozzáadása

A Chrome Web Store a Chrome saját telepítési felületét ellenőrzi. Emiatt a webhely eredeti „Hozzáadás” gombja Tracerben szürke lehet; ez nem az adott bővítmény csomagellenőrzésének eredménye.

A hivatalos áruház bővítményoldalának jobb alsó sarkában most külön **Hozzáadás a Tracerhez** gomb jelenik meg. A címmező melletti azonos gomb is közvetlenül indítja az ellenőrzést. A Tracer letölti és hitelesíti az eredeti csomagot, majd megmutatja a kért engedélyeket a meglévő jóváhagyási ablakban. A már telepített bővítménynél az oldali gomb a kezelőt nyitja meg. Magyar és angol felirat, valamint az áruház oldalon belüli navigációja is támogatott. A telepítő a kattintáskor kiválasztott linket tartja meg akkor is, ha a panel megnyitása közben az aktív lap vagy az áruházi oldal megváltozik.

A weboldal nem kap böngészőparancsokat vagy nyers Electron IPC-t. A külön híd kizárólag az aktuális, aktív normál Tracer-lap HTTPS áruházi főkeretétől fogad valódi kattintást; a bővítmény azonosítóját a főfolyamat az oldal tényleges címéből olvassa ki. A telepítési jóváhagyás és az API-kompatibilitás ellenőrzése megmarad. Nem támogatott API-t igénylő csomag továbbra is konkrét hibaüzenetet adhat.

## Helyi HTML megnyitása

- **Ctrl+O**, vagy a böngészőmenü **HTML-fájl megnyitása…** pontja: válaszd ki a fájlt.
- Címmező: írd be például `C:\Saját mappa\bemutató.html` vagy `file:///C:/Saj%C3%A1t%20mappa/bemutat%C3%B3.html`.
- Windows: jobb kattintás a `.html` vagy `.htm` fájlon, **Megnyitás ezzel → Tracer**. Az új telepítő regisztrálja ezt a választást.

A HTML-lapról weboldalra vezető hivatkozás után a **Vissza/Előre** is működik. A böngésző új nézetben tölti be a céloldalt, és a helyi fájl visszaállítása előtt újra ellenőrzi az eredetileg engedélyezett fájlt és mappát. A weboldal nem használhatja ezt a korábbi fájljogosultságot.

A fájl normál Tracer-lapon nyílik meg, a saját mappájában lévő stíluslapokkal, szkriptekkel és képekkel. Az oldal sandboxolt, nincs Node.js- vagy Tracer-kezelőhídja. A fájlolvasás a megnyitott HTML tényleges mappájára és annak almappáira korlátozott; más mappa, UNC-megosztás, HTTP-iframe vagy junction nem bővíti ezt. Egy hiányzó fájl látható hibát ad. A privát, Tor és Sandbox mód helyi HTML-megnyitást nem enged.

## Lapfülek sorrendje

Fogd meg a fül címét, és húzd vízszintesen a kívánt helyre. A lapok a húzás közben mutatják az új sorrendet; elengedéskor a böngésző lapmodellje is frissül. A lapbezáró és némításgomb nem indít húzást. Hosszabb fülsoron a szélekhez húzás görget. Escape vagy a fülsoron kívüli elengedés megszakítja az átrendezést.

A rögzített lapok az első csoporton belül rendezhetők; a többi lap mögöttük marad. A húzás nem tölti újra és nem aktiválja a háttérlapot. A normál munkamenet mentése az új sorrendet rögzíti. A bővítményadapter `tabs.onMoved` eseménye a valós lapazonosítót és helyváltoztatást küldi.

## Ellenőrzési bizonyíték

Az új regressziók az áruházi híd eredet- és munkamenetellenőrzését, a többnyelvű/SPA felületet, a HTML-útvonalak kezelését, a fájlmappa korlátait és a lapok átrendezését vizsgálják. A natív Chromium-próba elkülönített profilt és helyi HTTP/HTTPS oldalakból álló tesztkörnyezetet használ. Az áruházi bővítmény eredeti CRX3 és Google proof hitelesítése fut; a valódi hálózati letöltés helyett ellenőrzött csomagfixture érkezik. A próbák nem változtatják meg a felhasználó böngészőprofilját vagy alapértelmezett alkalmazását.

Végső eredmény: **465/465 egységteszt**, **90 JavaScript-fájl és a JSON-konfigurációk** szintaxisellenőrzése, **113 natív ellenőrzés a forrásból és ugyanaz a 113 a csomagolt Tracer.exe-ben**, továbbá **9 újraindítási ellenőrzés négy folyamatindítással** sikeres. A HTML → HTTP → Vissza/Előre, a megjegyzett fájljogosultság HTTP-oldali használatának tiltása és a húzással mentett lapsorrend visszaállítása is része a natív próbának. A telepítő 15 érintett futtatási forrásfájlja bájtra egyezik a végleges forrással. Bizonyíték: `artifacts/verification-0.3.4.json` és ellenőrzési jegyzőkönyv (`VALIDATION.md`).

## Telepítés

Futtasd a Tracer 0.3.4 Windows x64 telepítőt (`../dist/Tracer-Setup-0.3.4-x64.exe`), majd indítsd újra a Tracert. Az elkészült csomag helyi fejlesztői build, Authenticode-aláírás nélkül; nem telepítettem automatikusan a futó böngésző helyére.

A végső, csak olvasási ellenőrzéskor a gépre telepített példány már **0.3.4**, és ugyanaz a 15 futtatási forrásfájl egyezik a végleges csomaggal (`artifacts/installed-content-0.3.4.json`). A futó böngészőt nem zártam be; újraindítással tölthető be biztosan az aktuális kód.

Méret: **155 784 186 bájt**. SHA-256: `2cd81cc4939ee7093b41ac5c0b02dc2878a61c4867bde99c7c0a131622bb3651`. A telepítő, a `.sha256` kísérőfájl és a `latest-x64.json` manifest ellenőrzőösszege egyezik.
