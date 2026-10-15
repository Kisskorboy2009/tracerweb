# Tracer képességek és prototípusok

A táblázat a jelenlegi kódot írja le. **F**: futtatható implementáció, célzott tesztekkel; **K**: implementált forrás, az adott képesség natív futtatása még nem ellenőrzött; **T**: tervezett, nincs bekötve. Egy F jelzés nem jelent teljes Brave-paritást vagy minden weboldalra érvényes kompatibilitási tanúsítást. Az Android ellenőrzése API 35 emulátoron történt; fizikai készülékes eredményt nem állítunk. Az iOS és Rust helyi fordítása továbbra sem ellenőrzött.

A leírás a **0.3.11 fejlesztői kiadásra** vonatkozik; Windows-csomagja `dist/Tracer-Setup-0.3.11-x64.exe`, aláíratlan helyi NSIS-build. Az Android APK optimalizált, fejlesztői kulccsal aláírt kiadás. A tényleges tesztszámokat, csomagolási eredményeket és futtatási bizonyítékot a VALIDATION.md (`VALIDATION.md`) és az [Android-jegyzőkönyv](mobile/ANDROID_BUILD_VALIDATION.md) rögzíti. A még külön nem ellenőrzött mobil képességeknél a K jelzés megmarad. iOS IPA továbbra sem készült.

A 0.3.11 Androidon a címsáv és a navigáció felülre vagy alulra helyezhető a Megjelenés menüben, az aktuális oldal újratöltése nélkül. A hiányzó vagy érvénytelen témabeállítás sötét módot választ; a korábban kifejezetten választott világos és rendszertéma megmarad. A háttérvideó javítása a YouTube láthatósági eseményeit és a WebView natív videóleállítását is kezeli. Csak az engedélyezett, aktív médiamunkamenet tartja ébren a videó lejátszását; a kézi szüneteltetés megmarad. Használat: [UPDATE_0.3.11.md](UPDATE_0.3.11.md).

A 0.3.9 Androidon új kezdőlapot, vektoros kezelőgombokat, saját témázott menüt, lapválasztót, megjelenést, beállításokat, könyvjelzőket és élő oldalkeresőt ad; a felhasználói név **Tracer**. Az oldalikonok korlátos memóriacache-ben maradnak. Windows és Android GitHub Releases alapú automatikus frissítést kapott: Windows normál kilépéskor telepít; Android 12-től támogatott feltételekkel az egész app háttérbe kerülése után csendben önfrissít. Régebbi Androidon vagy a rendszer kérésére telepítési jóváhagyás szükséges. A frissítő ellenőrzi a teljes csomag méretét és hashét, Androidon az alkalmazásazonosítót, verziókódot és APK-aláírót is. Használat és a frissítő próbáinak határai: [UPDATE_0.3.9.md](UPDATE_0.3.9.md).

## Megjelenés és helyi böngészőeszközök

