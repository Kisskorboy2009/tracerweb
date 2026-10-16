# Tor ablak

A Shields panel **Tor ablak indítása** gombja külön, memóriában tartott
munkamenetet nyit, amely kizárólag a Tor hálózaton át böngészik. A telepítő
tartalmazza a Tor Project hivatalos Windows motorját, így külön telepítés nem kell.
Az első kapcsolódás néhány másodpercig tart; a panel mutatja a folyamatot, és
megszakítható.

## Hogyan kapcsolódik

1. Ha a gépen már fut egy helyi Tor szolgáltatás (`127.0.0.1:9050` vagy `9150`, például
   a Tor Browser), a Tracer azt használja.
2. Különben elindítja a csomagolt motort, vagy a felismert helyi Tor-telepítést
   (Tor Browser, Brave Tor komponens). Más helyen lévő `tor.exe` a **Tor program
   kiválasztása** gombbal adható meg.

A saját motor véletlen, csak helyben elérhető porton fut, saját ideiglenes
adatmappával, és a Tor ablak bezárásakor, a Ghost Protocolnál vagy kilépéskor leáll.

## Védelem

- A Tor ablakban egyetlen SOCKS5 proxy van beállítva, közvetlen kapcsolat nincs:
  ha a proxy leáll, az oldalak nem töltődnek be.
- A WebRTC nem proxizott UDP-forgalma tiltott, a letöltések le vannak tiltva, az
  előzmények nem kerülnek a normál profilba.
- A [Tor ellenőrzőoldalon](https://check.torproject.org/) megnézheted, hogy a
  kapcsolat valóban Toron megy-e.

A Tor ablak Chromium motorral, Tor proxyn át böngészik: a Tor Browser teljes
ujjlenyomat-védelmét nem helyettesíti. Ha a hálózatod tiltja a Tort, használd a Tor
Browsert hidakkal, és a Tracer automatikusan felismeri a helyi kapcsolatát.

## Fejlesztés

`npm run vendor:tor` letölti a rögzített verziójú hivatalos csomagot a `vendor/tor`
mappába, és ellenőrzi a SHA-256 értékét. A Windows build innen csomagolja a motort.
