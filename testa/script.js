let audioCtx;
let analyser, dataArray, source;
let isListening = false;
let smoothLevel = 0;
const SMOOTHING = 0.2;
const THRESHOLD = 0.05;

const micStatus = document.getElementById('mic-status');

// Path morphing pairs: { el, interpolator }
const morphPairs = [];

function setupMorphing() {
  const bodyParts = [
    ['cabeza-silencio', 'cabeza-sonido'],
    ['boca-silencio', 'boca-sonido'],
    ['ojo-silencio', 'ojo-sonido'],
    ['brazo-izq-silencio', 'brazo-izq-sonido'],
    ['brazo-der-silencio', 'brazo-der-sonido'],
  ];

  let total = 0;
  let failed = 0;

  bodyParts.forEach(([fromId, toId]) => {
    const fromEl = document.getElementById(fromId);
    const toEl = document.getElementById(toId);
    if (!fromEl || !toEl) return;

    const fromPaths = fromEl.querySelectorAll('path');
    const toPaths = toEl.querySelectorAll('path');

    fromPaths.forEach((fromPath, i) => {
      const toPath = toPaths[i];
      if (!toPath) return;
      const d1 = fromPath.getAttribute('d');
      const d2 = toPath.getAttribute('d');
      if (!d1 || !d2) return;

      total++;
      try {
        const interpolator = flubber.interpolate(d1, d2, { maxSegmentLength: 5 });
        morphPairs.push({ el: fromPath, interpolator, fromClass: fromPath.getAttribute('class'), toClass: toPath.getAttribute('class') });
      } catch (e) {
        failed++;
      }
    });

    // Hide the sound group — silence paths will morph into sound shapes
    toEl.style.display = 'none';
  });

  console.log(`flubber: ${morphPairs.length}/${total} paths morphed${failed ? `, ${failed} failed` : ''}`);
}

async function startAudio() {
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    source = audioCtx.createMediaStreamSource(stream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    isListening = true;
    micStatus.textContent = 'Micrófono activo';
    micStatus.className = 'active';
    animate();
  } catch (err) {
    micStatus.textContent = 'Error: no se pudo acceder al micrófono';
    micStatus.className = 'error';
    console.error(err);
  }
}

function getAudioLevel() {
  analyser.getByteFrequencyData(dataArray);
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i];
  }
  return sum / dataArray.length / 256;
}

function animate() {
  if (!isListening) return;
  requestAnimationFrame(animate);

  let level = getAudioLevel();
  if (level < THRESHOLD) level = 0;

  smoothLevel += (level - smoothLevel) * SMOOTHING;
  const t = Math.min(smoothLevel * 4, 1);

  // Morph all paths toward sound position/shape
  morphPairs.forEach(pair => {
    pair.el.setAttribute('d', pair.interpolator(t));
  });
}

micStatus.addEventListener('click', () => {
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  startAudio();
});

// Init morphing immediately (script at end of body)
setupMorphing();
