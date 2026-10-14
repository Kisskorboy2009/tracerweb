# Ellenőrzési jegyzőkönyv — 2026. október 13.

## Aktuális 0.3.7 ellenőrzés

**Android kiegészítés, 2026. október 13.:** elkészült a Tracer Preview 0.3.7 APK (versionCode 3007). A Kotlin/Java és R8 build sikeres, **23/23 JVM-teszt**, lint: **0 hiba, 61 figyelmeztetés**. A normál munkamenet-visszaállítás, kattintásból nyíló ablakok, teljes képernyős média, letöltések és oldalműveletek implementációja bekerült. Az APK-aláírás, a fordított manifest, az öt asset, a fájlméret és az ellenőrzőösszeg egyezik. A fizikai készülékes és emulátoros futtatás továbbra nincs igazolva. Részletek: [Android ellenőrzési jegyzőkönyv](mobile/ANDROID_BUILD_VALIDATION.md).

A maximalizált indulás, a böngészősávokat elrejtő F11 mód, a külön Tracer-párbeszéd nélküli videó-teljesképernyő, az automatikus letöltési panel és a külön Windows-klienshez vezető ellenőrzött protokollátadás elkészültek. Windows x64, Node 24.18.0, Electron 44.7.0 / Chromium 152.0.7977.130. Használat és korlátok: [UPDATE_0.3.7.md](UPDATE_0.3.7.md).

| Ellenőrzés                                                 | Eredmény                                                                | Bizonyíték                                                                                                                                             |
| ---------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Összes Node-teszt                                          | **605/605 sikeres; 0 hibás, kihagyott vagy megszakadt**                 | unit-tests-0.3.7.log (`../artifacts/unit-tests-0.3.7.log`)                                                                                              |
| JavaScript/JSON szintaxis                                  | **109 JS-fájl és a JSON-ok sikeresek**                                  | syntax-tests-0.3.7.log (`../artifacts/syntax-tests-0.3.7.log`)                                                                                          |
| Forrásból futó natív Chromium integráció                   | **167/167 ellenőrzés sikeres**                                          | browser-smoke-0.3.7.json (`../artifacts/browser-smoke-0.3.7.json`), browser-tests-0.3.7.log (`../artifacts/browser-tests-0.3.7.log`)                     |
| Végleges csomagolt Tracer.exe                              | **Ugyanaz a 167/167 ellenőrzés sikeres**                                | browser-packaged-smoke-0.3.7.json (`../artifacts/browser-packaged-smoke-0.3.7.json`), packaged-tests-0.3.7.log (`../artifacts/packaged-tests-0.3.7.log`) |
| Újraindítás és munkamenet-visszaállítás                    | **11 ellenőrzés, 4 folyamatindítás sikeres**                            | session-restart-smoke-0.3.7.json (`../artifacts/session-restart-smoke-0.3.7.json`), restart-tests-0.3.7.log (`../artifacts/restart-tests-0.3.7.log`)     |
| Csomagolt futtatási kód, konfiguráció, assetek és licencek | **105 fájl bájtra egyezik; csomagverzió 0.3.7**                         | packaged-content-0.3.7.json (`../artifacts/packaged-content-0.3.7.json`)                                                                                |
| Külön csomagolt Tor-készlet                                | **18 fájl bájtra egyezik**                                              | packaged-content-0.3.7.json (`../artifacts/packaged-content-0.3.7.json`)                                                                                |
| Windows x64 telepítő                                       | **Elkészült, 155 828 427 bájt; manifest és SHA-256 kísérőfájl egyezik** | Tracer-Setup-0.3.7-x64.exe (`../dist/Tracer-Setup-0.3.7-x64.exe`), build-0.3.7.log (`../artifacts/build-0.3.7.log`)                                      |
| Authenticode állapot                                       | **NotSigned; helyi fejlesztői telepítő**                                | installer-signature-0.3.7.json (`../artifacts/installer-signature-0.3.7.json`)                                                                          |

A teljes integráció **13 teljesképernyő-ellenőrzést és 9 külsőprotokoll-ellenőrzést** is tartalmaz, mind a forrásból, mind a csomagolt változatban. A teljesképernyő-próba valódi F11/Escape és videóbemenetet, iframe-et, privát ablakot, Ctrl+L/Ctrl+F visszatérést, háttérlap-elutasítást és megszűnt nézetet használ. Az induló ablak maximalizált marad a natív teljesképernyő-állapot bekapcsolása nélkül. F11 közben videóból kilépve a korábbi böngésző-teljesképernyő megmarad. A tiltott háttérkérésnél az Electron DOM Promise-a nem zárult le; az elutasítást a tényleges natív engedélycallback `granted: false` értéke, az üres `fullscreenElement` és a változatlan ablakállapot igazolja.

A külső protokoll próba valódi natív böngészőbemenettel éri el a produkciós útvonalat; a regisztrált alkalmazás lekérdezését és a `shell.openExternal` hívást tesztfüggvény rögzíti. Hiányzó kliens, mesterséges kattintás, ugyanazon felhasználói műveletből indított két kérés és navigáció közben elavuló alkalmazáslekérdezés is ellenőrzött. A címsorba írt SFTP-cím a kezdőlapon is használható, a visszatérő állapot teljes böngészősnapshot, az eredeti lap megmarad. **Valódi külső kliens bejelentkezése, SFTP/SSH-kapcsolat vagy fájlátvitel nincs igazolva.**

A külön, csak olvasó Windows-hozzárendelési jelentés (`../artifacts/external-handler-status-0.3.7.json`) SFTP, SSH, SCP, FTPS és FTPES esetén a konkrét WinSCP-alkalmazásnevet adta vissza; Steam, Discord és mailto esetén Steam, Discord és Outlook szerepel. FTP, tel és sms esetén a „Válasszon egy alkalmazást” eredmény a Windows választója, nem konkrét kliens igazolása. Magnet-kezelő nem volt. Ez helyi konfigurációs adat; a lekérdezés nem indított külső alkalmazást és nem próbált hálózati kapcsolatot.

Az automatikus letöltési panel ismert és ismeretlen méretű tényleges HTTP-letöltéssel, növekvő bájtprogresszel, párhuzamos indulással, gyors befejezéssel, háttérlappal, privát ablakkal és kiválasztott mentési útvonallal futott. Az Escape után a progressz nem nyitja újra a panelt; új fájl ismét megnyithatja. A teljesképernyő-állapot visszavonja a készülő előnézetet és nem enged holt overlayt az oldal fölé. A korábbi kép-, hivatkozás-, hang-, iframe-blob és HTML/MHTML mentési próbák a teljes 0.3.7 integrációban is szerepelnek.

Telepítő SHA-256: `5a093f846c09d64f839b01e8c2a5cd0f946ca6a247b26a3f03c029cdc856738b`. Összesített eredmény: **PASS**, verification-0.3.7.json (`../artifacts/verification-0.3.7.json`). Megismételhető tartalomellenőrzés: `node artifacts/verify-release-0.3.7.cjs`. Automatikus telepítés nem történt.

A helyi letöltési oldal a 0.3.7 Windows-csomagot és Android Preview APK-t kínálja; a fájlok mérete és SHA-256-a egyezik. A Windows korábbi ellenőrzésének parancsa: `npm.cmd run website:build -- --release-directory artifacts/website-release-0.3.7`; buildnapló (`../artifacts/website-build-0.3.7.log`), ellenőrzési eredmény (`../artifacts/website-release-validation-0.3.7.json`). A 2026. október 13-i Android-frissítés és weboldal-export a `dist/` aktuális csomagjait használja a `npm.cmd run website:build` paranccsal. A korábbi Android 0.3.2 APK archívum marad; távoli közzététel nem történt.

