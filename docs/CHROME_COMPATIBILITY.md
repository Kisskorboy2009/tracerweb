# Chrome Web Store: telepítés és futtatási kompatibilitás

**0.3.5 frissítés:** nagyobb ellenőrzött csomagok, valódi kontextusmenük, natív jóváhagyással megadható opcionális `tabs`/`notifications` és HTTP/HTTPS hostjogok, rendszerértesítések, valamint az aktív lap audio-only rögzítése. A teljes, hiteles SynQ 4.0.8 beállítási útja és a Shazam 2.7.0 valódi hangrögzítése a produkciós adapterekkel külön natív próbán átment. A zenei szolgáltatásokba bejelentkezés és az élő dalfelismerés nincs igazolva. A korábbi, adapter nélküli mérések lent történeti bizonyítékként maradnak meg.

**0.3.4 frissítés:** közvetlen Tracer-telepítőgomb a hivatalos áruházi bővítményoldalon, többnyelvű/SPA felülettel, aktív normál főkerethez kötött hitelesítéssel. Az áruház eredeti Chrome-gombja továbbra is a Chrome saját telepítőjét keresi; a Tracer saját gombja indítja az ellenőrzött importot és engedélyjóváhagyást. Használat és natív ellenőrzések: [0.3.4 útmutató](UPDATE_0.3.4.md).

**0.3.3 frissítés:** saját MIT adapter ad valós lap-/ablakkezelést, kötelező engedélyek lekérdezését és navigációs API-t mind a `chrome`, mind a különálló `browser` namespace-hez. A hiteles Proton Pass 1.42.0 háttérszolgáltatása elindul, és megjelenik a magyar bejelentkezési felület. Fiókos belépés és autofill még nincs igazolva. Az adott verzió megvalósítása, teszteredményei és korlátai: [0.3.3 hibakeresési jelentés](TROUBLESHOOTING_0.3.3.md). A korábbi jelentések unit- és smoke-tesztszámai a megjelölt verzióhoz tartoznak, nem a teljes 0.3.5 kiadás ellenőrzési számai.

A Tracer 0.3.2-ben jelent meg a saját Chrome Web Store telepítési út az Electron alapú böngészőhöz. A jelenlegi áruházi **Hozzáadás a Tracerhez** gomb az ellenőrzött importot és engedélyjóváhagyást indítja. A Google saját felületén látható kompatibilitási üzenet ettől független marad. Az áruház letöltési protokollja és a bővítmények működéséhez szükséges böngésző API-k külön feladatot jelentenek.

## A megvalósított telepítési út

- Kizárólag hivatalos HTTPS áruházi bővítményhivatkozást fogad. Az oldal szkriptjei nem kapnak hozzáférést a Tracer belső IPC felületéhez.
- A Google frissítési végpontjáról tölt le, idő-, méret- és átirányítási korlátokkal. A CRX3 tényleges kriptográfiai aláírását és a fejlesztőkulcsból származó áruházi azonosítót ellenőrzi.
- A 0.3.5 felső korlátai: **128 MiB tömörített csomag, 256 MiB kibontva, 64 MiB fájlonként, 8192 fájl, 16 384 bejegyzés és 12 könyvtárszint**. A stream közben is ellenőrzi a tényleges bájtmennyiséget, a ZIP útvonalait, CRC-jét és a deflate tényleges kimeneti méretét. A korábbi 32/64/8 MiB, 1024 fájl és 30 másodperc helyett az áruházi előkészítés teljes határideje **120 másodperc**. A kriptográfia és kibontás külön workerben fut; a megszakítás biztonságos munkapontokon állítja le a műveletet, nem szakítja félbe a natív zlib munkáját. Az ideiglenes csomagból csak a felsorolt engedélyek natív jóváhagyása után készül profilhoz tartozó másolat.
- Az áruházi eredet, a verzió és az ellenőrzőösszegek megmaradnak. A módosított csomag ismételt jóváhagyást igényel. Privát, Tor és Sandbox munkamenetben sem telepítés, sem bővítményfuttatás nincs.
- A kimutatható, szükséges API-hiányokra konkrét hibaüzenetet ad. Ez előzetes szűrés, nem teljes kompatibilitási tanúsítvány: egy csomag további, a manifestből nem látható API-kat is használhat.

