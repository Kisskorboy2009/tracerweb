# Bundled first-party shortcut pictures

The Tracer new-tab shortcuts use these local 128 × 128 PNG images instead of
letter monograms. Opening a new tab makes **no external favicon/image request**.
The images are raster assets; HTML and active SVG content are not bundled.

Sources checked on 2026-10-10:

| Shortcut | Official source | Treatment |
| --- | --- | --- |
| Kisskorboy | <https://kisskorboy.hu/assets/favicon.5b3233e4.png> | Official site favicon, centered with a small margin. |
| Overclock | <https://overclockgame.hu/overclock-logo.png> | Official logo; transparent margins trimmed. |
| Solaryn | <https://solaryn.hu/assets/solaryn-icon.png> | Official site icon; transparent margins trimmed. |
| SolarCenter | <https://center.solaryn.hu/assets/solaryn-icon.png> | Official site icon; transparent margins trimmed. |
| Asthetic | <https://asthetic.hu/assets/asthetic-logo.png> | Actual symbol cropped from the official wordmark, on a light plate so its dark artwork remains legible in dark themes. |
| Kounee | <https://kounee.hu/website-parking.png> | Actual illustration from the domain's current page. The domain currently displays a Rackhost parking page, with no personal Kounee favicon. No invented Kounee branding is used. |

`sources.json` records the source URL, captured time and SHA-256 of both source
and packaged image. Brand artwork belongs to its respective owner; inclusion
identifies the requested destination rather than implying endorsement.

Refresh manually from the project root after installing dependencies:

```powershell
npx electron scripts/site-icons.cjs
```

The refresh tool downloads only the six curated HTTPS PNG sources, uses a
15-second timeout and a 4 MiB limit per file, checks the PNG signature and decoder
dimensions, then re-encodes the artwork as small PNGs with Chromium. It never
loads remote page scripts. The browser ships the resulting files and does not
run this maintenance script during startup or use.
