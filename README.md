# LernHub — HKB E

Interaktives, zweisprachiges (DE/FR), installierbares (PWA) Lern- und
Nachschlagewerk für Kaufleute (1.–3. Lehrjahr) zum Handlungskompetenzbereich
HKB E. Rein statisch, kein Backend, kein Framework — ein kleiner Node-Build
erzeugt echte HTML-Seiten aus Markdown-Content.

Prompt 1 lieferte das Fundament (Architektur, App-Shell, Design-System,
Zweisprachigkeit, PWA, Suche). Prompt 2 hat die bestehenden Inhalte aus der
Medienwerkstatt-Referenz in 8 der 9 Bereiche migriert (31 Lektionen, 13
Widgets). Der Bereich `recherche-digitale-arbeitswelt` bleibt bewusst mit nur
einer Proof-Lektion, bis Prompt 3 ihn aus der offiziellen PDF-Quelle befüllt.

## Architektur: Content-as-Data

**Ein neues Modul/eine neue Lektion = eine neue Inhaltsdatei — kein
Layout-Code wird angefasst.**

```
content/
  areas.json                 ← 9 Bereiche in 4 Clustern (Titel, Farbe, Icon, Reihenfolge)
  glossar.json                ← Glossarbegriffe (DE/FR)
  <area-id>/
    01-<slug>.md               ← eine Lektion, mit Frontmatter + Body
```

`build.mjs` liest `content/`, rendert jede Lektion, jede Bereichs-Landing und
die Startseite zu echten statischen HTML-Seiten in `dist/`, plus
`search-index.json`, `manifest.webmanifest` und `sw.js`.

### Einen Bereich hinzufügen

Bereits alle 9 Bereiche in `content/areas.json` angelegt. Um einen
bestehenden Bereich mit Lektionen zu füllen, reicht Schritt 2.

### Eine Lektion hinzufügen

1. Neue Datei `content/<area-id>/<nn>-<slug>.md` anlegen.
2. Frontmatter ausfüllen:

   ```yaml
   ---
   id: mein-lektion-slug          # wird Teil der URL: /<area-id>/<id>/
   area: <area-id>                 # muss zu areas.json passen
   titel_de: Mein Titel
   titel_fr: Mon titre
   reihenfolge: 2                  # Sortierung innerhalb des Bereichs
   lernfeld: LF3                   # LF2 | LF3
   lehrjahr: 2                     # 1 | 2 | 3
   typ: theorie                    # theorie | uebung | video | tool | referenz
   kstufe: K3
   lernziele_de:
     - Erstes Lernziel.
   lernziele_fr:
     - Premier objectif.
   tags: [stichwort1, stichwort2]
   ---
   ```

3. Body in Markdown schreiben (siehe Direktiven unten).
4. `npm run build` — die Lektion erscheint automatisch in Sidebar,
   Bereichs-Landing, Startseite und Suche.

Keine Registrierung nötig — der Build scannt `content/<area-id>/*.md`
automatisch.

## Body-Direktiven (Markdown-Erweiterungen)

Alles zwischen `:::` ist eine Direktive. Bausteine:

```markdown
:::h2 de="Eine Überschrift" fr="Un titre":::

:::de
Deutscher Fliesstext. **Fett**, *kursiv*, `code`, [Link](url), {{glossar:pixel}}.
:::
:::fr
Texte français équivalent.
:::

| Spalte A | Spalte B |
|---|---|
| Ganz normale GFM-Pipe-Tabellen | funktionieren auch |

:::konzept titel_de="Konzept-Titel" titel_fr="Titre du concept"
:::de
Erklärung + Metapher auf Deutsch.
:::
:::fr
Explication + métaphore en français.
:::
:::

:::merksatz
:::de
**Der Merksatz.**
:::
:::fr
**La phrase à retenir.**
:::
:::

:::ressourcen
:::de
- [Externer Link](https://…)
:::
:::fr
- [Lien externe](https://…)
:::
:::

:::widget kontrast-checker:::

:::widget quiz
{
  "fragen": [
    { "id": "q1", "fragenDe": "...", "fragenFr": "...", "optionenDe": ["A","B"], "optionenFr": ["A","B"], "loesung": 0, "erklaerungDe": "...", "erklaerungFr": "..." }
  ]
}
:::
```

