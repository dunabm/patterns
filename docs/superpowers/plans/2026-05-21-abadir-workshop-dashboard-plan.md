# Abadir Workshop Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page dashboard at the repo root to showcase 4 existing exercises (PatternExercice, Tipografia Cinetica, Testa, MANIONETTE) embedded via iframes with a bold brutalist visual style.

**Architecture:** Vanilla HTML/CSS/JS served by Vite 6. No frameworks. CSS Grid layout. CSS animations for pattern drift. JS handles section swapping (grid ↔ viewer). Each exercise is pre-built and referenced by its dist/ folder.

**Tech Stack:** Vite 6 (vanilla JS template), CSS Grid, CSS `@keyframes`, vanilla JS DOM manipulation

---

### Task 1: Scaffold Dashboard Project

**Files:**
- Create: `index.html`
- Create: `package.json`
- Create: `vite.config.js`
- Create: `src/main.js`
- Create: `src/style.css`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "abadir-workshop-dashboard",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^6.0.0"
  }
}
```

- [ ] **Step 2: Create `vite.config.js`**

```js
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
  },
});
```

- [ ] **Step 3: Create `src/main.js`** (placeholder)

```js
console.log('Abadir Workshop Dashboard loaded');
```

- [ ] **Step 4: Create `src/style.css`** (placeholder)

```css
* { margin: 0; padding: 0; box-sizing: border-box; }
```

- [ ] **Step 5: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Duna Blázquez — Abadir Workshop</title>
  <link rel="stylesheet" href="/src/style.css" />
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

- [ ] **Step 6: Install deps and verify dev server starts**

Run: `npm install`
Run: `npm run dev` (verify it starts, then stop with Ctrl+C)

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vite.config.js index.html src/main.js src/style.css
git commit -m "feat: scaffold dashboard project with Vite"
```

---

### Task 2: Add Boldense Regular Font

**Files:**
- Create: `public/fonts/Boldense-Regular.woff2`
- Modify: `src/style.css`

- [ ] **Step 1: Download Boldense Regular font**

The font is referenced as `Boldonse-Regular` in the SVGs. Search for the Boldense font file or use an alternative. If no local file exists, check if the user has the font file somewhere on their system.

Run: `find /Users/dunablazquezmerchan -name "*Boldense*" -o -name "*Boldonse*" 2>/dev/null`

If font file is found, copy it to `public/fonts/Boldense-Regular.woff2`. If not found, use a Google Fonts alternative like Anton (similar heavy display font) and note the substitution.

- [ ] **Step 2: Add `@font-face` to `style.css`**

```css
@font-face {
  font-family: 'Boldense Regular';
  src: url('/fonts/Boldense-Regular.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

- [ ] **Step 3: Commit**

```bash
git add public/fonts/Boldense-Regular.woff2 src/style.css
git commit -m "feat: add Boldense Regular font face"
```

---

### Task 3: Extract SVG Patterns from patrones.svg

**Files:**
- Create: `src/patterns.js`
- Modify: `src/style.css`

- [ ] **Step 1: Read `public/patrones.svg`** and extract the triangle polygon coordinates from the `<g id="patrones">` section

The patterns consist of multiple overlapping `<polygon>` elements with classes `cls-2` (white), `cls-3` (magenta `#ff00f3`), `cls-4` (lime `#c2ff06`), and `cls-7` (blue `#0013ff`).

Create an SVG sprite string in `src/patterns.js`:

