# Android ellenőrzés

## Végleges 0.3.9 — 2026. október 14.

Elkészült a **Tracer 0.3.9** optimalizált Android APK, versionCode 3009. A felhasználói név minden nyelven Tracer, a meglévő `app.tracer.mobile.preview` csomagazonosító és aláírókulcs megmaradt.

| Ellenőrzés | Eredmény |
|---|---|
| Kotlin/Java fordítás, R8 és APK-csomagolás | Sikeres; `minifyEnabled=true`, `debuggable=false` |
| Android lint | 0 hiba, 68 figyelmeztetés |
| JVM-tesztek | 49/49 sikeres: 12 updater-, 9 ikon-, 5 kezdőlap- és 23 navigáció/session/request-policy teszt |
| Natív tesztek a kiadott APK-n | 11/11 sikeres: 4 UI-, 2 APK/provider-, 3 PackageInstaller Session- és 2 szinkronteszt |
| UI | Natív menü, lapkezelő, világos/sötét megjelenés, Aurora-paletta, keresőváltás, adatkímélő, favicon és oldalon keresés |
| APK-verifikáció | Tényleges aláírt APK elfogadva; hibás package, signer, verzió, hash és méret visszautasítva |
| Telepítőátadás | FileProvider csak az updater cache-t adja át; olvasási URI-grant és Android Activity-boundary ellenőrizve |
| E2EE szinkron | Desktop→Android decryption, módosított ciphertext visszautasítása és Android→desktop hitelesített visszafejtés sikeres |
| Aláírás és manifest | Érvényes v2, ugyanaz a korábbi Preview-tanúsítvány, API 28+, target SDK 35, backup/cleartext/debug kikapcsolva |
| Csomagolt assetek | Mind az 5 asset/licenc bájtra és hashre egyezik a forrással; APK, `.sha256` és metadata egyezik |
| Frissítés 0.3.8-ról a végleges APK-ra | UID, első telepítési idő és teljes kontrollált beállításfájl megmarad, SHA-256 bájtazonosság |
| Fizikai telefon | Nem futott; a natív ellenőrzések dedikált Pixel 7 / API 35 / Google APIs emulátoron futottak |

```text
dist/Tracer-0.3.9-android-preview.apk
Méret: 2 820 661 bájt
SHA-256: 6e37ea25a36913d4575d35ea58652cfd811ce6a8e07c5cd003a06d309d3ec5bb
Aláíró tanúsítvány SHA-256: 89dc64757353ad72c710791927db7708d4e8bd1dc41d124b44a5dcce4fdf7bea
```

Bizonyítékok: `artifacts/android-build-0.3.9.log`, `android-instrumentation-build-0.3.9.log`, `android-instrumentation-0.3.9.log`, `android-instrumentation-0.3.9.json`, `android-package-0.3.9.json`, `sync-android-export-validation-0.3.9.log` és `artifacts/android-ui-0.3.9/`. A screenshotok a WebView vizuális állapotjelzése és két Android rajzolási frame után készülnek; a témapróba a betöltött dokumentum tényleges CSS-színét is ellenőrzi. A Graphit, sötét Aurora és világos Aurora kezdőlapokat, valamint a keresőpanelt szemrevételeztük. Az unstyled HTTPS-oldal világos canvasán 21:1, a keresőpanel mögött dimmelve 6,245:1 tényleges pixelkontrasztot mértünk; a külső dokumentum alapcanvasát a böngésző sötét témája nem színezi át. A null dokumentumgyökérnél a kozmetikai stílusbeillesztés biztonságosan visszatér.

Az updater automatikusan keres és letölt az előre rögzített `Kisskorboy2009/tracerweb` repositoryból. Egy várakozó timer működik: induláskor legalább 20 másodperc, sikeres ellenőrzés után 6 óra, hálózati hiba után 30 perc. Háttérbe kerüléskor a timer megszűnik; egy már megkezdett normál letöltés befejeződhet. Privát folyamatban nincs updater. A stream korlátos bufferrel ellenőrzi a méretet és SHA-256-ot, majd a PackageManager tényleges APK-csomagazonosítót, verziót, SDK-kat és aláírót ellenőriz. Android 12 / API 31 felett ellenőrzött PackageInstaller Session készül, USER_ACTION_NOT_REQUIRED kéréssel és UPDATE_PACKAGES_WITHOUT_USER_ACTION engedéllyel. Az automatikus commit a normál munkamenet és cookie-k tartós mentése után, onStop után vár, és az egész alkalmazás normál/privát folyamatainak láthatóságát ellenőrzi. Privát ablak nyitása és sikertelen állapotmentés elhalasztja a telepítést. A kézi Telepítés gomb a befejezett állapotmentés után azonnal indíthatja a frissítést. A Session tartós, az OS-commit előtti megszakadást felismerve biztonságosan újrapróbálható.

