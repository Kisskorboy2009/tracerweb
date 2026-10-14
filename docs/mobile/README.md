# Tracer mobil

Ez a könyvtár két önálló natív alkalmazás forrását tartalmazza. Androidon a rendszer Chromium-alapú WebView-ja, iOS-en a WebKit `WKWebView` működik. Az iOS-kód nem Chromium-port. A mobil komponensek nem hívják az Electron IPC-t vagy a Rust magot; jelenleg saját, mellékelt domainlistát használnak.

## Projektstruktúra

```text
mobile/
├── android/
│   ├── settings.gradle.kts
│   ├── build.gradle.kts
│   ├── gradle.properties
│   └── app/
│       ├── build.gradle.kts
│       ├── proguard-rules.pro
│       └── src/main/
│           ├── AndroidManifest.xml
│           ├── java/app/tracer/mobile/
│           │   ├── TracerApplication.kt
│           │   ├── BrowserActivity.kt
│           │   ├── Appearance.kt
│           │   ├── SyncClient.kt
│           │   └── PrivateGhostReceiver.kt
│           ├── assets/shields.json
│           └── res/{drawable,values,xml}/
└── ios/
    ├── project.yml
    ├── ExportOptions.plist
    └── Tracer/
        ├── Info.plist
        ├── TracerApp.swift
        ├── BrowserModel.swift
        ├── BrowserScreen.swift
        ├── Appearance.swift
        ├── AppearanceScreen.swift
        ├── SyncClient.swift
        ├── SyncSettingsScreen.swift
        └── Resources/
            ├── content-blocker.json
            └── Assets.xcassets/AppIcon.appiconset/{Contents.json,Tracer-1024.png}
```

## Android APK és AAB

Követelmény: Android SDK 35, JDK 17 és Gradle 8.11.1. A buildhez rögzített AGP 8.9.1 és Kotlin 2.1.20 tartozik. A minimális készülékverzió Android 9 / API 28. Az Android alkalmazás verziója **0.3.7**; a Gradle és a csomagolóscript a projekt gyökerének `package.json` fájljából olvassa a verziót. A növekvő `versionCode` értéke `major × 1000000 + minor × 1000 + patch`, jelenleg 3007. A Gradle wrapper bináris JAR nincs a forrásba másolva; telepített Gradle-lel egyszer generáld, majd a keletkező wrapper-fájlokat verziózd.

A projekt gyökeréből készíthető a letölthető előzetes APK:

```powershell
.\scripts\mobile-build.ps1 -Variant Preview
```

A parancs generálja a közös YouTube-védelem mobil assetjét, fordít, futtatja az Android lintet és a JVM-teszteket, majd ellenőrzi az APK-aláírást és a manifestet. Kimenete `dist/Tracer-0.3.7-android-preview.apk`, `.sha256` és `dist/latest-android.json`. Az ellenőrzés összeveti a tényleges verziót, csomagazonosítót, SDK-szinteket és hibakeresési jelzőt a konfigurációval, az APK-aláírót pedig a helyi kulcs tanúsítványával. Megadott `JAVA_HOME`, `ANDROID_HOME` és telepített Gradle / `-GradlePath` használható; ezen a gépen a csak buildhez telepített hordozható eszközök a `%LOCALAPPDATA%/TracerBuildTools` mappában találhatók. A script nem módosítja a rendszer Java- vagy Android-beállításait.

**Preview aláírás:** az APK optimalizált `preview` build, `debuggable=false`, a release HTTPS-konfigurációval. Az aláírás a gép Android fejlesztői kulcsa; **nem éles kiadói aláírás**. Külön `app.tracer.mobile.preview` csomagazonosítót és „Tracer Preview” nevet kap, a leendő éles alkalmazás mellé telepíthető. A frissítéshez ugyanaz az aláírókulcs kell; a fejlesztői kulcsot a forrás és a website nem tartalmazza. A Gradle tartós helyi kulcsa Windows alatt `%USERPROFILE%/.android/debug.keystore`: ezt őrizd meg a következő Preview-frissítésekhez, és ne másold a weboldalra vagy a forrásba. Elveszett vagy eltérő kulccsal az új APK nem frissítheti a korábbi telepítést. Androidon a letöltő böngészőhöz engedélyezett külső APK-telepítés szükséges. A fordítás és aláírás igazolása nem helyettesít készülékpróbát.

