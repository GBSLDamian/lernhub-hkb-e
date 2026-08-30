#!/usr/bin/env node
// LernHub build — reads content/ (content-as-data) and emits a fully static
// site into dist/: one real HTML page per lesson and per area landing, a
// home dashboard, a search index, a PWA manifest and a service worker.
// Pure Node ESM, zero runtime dependencies.
import { readFile, writeFile, mkdir, readdir, cp, rm, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';

import { parseFrontmatter, parseBody, renderBody, extractText, collectWidgets, setGlossary } from './src/lib/content.mjs';
import { pageShell, dualLabel, metaChips, TYP_LABEL } from './src/lib/templates.mjs';
import { icon, iconNames } from './src/lib/icons.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(ROOT, 'content');
const SRC_DIR = path.join(ROOT, 'src');
const ASSETS_DIR = path.join(ROOT, 'assets');
const DIST_DIR = path.join(ROOT, 'dist');

async function readJson(p) {
  return JSON.parse(await readFile(p, 'utf8'));
}

async function loadLessons(areas) {
  const lessons = [];
  for (const area of areas) {
    const dir = path.join(CONTENT_DIR, area.id);
    if (!existsSync(dir)) continue;
    const files = (await readdir(dir)).filter((f) => f.endsWith('.md')).sort();
    for (const file of files) {
      const raw = await readFile(path.join(dir, file), 'utf8');
      const { data, body } = parseFrontmatter(raw);
      const ast = parseBody(body);
      const renderCtx = { headings: [], lang: null, widgetIndex: 0 };
      const bodyHtml = renderBody(ast, renderCtx);
      const widgets = [...collectWidgets(ast)];
      lessons.push({
        ...data,
        areaId: area.id,
        href: `/${area.id}/${data.id}/`,
        bodyHtml,
        headings: renderCtx.headings,
        widgets,
        textDe: extractText(ast, 'de'),
        textFr: extractText(ast, 'fr'),
        ast,
      });
    }
    // sort by declared reihenfolge within the area
  }
  lessons.sort((a, b) => (a.reihenfolge ?? 0) - (b.reihenfolge ?? 0));
  return lessons;
}

function lessonsForArea(lessons, areaId) {
  return lessons.filter((l) => l.areaId === areaId).sort((a, b) => (a.reihenfolge ?? 0) - (b.reihenfolge ?? 0));
}

async function writePage(relPath, html) {
  const dest = path.join(DIST_DIR, relPath, 'index.html');
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, html, 'utf8');
}

function areaTrail(area, cluster) {
  return [
    { de: 'Startseite', fr: 'Accueil', href: '/' },
    { de: area.titel.de, fr: area.titel.fr, href: `/${area.id}/` },
  ];
}

function lessonTrail(area, lesson) {
  return [
    { de: 'Startseite', fr: 'Accueil', href: '/' },
    { de: area.titel.de, fr: area.titel.fr, href: `/${area.id}/` },
    { de: lesson.titel_de, fr: lesson.titel_fr, href: lesson.href },
  ];
}

function buildLessonPage(lesson, area, cluster, prev, next, ctx) {
  const lernzieleHtml = `<section class="lernziele">
  <h2 data-lang="de">Lernziele</h2>
  <h2 data-lang="fr">Objectifs d'apprentissage</h2>
  <ul data-lang="de">${(lesson.lernziele_de || []).map((z) => `<li>${z}</li>`).join('')}</ul>
  <ul data-lang="fr">${(lesson.lernziele_fr || []).map((z) => `<li>${z}</li>`).join('')}</ul>
</section>`;
  const titleHtml = `<header class="lesson-article__header">
  ${metaChips(lesson)}
  <h1 data-lang="de">${lesson.titel_de}</h1>
  <h1 data-lang="fr">${lesson.titel_fr}</h1>
</header>`;
  const bodyHtml = `${titleHtml}${lernzieleHtml}<div class="lesson-body">${lesson.bodyHtml}</div>`;
  return pageShell({
    title: `${lesson.titel_de} / ${lesson.titel_fr}`,
    description: (lesson.lernziele_de || [])[0] || '',
    bodyHtml,
    activeAreaId: area.id,
    activeLessonId: lesson.id,
    clusters: ctx.clusters,
    areas: ctx.areas,
    trail: lessonTrail(area, lesson),
    headings: lesson.headings,
    prev: prev && { href: prev.href, titel_de: prev.titel_de, titel_fr: prev.titel_fr },
    next: next && { href: next.href, titel_de: next.titel_de, titel_fr: next.titel_fr },
  });
}