- `:::h2 de="…" fr="…":::` / `:::h3 …:::` — bilinguale Überschrift (auch für
  «Auf dieser Seite»-TOC). Plain-Markdown-`##` wird **nicht** mehr unterstützt,
  weil es nicht zweisprachig wäre.
- `{{glossar:<id>}}` bzw. `{{glossar:<id>|Anzeigetext}}` — klickbarer
  Glossarbegriff mit Tooltip, gespeist aus `content/glossar.json`.
- `:::widget <slug>:::` ohne Konfiguration (z. B. `kontrast-checker`) oder mit
  JSON-Block danach (z. B. `quiz`, `zone-sort`, `vorlage`, …) — siehe
  «Ein Widget hinzufügen».
- Normale GFM-Pipe-Tabellen (`| … | … |`) werden automatisch in eine
  scrollbare `<table>` gerendert.

**Regel:** Genau eine Sprache wird je gerendert — auf Elemente mit
`data-lang="de"` bzw. `data-lang="fr"` greift die globale CSS-Regel in
`src/styles/base.css`:

```css
html[data-lang="de"] [data-lang="fr"] { display: none !important; }
html[data-lang="fr"] [data-lang="de"] { display: none !important; }
```

Beide Sprachen werden immer ins HTML gerendert (kein Reload beim Umschalten);
CSS blendet nur die inaktive Sprache aus. Das gilt für Content **und**
Shell-Chrome (Header, Sidebar, Buttons) — dieselbe Regel, ein Mechanismus.

Ein globaler, wegklickbarer Hinweis («maschinell vorübersetzt») erscheint nur
in FR (`#fr-check-banner`), solange er nicht geschlossen wurde.

## Ein Widget hinzufügen

1. `src/widgets/<slug>.js` — exportiert `mount(container, config)`. `config`
   ist entweder `null` (bei `:::widget slug:::` ohne Konfiguration) oder das
   per JSON übergebene Objekt (bei `:::widget slug\n{ ... }\n:::`).
2. In `src/scripts/app.js` in `WIDGET_MODULES` eintragen:
   `'<slug>': '/assets/widgets/<slug>.js'`.
3. Im Lektionstext `:::widget <slug>:::` bzw. mit Konfiguration verwenden.

`app.js` mountet automatisch beim Seitenaufbau und nach jeder clientseitigen
Navigation — dynamisch per Element, dedupliziert und idempotent
(`data-initialized`).

Vorhandene Widgets: `kontrast-checker`, `rgb-cmyk-mischer`, `font-switcher`,
`vorlage` (ausfüllbare Vorlage, z. B. Persona/SWOT/BMC/Steckbrief),
`decision-widget` (Auswahl → Ergebnis), `entscheidungsbaum` (verschachtelte
Ja/Nein-Fragen), `reihenfolge-spiel`, `zone-sort` (Drag&Drop-Zuordnung),
`checkliste`, `technik-karten`, `ab-player` (Vorher/Nachher-Audio),
`sound-rezept`, `shotlist` (Drehplan-Tool), `format-matcher`
(Memory-Zuordnung), `quiz` (Mehrfachauswahl mit Musterlösung).

## Design-System

- Tokens in `src/styles/tokens.css`: Farben (hell/dunkel + 4 Cluster-Farben),
  Typografie, Radien, Abstände. `src/styles/base.css` = Reset + Sprachregel.
  `src/styles/components.css` = alle Komponenten.
