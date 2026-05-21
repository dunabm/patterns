import { SCENE_SCALE } from './constants.js';
const Hands = window.Hands;

export class HandTracker {
  constructor(onFrame) {
    this._onFrame = onFrame;
    this._hands = null;
    this._running = false;
  }

  async start(video) {
    console.log('HandTracker: inicializando...');

    const hands = new Hands({
      locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
    });

    hands.setOptions({
      maxNumHands: 4,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    let frameCount = 0;

    hands.onResults((r) => {
      frameCount++;
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
      if (frameCount % 30 === 0) {
        console.log(`Manos detectadas: ${list.length}, frames procesados: ${frameCount}`);
      }
      this._onFrame(list);
    });

    this._hands = hands;

    console.log('HandTracker: solicitando cámara...');
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480, facingMode: 'user' },
    });
    video.srcObject = stream;
    await video.play();
    console.log('HandTracker: cámara activa');

    this._running = true;
    this._loop(video);
  }

  async _loop(video) {
    if (!this._running) return;
    if (video.readyState >= 2) {
      await this._hands.send({ image: video });
    }
    requestAnimationFrame(() => this._loop(video));
  }

  stop() {
    this._running = false;
  }
}