```js
export const patternSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1463 1463" width="1463" height="1463">
  <polygon fill="#c2ff06" points="461.55 733.56 413.36 733.56 461.55 781.35 461.55 826.09 369.76 735.08 369.76 689.55 231.31 689.55 277.96 735.8 277.96 778.28 418.02 917.15 372.9 917.15 327.55 873.14 369.76 873.14 369.76 871.56 186.19 689.55 143.95 689.55 12.87 829.61 12.87 784.49 101.72 689.55 59.49 689.55 12.87 739.36 12.87 672.77 461.55 672.77 461.55 733.56"/>
  <polygon fill="#c2ff06" points="101.72 689.55 12.87 784.49 12.87 739.36 59.49 689.55 101.72 689.55"/>
  <polygon fill="#c2ff06" points="369.76 735.08 461.55 826.09 461.55 917.15 418.02 917.15 277.96 778.28 277.96 735.8 231.31 689.55 369.76 689.55 369.76 735.08"/>
  <polygon fill="#c2ff06" points="327.55 873.14 372.9 917.15 12.87 917.15 12.87 829.61 143.95 689.55 186.19 689.55 369.76 871.56 369.76 873.14 327.55 873.14"/>
  <rect fill="#c2ff06" x="12.87" y="656.17" width="448.68" height="16.6"/>
  <polygon fill="#c2ff06" points="413.36 733.56 461.55 733.56 461.55 781.35 413.36 733.56"/>
  <polygon fill="#0013ff" points="369.76 782.08 369.76 826.82 320.8 778.28 277.98 735.82 277.96 735.8 231.31 689.55 276.44 689.55 300.53 713.44 320.83 733.56 365.93 778.28 369.76 782.08"/>
  <polygon fill="#0013ff" points="369.76 689.55 369.76 737.34 365.95 733.56 345.65 713.44 321.56 689.55 369.76 689.55"/>
  <polygon fill="#0013ff" points="235.98 873.14 186.17 823.75 186.17 873.14 235.98 873.14"/>
  <polygon fill="#0013ff" points="281.11 873.14 186.17 779.01 186.17 823.75 235.98 873.14 281.11 873.14"/>
  <polygon fill="#0013ff" points="369.76 871.56 369.76 873.14 326.23 873.14 277.96 825.28 242.85 790.47 211.08 758.97 186.17 734.27 186.17 689.55 186.19 689.55 369.76 871.56"/>
  <polygon fill="#ffffff" points="461.55 826.09 461.55 870.83 368.21 778.28 323.11 733.56 368.23 733.56 369.76 735.08 461.55 826.09"/>
  <polygon fill="#ffffff" points="461.55 733.56 461.55 781.35 413.36 733.56 461.55 733.56"/>
  <polygon fill="#ffffff" points="327.78 917.15 277.96 867.76 277.96 917.15 327.78 917.15"/>
  <polygon fill="#ffffff" points="372.9 917.15 327.78 917.15 277.96 868.81 277.96 825.02 327.55 873.14 372.9 917.15"/>
  <polygon fill="#ffffff" points="461.55 915.57 461.55 917.15 418.02 917.15 277.96 778.28 277.96 733.56 277.98 733.56 323.08 778.28 369.76 824.56 461.55 915.57"/>
  <polygon fill="#ff00f3" points="98.83 873.14 186.17 779.82 186.17 734.69 56.59 873.14 98.83 873.14"/>
  <polygon fill="#ff00f3" points="186.17 873.14 186.17 824.94 141.06 873.14 186.17 873.14"/>
  <polygon fill="#ff00f3" points="186.17 689.55 186.17 689.57 41.46 844.18 14.36 873.14 12.87 873.14 12.87 829.61 143.95 689.55 186.17 689.55"/>
</svg>`;

export function patternBackgroundCSS(color = '#0013ff') {
  const encoded = encodeURIComponent(patternSVG);
  return {
    backgroundImage: `url("data:image/svg+xml,${encoded}")`,
    backgroundColor: color,
    backgroundSize: '400px 400px',
    backgroundRepeat: 'repeat',
  };
}
```

- [ ] **Step 2: Add pattern animation keyframes to `style.css`**

```css
@keyframes pattern-drift {
  0% { background-position: 0 0; }
  100% { background-position: 400px 400px; }
}

.pattern-hero {
  animation: pattern-drift 20s linear infinite;
}

.pattern-hero:hover {
  animation-duration: 6s;
}

.pattern-card-header {
  height: 40px;
  background-size: 120px 120px;
  background-repeat: repeat;
  animation: pattern-drift 10s linear infinite;
}

