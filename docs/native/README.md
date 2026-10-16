# Natív szűrőmotor

A Brave [adblock-rust](https://github.com/brave/adblock-rust) motorját köti az Electron
főfolyamathoz Node-API modulként. Ha a lefordított `tracer_adblock.node` jelen van, a
Tracer ezt használja; különben a beépített JavaScript-motor szűr.

```text
native/
├── Cargo.toml              Rust workspace
├── build.ps1               Windows build és tesztek
├── adblock-core/           Szűrés és szabálycsere (Rust tesztekkel)
└── tracer-adblock/         Node-API adapter, TypeScript típusok, Node teszt
```

## Fordítás Windows alatt

Szükséges: Rust 1.88+ MSVC toolchain, Visual Studio C++ Build Tools, Node.js.
A projekt gyökeréből:

```powershell
rustup target add x86_64-pc-windows-msvc
powershell -ExecutionPolicy Bypass -File .\native\build.ps1
```

A szkript lefuttatja a Rust teszteket, lefordítja a modult a
`native/tracer-adblock/tracer_adblock.node` helyre, majd a Node teszteket. ARM64-re:
`.\native\build.ps1 -Target aarch64-pc-windows-msvc` (ARM64 C++ build eszközökkel).

Rust ellenőrzések:

```powershell
cargo fmt --manifest-path .\native\Cargo.toml --all
cargo test --manifest-path .\native\Cargo.toml -p tracer-adblock-core
cargo clippy --manifest-path .\native\Cargo.toml -p tracer-adblock-core -- -D warnings
```

## Használat

```javascript
const addon = require('./native/tracer-adblock/tracer_adblock.node');
addon.replaceRules(['||tracker.example^$third-party']);
const decision = addon.matches(
  'https://tracker.example/pixel',
  'https://site.test/',
  'image',
  'GET',
);
// webRequest: { cancel: decision.matched }
```

| Mező           | Jelentés                                               |
| -------------- | ------------------------------------------------------ |
| `matched`      | A kérés blokkolandó (a kivételek figyelembevételével)  |
| `exception`    | Kivételszabály illeszkedett                            |
| `filter`       | Az illeszkedő szabály szövege                          |
| `rewrittenUrl` | `$removeparam` által módosított cím                    |
| `error`        | Érvénytelen kérés; a hívó a JavaScript-motorra válthat |

A szűrés szinkron, az Electron főszálán fut. A modul hálózati szabályokat kezel; a
kozmetikai szabályokat és a YouTube-védelmet a Tracer külön valósítja meg.

Licenc: az adblock-rust és a saját crate-ek MPL-2.0 licencűek.