| Képesség                             | Windows                                                                             | Mobil forrás                            | Pontos határ                                                                                 |
| ------------------------------------ | ----------------------------------------------------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------- |
| Paletták és kiemelőszínek            | F: 17 külön paletta + rendszertéma, 14 kiemelőszín                                  | K: 8 paletta és rendszermód             | A desktop katalógus központja a `shared/appearance.json`                                     |
| Újlap-háttér és képimport            | F: offline CC0-katalógus, előnézetes galéria, saját import                          | K: saját képimport                      | A képek felbontása és forrása a katalógusban szerepel; nincs futásidejű háttérletöltés       |
| Kapcsolható újlap-elemek             | F: óra, adatvédelmi összesítő, gyorslinkek, könyvjelzősáv; 0–85% sötétítés          | K: témázott kezdőlap, 6 közös gyorslink | A kép és a kezdőlap-elemek helyi erőforrások                                                 |
| Finom UI-átmenetek                   | F: rövid átmenetek, 240 ms keresőfókusz, rendszerhez igazodó csökkentett mozgás     | K: natív UI                             | Fókuszban a háttérvezérlők elhalványulnak és `inert` állapotúak                              |
| Egységes felső lapfülek              | F: fix 210 px, rögzítve is; nyitó/záró szélesség- és áttűnésanimáció                | —                                       | Csökkentett mozgással azonnali; címfrissítéskor az eredeti DOM-elemek maradnak               |
| Rövid könyvjelzőfeliratok            | F: legfeljebb 150 px-es gomb, ellipszis, teljes név és URL tooltipben               | —                                       | Az eredeti mentett könyvjelzőcím nem csonkolódik                                             |
| Kezelőfelületi kijelölés és menük    | F: a shell nem jelölhető ki, helyi jobbklikkmenü nélkül                             | —                                       | A szövegmezők szerkeszthetők és kijelölhetők; a weboldal nézete megőrzi saját működését      |
| Valódi gyorslinkképek                | F: 6 helyi PNG, az oldal saját ikonja vagy illusztrációja                           | T: a képes lapkák mobilbekötése         | Kezdőlapon nincs külső képkérés; Kounee aktuális parkolóoldali képét használja               |
| Elrejthető promóciós hivatkozások    | F: hat külön választás, összes elrejtése és visszaállítás, tartós beállítás         | T                                       | A kezdőlap, sáv és helyi ajánlások promóit szűri; saját könyvjelzőt nem rejt el              |
| Chrome Web Store telepítés           | F: saját URL-telepítő, CRX3-ellenőrzés, natív engedélyjóváhagyás                    | T                                       | Részleges Electron API-támogatás; Proton Pass jelenleg nem támogatott                        |
| Témázott beállítási legördülők       | F: saját lista, pipa, nyilak, Home/End, gépelés, Enter/Space és Escape              | —                                       | `combobox`/`listbox` jelzések; képernyőolvasóval külön vizsgálat nincs                       |
| Globális Tracer Shields              | F: profilban megmaradó normál számlálók, minden ablakban azonos összesítő           | T                                       | Privát, Tor és sandbox kérések kimaradnak; a Privacy Receipt továbbra is laphoz kötött       |
| Induláskori lapvisszaállítás         | F: alapból bekapcsolt, normál ablakok mentése, inaktív lapok késleltetett betöltése | T                                       | URL/cím/aktív lap/rögzítés/némítás/zoom; nincs DOM/űrlap/back-stack-visszaállítás            |
| Kezdőlap és újratöltés               | F: meglévő kezdőlapra váltás vagy az aktuális fül átváltása; valódi helyi frissítés | —                                       | A kezdőlap gomb nem növeli a lapok számát; más lapok megmaradnak                             |
| Böngészőprofil és export importja    | F: Brave/Chrome/Edge helyi profil, könyvjelző HTML, jelszó CSV és Firefox JSON      | T                                       | Előnézet és külön véglegesítés; kompatibilis lapcímek, cookie/bejelentkezési session nélkül  |
| Titkosított mentett fiókok           | F: rendszerkulcstár, legfeljebb 1000 fiók, pontos HTTPS kitöltés/másolás/törlés     | T                                       | Windows OS-encryption próba sikeres; nincs más böngésző titkosított Login Data visszafejtése |
| Lap rögzítése, némítása, duplikálása | F: az aktív lap parancsai a felső böngészőmenüben                                   | T                                       | A duplikált lap új URL-betöltés                                                              |
| Bezárt lap újranyitása               | F: ablakonként 20 RAM-rekord                                                        | T                                       | Ghost és ablakbezárás törli; nincs űrlap- vagy back-stack-visszaállítás                      |
| Parancspaletta és címsorjavaslatok   | F: `Ctrl+K`, helyi lap/könyvjelző/előzmény keresés                                  | T                                       | Gépeléskor nincs hálózati keresőjavaslat-lekérdezés                                          |
| Keresés, zoom, képernyőkép           | F: `Ctrl+F`, 50–200% zoom, PNG-mentés natív dialoggal                               | T                                       | Képernyőkép az aktív nézet látható területéről, teljes görgethető oldal nélkül               |
| Dinamikus nézetelhelyezés            | F: könyvjelzősáv és keresősáv szerint változó natív bounds                          | —                                       | A főfolyamat minden új parancs küldőjét és adatát ellenőrzi                                  |
| Állítható oldalsáv                   | F: húzható 56–240 px, bal/jobb elhelyezés, elrejtés és tartós választás             | —                                       | A natív webnézet újratöltés nélkül igazodik; a felső menü rejtett sávval is elérhető         |
| Több lap bezárásának megerősítése    | F: lapszám, elvetés/Escape, megjegyezhető kikapcsolás és visszakapcsolás            | —                                       | Ablakbezárás és teljes kilépés; háttérasszisztens miatti elrejtés nem zár lapokat            |

