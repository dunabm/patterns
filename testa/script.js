let audioCtx;
let analyser, dataArray, source;
let isListening = false;
let smoothLevel = 0;
let frame = 0;
const SMOOTHING = 0.2;
const THRESHOLD = 0.05;
let idlePhase = 0;

const micStatus = document.getElementById('mic-status');

const cabezaSile = document.getElementById('cabeza-silencio');
const cabezaSoni = document.getElementById('cabeza-sonido');
const bocaSile = document.getElementById('boca-silencio');
const bocaSoni = document.getElementById('boca-sonido');
const ojoSile = document.getElementById('ojo-silencio');
const ojoSoni = document.getElementById('ojo-sonido');
const brazoIzqSile = document.getElementById('brazo-izq-silencio');
const brazoIzqSoni = document.getElementById('brazo-izq-sonido');
const brazoDerSile = document.getElementById('brazo-der-silencio');
const brazoDerSoni = document.getElementById('brazo-der-sonido');

// SVG transform offsets to overlay sound character on silence character
const TX = -336;
const BOCA_TY = 30;
const OJO_TY = 46;
const BRAZO_IZQ_TX = -340;
const BRAZO_IZQ_TY = 100;
const BRAZO_DER_TX = -330;
const BRAZO_DER_TY = 57;

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
  frame++;
  idlePhase = frame * 0.02;

  let level = getAudioLevel();
  if (level < THRESHOLD) level = 0;

  smoothLevel += (level - smoothLevel) * SMOOTHING;
  const t = Math.min(smoothLevel * 4, 1);

  // Crossfade opacity
  cabezaSile.style.opacity = String(1 - t);
  cabezaSoni.style.opacity = String(t);
  bocaSile.style.opacity = String(1 - t);
  bocaSoni.style.opacity = String(t);
  ojoSile.style.opacity = String(1 - t);
  ojoSoni.style.opacity = String(t);
  brazoIzqSile.style.opacity = String(1 - t);
  brazoIzqSoni.style.opacity = String(t);
  brazoDerSile.style.opacity = String(1 - t);
  brazoDerSoni.style.opacity = String(t);

  // Idle animation for silence parts (gentle breathing)
  const idleBreath = Math.sin(idlePhase) * 0.02;
  cabezaSile.setAttribute('transform', `translate(0, ${idleBreath})`);
  bocaSile.setAttribute('transform', `translate(0, ${idleBreath})`);
  ojoSile.setAttribute('transform', `translate(0, ${idleBreath})`);

  // Sound-reactive animations
  const scaleY = 0.3 + t * 0.7;
  const shake = t > 0.6 ? Math.sin(frame * 0.8) * (t - 0.6) * 6 : 0;
  bocaSoni.setAttribute('transform', `translate(${TX}, ${BOCA_TY}) scale(1, ${scaleY}) rotate(${shake})`);

  const eyeScale = 0.2 + t * 1.3;
  ojoSoni.setAttribute('transform', `translate(${TX}, ${OJO_TY}) scale(1, ${eyeScale})`);

  const angle = t * 45;
  brazoIzqSoni.setAttribute('transform', `translate(${BRAZO_IZQ_TX}, ${BRAZO_IZQ_TY}) rotate(${angle}, 570, 31)`);
  brazoDerSoni.setAttribute('transform', `translate(${BRAZO_DER_TX}, ${BRAZO_DER_TY}) rotate(${angle}, 339, 123)`);
}

micStatus.addEventListener('click', () => {
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  startAudio();
});
