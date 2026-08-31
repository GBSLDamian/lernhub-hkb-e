// Schlagzeilen-Quiz: reale, faktengeprüfte Schlagzeilen einschätzen
// («Seriös» oder «Falsch/irreführend»), danach Auflösung mit Begründung UND
// einem Link zur Faktencheck-Quelle — Belege sind Teil der Auflösung, nicht
// optional.
// config: { items: [{ id, schlagzeileDe, schlagzeileFr, istSerioes,
//           begruendungDe, begruendungFr, quelleName, quelleUrl }] }
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
  container.className = 'schlagzeilen-quiz';
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
        <div class="btn-row"><button type="button" class="btn-secondary" data-action="retry"><span data-lang="de">Nochmal spielen</span><span data-lang="fr">Rejouer</span></button></div>
      </div>
    `;
    container.querySelector('[data-action="retry"]').addEventListener('click', () => startRound(container, pool));
    return;
  }

  const item = order[index];
  container.innerHTML = `
    <div class="chip chip--mono"><span data-lang="de">Schlagzeile ${index + 1} von ${order.length}</span><span data-lang="fr">Titre ${index + 1} sur ${order.length}</span></div>
    <p class="schlagzeilen-quiz__headline">
      «<span data-lang="de">${item.schlagzeileDe}</span><span data-lang="fr">${item.schlagzeileFr}</span>»
    </p>
    <div class="fakt-fake__buttons">
      <button type="button" class="fakt-fake__btn fakt-fake__btn--fakt" data-choice="1"><span data-lang="de">✓ Seriös</span><span data-lang="fr">✓ Sérieux</span></button>
      <button type="button" class="fakt-fake__btn fakt-fake__btn--fake" data-choice="0"><span data-lang="de">✗ Falsch/irreführend</span><span data-lang="fr">✗ Faux/trompeur</span></button>
    </div>
    <div class="exercise-feedback" data-role="feedback"></div>
  `;

  const feedbackEl = container.querySelector('[data-role="feedback"]');
  const buttons = container.querySelectorAll('.fakt-fake__btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => (b.disabled = true));
      const chosenSerioes = btn.dataset.choice === '1';
      const correct = chosenSerioes === !!item.istSerioes;
      btn.classList.add(correct ? 'is-correct' : 'is-incorrect');
      feedbackEl.className = 'exercise-feedback is-visible ' + (correct ? 'is-correct' : 'is-incorrect');
      feedbackEl.innerHTML = `
        <span data-lang="de"><strong>${correct ? 'Richtig!' : 'Nicht ganz.'}</strong> Diese Schlagzeile ist ${item.istSerioes ? 'seriös/korrekt' : 'falsch/irreführend'}. ${item.begruendungDe}</span>
        <span data-lang="fr"><strong>${correct ? 'Correct !' : 'Pas tout à fait.'}</strong> Ce titre est ${item.istSerioes ? 'sérieux/correct' : 'faux/trompeur'}. ${item.begruendungFr}</span>
        <p class="schlagzeilen-quiz__quelle"><span data-lang="de">Quelle: </span><span data-lang="fr">Source : </span><a href="${item.quelleUrl}" target="_blank" rel="noopener noreferrer">${item.quelleName}</a></p>
        <div class="btn-row"><button type="button" class="btn-primary" data-action="next"><span data-lang="de">Weiter</span><span data-lang="fr">Suivant</span></button></div>
      `;
      feedbackEl.querySelector('[data-action="next"]').addEventListener('click', () => {
        renderCard(container, order, pool, index + 1, score + (correct ? 1 : 0));
      });
    });
  });
}
