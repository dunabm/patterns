import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LINE_WIDTH, SEGMENTS_PER_LINE, LINES } from './constants.js';

function makeZeros() {
  return new Float32Array((SEGMENTS_PER_LINE + 1) * 3);
}

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
    this._currentColor = new THREE.Color('#00ff88');
    this._resize();
    window.addEventListener('resize', () => this._resize());
  }

  setColor(hex) {
    this._currentColor.set(hex);
    for (const g of this._groups.values()) {
      for (const child of g.group.children) {
        child.material.color.set(hex);
      }
    }
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

    for (const g of this._groups.values()) {
      for (const child of g.group.children) {
        if (child.material && child.material.resolution) {
          child.material.resolution.set(w, h);
        }
      }
    }
  }

  ensureHand(id) {
    if (this._groups.has(id)) return this._groups.get(id);

    const group = new THREE.Group();
    const w = window.innerWidth;
    const h = window.innerHeight;

    for (let l = 0; l < LINES.length; l++) {
      const positions = makeZeros();

      const geo = new LineGeometry();
      geo.setPositions(positions);

      const mat = new LineMaterial({
        color: this._currentColor,
        linewidth: LINE_WIDTH,
        resolution: new THREE.Vector2(w, h),
        transparent: true,
        opacity: 0,
      });

      const line = new Line2(geo, mat);
      line.computeLineDistances();
      group.add(line);

      const glowMat = new LineMaterial({
        color: this._currentColor,
        linewidth: LINE_WIDTH * 2.5,
        resolution: new THREE.Vector2(w, h),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const glowGeo = geo.clone();
      const glow = new Line2(glowGeo, glowMat);
      glow.computeLineDistances();
      group.add(glow);
    }

    this.scene.add(group);
    const entry = { group, opacity: 0 };
    this._groups.set(id, entry);
    return entry;
  }

  removeHand(id) {
    const g = this._groups.get(id);
    if (!g) return;
    this.scene.remove(g.group);
    g.group.children.forEach((c) => {
      c.geometry.dispose();
      c.material.dispose();
    });
    this._groups.delete(id);
  }

  _setPositions(obj, pts) {
    obj.geometry.setPositions(pts);
    obj.geometry.attributes.position.needsUpdate = true;
    obj.computeLineDistances();
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
      const glow = g.group.children[l * 2 + 1];
      this._setPositions(line, pts);
      this._setPositions(glow, pts);
      line.material.opacity = alpha;
      glow.material.opacity = alpha * 0.3;
    }

    if (alpha < 0.01 && !visible) this.removeHand(id);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