A hat elkülönített natív mentéskötési próba **0.3.6-os**, a hiteles SynQ/Shazam vendor futás **0.3.5-ös, továbbvitt bizonyíték**; újra lefuttatott 0.3.7 vendor próbát nem állítunk. Az összesített jelentés ezt `carriedForward` jelöléssel őrzi. Külső fiókos bejelentkezés, szolgáltatáskapcsolat vagy online dalfelismerés továbbra sincs igazolva. A Windows-csomag ellenőrzése nem jelent mobilcsomagot vagy távoli közzétételt.

## Korábbi 0.3.6 ellenőrzés

A felső sáv kattintható területei, a kezdőlapóra és fókuszkártya kapcsolója, a letöltési buborék előnézete, a natív **Mentés másként** és **Ctrl+S** oldalmentés elkészültek. A forrásból futó Windows x64 változat ellenőrzése sikeres: Node 24.18.0, Electron 44.7.0 / Chromium 152.0.7977.130. Használat és korlátok: [UPDATE_0.3.6.md](UPDATE_0.3.6.md).

| Ellenőrzés                                                 | Eredmény                                                                 | Bizonyíték                                                                                                                                                 |
| ---------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Összes Node-teszt                                          | **569 sikeres; 0 hibás, kihagyott vagy megszakadt**                      | `unit-tests-0.3.6.log` (`../artifacts/unit-tests-0.3.6.log`)                                                                                                |
| JavaScript/JSON szintaxis                                  | **103 JS-fájl és a JSON-ok sikeresek**                                   | `syntax-tests-0.3.6.log` (`../artifacts/syntax-tests-0.3.6.log`)                                                                                            |
| Forrásból futó natív Chromium integráció                   | **143 ellenőrzés sikeres**                                               | `browser-smoke-0.3.6.json` (`../artifacts/browser-smoke-0.3.6.json`), `browser-tests-0.3.6.log` (`../artifacts/browser-tests-0.3.6.log`)                     |
| Újraindítás és munkamenet-visszaállítás                    | **11 ellenőrzés, 4 folyamatindítás sikeres**                             | `session-restart-smoke-0.3.6.json` (`../artifacts/session-restart-smoke-0.3.6.json`), `restart-tests-0.3.6.log` (`../artifacts/restart-tests-0.3.6.log`)     |
| Iframe-blob natív helyi menü és mentés                     | **Valódi gyermekkeret, elérhető mentésparancs és pontos mentett bájtok** | `iframe-context-production-report-0.3.6.json` (`../artifacts/iframe-context-production-report-0.3.6.json`)                                                  |
| Elkülönített natív mentési kéréskötés                      | **6 sikeres próba; eredeti bájtok és kiválasztott útvonal megmarad**     | Az alább felsorolt hat `native-save-binding` jelentés                                                                                                      |
| Végleges csomagolt Tracer.exe                              | **Ugyanaz a 143 ellenőrzés sikeres**                                     | `browser-packaged-smoke-0.3.6.json` (`../artifacts/browser-packaged-smoke-0.3.6.json`), `packaged-tests-0.3.6.log` (`../artifacts/packaged-tests-0.3.6.log`) |
| Csomagolt futtatási kód, konfiguráció, assetek és licencek | **101 fájl bájtra egyezik; csomagverzió 0.3.6**                          | `packaged-content-0.3.6.json` (`../artifacts/packaged-content-0.3.6.json`)                                                                                  |
| Külön csomagolt Tor-készlet                                | **18 fájl bájtra egyezik**                                               | `packaged-content-0.3.6.json` (`../artifacts/packaged-content-0.3.6.json`)                                                                                  |
| Windows x64 telepítő                                       | **Elkészült, 155 816 894 bájt; manifest és SHA-256 kísérőfájl egyezik**  | `Tracer-Setup-0.3.6-x64.exe` (`../dist/Tracer-Setup-0.3.6-x64.exe`), `build-0.3.6.log` (`../artifacts/build-0.3.6.log`)                                      |
| Authenticode állapot                                       | **NotSigned; helyi fejlesztői telepítő**                                 | `installer-signature-0.3.6.json` (`../artifacts/installer-signature-0.3.6.json`)                                                                            |

A natív integráció igazolja a **Ctrl+F mellett pixelre illeszkedő előnézetet**, az ablakméretezés közbeni elavult buborék bezárását és az Escape-pel visszavont késői előnézetet. A felső él kattintásai, a 600-as betűvastagságú óra, a fókuszkártya elrejtése és billentyűzetfókusz-visszaállítása is ellenőrzött. A rejtett fókuszkártya beállítása négy új folyamatindításon és Ghost után is megmarad.

A natív mentési próbák elvetett mentési párbeszédet, kép-, hivatkozás-, hang- és iframe-blob mentést használnak. A gyermekkeret próba valódi Chromium-kerethez küldött CDP-bemenettel nyitja meg a natív helyi menüt; a mentett PNG bájtra egyezik a forrással. A **Ctrl+S** próba meglévő kijelölt HTML-fájlt cserél atomi módon, és tényleges relatív erőforráshivatkozásokat ellenőriz. A böngészőmenüből mentett `.mht` fájl valódi MHTML-archívum.

A hat elkülönített forrásból futó natív próba külön ellenőrzi a kéréshez kötött mentési útvonalat és a sértetlen tartalmat: HTTP (`../artifacts/native-save-binding-0.3.6-http.json`), adat-URL (`../artifacts/native-save-binding-0.3.6-data.json`), 64 KiB adat-URL (`../artifacts/native-save-binding-0.3.6-data-large.json`), blob (`../artifacts/native-save-binding-0.3.6-blob.json`), HTTP-átirányítás (`../artifacts/native-save-binding-0.3.6-redirect.json`) és helyi fájl (`../artifacts/native-save-binding-0.3.6-file.json`). Ezek mellett a teljes integráció a valódi gyermekkeretből indított blob-mentést is igazolja. A szokásos fájlletöltések és a 0.3.5 bővítménykeretek változatlanok. Teljes streaming- vagy DRM-export nincs igazolva.

Telepítő SHA-256: `dbac4b9c23fbd844a24ccb151b549bbf80628ade6f1e4e5faa9c360e573db655`. Az összesített eredmény sikeres: `verification-0.3.6.json` (`../artifacts/verification-0.3.6.json`); megismételhető tartalomellenőrzés: `node artifacts/verify-release-0.3.6.cjs`. A helyi fejlesztői telepítő Authenticode-aláírás nélkül készült. Automatikus telepítés nem történt; a futó felhasználói böngészőt a próbák nem zárták be. A 0.3.5 hiteles SynQ/Shazam vendor mérése korábbi eredményként marad érvényes; új fiókos belépést vagy online dalfelismerést a 0.3.6 ellenőrzés sem állít.

A helyi letöltési oldal a 0.3.6 Windows-csomagra frissült. A build a telepítő méretét és SHA-256-át ellenőrizte, és a verziószámot tartalmazó útmutatókat is exportálja. Parancs: `npm.cmd run website:build -- --release-directory artifacts/website-release-0.3.6`; log: `website-build-0.3.6.log` (`../artifacts/website-build-0.3.6.log`). A korábbi Android 0.3.2 APK archívum marad; 0.3.6 mobilcsomag és távoli közzététel nem készült.

## Korábbi 0.3.5 ellenőrzés

Az animált fülhúzás, a hosszú lapsáv régebbi füleinek elérése, az állítható és elrejthető alsó sáv, az eszköztári letöltéslista és a bővítményadapterek elkészültek. **541/541 Node-teszt sikeres, 0 kihagyással.** Windows x64, Node 24.18.0, Electron 44.7.0 / Chromium 152.0.7977.130. Használat: [UPDATE_0.3.5.md](UPDATE_0.3.5.md).

