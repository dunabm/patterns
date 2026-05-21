import { LINES, SEGMENTS_PER_LINE, WAVE_PHASE, WAVE_AMP, WAVE_AMP2, WAVE_SPEED, WAVE_FREQ2, TRAIL_SPEED } from './constants.js';

function makeLine() {
  return {
    points: Array.from({ length: SEGMENTS_PER_LINE + 1 }, () => [0, 0, 0]),
  };
}

export class WavePropagator {
  constructor() {
    this._hands = new Map();
  }

  ensureHand(id) {
    if (!this._hands.has(id)) {
      this._hands.set(id, {
        lines: LINES.map(makeLine),
        lastLandmarks: null,
        lastOpenness: 0,
      });
    }
    return this._hands.get(id);
  }

  removeHand(id) {
    this._hands.delete(id);
  }

  update(id, landmarks, openness, time) {
    const hand = this.ensureHand(id);

    if (landmarks) {
      hand.lastLandmarks = landmarks;
      hand.lastOpenness = openness;
    } else {
      landmarks = hand.lastLandmarks;
      openness = hand.lastOpenness;
    }

    if (!landmarks) return hand.lines;

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

        let tx = p0[0] + (p1[0] - p0[0]) * f;
        let ty = p0[1] + (p1[1] - p0[1]) * f;
        let tz = p0[2] + (p1[2] - p0[2]) * f;

        const waveFrontBoost = Math.max(0, waveIdx - i) / SEGMENTS_PER_LINE;
        const amp = WAVE_AMP * (1 + waveFrontBoost * 3);

        const wave1 = amp * Math.sin(time * WAVE_SPEED + i * WAVE_PHASE);
        const wave2 = WAVE_AMP2 * Math.sin(time * WAVE_FREQ2 + i * 0.7);
        const waveZ1 = amp * Math.cos(time * WAVE_SPEED + i * WAVE_PHASE * 1.3);
        const waveZ2 = WAVE_AMP2 * Math.cos(time * WAVE_FREQ2 + i * 0.9);

        tx += wave1 + wave2;
        tz += waveZ1 + waveZ2;

        if (i > waveIdx) {
          const wx = landmarks[0][0];
          const wy = landmarks[0][1];
          const wz = landmarks[0][2];
          line.points[i][0] += (wx - line.points[i][0]) * TRAIL_SPEED;
          line.points[i][1] += (wy - line.points[i][1]) * TRAIL_SPEED;
          line.points[i][2] += (wz - line.points[i][2]) * TRAIL_SPEED;
        } else {
          line.points[i][0] += (tx - line.points[i][0]) * TRAIL_SPEED;
          line.points[i][1] += (ty - line.points[i][1]) * TRAIL_SPEED;
          line.points[i][2] += (tz - line.points[i][2]) * TRAIL_SPEED;
        }
      }
    }

    return hand.lines;
  }
}
