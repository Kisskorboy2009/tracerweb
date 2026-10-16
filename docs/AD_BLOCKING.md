# Reklám- és követőszűrés

A Shields új profilban bekapcsolt. Az eszköztár pajzs gombja az aktuális oldal
blokkolt kéréseit mutatja; a Shields panelen webhelyenként állítható minden kapcsoló.

## Hálózati szűrés

- A böngésző a saját `shared/filters/core.txt` szabályai mellett az EasyList és az
  EasyPrivacy mellékelt példányát használja, így az első indulástól internet nélkül
  is szűr. A listák kézzel frissíthetők a Shields panelen.
- A beépített JavaScript-motor a gyakori szabálytípusokat (domain, útvonal,
  erőforrástípus, harmadik fél, kivételek) kezeli; az ismeretlen szintaxist kihagyja,
  hogy ne tiltson a kelleténél többet.
- Ha a `native/tracer-adblock` modul le van fordítva, a Brave-féle adblock-rust
  motor dolgozik a teljes hálózati szabálykészlettel.

## Oldalvédelem

- **HTTPS-Only** – a titkosítatlan címeket HTTPS-re váltja; a titkosítatlan
  POST-kéréseket tiltja.
- **Követőparaméterek** – az ismert követő URL-paramétereket (például `utm_*`,
  `fbclid`) eltávolítja.
- **Cookie-bannerek** – az ismert bannereket elrejti; hozzájárulást nem ad.
- **WebRTC védelem** – a proxy nélküli közvetlen UDP-kapcsolatokat tiltja.
- **Context Fence** és **Quiet Lease** – szigorúbb, alapból kikapcsolt módok
  idegen eredetű és háttérben indított kérésekhez.

## YouTube

Egy elkülönített környezetben futó segéd csak a YouTube oldalain, bekapcsolt
Shields mellett dolgozik. A reklámként jelölt videót elnémítja, felgyorsítja vagy
kihagyja, a reklámfelületeket elrejti; a normál lejátszáshoz nem nyúl. A YouTube
felülete gyakran változik, ezért ritkán egy-egy reklám átjuthat.

## Android

Androidon egy kisebb, beépített domainlista és a YouTube-segéd dolgozik. A Shields
és a cookie-banner kapcsoló a Beállítások menüben található.

A listák forrása és licence: `shared/filters/sources.json` (EasyList, CC BY-SA 3.0).
