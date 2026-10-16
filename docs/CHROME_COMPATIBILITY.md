# Chrome-bővítmények kompatibilitása

A Tracer az Electron bővítménytámogatására épül, amelyet saját adapterek egészítenek
ki. A legtöbb tartalomszkriptet és felugró panelt használó bővítmény működik; az
egész böngészőt mélyen módosító bővítmények nem mindig.

## Támogatott API-k

| API                            | Támogatás                                                                           |
| ------------------------------ | ----------------------------------------------------------------------------------- |
| `storage`, `runtime`, `i18n`   | Az Electron beépített támogatása                                                    |
| `tabs`, `windows`              | A Tracer valódi lap- és ablakmodelljéhez kötve                                      |
| `scripting`, tartalomszkriptek | Igen, a jóváhagyott webhelyeken                                                     |
| `permissions`                  | Lekérdezés, opcionális `tabs`/`notifications` és HTTP/HTTPS hostjogok jóváhagyással |
| `contextMenus`                 | Oldal-, kijelölés-, link-, mező-, keret- és médiamenük, almenük, jelölők            |
| `notifications`                | `basic` típusú rendszerértesítések, kattintás és bezárás eseménnyel                 |
| `tabCapture`                   | Az aktív lap hangjának rögzítése (videó nélkül)                                     |
| `webNavigation`                | Navigációs események a normál lapokhoz                                              |

A `chrome` és a `browser` névtér egyaránt elérhető, a felületeken és a Manifest V3
háttérszolgáltatásban is.

## Nem támogatott

- `nativeMessaging` és `privacy` – az ezeket kötelezően kérő bővítmények telepítése
  hibaüzenettel áll le.
- Chrome-témák és a bővítmények automatikus frissítése.
- Képes, listás, folyamatjelzős vagy gombos értesítések.

Telepítéskor a Tracer jelzi, ha egy bővítmény olyan API-t kér, amelyet nem tud
kiszolgálni. Ez előzetes szűrés: egy csomag a manifestből nem látható API-kat is
használhat, ezért ritkán előfordulhat, hogy egy telepített bővítmény részben működik.