| Ellenőrzés                                                 | Eredmény                                                                                                          | Bizonyíték                                                                          |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Összes Node-teszt                                          | **541 sikeres; 0 hibás, kihagyott vagy megszakadt**                                                               | `artifacts/unit-tests-0.3.5.log`                                                    |
| JavaScript/JSON szintaxis                                  | **103 JS-fájl és a JSON-ok sikeresek**                                                                            | `artifacts/syntax-tests-0.3.5.log`                                                  |
| Natív Chromium integráció                                  | **130 ellenőrzés sikeres**                                                                                        | `artifacts/browser-smoke-0.3.5.json`, `artifacts/browser-tests-0.3.5.log`           |
| Végleges csomagolt Tracer.exe                              | **Ugyanaz a 130 ellenőrzés sikeres**                                                                              | `artifacts/browser-packaged-smoke-0.3.5.json`, `artifacts/packaged-tests-0.3.5.log` |
| Újraindítás és munkamenet-visszaállítás                    | **10 ellenőrzés, 4 folyamatindítás**                                                                              | `artifacts/session-restart-smoke-0.3.5.json`, `artifacts/restart-tests-0.3.5.log`   |
| Csomagolt futtatási kód, konfiguráció, assetek és licencek | **101 fájl bájtra egyezik; csomagverzió 0.3.5**                                                                   | `artifacts/packaged-content-0.3.5.json`                                             |
| Külön csomagolt Tor-készlet                                | **18 fájl bájtra egyezik**                                                                                        | `artifacts/packaged-content-0.3.5.json`                                             |
| Hiteles SynQ 4.0.8                                         | **Jóváhagyott natív hostjog, szolgáltatásválasztó, relatív onboarding és weboldali script működik**               | `artifacts/extension-compatibility-0.3.5/vendor-runtime-report.json`                |
| Hiteles Shazam 2.7.0                                       | **Valódi audio MediaStream a bővítmény saját AudioContextjében; RMS 0,708417; a leállítás lezárja a hangsávokat** | ugyanaz a vendor jelentés                                                           |
| Windows x64 telepítő                                       | **Elkészült, 155 808 102 bájt**                                                                                   | `dist/Tracer-Setup-0.3.5-x64.exe`, `artifacts/build-0.3.5.log`                      |

Telepítő SHA-256: `29f7d596010f4c129502ca93bfffe50d96036c51f2f1d626660594b4e7fb3b6d`. A `.sha256` kísérőfájl és a manifest egyezik. Az Authenticode állapot `NotSigned`: helyi fejlesztői telepítő. A futó felhasználói böngészőt a teszt nem zárta be, a csomagot nem telepítette automatikusan. Összesített eredmény: `verification-0.3.5.json` (`../artifacts/verification-0.3.5.json`); megismételhető tartalomellenőrzés: `node artifacts/verify-release-0.3.5.cjs`.

A natív próbák tényleges pointeres fülhúzást és szomszédos animációt, csökkentett mozgást, Escape-visszavonást, régi fülekhez visszagörgetést és ismételt ablakméretezést használnak. A javított ResizeObserver ciklus nem eredményez renderelési hibát; a szigorú renderer-hibaellenőrzés mindkét végső futásban sikeres. Az alsó sáv tényleges húzása, elrejtése és visszakapcsolása a natív webnézet helyét is módosítja; magassága és láthatósága újraindítás után megmarad.

A helyi HTTP-letöltések ismert és ismeretlen teljes mérettel, valódi progresszel, szünettel/folytatással, megszakítással, befejezéssel és ütköző fájlnevekkel futnak. A panel megtartja a gombfókuszt állapotfrissítéskor. Az ablakhoz kötött műveletek és Ghost-törlés is ellenőrzött; a megnyitás/mappában mutatás shellhívását a smoke rögzített tesztfüggvény ellenőrzi, külső program indítása nélkül.

A bővítménypróba natív jobbklikkmenüt és Manifest V3 worker-kattintást, valós opcionális jóváhagyást és natív hostengedélyt, dinamikus scriptet, visszavonást és tényleges lap-hangfolyamot használ. A tíz másodperces médiaazonosítóhoz a valós forráslap és hívófelület tartozik; navigáció, megszűnt nézet, tiltott kontextus vagy Ghost megszünteti a hozzáférést. A Node-regressziók a visszavonás közbeni félkész hostbetöltés eltávolítását, elavult értesítési callbacket, aszinkron letöltési fájlnévfoglalást és időközben elnavigált bővítménylap helyreállításának elutasítását is igazolják.

A SynQ/Shazam vendor próba hitelesített, változatlan csomagokkal, helyi weboldallal és hanggal, tiltott külső hálózattal futott. **Bejelentkezés, zenei szolgáltatáskapcsolat és online dalfelismerés nincs igazolva.** A SynQ tiltott analytics kérései és a Shazam saját egyszeres stop útvonalának kétszeres AudioContext-zárási figyelmeztetése megmaradt a jelentésben; az utóbbi mellett a tényleges stream rendben leáll. A Bitwarden, Dark Reader és uBlock Lite csomageredete/mérete ellenőrzött, teljes működésük nem. A háttérszolgáltatás/offscreen `getMediaStreamId`, videórögzítés, egyedi médiakorlátok és a teljes Chrome API-kompatibilitás továbbra sincs megvalósítva.

A 0.3.5 ellenőrzésekor készült csomagolt képek: `artifacts/tracer-tab-drag-pointer-packaged.png`, `tracer-tabs-older-scroll-packaged.png`, `tracer-footer-resized-packaged.png`, `tracer-footer-hidden-packaged.png`, `tracer-footer-settings-packaged.png`, `tracer-download-progress-packaged.png` és `tracer-download-completed-packaged.png`. A közös nevű smoke jelentések későbbi futásokkal frissülhetnek; a 0.3.5 eredményeit a verziózott jelentések őrzik.

A helyi letöltési oldal a 0.3.5 Windows-csomagra frissült. A build a tényleges méretet és SHA-256-ot ellenőrizte, és az aktuális útmutatókat is exportálta. Parancs: `npm.cmd run website:build -- --release-directory artifacts/website-release-0.3.5`; log: `artifacts/website-build-0.3.5.log`. A kiadási könyvtár csak a jelenlegi Windows-telepítőt és kísérőit tartalmazza. A korábbi Android 0.3.2 APK változatlan archívum; 0.3.5 mobilcsomag és távoli közzététel nem készült.

## Korábbi 0.3.4 ellenőrzés

Az áruházi Tracer-gomb, helyi HTML-megnyitás és a lapfülek húzással történő átrendezése elkészült. **465/465 Node-teszt sikeres, 0 kihagyással.** Bizonyíték: `artifacts/unit-tests-0.3.4.log`. Használat és további ellenőrzési eredmények: [UPDATE_0.3.4.md](UPDATE_0.3.4.md).

| Ellenőrzés                              | Eredmény                                   | Bizonyíték                                                                          |
| --------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------- |
| JavaScript/JSON szintaxis               | **90 JS-fájl és a JSON-ok sikeresek**      | `artifacts/syntax-tests-0.3.4.log`                                                  |
| Natív Chromium integráció               | **113 ellenőrzés sikeres**                 | `artifacts/browser-smoke-0.3.4.json`, `artifacts/browser-tests-0.3.4.log`           |
| Végleges csomagolt Tracer.exe           | **113 ellenőrzés sikeres**                 | `artifacts/browser-packaged-smoke-0.3.4.json`, `artifacts/packaged-tests-0.3.4.log` |
| Újraindítás és munkamenet-visszaállítás | **9 ellenőrzés, 4 folyamatindítás**        | `artifacts/session-restart-smoke-0.3.4.json`, `artifacts/restart-tests-0.3.4.log`   |
| Csomagolt futtatási források            | **15 fájl bájtra egyezik**                 | `artifacts/packaged-content-0.3.4.json`                                             |
| Telepített példány, olvasási ellenőrzés | **0.3.4, ugyanaz a 15 forrásfájl egyezik** | `artifacts/installed-content-0.3.4.json`                                            |
| Windows x64 telepítő                    | **Elkészült, 155 784 186 bájt**            | `dist/Tracer-Setup-0.3.4-x64.exe`, `artifacts/build-0.3.4.log`                      |

