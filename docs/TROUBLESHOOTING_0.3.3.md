# Tracer 0.3.3 — hibajavítás és bővítménykompatibilitás

Ellenőrzés dátuma: 2026. október 10. Windows x64, Node 24.18.0, Electron 44.7.0 / Chromium 152.0.7977.130.

## Megszüntetett hibák

- A `snapshot()` és a lapműveletek élő `webContents`-et ellenőriznek. Egy megsemmisült, altatott vagy éppen lecserélt nézet nem okoz `navigationHistory` főfolyamati összeomlást. A későn érkező lapértesítés nem módosítja az új nézet állapotát.
- A `window.open()` natív gyermek-webContents-et ad át a Tracer lapkezelésének. Megmarad az `opener`, a `postMessage`, a POST-törzs és a `window.close()` kapcsolat. A Surge az élő OAuth gyermek és szülőlapját együtt őrzi meg.
- Null, tömb vagy hibás részbeállításokkal mentett profil nem állítja le az indulást. A hibás mezők alapértékre állnak; a használható beállítások és könyvjelzők megmaradnak. A profil betöltése önmagában nem írja át az eredeti fájlt.
- A Tor daemon a teljes élettartama alatt kap exit/error figyelőt. Egy későn visszatérő SOCKS-próba nem teheti kész állapotba az időközben leállt saját folyamatot.

## A bővítményadapter tényleges feladata

A saját kód kizárólag engedélyezett vagy már ellenőrzött betöltés alatt álló bővítmény saját `chrome-extension://` frame-jének és háttérszolgáltatásának ad API-hozzáférést. Minden hívás újra ellenőrzi az eredetet, a munkamenetet és a csomag engedélyezett állapotát. Privát, Tor és Sandbox lapok/ablakok nem jelennek meg. A lap címe és URL-je csak megfelelő `tabs` vagy webhelyengedély mellett kerül a válaszba.

| API | Megvalósított működés |
| --- | --- |
| `tabs` | `create`, `query`, `get`, `getCurrent`, `update`, `remove`, `reload`; created/removed/activated/updated események, a valódi Tracer lapmodellre kötve. |
| `windows` | Normál ablakok létrehozása, lekérdezése, módosítása és bezárása; created/removed/focus események. A több lap bezárásához tartozó megerősítés érvényben marad. |
| `permissions` | A jóváhagyott kötelező engedélyek és eredetek `getAll`/`contains` lekérdezése. `request` csak már meglévő engedélyre ad igaz választ; új opcionális jogosultságot nem ad. `remove` nem von vissza kötelező engedélyt. |
| `webNavigation` | `getFrame`, `getAllFrames`; valós fő- és alkeret navigációs események, Chromium-kompatibilis frame ID-val. |
| `runtime.openOptionsPage` | A bővítmény saját beállításoldalát normál Tracer lapon nyitja meg. |
| Natív Electron API-k | A tárhely, üzenetküldés és szkriptek natív támogatása megmarad; a fixture fájlból indított `scripting.executeScript` működését is ellenőriztük. |

Az adapter callback és Promise hívást is kezel, a `runtime.lastError` a hibás callback idejére érvényes. A frame és Manifest V3 worker preloadja nem ad Node.js vagy nyers Electron IPC hozzáférést a bővítménynek.

## Megmaradó kompatibilitási korlátok

A hiteles **Proton Pass 1.42.0** csomag külön, külső hálózat nélküli próbája sikeres: a háttérszolgáltatás fut, megjelenik a magyar bejelentkezési felület, a worker és popup konzoljában nincs hiba. Az Electron eltérő `chrome` és `browser` namespace-t ad; a Proton az utóbbit választja, ezért mindkettő azonos adaptert kap. Fiókos bejelentkezés, szinkronizálás és automatikus kitöltés nincs igazolva. Az eredeti CRX aláírása és az importált fájlok integritása ellenőrzött maradt; a bővítmény saját kódját nem módosítottuk. Bizonyíték: `artifacts/proton-pass-probe/adapter-runtime-report.json`; reprodukálás: `node node_modules/electron/cli.js artifacts/proton-pass-probe/probe-adapter.cjs`.