function buildAreaPage(area, cluster, lessons, ctx) {
  const items = lessons
    .map(
      (l) => `<li class="lesson-card" data-lehrjahr="${l.lehrjahr}" data-typ="${l.typ}">
  <a href="${l.href}">
    <span class="lesson-card__title" data-lang="de">${l.titel_de}</span>
    <span class="lesson-card__title" data-lang="fr">${l.titel_fr}</span>
    ${metaChips(l)}
    <span class="lesson-card__progress" data-progress-for="${l.id}"><span class="lesson-card__progress-bar"></span></span>
  </a>
</li>`
    )
    .join('\n');
  const bodyHtml = `<header class="area-header" style="--area-color: var(--cluster-${cluster.id})">
  ${icon(area.icon, 'area-header__icon')}
  <div>
    <p class="area-header__cluster">${dualLabel(cluster.titel.de, cluster.titel.fr)}</p>
    <h1 data-lang="de">${area.titel.de}</h1>
    <h1 data-lang="fr">${area.titel.fr}</h1>
    <p data-lang="de">${area.kurz.de}</p>
    <p data-lang="fr">${area.kurz.fr}</p>
  </div>
</header>
<ul class="lesson-list">${items || `<li class="lesson-list__empty">${dualLabel('Bald verfügbar.', 'Bientôt disponible.')}</li>`}</ul>`;
  return pageShell({
    title: `${area.titel.de} / ${area.titel.fr}`,
    description: area.kurz.de,
    bodyHtml,
    activeAreaId: area.id,
    clusters: ctx.clusters,
    areas: ctx.areas,
    trail: areaTrail(area, cluster),
  });
}

function buildHomePage(ctx) {
  const { clusters, areas, lessons } = ctx;
  const areaCards = areas
    .map((area) => {
      const cluster = clusters.find((c) => c.id === area.cluster);
      const count = lessonsForArea(lessons, area.id).length;
      return `<li class="area-card" style="--area-color: var(--cluster-${cluster.id})">
  <a href="/${area.id}/">
    ${icon(area.icon, 'area-card__icon')}
    <span class="area-card__title" data-lang="de">${area.titel.de}</span>
    <span class="area-card__title" data-lang="fr">${area.titel.fr}</span>
    <span class="area-card__count" data-lang="de">${count} Lektion${count === 1 ? '' : 'en'}</span>
    <span class="area-card__count" data-lang="fr">${count} leçon${count === 1 ? '' : 's'}</span>
    <span class="area-card__progress" data-area-progress="${area.id}"><span class="area-card__progress-bar"></span></span>
  </a>
</li>`;
    })
    .join('\n');

  const typeChips = Object.keys(TYP_LABEL)
    .map((t) => `<button class="chip chip--filter" data-filter-typ="${t}">${dualLabel(TYP_LABEL[t].de, TYP_LABEL[t].fr)}</button>`)
    .join('');
  const yearChips = [1, 2, 3]
    .map((y) => `<button class="chip chip--filter" data-filter-lehrjahr="${y}">${dualLabel(y + '. Lehrjahr', (y === 1 ? '1re' : y + 'e') + ' année')}</button>`)
    .join('');

  const lessonItems = lessons
    .map((l) => {
      const area = areas.find((a) => a.id === l.areaId);
      const cluster = clusters.find((c) => c.id === area.cluster);
      return `<li class="lesson-card" data-lehrjahr="${l.lehrjahr}" data-typ="${l.typ}" style="--area-color: var(--cluster-${cluster.id})">
  <a href="${l.href}">
    <span class="lesson-card__title" data-lang="de">${l.titel_de}</span>
    <span class="lesson-card__title" data-lang="fr">${l.titel_fr}</span>
    ${metaChips(l)}
  </a>
</li>`;
    })
    .join('\n');

  const bodyHtml = `<section class="home-hero">
  <h1 data-lang="de">Willkommen bei LernHub</h1>
  <h1 data-lang="fr">Bienvenue sur LernHub</h1>
  <p data-lang="de">Dein Nachschlagewerk zum Handlungskompetenzbereich E — für alle drei Lehrjahre.</p>
  <p data-lang="fr">Ton ouvrage de référence pour le domaine de compétences opérationnelles E — pour les trois années d'apprentissage.</p>
  <div id="continue-learning" class="continue-card" hidden>
    <p class="continue-card__label"><span data-lang="de">Weiterlernen</span><span data-lang="fr">Continuer</span></p>
    <a id="continue-learning-link" href="#"></a>
  </div>
</section>

<section class="home-filters" aria-label="Filter">
  <div class="chip-group">${yearChips}</div>
  <div class="chip-group">${typeChips}</div>
</section>

<section class="home-section">
  <h2 data-lang="de">Alle Lektionen</h2>
  <h2 data-lang="fr">Toutes les leçons</h2>
  <ul class="lesson-list" id="home-lesson-list">${lessonItems}</ul>
</section>

<section class="home-section">
  <h2 data-lang="de">Bereiche</h2>
  <h2 data-lang="fr">Domaines</h2>
  <ul class="area-card-grid">${areaCards}</ul>
</section>`;

  return pageShell({
    title: 'LernHub',
    description: 'Interaktives, zweisprachiges Nachschlagewerk zum Handlungskompetenzbereich E.',
    bodyHtml,
    clusters,
    areas,
  });
}