.pattern-card-header:hover {
  animation-duration: 3s;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/patterns.js src/style.css
git commit -m "feat: add SVG pattern extraction and animation"
```

---

### Task 4: Build Header Component

**Files:**
- Modify: `index.html`
- Modify: `src/style.css`
- Modify: `src/main.js`

- [ ] **Step 1: Add header HTML to `index.html`**

```html
<body>
  <div id="app">
    <header class="header">
      <h1 class="header-title">Duna Blázquez</h1>
      <nav class="header-nav">
        <button class="nav-btn active" data-section="home">Inicio</button>
        <button class="nav-btn" data-section="exercises">Ejercicios</button>
        <button class="nav-btn" data-section="contact">Contacto</button>
      </nav>
      <button class="hamburger" aria-label="Menú">☰</button>
    </header>
    <main id="main-content"></main>
    <footer class="footer">
      <p>Duna Blázquez — Abadir Workshop</p>
    </footer>
  </div>
  <script type="module" src="/src/main.js"></script>
</body>
```

- [ ] **Step 2: Add header styles to `style.css`**

```css
.header {
  background: #ff00f3;
  padding: 12px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 3px solid #000;
}

.header-title {
  font-family: 'Boldense Regular', sans-serif;
  font-size: 48px;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.header-nav {
  display: flex;
  gap: 8px;
}

.nav-btn {
  font-family: 'Boldense Regular', sans-serif;
  font-size: 16px;
  text-transform: uppercase;
  padding: 8px 20px;
  border: 2px solid #000;
  background: transparent;
  color: #ffffff;
  cursor: pointer;
  transition: none;
}

.nav-btn:hover,
.nav-btn.active {
  background: #000;
  color: #ff00f3;
}

.hamburger {
  display: none;
  background: none;
  border: none;
  font-size: 28px;
  color: #fff;
  cursor: pointer;
}

@media (max-width: 768px) {
  .header { padding: 10px 16px; }
  .header-title { font-size: 28px; }
  .header-nav { display: none; }
  .header-nav.open { display: flex; flex-direction: column; position: absolute; top: 60px; left: 0; right: 0; background: #ff00f3; padding: 16px; border-bottom: 3px solid #000; z-index: 100; }
  .hamburger { display: block; }
}
```

- [ ] **Step 3: Add hamburger toggle logic to `main.js`**

```js
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.header-nav');
hamburger.addEventListener('click', () => nav.classList.toggle('open'));
```

- [ ] **Step 4: Commit**

```bash
git add index.html src/style.css src/main.js
git commit -m "feat: add header with nav and hamburger menu"
```

---

### Task 5: Build Hero Section

**Files:**
- Modify: `index.html`
- Modify: `src/style.css`

- [ ] **Step 1: Add hero HTML after header**

```html
<section class="hero pattern-hero" id="hero">
  <h2 class="hero-subtitle">Abadir workshop</h2>
  <div class="hero-search">
    <input type="text" class="search-input" placeholder="buscar ejercicio..." />
  </div>
</section>
```

Insert this right after `<header>` inside `<div id="app">`.

- [ ] **Step 2: Add hero styles**

```css
.hero {
  background-color: #0013ff;
  padding: 80px 32px;
  text-align: center;
  border-bottom: 3px solid #000;
  overflow: hidden;
  position: relative;
}

.hero-subtitle {
  font-family: 'Boldense Regular', sans-serif;
  font-size: 24px;
  color: #ffffff;
  text-transform: lowercase;
  position: relative;
  z-index: 1;
}

.hero-subtitle::first-letter {
  text-transform: uppercase;
}

.hero-search {
  margin-top: 24px;
  position: relative;
  z-index: 1;
}

.search-input {
  font-family: 'Helvetica Light', Helvetica, Arial, sans-serif;
  font-size: 14px;
  padding: 12px 20px;
  border: 2px solid #000;
  background: #fff;
  width: 100%;
  max-width: 400px;
  outline: none;
  transition: none;
}

.search-input:focus {
  background: #c2ff06;
  color: #000;
}

@media (max-width: 768px) {
  .hero { padding: 48px 16px; }
}
```

- [ ] **Step 3: Commit**

```bash
git add index.html src/style.css
git commit -m "feat: add hero section with animated pattern"
```

---

### Task 6: Build Exercise Grid + Cards

**Files:**
- Modify: `index.html`
- Modify: `src/style.css`
- Modify: `src/main.js`
- Create: `src/exercises.js`

- [ ] **Step 1: Create `src/exercises.js`** with exercise data

```js
export const exercises = [
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
```

- [ ] **Step 2: Add grid HTML to `index.html`** (inside `<main id="main-content">`)

```html
<section id="grid-section" class="grid-section">
  <div class="grid" id="exercise-grid">
    <!-- Cards injected by JS -->
  </div>
</section>

<section id="viewer-section" class="viewer-section" style="display:none">
  <button class="back-btn" id="back-btn">← volver</button>
  <iframe id="exercise-iframe" class="exercise-iframe"></iframe>
</section>
```

- [ ] **Step 3: Add grid and card styles to `style.css`**

```css
.grid-section {
  background: #0013ff;
  padding: 32px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  background: #ffffff;
  border: 2px solid #000;
  display: flex;
  flex-direction: column;
  transition: none;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-4px);
  border-width: 4px;
  background: #0013ff;
  color: #ffffff;
}

.card-header {
  height: 80px;
  background-size: 160px 160px;
  background-repeat: repeat;
  border-bottom: 2px solid #000;
  flex-shrink: 0;
}

.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.card-title {
  font-family: 'Boldense Regular', sans-serif;
  font-size: 20px;
  text-transform: uppercase;
  color: inherit;
}

.card-desc {
  font-family: 'Helvetica Light', Helvetica, Arial, sans-serif;
  font-size: 14px;
  color: inherit;
  flex: 1;
}

.card-btn {
  font-family: 'Helvetica', Arial, sans-serif;
  font-weight: bold;
  font-size: 14px;
  padding: 10px 24px;
  border: 2px solid #000;
  background: #c2ff06;
  color: #000;
  cursor: pointer;
  transition: none;
  align-self: flex-start;
  text-transform: uppercase;
}

.card:hover .card-btn {
  background: #ff00f3;
  color: #fff;
}

.card-btn:hover {
  background: #ff00f3 !important;
  color: #fff !important;
}

.viewer-section {
  background: #0013ff;
  padding: 24px 32px;
  min-height: 80vh;
}

.back-btn {
  font-family: 'Boldense Regular', sans-serif;
  font-size: 18px;
  text-transform: uppercase;
  padding: 10px 24px;
  border: 2px solid #000;
  background: #c2ff06;
  color: #000;
  cursor: pointer;
  margin-bottom: 16px;
  transition: none;
}

.back-btn:hover {
  background: #ff00f3;
  color: #fff;
}

.exercise-iframe {
  width: 100%;
  height: calc(100vh - 200px);
  border: 2px solid #000;
  background: #fff;
}

@media (max-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .grid-section { padding: 16px; }
}

@media (max-width: 480px) {
  .grid { grid-template-columns: 1fr; }
  .viewer-section { padding: 16px; }
  .exercise-iframe { height: calc(100vh - 160px); }
}
```

- [ ] **Step 4: Add card rendering + viewer logic to `main.js`**

```js
import { exercises } from './exercises.js';
import { patternBackgroundCSS } from './patterns.js';

const grid = document.getElementById('exercise-grid');
const gridSection = document.getElementById('grid-section');
const viewerSection = document.getElementById('viewer-section');
const exerciseIframe = document.getElementById('exercise-iframe');
const backBtn = document.getElementById('back-btn');

function renderCards() {
  exercises.forEach(ex => {
    const card = document.createElement('div');
    card.className = 'card';

    const header = document.createElement('div');
    header.className = 'card-header';
    Object.assign(header.style, patternBackgroundCSS('#0013ff'));
    header.style.backgroundSize = '160px 160px';
    header.classList.add('pattern-card-header');

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

function openExercise(ex) {
  gridSection.style.display = 'none';
  viewerSection.style.display = 'block';
  exerciseIframe.src = ex.iframeSrc;
}

backBtn.addEventListener('click', () => {
  viewerSection.style.display = 'none';
  gridSection.style.display = 'block';
  exerciseIframe.src = '';
});

renderCards();
```

- [ ] **Step 5: Commit**

```bash
git add src/exercises.js src/main.js index.html src/style.css
git commit -m "feat: add exercise grid with cards and iframe viewer"
```

---

### Task 7: Build Footer

**Files:**
- Modify: `index.html`
- Modify: `src/style.css`

- [ ] **Step 1: Footer is already in `index.html`** from Task 4. Add styles to `style.css`:

```css
.footer {
  background: #ff00f3;
  padding: 16px 32px;
  border-top: 3px solid #000;
  text-align: center;
}

.footer p {
  font-family: 'Helvetica Light', Helvetica, Arial, sans-serif;
  font-size: 12px;
  font-style: italic;
  color: #ffffff;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/style.css
git commit -m "feat: add footer with italic helvetica light"
```

---

### Task 8: Build Each Exercise for Iframe Embedding

**Files:**
- Modify: `Patternexercice/vite.config.ts`
- Modify: `tipografia cinetica/vite.config.js`
- Modify: `MANIONETTE/vite.config.js`
- Build outputs: each project's `dist/` folder

- [ ] **Step 1: Check each project's vite config for base path**

PatternExercice uses `base: '/patterns/'` which assumes deployment to GitHub Pages at a subpath. For iframe embedding from the root, change to relative base:
- In `Patternexercice/vite.config.ts`, change `base: '/patterns/'` → `base: './'`
- `tipografia cinetica/vite.config.js` — check if base is set
- `MANIONETTE/vite.config.js` — check if base is set

- [ ] **Step 2: Build PatternExercice**

```bash
cd Patternexercice && npm run build
```

- [ ] **Step 3: Build Tipografia Cinetica**

```bash
cd "tipografia cinetica" && npm run build
```

- [ ] **Step 4: Build MANIONETTE**

```bash
cd MANIONETTE && npm run build
```

- [ ] **Step 5: Verify builds exist**

```bash
ls -la Patternexercice/dist/index.html "tipografia cinetica/dist/index.html" MANIONETTE/dist/index.html testa/index.html
```

- [ ] **Step 6: Commit build outputs**

```bash
git add Patternexercice/dist "tipografia cinetica/dist" MANIONETTE/dist
git commit -m "chore: build exercises for iframe embedding"
```

---

### Task 9: Final Integration and Polish

**Files:**
- Modify: `src/style.css`
- Modify: `src/main.js`

- [ ] **Step 1: Set base page styles in `style.css`**

```css
html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: #0013ff;
  font-family: 'Helvetica Light', Helvetica, Arial, sans-serif;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}
```

- [ ] **Step 2: Add nav section switching logic to `main.js`**

```js
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const section = btn.dataset.section;
    if (section === 'home' || section === 'exercises') {
      viewerSection.style.display = 'none';
      gridSection.style.display = 'block';
      exerciseIframe.src = '';
      // scroll to grid
      gridSection.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'contact') {
      // contact section placeholder — could show a modal or redirect
      alert('Duna Blázquez — hello@duna.xyz'); // placeholder
    }
    // close mobile nav
    document.querySelector('.header-nav').classList.remove('open');
  });
});
```

- [ ] **Step 3: Run the dev server and verify**

```bash
npm run dev
```

Verify:
- Header renders with name in pink
- Hero shows with pattern animation
- 4 exercise cards in 3-column grid
- Clicking a card opens viewer with iframe
- Back button returns to grid
- Responsive at 768px and 480px
- Mobile hamburger works
- Nav buttons switch sections

- [ ] **Step 4: Commit final polish**

```bash
git add src/main.js src/style.css
git commit -m "feat: final integration with nav switching and polish"
```

---

### Task 10: Run Production Build and Verify

**Files:**
- Build output: `dist/`

- [ ] **Step 1: Build the dashboard**

```bash
npm run build
```

- [ ] **Step 2: Preview the production build**

```bash
npm run preview
```

Verify all sections render correctly. Check that iframes load each exercise.

- [ ] **Step 3: Commit build output**

```bash
git add dist
git commit -m "chore: production build"
```

---

## Self-Review Checklist

- [ ] **Spec coverage:** Every section from the design doc (Header, Hero, Grid, Viewer, Footer) has a corresponding task
- [ ] **Placeholder check:** No TBDs, TODOs, or vague steps
- [ ] **Path accuracy:** All file paths verified against actual project structure
- [ ] **Color accuracy:** Uses `#0013ff` (azul eléctrico), `#ff00f3` (rosa), `#c2ff06` (lima), `#ffffff` (blanco), `#000000` (negro) throughout