```powershell
cd mobile/android
gradle wrapper --gradle-version 8.11.1 --distribution-type bin
.\gradlew.bat :app:assembleDebug
.\gradlew.bat :app:bundleRelease
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

Android Studio automatikusan létrehozza a gépspecifikus `local.properties` fájlt. CLI használatnál állítsd be az `ANDROID_HOME` és `JAVA_HOME` változót az SDK-ra, illetve a JDK 17-re. A debug APK helye `app/build/outputs/apk/debug/app-debug.apk`, a kiadási AAB helye `app/build/outputs/bundle/release/app-release.aab`.

A kiadási konfiguráció szándékosan nem tartalmaz privát kulcsot. Az éles CLI build a `TRACER_ANDROID_KEYSTORE`, `TRACER_ANDROID_STORE_PASSWORD`, `TRACER_ANDROID_KEY_ALIAS` és `TRACER_ANDROID_KEY_PASSWORD` környezeti változókat használja: `.\scripts\mobile-build.ps1 -Variant Release`. A script hiányzó kiadói kulcs esetén megáll, és nem helyettesíti fejlesztői aláírással. Android Studio **Generate Signed App Bundle / APK** művelete is használható. Az aláíratlan `bundleRelease` eredményt nem lehet éles kiadásként telepíteni. Play Store publikálás előtt ellenőrizd a kiadáskori cél-SDK követelményt és a WebView-frissítési követelményeket.

## iOS IPA

Követelmény: macOS, Xcode, XcodeGen és fizikai eszközhöz / IPA-hoz Apple fejlesztői csapat, provisioning és aláírás. Az alkalmazás iOS 16+ rendszert céloz. Windows-on az iOS fordítása nem támogatott.

```bash
cd mobile/ios
xcodegen generate
xcodebuild -project Tracer.xcodeproj -scheme Tracer \
  -sdk iphonesimulator -configuration Debug \
  -derivedDataPath build CODE_SIGNING_ALLOWED=NO build
xcodebuild -project Tracer.xcodeproj -scheme Tracer \
  -configuration Release -archivePath build/Tracer.xcarchive \
  DEVELOPMENT_TEAM=SAJAT_TEAM_ID -allowProvisioningUpdates archive
xcodebuild -exportArchive -archivePath build/Tracer.xcarchive \
  -exportPath build/export -exportOptionsPlist ExportOptions.plist \
  -allowProvisioningUpdates
