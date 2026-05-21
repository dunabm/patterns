import { HandTracker } from './HandTracker.js';
import { GestureEngine } from './GestureEngine.js';
import { WavePropagator } from './WavePropagator.js';
import { AlgaeRenderer } from './AlgaeRenderer.js';
import { NEON_PALETTE } from './constants.js';

const btn = document.getElementById('start-btn');

btn.addEventListener('click', async () => {
  btn.classList.add('hidden');

  if (!window.Hands) {
    document.body.innerHTML = '<p style="color:red;padding:2em">Error: MediaPipe Hands no se cargó. Revisa la consola.</p>';
    return;
  }

  const video = document.createElement('video');
  video.setAttribute('playsinline', '');
  video.style.display = 'none';
  document.body.appendChild(video);

  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;z-index:1';
  document.body.appendChild(container);

  const renderer = new AlgaeRenderer(container);
  const wave = new WavePropagator();
  const lastLines = new Map();
  const gestures = new Map();
  let prevIds = new Set();
  let frozen = false;
  let currentColor = NEON_PALETTE[0];

  function getGesture(id) {
    if (!gestures.has(id)) gestures.set(id, new GestureEngine());
    return gestures.get(id);
  }

  const tracker = new HandTracker((hands) => {
    const ids = new Set();
    const t = performance.now() / 1000;

    for (const hand of hands) {
      ids.add(hand.id);
      getGesture(hand.id).update(hand.landmarks);
    }

    if (ids.size > 0) {
      const allClosed = [...ids].every((id) => getGesture(id).isClosed());
      frozen = allClosed;
    }

    for (const hand of hands) {
      const openness = getGesture(hand.id).getOpenness();
      const lm = frozen ? null : hand.landmarks;
      const lines = wave.update(hand.id, lm, openness, t);
      lastLines.set(hand.id, lines);
      renderer.updateHand(hand.id, lines, true);
    }

    for (const id of prevIds) {
      if (!ids.has(id)) {
        const cached = lastLines.get(id);
        if (cached) renderer.updateHand(id, cached, false);
      }
    }

    prevIds = ids;
  });

  await tracker.start(video);

  function loop() {
    const t = performance.now() / 1000;
    const colorIdx = Math.floor(t / 2) % NEON_PALETTE.length;
    currentColor = NEON_PALETTE[colorIdx];
    renderer.setColor(currentColor);
    renderer.render();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
});
