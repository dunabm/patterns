# Alcachofa Tipografía Cinética — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone web tool that animates the word "ALCACHOFA" with kinetic typography — sprouting as a whole and peeling leaf by leaf.

**Architecture:** Single React component (`KineticText`) using a GSAP timeline with `repeat: -1` to cycle through 4 phases: sprout, display, peel, reset. The word is rendered as individual `<span>` elements for per-letter animation.

**Tech Stack:** React 18 + Vite, GSAP (npm), Google Fonts (Montserrat)

---

### Task 1: Scaffold project

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/App.jsx`

- [ ] **Step 1: Initialize Vite + React project**

Run:
```bash
cd "/Users/dunablazquezmerchan/Documents/AbadirWorkshop/tipografia cinetica"
npm create vite@latest . -- --template react
```

When prompted to overwrite files, confirm.

- [ ] **Step 2: Install GSAP**

```bash
npm install gsap
```

Expected: `gsap` added to `package.json` dependencies.

- [ ] **Step 3: Verify project runs**

```bash
npm run dev
```

Expected: Vite dev server starts on `http://localhost:5173`. Visit in browser to see Vite+React default page. Press Ctrl+C to stop.

---

### Task 2: Create KineticText component

**Files:**
- Create: `src/KineticText.jsx`
- Create: `src/KineticText.css`

- [ ] **Step 1: Create `src/KineticText.css`**

```css
.kinetic-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: #1a1a1a;
  overflow: hidden;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 6rem;
  gap: 0.1em;
}

.kinetic-letter {
  display: inline-block;
  position: relative;
}
```

- [ ] **Step 2: Create `src/KineticText.jsx`**

```jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './KineticText.css';

const WORD = 'ALCACHOFA';

export default function KineticText() {
  const containerRef = useRef(null);
  const lettersRef = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    const letters = lettersRef.current;

    if (!container || letters.length === 0) return;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

    // 1. Sprout — word emerges from below as a unit
    tl.fromTo(
      container,
      { y: 100, scale: 0.3, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 2, ease: 'power3.out' }
    );

    // 2. Display — pause with full green color (set by CSS initially)
    tl.to({}, { duration: 1.5 });

    // 3. Peel — each letter peels off one by one
    tl.staggerTo(
      letters,
      0.6,
      {
        x: () => gsap.utils.random(80, 150),
        y: () => gsap.utils.random(80, 150),
        rotation: () => gsap.utils.random(-25, 25),
        opacity: 0,
        color: '#e8d5c4',
        duration: 0.6,
        ease: 'power2.in',
      },
      0.5
    );

    // 4. Reset is automatic — GSAP repeats timeline

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="kinetic-container" ref={containerRef}>
      {WORD.split('').map((letter, i) => (
        <span
          key={`${letter}-${i}`}
          className="kinetic-letter"
          ref={(el) => (lettersRef.current[i] = el)}
          style={{ color: '#4a7c59' }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Update `src/App.jsx`**

```jsx
import KineticText from './KineticText';

export default function App() {
  return <KineticText />;
}
```

- [ ] **Step 4: Add Google Fonts link to `index.html`**

Edit `index.html` and add before the `</head>` tag:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap" rel="stylesheet">
```

- [ ] **Step 5: Remove default Vite boilerplate**

Delete the files: `src/App.css` (if exists) and clean up `index.html` to only have the Google Fonts link and the root div.

Also remove any `import './App.css'` from `src/App.jsx`.

- [ ] **Step 6: Run and verify**

```bash
npm run dev
```

Expected: Dark background, "ALCACHOFA" in green Montserrat, sprouts from below, pauses, then each letter flies off one by one with stagger, then resets.

---

### Task 3: Polish color transitions and visual feel

**Files:**
- Modify: `src/KineticText.jsx`

- [ ] **Step 1: Enhance letter color as gradient and add peel color evolution**

The spec calls for a vertical gradient (terracotta bottom → green top) during sprout, then green at full display, then mutating to ocre/pale during peel.

Replace the `.kinetic-letter` inline style and the peel color logic. Update `useEffect` in `KineticText.jsx`:

