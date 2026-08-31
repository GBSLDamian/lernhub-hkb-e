// Datenspur-Demo: zeigt live, welche Angaben ein Browser bei einer x-beliebigen
// Websuche ohnehin preisgibt — rein clientseitig, nichts wird gesendet oder
// gespeichert. Trennt bewusst "das sieht jede Website/jeder Tracker direkt"
// von "das sieht zusätzlich nur der empfangende Server" (IP, exakte Anfrage,
// Zeitstempel) — Letzteres ist aus JS heraus nicht auslesbar und wird nur
// erklärt, nicht simuliert.
async function canvasFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 220;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px "Arial"';
    ctx.fillStyle = '#f60';
    ctx.fillRect(0, 0, 60, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('LernHub 🔍 äöü', 2, 2);
    const dataUrl = canvas.toDataURL();
    if (window.crypto?.subtle) {
      const bytes = new TextEncoder().encode(dataUrl);
      const digest = await crypto.subtle.digest('SHA-256', bytes);
      return [...new Uint8Array(digest)].slice(0, 8).map((b) => b.toString(16).padStart(2, '0')).join('');
    }
    let hash = 0;
    for (let i = 0; i < dataUrl.length; i++) {
      hash = (hash * 31 + dataUrl.charCodeAt(i)) >>> 0;
    }
    return hash.toString(16);
  } catch {
    return null;
  }
}

function row(labelDe, labelFr, value) {
  return `<div class="datenspur-demo__row">
    <span class="datenspur-demo__label"><span data-lang="de">${labelDe}</span><span data-lang="fr">${labelFr}</span></span>
    <span class="datenspur-demo__value">${value}</span>
  </div>`;
}

function naDe() { return 'in diesem Browser nicht auslesbar'; }
function naFr() { return 'non accessible dans ce navigateur'; }

export function mount(container) {
  if (!container) return;
  container.className = 'datenspur-demo';
  container.innerHTML = `
    <p class="datenspur-demo__privacy-note">
      <span data-lang="de">🔒 Diese Demo bleibt komplett auf deinem Gerät — es wird nichts gesendet oder gespeichert.</span>
      <span data-lang="fr">🔒 Cette démo reste entièrement sur ton appareil — rien n'est envoyé ni enregistré.</span>
    </p>
    <form class="datenspur-demo__form">
      <label class="datenspur-demo__field">
        <span data-lang="de">Suchbegriff</span><span data-lang="fr">Terme de recherche</span>
        <input type="text" name="query" placeholder="z. B. eine gesundheitliche Frage" data-lang="de">
        <input type="text" name="query-fr" placeholder="p. ex. une question de santé" data-lang="fr">
      </label>
      <button type="submit" class="btn-primary"><span data-lang="de">Suchen</span><span data-lang="fr">Rechercher</span></button>
    </form>
    <div class="datenspur-demo__result" data-role="result" hidden></div>
  `;

  const form = container.querySelector('form');
  const inputDe = form.querySelector('input[name="query"]');
  const inputFr = form.querySelector('input[name="query-fr"]');
  const resultEl = container.querySelector('[data-role="result"]');

  // Keep both language inputs in sync so a submit always has a value
  // regardless of which one is visible.
  inputDe.addEventListener('input', () => { inputFr.value = inputDe.value; });
  inputFr.addEventListener('input', () => { inputDe.value = inputFr.value; });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = (document.documentElement.dataset.lang === 'fr' ? inputFr.value : inputDe.value).trim() || '—';
    const now = new Date();
    const fingerprint = await canvasFingerprint();

    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const dnt = navigator.doNotTrack === '1' || window.doNotTrack === '1' ? { de: 'Aktiviert', fr: 'Activé' }
      : navigator.doNotTrack === '0' ? { de: 'Deaktiviert', fr: 'Désactivé' }
      : { de: 'Nicht gesetzt', fr: 'Non défini' };

    resultEl.hidden = false;
    resultEl.innerHTML = `
      <h4><span data-lang="de">Das sieht diese Seite (und jeder Tracker) direkt in deinem Browser:</span><span data-lang="fr">Voici ce que cette page (et tout traqueur) voit directement dans ton navigateur :</span></h4>
      <div class="datenspur-demo__rows">
        ${row('Suchbegriff', 'Terme de recherche', query)}
        ${row('Browser/Betriebssystem', 'Navigateur/système', navigator.userAgent)}
        ${row('Sprache(n)', 'Langue(s)', (navigator.languages || [navigator.language]).join(', '))}
        ${row('Bildschirmgrösse', "Taille de l'écran", `${screen.width}×${screen.height}px`)}
        ${row('Fenstergrösse', 'Taille de la fenêtre', `${window.innerWidth}×${window.innerHeight}px`)}
        ${row('Zeitzone', 'Fuseau horaire', Intl.DateTimeFormat().resolvedOptions().timeZone)}
        ${row('Datum/Uhrzeit', 'Date/heure', now.toLocaleString())}
        ${row('Farbtiefe', 'Profondeur de couleur', `${screen.colorDepth} Bit`)}
        ${row('CPU-Kerne', 'Cœurs CPU', navigator.hardwareConcurrency ?? naDe())}
        ${row('Gerätespeicher', "Mémoire de l'appareil", navigator.deviceMemory ? navigator.deviceMemory + ' GB (ungefähr)' : naDe())}
        ${row('Verbindungstyp', 'Type de connexion', conn?.effectiveType || naDe())}
        ${row('Do-Not-Track', 'Do-Not-Track', dnt.de)}
        ${row('Cookies aktiviert', 'Cookies activés', navigator.cookieEnabled ? 'Ja / Oui' : 'Nein / Non')}
        ${row('Referrer', 'Référent', document.referrer || '(leer – direkt aufgerufen)')}
        ${row('Canvas-Fingerprint-Hash', 'Empreinte canvas (hash)', fingerprint ? `<code>${fingerprint}</code>` : naDe())}
      </div>

      <h4><span data-lang="de">Zusätzlich sieht nur der Server, der die Anfrage empfängt:</span><span data-lang="fr">En plus, seul le serveur qui reçoit la requête voit :</span></h4>
      <div class="datenspur-demo__rows">
        ${row('IP-Adresse (ungefährer Standort)', 'Adresse IP (localisation approximative)', '<em>' + 'wird von JavaScript nicht preisgegeben — jeder Server sieht sie trotzdem automatisch bei jeder Anfrage' + '</em>')}
        ${row('Exakte Suchanfrage', 'Requête exacte', query)}
        ${row('Zeitstempel', 'Horodatage', now.toLocaleString())}
      </div>

      <p class="datenspur-demo__conclusion">
        <span data-lang="de">Eine datenschutzorientierte Suchmaschine entfernt IP-Adresse und Tracking-Cookies, bevor sie deine Anfrage weiterleitet oder speichert. Der <strong>Canvas-Fingerprint</strong> und die anderen Browser-Angaben oben entstehen aber direkt in deinem Browser — sie fallen unabhängig davon an, welche Suchmaschine du nutzt.</span>
        <span data-lang="fr">Un moteur de recherche axé protection des données supprime l'adresse IP et les cookies de suivi avant de transmettre ou d'enregistrer ta requête. Mais l'<strong>empreinte canvas</strong> et les autres informations du navigateur ci-dessus apparaissent directement dans ton navigateur — elles existent indépendamment du moteur de recherche utilisé.</span>
      </p>
    `;
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}