```

A `SAJAT_TEAM_ID` helyére a saját Apple team azonosítódat írd; a bundle ID-t szükség szerint állítsd át a `project.yml` fájlban. Az exportálási beállítás App Store Connect terjesztésre szól; Ad Hoc vagy saját fejlesztői telepítéshez a megfelelő exportmódszer és provisioning kell. Az archívumban `Products/Applications/Tracer.app` található, az exportált IPA csomagja `Payload/Tracer.app/` struktúrájú.

Az alkalmazás nem igényel és nem állít be alternatív böngészőmotor entitlementet. Az alapértelmezett iOS-böngésző szerephez külön Apple entitlement és éles megfelelés kell; ez nincs hamisan beállítva.

## Valós képességek és határok

| Képesség | Android | iOS |
|---|---|---|
| Webcím és keresés; Google / Bing / DuckDuckGo | Implementált | Implementált |
| Alsó, egykezes címsor és kezelősáv | Implementált | Implementált |
| 8 paletta; világos / sötét / rendszer mód | Natív spinner, böngészőkeret és új lap | Natív SwiftUI picker, böngészőkeret és új lap |
| Egyéni helyi újlap-háttér | Rendszer-fájlválasztó, noBackupFilesDir JPEG | PhotosPicker / fájlimport, védett Application Support JPEG |
| Hat alapgyorslink | KissKorboy, OverclockGame, Solaryn, Solaryn Center, Asthetic, Kounee | Ugyanaz a hat HTTPS-link |
| Mozgáscsökkentés és energiahatékonyság | Alapértelmezésben statikus; akkukímélő / rendszeranimáció-tiltás támogatva | Alapértelmezésben statikus; Low Power / Accessibility Reduce Motion támogatva |
| Fülek; vissza / előre; pull-to-refresh | Implementált | Implementált |
| Normál lapok és aktív lap visszaállítása újraindítás után | Legfeljebb 100 lap helyi pillanatképből, HTTPS-címek ellenőrzésével | Nincs implementálva |
| Képernyőfordítás és Activity újralétrehozás | Normál WebView-előzményállapot; privát állapot kizárólag az élő process memóriájában | Rendszeres SwiftUI-életciklus |
| Felhasználói kattintásból nyíló új ablak | Új lap ugyanabban a normál vagy privát profilban | Nincs implementálva |
| Teljes képernyős videó, oldalmegosztás, oldalon keresés, asztali nézet | Implementált | További fejlesztés |
| Gesztus | Képernyőszéli vissza / előre | WebKit rendszeres vissza / előre gesztus |
| Könyvjelzők, legfeljebb 1000 előzmény | Normál profilban | Normál profilban |
| Hálózati reklám- és követőszűrés | Bővített mellékelt domainlista és szűk YouTube/Googlevideo reklámvégpontok; alerőforrások, alapból aktív | Lefordított WebKit content-rule lista; harmadik fél |
| Kozmetikai reklámrejtés | Oldalbetöltés utáni CSS; pontos YouTube HTTPS-eredeteken dokumentumkezdeti segéd támogatott WebView mellett, régebbi WebView-n utólagos fallback | WebKit CSS content-rule |
| Alapértelmezett böngésző | Menü → Tracer beállítása alapértelmezettként; Android 10+ RoleManager rendszerjóváhagyás, Android 9 rendszerbeállítások | Apple entitlement és kiadási megfelelés még hiányzik |
| Cookie-banner | Opcionális, néhány ismert szelektor; nem consent-elutasítás | Opcionális, néhány ismert szelektor; nem consent-elutasítás |
| HTTPS | HTTP főnavigáció feljavítása; cleartext és mixed content tiltva; hibás TLS megszakítva | HTTP főnavigáció feljavítása; HTTP content-rule és ATS tiltás |
| Webhelyenkénti JavaScript kapcsoló | `WebSettings.javaScriptEnabled` | Navigációnként `WKWebpagePreferences.allowsContentJavaScript` |
| Privát izoláció | Külön `:private` process és `private` WebView adatkönyvtár | Elkülönített, nem tartós `WKWebsiteDataStore` |
| Privát biometria | AndroidX BiometricPrompt; API 28–29 erős biometria, API 30+ készülékzár fallback | LocalAuthentication, Face ID / Touch ID / készülékjelszó |
| Privát képernyőképvédelem | `FLAG_SECURE` | Zároló felület app-inaktiváláskor; rendszerképernyőképet nem tud általánosan tiltani |
| Adatkímélő | Hálózati képek tiltása | Képek és média content-rule tiltása |
| Surge | Inaktív webnézetek megsemmisítése, URL-alapú visszatöltés | Inaktív webnézetek megsemmisítése, URL-alapú visszatöltés |
| App háttérbe kerülése | Betöltés leállítása, `onPause` és processzszintű JS-timer-pause | Minden WKWebView megsemmisítése; a tab URL-je memóriában megmarad |
| Ghost | Aktív profil cookie/cache/WebStorage és lapok törlése; normál profilból a privát process is kap explicit, nem exportált törlési értesítést | Minden webnézet és privát memóriatár eldobása; normál webhelyadatok törlése |
| Fájlfeltöltés / letöltés | Rendszer-fájlválasztó; normál HTTPS-lapon DownloadManager megerősítéssel | WKWebView alap fájlválasztó; dedikált letöltéskezelő nincs |
| Kamera / mikrofon / hely | Webes engedélykérések tiltva | Kamera / mikrofon tiltva; helyengedély nincs deklarálva |
| Kézi E2EE sync | Desktop-kompatibilis scrypt / AES-GCM, push / pull, távoli lapválasztás | Desktop-kompatibilis scrypt / AES-GCM, push / pull, távoli lapválasztás |
| Tor, EVM / Solana wallet, DoH | Nincs bekötve | Nincs bekötve |
| Teljes uBlock / EasyList, motor-szintű fingerprint vagy WebRTC védelem | Nincs; ezekhez további natív motorintegráció kell | Nincs; WKWebView API-kból nem valósítható meg teljes körűen |
| Fülek záró / nyitó gesztusa, letöltési polc, jelszókezelő | További fejlesztés | További fejlesztés |

**Android privát mód:** a platform WebView-ja nem kínál memóriaalapú, nem tartós profil API-t. A külön adatkönyvtár megakadályozza a normál cookie-kkal való megosztást; a privát lemezadatokat a következő privát process-indulás előtt törli az alkalmazás, kilépéskor pedig törli a cookie-kat, cache-t és WebStorage-ot. Kényszerleállítás vagy áramkimaradás után lemezmaradványok lehetnek a következő indulásig. Ez a prototípus nem ígér forenzikus megsemmisítést. A privát lapok a privát munkameneten belül közös cookie-profilt használnak.

A privát natív párbeszédek is képernyőképvédelmet kapnak, és háttérbe kerüléskor bezáródnak. A privát JavaScript `alert`, `confirm` és `prompt` felugró ablakai nem jelennek meg; a megerősítések és beviteli kérések elutasítást kapnak. A privát `beforeunload` kérés csendben engedi az elnavigálást. Normál módban a WebView szokásos párbeszédkezelése marad. A webes fájlfeltöltés csak a kiválasztó által átadott, legfeljebb 32 darab `content://` dokumentumot fogadja el; helyi `file://` URI-t és az alkalmazás saját tartalomszolgáltatóját nem adja át az oldalnak.

