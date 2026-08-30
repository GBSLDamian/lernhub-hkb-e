// Zwei kombinierte Kamera-Technik-Interaktive:
// 1) Belichtungsdreieck: Blende/Verschlusszeit/ISO verändern live die
//    Helligkeit einer Vorschau (CSS-Filter) + Nebenwirkungs-Balken
//    (Tiefenschärfe, Bewegungsunschärfe, Bildrauschen).
// 2) Bildrate: ein Punkt bewegt sich über eine feste Distanz, aber nur mit
//    N Positions-Updates pro Sekunde — macht den fps-Unterschied spürbar.
// config: none (statische Lerninhalte, keine externen Daten nötig)
const BLENDEN = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];
const VERSCHLUSS = [
  { label: '1/4000', t: 1 / 4000 }, { label: '1/2000', t: 1 / 2000 }, { label: '1/1000', t: 1 / 1000 },
  { label: '1/500', t: 1 / 500 }, { label: '1/250', t: 1 / 250 }, { label: '1/125', t: 1 / 125 },
  { label: '1/60', t: 1 / 60 }, { label: '1/30', t: 1 / 30 }, { label: '1/15', t: 1 / 15 },
  { label: '1/8', t: 1 / 8 }, { label: '1/4', t: 1 / 4 }, { label: '1/2', t: 1 / 2 }, { label: '1', t: 1 },
];
const ISOS = [100, 200, 400, 800, 1600, 3200, 6400];
const BASELINE_BLENDE_IDX = 5; // f/8
const BASELINE_VERSCHLUSS_IDX = 5; // 1/125
const BASELINE_ISO_IDX = 0; // 100

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function renderBelichtung(root) {
  root.innerHTML = `
    <div class="belichtung__preview" data-role="preview">
      <span class="belichtung__preview-label"><span data-lang="de">Vorschau</span><span data-lang="fr">Aperçu</span></span>
      <div class="belichtung__noise" data-role="noise"></div>
    </div>
    <div class="belichtung__controls">
      <label class="belichtung__control">
        <span data-lang="de">Blende (f/)</span><span data-lang="fr">Ouverture (f/)</span>
        <input type="range" min="0" max="${BLENDEN.length - 1}" value="${BASELINE_BLENDE_IDX}" data-role="blende">
        <span class="chip chip--mono" data-role="blende-value"></span>
      </label>
      <label class="belichtung__control">
        <span data-lang="de">Verschlusszeit</span><span data-lang="fr">Temps d'obturation</span>
        <input type="range" min="0" max="${VERSCHLUSS.length - 1}" value="${BASELINE_VERSCHLUSS_IDX}" data-role="verschluss">
        <span class="chip chip--mono" data-role="verschluss-value"></span>
      </label>
      <label class="belichtung__control">
        <span data-lang="de">ISO</span><span data-lang="fr">ISO</span>
        <input type="range" min="0" max="${ISOS.length - 1}" value="${BASELINE_ISO_IDX}" data-role="iso">
        <span class="chip chip--mono" data-role="iso-value"></span>
      </label>
    </div>
    <div class="belichtung__meters">
      <div class="belichtung__meter">
        <span data-lang="de">Tiefenschärfe</span><span data-lang="fr">Profondeur de champ</span>
        <div class="belichtung__meter-track"><div class="belichtung__meter-fill" data-role="meter-dof"></div></div>
      </div>
      <div class="belichtung__meter">
        <span data-lang="de">Bewegungsunschärfe</span><span data-lang="fr">Flou de mouvement</span>
        <div class="belichtung__meter-track"><div class="belichtung__meter-fill" data-role="meter-blur"></div></div>
      </div>
      <div class="belichtung__meter">
        <span data-lang="de">Bildrauschen</span><span data-lang="fr">Bruit numérique</span>
        <div class="belichtung__meter-track"><div class="belichtung__meter-fill" data-role="meter-noise"></div></div>
      </div>
    </div>
  `;

  const previewEl = root.querySelector('[data-role="preview"]');
  const noiseEl = root.querySelector('[data-role="noise"]');
  const blendeEl = root.querySelector('[data-role="blende"]');
  const verschlussEl = root.querySelector('[data-role="verschluss"]');
  const isoEl = root.querySelector('[data-role="iso"]');

  function update() {
    const bIdx = Number(blendeEl.value);
    const vIdx = Number(verschlussEl.value);
    const iIdx = Number(isoEl.value);
    const f = BLENDEN[bIdx];
    const t = VERSCHLUSS[vIdx].t;
    const iso = ISOS[iIdx];

    root.querySelector('[data-role="blende-value"]').textContent = 'f/' + f;
    root.querySelector('[data-role="verschluss-value"]').textContent = VERSCHLUSS[vIdx].label + ' s';
    root.querySelector('[data-role="iso-value"]').textContent = 'ISO ' + iso;

    const apertureStops = Math.log2((BLENDEN[BASELINE_BLENDE_IDX] / f) ** 2);
    const shutterStops = Math.log2(t / VERSCHLUSS[BASELINE_VERSCHLUSS_IDX].t);
    const isoStops = Math.log2(iso / ISOS[BASELINE_ISO_IDX]);
    const totalStops = apertureStops + shutterStops + isoStops;
    const brightness = clamp(2 ** totalStops, 0.15, 3);
    previewEl.style.filter = `brightness(${brightness})`;

    const dofPercent = clamp(((f - BLENDEN[0]) / (BLENDEN[BLENDEN.length - 1] - BLENDEN[0])) * 100, 4, 100);
    const blurPercent = clamp((Math.log2(t / VERSCHLUSS[0].t) / Math.log2(VERSCHLUSS[VERSCHLUSS.length - 1].t / VERSCHLUSS[0].t)) * 100, 4, 100);
    const noisePercent = clamp((Math.log2(iso / ISOS[0]) / Math.log2(ISOS[ISOS.length - 1] / ISOS[0])) * 100, 4, 100);
    root.querySelector('[data-role="meter-dof"]').style.width = dofPercent + '%';
    root.querySelector('[data-role="meter-blur"]').style.width = blurPercent + '%';
    root.querySelector('[data-role="meter-noise"]').style.width = noisePercent + '%';
    noiseEl.style.opacity = String(noisePercent / 140);
  }
  [blendeEl, verschlussEl, isoEl].forEach((el) => el.addEventListener('input', update));
  update();
}

