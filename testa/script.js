let audioCtx;
let analyser, dataArray, source;
let isListening = false;
let smoothLevel = 0;
const SMOOTHING = 0.2;
const THRESHOLD = 0.05;

const micStatus = document.getElementById('mic-status');

// Offset each sound body part to overlay its silence counterpart
const OFFSETS = {
  'cabeza':     { dx: -336, dy: 26 },
  'boca':       { dx: -335, dy: 31 },
  'ojo':        { dx: -335, dy: 46 },
  'brazo-izq':  { dx: -340, dy: 109 },
  'brazo-der':  { dx: -330, dy: 57 },
};

// Morphing pairs: { el, interpolator }
const morphPairs = [];

function offsetPathData(d, dx, dy) {
  let result = '';
  let i = 0;
  while (i < d.length) {
    const cmd = d[i];
    if (!cmd) break;
    let j = i + 1;
    while (j < d.length && !/[MLCQTASZmlcqtasz]/.test(d[j])) j++;
    const params = d.slice(i + 1, j).trim();
    if (cmd === cmd.toUpperCase() && cmd !== 'Z') {
      const shifted = params.replace(
        /([-+]?\d*\.?\d+)\s*[,]\s*([-+]?\d*\.?\d+)/g,
        (m, x, y) => `${(parseFloat(x) + (dx || 0)).toFixed(4)},${(parseFloat(y) + (dy || 0)).toFixed(4)}`
      );
      result += cmd + shifted;
    } else {
      result += cmd + params;
    }
    i = j;
  }
  return result;
}

function matchPathsByClass(fromPaths, toPaths) {
  // Group paths by class attribute
  const fromByClass = {};
  const toByClass = {};
  fromPaths.forEach(p => {
    const cls = p.getAttribute('class') || '';
    if (!fromByClass[cls]) fromByClass[cls] = [];
    fromByClass[cls].push(p);
  });
  toPaths.forEach(p => {
    const cls = p.getAttribute('class') || '';
    if (!toByClass[cls]) toByClass[cls] = [];
    toByClass[cls].push(p);
  });

  const pairs = [];
  Object.keys(fromByClass).forEach(cls => {
    if (!toByClass[cls]) return;
    const n = Math.min(fromByClass[cls].length, toByClass[cls].length);
    for (let i = 0; i < n; i++) {
      pairs.push({ from: fromByClass[cls][i], to: toByClass[cls][i] });
    }
  });
  return pairs;
}

function setupMorphing() {
  const bodyParts = [
    { from: 'cabeza-silencio',  to: 'cabeza-sonido',    offsetKey: 'cabeza' },
    { from: 'boca-silencio',    to: 'boca-sonido',      offsetKey: 'boca' },
    { from: 'ojo-silencio',     to: 'ojo-sonido',       offsetKey: 'ojo' },
    { from: 'brazo-izq-silencio', to: 'brazo-izq-sonido', offsetKey: 'brazo-izq' },
    { from: 'brazo-der-silencio', to: 'brazo-der-sonido', offsetKey: 'brazo-der' },
  ];

  let total = 0;
  let ok = 0;

  bodyParts.forEach(({ from, to, offsetKey }) => {
    const fromEl = document.getElementById(from);
    const toEl = document.getElementById(to);
    if (!fromEl || !toEl) return;

    const fromPaths = fromEl.querySelectorAll('path');
    const toPaths = toEl.querySelectorAll('path');
    const off = OFFSETS[offsetKey] || { dx: 0, dy: 0 };

    // Match paths by class instead of by index
    const pairs = matchPathsByClass(fromPaths, toPaths);

    pairs.forEach(({ from: fp, to: tp }) => {
      const d1 = fp.getAttribute('d');
      const d2 = tp.getAttribute('d');
      if (!d1 || !d2) return;
      const d2shifted = offsetPathData(d2, off.dx, off.dy);
      total++;
      try {
        const interp = flubber.interpolate(d1, d2shifted, { maxSegmentLength: 5 });
        morphPairs.push({ el: fp, interpolator: interp });
        ok++;
      } catch (e) {
        // keep silence path as-is
      }
    });

    toEl.style.display = 'none';
  });

  console.log(`flubber: ${ok}/${total} paths morphed`);
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

  // Morph paths in place — shapes change but position stays centered
  morphPairs.forEach(p => {
    p.el.setAttribute('d', p.interpolator(t));
  });
}

micStatus.addEventListener('click', () => {
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  startAudio();
});

setupMorphing();
