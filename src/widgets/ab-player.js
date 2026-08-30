// Vorher/Nachher-Audio-Player: ein <audio>-Element, Umschalt-Buttons
// behalten die Abspielposition bei, damit derselbe Moment direkt verglichen
// werden kann. Play/Pause und Fortschritt sind normale <button>/<input
// type=range> und damit von Haus aus mit der Tastatur bedienbar.
// config: { before, after, beforeLabelDe, beforeLabelFr, afterLabelDe, afterLabelFr, captionDe, captionFr }
function formatTime(s) {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export function mount(container, config) {
  const { before, after, beforeLabelDe = 'Vorher', beforeLabelFr = 'Avant', afterLabelDe = 'Nachher', afterLabelFr = 'Après', captionDe = '', captionFr = '' } = config || {};
  if (!container || !before || !after) return;

  container.className = 'audio-player';
  container.innerHTML = `
    <div class="audio-player__row">
      <button type="button" class="audio-player__play" aria-label="Abspielen / lecture">▶</button>
      <div class="audio-player__toggle" role="group" aria-label="Vorher oder Nachher / avant ou après">
        <button type="button" data-which="before" class="is-active"><span data-lang="de">${beforeLabelDe}</span><span data-lang="fr">${beforeLabelFr}</span></button>
        <button type="button" data-which="after"><span data-lang="de">${afterLabelDe}</span><span data-lang="fr">${afterLabelFr}</span></button>
      </div>
    </div>
    <input type="range" class="audio-player__progress" value="0" min="0" max="100" step="0.1" aria-label="Abspielposition">
    <div class="audio-player__time">0:00 / 0:00</div>
    ${captionDe ? `<div class="audio-player__label"><span data-lang="de">${captionDe}</span><span data-lang="fr">${captionFr}</span></div>` : ''}
  `;

  const audio = new Audio();
  audio.preload = 'none';
  let current = 'before';
  let isPlaying = false;
  let userSeeking = false;

  const playBtn = container.querySelector('.audio-player__play');
  const toggleBtns = container.querySelectorAll('.audio-player__toggle button');
  const progress = container.querySelector('.audio-player__progress');
  const timeEl = container.querySelector('.audio-player__time');

  audio.src = before;

  function updateTime() {
    timeEl.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
  }
  audio.addEventListener('loadedmetadata', () => { progress.max = String(audio.duration || 0); updateTime(); });
  audio.addEventListener('timeupdate', () => { if (!userSeeking) progress.value = String(audio.currentTime); updateTime(); });
  audio.addEventListener('ended', () => { isPlaying = false; playBtn.textContent = '▶'; });

  playBtn.addEventListener('click', () => {
    if (isPlaying) { audio.pause(); isPlaying = false; playBtn.textContent = '▶'; }
    else { audio.play(); isPlaying = true; playBtn.textContent = '⏸'; }
  });

  toggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const which = btn.dataset.which;
      if (which === current) return;
      const wasPlaying = isPlaying;
      const t = audio.currentTime;
      current = which;
      audio.src = which === 'before' ? before : after;
      audio.currentTime = t;
      toggleBtns.forEach((b) => b.classList.toggle('is-active', b === btn));
      if (wasPlaying) audio.play();
    });
  });

  progress.addEventListener('input', () => { userSeeking = true; audio.currentTime = Number(progress.value); });
  progress.addEventListener('change', () => { userSeeking = false; });
}
