// Optionaler Wissens-Check: 4 zufällige Fragen aus einem Pool, sofortige
// Musterlösung, beliebig oft wiederholbar. Kein Zwang, kein Zertifikat.
// config: { fragen: [{ id, fragenDe, fragenFr, optionenDe: [], optionenFr: [], loesung, erklaerungDe, erklaerungFr }], anzahl }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function mount(container, config) {
  const pool = config?.fragen;
  const perAttempt = config?.anzahl || 4;
  if (!container || !pool?.length) return;
  container.className = 'quiz';
  startAttempt(container, pool, perAttempt);
}

function startAttempt(container, pool, perAttempt) {
  const questions = shuffle(pool).slice(0, Math.min(perAttempt, pool.length));
  renderQuiz(container, questions, pool, perAttempt);
}

function renderQuiz(container, questions, pool, perAttempt) {
  container.innerHTML = `
    <form novalidate>
      ${questions
        .map(
          (q, i) => `<div class="exercise-item" data-qid="${q.id}">
        <div class="chip chip--mono"><span data-lang="de">Frage ${i + 1} von ${questions.length}</span><span data-lang="fr">Question ${i + 1} sur ${questions.length}</span></div>
        <p><strong><span data-lang="de">${q.fragenDe}</span><span data-lang="fr">${q.fragenFr}</span></strong></p>
        <div class="quiz__options" role="radiogroup">
          ${q.optionenDe
            .map(
              (optDe, idx) => `<label class="quiz__option">
              <input type="radio" name="mc-${q.id}" value="${idx}" required>
              <span data-lang="de">${optDe}</span><span data-lang="fr">${q.optionenFr[idx]}</span>
            </label>`
            )
            .join('')}
        </div>
        <div class="exercise-feedback" data-role="feedback"></div>
      </div>`
        )
        .join('')}
      <div class="exercise-feedback is-incorrect quiz__error" hidden>
        <span data-lang="de">Bitte beantworte alle Fragen, bevor du auswertest.</span><span data-lang="fr">Merci de répondre à toutes les questions avant d'évaluer.</span>
      </div>
      <div class="btn-row"><button type="submit" class="btn-primary"><span data-lang="de">Auswerten</span><span data-lang="fr">Évaluer</span></button></div>
    </form>
    <div class="quiz__summary"></div>
  `;

  const form = container.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitQuiz(container, questions, form, pool, perAttempt);
  });
}

function submitQuiz(container, questions, form, pool, perAttempt) {
  const errorEl = container.querySelector('.quiz__error');
  const results = questions.map((q) => {
    const checked = form.querySelector(`input[name="mc-${q.id}"]:checked`);
    return { q, gewaehlt: checked ? Number(checked.value) : null };
  });
  if (results.some((r) => r.gewaehlt === null)) {
    errorEl.hidden = false;
    errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  errorEl.hidden = true;

  let score = 0;
  results.forEach(({ q, gewaehlt }) => {
    const correct = gewaehlt === q.loesung;
    if (correct) score++;
    const item = form.querySelector(`.exercise-item[data-qid="${q.id}"]`);
    const fb = item.querySelector('[data-role="feedback"]');
    fb.className = 'exercise-feedback is-visible ' + (correct ? 'is-correct' : 'is-incorrect');
    fb.innerHTML = `
      <span data-lang="de"><strong>${correct ? 'Richtig!' : 'Nicht ganz.'}</strong> Richtige Antwort: „${q.optionenDe[q.loesung]}”<br><span class="text-muted">${q.erklaerungDe}</span></span>
      <span data-lang="fr"><strong>${correct ? 'Correct !' : 'Pas tout à fait.'}</strong> Bonne réponse : « ${q.optionenFr[q.loesung]} »<br><span class="text-muted">${q.erklaerungFr}</span></span>
    `;
    item.querySelectorAll('input').forEach((el) => (el.disabled = true));
  });
  form.querySelector('button[type=submit]').disabled = true;

  const percent = Math.round((score / questions.length) * 100);
  const summaryEl = container.querySelector('.quiz__summary');
  summaryEl.innerHTML = `
    <div class="exercise-summary is-visible">
      <h2><span data-lang="de">${score} / ${questions.length} richtig (${percent}%)</span><span data-lang="fr">${score} / ${questions.length} correct(es) (${percent}%)</span></h2>
      <p><span data-lang="de">${percent >= 70 ? 'Starkes Ergebnis!' : 'Kein Problem – schau dir die Erklärungen oben nochmal an.'} Du kannst den Check beliebig oft wiederholen.</span><span data-lang="fr">${percent >= 70 ? 'Excellent résultat !' : 'Pas de souci – relis les explications ci-dessus.'} Tu peux refaire ce test autant de fois que tu veux.</span></p>
      <div class="btn-row"><button type="button" class="btn-secondary" data-action="retry"><span data-lang="de">Nochmal versuchen</span><span data-lang="fr">Réessayer</span></button></div>
    </div>
  `;
  summaryEl.querySelector('[data-action="retry"]').addEventListener('click', () => {
    startAttempt(container, pool, perAttempt);
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  summaryEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
