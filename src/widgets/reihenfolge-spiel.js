// Reihenfolge-Spiel: Karten per Auf/Ab-Buttons in die richtige Reihenfolge
// bringen (funktioniert ohne Maus, rein per Tastatur/Klick).
// config: { items: [{ id, textDe, textFr }], correctOrder: [id, id, …] }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function mount(container, config) {
  const { items, correctOrder } = config || {};
  if (!container || !items?.length || !correctOrder?.length) return;

  container.className = 'reihenfolge-spiel';
  container.innerHTML = `
    <ul class="sortlist"></ul>
    <div class="btn-row"><button type="button" class="btn-primary" data-action="check">
      <span data-lang="de">Auswerten</span><span data-lang="fr">Évaluer</span>
    </button></div>
    <div class="exercise-feedback" data-role="feedback"></div>
  `;
  const list = container.querySelector('.sortlist');
  const feedback = container.querySelector('[data-role="feedback"]');
  const checkBtn = container.querySelector('[data-action="check"]');

  let order = shuffle(items.map((i) => i.id));
  if (order.join(',') === correctOrder.join(',')) order.reverse();

  function render() {
    list.innerHTML = '';
    order.forEach((id, idx) => {
      const item = items.find((i) => i.id === id);
      const li = document.createElement('li');
      li.dataset.id = id;
      li.innerHTML = `
        <span class="sortlist__pos">${idx + 1}</span>
        <span class="sortlist__body"><span data-lang="de">${item.textDe}</span><span data-lang="fr">${item.textFr}</span></span>
        <span class="sortlist__moves">
          <button type="button" class="sortlist__move-btn" data-dir="up" aria-label="Nach oben / vers le haut">↑</button>
          <button type="button" class="sortlist__move-btn" data-dir="down" aria-label="Nach unten / vers le bas">↓</button>
        </span>
      `;
      list.appendChild(li);
      const upBtn = li.querySelector('[data-dir="up"]');
      const downBtn = li.querySelector('[data-dir="down"]');
      upBtn.disabled = idx === 0;
      downBtn.disabled = idx === order.length - 1;
      upBtn.addEventListener('click', () => move(idx, idx - 1));
      downBtn.addEventListener('click', () => move(idx, idx + 1));
    });
  }

  function move(from, to) {
    if (to < 0 || to >= order.length) return;
    [order[from], order[to]] = [order[to], order[from]];
    feedback.className = 'exercise-feedback';
    feedback.innerHTML = '';
    list.querySelectorAll('li').forEach((li) => li.classList.remove('is-correct', 'is-incorrect'));
    render();
  }

  render();

  checkBtn.addEventListener('click', () => {
    let correctCount = 0;
    [...list.children].forEach((li, idx) => {
      const isRight = order[idx] === correctOrder[idx];
      li.classList.toggle('is-correct', isRight);
      li.classList.toggle('is-incorrect', !isRight);
      if (isRight) correctCount++;
    });
    const allCorrect = correctCount === correctOrder.length;
    feedback.className = 'exercise-feedback is-visible ' + (allCorrect ? 'is-correct' : 'is-incorrect');
    feedback.innerHTML = `
      <span data-lang="de"><strong>${allCorrect ? 'Genau richtig!' : `${correctCount} von ${correctOrder.length} an der richtigen Position.`}</strong> ${allCorrect ? 'Das ist die passende Reihenfolge.' : 'Grün markierte Schritte stimmen schon, rote nicht – verschieb sie mit den Pfeilen.'}</span>
      <span data-lang="fr"><strong>${allCorrect ? 'Exactement !' : `${correctCount} sur ${correctOrder.length} à la bonne position.`}</strong> ${allCorrect ? "C'est le bon ordre." : "Les étapes en vert sont correctes, celles en rouge non – déplace-les avec les flèches."}</span>
    `;
  });
}
