const exercises = [
  {
    id: 'patternexercice',
    title: 'Pattern exercice',
    description: 'editor de patrones vectoriales con curvas bezier y generación semiautomática',
    iframeSrc: './Patternexercice/dist/index.html',
    category: 'diseño',
  },
  {
    id: 'tipografia-cinetica',
    title: 'Tipografía cinética',
    description: 'animación tipográfica interactiva con gsap y partículas',
    iframeSrc: './tipografia%20cinetica/dist/index.html',
    category: 'animación',
  },
  {
    id: 'testa',
    title: 'Testa',
    description: 'personaje reactivo al sonido con web audio api y svg morphing',
    iframeSrc: './testa/index.html',
    category: 'interactivo',
  },
  {
    id: 'manionette',
    title: 'Manionette',
    description: 'visualizador 3d de mano con three.js y mediapipe',
    iframeSrc: './MANIONETTE/dist/index.html',
    category: '3d',
  },
];

const heroPatternUrl = '/patrones-bg.svg';

const cardTileSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 490" width="448" height="490">
  <polygon fill="#c2ff06" points="461.55 733.56 413.36 733.56 461.55 781.35 461.55 826.09 369.76 735.08 369.76 689.55 231.31 689.55 277.96 735.8 277.96 778.28 418.02 917.15 372.9 917.15 327.55 873.14 369.76 873.14 369.76 871.56 186.19 689.55 143.95 689.55 12.87 829.61 12.87 784.49 101.72 689.55 59.49 689.55 12.87 739.36 12.87 672.77 461.55 672.77 461.55 733.56" transform="translate(-12,-672)"/>
  <polygon fill="#ff00f3" points="98.83 873.14 186.17 779.82 186.17 734.69 56.59 873.14 98.83 873.14" transform="translate(-12,-672)"/>
  <polygon fill="#ff00f3" points="186.17 873.14 186.17 824.94 141.06 873.14 186.17 873.14" transform="translate(-12,-672)"/>
  <polygon fill="#0013ff" points="369.76 782.08 369.76 826.82 320.8 778.28 277.98 735.82 277.96 735.8 231.31 689.55 276.44 689.55 300.53 713.44 320.83 733.56 365.93 778.28 369.76 782.08" transform="translate(-12,-672)"/>
  <polygon fill="#0013ff" points="369.76 689.55 369.76 737.34 365.95 733.56 345.65 713.44 321.56 689.55 369.76 689.55" transform="translate(-12,-672)"/>
  <polygon fill="#0013ff" points="186.17 779.82 186.17 734.27 211.08 753.33 211.08 839.85 186.17 779.82" transform="translate(-12,-672)"/>
  <polygon fill="#ffffff" points="461.55 826.09 461.55 870.83 368.21 778.28 323.11 733.56 368.23 733.56 369.76 735.08 461.55 826.09" transform="translate(-12,-672)"/>
  <polygon fill="#ffffff" points="323.11 733.56 277.98 733.56 277.96 778.28 382.97 778.28 323.11 733.56" transform="translate(-12,-672)"/>
  <rect fill="#c2ff06" x="12.87" y="656.17" width="448.68" height="16.6" transform="translate(-12,-672)"/>
  <polygon fill="#0013ff" points="235.98 873.14 186.17 823.75 186.17 873.14 235.98 873.14" transform="translate(-12,-672)"/>
  <polygon fill="#0013ff" points="281.11 873.14 186.17 779.01 186.17 823.75 235.98 873.14 281.11 873.14" transform="translate(-12,-672)"/>
  <polygon fill="#ffffff" points="327.78 917.15 277.96 867.76 277.96 917.15 327.78 917.15" transform="translate(-12,-672)"/>
  <polygon fill="#ffffff" points="372.9 917.15 327.78 917.15 277.96 868.81 277.96 825.02 327.55 873.14 372.9 917.15" transform="translate(-12,-672)"/>
  <polygon fill="#ff00f3" points="186.17 734.69 277.96 825.02 277.96 868.81 186.17 779.01 186.17 734.69" transform="translate(-12,-672)"/>
  <rect fill="#ffffff" x="0" y="656.17" width="1463.01" height="16.6" transform="translate(-12,-672)"/>