**Erőforrás-optimalizálás:** a WebView `pauseTimers()` processzszintű, ezért Androidon csak teljes app-háttérbe kerüléskor használjuk; fülváltáskor a lapot `onPause()` és `stopLoading()` állítja meg. Surge módban az inaktív lap teljesen megszűnik, a beállítás újraindítás után is megmarad. iOS-en nincs általános, nyilvános JS-fagyasztó API, ezért app-háttérben minden webnézetet eldobunk. URL-alapú visszatöltéskor a kitöltetlen űrlap és a scrollpozíció elveszhet. Androidon a normál lapok címe és az aktív lap helyi pillanatképből áll vissza; képernyőfordításkor a WebView-előzményállapotot is megőrizzük. A privát lapok a processz megszűnése után nem állnak vissza, és nem kerülnek a tartós pillanatképbe. Az iOS-lapok automatikus processz-utáni visszaállítása nincs implementálva.

**Biztonsági és kiadási ellenőrzés:** az aktuális Android fordítási, lint-, teszt- és APK-aláírási eredmény az [ANDROID_BUILD_VALIDATION.md](ANDROID_BUILD_VALIDATION.md) fájlban található. Eszközteszt, éles kiadói aláírás, store megfelelés és iOS/Xcode fordítás továbbra is külön feladat. DRM, WebAuthn, OAuth popup, teljes képernyős médiakezelés és a rendszerszintű böngészőszerep éles regressziótesztje szintén kiadási feladat.

