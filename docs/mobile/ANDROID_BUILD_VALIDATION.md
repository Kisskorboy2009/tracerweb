# Android 0.3.7 ellenőrzés

2026. október 13-án elkészült a **Tracer Preview 0.3.7 APK**, versionCode 3007. A csomag fejlesztői kulccsal aláírt, telepíthető előzetes; Android 9 vagy újabb és naprakész Android System WebView szükséges hozzá.

| Ellenőrzés | Eredmény |
|---|---|
| Kotlin/Java fordítás és R8 optimalizálás | Sikeres |
| Android lint | 0 hiba, 61 figyelmeztetés |
| JVM-kérésfilter-tesztek | 10/10 sikeres |
| JVM-címsor és URL-policy tesztek | 7/7 sikeres |
| JVM-munkamenetkódolási tesztek | 6/6 sikeres |
| Összes JVM-teszt | 23/23 sikeres; 0 hiba és kihagyás |
| APK-aláírás | Érvényes v2; 1 RSA 2048 aláíró; a korábbi Preview kulcsa |
| Fordított manifest | API 28+, target SDK 35, debuggable=false, cleartext=false, backup=false |
| Külső webhivatkozások | HTTP/HTTPS VIEW és BROWSABLE intent, normál Activity singleTop |
| Privát komponensek | Nem exportált Activity és receiver, külön :private process |
| Csomagolt assetek és licencek | 5/5 bájtra és hashre egyezik a forrással |
| YouTube-segéd | Egyezik az asztali forrásból generált mobil assettel; JS szintaxis jó |
| Készülék / emulátor | Nem futott; nincs kapcsolt készülék vagy telepített emulátor |

A lint-jelzések KTX-, szövegerőforrás-, hozzáférhetőségi és függőségfrissítési ajánlásokat is tartalmaznak. A részletes reportmásolatok a `mobile/testing/android-build-reports/` mappában vannak: `validation.json`, `lint-preview.txt`, `lint-preview.xml`, a három teszt XML, valamint `apk-signature.txt` és `apk-manifest.txt`.

## Azonosított letöltés

```text
dist/Tracer-0.3.7-android-preview.apk
Méret: 2 636 921 bájt
SHA-256: f2c6cbfba321582f69dd521f3998de760ef91ac2cb353197782b963b6be11d2a
Package ID: app.tracer.mobile.preview
Version: 0.3.7 / versionCode 3007
```

Az APK, a `.apk.sha256`, a `dist/latest-android.json` és a Gradle-kimenet egyezik. Az aláíró tanúsítvány SHA-256-a `89dc64757353ad72c710791927db7708d4e8bd1dc41d124b44a5dcce4fdf7bea`, ugyanaz, mint a 0.3.2 Preview-é. A Preview a korábbi Preview-ra frissíthető. A kulcs a helyi `%USERPROFILE%/.android/debug.keystore` fájlban marad, a weboldal nem tartalmazza.

## A frissítés működése

- A normál profil legfeljebb 100 lap címe, címsora és aktív lapja helyi pillanatképből áll vissza. Veszélyes protokollok, hitelesítő adatot tartalmazó és hibás URL-ek nem kerülnek a WebView-ba.
- Konfigurációváltáskor a WebView vissza/előre állapota korlátos memóriakerettel megőrizhető. Túl nagy rendszer-Bundle esetén a normál URL-pillanatkép ad visszaállítási alapot.
- Privát lapállapot kizárólag az élő privát process memóriájában marad; a rendszer saved-state-je csak véletlen azonosítót kap. A privát process megszűnése után a lapok nem állnak vissza.
- Felhasználói kattintásból nyíló új ablak új lapot kap ugyanabban a profilban. A Surge megtartja az élő popup és a szülő WebView kapcsolatát.
- A teljes képernyős médiát a Vissza gomb, lapbezárás és háttérbe kerülés lezárja. A privát zárolás fölött nem marad médiafelület.
- A letöltések a normál profilban megerősítéssel indulnak, tisztított fájlnévvel. A Letöltések menü a rendszer letöltéslistáját nyitja. Android 9-en az app külső letöltésmappája, Android 10+-on a nyilvános Downloads mappa használatos.
- Elérhető a Kezdőlap, oldalmegosztás, webcím másolása, oldalon keresés és asztali nézet. A Surge-beállítás újraindítás után megmarad.
- A saját privát párbeszédek képernyőképvédettek és háttérbe kerüléskor bezáródnak. A privát JavaScript párbeszédek nem jelennek meg; normál módban a szokásos WebView-kezelés működik.
- Fájlfeltöltéskor kizárólag a kiválasztó által átadott `content://` dokumentumok fogadhatók el; `file://`, más protokollok és saját app-provider URI-ja nem kerül az oldalhoz.

A meglévő Shields, HTTPS-védelem, privát biometria, könyvjelzők, előzmények, témák, háttérimport és titkosított kézi szinkron megmaradt. Kamera-, mikrofon- és helyengedélyt a weboldalak nem kapnak.

## Telepítés és korlátok

A letöltött APK megnyitásakor az Android kérheti az adott letöltő alkalmazásból származó APK-k telepítésének engedélyezését. A név **Tracer Preview**. Ez saját fejlesztői aláírású előzetes, nem Play Store-kiadás.

A build, a lint, a JVM-tesztek és a csomagellenőrzés sikeres. A valódi telefonos böngészés, biometria, cookie-izoláció, OAuth-popup, DRM, videó, feltöltés, letöltés és szinkron instrumentation futása **még nincs igazolva**. Az iOS build és a távoli webes közzététel külön feladat.

## Reprodukálás

```powershell
.\scripts\mobile-build.ps1 -Variant Preview
node scripts/mobile-content-shields.mjs --check
npm.cmd run website:build
```

A build ellenőrzi a tényleges csomagazonosítót, verziót, versionCode-ot, SDK-szinteket, debuggable jelzőt, v2-aláírást és keystore-tanúsítványt. A weboldal-build a valódi EXE/APK méretét és SHA-256-át ellenőrzi, majd készíti el a letöltési jegyzéket. A hordozható eszközök a `%LOCALAPPDATA%/TracerBuildTools` alatt találhatók: JDK 17, Gradle 8.11.1, SDK 35 / build-tools 35.0.0; a projekt AGP 8.9.1 és Kotlin 2.1.20 verziókat rögzít.