A saját desktop-képimport JPEG/PNG/WebP fájlt fogad, legfeljebb 25 MiB és 60 megapixel méretben. Maximum 10 saját kép tárolható. A mentett példány legfeljebb 3840×2160, aránytartó, metaadatok nélküli JPEG a helyi profilban. A mellékelt CC0-katalógus helyi képfájlokat és külön előnézeteket használ, a korábbi öt felhasználói kép helyett. Használat, aktuális képforrások, teljes palettalista és adatkezelés: [APPEARANCE.md](APPEARANCE.md).

A felső fülek nyitási és bezárási animációja körülbelül 190 ms-os, véges átmenet. A bezárási kérés azonnal megszünteti a valódi lapot; az eltűnő felületi elem csak a vizuális lezárást mutatja, `inert` és `aria-hidden` állapotban. A cím, favicon és betöltési állapot változása a meglévő DOM-elemeket frissíti, nem indít új nyitási animációt. Csökkentett mozgás, Ghost vagy elrejtett ablak esetén a futó átmenetek takarítása azonnali.

A felső böngészőmenü az aktív lap rögzítését, némítását, duplikálását, altatását/ébresztését és bezárását, valamint az újranyitást és a Lapkezelőt is tartalmazza. A kezelőfelület saját jobbklikkmenüje és kijelölése tiltott; a címsorban, keresőkben és más szövegmezőkben a szerkesztés, kijelölés, másolás és beillesztés megmarad. A weboldalak kijelölése és képműveletei a weboldal nézetében működnek tovább.

Az `appearance.hiddenShortcuts` legfeljebb a hat beépített promóció pontos URL-jét tartalmazhatja, ismétlődés nélkül; alapértéke `[]`. A kezdőlapi × gomb egy elemet rejt el, a Testreszabás → Promóciós hivatkozások panel pedig külön kapcsolókat, összes elrejtése és visszaállítás gombot ad. A választás a helyi profilban marad, újraindítás és Ghost után is érvényes. Csak a promóciós forrás szűrődik: ugyanarra az oldalra mentett saját könyvjelző és tényleges böngészési előzmény továbbra is kereshető. A teljes kezdőlapi hivatkozássáv `showShortcuts` kapcsolója külön beállítás marad.

A 0.3.1 az oldal saját faviconját jeleníti meg a felső füleken és a könyvjelzősávban. A PNG/JPEG/WebP/ICO/SVG forrás sessionhöz kötött, méretkorlátos lekérés után legfeljebb 64 px-es PNG-vé alakul. A normál memóriacache 128 eredetre és hat órára korlátozott; a privát/Tor/sandbox cache ablakhoz kötött. Az ikonok nem kerülnek a profil lemezére. A kezdőlap órája 48 px, keskeny ablakban 36 px.

A kép helyi menüje natív képmásolást, címmásolást, mentést és HTTP/HTTPS kép új lapon megnyitását ad. A mentés a lap saját Chromium letöltési útján történik, HTTP-, adat- vagy az érintett kerethez tartozó blob-forrásból; a menü megnyitása óta visszavont/navigált lap nem végez műveletet. A sandbox és Tor letöltési tilalma megmarad.

A bővítményáruház **két** saját csomagot telepít: Olvasáskomfort és Shorts Cleaner. Az engedélyeket a natív jóváhagyóablak mutatja meg; a telepített csomagok kikapcsolhatók, eltávolíthatók és saját felületük megnyitható. A kompatibilis, kicsomagolt Chromium-bővítmények importálhatók. A csomagok csak normál munkamenetben működnek, induláskor a mentett állapot szerint töltődnek be.

A 0.3.2 saját **Hozzáadás a Tracerhez** gombja az aktív Chrome Web Store-bővítményoldal linkjét előre kitölti a helyi telepítőpanelben; a hivatkozás kézzel is megadható. A Google frissítési végpontjáról letöltött CRX3 csomag kriptográfiai aláírása, áruházi igazolása és fejlesztőkulcshoz tartozó azonosítója ellenőrződik. A ZIP kibontása méret-, útvonal- és fájlszámkorlátos; a profilhoz tartozó másolat csak natív engedélyjóváhagyás után készül. A letöltés megszakítható, és Ghost vagy ablakbezárás visszavonja a függő műveletet. Áruházi forrás, verzió és ellenőrzőösszegek maradnak a registryben; Chrome témák és automatikus külső csomagfrissítések nincsenek megvalósítva. Használat: [EXTENSIONS.md](EXTENSIONS.md).

