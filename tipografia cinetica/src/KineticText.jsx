import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './KineticText.css';

const WORD = 'ALCACHOFA';

function spawnParticles(el, count) {
  const rect = el.getBoundingClientRect();
  const color = getComputedStyle(el).color;
  for (let i = 0; i < count; i++) {
    const w = 2 + Math.random() * 8;
    const h = 2 + Math.random() * 8;
    const p = document.createElement('div');
    p.style.cssText = `position:fixed;pointer-events:none;z-index:20;width:${w}px;height:${h}px;background:${color};border-radius:${Math.random() > 0.4 ? '50%' : '1px'}`;
    document.body.appendChild(p);
    const sx = rect.left + Math.random() * rect.width - w / 2;
    const sy = rect.top + Math.random() * rect.height - h / 2;
    gsap.fromTo(p,
      { x: sx, y: sy, scale: 1, opacity: 1, rotation: 0 },
      { y: sy + 80 + Math.random() * 300, x: sx + (Math.random() - 0.5) * 140, rotation: (Math.random() - 0.5) * 400, scale: 0.1 + Math.random() * 0.5, opacity: 0, duration: 0.5 + Math.random() * 0.6, ease: 'power2.in', onComplete: () => p.remove() }
    );
  }
}

export default function KineticText() {
  const containerRef = useRef(null);
  const lettersRef = useRef([]);
  const tlRef = useRef(null);

  const [speed, setSpeed] = useState(1);
  const [shakePow, setShakePow] = useState(0.5);
  const [fragments, setFragments] = useState(0.5);

  useEffect(() => {
    const container = containerRef.current;
    const letters = lettersRef.current;
    if (!container || letters.length === 0) return;

    const n = letters.length;

    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }

    const spacing = 65;

    letters.forEach((el) => {
      gsap.set(el, { x: 0, y: 150, scale: 0.1, opacity: 0, rotation: 0, color: '#3a6b30' });
    });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
    tlRef.current = tl;

    tl.to(letters, {
      x: (i) => (i - (n - 1) / 2) * spacing,
      y: 0,
      scale: 1,
      opacity: 1,
      rotation: 0,
      duration: 1.2,
      ease: 'back.out(1.7)',
    });

    tl.to(letters, { color: '#66bb6a', duration: 0.4 });
    tl.to({}, { duration: 0.4 });

    const intensity = 0.3 + shakePow * 1.2;

    tl.to(letters, {
      x: `+=${5 * intensity}`, rotation: `+=${3 * intensity}`,
      duration: 0.03, repeat: 6, yoyo: true, ease: 'none',
    });

    tl.to(letters, {
      x: `+=${10 * intensity}`, rotation: `+=${6 * intensity}`,
      duration: 0.03, repeat: 6, yoyo: true, ease: 'none',
    });

    tl.to(letters, {
      x: `+=${15 * intensity}`, rotation: `+=${9 * intensity}`,
      duration: 0.03, repeat: 6, yoyo: true, ease: 'none',
    });

    const fragCount = Math.round(2 + fragments * 4);

    tl.call(() => {
      letters.forEach((el) => spawnParticles(el, fragCount));
    }, null, '+=0.1');

    tl.call(() => {
      letters.forEach((el) => spawnParticles(el, fragCount + 1));
    }, null, '+=0.25');

    tl.call(() => {
      letters.forEach((el) => spawnParticles(el, fragCount + 2));
    }, null, '+=0.4');

    tl.call(() => {
      letters.forEach((el) => spawnParticles(el, fragCount + 1));
    }, null, '+=0.55');

    tl.to(letters, { opacity: 0.5, scale: 0.4, duration: 0.15, ease: 'none' }, '+=0.4');
    tl.to(letters, { opacity: 0, scale: 0.1, duration: 0.35, ease: 'power2.in' }, '+=0.55');

    tl.call(() => {
      letters.forEach((el) => gsap.set(el, { x: 0, y: 150, scale: 0.1, opacity: 0, rotation: 0 }));
    });

    const handleVisibility = () => {
      if (document.hidden) tl.pause(); else tl.resume();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      tl.kill();
      tlRef.current = null;
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [shakePow, fragments]);

  useEffect(() => {
    if (tlRef.current) tlRef.current.timeScale(speed);
  }, [speed]);

  return (
    <div className="page-wrapper">
      <div className="kinetic-container" ref={containerRef}>
        {WORD.split('').map((letter, i) => (
          <span key={`${letter}-${i}`} className="kinetic-letter" ref={(el) => (lettersRef.current[i] = el)}>
            {letter}
          </span>
        ))}
      </div>
      <div className="controls">
        <label>⚡<input type="range" min="0.3" max="3" step="0.1" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /><span>{speed.toFixed(1)}x</span></label>
        <label>🌪️<input type="range" min="0" max="1" step="0.1" value={shakePow} onChange={(e) => setShakePow(Number(e.target.value))} /></label>
        <label>🍂<input type="range" min="0" max="1" step="0.1" value={fragments} onChange={(e) => setFragments(Number(e.target.value))} /></label>
      </div>
    </div>
  );
}