**Android telepítés és mérési korlát:** jogosult Android 12+ önfrissítésnél a rendszer a Sessiont felhasználói jóváhagyás nélkül telepítheti. A külső telepítési forrás engedélyezése egyszer szükséges lehet; Android 9–11 és STATUS_PENDING_USER_ACTION esetén a rendszeres jóváhagyási út megmarad. A natív tesztek valódi Sessiont hoznak létre, APK-t írnak/fsyncelnek/visszaolvasnak, ellenőrzik a tartós helyreállítást, halasztást, módosított APK és hamis callback elutasítását, valamint a megbízható rendszermegerősítést és nem exportált receivert. A visszafordíthatatlan commit tesztkapun blokkolt: tényleges csendes frissítés nem történt. Ez nem igazol távoli, később publikált GitHub-kiadásból végzett teljes telepítést. A korábbi, updater nélküli verziót egyszer kézzel kell frissíteni a 0.3.9-re.

Az emulátoron a végleges 0.3.8→0.3.9 `adb install -r` frissítés megőrizte a UID-t, első telepítési időt és a normál profil teljes, kontrollált könyvjelzőt/előzményt/munkamenetet tartalmazó beállításfájlját. Bizonyíték: `artifacts/android-emulator/upgrade-final-0.3.8-to-0.3.9.json`. A korábbi 0.3.7→0.3.8 próba ugyanezt igazolta. Az instrumentation a dedikált tesztprofilon fut, és nem tesztel felhasználói fiókot. Biometria, valódi OAuth/DRM/videó, telefonos hálózat és készülékgyártónkénti installer-viselkedés külön fizikai ellenőrzést igényel.

A külső instrumentation APK által hívott Kotlin/AndroidX és updater/szinkron belépési pontokat a Preview külön R8-szabálya őrzi meg. Nincs teljes `kotlin.**`, `kotlinx.**` vagy teljes app keep, az optimalizálás bekapcsolva marad; az éles `release` buildet ezek a tesztbelépési szabályok nem érintik.

## 0.3.8 előkészítése — 2026. október 14.

A forrás célverziója 0.3.8 / versionCode 3008. A felhasználói alkalmazásnév minden buildváltozatban **Tracer**; a Preview-csomagazonosító `app.tracer.mobile.preview` és az aláírási konfiguráció megmaradt. A csomagolóscript ellenőrzi a tényleges APK alkalmazásnevét minden nyelven.

A 0.3.8 köztes UI-build, lint, JVM-tesztek és aláírásellenőrzés sikeresen befejeződött. A dedikált Pixel 7 / API 35 emulátoron a 0.3.7-ről végzett `adb install -r` megőrizte az alkalmazás UID-jét, első telepítési idejét és a normál profil könyvjelző-, előzmény- és munkamenet-beállításait. A beállításfájl SHA-256-a a frissítés előtt és az első indítás előtt pontosan egyezett. Bizonyíték: `artifacts/android-emulator/upgrade-0.3.7-to-0.3.8.json`, valamint a hozzá tartozó XML-fájlok.

A köztes APK SHA-256-a `2f1feaf2679c4f814781da6d3729ac9c616d94dfe36fc9eb9190db3d1f17fd4d`, mérete 2 686 333 bájt. Ez nem a készülő automatikus frissítés végleges kiadása. Az első instrumentációs futás az AndroidJUnitRunner indításakor hiányzó `androidx.tracing.Trace` miatt megszakadt; UI- és natív szinkronteszt-sikert emiatt még nem állítunk. A Preview R8-konfiguráció szűk megőrzési szabályt kapott a tesztfuttató megosztott tracing API-jához, az optimalizálás bekapcsolva marad.

## Korábbi 0.3.9 előkészítési állapot

A véglegesítés előtt a forrás célverziója 0.3.9 / versionCode 3009 volt, az Android automatikus frissítésével együtt. Hordozható JDK 17, Gradle 8.11.1, Android SDK 35, adb, Android Emulator 37.2.12, Google APIs API 35 rev9 image és WHPX állt rendelkezésre. A végleges build és a natív futás eredményét a fenti 0.3.9 szakasz tartalmazza; az alábbi 0.3.7 adatok történeti eredmények.

Az alábbi eredmények kizárólag a korábbi 0.3.7 buildre vonatkoznak; nem igazolják a készülő frissítést.

## Korábbi 0.3.7 build

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

A lint-jelzések KTX-, szövegerőforrás-, hozzáférhetőségi és függőségfrissítési ajánlásokat is tartalmaznak. A 0.3.7 részletes reportmásolatai a `mobile/testing/android-build-reports/archive-0.3.7/` mappában vannak: `validation.json`, `lint-preview.txt`, `lint-preview.xml`, a három teszt XML, valamint `apk-signature.txt` és `apk-manifest.txt`.

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