A telepítési protokoll támogatása nem jelent teljes Chrome API-kompatibilitást. A manifestből kimutatható, szükséges API-hiányok megállítják a telepítést, de a többi csomag futási kompatibilitását külön kell vizsgálni. **A Proton Pass jelenleg nem támogatott**: a szükséges `webNavigation` és további böngésző API-k hiányoznak az Electron környezetéből. A valódi csomagon végzett vizsgálat és a további motorfejlesztés határai: [CHROME_COMPATIBILITY.md](CHROME_COMPATIBILITY.md).

A `restoreSession: true` alapérték a régebbi profilokba is bekerül, ha ott még nincs kifejezett választás. Az utoljára lezárt normál ablak is újranyitható; a privát, Tor és sandbox ablakok nem kerülnek a lemezre. Induláskor ablakonként csak az aktív weboldal kap nézetet, az inaktív lapok fülük kiválasztásakor töltődnek be. A helyi profil legfeljebb 20 ablakot, ablakonként 100 lapot és összesen 500 lapot fogad. Kikapcsolás és Ghost üríti a mentett laplistát. A külön `Ctrl+Shift+T` újranyitási lista továbbra is csak RAM-ban él.

A globális blokkolás-, HTTPS-váltás- és címtisztítás-számlálók tényleges normál request-policy döntéseket számolnak. Ablakbezárás, újraindítás és Ghost után megmaradnak, webcímeket nem őriznek. A kezdőlap és a Shields panel ezeket az összesítőket mutatja; az aktuális lap kérései és hosztjai külön Privacy Receiptben láthatók.

A helyi import előnézeti tokenje ablakhoz és Ghost-epochhoz kötött, egyszer használható, öt percig érvényes. A felület darabszámot és figyelmeztetéseket kap, jelszót nem. A CSV-s fiókadatok csak a főfolyamatban várják a véglegesítést, legfeljebb négy függő előnézetben; bezárás, lejárat és Ghost üríti ezeket. A mentett tár fájlja kizárólag verziót és titkosított bájtokat tartalmaz, sem a webhely, sem a felhasználónév nem marad világos szövegként lemezen. Sérült vagy más kulccsal titkosított tár hibát ad, nem cserélődik le üres tárral. A Windows Electron `safeStorage` és a `node:sqlite` tényleges futtatókörnyezeti próbája sikeres; ez szintetikus adatokat használt. Használat és forrástípusonkénti korlátok: [IMPORT.md](IMPORT.md).

A normál előzményfrissítés a memóriaállapotot azonnal módosítja, a lemezírásokat a közös, legfeljebb 800 ms-os profilmentésbe vonja össze. A szabályos ablakbezárás és kilépés menti a függő frissítéseket; Ghost üríti őket, ezért törölt előzmény nem térhet vissza késleltetett mentésből. Hirtelen folyamatleálláskor az utolsó, még nem mentett frissítések elveszhetnek. A feloldott tárca publikus címei változatlan, befagyasztott kulcsrekordhoz és epochhoz kötött cache-ből érkeznek, friss válaszobjektumban; lock, create és unlock új cache-t használ. A számformázó újrahasznosul. A titkosítás és az aláírás/jóváhagyás útja változatlan. Mért eredmények és próbák: VALIDATION.md (`VALIDATION.md`).

## Kért képességek

A 0.3.10 Androidon natív MediaSession-vezérlést és háttérlejátszást ad a normál HTTPS-lapokhoz. A valódi WebView/WAV-próba alkalmazásváltást, lezárt képernyőt, értesítésből folytatást, hangfókusz-vesztést, Surge melletti új külső lapot és a lejátszó lap bezárását ellenőrzi. Az alapértelmezett böngésző beállítása a rendszer választóját használja, az állapotot a rendszerből olvassa. A médialap szüneteltetve is védett a Surge és az automatikus APK-csere ellen. [Használat](UPDATE_0.3.10.md). Ezek API 35 emulátoron ellenőrzött képességek; fizikai készülékes és minden webhelyre kiterjedő kompatibilitást nem állítunk.