Telepítő SHA-256: `2cd81cc4939ee7093b41ac5c0b02dc2878a61c4867bde99c7c0a131622bb3651`. A `.sha256` kísérőfájl és a manifest egyezik. Helyi fejlesztői csomag, Authenticode-aláírás nélkül; automatikus telepítés nem történt. Összesített eredmény: `artifacts/verification-0.3.4.json`.

A natív próbák valódi pointeres fülhúzást, háttérlap és WebContents megőrzést, rögzített lapcsoportot, Escape-visszavonást és mentett sorrend visszaállítását igazolják. A HTML-próba relatív fájlokat, helyi és HTTP-iframe korlátokat, valamint a HTML → HTTP → Vissza → Előre → Vissza láncot ellenőrzi. Az áruházi próba valós preloadot, szigorú CSP mellett megjelenő magyar/angol gombot, SPA-oldalváltást és natív kattintást használ. Helyi hálózati fixture-k és elkülönített profilok mellett fut; nem jelent minden Chrome API-ra vagy bővítményre teljes kompatibilitási igazolást.

A 0.3.4 futás akkori közös nevű smoke JSON-jainak verziózott másolatai megőrzik az eredményt. Az alábbi szakaszok további korábbi eredményeket dokumentálnak.

## Korábbi 0.3.3 ellenőrzés

A `navigationHistory` összeomlás és a natív OAuth popup kapcsolatának javítása, a sérült profil és Tor életciklus regressziói, valamint a saját Chrome API-adapter elkészült. Windows x64, Node 24.18.0, Electron 44.7.0 / Chromium 152.0.7977.130.

| Ellenőrzés                              | Eredmény                                                                           | Bizonyíték                                                                     |
| --------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Összes Node teszt                       | **433/433 sikeres, 0 kihagyás**                                                    | `artifacts/unit-tests-0.3.3.log`                                               |
| JavaScript/JSON szintaxis               | **83 JS-fájl és a JSON-ok sikeresek**                                              | `artifacts/syntax-tests-0.3.3.log`                                             |
| Natív Chromium integráció               | **104 ellenőrzés sikeres**                                                         | `artifacts/browser-smoke.json`                                                 |
| Végleges csomagolt Tracer.exe           | **104 ellenőrzés sikeres**                                                         | `artifacts/browser-packaged-smoke.json`, `artifacts/packaged-tests-0.3.3.log`  |
| Újraindítás és munkamenet-visszaállítás | **9 ellenőrzés, 4 folyamatindítás**                                                | `artifacts/session-restart-smoke.json`                                         |
| Valódi Proton Pass 1.42.0               | **Háttérszolgáltatás és magyar bejelentkezési felület működik, konzolhiba nélkül** | `artifacts/proton-pass-probe/adapter-runtime-report.json`, `adapter-popup.png` |
| Windows x64 telepítő                    | **Elkészült, 155 770 468 bájt**                                                    | `dist/Tracer-Setup-0.3.3-x64.exe`                                              |

Telepítő SHA-256: `a9cb71b031d880d06cd297ee6f4e2b6525c7ae6b9205c0695b5319c1e9f9713c`. A hét érintett futtatási modul csomagolt példányának forrásazonossága ellenőrzött (`artifacts/packaged-content-0.3.3.json`). A Proton próbája hitelesített, változatlan bővítményfájlokkal és tiltott külső hálózattal futott; a fiókos belépés, szinkron és automatikus kitöltés nincs igazolva. A hivatalos Youtube-shorts block natív integrációs próbája továbbra is sikeres. A teljes Chrome Web Store-kompatibilitás nincs igazolva. Részletes határok és reprodukálás: [TROUBLESHOOTING_0.3.3.md](TROUBLESHOOTING_0.3.3.md).

Az alábbi eredmények a 0.3.2 korábbi ellenőrzései; a közös nevű aktuális smoke jelentéseket a 0.3.3 próba frissítette.

## Korábbi 0.3.2 ellenőrzések

Windows x64, Node 24.18.0, Electron 44.7.0, Chromium 152.0.7977.130; Tracer 0.3.2.

| Ellenőrzés                                                           | Eredmény                                       | Bizonyíték                                                           |
| -------------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------- |
| JavaScript/JSON szintaxis                                            | **77 JS-fájl és a JSON-ok sikeresek**          | `npm run check`; a csomagolt bővítmények forrásai is                 |
| Címbiztonság, szabályszűrés, HTTPS, Context Fence, Quiet Lease       | Sikeres                                        | `tests/privacy.test.cjs`                                             |
| AES-GCM/scrypt, hibás jelszó, manipuláció és korlátos relay-válasz   | Sikeres                                        | `tests/privacy.test.cjs`                                             |
| Valódi EVM/Ed25519 üzenetaláírás, tárcazárolás és párhuzamosság      | Sikeres                                        | `tests/wallet.test.cjs`                                              |
| Tranzakciójóváhagyás visszavonásakor nincs broadcast                 | Sikeres, izolált mockkal                       | `tests/wallet.test.cjs`; nincs valódi tranzakció                     |
| Helyi témacsoportosítás különböző hosztok között                     | Sikeres                                        | `tests/grouping.test.cjs`                                            |
| Megjelenési schema, képfejléc, útvonal és importkorlátok             | Sikeres                                        | `tests/appearance.test.cjs`                                          |
| Új lapműveletek, IPC, Ghost közbeni késleltetett műveletek           | Sikeres                                        | `tests/backend.test.cjs`                                             |
| Normál munkamenet, privát kizárás, globális számlálók                | Sikeres                                        | `tests/profile-state.test.cjs`, `tests/backend.test.cjs`             |
| Chromium JSON/SQLite/SNSS, HTML, CSV, Firefox JSON import            | Sikeres                                        | `tests/browser-import.test.cjs`, `tests/backend.test.cjs`            |
| Fióktár, titkosítás, sérült fájl, atomi mentés és eredetkorlát       | Sikeres                                        | `tests/passwords.test.cjs`                                           |
| Valódi Windows rendszerkulcsos fióktár mentés/olvasás/törlés         | **Sikeres**                                    | `artifacts/password-vault-runtime.json`                              |
| Altatás, memóriahatár, rögzített lapok prioritása                    | Sikeres                                        | `tests/resources.test.cjs`                                           |
| Webhelyikonok, SVG/ICO/WebP méretkorlátok és session-cache           | Sikeres                                        | `tests/favicons.test.cjs`                                            |
| Képműveletek, forrásellenőrzés és visszavont lapok                   | Sikeres                                        | `tests/context-menu.test.cjs`                                        |
| Bővítményengedélyek, csomagimport, perzisztencia és Ghost            | Sikeres                                        | `tests/extensions.test.cjs`, `tests/backend.test.cjs`                |
| CRX3 aláírás, Google proof, ZIP/CRC és megszakítható worker          | **28/28 sikeres, kihagyás nélkül**             | `tests/chrome-store.test.cjs`                                        |
| Teljes előkészítési határidő és nagy ZIP feldolgozás közbeni abort   | Sikeres, 64 MiB tényleges kibontási próbával   | `tests/chrome-store.test.cjs`                                        |
| Promóciók elrejtése, visszaállítása és saját könyvjelző megőrzése    | Sikeres                                        | `tests/appearance.test.cjs`, Chromium próba                          |
| Öt CC0 háttér mérete, dekódolása, SHA-256 és előnézete               | **2 valódi 4K fotó és 3 Full HD illusztráció** | `scripts/wallpapers.py --verify`, `assets/wallpapers/sources.json`   |
| SOCKS5, Tor-felismerés, bootstrap, megszakítás és folyamatéletciklus | Sikeres                                        | `tests/tor.test.cjs`, `tests/backend.test.cjs`                       |
| Valódi csomagolt Tor motor kapcsolódása                              | **100% bootstrap és SOCKS5 sikeres**           | `artifacts/tor-runtime.json`                                         |
| Összes Node teszt                                                    | **380/380 sikeres, 0 kihagyás**                | `npm test`                                                           |
| Valódi Chromium integráció                                           | **97 ellenőrzés sikeres**                      | `npm run test:browser`, `artifacts/browser-smoke.json`               |
| Csomagolt Tracer.exe Chromium integráció                             | **Ugyanaz a 97 ellenőrzés sikeres**            | `npm run test:packaged`, `artifacts/browser-packaged-smoke.json`     |
| ASAR worker és a csomagolt saját bővítménykatalógus                  | Sikeres                                        | Chromium próba; `artifacts/cws-asar-worker-report.json`              |
| Csomagolt források, képek, licencek és saját bővítmények egyezése    | **60 fájl egyezik**                            | `artifacts/packaged-content-0.3.2.json`                              |
| Valódi újraindítás, lap-visszaállítás és Ghost                       | **9 ellenőrzés, 4 folyamatindítás**            | `npm run test:restart`, `artifacts/session-restart-smoke.json`       |
| WPF bootstrapper Release fordítás                                    | **Sikeres, 0 figyelmeztetés/hiba**             | `dotnet build installer/bootstrapper/Tracer.Setup.csproj -c Release` |
| Windows x64 offline NSIS csomag                                      | **Sikeresen elkészült**                        | `dist/Tracer-Setup-0.3.2-x64.exe` és `.sha256`                       |
| Csomagolt Tor motor, forrás, licenc és teljes fájlintegritás         | **17 fájl egyezik, verziópróba sikeres**       | `artifacts/tor-packaged-runtime.json`                                |
| Futtatási függőségek npm auditja                                     | **0 ismert advisory**                          | `npm audit --omit=dev`                                               |

