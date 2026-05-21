import { FINGER_TIPS, SMOOTHING, FREEZE_THRESHOLD } from './constants.js';

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

  getOpenness() {
    return this._openness;
  }

  isClosed() {
    return this._openness < FREEZE_THRESHOLD;
  }
}