| Képesség                                     | Windows                                                                                        | Android                                                                | iOS                                       | Pontos határ                                                                                        |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Chromium motor                               | F: Electron Chromium                                                                           | K: rendszer WebView                                                    | K: WKWebView                              | iOS WebKit, saját Chromium-backend nélkül                                                           |
| Modern UI és fekete logó                     | F: HTML/CSS, SVG/PNG/ICO                                                                       | K: natív alsó UI                                                       | K: SwiftUI alsó UI                        | A márkajel önálló vektoros újratervezés                                                             |
| Google alapkereső, váltható motor            | F                                                                                              | K                                                                      | K                                         | Desktop: Google/DuckDuckGo/Bing/Brave; mobil: Google/DuckDuckGo/Bing                                |
| Több lap, vissza/előre, könyvjelző, előzmény | F                                                                                              | K                                                                      | K                                         | Megsemmisített/altatott nézet URL-ből tölt vissza                                                   |
| AdBlock és tracker block                     | F: csomagolt listák domain-/útvonalszűrése, saját kozmetikai és YouTube-védelem; K: Rust addon | K: helyi domain-/célzott végpontszűrés, YouTube-segéd                  | K: WebKit content-rule lista              | Teljes uBlock/Brave paritás és minden reklám blokkolása nincs igazolva                              |
| EasyList/EasyPrivacy frissítés               | F: csomagolt snapshot + explicit frissítés; K: natív teljes hálózati parser                    | T                                                                      | T                                         | JS fallback csak támogatott szintaxist használ; [részletes határ](AD_BLOCKING.md)                   |
| Fingerprint-védelem                          | T: motorpatch                                                                                  | T                                                                      | T / WebKit-korlátok                       | Nincs implementált Canvas/audio randomizálás                                                        |
| HTTPS-Only                                   | F: GET/HEAD upgrade; HTTP POST tiltás                                                          | K: főnavigáció upgrade, cleartext/mixed-content tiltás                 | K: upgrade, ATS és HTTP-rule              | HTTPS-hibára nincs csendes HTTP fallback                                                            |
| Cookie-banner elrejtés                       | F: ismert szelektorok                                                                          | K: ismert szelektorok                                                  | K: ismert szelektorok                     | CSS elrejtés, consent-elutasítás nélkül                                                             |
| Webhelyenkénti script-blokk                  | F: hálózati tiltás + válasz-CSP                                                                | K: WebSettings                                                         | K: WKWebpagePreferences                   | Desktopon `javascript:true` marad; újratöltéskor a scriptkérések és inline végrehajtás tiltott      |
| WebRTC védelem                               | F: Chromium IP handling policy                                                                 | T                                                                      | T                                         | Mobilon nincs teljes bekötött szivárgásvédelem                                                      |
| DNS-over-HTTPS                               | F: Chromium resolver, alapból off                                                              | T                                                                      | T                                         | Node/RPC hálózati útra nem általános garancia                                                       |
| Privát munkamenet                            | F: egyedi nem tartós session                                                                   | K: külön process és adatkönyvtár                                       | K: nem tartós WebKit store                | Android kényszerleállítás után maradvány lehet a következő indulásig                                |
| Tor ablak                                    | F: csomagolt Tor motor, helyi proxyfelismerés és folyamatjelzés                                | T                                                                      | T                                         | Valódi bootstrap/SOCKS ellenőrzés, közvetlen fallback nélkül; nincs Tor Browser fingerprint-paritás |
| EVM tárca                                    | F: cím/egyenleg/üzenet/tranzakció                                                              | T                                                                      | T                                         | Explicit kapcsolódás és aláírási jóváhagyás                                                         |
| Solana tárca                                 | F: cím/egyenleg/üzenet                                                                         | T                                                                      | T                                         | Solana tranzakció aláírás/küldés hiányzik                                                           |
| Windows Mica/Fluent                          | F: támogatott Windows háttéranyag, saját UI                                                    | —                                                                      | —                                         | OS-től függ; nincs külön Acrylic renderer                                                           |
| Tálca és háttérasszisztens                   | F: opt-in                                                                                      | —                                                                      | —                                         | Inaktív nézetek eldobhatók; nincs zéró erőforrás-ígéret                                             |
| Tálcaikon gyorsmenü                          | F: privát ablak és Ghost                                                                       | —                                                                      | —                                         | Windows felhasználói felülethez kötött                                                              |
| DirectX 12 / Vulkan boost                    | T: saját motoroldali optimalizálás                                                             | T                                                                      | T                                         | Jelenleg a Chromium/driver normál GPU gyorsítása működik; 4K/8K nem garantált                       |
| Egykezes alsó navigáció                      | —                                                                                              | K                                                                      | K                                         | Natív mobil-kezelősáv                                                                               |
| Vissza/előre és pull-to-refresh gesztus      | —                                                                                              | K                                                                      | K                                         | Fül nyitó/záró gesztus T                                                                            |
| Data Saver és háttérkímélés                  | F: lapaltatás/Surge                                                                            | K: képtiltás és WebView pause                                          | K: kép/média rule, háttérnézetek eldobása | Nincs szerveroldali tömörítő proxy                                                                  |
| Privát biometrikus zárolás                   | T                                                                                              | K: BiometricPrompt                                                     | K: LocalAuthentication                    | Mentett jelszavakhoz nincs kész jelszókezelő                                                        |
| E2EE sync                                    | F: kézi snapshot + relay                                                                       | K: SyncClient és natív UI                                              | K: SyncClient és SwiftUI UI               | Közös wire-séma; mobil futtatás még nincs, automatikus sync/párosítás/konfliktus-összefésülés nincs |
| Ghost Protocol                               | F                                                                                              | K                                                                      | K                                         | Profiladat-ürítés; nem forenzikus törlés                                                            |
| Tab Heatmap / Auto-Group                  | F: hőheurisztika és helyi TF-IDF/cosine klaszter                                               | T                                                                      | T                                         | Helyi feldolgozás és domain-fallback                                               |
| Live Sandbox                                 | F: külön browser session                                                                       | T                                                                      | T                                         | OS-konténer/virtuális gép T                                                                         |
| Bandwidth & Resource Surge                   | F: inaktív nézetek megsemmisítése                                                              | K                                                                      | K                                         | Aktív lap prioritása; nincs garantált memóriakeret vagy sávszélesség-emelés                         |
| Egykattintásos Windows telepítő              | F: elkészült x64 NSIS és WPF GUI                                                               | —                                                                      | —                                         | NSIS most aláíratlan; letöltős kiadáshoz saját aláírás/HTTPS szolgáltatás kell                      |
| APK/AAB és IPA csomagolás                    | —                                                                                              | F: optimalizált, aláírásellenőrzött előzetes APK; éles AAB nem készült | K: XcodeGen/archive/export                | Android fejlesztői aláírás, külön csomagazonosító; API 35 emulátorpróba, fizikai készülék még nincs |

