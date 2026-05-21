# Handpose Algae — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a web tool that tracks hands via webcam and renders 5 algae-like lines per hand that emerge with wave propagation when the hand opens.

**Architecture:** MediaPipe Hands detects 21 landmarks per hand → GestureEngine computes openness → WavePropagator controls how much of each line is visible and applies sinusoidal displacement → AlgaeRenderer draws lines using Three.js Line2 with glow.

**Tech Stack:** Vite, Three.js (Line2 from examples), @mediapipe/hands, vanilla JavaScript ES modules.

**File layout:**
```
manionette/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.js             ← orchestrator, connects all modules
    ├── constants.js        ← landmark indices, colors, config
    ├── HandTracker.js      ← webcam + MediaPipe Hands pipeline
    ├── GestureEngine.js    ← openness (0-1) from landmarks
    ├── WavePropagator.js   ← wave index + sinusoidal displacement
    └── AlgaeRenderer.js    ← Three.js scene, lines, glow, background
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "manionette",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@mediapipe/hands": "^0.4.1675469240",
    "three": "^0.170.0"
  },
  "devDependencies": {
    "vite": "^6.0.0"
  }
}
```

- [ ] **Step 2: Create vite.config.js**

```js
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
```

- [ ] **Step 3: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Manionette</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #000; }
    canvas { display: block; }
    #start-btn {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      padding: 16px 48px; font: 18px/1.4 system-ui, sans-serif;
      background: #00ff88; color: #000; border: none; border-radius: 8px;
      cursor: pointer; z-index: 10;
    }
    #start-btn:hover { background: #00cc6a; }
    #start-btn.hidden { display: none; }
  </style>
</head>
<body>
  <button id="start-btn">Start</button>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Install dependencies**

Run: `npm install`
Expected: node_modules created

- [ ] **Step 5: Create src directory**

Run: `mkdir -p src`

---

### Task 2: Constants

**Files:**
- Create: `src/constants.js`

- [ ] **Step 1: Write src/constants.js**

```js
export const LINES = [
  [0, 1, 2, 3, 4],
  [0, 5, 6, 7, 8],
  [0, 9, 10, 11, 12],
  [0, 13, 14, 15, 16],
  [0, 17, 18, 19, 20],
];

export const FINGER_TIPS = [4, 8, 12, 16, 20];

export const LINE_COLOR = '#00ff88';
export const SEGMENTS_PER_LINE = 30;
export const WAVE_FREQ = 0.8;
export const WAVE_PHASE = 0.4;
export const WAVE_AMP = 0.06;
export const WAVE_SPEED = 0.6;
export const SMOOTHING = 0.15;
export const FADE_DURATION = 0.5;
export const SCENE_SCALE = 2.0;
```

---

### Task 3: GestureEngine

**Files:**
- Create: `src/GestureEngine.js`

- [ ] **Step 1: Write src/GestureEngine.js**

```js
import { FINGER_TIPS, SMOOTHING } from './constants.js';

export class GestureEngine {
  constructor() {
    this._openness = 0;
  }

  update(landmarks) {
    if (!landmarks) return 0;

    const wrist = landmarks[0];
    let total = 0;

    for (const tip of FINGER_TIPS) {
      const dx = landmarks[tip][0] - wrist[0];
      const dy = landmarks[tip][1] - wrist[1];
      const dz = landmarks[tip][2] - wrist[2];
      total += Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    const raw = Math.min(total / FINGER_TIPS.length / 0.3, 1);
    this._openness += (raw - this._openness) * SMOOTHING;
    return this._openness;
  }
}
```

---

### Task 4: WavePropagator

**Files:**
- Create: `src/WavePropagator.js`

- [ ] **Step 1: Write src/WavePropagator.js**