A Chromium próba helyi HTTP fixture-t és külön ideiglenes profilt használ. Az előző böngészőbiztonsági ellenőrzések mellett igazolja a hat alapgyorslinket, a 18 témaválasztást és 14 hangsúlyszínt, az összes háttér valódi dekódolását, a JPEG/PNG/WebP importot és törlést, a téma/perzisztencia/mozgáscsökkentés működését, az 820×600-as elrendezést, a natív lapnémítást, izolált zoomot, keresést, PNG-mentést és visszanyitást. A címsor-javaslatok, parancspaletta, keresősáv és lapkezelő a tényleges natív webnézettel együtt szerepel a próbában; a Ghost fókuszban hagyott címsor mellett is üríti a felületet. Nem helyettesít teljes böngészőkompatibilitási, terhelési vagy behatolási tesztet.

A 0.3.0 ellenőrzései a hat tényleges helyi webhelyképet, a kereső fókuszanimációját és a perifériák `inert` állapotát, a billentyűzettel kezelhető beállításlistákat, a kezdőlap valódi frissítését és új lap nélküli visszatérést is lefedik. A globális számlálók több normál ablakból összegződnek és lemezre kerülnek; a privát és sandbox forgalom kimarad. A normál munkamenet rögzítése, némítása, zoomja, aktív lapja és a háttérlapok késleltetett betöltése igazolt.

A 0.3.1 próba tényleges PNG/SVG/ICO favicon-dekódolást, füleken és könyvjelzősávban megjelenítést, navigáció közben visszavont ikont, privát cache-izolációt és ugyanazon webhely lapjai közötti ikoncsere utáni visszatérést is vizsgál. A jobb klikkes képmenü valódi Chromium-koordinátákon jelenik meg; a HTTP-, data- és blob-kép mentése bájtról bájtra egyezik a fixture-rel. A képmásolás natív API-hívása mockolt, így a teszt nem ír a felhasználó vágólapjára.

A Tor-routing próba helyi SOCKS5 relayjel ellenőrzi a loopback-megkerülés kikapcsolását, a hosztnév proxyn átadását és a közvetlen fallback hiányát a proxy leállása után. A csomagolt valódi Tor motor 100%-os bootstrapja külön futási bizonyíték. Ezek nem jelentenek Tor Browser szintű anonimitási auditot.

A kétcsomagos bővítménykatalógus natív jóváhagyását, a megszakítás utáni változatlan állapotot, az Olvasáskomfort tényleges tartalomszkriptjét és `chrome.storage.local` beállítását, a sandboxolt felugró ablakot, a kapcsolók perzisztenciáját, a privát kizárást és az eltávolítást is vizsgáljuk. A Shorts Cleaner elrejtését, átirányítását és az időparaméter megőrzését szintetikus, proxyn keresztül kiszolgált YouTube-címen teszteljük; a próba nem ér el valódi YouTube-oldalt vagy felhasználói fiókot.

A 0.3.2 a hivatalos, aláírt **Youtube-shorts block 1.5.5** áruházi CRX-et is ténylegesen telepíti. A transport helyi fixture-választ ad; az éles CRX3/Google proof/ZIP/CRC ellenőrzés, a külön worker, az engedélyezés és a natív Chromium-betöltés változatlan. A próba lefedi az áruházi gombot, a hibás URL-t, a megszakított jóváhagyás takarítását, a tartalomszkriptet, a felugró felületet, a valódi áruházi azonosítót, a ki-be kapcsolást és eltávolítást. A csomag SHA-256: `4461b98e73726ea87d56a60f0381091884a268b00442123f4310ed53c9fbafac`. A Chromium által törölt egyetlen foglalt metadata fájl elhagyása teljes hitelesítés után történik; a többi tárolt fájl tartalmi integritása megmarad. A teljes Chrome API-kompatibilitás és a Proton Pass működése nincs igazolva; a Proton jelenleg elutasított. Részletek: [CHROME_COMPATIBILITY.md](CHROME_COMPATIBILITY.md).

A saját katalóguscsomagok a fizikai `app.asar.unpacked/assets/extensions` mappából települnek. Ez elkerüli a szintetikus ASAR stat és a tényleges fájldescriptor eltérő inode-ját, miközben az importok fájlazonosság-ellenőrzése változatlan. A csomagolt próba a két saját bővítmény és a külső áruházi csomag útját is igazolja.

Az új háttérpróba mind az öt letöltött CC0 kép tényleges dekódolását és valós felbontását ellenőrzi; az illusztrációkat nem nagyítottuk 4K-ra. A promóciós teszt a kezdőlapot, könyvjelzősávot, helyi javaslatokat és parancspalettát is vizsgálja, beleértve az elrejtés tartósságát, visszaállítását és az azonos URL-re mentett saját könyvjelző megtartását.

Az importpróbák kizárólag szintetikus böngészőprofilokat és exportokat használnak. Valódi SQLite adatbázist olvasnak, ellenőrzik az előnézet megszakítását, a token egyszeri használatát, a duplikátumok összevonását és a HTML/Firefox/CSV felületi műveleteket. A valódi Windows-titkosítással mentett fióktár nem tartalmaz egyszerű szöveges jelszót. Helyi HTTPS tesztoldalon a kitöltés működik, a más eredetű iframe és a hibás eredet kizárt; a vágólap teljesen mockolt, ezért a felhasználó vágólapja nem kapott tesztjelszót.

