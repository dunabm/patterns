import { exercises } from './exercises.js';
import { applyPatternBackground } from './patterns.js';
import { initHeroPatterns } from './hero-patterns.js';

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