Az alapértelmezett böngésző választása Windows alatt a telepítő HTTP/HTTPS-regisztrációjára és a Tracerből nyitható rendszerbeállításra épül; a panel mindkét protokoll aktuális állapotát mutatja. Androidon a böngészőszerep-választó (API 29+) vagy a rendszer beállítása (API 28) érhető el. A Tracer nem írja felül a felhasználó rendszerbeli választását.

A `website` mappában önálló, reszponzív landing oldal és valós csomagokra épülő letöltési jegyzék található. Az aktuális Windows és Android előzetes fájlok verzióját, méretét és SHA-256-át a build ellenőrzi. A GitHub Pages módban az EXE/APK a megadott nyilvános repository pontos GitHub Releases kiadásából tölthető le, saját backend nélkül. A mellékelt Actions workflow ellenőrzi a release-asseteket és statikus Pages csomagot készít; saját domain a GitHub beállításainál adható meg. Nyilvános hosting itt nincs beállítva; iOS telepítőhivatkozás nincs.

A Windows Discord YouTube Rich Presence kapcsoló új profilokon kikapcsolt.
A Tracer alkalmazásazonosítója rögzített; a felület és a beállítási IPC csak
a megosztás be- vagy kikapcsolását engedi, a régi profilok másik ID-ja migrál.
Bekapcsolva a normál YouTube/YouTube Music `/watch` lap hallható címét,
csatornáját és időadatait küldi a Discord helyi IPC-jén. Háttérlap zenéje is
kiválasztható; privát/Tor/Sandbox ablak előtérben, reklám, szünet, némítás,
Ghost, rejtett böngésző és kilépés törli az állapotot. A fő alkalmazásnév a
Discord Developer Portalon regisztrált Tracer névből származik; a tartalmi
payload is Tracert jelez. Élő Discord-profilon még külön felhasználói próba
szükséges. Részletek: [DISCORD_RPC.md](DISCORD_RPC.md).