A külön újraindítási próba az éles belépési pontot négy friss Electron-folyamatban futtatja elkülönített profillal. Igazolja az alkalmazásbezárás és az utolsó normál ablak bezárása utáni visszaállítást, a privát lapok kihagyását, valamint azt, hogy Ghost után a törölt lapok a következő folyamatban sem térnek vissza. A rendszerkulcsos fióktár külön futási próbája Electron alatt mentést, olvasást, törlést és sérült titkosított fájl visszautasítását ellenőrizte.

A natív képfájl-, import- és mentésdialógus válaszait a teszt helyi fixture-útvonalakkal helyettesíti; a képek dekódolása, mentése és a WebContents műveletei ténylegesek. A képes natív inputhoz az ablak röviden megjelenik és fókuszt kap. A próba idejére csak az érintett fixture WebContents throttlingját kikapcsoljuk, majd visszaállítjuk; időkorlátos dupla animation frame és friss fókuszellenőrzés után küld tényleges inputot. Legfeljebb háromszor csak a kézbesítetlen esemény ismételhető; a helyes képre érkezett trusted contextmenu hibás menüvel azonnal hibának számít. A szándékosan érvénytelen háttérazonosító és áruházi URL, megszakított importtoken, hibás HTTPS eredet és privát fióktár-hozzáférés visszautasítása várt IPC-hibákat ír a smoke logba; a teszt ezeket külön igazolja.

A Windows compositor esetleges első képrögzítési hibája egyszeri, helyi újrapróbálást kapott. Ez átmenetileg csak az érintett lap throttlingját változtatja és visszaállítja; a Ghost vagy lapváltás érvényteleníti a mentést. A regressziótesztek siker, ismételt hiba és Ghost közbeni megszakítás esetén is ellenőrzik a helyreállítást.

A 0.3.2 telepítő **155 753 989 bájt**. SHA-256: `c9406f644d98c89355bdc34de4fbc6820ecb5663f51d595cf90ebd6af5dc8a40`. A mellékelt `.sha256` és `latest-x64.json` ugyanazt a helyi csomagot azonosítja; a manifest és a telepítő aláíratlan. A csomagolt Tor összes fájlja egyezik a build előtti, ellenőrzött készlettel; a mellékelt Tor 0.4.9.13 motor verziópróbája és felismerése sikeres. A korábbi WPF Release-, rendszerkulcsos fióktár- és valódi Tor bootstrap-próba eredménye a változatlan komponensekre megmarad; a 0.3.2 csomag Tor hash- és verzióellenőrzése újra lefutott.

## Reklámvédelem, landing oldal és Android előzetes

A Discord-fejlesztést megelőző 0.3.2 ellenőrzés **247/247 Node-tesztet és 79/79 Chromium-ellenőrzést** teljesített a forrásból és a csomagolt Tracer.exe-ből is. A külön újraindítási próba 6 ellenőrzése 4 folyamatindítással sikeres. A szintaxispróba 63 JS-fájlt és konfigurációt ellenőrzött. Logok: `artifacts/unit-tests-landing-shields-0.3.2.log`, `packaged-tests-landing-shields-0.3.2.log`, `restart-tests-landing-shields-0.3.2.log`, `syntax-tests-landing-shields-0.3.2.log` és `build-landing-shields-0.3.2.log`. A legújabb eredmények az Egységes lapfülek, áruház és teljesítmény fejezetben szerepelnek.

A csomagolt EasyList/EasyPrivacy pillanatképekből a JS-motor **104 046 támogatott hálózati szabályt** tölt be. Nyolc új reklámvédelmi Node-próba a domain-/útvonalszűrést, badfilter/kivétel-kezelést, szűk parsinghatárt, listaintegritást és a YouTube-segédet vizsgálja. A kétablakos backend-regresszió igazolja, hogy a webhely-Shields kikapcsolása minden érintett dokumentumot frissít, más eredetű lapot megőrizve. Rejtett skip gomb esetén a reklám némul; szinkron sikeres skip nem tekeri el a normál videót. A BFCache visszatérés életciklusa is célzott próbát kapott.

A valódi Chromium helyi HTTPS YouTube-fixture-t használ, működő byte range/seekable médiával. Igazolt a reklámkártya CSS-elrejtése, a kifejezetten jelölt reklámvideó némítása/tekerése, a normál sebesség/hang visszaállítása, a látható skip és a kikapcsolt Shields. Az ad-kérés tiltott, a normál player API használható, a helper nem jelenik meg a weboldal fővilágában. Ez **nem élő YouTube-teszt vagy teljes reklámmentességi garancia**. Részletek: [AD_BLOCKING.md](AD_BLOCKING.md).

A Windows alapértelmezett-böngésző modul négy Node-regressziója mindkét HTTP/HTTPS állapotot, a Windows 11 HKCU-regisztrációhoz tartozó választóhivatkozást, a Windows 10 fejlesztői útvonalát és a hibás URI miatti visszaesést ellenőrzi. A Tracer és a telepítő a rendszer választóját nyitja; tényleges alapértelmezést a felhasználó állít be. A fejlesztés nem módosította a felhasználó alapértelmezett böngészőjét.

A landing oldal helyi böngészőben **320, 390, 820 pixel szélességen és az alap asztali nézetben** ellenőrzött, vízszintes túlcsordulás nélkül. A Shields-bemutató, háttérváltás, telefonos menü, FAQ és Escape-pel zárható adatvédelmi dialógus működik. A képek valódi Tracer-képernyőképek és dokumentált CC0-hátterek; a szemléltetések nem mért blokkolási adatok. A 21 weboldal-infrastruktúra teszt az aktuális csomaghash-t, verziót, APK-jelzéseket, GET/HEAD/range/cache működést, útvonaltiltást és a Windows junction-korlátot vizsgálja.

Az éles helyi kiszolgálón mindkét teljes letöltés GET-válaszának byte-mérete és SHA-256-a egyezik a kiadási manifesttel; a HEAD-válasz mérete is helyes. Bizonyíték: `artifacts/website-download-validation.json`. Nyilvános hosting nem készült; a `website` mappa statikus tárhelyre feltölthető.

Az Android Preview APK **2 614 773 bájt**, SHA-256: `a32c6c0cc144b32797f340e48b08bfd60e341eb65c89d1b9232f9025ea11daeb`. A Kotlin/Java és R8 build sikeres, **5/5 JVM-teszt**, Android lint **0 hiba / 52 figyelmeztetés**. Az APK v2 RSA-aláírása érvényes; `debuggable=false`, Android 9+, target SDK 35 és HTTP/HTTPS böngésző intent igazolt a fordított manifestben. Öt csomagolt asset egyezik a forrással, a mobil YouTube-helper az asztali végleges helperből generált. Az Android alapértelmezett-szerep és élő működés készüléken még nem tesztelt. A külön `app.tracer.mobile.preview` csomag fejlesztői aláírású, nem éles kiadás. Részletes bizonyíték: [Android build](mobile/ANDROID_BUILD_VALIDATION.md), `mobile/testing/android-build-reports/validation.json`.

## Discord RPC és statikus GitHub-kiadás

A Discord bevezetésekor végzett 0.3.2 futás **318/318 Node-tesztet, 71 JS-fájl szintaxisellenőrzését,
82/82 Chromium-ellenőrzést** és a 6 ellenőrzéses, 4 folyamatindításos
újraindítási próbát teljesítette. A Windows-telepítő újra elkészült, a csomagolt
források 53 fájlja bájtról bájtra egyezik. Logok: `artifacts/discord-unit-tests-0.3.2.log`,
`discord-syntax-tests-0.3.2.log`, `discord-browser-smoke-0.3.2.log`,
`discord-restart-tests-0.3.2.log`, `discord-build-0.3.2.log` és
`discord-packaged-tests-0.3.2.log`.

