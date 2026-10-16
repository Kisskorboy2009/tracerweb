# Bővítmények

Az eszköztár bővítmény ikonja a telepített bővítményeket és a Tracer Store-t nyitja
meg. Bővítmények csak a normál profilban futnak; privát, Tor és Sandbox ablakban nem.

## Telepítés

- **Tracer Store** – két beépített Manifest V3 bővítmény:
  - **Olvasáskomfort** – papírszínű vagy sötét olvasási nézet, nagyobb szöveg és
    sorköz. A felugró panelen kapcsolható be.
  - **Shorts Cleaner** – elrejti a YouTube Shorts ajánlásokat, és a Shorts címeket
    a normál lejátszóra irányíthatja.
- **Chrome Web Store** – egy bővítmény áruházi oldalán a **Hozzáadás a Tracerhez**
  gombbal, vagy a Bővítmények panelen az áruházi link beillesztésével.
- **Saját csomag** – egy kicsomagolt bővítménymappa, amely tartalmazza a
  `manifest.json` fájlt.

Telepítés előtt egy rendszerablak felsorolja a kért engedélyeket és az elérhető
webhelyeket; jóváhagyás nélkül a profil nem változik. A csomag másolata a profil
`extensions` mappájába kerül, az eredeti mappa ezután áthelyezhető.

## Kezelés

A Telepített lapon a bővítmények be- és kikapcsolhatók, eltávolíthatók, a saját
felületük pedig külön ablakban nyílik meg. A már nyitott lapokon a változás
újratöltés után érvényesül. A Ghost Protocol a telepített bővítményeket megtartja.

## Ellenőrzések

- Áruházi csomag: a CRX3 aláírás, a Google áruházi igazolása és a bővítményazonosító
  ellenőrzött. Legfeljebb 128 MB tömörítve és 256 MB kibontva.
- Saját csomag: legfeljebb 256 MB, 8192 fájl és 12 könyvtárszint, szimbolikus
  hivatkozások nélkül.
- A jóváhagyott manifest ellenőrzőösszege tárolódik; ha a csomag engedélyei
  változnak, új jóváhagyás kell.

A Chrome bővítmény-API-k támogatásáról: [CHROME_COMPATIBILITY.md](CHROME_COMPATIBILITY.md).