A helyi Tracer katalógus továbbra is pontosan két saját csomagot tartalmaz. Külső áruházi csomagok saját jóváhagyással telepíthetők; nem kerülnek be automatikusan a böngésző telepítőjébe. Chrome témák és automatikus külső bővítményfrissítések még nincsenek megvalósítva.

A kicsomagolt csomag manifestje az ellenőrzött fejlesztőkulcsot kapja, hogy megmaradjon az áruházi azonosító. A Chromium által betöltéskor eltávolított `_metadata/verified_contents.json` foglalt ellenőrzési indexet már az előkészítés elhagyja. A teljes eredeti CRX aláírása és SHA-256 értéke ettől még ellenőrzött marad; a normalizált csomag összes tárolt fájlja külön tartalmi hash-védelmet kap. Ez megelőzi, hogy a motor saját indexeltávolítását bővítménymódosításnak minősítsük.

## A 0.3.5 saját, tényleges API-adapterei

A `contextMenus.create/update/remove/removeAll` és `onClicked` valódi natív menüelemeket kezel. Támogatja az oldal-, frame-, kijelölés-, link-, szerkeszthető mező- és médiakontextust, az URL-szűrőket, szülőmenüket, láthatóságot, engedélyezett állapotot, checkbox/radio elemeket és azok állapotát. A kattintás újra ellenőrzi az élő, aktív normál lapot, URL-t, betöltött bővítményazonosságot és manifestengedélyt; szükség esetén előbb felébreszti a háttérszolgáltatást. A háttérszolgáltatás `onClicked` eseményt használhat, az inline `onclick` csak bővítménylapon támogatott. Action-, lapsáv- és launcher-kontextusra konkrét hibát ad.

A `permissions.getAll/contains/request/remove` valós, tartósan tárolt engedélyeket kezel. Az opcionális `tabs`, `notifications` és előre deklarált HTTP/HTTPS hostjogok csak külön natív jóváhagyás után adhatók meg. A hostkérés nem pusztán a lekérdezés eredményét módosítja: a Tracer az eredeti csomag ellenőrzése után külön futtatási másolatban állítja be a Chromium natív hostjogait, megtartva a stabil fejlesztőkulcsból származó azonosítót. Ez valódi `scripting.executeScript` és dinamikus tartalomszkript-hozzáférést ad. Visszavonáskor a natív engedély is megszűnik; újraindításkor a hitelesített eredeti csomagból újra előáll a jóváhagyott futtatási másolat. A tárolt eredeti manifest és forrásfájlok változatlanok. Kulcs nélküli mappaimportnál az opcionális hostjog elutasított, az `<all_urls>` nem enged helyi `file://` hozzáférést. A hostváltozás miatt a saját bővítménylapok újratöltődhetnek. A valós hostengedélyezés/visszavonás és újraindítás bizonyítéka: `optional-permissions-production-report.json` (`../artifacts/optional-permissions-production-report.json`).

A `notifications.create/update/clear/getAll/getPermissionLevel` adapter a jóváhagyott engedélyhez kötött valódi Electron rendszerértesítéseket adja. Saját helyi ikon, `basic` értesítéstípus és kattintás/bezárás esemény támogatott; távoli/data ikon, kép-, lista-, folyamat- és gombos értesítés még nem.

