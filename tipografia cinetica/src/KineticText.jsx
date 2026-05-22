import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import './KineticText.css';

const WORD = 'ALCACHOFA';

export default function KineticText() {
  const containerRef = useRef(null);
  const tlRef = useRef(null);
  const cleanupRef = useRef([]);
  const [speed, setSpeed] = useState(1);
  const [spacing, setSpacing] = useState(62);
  const [fontSize, setFontSize] = useState(9);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (tlRef.current) { tlRef.current.kill(); tlRef.current = null; }
    cleanupRef.current.forEach((fn) => fn());
    cleanupRef.current = [];

    const n = WORD.length;
    const ci = Math.floor(n / 2);
    const items = [];
    const cy = container.offsetHeight / 2;

    for (let i = 0; i < n; i++) {
      const el = document.createElement('span');
      el.textContent = WORD[i];
      el.className = 'kinetic-letter';
      el.style.zIndex = 5;
      el.style.fontSize = `${fontSize}rem`;
      container.appendChild(el);
      items.push(el);
      const xPos = (i - (n - 1) / 2) * spacing;
      gsap.set(el, {
        x: xPos,
        y: cy / 2 + 350,
        scale: 0.15,
        opacity: 0,
        color: '#3a6b30',
      });
    }

    cleanupRef.current.push(() => items.forEach((el) => el.remove()));

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
    tlRef.current = tl;

    tl.to(items, {
      y: cy / 2 - 100,
      scale: 1,
      opacity: 1,
      color: '#66bb6a',
      duration: 1.2,
      ease: 'back.out(1.4)',
    });

    tl.to({}, { duration: 0.05 });

    const maxDist = Math.max(...items.map((_, i) => Math.abs(i - ci)));

    for (let dist = maxDist; dist >= 1; dist--) {
      if (dist < maxDist) tl.to({}, { duration: 0.15 });

      const groupTl = gsap.timeline();

      for (let i = 0; i < n; i++) {
        if (i === ci) continue;
        if (Math.abs(i - ci) !== dist) continue;

        const dir = i < ci ? -1 : 1;
        const flyDist = 180 + dist * 50;
        const fallDist = 180 + dist * 30;
        const dur = 0.45 + dist * 0.05;

        groupTl.to(items[i], { x: `+=${dir * flyDist}`, duration: dur, ease: 'power4.out' }, 0);
        groupTl.to(items[i], { y: `+=${fallDist}`, rotationZ: (Math.random() - 0.5) * 80, duration: dur, ease: 'power2.in' }, 0);
        groupTl.to(items[i], { opacity: 0, duration: dur, ease: 'none' }, 0);
      }

      tl.add(groupTl);
    }

    tl.call(() => {
      items.forEach((el, i) => {
        const xPos = (i - (n - 1) / 2) * spacing;
        gsap.set(el, {
          x: xPos,
          y: cy / 2 + 350,
          scale: 0.15,
          opacity: 0,
          color: '#3a6b30',
          rotationZ: 0,
        });
      });
    });

    const handleVisibility = () => {
      if (document.hidden) tl.pause(); else tl.resume();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    cleanupRef.current.push(() => document.removeEventListener('visibilitychange', handleVisibility));

    return () => {
      tl.kill();
      tlRef.current = null;
      cleanupRef.current.forEach((fn) => fn());
      cleanupRef.current = [];
    };
  }, [spacing, fontSize]);

  useEffect(() => {
    if (tlRef.current) tlRef.current.timeScale(speed);
  }, [speed]);

  return (
    <div className="page-wrapper">
      <div className="kinetic-container" ref={containerRef} />
      <div className="controls">
        <label>⚡<input type="range" min="0.3" max="3" step="0.1" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /><span>{speed.toFixed(1)}x</span></label>
        <label>↔<input type="range" min="20" max="160" step="1" value={spacing} onChange={(e) => setSpacing(Number(e.target.value))} /><span>{spacing}px</span></label>
        <label>Aa<input type="range" min="3" max="16" step="0.5" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} /><span>{fontSize.toFixed(1)}rem</span></label>
      </div>
    </div>
  );
}