function buildGlossaryPage(glossary, ctx) {
  const sorted = [...glossary].sort((a, b) => a.begriff_de.localeCompare(b.begriff_de, 'de'));
  const items = sorted
    .map(
      (g) => `<div class="glossary-list__entry" id="glossar-${g.id}">
  <dt data-lang="de">${g.begriff_de}</dt><dt data-lang="fr">${g.begriff_fr}</dt>
  <dd data-lang="de">${g.kurz_de}${g.metapher_de ? `<br><em>Metapher: ${g.metapher_de}</em>` : ''}</dd>
  <dd data-lang="fr">${g.kurz_fr}${g.metapher_fr ? `<br><em>Métaphore : ${g.metapher_fr}</em>` : ''}</dd>
</div>`
    )
    .join('\n');
  const bodyHtml = `<header class="area-header">
  <div>
    <h1 data-lang="de">Glossar</h1>
    <h1 data-lang="fr">Glossaire</h1>
  </div>
</header>
<dl class="glossary-list">${items}</dl>`;
  return pageShell({
    title: 'Glossar / Glossaire',
    bodyHtml,
    clusters: ctx.clusters,
    areas: ctx.areas,
  });
}

function buildSearchIndex(lessons, areas) {
  const entries = [];
  for (const l of lessons) {
    const area = areas.find((a) => a.id === l.areaId);
    entries.push({
      lang: 'de',
      id: l.id,
      area: l.areaId,
      areaTitel: area.titel.de,
      href: l.href,
      titel: l.titel_de,
      typ: l.typ,
      lehrjahr: l.lehrjahr,
      lernfeld: l.lernfeld,
      tags: l.tags || [],
      text: l.textDe,
    });
    entries.push({
      lang: 'fr',
      id: l.id,
      area: l.areaId,
      areaTitel: area.titel.fr,
      href: l.href,
      titel: l.titel_fr,
      typ: l.typ,
      lehrjahr: l.lehrjahr,
      lernfeld: l.lernfeld,
      tags: l.tags || [],
      text: l.textFr,
    });
  }
  return entries;
}

async function buildManifest() {
  return {
    name: 'LernHub — HKB E',
    short_name: 'LernHub',
    description: 'Interaktives, zweisprachiges Lern- und Nachschlagewerk zum Handlungskompetenzbereich E.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f6f7fb',
    theme_color: '#1b49d6',
    lang: 'de',
    icons: [
      { src: '/assets/icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/assets/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/assets/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/assets/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}

async function walkFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walkFiles(p)));
    else out.push(p);
  }
  return out;
}

async function buildServiceWorker(precachePaths) {
  const version = Date.now().toString(36);
  const list = JSON.stringify(['/', ...precachePaths]);
  return `// Auto-generated by build.mjs — do not edit by hand.
const CACHE = 'lernhub-${version}';
const PRECACHE_URLS = ${list};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached || caches.match('/index.html'));
      return cached || network;
    })
  );
});
`;
}