</svg>`;

function cardTileCSS() {
  const encoded = encodeURIComponent(cardTileSVG);
  return {
    backgroundImage: `url("data:image/svg+xml,${encoded}")`,
    backgroundSize: '224px 245px',
    backgroundRepeat: 'repeat',
  };
}

function applyPatternBackground(element, options = {}) {
  const { backgroundSize = '224px 245px' } = options;
  const css = cardTileCSS();
  element.style.backgroundImage = css.backgroundImage;
  element.style.backgroundSize = backgroundSize;
  element.style.backgroundRepeat = css.backgroundRepeat;
}

const shapeDefs = [
  { points: '0,0 50,0 25,50', fill: '#c2ff06' },
  { points: '0,50 25,0 50,50', fill: '#ff00f3' },
  { points: '25,0 50,25 25,50 0,25', fill: '#ffffff' },
  { points: '0,0 50,25 0,50', fill: '#0013ff' },
  { points: '0,0 50,-25 100,0 50,25', fill: '#ff00f3' },
  { points: '0,0 35,35 70,0 35,-35', fill: '#ffffff' },
  { points: '0,0 50,0 25,40', fill: '#0013ff' },
  { points: '0,0 -25,35 25,35', fill: '#c2ff06' },
];

function initHeroPatterns() {
  const svg = document.getElementById('hero-patterns');
  if (!svg) return;

  const ns = 'http://www.w3.org/2000/svg';
  let mouse = { x: 0, y: 0 };
  let w = 1, h = 1;
  const particles = [];
  let svgHovered = false;
  let particlePointerTimeout = null;

  const connLine = document.createElementNS(ns, 'path');
  connLine.setAttribute('fill', 'none');
  connLine.setAttribute('stroke', '#ffffff');
  connLine.setAttribute('stroke-width', '0.5');
  svg.appendChild(connLine);

  function resize() {
    const rect = svg.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  }

  resize();
  window.addEventListener('resize', resize);

  const rows = 12;
  const cols = 20;
  const spacingX = Math.max(w / cols, 50);
  const spacingY = Math.max(h / rows, 50);
  const padX = spacingX * 0.25;
  const padY = spacingY * 0.25;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const def = shapeDefs[(r * cols + c) % shapeDefs.length];
      const poly = document.createElementNS(ns, 'polygon');
      poly.setAttribute('points', def.points);
      poly.setAttribute('fill', def.fill);
      poly.style.transformOrigin = 'center';
      poly.style.transition = 'opacity 0.15s';
      svg.appendChild(poly);

      particles.push({
        el: poly,
        baseX: -padX + c * spacingX + Math.random() * padX * 2,
        baseY: -padY + r * spacingY + Math.random() * padY * 2,
        px: 0, py: 0,
        phase: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.4,
        amp: 8 + Math.random() * 18,
        size: 1.2 + Math.random() * 1.8,
        hovered: false,
      });
    }
  }

  svg.style.pointerEvents = 'auto';
  svg.addEventListener('mouseenter', () => { svgHovered = true; });
  svg.addEventListener('mouseleave', () => { svgHovered = false; });

  particlePointerTimeout = null;
  svg.addEventListener('mousemove', (e) => {
    clearTimeout(particlePointerTimeout);
    const rect = svg.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    particles.forEach(p => {
      const dx = mx - p.baseX;
      const dy = my - p.baseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      p.hovered = dist < 80;
    });
    particlePointerTimeout = setTimeout(() => {
      particles.forEach(p => p.hovered = false);
    }, 300);
  });

  document.addEventListener('mousemove', (e) => {
    const rect = svg.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  function tick() {
    const now = Date.now() / 1000;
    const connectMax = 250;

    particles.forEach(p => {
      const dx = mouse.x - p.baseX;
      const dy = mouse.y - p.baseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const distMult = svgHovered ? 2.0 : 1.0;
      const repel = Math.max(0, 1 - dist / (300 * distMult));
      const repelX = dist > 1 ? -(dx / dist) * repel * 100 : 0;
      const repelY = dist > 1 ? -(dy / dist) * repel * 100 : 0;

      const hoverBoost = p.hovered ? 1.8 : 0;
      const driftX = Math.sin(now * p.speed + p.phase) * (p.amp + hoverBoost * 16);
      const driftY = Math.cos(now * p.speed * 0.7 + p.phase * 1.3) * (p.amp + hoverBoost * 16);

      const tx = driftX + repelX;
      const ty = driftY + repelY;
      const s = p.size * (1 + repel * 1.0) * (p.hovered ? 1.8 : 1);

      p.px = p.baseX + tx;
      p.py = p.baseY + ty;

      p.el.setAttribute('transform', `translate(${tx}, ${ty}) scale(${s})`);
      const baseOpacity = p.hovered ? 0.8 : 0.35;
      p.el.style.opacity = Math.min(1, baseOpacity + repel * 0.8);
    });

    let lines = '';
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.px - b.px;
        const dy = a.py - b.py;
        const d = Math.sqrt(dx * dx + dy * dy);
        const cMax = svgHovered ? 350 : connectMax;
        if (d < cMax) {
          const alpha = 1 - d / cMax;
          const lineW = alpha * (svgHovered ? 2.5 : 1.2);
          const lineO = alpha * (svgHovered ? 0.6 : 0.2);
          lines += `<line x1="${a.px}" y1="${a.py}" x2="${b.px}" y2="${b.py}" stroke="white" stroke-width="${lineW}" opacity="${lineO}" />`;
        }
      }
    }
    connLine.innerHTML = lines;

    requestAnimationFrame(tick);
  }

  tick();
}

// ── DOM refs ──
const grid = document.getElementById('exercise-grid');
const gridSection = document.getElementById('grid-section');
const viewerSection = document.getElementById('viewer-section');
const exerciseIframe = document.getElementById('exercise-iframe');
const backBtn = document.getElementById('back-btn');
// ── Render cards ──
function renderCards() {
  exercises.forEach(ex => {
    const card = document.createElement('div');
    card.className = 'card';
    const header = document.createElement('div');
    header.className = 'card-header pattern-card-header';
    applyPatternBackground(header, { backgroundSize: '160px 160px' });
    const body = document.createElement('div');
    body.className = 'card-body';
    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = ex.title;
    const desc = document.createElement('p');
    desc.className = 'card-desc';
    desc.textContent = ex.description;
    const btn = document.createElement('button');
    btn.className = 'card-btn';
    btn.textContent = 'abrir';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openExercise(ex);
    });
    card.addEventListener('click', () => openExercise(ex));
    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(btn);
    card.appendChild(header);
    card.appendChild(body);
    grid.appendChild(card);
  });
}
// ── Viewer logic ──
function openExercise(ex) {
  viewerSection.style.display = 'block';
  exerciseIframe.src = ex.iframeSrc;
  viewerSection.scrollIntoView({ behavior: 'smooth' });
}
backBtn.addEventListener('click', () => {
  viewerSection.style.display = 'none';
  exerciseIframe.src = '';
  gridSection.scrollIntoView({ behavior: 'smooth' });
});
// ── Nav switching ──
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const section = btn.dataset.section;
    if (section === 'home') {
      document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'exercises') {
      gridSection.scrollIntoView({ behavior: 'smooth' });
    }
    document.querySelector('.header-nav').classList.remove('open');
  });
});
// ── Hamburger menu ──
document.querySelector('.hamburger').addEventListener('click', () => {
  document.querySelector('.header-nav').classList.toggle('open');
});
// ── Search filter ──
document.querySelector('.search-input').addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  document.querySelectorAll('.card').forEach(card => {
    const title = card.querySelector('.card-title').textContent.toLowerCase();
    const desc = card.querySelector('.card-desc').textContent.toLowerCase();
    card.style.display = title.includes(term) || desc.includes(term) ? '' : 'none';
  });
});
// ── Custom cursor ──
const cursor = document.getElementById('custom-cursor');
document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});
document.addEventListener('mouseover', (e) => {
  const t = e.target.closest('a, button, input, .card, .nav-btn');
  cursor.classList.toggle('is-hovering', !!t);
});
// ── Init ──
renderCards();
initHeroPatterns();