A motorválasztás az [Electron modelljét](https://www.electronjs.org/docs/latest/tutorial/process-model), az [Android WebView API-t](https://developer.android.com/develop/ui/views/layout/webapps/webview) és a [WKWebView-t](https://developer.apple.com/documentation/webkit/wkwebview) követi. A natív szűrő upstreamje [adblock-rust](https://github.com/brave/adblock-rust); a WebRTC kapcsoló [Chromium IP handling policy-t](https://www.electronjs.org/docs/latest/api/web-contents#contentssetwebrtciphandlingpolicypolicy) állít.

## Három saját, működő prototípus

Ezek a Tracer számára megtervezett funkciók, megírt Windows-kóddal. A nevük és konkrét együttműködésük saját termékterv. Világelső vagy minden népszerű böngészőből hiányzó újdonságot nem állítunk: ehhez teljes, folyamatosan frissülő versenytársvizsgálat kellene.

### Privacy Receipt — helyi adatvédelmi nyugta

A nyugta az aktuális laphoz rendelt, megfigyelt kéréseket és blokkolásokat számolja, valamint egyedi külső hosztokat gyűjt. Egy külső hoszt itt egyszerű hostname-eltérést jelent; saját CDN vagy aldomain is beleszámíthat. A gyűjtés a request handlerben történik, a tartalom, jelszó vagy személyes űrlapadat elemzése nélkül.

```text
N = megfigyelt kérések száma
B = letiltott kérések száma
T = eltérő hosztok száma
risk = min(100, round(8*T + (N > 0 ? 25*B/N : 0)))
```

A `desktop/core/policy.cjs` `privacyReceipt()` eredményét a Shields panel jeleníti meg: blokkolt kérések, hosztlista és 0–100 jelzés. Főnavigációkor a számlálók alaphelyzetbe kerülnek, Ghostkor a lapok megszűnnek. A jelzés heurisztika: nem valós adatszivárgási valószínűség, és magas értékből nem következik, hogy egy webhely adatot lopott.

A továbbfejlesztés első lépése a felhasználó által engedélyezett, szűk metaadatkészlet és magyarázható, mérhető osztályozás. Tartalom- vagy űrlapfigyelés csak külön specifikációval kerülhet bele.

### Context Fence — eredethez kötött hálózati kerítés

A funkció bekapcsoláskor a lap fő eredetét tekinti határnak. Az eredet protokollt, hosztot és effektív portot tartalmaz. A főnavigáció továbbra is engedélyezett; az eltérő eredetű alerőforrás tiltott.

```text
if contextFence && fenceOrigin létezik
   && request.origin != fenceOrigin
   && resourceType != mainFrame:
    cancel
```

A `desktop/core/policy.cjs` döntése még a kérés folytatása előtt életbe lép. `https://site.example` oldalról a `https://cdn.site.example`, másik port vagy külső WebSocket is eltérő eredetnek számít. Új főnavigációkor új kerítés kerül a laphoz. A webhelyenkénti kapcsoló a Shields panelen érhető el, alapból kikapcsolt.

Ez szándékosan szigorú prototípus: külső CDN, bejelentkezési iframe vagy fizetési komponens kieshet. Jelenleg nincs tanult allowlist, CNAME-felderítés, hitelesített kapcsolati gráf vagy OS-hálózati konténer. Az ilyen kibővítés célja egy kifejezetten jóváhagyott, minimális eredetkészlet lenne, automatikus engedélytágítás nélkül.

A `WebContents`-hez nem rendelhető worker-kéréseket a szigorú mód nem engedi át automatikusan. Amíg a közös normál session valamely lapján Context Fence, Quiet Lease vagy scriptblokkolás aktív, az ilyen kérések konzervatívan tiltódnak. Ez más, ugyanabban a normál profilban futó lap workerének működését is befolyásolhatja. A Live Sandbox az ilyen kéréseket mindig tiltja.

### Quiet Lease — háttérlapok hálózati bérlete

A háttérlap korlátozott ideig tarthat fenn új kéréseket. A `policy.cjs` egy új kérésnél ellenőrzi az aktív állapotot és a `lastActive` időbélyeget; a küszöb 30 000 ms.

```text
if tab.sleeping:
    cancel
else if quietLease && !tab.active && now - tab.lastActive > 30000:
    cancel
```

Másik lapra váltáskor a korábban aktív lap deaktiválási időbélyege frissül, így a 30 másodperc a háttérbe kerüléstől számít. Visszaváltáskor a lap aktív lesz és az időbélyeg újra megújul. A Quiet Lease a kérések belépési pontján működik; nem egy 30 másodperces polling timer. A Surge ettől külön funkció: az inaktív webnézetet ténylegesen eldobja, így a processzhez kötött erőforrások is felszabadulhatnak.

A bérlet új kéréseket blokkol. Egy már létrejött WebSocket, WebRTC kapcsolat vagy korábban elindított stream folytatását önmagában nem állítja le, és nem garantál teljes JS-fagyasztást. Továbbfejlesztésként erőforrásfajtánként szabályozható lejárat, aktív médialejátszás kezelése és sessionkapcsolatok mért lezárása tervezhető.

## A hőtérkép valós működése

A `desktop/core/heatmap.cjs` helyi képlete:

```text
heat = tab.active ? 100 : min(100, round(
    100 * exp(-(now-lastActive)/180000)
    + min(15, 3 * log2(visits+1))
))
```

A friss használat gyorsan magas értéket ad, az aktív lap mindig 100-at kap, az idő exponenciálisan csökkenti az inaktív értéket; a korábbi használat kis, legfeljebb 15 pontos korrekciót jelent.

Az automatikus csoportosítás kizárólag a lapcímeket dolgozza fel. Kisbetűsítés, NFKD ékezetbontás, háromkarakteres minimum és magyar/angol stoplista után az előfordulási és dokumentumgyakoriság ad TF-IDF súlyt:

```text
weight(term, title) = (1 + ln(termCount))
                    * (1 + ln((tabCount+1)/(documentFrequency+1)))
similarity(i,j) = dot(vector[i],vector[j]) / (norm[i]*norm[j])
```

Legalább két különböző szó kell mindkét címben, legalább két közös szó és `similarity > 0.42` ahhoz, hogy két lap ugyanabba a klaszterbe kerüljön. A páronkénti kapcsolatok union-find összefüggő komponenseket alkotnak: két közvetlenül kevésbé hasonló cím is összekapcsolódhat egy köztes címen keresztül. A klaszter neve a címekben leggyakrabban szereplő két szó, azonos gyakoriságnál betűrendes döntéssel. Az önálló lap domain-fallbacket kap, elhagyott `www.` előtaggal.

Ez helyi szöveges hasonlósági algoritmus. Nem olvassa a lap törzstartalmát és nem tölti fel a lapcímeket; a csoport minősége a címektől függ, és a címekben szereplő közös szavakra támaszkodik.

## A kézi mobil–desktop szinkron állapota

Androidon és iOS-en elkészült a feltöltés/letöltés kezelőfelülete és az azonos `v:1` payload/envelope wire-adapter. Android Bouncy Castle scrypt + rendszer AES-GCM, iOS CryptoSwift scrypt + CryptoKit AES-GCM használatával ugyanazokat a paramétereket alkalmazza, mint a desktop: `N=32768,r=8,p=1`, 32 bájtos kulcs, 16 bájtos salt, 12 bájtos nonce, 16 bájtos tag és `tracer-sync-v1` AAD. [Bouncy Castle Java](https://www.bouncycastle.org/documentation/documentation-java/), [CryptoSwift](https://github.com/krzyzanowskim/CryptoSwift), [CryptoKit AES.GCM](https://developer.apple.com/documentation/cryptokit/aes/gcm)

Az import lecseréli a normál profil könyvjelzőit és előzményeit; a távoli lapok külön választhatók ki. A mobil kód és közös tesztvektor megvan, mobil fordítás és platformok közötti futtatott interoperabilitási teszt még nincs. Nincs automatikus szinkron, eszközpárosítás vagy automatikus konfliktus-összefésülés. A titkosítás nem akadályozza meg, hogy egy relay korábbi hiteles snapshotot adjon vissza; replay-védelem külön fejlesztési feladat.

## Bizonyíték és következő ellenőrzések

A Windows tesztcsomag címkezelést, szűrőket, HTTPS- és origin-policyt, háttérbérletet, titkosított szinkront, tárcaaláírásokat és aszinkron zárolási versenyhelyzeteket ellenőriz. A megjelenési modul célzott ellenőrzései a beállítások típusait, képfejléceket, méret- és útvonalkorlátokat is vizsgálják. A titkosítás a [Node crypto API-ra](https://nodejs.org/api/crypto.html) épül; a tesztek a Tracer integrációját ellenőrzik.

A valódi Chromium smoke navigációt, shell/preload működést, Node-izolációt, hálózati szűrést, privát cookie-elkülönítést, sandbox sessiont, inline script-blokkot és Ghost törlést vizsgál. Az új funkciók ténylegesen lefutott ellenőrzéseit és az aktuális eredményszámokat a VALIDATION.md (`VALIDATION.md`) külön rögzíti; a gépi eredmény az `artifacts/browser-smoke.json` fájlban található. Tiszta gépes telepítés/eltávolítás és aláírt kiadás külön ellenőrzés.

Az APK/IPA build, fizikai biometria, Rust fordítás és teljes böngészőparitás nem következik a Node tesztekből. Az ezekhez szükséges konkrét fejlesztési és ellenőrzési lépéseket az [architektúra](ARCHITECTURE.md), a [mobil README](mobile/README.md) és a [natív README](native/README.md) tartalmazza.