- Schriften **selbst-gehostet** (`assets/fonts/*.woff2`, kein CDN zur
  Laufzeit): Archivo (Display, Variable Font), IBM Plex Sans (Text, Variable
  Font), IBM Plex Mono (Labels/Code).
- Dark Mode: System-Präferenz standardmässig, manueller Umschalter
  überschreibt (`data-theme` auf `<html>`, persistiert in
  `localStorage.lh_theme`). Anti-Flacker-Skript im `<head>` jeder Seite setzt
  Sprache/Theme vor dem ersten Render.

## App-Shell

- Sidebar: Modulbaum aus `areas.json`, gruppiert nach Cluster; mobil
  Off-Canvas-Schublade.
- Suche (⌘K oder Button): durchsucht `search-index.json` (Substring + simple
  Fuzzy-Toleranz), springt zur Lektion.
- Home-Dashboard: Begrüssung, «Weiterlernen» (letzte Lektion aus
  `localStorage`), Filter-Chips (Lehrjahr/Typ), Bereichs-Karten mit
  Fortschrittsbalken.
- Favoriten/Fortschritt: `localStorage`, Präfix `lh_`, freiwillig, per
  Klick im Footer zurücksetzbar. Kein Konto, keine Sperren.
- Clientseitige Navigation: Klicks auf interne Links werden per `fetch` +
  History-API abgefangen (View-Transitions-API wenn verfügbar); schlägt der
  Fetch fehl, greift ein normaler Reload als Fallback.

## Lokal starten

Voraussetzung: Node.js ≥ 18 (keine weiteren Abhängigkeiten).

```bash
npm run icons   # einmalig: PWA-Icons erzeugen (assets/icons/)
npm run build   # baut dist/
npm start        # baut + startet einen lokalen Server auf :8080
```

`npm start` entspricht `node build.mjs --serve`.

## PWA

`manifest.webmanifest` und `sw.js` werden vom Build erzeugt. Der Service
Worker cached App-Shell, alle generierten Seiten, Assets und den Suchindex
(Cache-first mit Netzwerk-Update) → Offline-Fähigkeit und «Zum Homescreen
hinzufügen». Icons werden mit `npm run icons` aus einem winzigen,
abhängigkeitsfreien PNG-Encoder erzeugt (kein Bild-Tool nötig).

> Hinweis: Service-Worker-Registrierung lässt sich in manchen abgeschotteten
> Vorschau-/Sandbox-Browsern nicht testen (Policy-Block). Auf einer echten
> HTTPS-Deployment (z. B. Netlify) funktioniert die Registrierung normal.

## Deployment (Netlify)

`netlify.toml` ist vorbereitet:

```toml
[build]
  command = "npm run icons && npm run build"
  publish = "dist"
```

1. Repo ist bereits auf GitHub: `GBSLDamian/lernhub-hkb-e`.
2. Auf [app.netlify.com](https://app.netlify.com) → **Add new site** →
   **Import an existing project** → GitHub → `GBSLDamian/lernhub-hkb-e`
   auswählen.
3. Build-Einstellungen werden aus `netlify.toml` übernommen
   (Build-Command + Publish-Verzeichnis `dist`) — nichts weiter nötig.
4. Site-Name `lernhub-hkb-e` setzen (Site settings → Change site name).

## Ausblick Prompt 3–4

Prompt 3 vertieft aus der offiziellen HKB-E-PDF-Quelle: `recherche-digitale-
arbeitswelt` (bisher nur 1 Proof-Lektion) sowie die bewusst schlank
gehaltenen, mit `tags: ["vertiefung-ausstehend"]` markierten Themen — Farbe
RGB/CMYK, Bildformate, Einstellungsgrössen/Perspektiven, Ton (Audio-
Grundlagen), Persona/Komposition. Diese Themen haben bereits einen
kanonischen Ort; Prompt 3 ergänzt dort, statt neue Dubletten anzulegen.
