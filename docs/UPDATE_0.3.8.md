# Tracer Windows 0.3.8

## Roblox és webhelyengedélyek

A Roblox webhelyéről kattintással indítható a Windowsban regisztrált Roblox kliens. A Tracer kezeli a `roblox-player`, `roblox-client` és `roblox` protokollokat, a rejtett iframe-en át indított kéréseket és a webes átirányításokat is. A játék továbbra is a telepített Roblox alkalmazásban fut. A böngészőben történő kliensátadást ellenőriztük; valódi fiókos játékindítást nem próbáltunk.

Ha a webhely `roblox-client` hivatkozást ad, de a Windowsban csak a régebbi `roblox-player` van regisztrálva, a Tracer ahhoz adja át ugyanazt az ellenőrzött indítókérést. A helyi, csak olvasó hozzárendelés-ellenőrzés (`../artifacts/external-handler-status-0.3.8.json`) pontosan ilyen telepítést talált: a `roblox` és `roblox-player` kezelője **Roblox Game Client**, a `roblox-client` kezelője hiányzik. Windows-hozzárendelést nem módosítottunk.

A Spotify katalógushivatkozásai és a Steam numerikus `run`/`store` hivatkozásai is megnyithatják a megfelelő telepített alkalmazást. Az indítás megőrzi az eredeti weboldalt, és nem hoz létre üres fület. A Roblox belépési jegye nem jelenik meg a felületre szánt adatokban. A külső alkalmazáshoz felhasználói kattintás vagy címsori művelet kell; Tor és Live Sandbox módban a külső indítás továbbra is tiltott.

Normál ablakban a webhely saját engedélykérése megjelenhet tartós tárhelyhez, helyi betűtípusokhoz, hangkimenet-választáshoz, hozzávetőleges helyzethez és helyi hálózathoz is. Az engedélykérő szöveg magyarul elmagyarázza a hozzáférést. A jóváhagyás a laphoz és webhelyhez tartozik; navigáció vagy lapváltás közben elavult kérés nem kap engedélyt. Az előtérbeli főkeret vágólapra írása működik; billentyűzetzár normál és privát ablakban, teljes képernyőn használható.

A protokollformátumok alapja a [Roblox dokumentációja](https://create.roblox.com/docs/production/promotion/deeplinks), a Roblox webhelyének jelenlegi indítókódja, a [Spotify URI-leírása](https://developer.spotify.com/documentation/web-api/concepts/spotify-uris-ids) és az [Electron Windows-protokollkezelése](https://www.electronjs.org/docs/latest/api/shell#shellopenexternalurl-options). A megfigyelt forrásokat a forrásjegyzék (`../artifacts/roblox-launch-source-0.3.8.json`) rögzíti.

## Oldalon belüli keresés

A Ctrl+F egy kompakt, témához igazodó keresősávot nyit. A mezőben látható az aktuális és összes találat, illetve a sikertelen keresés állapota. Az `Aa` gomb kis- és nagybetűérzékeny keresést kapcsol. Enter a következő, Shift+Enter az előző találatra lép; a nyílgombok ugyanezt teszik. Escape és a bezárógomb visszaadja a fókuszt az oldalnak.

Gépeléskor egyetlen 140 ms-os késleltetés fogja össze a keresést. Az összetett karakterbevitel csak a lezárt szöveget keresi. A mező törlése megszünteti a találatkiemeléseket, és nyitva hagyja a sávot. Lapváltáskor, navigációkor és Ghost közben a régi keresés eredménye nem kerül át másik lapra.

A kereső saját, elkülönített vezérlőt kapott. Az Electron 44 első keresésénél eredményt nem küldő `findNext:false` működését a böngésző kifejezett keresés-visszaállítással és a működő natív keresési út használatával kezeli. A külön natív próba (`../artifacts/native-find-probe.json`) ezt közvetlenül ellenőrzi.

## Erőforrások

- A 15 másodperces lapkarbantartás csak tényleges lapaltatáskor küld teljes felületállapotot. A késleltetett és azonnali állapotfrissítés nem küld ugyanarra a változásra két értesítést.
- A kikapcsolt Discord-kijelzésnek nincs 2 másodperces lekérdező időzítője.
- A YouTube-védelem normál lejátszás közben eseményekből dolgozik. Az 500 ms-os ismétlés kizárólag jelzett reklám közben aktív. A DOM-figyelők a lejátszóra és annak szerkezeti környezetére szűkültek.
- A Windows alapértelmezett böngészőjének állapota 15 másodpercig újrahasznosul; ablakfókusznál és a beállítások megnyitásakor frissül.
- A hangot lejátszó, rögzítés alatt álló és OAuth-belépéshez kapcsolódó lapok nem alszanak el automatikusan vagy Surge miatt. Emiatt a beállított laplimit átmenetileg túlléphető. A sérült renderelőnézet ettől függetlenül felszabadul.

A tesztek normál YouTube-lejátszásnál percenként 120 periodikus DOM-vizsgálat, kikapcsolt Discordnál 30 időzítős ébresztés eltűnését igazolják. Ezek időzítőszámok, nem mért CPU- vagy RAM-százalékok. A natív lapkarbantartási próba három élő lapnézetből kettőt ténylegesen megsemmisít, és az aktívat megtartja. Az altatott oldal újratöltésekor a nem mentett űrlapállapot elveszhet.

A Windows telepítő a `dist/Tracer-Setup-0.3.8-x64.exe` fájl. A futó Tracer bezárása után kézzel telepíthető. Android és iOS ehhez a Windows-frissítéshez nem kapott új kiadást. A részletes ellenőrzés a jegyzőkönyvben (`VALIDATION.md`) található.
