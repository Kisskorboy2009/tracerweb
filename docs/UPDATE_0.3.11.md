# Tracer 0.3.11

Az Android-változatban áthelyezhető a címsáv és a navigáció, a friss profil alapértelmezetten sötét. A kiadás javítja a YouTube háttérbe váltásának és értesítésből folytatásának kezelését.

## Címsáv felül vagy alul

Nyisd meg a **Menü → Megjelenés → Címsáv és vezérlők helye** választót. Válaszd a **Fent** vagy **Lent** lehetőséget, majd nyomd meg a **Változtatások mentése** gombot. A választás újraindítás után megmarad, és a privát ablak is örökli. A helyváltoztatás megtartja az aktuális weboldalt és annak állapotát.

## Sötét alapértelmezés

Hiányzó vagy érvénytelen témabeállítás esetén a Tracer sötét módban indul. A korábban választott **Világos** vagy **Rendszer** mód megmarad; ezek a Megjelenés menüben továbbra is választhatók. A natív Android-téma a webhelyek saját sötét/világos megjelenési támogatásának is megfelelő alapot ad. A Tracer nem színezi át önkényesen a külső oldalak olvasható világos hátterét.

## YouTube háttérlejátszás

A háttérlejátszás kapcsoló a **Menü → Shields és beállítások → Háttérben lejátszás** útvonalon található. Normál lapon indítsd el a videót, majd válts másik alkalmazásra vagy kapcsold ki a kijelzőt. Az Android médiapaneljéről szüneteltetheted és folytathatod a lejátszást.

A javítás kezeli a YouTube háttérbe váltáskor érkező eseményeit és az Android WebView saját videóleállítását is. Az engedélyezett háttérlejátszás csak az aktív médiamunkamenetnél tartja ébren a videó lejátszását. A médiapanel Lejátszás gombja a webhely saját kezelője előtt előkészíti a folytatást; sikertelen indításkor ez az előkészítés három másodpercen belül megszűnik. A kézi szüneteltetés érvényben marad; nincs ismétlődő automatikus lejátszásindítás. A reklámszűréshez tartozó átmeneti némítás utáni visszatérés is újra felkészíti az aktív lejátszót.

Ha a WebView nem ad oldali médiavezérlő API-t, a Lejátszás gomb a YouTube saját lejátszóján keresztül kéri a folytatást. Így a webhely visszaállíthatja a szüneteltetéskor elengedett videóforrást. Ez kizárólag a kiválasztott videóhoz tartozó vezérlőt használja, kifejezett Lejátszás parancsra.

Az alkalmazás az oldal meglévő lejátszóját használja. A webhely hozzáférési és DRM-szabályai érvényesek. A célzott videós regresszió és az élő YouTube-próba eredményét külön rögzíti az [Android-jegyzőkönyv](mobile/ANDROID_BUILD_VALIDATION.md); a helyi YouTube-eredetű tesztoldal önmagában nem igazolja az élő szolgáltatás összes viselkedését.

## Telepítés és kiadás

Az új APK a korábbi Tracert frissíti, a csomagazonosító és az aláírókulcs megmarad. Fájl: `dist/Tracer-0.3.11-android-preview.apk`. A közös GitHub-kiadás fájljait a `dist/release-assets-v0.3.11`, a feltöltési lépéseket a `dist/PUBLISH_0.3.11.md` tartalmazza. A desktop böngésző működése ebben a közös verzióban változatlan.
