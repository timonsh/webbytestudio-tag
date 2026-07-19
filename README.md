# WebByte Studio — Impressum-Tag (`.studio-badge`)

Isolierte, wiederverwendbare „gebaut von WebByte Studio"-Badge, wie sie im
Impressum eingesetzt wird. 1:1 aus dem `ethikseite`-Projekt extrahiert und
eigenständig gemacht — es werden **keine** externen CSS-Variablen oder
Frameworks benötigt.

## Dateien

| Datei | Zweck |
|-------|-------|
| `studio-badge.html` | HTML-Snippet zum Einfügen (z. B. am Ende des Impressums) |
| `studio-badge.css`  | Eigenständige Styles (Farben/Abstände/Font fest hinterlegt) |
| `timon-profile.webp`| Avatar (144×144) |
| `index.html`        | Standalone-Vorschau / Demo |

## Vorschau

`index.html` im Browser öffnen — zeigt das Tag 1:1 auf hellem Hintergrund.

## In ein Projekt einbauen

1. `studio-badge.css` einbinden (verlinken oder Inhalt in die Projekt-CSS kopieren).
2. `timon-profile.webp` ins Projekt kopieren und den `<img src>`-Pfad im Snippet
   an den eigenen Asset-Pfad anpassen.
3. Das Markup aus `studio-badge.html` an die gewünschte Stelle setzen.

Die Komponente ist ein in sich geschlossener, dunkler „Terminal"-Balken mit
blauem Glow und dezent pulsierendem Avatar (respektiert
`prefers-reduced-motion`). Alle Links zeigen auf <https://timonsh.dev>.

> Hinweis: Die Mono-Schrift ist auf allen Textelementen explizit gesetzt, damit
> ein globales `* { font-family: … }` des Host-Projekts das Aussehen nicht
> verändert.
# webbytestudio-tag