```js
import { LINES, SEGMENTS_PER_LINE, WAVE_FREQ, WAVE_PHASE, WAVE_AMP, WAVE_SPEED } from './constants.js';

function makeLine() {
  return { points: new Array(SEGMENTS_PER_LINE + 1).fill().map(() => [0, 0, 0]) };
}

export class WavePropagator {
  constructor() {
    this._hands = new Map();
  }

  ensureHand(id) {
    if (!this._hands.has(id)) {
      this._hands.set(id, { lines: LINES.map(makeLine) });
    }
    return this._hands.get(id);
  }

  removeHand(id) {
    this._hands.delete(id);
  }

  update(id, landmarks, openness, time) {
    const hand = this.ensureHand(id);
    const waveIdx = openness * SEGMENTS_PER_LINE;

    for (let l = 0; l < LINES.length; l++) {
      const idxs = LINES[l];
      const line = hand.lines[l];

      for (let i = 0; i <= SEGMENTS_PER_LINE; i++) {
        const t = i / SEGMENTS_PER_LINE;
        const fi = t * (idxs.length - 1);
        const a = Math.floor(fi);
        const b = Math.min(a + 1, idxs.length - 1);
        const f = fi - a;

        const p0 = landmarks[idxs[a]];
        const p1 = landmarks[idxs[b]];
        if (!p0 || !p1) continue;

        let x = p0[0] + (p1[0] - p0[0]) * f;
        let y = p0[1] + (p1[1] - p0[1]) * f;
        let z = p0[2] + (p1[2] - p0[2]) * f;

        const waveFrontBoost = Math.max(0, waveIdx - i) / SEGMENTS_PER_LINE;
        const amp = WAVE_AMP * (1 + waveFrontBoost * 2);

        x += amp * Math.sin(time * WAVE_SPEED + i * WAVE_PHASE);
        z += amp * Math.cos(time * WAVE_SPEED + i * WAVE_PHASE * 1.3);

        if (i > waveIdx) {
          line.points[i][0] = 0;
          line.points[i][1] = 0;
          line.points[i][2] = 0;
        } else {
          line.points[i][0] = x;
          line.points[i][1] = y;
          line.points[i][2] = z;
        }
      }
    }

    return hand.lines;
  }

  get seen() {
    return this._hands;
  }
}
```

---

### Task 5: HandTracker

**Files:**
- Create: `src/HandTracker.js`

- [ ] **Step 1: Write src/HandTracker.js**

```js
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera';
import { SCENE_SCALE } from './constants.js';

export class HandTracker {
  constructor(onFrame) {
    this._onFrame = onFrame;
    this._camera = null;
  }

  async start(video) {
    const hands = new Hands({
      locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
    });

    hands.setOptions({
      maxNumHands: 4,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((r) => {
      const list = [];
      if (r.multiHandLandmarks) {
        for (let h = 0; h < r.multiHandLandmarks.length; h++) {
          const lm = r.multiHandLandmarks[h].map((p) => [
            (p.x - 0.5) * SCENE_SCALE * 2,
            -(p.y - 0.5) * SCENE_SCALE * 2,
            p.z * SCENE_SCALE,
          ]);
          list.push({ id: `h${h}`, landmarks: lm });
        }
      }
      this._onFrame(list);
    });

    this._camera = new Camera(video, {
      onFrame: async () => { await hands.send({ image: video }); },
      width: 640, height: 480,
    });

    await this._camera.start();
  }

  stop() {
    if (this._camera) { this._camera.stop(); this._camera = null; }
  }
}
```

---

### Task 6: AlgaeRenderer

**Files:**
- Create: `src/AlgaeRenderer.js`

- [ ] **Step 1: Write src/AlgaeRenderer.js**

```js
import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LINE_COLOR, SEGMENTS_PER_LINE, LINES } from './constants.js';

export class AlgaeRenderer {
  constructor(container) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000510);

    this.camera = new THREE.OrthographicCamera(-2, 2, 2, -2, -10, 10);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    this._groups = new Map();

    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  _resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const aspect = w / h;
    this.camera.left = -2 * aspect;
    this.camera.right = 2 * aspect;
    this.camera.top = 2;
    this.camera.bottom = -2;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  ensureHand(id) {
    if (this._groups.has(id)) return this._groups.get(id);

    const group = new THREE.Group();

    for (let l = 0; l < LINES.length; l++) {
      const positions = new Float32Array((SEGMENTS_PER_LINE + 1) * 3);

      const geo = new LineGeometry();
      geo.setPositions(positions);

      const mat = new LineMaterial({
        color: LINE_COLOR,
        linewidth: 3,
        resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
        transparent: true,
        opacity: 0,
      });

      const line = new Line2(geo, mat);
      line.computeLineDistances();
      group.add(line);

      const glowMat = new LineMaterial({
        color: LINE_COLOR,
        linewidth: 7,
        resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const glow = new Line2(geo.clone(), glowMat);
      glow.computeLineDistances();
      group.add(glow);
    }

    this.scene.add(group);
    this._groups.set(id, { group, opacity: 0 });
    return this._groups.get(id);
  }

  removeHand(id) {
    const g = this._groups.get(id);
    if (!g) return;
    this.scene.remove(g.group);
    g.group.children.forEach((c) => { c.geometry.dispose(); c.material.dispose(); });
    this._groups.delete(id);
  }

  updateHand(id, linesData, visible) {
    const g = this.ensureHand(id);
    const target = visible ? 1 : 0;
    g.opacity += (target - g.opacity) * 0.1;
    const alpha = Math.max(0, Math.min(1, g.opacity));

    for (let l = 0; l < LINES.length; l++) {
      const pts = [];
      for (let i = 0; i <= SEGMENTS_PER_LINE; i++) {
        const p = linesData[l].points[i];
        pts.push(p[0], p[1], p[2]);
      }

      const line = g.group.children[l * 2];
      line.geometry.setPositions(pts);
      line.geometry.attributes.position.needsUpdate = true;
      line.computeLineDistances();
      line.material.opacity = alpha;

      const glow = g.group.children[l * 2 + 1];
      glow.geometry.setPositions(pts);
      glow.geometry.attributes.position.needsUpdate = true;
      glow.computeLineDistances();
      glow.material.opacity = alpha * 0.3;
    }

    if (alpha < 0.01 && !visible) this.removeHand(id);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
```