A `tabCapture.capture({audio:true})` az aktív normál HTTP/HTTPS lap tényleges hangját adja vissza a bővítmény saját főkeretében futó hívónak. A külön natív jóváhagyást egy rövid életű, az adott forráslaphoz és bővítményhívóhoz kötött médiaticket követi. Az audio-only MediaStream létrejötte után lesz a rögzítés aktív; `getCapturedTabs` és `onStatusChanged` valós rögzítési állapotot mutat. A stream leállítása, forrás/hívó navigációja vagy bezárása, kikapcsolás és Ghost megszünteti a rögzítést. Nem ad általános mikrofon-, kamera- vagy rendszerhang-hozzáférést. Videó, egyedi médiakorlátok, opcionális `tabCapture` és a háttérszolgáltatás/offscreen `getMediaStreamId` út még nem támogatott. A natív audio alappróba: `tab-capture-native-probe.json` (`../artifacts/tab-capture-native-probe.json`). A metódus Chrome-szemantikáját a [Chrome tabCapture dokumentációja](https://developer.chrome.com/docs/extensions/reference/api/tabCapture) írja le.

A kötelező `nativeMessaging` és `privacy` igény továbbra is telepítési hibát ad. Más API-k teljes támogatása a puszta elérhetőségükből nem következik. A fenti adapterek az aktuális normál lap- és ablakmodellt használják; privát/Tor/Sandbox hozzáférést nem adnak.

## Hiteles SynQ és Shazam vendor próba — 0.3.5

A teljes, produkciós store-proof- és fejlesztőaláírás-ellenőrzésen átment **SynQ 4.0.8** (`jcdmcpefbebkldopabclefjaggejocff`) és **Shazam 2.7.0** (`mmioliijnhnoblpgimnlajmefafdfilb`) csomagot a tényleges ExtensionManager és API/preload/permissions/notifications/tabCapture adapterekkel futtattuk. Electron **44.7.0**, Chromium **152.0.7977.130**; külön ideiglenes profil, explicit tesztjóváhagyás, kizárólag helyi HTTP hangforrás, minden külső HTTP/HTTPS/WebSocket kérés tiltva. A vendor kód változatlan, fiók vagy valódi felhasználói profil nem szerepelt a próbában.

| Bővítmény    | Konkrét bizonyíték                                                                                                                                                                                                                                                                                                                                                                                                                                                    | A próba határa                                                                 |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| SynQ 4.0.8   | A saját Accept gomb kérte a `tabs`, `notifications`, `https://*/*`, `*://*/*`, `<all_urls>` engedélyeket. Natív hostjog és újratöltés után a `contains` mindet igazolta, a popup Spotify/Apple Music/YouTube Music/Amazon Music választót mutatott. A natív scripting valódi HTTP oldalt olvasott; a relatív `tabs/onboard.html` betöltött, a saját onboarding gomb a szolgáltatásválasztó lépésre jutott. Az eredeti manifest bájtjai és a publisher ID megmaradtak. | Szolgáltatásba belépés, zenestream és teljes mini-player működés nem tesztelt. |
| Shazam 2.7.0 | A saját popup kódja indította a rögzítést; valódi audio MediaStream került a vendor AudioContextjébe. A 443 Hz helyi hang **0,708417 RMS** értéket adott. A vendor stopRecording út lezárta a tracket, a rögzítési nyilvántartás kiürült.                                                                                                                                                                                                                             | Külső Shazam végpontok blokkolva; élő dalfelismerés és találat nem tesztelt.   |

A SynQ beállítási akadálya a valós opcionális engedélyek és a relatív bővítmény-URL kezelése volt; a vizsgált setup útban nem találtunk Chrome-márkához kötött tiltást. A Shazam kis csomagja méretkorlátba nem ütközött; a hangrögzítési API hiánya volt a konkrét akadály.

A jelentés az összes hibát megőrzi: a blokkolt SynQ analytics két fetch hibát okozott, a Shazam saját stop kódja pedig már lezárt AudioContext ismételt bezárását jelezte, miközben a tényleges stream-leállítás sikerült. Az Electron betöltési figyelmeztetéseiben szereplő notifications/tabCapture natív namespace-hiányt a Tracer hiteles adaptere kezeli; a teljes Shazam csomag egy hiányzó devtools.html fájlt is hivatkozik. Ezekből nem állítunk minden vendor funkcióra hibamentességet.

Bizonyíték: `vendor-runtime-report.json` (`../artifacts/extension-compatibility-0.3.5/vendor-runtime-report.json`), SynQ popup (`../artifacts/extension-compatibility-0.3.5/synq-approved-popup.png`), Shazam popup (`../artifacts/extension-compatibility-0.3.5/shazam-popup.png`). Reprodukció és aláírt manifest/byte-mérések: audit README (`../artifacts/extension-compatibility-0.3.5/README.md`), `report.json` (`../artifacts/extension-compatibility-0.3.5/report.json`). A külső csomagok nem részei a kiadott telepítőnek.

Az öt hiteles csomag méret/manifest auditja a **Bitwarden 2026.9.3** esetében tényleges korábbi akadályt talált: 86 390 722 kibontott bájt és 12 541 942 bájtos legnagyobb fájl meghaladta a régi 64/8 MiB korlátot, és a kötelező contextMenus is hiányzott. Ezeket a 0.3.5 kezeli; a Bitwarden fiókos működése és autofill nem tesztelt. Dark Reader 4.9.133 és uBlock Origin Lite 2026.1006.1931 esetében nem találtunk régi méretkorlát vagy szükséges engedély miatti előzetes elutasítást; ez nem futtatási bizonyíték.

## Lokalizált áruházi URL-ek és történeti Volume Master próba — a tabCapture adapter előtt

A magyar Volume Master oldal `volume-master-hanger%C5%91-sza` névrészét a korábbi
ASCII-korlát elutasította. Emiatt a Tracer saját **Hozzáadás Tracerhez** gombja
sem jelent meg, és a kézzel beillesztett URL is hibásnak számított. A parser most
elfogadja a Unicode és szabályosan százalékkódolt lokalizált névrészeket, majd
kizárólag az áruházi azonosítót tartja meg. A hivatalos HTTPS-eredet, az útvonal
és az azonosító szigorú ellenőrzése megmaradt; kódolt elválasztók, dot-szegmensek,
vezérlőkarakterek és kettős kódolás továbbra sem fogadhatók el.

A hivatalos **Volume Master 2.4.0** csomag áruházi azonosítója
`jghecgabfgfdldnmbfkhmffcabddioke`. A 93 214 bájtos CRX3 a produkciós importáló
RSA/ECDSA-aláírás-, Google store-proof- és fejlesztőazonosító-ellenőrzésén átment.
SHA-256:

```text
7522d2eca9bfe606dbd3bc446000803acf4405fbdb24696ac78ab0164295f795
```

A szükséges manifest-engedélyek: `activeTab`, `offscreen`, `tabCapture`, `tabs`,
`storage`. Electron **44.7.0**, Chromium **152.0.7977.130** alatt, ugyanennek a
hiteles csomagnak saját bővítményeredetén, a 0.3.5 adapterei előtt mért natív API-k:

| API                                           | Mért állapot                                                             |
| --------------------------------------------- | ------------------------------------------------------------------------ |
| `tabCapture.capture`                          | Hiányzik.                                                                |
| `tabCapture.getMediaStreamId`                 | Hiányzik.                                                                |
| `tabCapture.getCapturedTabs`                  | Hiányzik.                                                                |
| `tabCapture.onStatusChanged` esemény          | Hiányzik.                                                                |
| Vizsgált offscreen, tabs és storage metódusok | Többnyire függvényként elérhetők; teljes működésük ebből nem következik. |

A Volume Master aláírt kódja a `tabCapture.getMediaStreamId` eredményéből indítja
a lap hangfolyamát. A hiányzó API ezért a hangerőnövelés konkrét akadálya. A
0.3.5 előtti telepítője a kötelező `chrome.tabCapture` igény miatt, a jóváhagyás és a
profil módosítása előtt megállt. **A Volume Master 2.4.0 a 0.3.5-ben már
telepíthető**, mert valódi előtérbeli audio capture adapter áll rendelkezésre.
Az általa használt háttérszolgáltatás/offscreen `getMediaStreamId` út viszont
továbbra sem támogatott, így a hangerőnövelés működését nem igazoltuk. A
történeti jelentés hiányzó capture/onStatusChanged sorai az adapter nélküli
állapotra vonatkoznak; a jelenlegi adapter nem helyettesíti a hiányzó utat
hamis streamazonosítóval.

A próba elkülönített, ideiglenes profilt használt, az összes külső hálózat és
engedélykérés tiltásával. A háttérszolgáltatás futott. A különálló diagnosztikai
popup aktív lapazonosító nélkül további hibát adott; ez nem bizonyítja a Tracer
integrált popupjának azonos hibáját. A szükséges `tabCapture` metódusok hiányát
a külön, saját eredetű natív API-mérés igazolja. Bizonyíték és reprodukció:
`artifacts/volume-master-probe/README.md`, `verification-report.json`,
`runtime-report.json`, `inspect.cjs`, `probe.cjs`. A vizsgált külső csomag nem
része a Tracer telepítőjének.

## Valódi Proton Pass próba, 2026. október 10. — adapter nélküli 0.3.2

A hivatalos **Proton Pass 1.42.0**, áruházi azonosító `ghmbeldphafepmbegfdlkpapadhbakde`, ellenőrzött csomagját külön ideiglenes profillal vizsgáltuk. Electron **44.7.0**, Chromium **152.0.7977.130**. A teszt külső hálózatot blokkolt; nem használt fiókot, jelszót vagy valódi böngészőprofilt.

A 8 405 429 bájtos CRX3 három RSA/ECDSA aláírása érvényes, a fejlesztőkulcs azonosítója egyezik a kért áruházi azonosítóval. A csomag SHA-256 értéke:

```text
6edf8bb48ca05d184f003a3fa78a2a51059dbb1bd5f85d567bfa3d887a9d3f12
```

Az Electron kicsomagolt betöltése sikerül, de a háttérszolgáltatás induláskor leáll:

```text
background.js:60
Uncaught TypeError: Cannot read properties of undefined (reading 'onAdded')
```

A hibát a `chrome.permissions.onAdded` hiánya okozza. Nem marad futó háttérszolgáltatás, a Proton felugró felülete üres. A csomag korábban a Tracer 20 MiB importkorlátját is meghaladta; a nagyobb méretkeret ezt megszünteti, a működési hibát azonban nem oldja meg.

| Vizsgált API                                                        | Mért állapot a natív bővítménykörnyezetben                                       |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `permissions.contains/request/onAdded/onRemoved`                    | Hiányzik; ez okozza az első indulási hibát.                                      |
| `webNavigation` vizsgált eseményei és `getAllFrames`                | Hiányzik; a Proton szükséges engedélyként kéri.                                  |
| `tabs.create`, `windows` vizsgált függvényei                        | Hiányzik.                                                                        |
| Vizsgált native messaging, commands, context menus és privacy API-k | Hiányzik; részben opcionális vagy funkciófüggő igények.                          |
| Alarms, offscreen, scripting, storage, egyes runtime és tab API-k   | Függvényként elérhetők; teljes működési szemantikájukat ez a próba nem igazolja. |

A `popupAPIs` mérés a Proton saját wrapperének inicializálása utáni állapotot mutatja, amely elrejti a nyers `chrome` objektumot. Az API-hiányok értékeléséhez a külön, ugyanazon bővítményeredeten mért **`nativeAPIs`** adatot használjuk.

Bizonyíték és reprodukció: `artifacts/proton-pass-probe/README.md`, `runtime-report.json`, `verification-report.json`, `probe.cjs` és `verify-crx.cjs`. A forráscsomag csak helyi vizsgálati adat; a kiadott Tracer telepítő nem tartalmazza. A Proton szükséges API-igényeinek elsődleges forrása a [hivatalos manifest](https://github.com/ProtonMail/WebClients/blob/main/applications/pass-extension/manifest-chrome.json).

## Proton Pass 0.3.3 bizonyítéka és további kompatibilitási korlátok

A fenti, adapter nélküli 0.3.2 próba nem támogatott Proton Pass működést mutatott. A 0.3.3 saját adaptere már biztosítja az induláshoz hiányzó támogatott API-kat, és a szükséges `webNavigation` engedélyt nem utasítja el. Az új, változatlan aláírt csomaggal végzett mérés: `artifacts/proton-pass-probe/adapter-runtime-report.json`; reprodukálás: `node node_modules/electron/cli.js artifacts/proton-pass-probe/probe-adapter.cjs`. A háttérszolgáltatás és a bejelentkezési felület működik; a fiókos belépés, autofill és minden opcionális funkció teljes működése ebből nem következik.

A 0.3.5 már tartós, natívan érvényesített opcionális hostjogokat, visszavonást, rendszerértesítést, kontextusmenüt és célzott hangrögzítést ad a meglévő lap/ablak/navigáció adapterekhez. A Proton fiókos autofillje, beágyazott iframe-es kitöltése, szolgáltatások közötti kommunikációja, kijelentkezése és minden opcionális funkciója továbbra is külön próbát igényel. A Tracer Shields és a bővítmények hálózati eseményeinek együttműködéséből sem következik teljes kompatibilitás.

Általános Chrome szintű bővítménytámogatáshoz a Chromium teljes böngészőrétegére építő átállás, vagy jelentős saját Electron/Chromium motorfejlesztés indokolt. Ez architekturális következtetés a mért hiányokból. Egyes csomagok célzott támogatása az Electronban is megvalósítható, de az összes áruházi bővítmény működését nem lehet ezekből a részpróbákból kijelenteni. Az [Electron hivatalos dokumentációja](https://www.electronjs.org/docs/latest/api/extensions) is részleges API-támogatást ír le.
