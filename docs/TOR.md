# Tor kapcsolat Windows alatt

A Shields panel **Tor ablak** gombja izolált, memóriában tárolt böngészési munkamenetet indít. A kiadás tartalmazza a Tor Project Windows x64 Expert Bundle 15.0.24 csomagját (Tor 0.4.9.13), ezért külön Tor telepítése nem szükséges. A kapcsolat első felépítése több másodpercet vehet igénybe; a panel mutatja a folyamatot és a **Megszakítás** gombbal leállítható.

A Tracer először a beállított helyi portot, majd a szokásos `127.0.0.1:9050` és `127.0.0.1:9150` címeket ellenőrzi valódi SOCKS5, hitelesítés nélküli kézfogással. Külső proxy esetén a felirat **helyi SOCKS5 kapcsolat**: ez önmagában nem bizonyítja, hogy a szolgáltatás a Tor hálózatot használja. A Tor ablakból a [Tor ellenőrzőoldal](https://check.torproject.org/) nyitható meg.

Ha nincs futó proxy, a Tracer a kiválasztott `tor.exe` fájlt, majd a csomagolt motort vagy a felismert helyi telepítést indítja. A motor csak a `Bootstrapped 100%` állapot és a sikeres SOCKS5 ellenőrzés után használható. A keresés ezekre a helyekre korlátozódik:

- Fejlesztés: `vendor/tor/tor/tor.exe`; csomagolt kiadás: `resources/tor/tor/tor.exe`.
- A felhasználó Desktop, Documents, Downloads és LocalAppData könyvtárában, illetve Program Files alatt: `Tor Browser/Browser/TorBrowser/Tor/tor.exe`.
- Program Files alatt: `Tor/tor.exe`.
- LocalAppData alatt: `BraveSoftware/Brave-Browser*/User Data/TorClient`, valamint a [Brave hivatalos listájában](https://github.com/brave/brave-browser/wiki/Brave-Components) szereplő három Tor komponensazonosító könyvtára (`cldoidikboihgcjfkhdeidbpclkineef`, `cpoalefficncklhjfpglfiplenlpccdb`, `biahpgbdmdkfgndcmfiipgcebobojjkp`), komponensenként legfeljebb 16 számozott verzió közvetlen fájljai. A Stable, Beta és Nightly név ismert; más könyvtárakat nem pásztáz.

Más telepítési helyhez a panel **Tor motor kiválasztása** gombjával az eredeti `tor.exe` választható ki. A hozzá tartozó DLL-eket hagyd az eredeti mappában. Hiányzó motorhoz a panel a [Tor Project hivatalos letöltési oldalát](https://www.torproject.org/download/) nyitja meg; a böngésző futás közben nem tölt le és nem telepít programot automatikusan.

A Tracer által indított motor egy saját, véletlen nevű `tor-runtime/session-*` könyvtárat, saját üres alapkonfigurációt és saját `torrc` fájlt kap. Más böngésző Tor adatait vagy konfigurációját nem olvassa és nem módosítja. A SOCKS port véletlen, csak a helyi gépről érhető el; a DNS- és vezérlőport kikapcsolt. A kezelt motor `SafeSocks 1` beállítással fut, így a hosztnév feloldását a proxytól várja.

A Tor ablak Chromium munkamenetében egyetlen rögzített SOCKS5 proxy szerepel, a helyi címek automatikus proxymegkerülése is kikapcsolt. Közvetlen hálózati visszaesés nincs: leállt proxy esetén az oldal hálózati hibát mutat. WebRTC nem proxizott UDP-forgalma tiltott; a Tor munkamenet előzményei és lapjai nem kerülnek a normál profilba, letöltései tiltottak.

A **Megszakítás**, a Ghost Protocol, az utolsó Tor ablak bezárása és a rendes alkalmazáskilépés leállítja a Tracer saját Tor folyamatát, majd törli annak ideiglenes adatmappáját. A más alkalmazás által indított Tor szolgáltatást nem állítja le. Kényszerített folyamatleállítás vagy operációs rendszer összeomlása után ideiglenes fájlok maradhatnak; ez nem biztonságos háttértártörlés. Az új indítás mindig új adatmappát használ.

Ez Chromium böngésző Tor proxyval: nem valósítja meg a Tor Browser teljes ujjlenyomat-védelmét, áramkör-kezelését vagy automatikus hídkonfigurációját. Ha a hálózat blokkolja a Tort, a bootstrap 90 másodperc után megáll; használj megfelelően beállított Tor Browsert, és kapcsolódj annak helyi SOCKS5 portjához.

## Fejlesztés és ellenőrzés

`npm run vendor:tor` a kiadáshoz rögzített hivatalos csomagot helyezi a `vendor/tor` könyvtárba. A Windows csomagolás ezt `extraResources` útján veszi át. A letöltött csomag SHA-256 értéke:

```text
e9dc6ccc93cd6afa507193f4de284d6424233ff5102155cd2c94b259e8a22b65
```

A hash a [hivatalos kiadási ellenőrzőösszeg-listával](https://dist.torproject.org/torbrowser/15.0.24/sha256sums-signed-build.txt) ellenőrzött; ez a buildfolyamat önmagában nem ellenőrzi a külön GPG aláírást. A licenc- és komponensadatokat a mellékelt csomag és `THIRD_PARTY_NOTICES.md` őrzi.

`node --test tests/tor.test.cjs` a SOCKS kézfogást, hibás portokat, időkorlátot, megszakítást, ismert telepítési helyeket és a saját folyamat életciklusát teszteli helyi, szintetikus szolgáltatásokkal. `artifacts/tor-runtime.json` a valódi csomagolt motor 100%-os bootstrapjának és sikeres kézfogásának eredményét tartalmazza. Az Electron integrációs teszt külön ellenőrzi a tényleges proxyútvonalat és a közvetlen visszaesés hiányát.

Protokoll: [Tor SOCKS specifikáció](https://spec.torproject.org/socks-extensions.html). Chromium beállítás: [Electron Session API](https://www.electronjs.org/docs/latest/api/session) és [Chromium proxy működés](https://chromium.googlesource.com/chromium/src/+/HEAD/net/docs/proxy.md). A kiadáshoz tartozó Tor konfigurációs kézikönyv a mellékelt forráscsomag `doc/man/tor.1.txt` fájlja.
