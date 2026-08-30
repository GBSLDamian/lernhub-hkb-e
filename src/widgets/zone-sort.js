// Zuordnungs-Spiel (Drag&Drop in Zonen). Funktioniert per Pointer (Maus +
// Touch) UND per Klick-Buttons an jeder Karte (barrierefrei, keine Maus nötig).
// config: { items: [{ id, textDe, textFr, zone, explainDe, explainFr }],
//           zones: [{ id, labelDe, labelFr, shortDe?, shortFr? }], cols }
function makeDraggable(cardEl, onDrop) {
  cardEl.addEventListener('pointerdown', (e) => {
    if (cardEl.dataset.locked === 'true') return;
    if (e.target.closest('.dnd-card__btn')) return;
    e.preventDefault();
    const startX = e.clientX, startY = e.clientY;
    const rect = cardEl.getBoundingClientRect();
    const clone = cardEl.cloneNode(true);
    Object.assign(clone.style, {
      position: 'fixed', left: rect.left + 'px', top: rect.top + 'px', width: rect.width + 'px',
      zIndex: '999', pointerEvents: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
    });
    document.body.appendChild(clone);
    cardEl.classList.add('is-dragging');

    function clearZones() {
      document.querySelectorAll('.dnd-zone').forEach((z) => z.classList.remove('is-dragover'));
    }
    function onMove(ev) {
      clone.style.transform = `translate(${ev.clientX - startX}px, ${ev.clientY - startY}px)`;
      clearZones();
      const zone = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('.dnd-zone');
      if (zone) zone.classList.add('is-dragover');
    }
    function onUp(ev) {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      clone.remove();
      cardEl.classList.remove('is-dragging');
      clearZones();
      const zone = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('.dnd-zone');
      if (zone) onDrop(zone.dataset.zone);
    }
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp, { once: true });
  });
}

export function mount(container, config) {
  const { items, zones, cols } = config || {};
  if (!container || !items?.length || !zones?.length) return;

  container.className = 'zone-sort';
  container.innerHTML = `
    <div class="dnd-zones" style="--dnd-cols: ${cols || zones.length}"></div>
    <div class="dnd-pool"></div>
    <div class="exercise-feedback" data-role="feedback"></div>
    <div class="exercise-summary" data-role="summary"></div>
  `;
  const zonesEl = container.querySelector('.dnd-zones');
  const poolEl = container.querySelector('.dnd-pool');
  const feedbackEl = container.querySelector('[data-role="feedback"]');
  const summaryEl = container.querySelector('[data-role="summary"]');

  zonesEl.innerHTML = zones
    .map((z) => `<div class="dnd-zone" data-zone="${z.id}">
      <div class="dnd-zone__title"><span data-lang="de">${z.labelDe}</span><span data-lang="fr">${z.labelFr}</span></div>
      <div class="dnd-zone__items"></div>
    </div>`)
    .join('');

  let placedCount = 0;
  let correctCount = 0;

  items.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'dnd-card';
    card.dataset.locked = 'false';
    card.innerHTML = `
      <span><span data-lang="de">${item.textDe}</span><span data-lang="fr">${item.textFr}</span></span>
      <span class="dnd-card__buttons">
        ${zones.map((z) => `<button type="button" class="dnd-card__btn" data-zone="${z.id}"><span data-lang="de">${z.shortDe || z.labelDe}</span><span data-lang="fr">${z.shortFr || z.labelFr}</span></button>`).join('')}
      </span>
    `;
    poolEl.appendChild(card);

    function place(chosenZone) {
      if (card.dataset.locked === 'true') return;
      card.dataset.locked = 'true';
      const correct = chosenZone === item.zone;
      if (correct) correctCount++;
      placedCount++;

      const targetZone = zonesEl.querySelector(`.dnd-zone[data-zone="${chosenZone}"] .dnd-zone__items`);
      card.classList.remove('is-dragging');
      card.style.transform = '';
      card.classList.add(correct ? 'is-correct' : 'is-incorrect');
      card.querySelectorAll('button').forEach((b) => (b.disabled = true));
      if (targetZone) targetZone.appendChild(card);

      const zoneLabel = zones.find((z) => z.id === item.zone);
      feedbackEl.className = 'exercise-feedback is-visible ' + (correct ? 'is-correct' : 'is-incorrect');
      feedbackEl.innerHTML = `
        <span data-lang="de"><strong>${correct ? 'Richtig!' : 'Nicht ganz.'}</strong> Richtig wäre „${zoneLabel?.labelDe}”. ${item.explainDe || ''}</span>
        <span data-lang="fr"><strong>${correct ? 'Correct !' : 'Pas tout à fait.'}</strong> La bonne réponse était « ${zoneLabel?.labelFr} ». ${item.explainFr || ''}</span>
      `;

      if (placedCount === items.length) {
        const percent = Math.round((correctCount / items.length) * 100);
        summaryEl.className = 'exercise-summary is-visible';
        summaryEl.innerHTML = `
          <span data-lang="de"><strong>${correctCount} von ${items.length} richtig (${percent}%).</strong></span>
          <span data-lang="fr"><strong>${correctCount} sur ${items.length} correct(es) (${percent}%).</strong></span>
        `;
      }
    }

    card.querySelectorAll('.dnd-card__btn').forEach((btn) => {
      btn.addEventListener('click', (e) => { e.stopPropagation(); place(btn.dataset.zone); });
    });
    makeDraggable(card, place);
  });
}
