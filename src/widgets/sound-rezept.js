// Sound-Rezept: für ein Szenario je eine Zutat aus drei Ebenen (Musik, SFX,
// Atmo) auswählen und eine begründete Einschätzung erhalten, ob die
// Kombination zur gewünschten Stimmung passt.
// config: { szenarien: [{id, textDe, textFr, ziel, zielLabelDe, zielLabelFr}],
//           musik/sfx/atmo: [{id, labelDe, labelFr, tags: [zielId,…]}] }
export function mount(container, config) {
  const { szenarien, musik, sfx, atmo } = config || {};
  if (!container || !szenarien?.length) return;
  const szenario = szenarien[Math.floor(Math.random() * szenarien.length)];

  function options(name, items) {
    return items
      .map(
        (o) => `<label class="sound-rezept__option">
          <input type="radio" name="${name}" value="${o.id}">
          <span data-lang="de">${o.labelDe}</span><span data-lang="fr">${o.labelFr}</span>
        </label>`
      )
      .join('');
  }

  container.className = 'sound-rezept';
  container.innerHTML = `
    <div class="konzept-box">
      <p class="konzept-box__label" data-lang="de">Dein Szenario</p>
      <p class="konzept-box__label" data-lang="fr">Ton scénario</p>
      <p data-lang="de">${szenario.textDe} Gesuchte Stimmung: <strong>${szenario.zielLabelDe}</strong>.</p>
      <p data-lang="fr">${szenario.textFr} Ambiance recherchée : <strong>${szenario.zielLabelFr}</strong>.</p>
    </div>
    <div class="sound-rezept__group">
      <h4>🎵 <span data-lang="de">Musik-Ebene</span><span data-lang="fr">Niveau musique</span></h4>
      ${options('musik', musik)}
    </div>
    <div class="sound-rezept__group">
      <h4>💥 <span data-lang="de">SFX-Ebene</span><span data-lang="fr">Niveau SFX</span></h4>
      ${options('sfx', sfx)}
    </div>
    <div class="sound-rezept__group">
      <h4>🌫️ <span data-lang="de">Atmo-Ebene</span><span data-lang="fr">Niveau ambiance</span></h4>
      ${options('atmo', atmo)}
    </div>
    <div class="btn-row"><button type="button" class="btn-primary" data-action="check">
      <span data-lang="de">Rezept auswerten</span><span data-lang="fr">Évaluer la recette</span>
    </button></div>
    <div class="exercise-feedback" data-role="feedback"></div>
  `;

  container.querySelector('[data-action="check"]').addEventListener('click', () => {
    const musikVal = container.querySelector('input[name="musik"]:checked');
    const sfxVal = container.querySelector('input[name="sfx"]:checked');
    const atmoVal = container.querySelector('input[name="atmo"]:checked');
    const feedback = container.querySelector('[data-role="feedback"]');

    if (!musikVal || !sfxVal || !atmoVal) {
      feedback.className = 'exercise-feedback is-visible is-incorrect';
      feedback.innerHTML = '<span data-lang="de">Wähle in allen drei Ebenen eine Zutat aus.</span><span data-lang="fr">Choisis un ingrédient dans les trois niveaux.</span>';
      return;
    }
    const m = musik.find((x) => x.id === musikVal.value);
    const s = sfx.find((x) => x.id === sfxVal.value);
    const a = atmo.find((x) => x.id === atmoVal.value);
    const matchCount = [m, s, a].filter((x) => x.tags.includes(szenario.ziel)).length;
    const ok = matchCount >= 2;
    feedback.className = 'exercise-feedback is-visible ' + (ok ? 'is-correct' : 'is-incorrect');
    feedback.innerHTML = `
      <span data-lang="de"><strong>${matchCount} von 3 Ebenen passen zu „${szenario.zielLabelDe}”.</strong><br>${ok ? 'Stimmige Kombination – die Ebenen arbeiten zusammen statt gegeneinander.' : 'Die Ebenen widersprechen sich teilweise. Probier eine andere Kombination.'}</span>
      <span data-lang="fr"><strong>${matchCount} niveaux sur 3 correspondent à « ${szenario.zielLabelFr} ».</strong><br>${ok ? 'Combinaison cohérente – les niveaux travaillent ensemble.' : 'Les niveaux se contredisent en partie. Essaie une autre combinaison.'}</span>
    `;
  });
}
