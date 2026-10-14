# Tracer Android — telepítés

A Tracer Android 9 vagy újabb rendszeren használható. A böngészéshez legyen naprakész az Android System WebView.

1. A Tracer weboldalán nyomd meg az **Android APK letöltése** gombot.
2. Nyisd meg a letöltött APK-t a telefon Letöltések mappájából vagy a letöltési értesítésből.
3. Ha az Android kéri, engedélyezd az APK telepítését annak a böngészőnek vagy fájlkezelőnek, amellyel megnyitottad, majd válaszd a **Telepítés** lehetőséget.
4. Indítsd el a **Tracer** alkalmazást. Az alsó címsorba írj webcímet vagy keresőkifejezést.

A telepítési engedély helye készülékenként eltérhet. Telepítés után ezt az engedélyt ismét kikapcsolhatod az Android beállításaiban.

## Frissítés és beállítások

Ha korábbi Tracer Preview van a telefonodon, az új APK-t ugyanígy nyisd meg, és válaszd a frissítést. A 0.3.9 forrása megtartja a korábbi `app.tracer.mobile.preview` csomagazonosítót és aláírási beállítást; az alkalmazás neve **Tracer** lesz. A sikeresen ellenőrzött új APK ugyanazon kulccsal frissítheti a 0.3.7-et, a korábbi alkalmazás eltávolítása nélkül. A tényleges frissítési próba állapotát az [ellenőrzési jegyzőkönyv](ANDROID_BUILD_VALIDATION.md) tartalmazza.

A **Menü → Tracer beállítása alapértelmezettként** művelet az Android saját böngészőválasztóját nyitja. A **Megjelenés és háttér** menüben választhatsz témát és saját háttérképet; a **Letöltések** menü a rendszer letöltéslistáját nyitja.

## A kiadás állapota

Az APK fejlesztői kulccsal aláírt előzetes kiadás. A 0.3.9 frissítés fordítási, automatikus és emulátoros ellenőrzése még folyamatban van; ezt a dokumentumot önmagában ne tekintsd sikeres tesztnek. Az elvégzett ellenőrzések és a készülékpróba állapota az [Android ellenőrzési jegyzőkönyvben](ANDROID_BUILD_VALIDATION.md) olvashatók.