**YouTube-védelem:** a desktopról generált DOM-segéd a megjelölt szponzorált elemeket rejti, és kizárólag kifejezetten `ad-showing` / `ad-interrupting` állapotú lejátszó reklámvideóját némítja, gyorsítja vagy lépteti át. Nem módosítja az oldal hálózati válaszait és nincs natív JavaScript-híd. A Shields kikapcsolása vagy a JavaScript tiltása ezt is leállítja a frissített lapon. YouTube felületváltozás, szerveroldali reklám és minden élő oldal teljes reklámmentessége nincs igazolva; a mobil WebView nem Brave-motor.

## Megjelenés, saját háttér és gyorslinkek

A **Megjelenés és háttér** menüpont Androidon natív paletta- és módválasztót, iOS-en SwiftUI beállítófelületet nyit. A nyolc paletta: Graphit, Aurora, Kobalt, Ibolya, Rózsa, Borostyán, Erdő és Óceán. Mindegyiknek külön világos és sötét háttér-, szöveg- és kiemelőszíne van. A kiválasztott paletta és a **Rendszertéma / Világos / Sötét** mód újraindítás után is megmarad. A színváltás a natív böngészőkeretet, párbeszédeket és az új lapot frissíti. Androidon a rendszeres nappali/éjszakai váltást `uiMode` konfigurációfrissítés kezeli; iOS-en a SwiftUI rendszer-színsémája vezérli.

Az új lap hat helyi, monogramos kártyája csak kattintás után nyit hálózati oldalt; külső favicon-lekérés nincs:

