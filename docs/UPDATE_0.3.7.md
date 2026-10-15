# Tracer 0.3.7 — teljes képernyő, automatikus letöltési panel és külső kliensek

A Tracer indításkor **maximalizált ablakban** nyílik meg, a Windows-tálca látható marad. Az oldal külön **F11**-gyel váltható teljes képernyőre. Új letöltéskor az ikon alatti panel automatikusan megjelenik; a támogatott alkalmazáshivatkozásokat a Windowsban regisztrált külön kliens nyitja meg.

**605/605 Node-teszt sikeres, 0 hibával vagy kihagyással.** A forrásból és a végleges csomagolt alkalmazásból futó változat egyaránt **167 natív integrációs ellenőrzést** teljesített. Az újraindítási próba **11 ellenőrzést, 4 folyamatindítást** teljesített. A csomagtartalom, a telepítő mérete és SHA-256-a ellenőrzött; részletek az ellenőrzési jegyzőkönyvben (`VALIDATION.md`).

## Teljes képernyő és videó

- **F11**, illetve a böngészőmenü **Teljes képernyő** pontja az aktív oldalnak adja a teljes képernyőt. A lapfülek, címsor, könyvjelzősáv, oldalsáv és alsó állapotsáv eltűnik.
- **Escape** vagy ismételt **F11** kilép. A korábbi böngészőfelület és annak beállított méretei visszatérnek.
- A videó saját teljesképernyő-gombja normál és privát ablakban is használható, külön Tracer-jóváhagyókérdés nélkül. Beágyazott videónál a webhelynek az iframe számára is engedélyeznie kell a teljes képernyőt.

Ha már F11 módban nyitottál meg egy videót teljes képernyőn, az első **Escape** a videóból lép ki, és a böngésző F11 módja megmarad. Újabb **Escape** vagy **F11** visszaállítja az ablakot.

A Chromium szokásos webes követelményei megmaradnak: a webhely teljesképernyő-kéréséhez felhasználói művelet szükséges, és a beágyazó oldal engedélyházirendje érvényesül. A Tracer nem ad általános engedélyt automatikus teljes képernyőre vagy a billentyűzet zárolására.

Az aktív lap egérmutató-rögzítést (**pointer lock**) és képernyőébren-tartást (**screen wake lock**) kérhet külön Tracer-párbeszéd nélkül. A webes API saját követelményei, például az aktív dokumentum és a megfelelő biztonsági környezet továbbra is számítanak. Ez nem ad mikrofon-, kamera- vagy más, külön engedélyhez kötött hozzáférést a webhelynek.

## Automatikus letöltési panel

A letöltés indulása automatikusan megnyitja a címsor melletti letöltésikon alatti panelt. Ez a szokásos fájlletöltésre, a **Mentés másként** műveletre és az oldalmentésre is vonatkozik. A gyorsan befejeződő fájl is megjelenik, és a háttérlapról indított letöltés az ablak paneljén látszik, a forráslap aktiválása nélkül.

Több letöltés ugyanabban a nyitott panelben frissül. A letöltésjelzés nem kapcsolja ki-be a panelt, és a fájl sorának helyén követhető a bájtszám, ismert teljes méretnél a százalék, valamint az aktuális sebesség. Ismeretlen méretnél a kapott bájtok látszanak. A motor által támogatott letöltések szüneteltethetők, folytathatók és megszakíthatók; a kész fájl megnyitható vagy megmutatható a mappájában.

**Escape**, a bezárógomb vagy az ikon ismételt megnyomása bezárja a panelt. Ugyanannak a letöltésnek az előrehaladása nem nyitja újra; egy új letöltés ismét megnyithatja. A teljes lista az **Összes letöltés** gombbal érhető el.

Teljes képernyőn az automatikus panelnyitás szünetel, és a készülő előnézet sem takarja el utólag az oldalt. Kilépés után a letöltésikonról nyitható meg a lista. A letöltések normál és privát ablakban az adott ablakhoz tartoznak; a privát letöltés is fájlt hagy a lemezen. Tor és Live Sandbox ablakban a letöltési tiltás megmarad.