A Discord-adapter és a YouTube-parser 16 célzott Node-próbája valódi, saját
Windows named-pipe fixture-rel igazolja a töredezett kézfogást, SET_ACTIVITY-t,
Listening típust, időbélyegeket, PING/PONG-ot, 15 másodperces frissítési korlátot,
azonnali privacy cleart, ACK-timeoutot, elutasítást, Client ID cserét és
lezárást. A controller 47 próbája a natív hallhatóságot, privát/Tor/Sandbox
kizárást, Ghostot, némítást, rejtett ablakokat, navigációt, megszűnt nézetet,
elavult válaszokat és korlátos olvasást ellenőrzi. A profil és IPC regressziók
igazolják a kikapcsolt alapállapotot, a publikus Application ID-t, az explicit
választás megőrzését és az atomi beállítás-ellenőrzést.

A Chromium-böngészőpróba a valódi YouTube HTTPS-eredetet saját SOCKS5 fixture-rel
helyi TLS/média szerverre irányítja, minden hálózati kérést azon belül tartva.
A valódi, hallható PCM videóból elkülönített világban olvasott cím, csatorna és
időadat egy saját RPC adapterhez jut; a szünet, privát előtér és kikapcsolás
törlést eredményez. A külön DOM-próba 8 ellenőrzése az izolált világot
felülírt page API-k mellett is igazolja. Képek:
`artifacts/tracer-discord-settings.png` és
`artifacts/tracer-discord-settings-packaged.png`.
Valódi Discord-fiókhoz nem kapcsolódtak és tevékenységet nem publikáltak a
tesztek. Az éles profilkártya felhasználói bekapcsolás utáni külön próba.
Használat: [DISCORD_RPC.md](DISCORD_RPC.md).

A landinghez GitHub Pages + GitHub Releases mód készült. A frontend pontos
repository/tag/fájlnévhez kötött HTTPS-hivatkozást enged; a build a tényleges
EXE/APK méretét és hashét ellenőrzi, és külön outputba csak statikus fájlokat
visz át. A nagy telepítők kimaradnak a Git/Pages csomagból. A branchből
publikálható, csak landinget tartalmazó változat nem igényli a böngészőforrás
közzétételét. Opcionális Actions workflow is készült. A PowerShell
`npm.ps1` korlátozására a `website` mappából indítható `npm.cmd` és
`start.cmd` megoldás tesztelt; rendszerházirend nem változott.
Repository és domain még nincs megadva, ezért távoli közzététel nem történt.
Közzétételi útmutató (`../website/GITHUB_PAGES.md`).

A weboldal 27 célzott Node-próbája az előző letöltési és kiszolgálási
ellenőrzéseken túl a GitHub-kiadások pontos URL-jeit, a frontend megjelenítését,
a binárisokat kizáró statikus exportot és az exportált dokumentáció helyi
hivatkozásait is igazolja. A teljes 318-as tesztfutás ezeket is tartalmazza.

## Oldalsáv, animációk és megerősített bezárás

A lapfül-/áruházjavítás előtti 0.3.2 ellenőrzés **369/369 Node-tesztet, 76 JS-fájl szintaxisellenőrzését, 92/92 Chromium-ellenőrzést** teljesített a forrásból és az akkori csomagolt Tracer.exe-ből is. Az újraindítási próba **9 ellenőrzést, 4 külön folyamatindítást** végzett. Az akkori csomagolt 57 forrás-/assetfájl bájtról bájtra egyezett; a Tor 17 fájlja és verziópróbája is ellenőrzött. Logok: `artifacts/ui-shell-unit-0.3.2.log`, `ui-shell-syntax-0.3.2.log`, `ui-shell-browser-0.3.2.log`, `ui-shell-restart-0.3.2.log`, `ui-shell-build-0.3.2.log` és `ui-shell-packaged-0.3.2.log`.

A Discord ID a régi profilból is a beépített Tracer azonosítóra normalizálódik. A profil-/IPC-próbák igazolják, hogy másik vagy akár azonos `clientId` patch is elutasított, az explicit megosztási kapcsoló megőrzésével. A Chromium-próba ellenőrzi a korábbi ID-beviteli mező hiányát.

Az oldalsáv célzott próbái a bal/jobb elhelyezést, 56–240 px korlátot, elrejtést, részleges és atomi beállításokat, helyi nem mentett előnézetet és több ablak natív bounds-frissítését vizsgálják. A valódi Chromium natív Home/End és egérhúzó inputot küld; a pointer capture és felengedés után a szélesség mentődik. Escape a nem mentett módosítást elveti. A settings DOM megmarad szélességváltáskor, a rejtett sáv a felső menüből visszakapcsolható. 820×600-as ablakban, 240 px-es sávval nincs vízszintes túlcsordulás, a menü tényleges hitboxa és az 580 px széles natív nézet is helyes.

A bezárási policy **38 Node-próbája** és a backend regressziók fedik az elvetést, ismételt bezárás összevonását, többablakos alkalmazáskilépést, háttérmódot, hibás/elavult válaszokat, Ghostot és megszűnt ablakot. A Chromium a tényleges window close útból nyitja a fókuszált, lapszámot mutató dialogot; az elvetés lapot és beállítást nem töröl. A megerősített opt-out a natív bezárás előtt lemezre kerül. A négy friss production folyamat külön, kötelező megerősítési jelölőkkel igazolja az application/window bezárási kérdést, az opt-out és az oldalsáv perzisztenciáját. A csökkentett mozgás a dialog hátterének animációját is tiltja.

Aktuális képek: `artifacts/tracer-sidebar-settings-packaged.png`, `artifacts/tracer-close-confirmation-packaged.png` és `artifacts/tracer-discord-settings-packaged.png`. A landing letöltése a friss telepítőre frissült; mindkét helyi teljes GET/HEAD és SHA-256 ellenőrzés eredménye `artifacts/website-download-validation.json`.

## Egységes lapfülek, áruház és teljesítmény

A végső 0.3.2 ellenőrzés **380/380 Node-tesztet, 77 JS-fájl szintaxisellenőrzését és 97/97 Chromium-ellenőrzést** teljesített a forrásból és a frissen csomagolt Tracer.exe-ből. A külön újraindítás **9 ellenőrzése, 4 folyamatindítással** sikeres. A csomagolt **60** vizsgált forrás-/assetfájl bájtról bájtra egyezik, a külön csomagolt Tor **17** fájlja és verziópróbája is sikeres. Logok: `artifacts/performance-unit-0.3.2.log`, `performance-syntax-0.3.2.log`, `performance-browser-0.3.2.log`, `performance-restart-0.3.2.log`, `performance-build-0.3.2.log`, `performance-packaged-0.3.2.log`.

A valódi Chromium felső + gombbal nyit lapokat, és ellenőrzi a nyitási/bezárási CSS-animáció eseményét. A rövid és nagyon hosszú című, rögzített és normál fülek egyaránt **210 px** szélesek; a cím és favicon frissítésekor megmarad az elem azonossága. A valódi bezárás az animáció előtt megtörténik, az eltűnő felületi elem nem kattintható és végül eltűnik. Csökkentett mozgással nincs késleltetett kilépő elem. A hosszú könyvjelzőgomb legfeljebb **150 px**, a cím ellipszissel rövidül, a teljes tooltip és az eredeti mentett cím megmarad.

A natív egér-/billentyűzetpróba igazolja a kezelőfelületi jobbklikk megakadályozását, a kezdőlapi szöveg húzásos és Ctrl+A kijelölésének tiltását, valamint a címsor szerkeszthető kijelölését. A webnézet korábbi valódi képes jobbklikkpróbái továbbra is sikeresek. Képek: `artifacts/tracer-equal-tabs-bookmarks-packaged.png`, `artifacts/tracer-localized-chrome-store-packaged.png`.

