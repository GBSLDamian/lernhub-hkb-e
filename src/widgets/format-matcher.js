// Zuordnungsspiel: Format-Karten mit ihren Merkmalskarten verbinden (Memory-
// artig, per Klick statt Drag&Drop).
// config: { items: [{ id, nameDe, nameFr, merkmalDe, merkmalFr, zweckDe, zweckFr }] }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function mount(container, config) {
  const items = config?.items;
  if (!container || !items?.length) return;

  container.className = 'format-matcher';
  container.innerHTML = `
    <div class="format-matcher__cols">
      <div class="format-matcher__col" data-role="cards"></div>
      <div class="format-matcher__col" data-role="rules"></div>
    </div>
    <div class="exercise-feedback" data-role="feedback"></div>
  `;
  const cardsEl = container.querySelector('[data-role="cards"]');
  const rulesEl = container.querySelector('[data-role="rules"]');
  const feedbackEl = container.querySelector('[data-role="feedback"]');

  let selectedCard = null;
  let matchedCount = 0;

  function makeCard(text, id, targetEl, onClick) {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'memory-card';
    el.innerHTML = text;
    el.dataset.id = id;
    el.addEventListener('click', onClick);
    targetEl.appendChild(el);
    return el;
  }

  shuffle(items).forEach((it) => {
    makeCard(`<span data-lang="de">${it.nameDe}</span><span data-lang="fr">${it.nameFr}</span>`, it.id, cardsEl, function () {
      if (this.classList.contains('is-matched')) return;
      cardsEl.querySelectorAll('.memory-card').forEach((c) => c.classList.remove('is-flipped'));
      this.classList.add('is-flipped');
      selectedCard = this;
    });
  });

  shuffle(items).forEach((it) => {
    makeCard(`<span data-lang="de">${it.merkmalDe}</span><span data-lang="fr">${it.merkmalFr}</span>`, it.id, rulesEl, function () {
      if (this.classList.contains('is-matched') || !selectedCard) return;
      const correct = selectedCard.dataset.id === it.id;
      if (correct) {
        selectedCard.classList.add('is-matched');
        selectedCard.classList.remove('is-flipped');
        this.classList.add('is-matched');
        matchedCount++;
        feedbackEl.className = 'exercise-feedback is-visible is-correct';
        feedbackEl.innerHTML = `<span data-lang="de"><strong>Richtig kombiniert:</strong> ${it.nameDe} – ${it.zweckDe}</span><span data-lang="fr"><strong>Bonne combinaison :</strong> ${it.nameFr} – ${it.zweckFr}</span>`;
        selectedCard = null;
      } else {
        feedbackEl.className = 'exercise-feedback is-visible is-incorrect';
        feedbackEl.innerHTML = '<span data-lang="de"><strong>Das passt noch nicht zusammen.</strong> Versuch es nochmals.</span><span data-lang="fr"><strong>Ça ne correspond pas encore.</strong> Réessaie.</span>';
        selectedCard.classList.remove('is-flipped');
        selectedCard = null;
      }
    });
  });
}
