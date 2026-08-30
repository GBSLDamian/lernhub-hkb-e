// «Fakt oder Fake?»: Karten-Spiel zur Quellenkritik. Zeigt eine Aussage,
// die Person entscheidet per grossem Fakt-/Fake-Button, sofortiges Feedback
// mit Begründung, danach die nächste Karte. Am Ende Score + Neustart.
// config: { items: [{ id, aussageDe, aussageFr, istFakt, begruendungDe, begruendungFr }] }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function mount(container, config) {
  const pool = config?.items;
  if (!container || !pool?.length) return;
  container.className = 'fakt-fake';
  startRound(container, pool);
}

function startRound(container, pool) {
  const order = shuffle(pool);
  renderCard(container, order, pool, 0, 0);
}

function renderCard(container, order, pool, index, score) {
  if (index >= order.length) {
    const percent = Math.round((score / order.length) * 100);
    container.innerHTML = `
      <div class="exercise-summary is-visible">
        <h2><span data-lang="de">${score} / ${order.length} richtig (${percent}%)</span><span data-lang="fr">${score} / ${order.length} correct(es) (${percent}%)</span></h2>
        <p><span data-lang="de">${percent >= 70 ? 'Starkes Gespür für Fake News!' : 'Übung macht den Meister – versuch es nochmal.'}</span><span data-lang="fr">${percent >= 70 ? 'Excellent flair pour les fake news !' : "C'est en forgeant qu'on devient forgeron – réessaie."}</span></p>
        <div class="btn-row"><button type="button" class="btn-secondary" data-action="retry"><span data-lang="de">Nochmal spielen</span><span data-lang="fr">Rejouer</span></button></div>
      </div>
    `;
    container.querySelector('[data-action="retry"]').addEventListener('click', () => startRound(container, pool));
    return;
  }

  const item = order[index];
  container.innerHTML = `
    <div class="chip chip--mono"><span data-lang="de">Aussage ${index + 1} von ${order.length}</span><span data-lang="fr">Affirmation ${index + 1} sur ${order.length}</span></div>
    <p class="fakt-fake__statement">
      <span data-lang="de">${item.aussageDe}</span><span data-lang="fr">${item.aussageFr}</span>
    </p>
    <div class="fakt-fake__buttons">
      <button type="button" class="fakt-fake__btn fakt-fake__btn--fakt" data-choice="1"><span data-lang="de">✓ Fakt</span><span data-lang="fr">✓ Vrai</span></button>
      <button type="button" class="fakt-fake__btn fakt-fake__btn--fake" data-choice="0"><span data-lang="de">✗ Fake</span><span data-lang="fr">✗ Faux</span></button>
    </div>
    <div class="exercise-feedback" data-role="feedback"></div>
  `;

  const feedbackEl = container.querySelector('[data-role="feedback"]');
  const buttons = container.querySelectorAll('.fakt-fake__btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => (b.disabled = true));
      const chosenFakt = btn.dataset.choice === '1';
      const correct = chosenFakt === !!item.istFakt;
      btn.classList.add(correct ? 'is-correct' : 'is-incorrect');
      feedbackEl.className = 'exercise-feedback is-visible ' + (correct ? 'is-correct' : 'is-incorrect');
      feedbackEl.innerHTML = `
        <span data-lang="de"><strong>${correct ? 'Richtig!' : 'Nicht ganz.'}</strong> Das ist ${item.istFakt ? 'ein Fakt' : 'Fake'}. ${item.begruendungDe}</span>
        <span data-lang="fr"><strong>${correct ? 'Correct !' : 'Pas tout à fait.'}</strong> C'est ${item.istFakt ? 'vrai' : 'faux'}. ${item.begruendungFr}</span>
        <div class="btn-row"><button type="button" class="btn-primary" data-action="next"><span data-lang="de">Weiter</span><span data-lang="fr">Suivant</span></button></div>
      `;
      feedbackEl.querySelector('[data-action="next"]').addEventListener('click', () => {
        renderCard(container, order, pool, index + 1, score + (correct ? 1 : 0));
      });
    });
  });
}
