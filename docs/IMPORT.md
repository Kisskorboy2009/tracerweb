# Adatimport és mentett fiókok

Az **Adatok importálása** panel az oldalsávról, a Beállításokból, az eszközmenüből
vagy a parancspalettából nyitható meg (csak normál ablakban). Minden lépés a gépen
történik, semmi nem kerül kiszolgálóra.

## Lépések

1. Válaszd ki a böngészőprofilt vagy az exportfájl típusát.
2. Az előnézet megmutatja, hány bejegyzés vehető át adattípusonként.
3. Kapcsold ki, amit nem szeretnél átvenni, majd importálj. Az előnézet önmagában
   semmit nem módosít.

## Források

| Forrás                                       | Átvehető adatok                        |
| -------------------------------------------- | -------------------------------------- |
| Chrome, Edge, Brave helyi profil             | Könyvjelzők, előzmények, mentett lapok |
| Könyvjelző-export HTML (bármely böngésző)    | Könyvjelzők                            |
| Jelszó-export CSV (Chromium-alapú böngészők) | Mentett fiókok                         |
| Firefox munkamenet JSON (`sessionstore`)     | Lapok                                  |

A meglévő könyvjelzők és előzmények megmaradnak, az ismétlődések összevonódnak.
Az importált lapok a háttérben alszanak, amíg meg nem nyitod őket.

## Mentett fiókok

A jelszavak a rendszer titkosításával (Windows alatt a felhasználóhoz kötött DPAPI)
kerülnek a lemezre. A **Mentett fiókok** panelen kérheted a bejelentkezési mezők
kitöltését – csak a fiókhoz tartozó HTTPS webhelyen, gombnyomásra –, másolhatod a
jelszót (30 másodpercig marad a vágólapon) vagy törölheted a fiókot.

Más böngésző sütijei, kétlépcsős kódjai és titkosított jelszóadatbázisa nem
importálható, ezért az első belépésnél a webhely további azonosítást kérhet. Az
exportált CSV-fájl titkosítatlan, import után érdemes törölni.