---

### Task 7: Main Entry Point

**Files:**
- Create: `src/main.js`

- [ ] **Step 1: Write src/main.js**

```js
import { HandTracker } from './HandTracker.js';
import { GestureEngine } from './GestureEngine.js';
import { WavePropagator } from './WavePropagator.js';
import { AlgaeRenderer } from './AlgaeRenderer.js';

const btn = document.getElementById('start-btn');

btn.addEventListener('click', async () => {
  btn.classList.add('hidden');

  const video = document.createElement('video');
  video.setAttribute('playsinline', '');
  video.style.display = 'none';
  document.body.appendChild(video);

  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;z-index:1';
  document.body.appendChild(container);

  const renderer = new AlgaeRenderer(container);
  const gesture = new GestureEngine();
  const wave = new WavePropagator();
  let prevIds = new Set();

  const tracker = new HandTracker((hands) => {
    const ids = new Set(hands.map((h) => h.id));
    const t = performance.now() / 1000;

    for (const hand of hands) {
      const openness = gesture.update(hand.landmarks);
      const lines = wave.update(hand.id, hand.landmarks, openness, t);
      renderer.updateHand(hand.id, lines, true);
    }

    for (const id of prevIds) {
      if (!ids.has(id)) {
        const openness = gesture.update(null);
        const lines = wave.update(id, wave.ensureHand(id).lines.map(() => [0, 0, 0]).reduce(
          (acc, _, i) => {
            const lm = wave.ensureHand(id).lines[0].points[i];
            return [...acc, lm || [0, 0, 0]];
          }, []), openness, t);
        renderer.updateHand(id, lines, false);
      }
    }

    prevIds = ids;
  });

  await tracker.start(video);

  function loop() {
    renderer.render();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
});
```

Hmm, the fade-out logic in main.js is getting messy. Let me simplify: instead of trying to keep old positions, just pass an empty lines array for gone hands. The WavePropagator already stores data per hand, so we can just re-use the last computed lines.

Actually the simplest approach: store the last computed lines per hand in main.js, and when a hand disappears, pass those lines with `visible = false` to the renderer. The renderer fades them out.

Let me rewrite Task 7 cleanly.

- [ ] **Step 1 (revised): Write src/main.js**

```js
import { HandTracker } from './HandTracker.js';
import { GestureEngine } from './GestureEngine.js';
import { WavePropagator } from './WavePropagator.js';
import { AlgaeRenderer } from './AlgaeRenderer.js';

const btn = document.getElementById('start-btn');

btn.addEventListener('click', async () => {
  btn.classList.add('hidden');

  const video = document.createElement('video');
  video.setAttribute('playsinline', '');
  video.style.display = 'none';
  document.body.appendChild(video);

  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;z-index:1';
  document.body.appendChild(container);

  const renderer = new AlgaeRenderer(container);
  const gesture = new GestureEngine();
  const wave = new WavePropagator();
  let lastLines = new Map();
  let prevIds = new Set();

  const tracker = new HandTracker((hands) => {
    const ids = new Set();
    const t = performance.now() / 1000;

    for (const hand of hands) {
      ids.add(hand.id);
      const openness = gesture.update(hand.landmarks);
      const lines = wave.update(hand.id, hand.landmarks, openness, t);
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
    renderer.render();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
});
```

---

### Self-Review Checklist

1. **Spec coverage:** All spec requirements covered:
   - Hand landmarks mapping with standard MediaPipe indices → Task 2
   - GestureEngine openness (0-1) with smoothing → Task 3
   - Wave propagation from wrist to fingertips → Task 4
   - Sinusoidal displacement with wave-front amplitude boost → Task 4
   - Three.js rendering with Line2 variable width → Task 6
   - Glow effect with additive blending → Task 6
   - Monochromatic bright color on dark background → Task 6
   - Multiple hands support → Tasks 5, 6, 7
   - No-hand fade out → Task 6 (opacity lerp)
   - Start button for webcam → Task 1 (index.html) + Task 7

2. **Placeholder scan:** No TBD, TODO, or incomplete sections.

3. **Type consistency:** All method signatures match across files. `gesture.update(landmarks)` returns number, `wave.update(id, landmarks, openness, time)` returns lines array, `renderer.updateHand(id, lines, visible)` consumes it.

4. **Ambiguity check:** All paths, data formats, and APIs are explicit.
