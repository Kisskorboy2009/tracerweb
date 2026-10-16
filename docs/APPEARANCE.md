# Megjelenés

A **Megjelenés** panel (oldalsáv paletta ikonja vagy a kezdőlap testreszabás gombja)
a böngésző felületét és a kezdőlapot szabja testre. A választás azonnal érvényes,
és a profilban megmarad; a weboldalak saját kinézetét nem módosítja.

## Paletták és hangsúlyszínek

| Sötét                                                                                        | Világos                                            |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Graphite, Midnight, Pure Black, Nord, Deep Forest, Ocean, Velvet, Rose Noir, Ember, Espresso | Cloud, Dune, Lavender, Sage, Glacier, Peach, Paper |

A **Rendszertéma** a Windows világos vagy sötét beállítását követi. A 14 hangsúlyszín
(Ibolya, Kék, Cián, Menta, Lime, Arany, Mandarin, Korall, Rózsaszín, Orgona, Petrol,
Rubin, Ezüst, Monokróm) a palettától függetlenül választható. Témaváltáskor a
színek finoman áttűnnek.

## Kezdőlap

- **Háttérkép** – kilenc beépített kép vagy „Csak színek”. Saját kép is
  hozzáadható (JPEG, PNG, WebP, legfeljebb 25 MB, összesen 10 kép); ezek csak a
  gépen tárolódnak. A sötétítés 0–85% között állítható.
- **Elemek** – gyorselérési sáv, kezdőlapi hivatkozások, óra, Shields-kártya és a
  „Teret a fókusznak” kártya egyenként kapcsolható.
- **Hivatkozások** – a hat beépített ajánlás egyenként elrejthető (új profilban mind
  rejtett). Ha egy sem látszik, a kezdőlap a leggyakrabban látogatott oldalaidat
  mutatja az előzmények alapján.

## Animációk

| Beállítás                  | Hatás                                                    |
| -------------------------- | -------------------------------------------------------- |
| Rendszerbeállítás követése | Animációk, kivéve ha a Windowsban csökkentett mozgás van |
| Finom átmenetek            | Mindig animál                                            |
| Csökkentett mozgás         | Nincs animáció és átmenet                                |

Az animációk csak egy-egy esemény hatására futnak (megnyitás, váltás, betöltés);
tétlen állapotban nincs folyamatosan futó animáció, így nem terhelik a gépet.

## Oldalsáv és alsó sáv

A Beállítások → Oldalsáv és alsó sáv részben elrejthetők, a bal vagy jobb oldalra
helyezhetők, és a szélük húzásával is átméretezhetők (oldalsáv 56–240 px, alsó sáv
24–160 px). 120 px felett az oldalsáv gombjai feliratot is kapnak.

## Android

A **Menü → Megjelenés** lapon választható a téma (rendszer, világos, sötét), a
nyolc színpaletta, a címsáv helye (fent vagy lent), saját háttérkép a kezdőlapra és
a mozgások csökkentése.

## Fejlesztőknek

A paletták, hangsúlyszínek, ajánlások és háttérképek közös forrása a
`shared/appearance.json`. A felület által használt `desktop/ui/appearance.js` ebből
készül (`node scripts/appearance.mjs`; az `npm start` és a buildek automatikusan
lefuttatják). A háttérképek leírása: assets/wallpapers (`../assets/wallpapers/README.md`).
