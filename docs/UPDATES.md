# Automatikus frissítés

Mindkét platform a [GitHub-kiadásokból](https://github.com/Kisskorboy2009/tracerweb/releases)
frissül. A frissítő a verziószám alapján választ, és minden letöltött fájl méretét
és SHA-256 hash-ét ellenőrzi telepítés előtt.

## Windows

- Indulás után 20 másodperccel, majd hatóránként keresi az új kiadást (hiba esetén
  30 perc múlva újrapróbálja).
- Az új verzió a háttérben töltődik le. Utána az eszköztáron megjelenik a
  **Frissítés** gomb: egy kattintással települ, és a böngésző a lapjaiddal együtt
  újraindul.
- Ha nem kattintasz rá, a frissítés a következő kilépéskor csendben települ.
- Telepítés után a letöltött telepítőfájl automatikusan törlődik.
- A Beállítások → Tracer frissítések részben kikapcsolható, és kézzel is indítható
  ellenőrzés.

Egy kiadáshoz ezek a fájlok kellenek: `Tracer-Setup-<verzió>-x64.exe`, a hozzá
tartozó `.blockmap`, a `latest.yml` és a `latest-x64.json`. Ezeket a
`npm run release:prepare` állítja elő a `dist/release-assets-v<verzió>` mappába.

## Android

- A Tracer használat közben hatóránként keres frissítést, és letölti.
- Android 12-től, ha a Tracer telepíthet frissítést, az új verzió csendben települ,
  amikor a böngészőt háttérbe teszed (a lejátszott zene nem szakad meg miatta).
- Ha ehhez engedély vagy jóváhagyás kell, a Tracer egy ablakban felajánlja a
  telepítést; az **Telepítés** gomb után az Android kéri a megerősítést.
- A Beállítások menüben kikapcsolható és kézzel is indítható.

A kiadáshoz az APK, a `.sha256` fájl és a `latest-android.json` szükséges.