## Hivatkozások külön Windows-kliensben

Kattints a támogatott hivatkozásra, vagy illeszd be a teljes címet a címsorba, majd nyomj **Entert**. A Tracer a Windows protokoll-hozzárendelése szerinti külön alkalmazásnak adja át a címet, új Tracer-jóváhagyókérdés nélkül. A Windows vagy a fogadó kliens saját választója, bejelentkezése vagy megerősítése ettől még megjelenhet.

| Hivatkozás                                                        | A fogadó alkalmazás feladata                                                       |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `sftp://`, `ssh://`, `scp://`                                     | Kapcsolódás a megadott kiszolgálóhoz, illetve fájlátvitel a regisztrált kliensben. |
| `ftp://`, `ftps://`, `ftpes://`                                   | A megfelelő FTP-kapcsolat kezelése a regisztrált kliensben.                        |
| `mailto:`, `tel:`, `sms:`                                         | Levélírás, hívás vagy üzenet a hozzárendelt alkalmazásban.                         |
| `steam://connect/…`, `steam://rungameid/…`, `steam://joinlobby/…` | Szerverhez kapcsolódás, játékindítás vagy lobby megnyitása a Steam kliensben.      |
| Támogatott `discord://` csatorna- és meghívóhivatkozás            | Megnyitás a Discord kliensben.                                                     |
| `magnet:?…`                                                       | Átadás a regisztrált magnet-kezelőnek.                                             |

Ehhez a megfelelő kliensnek telepítve kell lennie, és kezelnie kell az adott protokollt. Ha a Windows alkalmazásválasztót ad vissza, a fogadó klienst ott válaszd ki; ha kezelőt sem talál, a Tracer hibát jelez. Engedélyezd a kliensben a hivatkozások kezelését, és szükség esetén ellenőrizd a Windows **Alapértelmezett alkalmazások** protokoll-hozzárendelését.

A kapcsolatot, hitelesítést, fájlátvitelt és a Steam/Discord műveletét a külön kliens végzi. A Tracer nem tartalmaz beépített SFTP-, SSH- vagy FTP-klienst, és a sikeres átadás önmagában nem igazolja a kiszolgálóhoz kapcsolódást. Csak támogatott, ellenőrzött URI-alakok nyílnak meg; tetszőleges Steam/Discord-parancs nem támogatott. Automatikus oldalbetöltés vagy felhasználói művelet nélküli script nem indíthat külső alkalmazást.

A natív ellenőrzés valódi böngészőbemenettel és ellenőrzött átadási hívásokkal futott, tesztben megadott protokoll-hozzárendeléssel. Külső SFTP-kliens bejelentkezését vagy kiszolgálókapcsolatát nem próbálta ki.

A helyi gép külön, csak olvasó Windows-lekérdezése SFTP, SSH, SCP, FTPS és FTPES esetén konkrét WinSCP-hozzárendelést talált. FTP, tel és sms esetén a Windows alkalmazásválasztót adott vissza, magnet-kezelő pedig nem volt. Ez a gép aktuális beállítása, és a lekérdezés nem indított külső alkalmazást.

Normál és privát ablakból használható az átadás. A külön kliens saját előzményeire és adatkezelésére a Tracer privát módja nem vonatkozik. **Tor és Live Sandbox ablakból külső alkalmazás nem indítható.**

## Kézi frissítés

Windows x64 telepítő: Tracer-Setup-0.3.7-x64.exe (`../dist/Tracer-Setup-0.3.7-x64.exe`), **155 828 427 bájt**. SHA-256: `5a093f846c09d64f839b01e8c2a5cd0f946ca6a247b26a3f03c029cdc856738b`. A manifest és a `.sha256` kísérőfájl egyezik. Futtasd kézzel, majd indítsd újra a Tracert; automatikus telepítés nem történt. A helyi fejlesztői NSIS telepítő **Authenticode-aláírás nélkül** készült, mért állapota `NotSigned`, ezért a Windows ismeretlen kiadót jelezhet. A verzióhoz kötött mért ellenőrzési eredményeket a VALIDATION.md (`VALIDATION.md`) tartalmazza.
