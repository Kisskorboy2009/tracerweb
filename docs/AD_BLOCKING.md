# Tracer 0.3.2 — alapértelmezett reklámvédelem

Új profilban a Shields bekapcsolt, a hat beépített promóciós hivatkozás pedig rejtett. A korábban mentett explicit megjelenési választást a frissítés megtartja; a Testreszabás panelen az összes promóció külön vagy együtt elrejthető.

## Hálózati szűrés

A saját `shared/filters/core.txt` mellett a kiadás változatlan EasyList- és EasyPrivacy-pillanatképeket tartalmaz. Ezek az első induláskor, internetes listafrissítés nélkül betöltődnek. A 2026. október 10-i pillanatképek eredetét, verzióját, bájtméretét, SHA-256-át és CC-BY-SA 3.0 licencét a `shared/filters/sources.json` és a mellékelt licenc rögzíti.

A JS-motor a támogatott domainhorgonyokat, útvonalakat, korlátozott wildcardokat, elválasztókat és végponti horgonyokat kezeli, hostindexelt kereséssel. Erőforrástípus, forrásdomain, third-party, kivétel és pontos badfilter is kezelhető a támogatott részhalmazban. Az ismeretlen vagy nem támogatott szintaxis kimarad; nem alakul tágabb tiltássá. A motor állapota a támogatott szabályok számát mutatja, nem a teljes lista feldolgozását állítja.

A kézi listafrissítés ellenőrzött EasyList/EasyPrivacy-cache-t tárol; a saját core szabályok megmaradnak. Sérült vagy korábbi, hiányos cache esetén a mellékelt pillanatképek működnek. A teljesebb natív hálózati parserhez továbbra is a Rust addon szükséges, amelynek helyi fordítása nem igazolt.

## Kozmetikai és YouTube-védelem

Szűk, saját szabályok elrejtik az ismert reklámelemeket, például a Google ad iframe-eket és YouTube promóciós renderelőket. A letöltött listák nem injektálhatnak tetszőleges JavaScriptet vagy CSS-t.

A YouTube DOM-segéd kizárólag ismert YouTube-eredeteken és aktív Shields mellett fut. Windows alatt elkülönített Chromium-világban működik, Node/IPC-hozzáférés és a weboldal lejátszó-API-jának módosítása nélkül. Csak a kifejezetten reklámként jelölt lejátszóban található videót kezeli: elnémítja, gyorsítja vagy a rendelkezésre álló kihagyást használja. A normál videó sebessége és hangja nem módosul; a reklám vége után a saját ideiglenes változásait visszaállítja. A YouTube lejátszó API-ja és a teljes `googlevideo.com` nem kerül tiltásra.

A védelem és a hálózati döntés ugyanazt a webhelyházirendet használja. Házirendváltáskor az érintett élő dokumentumok újra létrejönnek, így a korábbi CSS és segéd nem marad aktív a védelem kikapcsolása után. Ez újratöltést jelenthet, és a nem mentett űrlapállapot elveszhet.

Androidon a rendszer WebView képességétől függően dokumentumindítási védelem vagy betöltés utáni tartalékút működik. Az Android hálózati listája kisebb, saját domain-/célzott reklámvégpont-lista; nem az asztali EasyList-parser. Shields-váltáskor a dokumentumok újratöltődnek vagy az inaktív WebView-k bezárulnak.

## Ellenőrzés és korlátok

A Node-próbák a szabályszintaxist, kivételeket, tiltások szűk határát, csomagolt listaintegritást és a YouTube-segéd életciklusát vizsgálják. A Chromium-próba helyi, YouTube-eredeten kiszolgált HTTPS-fixture-rel ellenőrzi a kozmetikai és reklámként jelölt videóvédelmet, a normál lejátszást és a Shields kikapcsolását. Nem használ valódi YouTube-fiókot. Androidon JVM-kérésfilter-tesztek és tényleges APK-build futott; készülékpróba még nincs.

A YouTube felülete és reklámkiszolgálása változhat. Szerveroldalról a tartalomba kevert reklámok, új lejátszójelölések és platformos különbségek továbbra is áttörhetik ezt a védelmet. Nincs teljes Brave/uBO-paritás, általános listás scriptlet-/redirect-/kozmetikai feldolgozás vagy minden reklám eltűnésére garancia. A mért eredmények a [VALIDATION.md](VALIDATION.md) fájlban szerepelnek.

Elsődleges források: [EasyList](https://easylist.to/), [Electron elkülönített világok](https://www.electronjs.org/docs/latest/api/web-contents#contentsexecutejavascriptinisolatedworldworldid-scripts-usergesture), [Android WebView dokumentumindítási szkriptek](<https://developer.android.com/reference/androidx/webkit/WebViewCompat#addDocumentStartJavaScript(android.webkit.WebView,java.lang.String,java.util.Set)>).
