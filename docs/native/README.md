# Tracer natív hálózati szűrőmotor

Ez a modul Brave `adblock-rust` 0.13.3 motorját kapcsolja az Electron főfolyamatához. A Rust mag önálló crate; a Node-API adapter ettől különálló crate. A C++ Chromium renderelő továbbra is az Electron része. A saját C++ motor implementálása helyett a szűréshez használunk Rustot.

## Fájlok

```text
native/
├── Cargo.toml                         # Rust workspace
├── build.ps1                          # Windows x64/ARM64 build + ellenőrzés
├── adblock-core/
│   ├── Cargo.toml
│   └── src/lib.rs                     # Szűrés, szabálycsere, 7 Rust teszt
└── tracer-adblock/
    ├── Cargo.toml
    ├── build.rs
    ├── src/lib.rs                     # Node-API adapter
    ├── index.d.ts                     # Nyilvános TypeScript szerződés
    ├── smoke-test.cjs                 # Node-API és worker izoláció teszt
    └── tracer_adblock.node            # Build eredménye; nincs a forrásban
```

## Fordítás Windows alatt

Előfeltétel: Rust 1.88 vagy újabb MSVC toolchain, Visual Studio C++ Build Tools és Node.js. A Node-API 8-at biztosító aktuális Electron szükséges a futtatáshoz. A build parancsot a projekt gyökerében futtasd:

```powershell
rustup target add x86_64-pc-windows-msvc
powershell -ExecutionPolicy Bypass -File .\native\build.ps1
```

A script előbb a Rust mag tesztjeit futtatja, aztán lefordítja és `.node` kiterjesztéssel kimásolja a DLL-t a `native/tracer-adblock/tracer_adblock.node` helyre, végül lefuttatja a Node teszteket. Csak egyező Node/cél-architektúra esetén futtatható az utolsó lépés.

ARM64 build:

```powershell
rustup target add aarch64-pc-windows-msvc
powershell -ExecutionPolicy Bypass -File .\native\build.ps1 -Target aarch64-pc-windows-msvc
```

Ehhez a Visual Studio ARM64 C++ build eszközei is szükségesek. Az ARM64 eredményt ARM64 Node/Electron alatt kell tesztelni. Külön buildet készíts minden kiadott architektúrához, mert a script mindig ugyanarra az addon útvonalra másol.

Önálló Rust ellenőrzés:

```powershell
cargo fmt --manifest-path .\native\Cargo.toml --all
cargo test --manifest-path .\native\Cargo.toml -p tracer-adblock-core
cargo clippy --manifest-path .\native\Cargo.toml -p tracer-adblock-core -- -D warnings
```

Az első Cargo futás létrehozza a `native/Cargo.lock` fájlt. A kiadás előtt ezt verziókezelésbe kell venni, és a későbbi CI buildet `--locked` kapcsolóval kell futtatni. A közvetlen függőségek verziói rögzítettek, a tranzitív függőségek teljes reprodukálhatóságát a lockfile biztosítja. Ebben a fejlesztői környezetben Cargo/Rust nem volt telepítve; a Rust fordítás és a natív runtime ellenőrzés ezért még nem futott le.

## Electron szerződés

```javascript
const addon = require('./native/tracer-adblock/tracer_adblock.node');
addon.replaceRules([
  '||tracker.example^$third-party',
  '@@||tracker.example/essential.js$script,domain=trusted.test',
]);
const decision = addon.matches(
  'https://tracker.example/pixel',
  'https://site.test/',
  'image',
  'GET',
);
if (decision.error) {
  // A hívó adjon explicit hibakezelést vagy használja a JS tartalékmotort.
}
// webRequest callback: { cancel: decision.matched }
console.log(addon.engineInfo());
```

A `matches` negyedik paramétere opcionális, az alapértéke `GET`; valós kéréseknél az Electron `details.method` értékét add át. Az initiáló oldal URL-je szükséges a `$third-party` és `$domain` szabályokhoz. Ha a forrás URL üres, a modul a kérés URL-jét használja; ismeretlen forrásból nem állítható biztosan, hogy egy kérés harmadik féltől származik. A `mainFrame` és `subFrame` értékeket az adapter `document` és `subdocument` típusra fordítja.

A visszatérési mezők:

