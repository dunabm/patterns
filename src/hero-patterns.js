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

export function initHeroPatterns() {
  const svg = document.getElementById('hero-patterns');
  if (!svg) return;

  const ns = 'http://www.w3.org/2000/svg';
  let mouse = { x: 0, y: 0 };
  let w = 1, h = 1;
  const particles = [];

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

  const rows = 8;
  const cols = 15;
  const spacingX = Math.max(w / cols, 50);
  const spacingY = Math.max(h / rows, 50);
  const padX = spacingX * 0.1;
  const padY = spacingY * 0.1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const def = shapeDefs[(r * cols + c) % shapeDefs.length];
      const poly = document.createElementNS(ns, 'polygon');
      poly.setAttribute('points', def.points);
      poly.setAttribute('fill', def.fill);
      poly.style.transformOrigin = 'center';
      svg.appendChild(poly);

      particles.push({
        el: poly,
        baseX: -padX + c * spacingX + Math.random() * padX * 2,
        baseY: -padY + r * spacingY + Math.random() * padY * 2,
        px: 0, py: 0,
        phase: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.4,
        amp: 4 + Math.random() * 10,
        size: 0.8 + Math.random() * 0.8,
      });
    }
  }

  document.addEventListener('mousemove', (e) => {
    const rect = svg.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  function tick() {
    const now = Date.now() / 1000;
    const connectMax = 200;

    particles.forEach(p => {
      const dx = mouse.x - p.baseX;
      const dy = mouse.y - p.baseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const repel = Math.max(0, 1 - dist / 250);
      const repelX = dist > 1 ? -(dx / dist) * repel * 60 : 0;
      const repelY = dist > 1 ? -(dy / dist) * repel * 60 : 0;

      const driftX = Math.sin(now * p.speed + p.phase) * p.amp;
      const driftY = Math.cos(now * p.speed * 0.7 + p.phase * 1.3) * p.amp;

      const tx = driftX + repelX;
      const ty = driftY + repelY;
      const s = p.size * (1 + repel * 0.6);

      p.px = p.baseX + tx;
      p.py = p.baseY + ty;

      p.el.setAttribute('transform', `translate(${tx}, ${ty}) scale(${s})`);
      p.el.style.opacity = Math.min(1, 0.3 + repel * 0.7 + 0.15);
    });

    let lines = '';
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.px - b.px;
        const dy = a.py - b.py;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < connectMax) {
          const alpha = 1 - d / connectMax;
          lines += `<line x1="${a.px}" y1="${a.py}" x2="${b.px}" y2="${b.py}" stroke="white" stroke-width="${alpha * 1.2}" opacity="${alpha * 0.2}" />`;
        }
      }
    }
    connLine.innerHTML = lines;

    requestAnimationFrame(tick);
  }

  tick();
}