async function copyStaticAssets() {
  await mkdir(path.join(DIST_DIR, 'assets'), { recursive: true });
  await cp(path.join(SRC_DIR, 'styles'), path.join(DIST_DIR, 'assets', 'styles'), { recursive: true });
  await cp(path.join(SRC_DIR, 'scripts'), path.join(DIST_DIR, 'assets', 'scripts'), { recursive: true });
  await cp(path.join(SRC_DIR, 'widgets'), path.join(DIST_DIR, 'assets', 'widgets'), { recursive: true });
  await cp(path.join(ASSETS_DIR, 'fonts'), path.join(DIST_DIR, 'assets', 'fonts'), { recursive: true });
  for (const dir of ['icons', 'audio', 'svg', 'img', 'fonts-demo']) {
    if (existsSync(path.join(ASSETS_DIR, dir))) {
      await cp(path.join(ASSETS_DIR, dir), path.join(DIST_DIR, 'assets', dir), { recursive: true });
    }
  }
}

async function build() {
  console.log('→ LernHub build gestartet');
  await rm(DIST_DIR, { recursive: true, force: true });
  await mkdir(DIST_DIR, { recursive: true });

  const { clusters, areas } = await readJson(path.join(CONTENT_DIR, 'areas.json'));
  const glossaryPath = path.join(CONTENT_DIR, 'glossar.json');
  const glossary = existsSync(glossaryPath) ? await readJson(glossaryPath) : [];
  setGlossary(glossary);
  const lessons = await loadLessons(areas);
  const ctx = { clusters, areas, lessons };

  // Lesson pages
  const pageWrites = [];
  for (const area of areas) {
    const cluster = clusters.find((c) => c.id === area.cluster);
    const areaLessons = lessonsForArea(lessons, area.id);
    areaLessons.forEach((lesson, i) => {
      const prev = areaLessons[i - 1] || null;
      const next = areaLessons[i + 1] || null;
      const html = buildLessonPage(lesson, area, cluster, prev, next, ctx);
      pageWrites.push(writePage(`${area.id}/${lesson.id}`, html));
    });
    const areaHtml = buildAreaPage(area, cluster, areaLessons, ctx);
    pageWrites.push(writePage(area.id, areaHtml));
  }
  await Promise.all(pageWrites);

  await writePage('', buildHomePage(ctx));
  await writePage('glossar', buildGlossaryPage(glossary, ctx));

  const searchIndex = buildSearchIndex(lessons, areas);
  await writeFile(path.join(DIST_DIR, 'search-index.json'), JSON.stringify(searchIndex), 'utf8');
  await writeFile(path.join(DIST_DIR, 'glossary.json'), JSON.stringify(glossary), 'utf8');

  const manifest = await buildManifest();
  await writeFile(path.join(DIST_DIR, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2), 'utf8');

  await copyStaticAssets();

  const distFiles = await walkFiles(DIST_DIR);
  const precache = distFiles
    .map((p) => '/' + path.relative(DIST_DIR, p).split(path.sep).join('/'))
    .filter((p) => !p.endsWith('sw.js'));
  const sw = await buildServiceWorker(precache);
  await writeFile(path.join(DIST_DIR, 'sw.js'), sw, 'utf8');

  console.log(`✓ Build fertig: ${lessons.length} Lektion(en), ${areas.length} Bereiche → dist/`);
}

function serve(port = 8080) {
  const server = http.createServer(async (req, res) => {
    try {
      let urlPath = decodeURIComponent(req.url.split('?')[0]);
      let filePath = path.join(DIST_DIR, urlPath);
      if (urlPath.endsWith('/')) filePath = path.join(filePath, 'index.html');
      if (!path.extname(filePath)) filePath = path.join(filePath, 'index.html');
      if (!existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found: ' + urlPath);
        return;
      }
      const ext = path.extname(filePath);
      const types = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.webmanifest': 'application/manifest+json',
        '.woff2': 'font/woff2',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
      };
      const data = await readFile(filePath);
      res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
      res.end(data);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(String(err));
    }
  });
  server.listen(port, () => console.log(`→ Vorschau läuft auf http://localhost:${port}`));
}

await build();
if (process.argv.includes('--serve')) serve();
