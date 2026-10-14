# Tracer 0.3.9

A 0.3.9 az Android felületét újítja meg, és Windowsra, Androidra GitHub Releases alapú automatikus alkalmazásfrissítést ad. Letölthető csomagok: `dist/Tracer-Setup-0.3.9-x64.exe` és `dist/Tracer-0.3.9-android-preview.apk`. A konkrét feltöltési útmutató a helyi `dist/PUBLISH_0.3.9.md` fájlban található.

## Android megjelenés

Az alkalmazás neve a kezdőképernyőn és a beállításokban **Tracer**. Az új adaptív ikon mellett a korábbi Preview csomagazonosító és aláírókulcs megmarad, ezért az új APK a korábbi alkalmazásra telepíthető, annak adatainak megtartásával.

Az alsó címsor saját oldalikonokat, a navigáció egységes vektoros gombokat kapott. A kezdőlap reszponzív keresőt és hat helyi vektoros gyorslinket használ. A menü, lapválasztó, megjelenés, beállítások, könyvjelzők, előzmények, szinkron és az oldalon belüli keresés saját témázott felületet kapott. Nyolc paletta, sötét/világos/rendszertéma és helyi háttérkép választható.

Az oldalikonok a WebView valódi favicon eseményeiből érkeznek. A memória-cache legfeljebb 64 eredetet és 1 MiB képadatot tart; a navigációhoz kötött ellenőrzés kiszűri az elavult ikonokat. A kezdőlap nem tölt külső fontot, ikont vagy JavaScriptet. A könyvjelző- és előzménylisták újrahasználják a sorokat, a keresés 160 ms késleltetéssel vonja össze a gépelést. A Data Saver a támogatott keresők találati oldalain engedi az oldal által kért képeket, hogy a találatok ikonjai és képei megjelenhessenek. Más oldalakon a képtiltás megmarad. Általános CPU-, RAM- vagy akkumulátor-megtakarítási százalékot nem mértünk.

## Automatikus frissítés

Az első **0.3.9 telepítés kézi**, mert a korábbi kiadásokban még nincs automatikus frissítő. Ezután az alkalmazás a `Kisskorboy2009/tracerweb` repository újabb, publikált `vX.Y.Z` kiadásait keresi. Az ellenőrzés használat közben, hatóránként történik; a beállításokban kézzel is indítható, illetve kikapcsolható. A draft és az azonos vagy régebbi verzió kimarad. A fejlesztői Windows- és Android Preview-csatorna publikált, szabályos verziójú előzetes kiadást is fogad.

**Windows:** a letöltés háttérben történik. A teljes NSIS telepítő SHA-512 és SHA-256 ellenőrzést kap; a telepítés előtt az utóbbi újra ellenőrződik. A frissítés a rendes alkalmazáskilépéskor csendben települ, és a következő indításkor használható. A beállítások **Frissítés és újraindítás** gombja azonnali telepítést és újraindítást kér. A kilépési megerősítést ugyanúgy be kell fejezni; rendszerleállítás közben a frissítő nem indít telepítést.

**Android:** a letöltés automatikus. A méret és SHA-256 mellett a rendszerrel ellenőrzött APK csomagazonosítója, verziókódja és aláírója is egyezik. **Android 12-től** a Tracer a rendszer `PackageInstaller` önfrissítési útját használja, jóváhagyás nélküli telepítést kérve. Automatikus telepítés csak a mentett munkamenet után, az egész alkalmazás háttérbe kerülésekor indul; előtérben maradó privát böngészés alatt várakozik. A beállítások kézi telepítésgombja azonnali telepítést kér.

Első alkalommal a Tracer számára engedélyezni kell a külső APK telepítését. **Android 9–11-en**, illetve ha az újabb rendszer is megerősítést ír elő, a rendszer telepítési párbeszéde jelenik meg. A párbeszéd elvetése után a letöltött csomag újra telepíthető a beállításokból. A csendes telepítés feltételei között az önfrissítés, a megfelelő engedély és az adott Android-verzió által megkövetelt target SDK is szerepel; a Tracer kezeli a rendszer jóváhagyást kérő visszajelzését. [Android API-leírás](<https://developer.android.com/reference/android/content/pm/PackageInstaller.SessionParams#setRequireUserAction(int)>). A következő kiadás ugyanazzal a kulccsal készüljön; a kulcsot ne töltsd fel GitHubra vagy a weboldalra.

Az alkalmazásfrissítő külön HTTPS-kapcsolatot használ, böngészési cookie és lapadat nélkül. Privát Android processből, illetve önálló privát/Tor/Sandbox Windows-munkamenetből nem indul frissítésellenőrzés. Az Android háttérbe kerülésekor a periodikus ellenőrzés szünetel; egy már elkezdett normál letöltés befejeződhet.

## Következő kiadás készítése

Növeld a gyökér `package.json` verzióját, készíts új Windows- és Android-csomagot, majd futtasd:

```powershell
npm.cmd run release:prepare
```

A segéd ellenőrzi a csomagokat és előkészíti a `dist/release-assets-v<verzió>` nyolc fájlját, a `dist/website-pages` statikus oldalt és a verzióhoz tartozó feltöltési útmutatót. A nyolc fájl együtt kerüljön az új GitHub Release-be, az új tag például `v0.3.10`. A weboldalhoz a `website-pages` **tartalmát** töltsd a `main` gyökerébe. A kiadott tag alatti bináris fájlokat ne cseréld más tartalomra.

A mérési eredmények és a tesztek határai: [Windows és összesített ellenőrzés](VALIDATION.md), [Android build és emulátor](mobile/ANDROID_BUILD_VALIDATION.md). Fizikai Android-készülékes próba és iOS build nem történt. A Windows telepítő helyi, Authenticode-aláírás nélküli csomag; az APK optimalizált, nem debuggolható, fejlesztői kulccsal aláírt Preview.
