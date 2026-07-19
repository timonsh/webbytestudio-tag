# webbytestudio-tag

Zentral verwaltete „gebaut von WebByte Studio"-Badge fürs Impressum.
Gehostet unter **[tag.timonsh.dev](https://tag.timonsh.dev)** — jedes Projekt bindet
sie von dort ein, sodass ein Update hier automatisch überall greift.

## Einbinden (empfohlen — zentral)

Zwei Zeilen ins Zielprojekt:

```html
<!-- einmal im <head> (oder vor </body>) -->
<script src="https://tag.timonsh.dev/tag.js" defer></script>

<!-- an der Stelle, an der die Badge erscheinen soll -->
<div data-webbyte-studio-tag></div>
```

`tag.js` lädt `studio-badge.css` (einmalig) und rendert die Badge in jeden
`[data-webbyte-studio-tag]`-Mountpunkt. Bild und Text kommen ebenfalls von hier.
Nichts weiter kopieren.

## Zentral updaten

Alles wird in diesem Repo gepflegt; nach dem Deploy ist es auf allen Seiten aktuell:

| Ändern von … | Datei |
|--------------|-------|
| Aussehen (Farben, Abstände, Ambient-Animation, Hover, Cursor) | `studio-badge.css` |
| Markup / Text / Links | `tag.js` (`BADGE_HTML`) |
| Flammen, Typewriter, Lift/Tilt (Verhalten) | `tag.js` (Enhancement) |
| Avatar | `timon-profile.webp` |
| Logo (Wortmarke, weiß/transparent) | `webbyte-mark.webp` |

## Dateien

| Datei | Zweck |
|-------|-------|
| `tag.js` | Embed-Skript (Loader + Markup + Flammen/Typewriter/Tilt) — der zentrale Einstieg |
| `studio-badge.css` | Eigenständige Styles (keine externen Variablen nötig) |
| `timon-profile.webp` | Avatar (144×144) — zugleich Feuerquelle |
| `webbyte-mark.webp` | WebByte-Wortmarke (weiß, transparent) fürs Inline-Logo |
| `favicon.svg` | Favicon (blaues Chevron + Flamme) für die Demo-Seite |
| `studio-badge.html` | Statisches Markup-Snippet (No-JS-Alternative) |
| `index.html` | Standalone-Vorschau / Demo |

## No-JS-Alternative

Wer die Badge lieber statisch einbaut, verlinkt die CSS und kopiert das Snippet
aus `studio-badge.html` (Bild-`src` auf `https://tag.timonsh.dev/timon-profile.webp`
setzen):

```html
<link rel="stylesheet" href="https://tag.timonsh.dev/studio-badge.css">
```

## Vorschau

`index.html` im Browser öffnen — zeigt das Tag 1:1 auf hellem Hintergrund.

---

Die Komponente ist ein in sich geschlossener, dunkler „Terminal"-Balken in der
WebByte-Palette — **Blau `#2a45f8` · Grün `#3fb950` · Orange `#f78166`** (1:1 von
timonsh.dev).

**Ambient:** Balatro-artige Flammen, die vom Avatar (rechts) nach links züngeln
(Canvas, Blau→Grün→Orange→Weiß; ohne JS ein CSS-Ember-Fallback) · driftendes
Tech-Grid · orbitierende Aura · Scanline · rotierender Conic-Rand · blinkender
oranger Caret · farbwechselnde Avatar-Aura.

**Interaktion:** Der Terminal-Prompt **tippt** die Wortmarke (Typewriter-Loop) mit
solidem Caret; die ganze Badge hat einen sehr leichten **Lift/Float** und neigt
sich per Pointer-**Tilt**. Custom-Cursor (nur innerhalb der Badge). Das WebByte-Logo
fließt als kleine Pille mit **Primary-Blau `#2a45f8`** als Hintergrund in die
Wortmarke ein. Viele Hover-Effekte: Logo-Glanz-Sweep, Avatar-Tilt mit Farbring,
leuchtende Ampel-Punkte, farbig unterstrichene Links, Flammen-Boost.

Alles respektiert `prefers-reduced-motion` (dann statisch, ohne Feuer/Tilt) sowie
Tab-Sichtbarkeit und Viewport (Animationen pausieren außerhalb des Bildes). Alle
Links zeigen auf <https://timonsh.dev>. Die Mono-Schrift ist auf allen
Textelementen explizit gesetzt, damit ein globales `* { font-family: … }` des
Host-Projekts das Aussehen nicht verändert.