function renderFramerate(root) {
  const FPS_OPTIONS = [
    { fps: 24, useDe: 'Kino-Look', useFr: 'Look cinéma' },
    { fps: 30, useDe: 'Web/Social Media', useFr: 'Web/réseaux sociaux' },
    { fps: 60, useDe: 'Sport, Bewegung', useFr: 'Sport, mouvement' },
    { fps: 120, useDe: 'Zeitlupen-Rohmaterial', useFr: 'Matière brute pour ralenti' },
  ];
  root.innerHTML = `
    <div class="chip-group" role="group" data-role="fps-buttons">
      ${FPS_OPTIONS.map((o, i) => `<button type="button" class="chip chip--filter${i === 1 ? ' is-active' : ''}" data-fps="${o.fps}">${o.fps} fps</button>`).join('')}
    </div>
    <div class="framerate__track"><div class="framerate__dot" data-role="dot"></div></div>
    <p class="framerate__use text-muted" data-role="use"></p>
  `;
  const trackEl = root.querySelector('.framerate__track');
  const dotEl = root.querySelector('[data-role="dot"]');
  const useEl = root.querySelector('[data-role="use"]');
  const buttons = root.querySelectorAll('[data-fps]');

  let rafId = null;
  let currentFps = 30;
  const durationMs = 1800;

  function loop(startTime, lastStepTime, timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const stepIntervalMs = 1000 / currentFps;
    if (timestamp - lastStepTime >= stepIntervalMs || lastStepTime === 0) {
      const progress = (elapsed % durationMs) / durationMs;
      const trackWidth = trackEl.clientWidth - dotEl.clientWidth;
      dotEl.style.transform = `translateX(${progress * trackWidth}px)`;
      lastStepTime = timestamp;
    }
    rafId = requestAnimationFrame((ts) => loop(startTime, lastStepTime, ts));
  }

  function start() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame((ts) => loop(ts, 0, ts));
  }

  function setFps(fps, useDe, useFr) {
    currentFps = fps;
    useEl.innerHTML = `<span data-lang="de">Typischer Einsatz: ${useDe}</span><span data-lang="fr">Usage typique : ${useFr}</span>`;
    buttons.forEach((b) => b.classList.toggle('is-active', Number(b.dataset.fps) === fps));
  }

  buttons.forEach((btn, i) => {
    btn.addEventListener('click', () => setFps(Number(btn.dataset.fps), FPS_OPTIONS[i].useDe, FPS_OPTIONS[i].useFr));
  });
  setFps(30, FPS_OPTIONS[1].useDe, FPS_OPTIONS[1].useFr);
  start();
}

export function mount(container) {
  if (!container) return;
  container.className = 'belichtung-framerate';
  container.innerHTML = `
    <div class="chip-group" role="tablist">
      <button type="button" class="chip chip--filter is-active" data-tab="belichtung" role="tab"><span data-lang="de">Belichtungsdreieck</span><span data-lang="fr">Triangle d'exposition</span></button>
      <button type="button" class="chip chip--filter" data-tab="framerate" role="tab"><span data-lang="de">Bildrate</span><span data-lang="fr">Fréquence d'image</span></button>
    </div>
    <div data-panel="belichtung"></div>
    <div data-panel="framerate" hidden></div>
  `;
  const belichtungPanel = container.querySelector('[data-panel="belichtung"]');
  const frameratePanel = container.querySelector('[data-panel="framerate"]');
  renderBelichtung(belichtungPanel);

  let framerateRendered = false;
  container.querySelectorAll('[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('[data-tab]').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const isBelichtung = btn.dataset.tab === 'belichtung';
      belichtungPanel.hidden = !isBelichtung;
      frameratePanel.hidden = isBelichtung;
      if (!isBelichtung && !framerateRendered) {
        renderFramerate(frameratePanel);
        framerateRendered = true;
      }
    });
  });
}