Az ékezetes Chrome Web Store slug korábban kiesett a szigorú URL-feldolgozásból, ezért a Tracer saját hozzáadási gombja nem jelent meg. A parser most a nyers és percent-kódolt nyelvi útvonalat is kezeli, változatlan HTTPS/hoszt/32 karakteres azonosító ellenőrzéssel; a veszélyes kódolt útvonal-elválasztók és dot-segmentek elutasítottak. A backend és Chromium a magyar, kódolt slugot ténylegesen használja; a hiteles Shorts-bővítmény teljes engedélyezési és natív betöltési útja sikeres. **A teljes Chrome API-kompatibilitás ettől nem készült el.** A képen szereplő Volume Master 2.4.0 csomagja hiteles, de a szükséges `chrome.tabCapture` metódusok hiányoznak; a telepítő ezt előzetesen elutasítja. Részletes natív próba: [CHROME_COMPATIBILITY.md](CHROME_COMPATIBILITY.md), `artifacts/volume-master-probe/runtime-report.json`.

Az optimalizálás két backend-regressziója igazolja az előzmény azonnali memóriafrissítését, húsz címváltozás összevont lemezmentését, szabályos ablakbezáráskor a függő frissítés mentését és Ghost után a feltámadás hiányát. Az alapértelmezett `Store.visit()` megőrzi az azonnali mentést; csak a normál böngészési események kérnek halasztást. A meglévő, **800 ms**-os profilciklus használatos. Hirtelen folyamatleálláskor a még nem mentett, utolsó előzményfrissítések elveszhetnek; a szabályos bezárás/kilépés kiírja őket. A privát, Tor és sandbox események nem kerülnek előzménybe.

A tárca hat új regressziójával összesen **19/19 tárcateszt** sikeres. Száz ismételt állapotlekérdezés egyetlen EVM- és Solana-címlevezetést használ. Friss válaszobjektum, kulcsazonosság/epoch, zárolás, hibás feloldás, új create és módosítható/accessor kulcsrekord külön ellenőrzött; elavult publikus cím nem térhet vissza a cache-ből. Az aláírás, titkosítás és tranzakciójóváhagyás változatlan.

A teljesítménymérés a teljes tesztfutás után, más Tracer-próba és csomagolás nélkül futott: `node artifacts/performance-validation.cjs --exclusive`. Szintetikus, körülbelül 414 KB-os profil, 1000 előzmény, 1000 könyvjelző, 100 mentett lap, meleg fájlrendszer; Windows x64, Ryzen 5 5600G, Node 24.18.0.

| Művelet, medián                          | Korábbi működés |     Új működés |
| ---------------------------------------- | --------------: | -------------: |
| 20 előzmény/címfrissítés és végső mentés |        78,87 ms |        4,17 ms |
| Profilírás 20 frissítéshez               |              20 |              1 |
| Feloldott tárca `status()`               |        0,686 ms | 0,001 ms alatt |
| Három magyar számláló formázása          |       0,0708 ms |     0,00171 ms |

Az előzményfrissítés és mentés ideje ebben a terhelésben **94,7%-kal csökkent**. A valódi `page-title-updated` főfolyamati kezelő húsz eseménye önmagában 0,638 ms és nulla lemezírás; `flushProfile()`-lal 4,045 ms és egy írás, visszaolvasott utolsó címmel. Az előzmény sorrendje, könyvjelzők, publikus tárcacímek és a formázott értékek egyeznek. A Node-próba az Electron ablak/nézet hívásait mockolja; **nem mér valódi IPC-t, DOM-megjelenítést, weboldalbetöltést vagy teljes böngészősebességet**. A korábbi tárcarutin a régi levezetést reprodukálja; az új `status()` valódi titkosított fixture feloldása után fut. A nyers report forráshasheket és p95 mintacsoportátlagokat tartalmaz, amelyek nem egyedi OS-írások p95 késleltetései. Bizonyíték: `artifacts/performance-report.md`, `performance-validation.json`; az eredeti `performance-baseline.json` megmaradt.

## Még nem igazolt

- Rust/Cargo és Visual Studio C++ toolchain nincs ezen a gépen. A Rust unit tesztek és a natív addon futási tesztje megírt, de nem futott. A Windows kiadás a jelzett JS tartalékmotort használja.
- Az Android előzetes APK SDK 35/JDK 17/Gradle 8.11.1 alatt lefordult, optimalizált és fejlesztői kulccsal aláírt. Fizikai készülék/emulátor nincs; biometria, gesztusok, alapértelmezett böngészőszerep és élő YouTube készülékpróbát igényel. macOS/Xcode nincs, iOS app/IPA továbbra sem fordult; éles Android AAB/Play Store-kiadás sem készült.
- A közös sync tesztvektor Node-ban visszafejthető. Android instrumentation és iOS XCTest forrás megírt, de a valódi mobil titkosítás–desktop visszafejtés még nem futott.
- Nincs élő release-kiszolgáló, RSA release-kulcs vagy Authenticode kiadói tanúsítvány. A letöltős WPF GUI alapból nem fogad csomagot. A helyi NSIS aláíratlan.
- A NSIS telepítő fájljának buildje igazolt; rendszerre telepítés, alapértelmezett böngészőválasztás és eltávolítás tiszta Windows virtuális gépben még szükséges. A fejlesztés nem módosította a felhasználó alapértelmezett böngészőjét.
- Tor Browser szintű anonimitás és fingerprint-védelem, többnapos erőforrásterhelés és független wallet/security audit nem történt. A Tor daemon tényleges bootstrapja és SOCKS5 kézfogása külön igazolt.

## Buildfüggőségek auditja

A teljes npm fa jelenleg 8 közepes, buildoldali jelzést tartalmaz ugyanahhoz a `sprintf-js` logger-DoS advisoryhoz kapcsolódó függőségútvonalon. A futtatási csomagfa 0 jelzésű. A legújabb ellenőrzött `sprintf-js` 1.1.3 még érintett; az npm által javasolt electron-builder visszaléptetést nem alkalmaztuk, mert korábban javított csomagolófüggőségeket hozhatna vissza. A kiadási buildkörnyezetben ezt követni kell. A részletek: [GHSA-hp3w-g68c-fv3c](https://github.com/advisories/GHSA-hp3w-g68c-fv3c).

## Reprodukálás

```powershell
npm.cmd ci
npm.cmd run build:icons
npm.cmd run check
npm.cmd test
npm.cmd run test:browser
npm.cmd run test:restart
npm.cmd run vendor:tor
npm.cmd run build:win -- --unsigned
npm.cmd run test:packaged
```

A fejlesztői képernyőkép `artifacts/tracer-desktop.png`, a két bővítmény katalógusa `artifacts/tracer-extensions.png`. A csomagolt EXE smoke saját ideiglenes tesztkönyvtárba ír, így a csomag ASAR-ja és a valódi felhasználói profil nem módosul; a sikeres eredmény külön másolata `artifacts/browser-packaged-smoke.json`.

A jelenlegi 380/380 és 97-es eredményhez megőrzött, hiteles áruházi fixture-ek szükségesek: `artifacts/proton-pass-probe/proton-pass.crx` (1.42.0) és `artifacts/cws-native/shorts.crx` (1.5.5), továbbá `artifacts/volume-master-probe/volume-master.crx` (2.4.0). Ezek a böngésző telepítőjéből kimaradnak. Hiányuk esetén a hozzájuk kötött Node-próbák jelzett skipet kapnak, az öt CWS Chromium-ellenőrzés nem fut; a többi vizsgálat továbbra is lefut. A frissen letöltött újabb áruházi verzió külön, új eredet- és működési vizsgálatot igényel a fixture cseréje előtt.