Ez jelentős API-bővítés, de az összes Chrome Web Store csomag támogatása nem igazolt. Kötelező `tabCapture`, `nativeMessaging`, `privacy` vagy `contextMenus` API-igény esetén a telepítő továbbra is konkrét hibával megáll. A Volume Master hangrögzítési API-ja továbbra is hiányzik.

- Új opcionális engedélyek futás közbeni engedélyezése/visszavonása, Chrome témák és automatikus áruházi frissítés nincs.
- Az Electron `session.webRequest` handlerei miatt a Tracer Shields hálózati eseményei és a bővítmények natív `chrome.webRequest` megfigyelői nem kapnak teljes Chrome-szemantikájú együttműködést.
- A helyi kezdőlap és a teljesen altatott, webContents nélküli lap nem része az adapter laplistájának. Újraébresztéskor új natív lapazonosító keletkezik. A natív messaging és scripting célazonosítója a tényleges WebContents ID marad.
- A `webNavigation` DOMContentLoaded eseménye a főkeretre korlátozott. Az Electron nem ad megfelelő Chrome document UUID-t és navigációs transitionType-ot; ezeket nem találjuk ki. A documentId szerinti frame-lekérdezés konkrét hibát ad.
- Bővítményből csak normál ablak hozható létre. Speciális popup/devtools ablak, meglévő lap áthelyezése és több további Chrome API még nem támogatott.

A teljes körű kompatibilitás következő lépése a Chromium teljes böngészőrétegére építő motor vagy saját Electron/Chromium motorfejlesztés. Az Electron hivatalosan is [részleges Chrome API-támogatást](https://www.electronjs.org/docs/latest/api/extensions) ad.

## Ellenőrzés és reprodukálás

A végleges 0.3.3 forrás és telepítő ellenőrzése:

| Ellenőrzés | Eredmény | Bizonyíték |
| --- | --- | --- |
| Node regressziótesztek | **433/433 sikeres, 0 kihagyás** | `artifacts/unit-tests-0.3.3.log` |
| JavaScript/JSON szintaxis | **83 JS-fájl és a JSON-ok sikeresek** | `artifacts/syntax-tests-0.3.3.log` |
| Natív Electron integráció | **104 ellenőrzés sikeres** | `artifacts/browser-smoke.json` |
| Végleges csomagolt Tracer.exe | **104 ellenőrzés sikeres** | `artifacts/browser-packaged-smoke.json`, `artifacts/packaged-tests-0.3.3.log` |
| Munkamenet-visszaállítás | **9 ellenőrzés, 4 folyamatindítás** | `artifacts/session-restart-smoke.json` |
| Valódi Proton Pass 1.42.0 indulás | **Worker fut, magyar bejelentkezési felület megjelenik, konzolhiba nélkül** | `artifacts/proton-pass-probe/adapter-runtime-report.json`, `adapter-popup.png` |

Az új telepítő: `dist/Tracer-Setup-0.3.3-x64.exe`, 155 770 468 bájt. SHA-256: `a9cb71b031d880d06cd297ee6f4e2b6525c7ae6b9205c0695b5319c1e9f9713c`. A csomagolt főfolyamat, preload, bővítményadapter, navigációadapter, bővítménykezelő, profilkezelő és Tor modul bájtról bájtra egyezik a tesztelt forrással. A telepítő elkészült; a felhasználó telepített böngészőjét a fejlesztési folyamat nem frissítette automatikusan.

A forrás ellenőrzése, a Node-regressziók, a natív Electron-próba, a munkamenet-újraindítás és a csomagolt EXE-próba eredménye az aktuális `artifacts` jelentésekben található. A tesztek elkülönített profilokkal működnek. A valódi felhasználói profil, fiókok, jelszavak és az alapértelmezett böngésző beállítása nem szükséges hozzájuk.

```powershell
npm run check
npm test
npm run test:browser
npm run test:restart
npm run build:win -- --unsigned
npm run test:packaged
```

A futtatási függőségek npm auditja nulla ismert jelzést ad. A buildfüggőségeknél a korábban dokumentált sprintf-js advisoryhoz tartozó nyolc közepes jelzés továbbra is fennáll; a javasolt electron-builder visszaléptetés nem került alkalmazásra.
