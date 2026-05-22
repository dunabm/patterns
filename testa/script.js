let audioCtx;
let analyser, dataArray, source;
let isListening = false;
let smoothLevel = 0;
const SMOOTHING = 0.08;
const THRESHOLD = 0.003;

const micStatus = document.getElementById('mic-status');

const morphPairs = [];
let silenceArmGroup, soundArmClone;
let mouthGroup;

function matchPathsByClass(fromPaths, toPaths) {
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
  const silenceSvg = document.getElementById('character-silence');
  const soundSvg = document.getElementById('character-sound');

  const bodyParts = [
    { from: 'cabeza_silencio',     to: 'cabeza_sonido' },
    { from: 'boca_silencio',       to: 'boca_sonido-2' },
    { from: 'ojo_silencio',        to: 'ojo_sonido' },
  ];

  let total = 0;
  let ok = 0;

  bodyParts.forEach(({ from, to }) => {
    const fromEl = silenceSvg.querySelector(`#${from}`);
    const toEl = soundSvg.querySelector(`#${to}`);
    if (!fromEl || !toEl) return;

    const fromPaths = fromEl.querySelectorAll('path');
    const toPaths = toEl.querySelectorAll('path');

    const pairs = matchPathsByClass(fromPaths, toPaths);

    pairs.forEach(({ from: fp, to: tp }) => {
      const d1 = fp.getAttribute('d');
      const d2 = tp.getAttribute('d');
      if (!d1 || !d2) return;
      total++;
      try {
        const interp = flubber.interpolate(d1, d2, { maxSegmentLength: 5 });
        morphPairs.push({ el: fp, interpolator: interp });
        ok++;
      } catch (e) {}
    });
  });

  console.log(`flubber: ${ok}/${total} paths morphed`);

  // Arm opacity crossfade: clone sound arms into silence SVG
  silenceArmGroup = silenceSvg.querySelector('#brazos_silencio');
  const soundArmG = soundSvg.querySelector('#brazos_sonido');
  if (soundArmG) {
    soundArmClone = soundArmG.cloneNode(true);
    soundArmClone.id = 'brazos-sound-clone';
    soundArmClone.style.opacity = '0';
    silenceSvg.querySelector('#brazos').appendChild(soundArmClone);
  }

  // Mouth group for vibration
  mouthGroup = silenceSvg.querySelector('#boca_silencio');
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
  analyser.getByteTimeDomainData(dataArray);
  let sum = 0;
  const len = dataArray.length;
  for (let i = 0; i < len; i++) {
    sum += Math.abs(dataArray[i] - 128);
  }
  return sum / len / 128;
}

function animate() {
  if (!isListening) return;
  requestAnimationFrame(animate);

  let level = getAudioLevel();
  if (level < THRESHOLD) level = 0;

  smoothLevel += (level - smoothLevel) * SMOOTHING;
  const t = Math.min(smoothLevel * 8, 1);

  morphPairs.forEach(p => {
    p.el.setAttribute('d', p.interpolator(t));
  });

  // Arm crossfade: silence fades out first, then sound fades in
  if (silenceArmGroup && soundArmClone) {
    const silenceOpacity = Math.max(0, 1 - t * 3);
    const soundOpacity = Math.max(0, Math.min(1, (t - 0.3) * 2));
    silenceArmGroup.style.opacity = silenceOpacity.toString();
    soundArmClone.style.opacity = soundOpacity.toString();
  }

  // Mouth vibration during sound
  if (t > 0.05) {
    const amp = t * 1.5;
    const vibX = (Math.random() - 0.5) * amp;
    const vibY = (Math.random() - 0.5) * amp;
    mouthGroup.setAttribute('transform', `translate(${vibX}, ${vibY})`);
  } else {
    mouthGroup.removeAttribute('transform');
  }
}

micStatus.addEventListener('click', () => {
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  startAudio();
});

setupMorphing();