| Mező | Jelentés |
|---|---|
| `matched` | A kérés ténylegesen blokkolandó; a kivételek figyelembevétele után |
| `exception` | Kivételszabály illeszkedett |
| `filter` | A forrásszabály szövege, amikor elérhető |
| `redirect` | Upstream csere-erőforrás; jelenleg nincs telepített erőforráskészlet |
| `rewrittenUrl` | `$removeparam` által előállított URL; külön, validált átirányítás szükséges |
| `error` | Érvénytelen kérés; a modul visszatér és nem állítja le a főfolyamatot |

Az `engineInfo().loadedRuleLines` az átadott, nem üres hálózati jelölt szabályok számát jelzi. A parser által fel nem ismert szabályokat az upstream motor figyelmen kívül hagyhatja; a mező nem elfogadott-szabály számláló. Üres `replaceRules([])` törli az összes szabályt. A csere új motort fordít, és méretellenőrzési hiba esetén megőrzi a korábbi motort.

A szűrés és szabálycsere szinkron; az Electron főszálán használd. A nagyméretű lista fordítása rövid időre blokkolhatja ezt a szálat, ezért kiadásnál ritka, ütemezett frissítés és mért indulási idő szükséges. A natív motor `!Send` és `!Sync`; a Node adapter szálanként külön motort tart `thread_local!` tárolóban, saját `unsafe` kód nélkül. A workerek nem öröklik a főszál szabályait. Az Electron csomagolásnál a `.node` fájlt ASAR-on kívül kell tartani vagy kicsomagolni (`asarUnpack`).

## Támogatás és határok

A hálózati motor EasyList/EasyPrivacy jellegű Adblock Plus szintaxist és az upstream által támogatott uBlock Origin hálózati kiterjesztéseket fogadja. A domainhorgony, erőforrástípus, `$third-party`, `$domain` és `@@` kivétel működését a mellékelt tesztek ellenőrzik. A teljes uBlock Origin alkalmazás minden funkciójával való kompatibilitást ez nem jelenti.

Ez az adapter hálózati szűrést exportál. A kozmetikai `##`/`#@#` szabályok, scriptletek és a csere-erőforrások nem a hálózati adapter feladatai; a scriptletek futtatása nem implementált. A cookie-bannerek elrejtése külön renderer funkciót igényel. A modul 64 MiB / 500 000 fizikai sor méretkorlátot alkalmaz.

Chromium-szintű fingerprint-védelemhez a Canvas/WebGL/audio és más Web API-k implementációjának konzisztens motoroldali módosítása szükséges. Preload JavaScript csak részleges és megkerülhető védelem. A DNS-over-HTTPS az Electron/Chromium resolver beállítása, a WebRTC IP-politika a Chromium beállítása, a Tor pedig külön ellenőrzött proxy/daemon integráció; ezeket a szűrőmodul nem helyettesíti. A valódi folyamat- vagy OS-konténerizoláció szintén más réteghez tartozik.

A Rust mag Android/iOS célokra újrafelhasználható, de ezt a Node-API adaptert nem lehet Android WebView vagy WKWebView szűrőként betölteni. Androidhoz JNI/UniFFI adapter és WebView-kérés integráció, iOS-hoz WKContentRuleList-kompatibilis szabályfordítás szükséges. Ezeket nem állítjuk kész natív mobilintegrációnak.

## Ellenőrzött elsődleges források

- [adblock-rust projekt és funkciók](https://github.com/brave/adblock-rust)
- [adblock 0.13.3 Engine API](https://docs.rs/adblock/0.13.3/adblock/struct.Engine.html)
- [Request konstruktor és HTTP method paraméter](https://docs.rs/adblock/0.13.3/adblock/request/struct.Request.html)
- [BlockerResult és should_block](https://docs.rs/adblock/0.13.3/adblock/blocker/struct.BlockerResult.html)
- [FilterSet és add_filter_list](https://docs.rs/adblock/0.13.3/adblock/struct.FilterSet.html)
- [NAPI-RS kézi projektfelépítés](https://napi.rs/docs/introduction/manual-setup)

Az adblock-rust MPL-2.0 licencű; a saját natív crate-ek ugyanezt a licencjelölést használják. A szűrőlisták licenceit és forrásmegjelöléseit külön meg kell tartani, és a terjesztett függőségek licencszövegeit mellékelni kell.