```jsx
useEffect(() => {
  const container = containerRef.current;
  const letters = lettersRef.current;

  if (!container || letters.length === 0) return;

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

  // Set initial gradient colors per letter position
  letters.forEach((el, i) => {
    const ratio = i / (letters.length - 1); // 0 = bottom, 1 = top
    const r = Math.round(105 + ratio * (74 - 105));   // #69 → #4a
    const g = Math.round(55 + ratio * (124 - 55));    // #37 → #7c
    const b = Math.round(33 + ratio * (89 - 33));     // #21 → #59
    gsap.set(el, { color: `rgb(${r}, ${g}, ${b})` });
  });

  // 1. Sprout — word emerges from below as a unit
  tl.fromTo(
    container,
    { y: 100, scale: 0.3, opacity: 0 },
    { y: 0, scale: 1, opacity: 1, duration: 2, ease: 'power3.out' }
  );

  // 2. Transition letters to vibrant green during display
  tl.to(letters, {
    color: '#4a7c59',
    duration: 0.5,
  });

  // 3. Display pause
  tl.to({}, { duration: 1 });

  // 4. Peel — each letter peels off
  tl.staggerTo(
    letters,
    0.7,
    {
      x: () => gsap.utils.random(80, 150),
      y: () => gsap.utils.random(80, 150),
      rotation: () => gsap.utils.random(-25, 25),
      opacity: 0,
      color: '#e8d5c4',
      duration: 0.7,
      ease: 'power2.in',
    },
    0.5
  );

  return () => {
    tl.kill();
  };
}, []);
```

- [ ] **Step 2: Add ghost/outline disappearing effect**

For a more conceptual "deshojar" feel, add a brief outline phase before full opacity fade. Add a `.kinetic-letter.peeling` class and animate `text-stroke` via GSAP somehow — since GSAP can't directly animate `text-stroke`, we'll use a `webkitTextStroke` set before the peel, and fade it out.

Actually, simpler approach: add a CSS class that applies the "ghost" look (outline + transparent fill) midway through the peel animation by setting a `--peeling` custom property and animating with a `set` at 30% of the stagger duration.

Simplest: skip the outline ghost. The opacity fade + color shift + fly-off is already effective. The spec says "conceptual, not literal". The current approach is strong.

*(Skip this step — YAGNI)*

- [ ] **Step 3: Verify final result**

```bash
npm run dev
```

Expected: Letters sprout with gradient (terracotta bottom → green top), settle to vibrant green, pause, then peel off one by one with stagger (random offset, rotation) and fade to ocre then transparent, fly off screen. Loop repeats.

---

### Task 4: Polish edge cases and clean up

**Files:**
- Modify: `src/KineticText.jsx`

- [ ] **Step 1: Handle fast tab switching / visibility**

When the browser tab is hidden and shown again, GSAP timelines can de-sync. Add visibility change handling:

```jsx
useEffect(() => {
  const container = containerRef.current;
  const letters = lettersRef.current;
  if (!container || letters.length === 0) return;

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

  letters.forEach((el, i) => {
    const ratio = i / (letters.length - 1);
    const r = Math.round(105 + ratio * (74 - 105));
    const g = Math.round(55 + ratio * (124 - 55));
    const b = Math.round(33 + ratio * (89 - 33));
    gsap.set(el, { color: `rgb(${r}, ${g}, ${b})` });
  });

  tl.fromTo(
    container,
    { y: 100, scale: 0.3, opacity: 0 },
    { y: 0, scale: 1, opacity: 1, duration: 2, ease: 'power3.out' }
  );

  tl.to(letters, { color: '#4a7c59', duration: 0.5 });

  tl.to({}, { duration: 1 });

  tl.staggerTo(
    letters,
    0.7,
    {
      x: () => gsap.utils.random(80, 150),
      y: () => gsap.utils.random(80, 150),
      rotation: () => gsap.utils.random(-25, 25),
      opacity: 0,
      color: '#e8d5c4',
      duration: 0.7,
      ease: 'power2.in',
    },
    0.5
  );

  const handleVisibility = () => {
    if (document.hidden) {
      tl.pause();
    } else {
      tl.resume();
    }
  };
  document.addEventListener('visibilitychange', handleVisibility);

  return () => {
    tl.kill();
    document.removeEventListener('visibilitychange', handleVisibility);
  };
}, []);
```

- [ ] **Step 2: Final verification**

```bash
npm run dev
```

Expected: Same as before, but now handles tab switching gracefully.

---

### Task 5: Clean up unused files and verify build

**Files:**
- Delete: any leftover Vite boilerplate

- [ ] **Step 1: Remove unused boilerplate**

Delete if they exist:
- `src/assets/` (default Vite assets folder)

- [ ] **Step 2: Build for production**

```bash
npm run build
```

Expected: Build succeeds. Output in `dist/` folder.

- [ ] **Step 3: Preview production build**

```bash
npm run preview
```

Expected: Production build works the same as dev.
