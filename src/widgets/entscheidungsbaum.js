// Entscheidungsbaum: Ja/Nein-Fragen führen Schritt für Schritt zu einer
// begründeten Einschätzung. Für Szenarien, die mit einem einzigen
// Auswahl-Schritt (siehe decision-widget.js) nicht abbildbar sind.
// config: { root: Node }
// Node = { qDe, qFr, yes: Node, no: Node } | { result: true, titleDe, titleFr, textDe, textFr }
export function mount(container, config) {
  const root = config?.root;
  if (!container || !root) return;
  container.className = 'entscheidungsbaum';
  render(container, root, root);
}

function render(container, node, root) {
  if (node.result) {
    container.innerHTML = `
      <div class="entscheidungsbaum__result">
        <p class="entscheidungsbaum__result-title"><span data-lang="de">${node.titleDe}</span><span data-lang="fr">${node.titleFr}</span></p>
        <p><span data-lang="de">${node.textDe}</span><span data-lang="fr">${node.textFr}</span></p>
        <button type="button" class="btn-secondary" data-action="restart">
          <span data-lang="de">Nochmal mit anderem Fall</span><span data-lang="fr">Recommencer avec un autre cas</span>
        </button>
      </div>
    `;
    container.querySelector('[data-action="restart"]').addEventListener('click', () => render(container, root, root));
    return;
  }
  container.innerHTML = `
    <div class="entscheidungsbaum__question">
      <p><strong><span data-lang="de">${node.qDe}</span><span data-lang="fr">${node.qFr}</span></strong></p>
      <div class="btn-row">
        <button type="button" class="btn-secondary" data-action="yes"><span data-lang="de">Ja</span><span data-lang="fr">Oui</span></button>
        <button type="button" class="btn-secondary" data-action="no"><span data-lang="de">Nein</span><span data-lang="fr">Non</span></button>
      </div>
    </div>
  `;
  container.querySelector('[data-action="yes"]').addEventListener('click', () => render(container, node.yes, root));
  container.querySelector('[data-action="no"]').addEventListener('click', () => render(container, node.no, root));
}
