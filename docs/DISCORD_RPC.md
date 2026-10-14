# Discord · YouTube Rich Presence

A Windows Tracer opcionálisan megosztja a normál YouTube- vagy YouTube Music-lapon
hallható lejátszás címét, csatornáját és időzítését a helyben futó Discord asztali
klienssel. A beépített Tracer alkalmazásazonosító: `1558521285124956335`, amelyet a
felhasználó nem módosíthat. A kapcsoló új profilokon
kikapcsolt; a felhasználó a **Beállítások → Discord · YouTube Rich Presence →
YouTube-állapot megosztása** sorban engedélyezheti.

## Használat

1. Indítsd el és jelentkezz be a Discord asztali alkalmazásba.
2. A Discord tevékenység-adatvédelmi beállításainál engedélyezd a tevékenységed
   megjelenítését. A Discord saját láthatósági szabályai továbbra is érvényesek.
3. Kapcsold be a megosztást a Tracer normál ablakában.
4. Játssz le egy videót vagy zenét YouTube/YouTube Music `/watch` oldalon.
   A Tracer beállításainál látható a kapcsolat és a megosztás állapota.

A Discord fő alkalmazásnevét a beépített Tracer alkalmazás regisztrációja
határozza meg. A tartalmi állapot külön is jelzi a Tracer használatát.
Discord-token, bot, jelszó vagy OAuth-titok nem kell.
Az Android és iOS változat nem használja ezt az asztali IPC-integrációt.

Régi profil betöltésekor a tárolt alkalmazásazonosító a beépített Tracer ID-ra
migrál; az érvényes, explicit be- vagy kikapcsolási választás megmarad. A
beállítások módosításakor csak az `enabled` logikai kapcsoló fogadható el:
`clientId` vagy ismeretlen mező küldése hibát ad, és nem módosítja a beállítást.

## Működés és adatvédelem

A folyamat a Discord helyi IPC-csatornáján küld `SET_ACTIVITY` parancsot,
`Listening` aktivitással. A Discord kapcsolata továbbítja a kijelzést a profilra;
Tracer-backend vagy helyi HTTP-kiszolgáló nincs a megoldásban.

Csak pontos HTTPS YouTube-eredetű, érvényes videóazonosítót tartalmazó `/watch`
lap olvasható. A DOM-lekérdezés elkülönített világban fut, Node.js és a Tracer IPC
felülete nélkül. A főfolyamat külön ellenőrzi a lap módját, az URL-t, a natív
hallhatóságot, a némítást és a dokumentum érvényességét. A kijelzéshez csak
korlátozott cím, csatornanév és időadat jut el; teljes URL, keresési paraméter,
fiókadat és böngészési előzmény nem része a payloadnak. A profil nem tárol
lejátszási naplót.

Szüneteltetés, videóvége, némítás, jelölt reklám, megosztás kikapcsolása, privát/
Tor/Sandbox Tracer ablak előtérbe kerülése, Ghost, minden böngészőablak elrejtése
vagy alkalmazáskilépés törli a kijelzést. Normál háttérlapon hallható zene más
alkalmazás használata közben is megjelenhet. A kapcsolat újraindulhat, ha a
Discord később indul vagy újraindul; a kimenő frissítések korlátozottak.

## Ellenőrzési határ

A helyi tesztek saját Discord-IPC fixture-rel és szintetikus YouTube-médiával
vizsgálják a protokollt, a lejátszást, a privát kizárást és a megszakított
lekérdezéseket. Nem jelentkeznek be a felhasználó Discord-/YouTube-fiókjába és nem
tesznek közzé valódi aktivitást. A megadott alkalmazásazonosítóval az éles Discord
profilkártya megjelenését felhasználói bekapcsolás után lehet ellenőrizni.

Elsődleges referencia: [Discord IPC és SET_ACTIVITY dokumentáció](https://docs.discord.com/developers/topics/rpc).
