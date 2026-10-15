# Tracer 0.3.10

Androidon a normál lapokon elindított zene alkalmazásváltáskor és lezárt képernyő mellett is folytatódhat. Az Android értesítésében és médiapaneljén szünet, folytatás, leállítás és támogatott tartalomnál tekerés, előző/következő szám érhető el. A webhely dalcíme és előadója megjelenik, ha a lejátszó megadja ezeket.

## Használat

1. Nyiss meg egy zenét tartalmazó HTTPS-oldalt és indítsd el a lejátszást.
2. Válts másik alkalmazásra vagy zárd le a kijelzőt. A Tracer médiavezérlője az Android értesítéseiben marad.
3. A lejátszó lap bezárása leállítja a zenét és bezárja a médialejátszási munkamenetet. Ugyanezt teszi a Leállítás gomb, ahol az Android megjeleníti; a médiapanel gombjait a rendszerverzió választja meg. Az adatok törlése és az alkalmazás eltávolítása a legutóbbi alkalmazásokból szintén leállítja.

A **Beállítások → Háttérben lejátszás** kapcsoló alapból bekapcsolt. Privát lapokhoz nem készül natív médiamunkamenet és nyilvános dalértesítés. A Surge a médialejátszó lapot szüneteltetéskor is megőrzi az értesítésből történő folytatáshoz. A többi inaktív lap továbbra is felszabadítható. Az automatikus app-frissítés a médialejátszó bezárásáig vár; a kézi telepítés továbbra is azonnal kérhető.

A meglévő Shields reklám- és követőszűrés megmarad. Az alkalmazás az oldal saját lejátszóját használja; a szolgáltató elérhetőségi, bejelentkezési, DRM- és előfizetési szabályai érvényesek. Minden szolgáltatás és minden reklám szűrése nem garantálható.

## Alapértelmezett böngésző

A **Beállítások → Beállítás alapértelmezettként**, illetve a menü **Alapértelmezett böngésző** gombja megnyitja az Android választóját. Válaszd a **Tracer** alkalmazást és erősítsd meg. Ha a rendszer választója nem érhető el, a Tracer a rendszer alapértelmezett alkalmazásainak beállítására vált. A kijelzett állapot mindig a rendszer tényleges választását követi. A kívülről megnyitott webes link új normál lapon nyílik meg, így a zenét lejátszó lap megmarad.

## Frissítés és kiadás

Az APK ugyanazt a csomagazonosítót és aláírókulcsot használja, mint a 0.3.9. A Windows csomag közös verziószáma is 0.3.10; a desktop böngésző működése ebben a kiadásban nem változott. A nyolc feltöltendő fájl a `dist/release-assets-v0.3.10` mappában, a részletes feltöltési útmutató a `dist/PUBLISH_0.3.10.md` fájlban készül el. A 0.3.9 frissítője a publikált új GitHub Release-ből fogadja az új csomagokat.
