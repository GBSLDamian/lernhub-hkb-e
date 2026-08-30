// Zuordnungsspiel: Einstellungsgrössen-Bild per Klick mit der passenden
// Wirkungsbeschreibung verbinden (memory-artig, gleiches Muster wie
// Format-Matcher, aber mit Bildkarten statt Textkarten).
// config: { items: [{ id, img, altDe, altFr, nameDe, nameFr, effektDe, effektFr }] }
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

  container.className = 'einstellung-matcher';
  container.innerHTML = `
    <div class="format-matcher__cols">
      <div class="format-matcher__col" data-role="images"></div>
      <div class="format-matcher__col" data-role="effekte"></div>
    </div>
    <div class="exercise-feedback" data-role="feedback"></div>
    <div class="exercise-summary" data-role="summary"></div>
  `;
  const imagesEl = container.querySelector('[data-role="images"]');
  const effekteEl = container.querySelector('[data-role="effekte"]');
  const feedbackEl = container.querySelector('[data-role="feedback"]');
  const summaryEl = container.querySelector('[data-role="summary"]');

  let selectedCard = null;
  let matchedCount = 0;

  function makeCard(html, id, targetEl, onClick) {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'memory-card';
    el.innerHTML = html;
    el.dataset.id = id;
    el.addEventListener('click', onClick);
    targetEl.appendChild(el);
    return el;
  }

  shuffle(items).forEach((it) => {
    makeCard(
      `<img class="einstellung-matcher__img" src="${it.img}" alt="">
       <span data-lang="de">${it.nameDe}</span><span data-lang="fr">${it.nameFr}</span>`,
      it.id,
      imagesEl,
      function () {
        if (this.classList.contains('is-matched')) return;
        imagesEl.querySelectorAll('.memory-card').forEach((c) => c.classList.remove('is-flipped'));
        this.classList.add('is-flipped');
        selectedCard = this;
      }
    );
  });

  shuffle(items).forEach((it) => {
    makeCard(
      `<span data-lang="de">${it.effektDe}</span><span data-lang="fr">${it.effektFr}</span>`,
      it.id,
      effekteEl,
      function () {
        if (this.classList.contains('is-matched') || !selectedCard) return;
        const correct = selectedCard.dataset.id === it.id;
        if (correct) {
          selectedCard.classList.add('is-matched');
          selectedCard.classList.remove('is-flipped');
          this.classList.add('is-matched');
          matchedCount++;
          feedbackEl.className = 'exercise-feedback is-visible is-correct';
          feedbackEl.innerHTML = `<span data-lang="de"><strong>Richtig kombiniert:</strong> ${it.nameDe} – ${it.effektDe}</span><span data-lang="fr"><strong>Bonne combinaison :</strong> ${it.nameFr} – ${it.effektFr}</span>`;
          selectedCard = null;
          if (matchedCount === items.length) {
            summaryEl.className = 'exercise-summary is-visible';
            summaryEl.innerHTML = `
              <span data-lang="de"><strong>Alle ${items.length} Einstellungsgrössen richtig zugeordnet!</strong></span>
              <span data-lang="fr"><strong>Les ${items.length} cadrages ont tous été associés correctement !</strong></span>
            `;
          }
        } else {
          feedbackEl.className = 'exercise-feedback is-visible is-incorrect';
          feedbackEl.innerHTML = '<span data-lang="de"><strong>Das passt noch nicht zusammen.</strong> Versuch es nochmals.</span><span data-lang="fr"><strong>Ça ne correspond pas encore.</strong> Réessaie.</span>';
          selectedCard.classList.remove('is-flipped');
          selectedCard = null;
        }
      }
    );
  });
}
