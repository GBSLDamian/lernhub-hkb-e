// Framing-Vergleich: zeigt denselben Bildausschnitt vs. das ganze Bild im
// Wechsel (Toggle), mit je einer anderen naheliegenden Interpretation —
// macht den Framing-Effekt (Bildauswahl steuert die Aussage) erlebbar statt
// nur beschrieben. Auflösung erscheint erst nach einem Klick.
// config: { images: [{ id, src, altDe, altFr, labelDe, labelFr, aussageDe, aussageFr }],
//           creditDe, creditFr, aufloesungDe, aufloesungFr }
export function mount(container, config) {
  const { images, creditDe, creditFr, aufloesungDe, aufloesungFr } = config || {};
  if (!container || !images?.length) return;

  container.className = 'framing-vergleich';
  container.innerHTML = `
    <div class="chip-group" role="group">
      ${images.map((img, i) => `<button type="button" class="chip chip--filter${i === 0 ? ' is-active' : ''}" data-idx="${i}"><span data-lang="de">${img.labelDe}</span><span data-lang="fr">${img.labelFr}</span></button>`).join('')}
    </div>
    <div class="framing-vergleich__frame">
      <img data-role="img" alt="">
    </div>
    <p class="framing-vergleich__aussage" data-role="aussage"></p>
    ${creditDe ? `<p class="text-muted framing-vergleich__credit"><span data-lang="de">${creditDe}</span><span data-lang="fr">${creditFr || creditDe}</span></p>` : ''}
    <button type="button" class="btn-secondary" data-role="aufloesen"><span data-lang="de">Auflösung anzeigen</span><span data-lang="fr">Afficher la réponse</span></button>
    <div class="exercise-feedback" data-role="aufloesung" hidden></div>
  `;

  const imgEl = container.querySelector('[data-role="img"]');
  const aussageEl = container.querySelector('[data-role="aussage"]');
  const buttons = container.querySelectorAll('.chip--filter');

  function show(idx) {
    const img = images[idx];
    imgEl.src = img.src;
    imgEl.alt = img.altDe || '';
    aussageEl.innerHTML = `<span data-lang="de"><strong>Wirkt wie:</strong> ${img.aussageDe}</span><span data-lang="fr"><strong>Donne l'impression de :</strong> ${img.aussageFr}</span>`;
    buttons.forEach((b) => b.classList.toggle('is-active', Number(b.dataset.idx) === idx));
  }
  show(0);

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => show(Number(btn.dataset.idx)));
  });

  const aufloesenBtn = container.querySelector('[data-role="aufloesen"]');
  const aufloesungEl = container.querySelector('[data-role="aufloesung"]');
  aufloesenBtn.addEventListener('click', () => {
    aufloesungEl.hidden = false;
    aufloesungEl.className = 'exercise-feedback is-visible is-neutral';
    aufloesungEl.innerHTML = `<span data-lang="de">${aufloesungDe}</span><span data-lang="fr">${aufloesungFr}</span>`;
    aufloesenBtn.hidden = true;
  });
}
