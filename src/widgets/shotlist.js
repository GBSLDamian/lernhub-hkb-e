// Drehplan-Tool (Shot-List-Builder): Lernende planen echte Einstellungen für
// eine eigene Mini-Produktion. Alles läuft lokal, der Plan wird in
// localStorage gespeichert (Präfix lh_).
// config: { storageKey, groessen: [{id,de,fr}], perspektiven: [{id,de,fr}], minShots, minGroessen, minPerspektiven }
export function mount(container, config) {
  const {
    storageKey = 'lh_shotlist',
    groessen = [],
    perspektiven = [],
    minShots = 5,
    minGroessen = 3,
    minPerspektiven = 2,
  } = config || {};
  if (!container || !groessen.length || !perspektiven.length) return;

  let idCounter = 0;
  function loadShots() {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch { return []; }
  }
  function saveShots(shots) {
    try { localStorage.setItem(storageKey, JSON.stringify(shots)); } catch { /* ignore */ }
  }

  let shots = loadShots();
  if (shots.length === 0) {
    shots = [{ id: idCounter++, groesse: groessen[0].id, perspektive: perspektiven[0].id, beschreibung: '' }];
  } else {
    idCounter = Math.max(...shots.map((s) => s.id), -1) + 1;
  }

  container.className = 'shotlist';
  container.innerHTML = `
    <div class="shotlist__rows"></div>
    <div class="btn-row"><button type="button" class="btn-secondary" data-action="add">
      <span data-lang="de">+ Shot hinzufügen</span><span data-lang="fr">+ Ajouter un plan</span>
    </button></div>
    <div class="shotlist__stats"></div>
  `;
  const rowsEl = container.querySelector('.shotlist__rows');
  const statsEl = container.querySelector('.shotlist__stats');
  const addBtn = container.querySelector('[data-action="add"]');

  function optionList(list, selected) {
    return list.map((o) => `<option value="${o.id}" ${o.id === selected ? 'selected' : ''}>${o.de} / ${o.fr}</option>`).join('');
  }

  function render() {
    rowsEl.innerHTML = '';
    shots.forEach((shot, i) => {
      const row = document.createElement('div');
      row.className = 'shot-row';
      row.innerHTML = `
        <div class="shot-row__num">${i + 1}</div>
        <div class="shot-row__fields">
          <select data-field="groesse" aria-label="Einstellungsgrösse / cadrage">${optionList(groessen, shot.groesse)}</select>
          <select data-field="perspektive" aria-label="Perspektive / perspective">${optionList(perspektiven, shot.perspektive)}</select>
          <input type="text" data-field="beschreibung" placeholder="Was ist im Bild? / Que voit-on ?" value="${(shot.beschreibung || '').replace(/"/g, '&quot;')}">
        </div>
        <button type="button" class="shot-row__remove" aria-label="Entfernen / supprimer" ${shots.length <= 1 ? 'disabled' : ''}>✕</button>
      `;
      rowsEl.appendChild(row);
      row.querySelectorAll('[data-field]').forEach((el) => {
        el.addEventListener('input', () => { shot[el.dataset.field] = el.value; persist(); });
      });
      row.querySelector('.shot-row__remove').addEventListener('click', () => {
        shots = shots.filter((s) => s.id !== shot.id);
        persist();
        render();
      });
    });
    updateStats();
  }

  function updateStats() {
    const usedGroessen = new Set(shots.map((s) => s.groesse));
    const usedPerspektiven = new Set(shots.map((s) => s.perspektive));
    const beschrieben = shots.filter((s) => (s.beschreibung || '').trim().length > 2).length;
    const meets = shots.length >= minShots && usedGroessen.size >= minGroessen && usedPerspektiven.size >= minPerspektiven && beschrieben === shots.length;

    statsEl.innerHTML = `
      <div class="shot-stats__row">
        <span data-lang="de">${shots.length} Shots geplant</span><span data-lang="fr">${shots.length} plans prévus</span>
        <span data-lang="de">${usedGroessen.size} von ${groessen.length} Einstellungsgrössen</span><span data-lang="fr">${usedGroessen.size} sur ${groessen.length} cadrages</span>
        <span data-lang="de">${usedPerspektiven.size} von ${perspektiven.length} Perspektiven</span><span data-lang="fr">${usedPerspektiven.size} sur ${perspektiven.length} perspectives</span>
      </div>
      <div class="exercise-feedback is-visible ${meets ? 'is-correct' : 'is-neutral'}">
        <span data-lang="de">${meets ? 'Guter, abwechslungsreicher Drehplan – bereit zum Filmen!' : `Ziel: mind. ${minShots} Shots, ${minGroessen} Einstellungsgrössen, ${minPerspektiven} Perspektiven, jeder Shot beschrieben.`}</span>
        <span data-lang="fr">${meets ? 'Bon plan de tournage varié – prêt à filmer !' : `Objectif : min. ${minShots} plans, ${minGroessen} cadrages, ${minPerspektiven} perspectives, chaque plan décrit.`}</span>
      </div>
    `;
  }

  function persist() { saveShots(shots); updateStats(); }

  addBtn.addEventListener('click', () => {
    shots.push({ id: idCounter++, groesse: groessen[0].id, perspektive: perspektiven[0].id, beschreibung: '' });
    persist();
    render();
  });

  render();
}