- [KissKorboy](https://kisskorboy.hu)
- [OverclockGame](https://overclockgame.hu)
- [Solaryn](https://solaryn.hu)
- [Solaryn Center](https://center.solaryn.hu)
- [Asthetic](https://asthetic.hu)
- [Kounee](https://kounee.hu)

Az egybefüggő, egy fekete útvonalból álló új Tracer-logó az újlap-oldalba, az Android vektorikonba és az iOS 1024-es AppIcon assetbe is bekerült; geometriája a projekt közös `assets/tracer.svg` fájljával egyezik.

**Háttérimport:** Androidon a rendszer fájlválasztójában, iOS-en a PhotosPickerben vagy a rendszer fájlválasztójában válassz képet. Az import legfeljebb 32 MiB forrást és legfeljebb 20 000 képpontos oldalhosszt fogad el, majd legfeljebb 1920 képpontos, 2 MiB-os JPEG-et készít. A kicsinyítés háttérszálon történik; a kamera orientációját kezeli és az eredeti EXIF/metaadatokat nem másolja a JPEG-be. Átlátszó háttér és animált kép esetén egyetlen statikus képet használunk. Távoli URL helyett csak a felhasználó által a készüléken kiválasztott fájl importálható.

Androidon a képfájl az app saját `noBackupFilesDir/new-tab-background.jpg` helyén marad. iOS-en `Application Support/Tracer/new-tab-background.jpg`, teljes fájlvédelemmel és mentésből kizárt mappában. Az újlap HTML kizárólag a kicsinyített kép `data:image/jpeg` reprezentációját kapja; nem kap helyi útvonalat vagy általános fájlolvasási hozzáférést. Az új lap CSP-je tiltja a hálózati erőforrásokat. A kép, a paletta és a témapreferenciák nem kerülnek az E2EE szinkron payloadjába. A háttér a **Háttér törlése** gombbal eltávolítható; a Ghost a böngészési munkamenetet törli, a felhasználó megjelenési beállításai megmaradnak.

A tartós megjelenés és háttér importja a normál profilból végezhető; privát profilból tiltva van. A privát lapok a készülék normál profilban kiválasztott megjelenését használják, a cookie-/adat-/biometrikus izoláció változatlan. Androidon egy már futó privát ablak újbóli megnyitása csak a megjelenési extrákat frissíti; a meglevő privát munkamenet zárolási beállítását nem írja át.

**Mozgás és memória:** a mobil új lap alapértelmezésben statikus, nincs folyamatos 3D/canvas háttér vagy animációs ciklus. A mozgáscsökkentés kikapcsolásakor egyetlen, 180 ms-os belépő animáció jelenhet meg. A rendszeres mozgáscsökkentés, Android akkukímélő / kikapcsolt animator scale, illetve iOS Low Power mód ezt is kikapcsolja. A választott kép kicsinyítés után kerül a webnézetbe, és a korábbi Surge / háttérlap-megsemmisítési működés megmarad.

Az Android előzetes APK fordítását és aláírását külön ellenőrizzük; az iOS build, az élő mobil-eszközteszt és a vizuális eszközellenőrzés továbbra is szükséges. A store terjesztéshez éles aláírás és megfelelés kell.

## Valós, desktop-kompatibilis kézi E2EE szinkron

A **Titkosított szinkron** menüpont és a beállítások szinkronszekciója közvetlenül a projekt `sync/server.cjs` relay szerverével és `desktop/core/sync.cjs` protokolljával működik. Az Android KDF a `org.bouncycastle:bcprov-jdk15to18:1.83` SCrypt implementációja; az iOS KDF a pontos `1.10.0` CryptoSwift csomag, az AES-GCM az Android rendszer-JCE, illetve az Apple CryptoKit. A KDF a felület szálán kívül fut.

- Közös UTF-8 jelszó, változtatás és Unicode-normalizálás nélkül; a 16–4096 hosszkorlát a JavaScripthez illő UTF-16 kódegységekre vonatkozik.
- Scrypt `N=32768, r=8, p=1`, 32 bájtos kulcs; AES-256-GCM, 16 bájtos véletlen salt, 12 bájtos véletlen IV, 16 bájtos tag; AAD: `tracer-sync-v1`.
- Base64 envelope: `v=1`, `kdf=scrypt-32768-8-1`, `salt`, `iv`, `body`, `tag`. Hitelesítési hiba esetén semmi nem kerül importálásra.
- A v1 payload `bookmarks`, `history`, `tabs` listákat tartalmaz; listánként legfeljebb 1000 HTTP/HTTPS-webcím; URL legfeljebb 8192, cím kevesebb mint 1024 UTF-16 egység. A más kliensek opcionális `time` mezőjét a mobil UI nem használja.
- A titkosítandó JSON legfeljebb 2 900 000 bájt, a hálózati válasz és kérés legfeljebb 4 000 000 bájt; a válasz stream olvasásakor is ellenőrizhető korlát érvényesül.
- `PUT` feltöltés, `GET` letöltés, `Authorization: Bearer …`; a token 32–256 nyomtatható ASCII karakter. A relay végpont teljes útvonalát add meg, például `https://sajat-relay.example/v1/envelope`.
- Távoli relay esetén HTTPS kötelező. Helyi HTTP kizárólag debug buildben és a kifejezett **Helyi HTTP engedélyezése** kapcsolóval működik, `localhost`, `127.0.0.1` vagy IPv6 loopback címen. Átirányítást egyik kliens sem követ. Android release buildben nincs cleartext hálózati kivétel; iOS-en a sync runtime ellenőrzése zárja ki release buildben a helyi HTTP-t.
- A token és jelszó csak az adott művelethez marad memóriában; az alkalmazás nem tárolja őket SharedPreferences-ben, UserDefaults-ban vagy naplóban. A relay-címet kényelmi beállításként menti. A memóriabeli `String` másolatok forenzikus nullázását a nyelvi futtatók nem garantálják.

A feltöltés felülírja a relay pillanatképét. A letöltés csak sikeres GCM-hitelesítés és teljes sémaellenőrzés után lecseréli a normál könyvjelzőket és előzményeket; a távoli lapokat külön kell kijelölni / megérinteni a megnyitáshoz. Privát lapok, cookie-k, webhelyjelszavak és más böngészési adattárak nem kerülnek a csomagba. A mobilböngésző a szinkronból kapott HTTP-lapot megnyitáskor HTTPS-re emeli. Ez kézi pillanatkép-csere: automatikus háttérszinkron és konfliktus-összeolvasztás nincs. Ghost megszakítja a függőben levő importálást; a korábban feltöltött relay-pillanatképet külön kezeld.

Helyi Android fejlesztéshez indítsd a desktop relayt, majd használd az `adb reverse tcp:8787 tcp:8787` parancsot. Így a készüléken `http://localhost:8787/v1/envelope` a fejlesztői gép relayjára vezet. iOS szimulátorban a fejlesztői gép `localhost` címe használható; fizikai telefonra távoli, TLS-sel elérhető relay szükséges.

### Kriptográfiai interoperabilitási ellenőrzés

A `mobile/testing/sync-vector.json` a desktop implementációval készült, nyilvános tesztjelszavas, Unicode/emoji adatot is tartalmazó mintacsomag. Az Android instrumentation és iOS XCTest tesztek ezt visszafejtik, ellenőrzik a payloadot, visszautasítják a módosított ciphertextet, és mobilon készített exportot írnak a visszirányú desktop-ellenőrzéshez. A natív tesztek ebben a Windows-környezetben **nem futottak**.

```powershell
# Android SDK-val és kapcsolt eszközzel, mobile/android könyvtárból:
.\gradlew.bat :app:connectedDebugAndroidTest
adb exec-out run-as app.tracer.mobile cat files/sync-android-export.json > sync-android-export.json
# A projekt gyökeréből:
node mobile/testing/verify-native-export.cjs mobile/android/sync-android-export.json
```

```bash
# macOS-on, mobile/ios könyvtárból; a szimulátornevet a saját eszközre állítsd:
xcodegen generate
xcodebuild -project Tracer.xcodeproj -scheme Tracer \
  -destination 'platform=iOS Simulator,name=iPhone 16' test
# A tesztnapló kiírja a nyilvános sync-ios-export.json abszolút szimulátorútját.
# A projekt gyökeréből, az export tényleges útjával:
node mobile/testing/verify-native-export.cjs /absolute/simulator/path/sync-ios-export.json
```

Az `mobile/testing/create-vector.cjs` új desktop-mintát generál mindkét natív tesztcsomag számára. A natív és desktop közötti valódi futtatási bizonyítékot a fenti két irány eszköztesztje adja; a forrás és a mintafájl megléte önmagában nem bizonyít natív buildet.

## Célzott eszközellenőrzés

1. Normál fülben jelentkezz be tesztoldalon; a külön privát munkamenetben ugyanazon oldal legyen kijelentkezve.
2. Nyiss több lapot; ellenőrizd a vissza/előre kezelést, az alsó címsort, a pull-to-refresh működést és a keresőváltást.
3. Egy általad kontrollált HTTPS-oldal töltsön be mellékelt listán szereplő harmadik fél domainjéről scriptet/képet; a shield bekapcsolva blokkoljon, kikapcsolva engedjen. Ellenőrizd az HTTP-alerőforrás blokkolását mindkét shield állapotban.
4. Állíts be webhelyenkénti script-tiltást, töltsd újra, majd egy másik webhelyen továbbra is működjön a JavaScript.
5. Bekapcsolt privát zárolással küldd háttérbe az appot; a visszatérés kérjen azonosítást. A sikertelen azonosítás ne mutassa a privát oldalt vagy címet. Androidon zárolva a menü/laplista/navigáció se tárja fel a privát munkamenetet; az élő privát munkamenet biometrikus védelmét a menü ne kapcsolhassa ki. iOS-en a privát lapcímek biometrikus védelem mellett a laplistában is maradjanak rejtve.
6. Ghost után a korábbi login-cookie, LocalStorage és IndexedDB ne legyen elérhető. Android privát folyamat kényszerleállítás után a következő indulás törölje a régi privát profilt.
7. Surge után az inaktív oldal visszatöltődjön, míg normál fülváltáskor a back-stack maradjon működőképes.
8. Mind a nyolc palettával ellenőrizd a natív címsor, menü, újlap-kártyák és a világos/sötét szövegkontrasztját. Rendszermódban váltson a készülék nappali/éjszakai beállításával, a fül megnyitott weboldala ne töltődjön újra.
9. Importálj normál profilban egy álló, EXIF-orientált fényképet; jelenjen meg helyesen és újraindítás után is. A 32 MiB feletti forrást utasítsa el. A háttér törlése állítsa vissza a színpaletta alapját.
10. Privát profilból ne lehessen tartós hátteret importálni vagy megjelenést átírni. Háttérimport és témaváltás után ismételd meg az 1., 4., 5., 6. adatvédelmi ellenőrzést és a natív E2EE/tamper teszteket.
11. Mind a hat alapgyorslink a megadott HTTPS-domaint nyissa. A kezdőlap puszta megnyitása ne kérjen külső favicont, háttérképet vagy más hálózati erőforrást.
12. Normál menüből kérd az alapértelmezett böngészőszerepet; az Android rendszerében az elutasítás hagyja meg a régi böngészőt, jóváhagyás után külső alkalmazás HTTPS-hivatkozása a Tracerben nyíljon meg. Ismételt megnyitáskor az új hivatkozást töltsük be. Privát ablakból ne induljon alapértelmezett-beállítás.

## Hivatalos műszaki források

- [Android WebView útmutató](https://developer.android.com/develop/ui/views/layout/webapps/webview)
- [WebSettings: mixed content, file/content access és safe browsing](https://developer.android.com/reference/android/webkit/WebSettings)
- [WebView adatkönyvtár elkülönítése](https://developer.android.com/reference/android/webkit/WebView#setDataDirectorySuffix(java.lang.String))
- [Android biometria és az API 29 alatti kombinációk korlátai](https://developer.android.com/identity/sign-in/biometric-auth)
- [WKWebsiteDataStore](https://developer.apple.com/documentation/webkit/wkwebsitedatastore)
- [WKContentRuleListStore](https://developer.apple.com/documentation/webkit/wkcontentruleliststore)
- [WKWebView médiafelfüggesztés](https://developer.apple.com/documentation/webkit/wkwebview/setallmediaplaybacksuspended(_:completionhandler:))
- [XcodeGen projektkonfiguráció](https://github.com/yonaskolb/XcodeGen/blob/master/Docs/ProjectSpec.md)
- [Bouncy Castle Java 1.83 hivatalos kiadás](https://github.com/bcgit/bc-java/releases/tag/r1rv83)
- [CryptoSwift 1.10.0 hivatalos, aláírt kiadás](https://github.com/krzyzanowskim/CryptoSwift/releases/tag/1.10.0)
- [CryptoSwift Scrypt 1.10.0 API forrása](https://github.com/krzyzanowskim/CryptoSwift/blob/1.10.0/Sources/CryptoSwift/Scrypt.swift)
- [Android rendszer-fájlválasztó](https://developer.android.com/reference/androidx/activity/result/contract/ActivityResultContracts.OpenDocument)
- [Android böngészőszerep és RoleManager](https://developer.android.com/reference/android/app/role/RoleManager)
- [Android APK aláírás](https://developer.android.com/studio/publish/app-signing)
- [AndroidX Webkit hivatalos kiadások](https://developer.android.com/jetpack/androidx/releases/webkit)
- [Apple PhotosPicker és Transferable](https://developer.apple.com/documentation/photokit/bringing-photos-picker-to-your-swiftui-app)

Kriptográfiai függőségek elismerése: a Bouncy Castle könyvtár a Legion of the Bouncy Castle munkája; a CryptoSwift Marcin Krzyżanowski és közreműködői munkája (Copyright 2014–2025). A Tracer ezeket változtatás nélkül használja; a licenc- és forrásmegjelölést a terjesztésnél meg kell őrizni. [Bouncy Castle licenc](https://www.bouncycastle.org/licence.html), [CryptoSwift licenc](https://github.com/krzyzanowskim/CryptoSwift/blob/1.10.0/LICENSE).
