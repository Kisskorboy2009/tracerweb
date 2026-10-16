# Tracer mobil

Két natív alkalmazás: **Android** (Kotlin, rendszer-WebView) és **iOS** (SwiftUI,
`WKWebView`). Telepítési útmutató felhasználóknak: [ANDROID_INSTALL.md](ANDROID_INSTALL.md).

## Android

```text
android/app/src/main/
├── java/app/tracer/mobile/
│   ├── BrowserActivity.kt        Fő felület, lapok, menük, beállítások
│   ├── BrowserUi.kt              Natív vezérlők és ikonok
│   ├── HomePage.kt               A kezdőlap HTML-je
│   ├── Appearance.kt             Paletták, téma, saját háttérkép
│   ├── BrowserMediaService.kt    Háttérben lejátszás, médiavezérlők
│   ├── AppUpdater.kt             Automatikus frissítés GitHub-kiadásokból
│   ├── SyncClient.kt             Titkosított szinkron (az asztali formátummal azonos)
│   └── …
├── assets/                       Shields szabályok, YouTube-segéd, licencek
└── res/                          Ikonok, animációk, stílusok
```

Követelmények: JDK 17, Android SDK 35, Gradle 8.11.1 (AGP 8.9.1, Kotlin 2.1.20).
Minimum Android 9 (API 28). A verziót a gyökér `package.json` adja; a `versionCode`
`major × 1 000 000 + minor × 1000 + patch`.

A projekt gyökeréből:

```powershell
.\scripts\mobile-build.ps1 -Variant Preview
```

Ez lefordítja az APK-t, futtatja a lintet és a unit teszteket, ellenőrzi az
aláírást és a manifestet, majd a `dist` mappába teszi az APK-t, a `.sha256` fájlt és
a frissítőnek szóló `latest-android.json`-t. A szkript a `%LOCALAPPDATA%\TracerBuildTools`
mappában is keresi a JDK-t, az SDK-t és a Gradle-t, ha a `JAVA_HOME` és az
`ANDROID_HOME` nincs beállítva.

- **Preview** – a gép Android fejlesztői kulcsával aláírt kiadás, külön
  `app.tracer.mobile.preview` azonosítóval. A frissítéshez ugyanaz a kulcs kell.
- **Release** – éles aláírás a `TRACER_ANDROID_KEYSTORE`, `TRACER_ANDROID_STORE_PASSWORD`,
  `TRACER_ANDROID_KEY_ALIAS` és `TRACER_ANDROID_KEY_PASSWORD` környezeti változókkal.

Csak a tesztek futtatása (a `mobile/android` mappában):

```powershell
gradle :app:testPreviewUnitTest
```

Az eszközön futó tesztek az `app/src/androidTest` mappában vannak
(`gradle :app:connectedPreviewAndroidTest`).

## iOS

Követelmények: macOS, Xcode és [XcodeGen](https://github.com/yonaskolb/XcodeGen);
eszközre telepítéshez Apple fejlesztői fiók. Cél: iOS 16+.

```bash
cd mobile/ios
xcodegen generate
xcodebuild -project Tracer.xcodeproj -scheme Tracer -sdk iphonesimulator \
  -configuration Debug CODE_SIGNING_ALLOWED=NO build
```

Archiváláshoz és IPA exporthoz add meg a saját `DEVELOPMENT_TEAM` azonosítódat, és
használd az `ExportOptions.plist` fájlt.

## Szinkron

Mindkét alkalmazás ugyanazt a titkosított csomagformátumot használja, mint az
asztali Tracer (scrypt + AES-256-GCM). A közös tesztvektor a `testing/sync-vector.json`
(előállítása: `node mobile/testing/create-vector.cjs`); a mobil exportok a
`node mobile/testing/verify-native-export.cjs <fájl>` paranccsal ellenőrizhetők.
