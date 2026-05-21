import { useProject } from '../../store/ProjectContext';
import type { PatternRule } from '../../types';
import { useState } from 'react';
import styles from './PatternControls.module.css';

export function PatternControls() {
  const { state, dispatch } = useProject();
  const active = state.pattern !== null;
  const [variations, setVariations] = useState<PatternRule[]>([]);

  const toggle = () => {
    if (active) {
      dispatch({ type: 'SET_PATTERN', payload: null });
    } else {
      dispatch({
        type: 'SET_PATTERN',
        payload: {
          layout: 'grid',
          gapX: 0,
          gapY: 0,
          scale: 1,
          rotation: 0,
          randomOffset: 0,
          tileOverrides: [],
        },
      });
    }
  };

  const update = (changes: Partial<PatternRule>) => {
    if (!state.pattern) return;
    dispatch({ type: 'SET_PATTERN', payload: { ...state.pattern, ...changes } });
  };

  const generateVariations = () => {
    if (!state.pattern) return;
    const base = state.pattern;
    const generated: PatternRule[] = [];
    for (let i = 0; i < 5; i++) {
      generated.push({
        ...base,
        scale: Math.round((base.scale + (Math.random() - 0.5) * 0.8) * 100) / 100,
        rotation: Math.round(base.rotation + (Math.random() - 0.5) * 60),
        gapX: Math.round(base.gapX + (Math.random() - 0.5) * 40),
        gapY: Math.round(base.gapY + (Math.random() - 0.5) * 40),
        randomOffset: Math.round(base.randomOffset + (Math.random() - 0.5) * 30),
      });
    }
    setVariations(generated);
  };

  const applyVariation = (rule: PatternRule) => {
    dispatch({ type: 'SET_PATTERN', payload: rule });
    setVariations([]);
  };

  const layouts = [
    { value: 'grid' as const, label: 'Grid' },
    { value: 'brick' as const, label: 'Ladrillo' },
    { value: 'diamond' as const, label: 'Diamante' },
    { value: 'hex' as const, label: 'Hexagonal' },
    { value: 'mirror' as const, label: 'Espejo' },
  ];

  return (
    <div className={styles.panel}>
      <p className={styles.title}>Patrón</p>
      <button className={active ? styles.toggleBtn : styles.toggleBtnOff} onClick={toggle}>
        {active ? 'Desactivar patrón' : 'Activar patrón'}
      </button>
      {active && state.pattern && (
        <>
          <div className={styles.field}>
            <span className={styles.label}>Layout</span>
            <select
              className={styles.select}
              value={state.pattern.layout}
              onChange={e => update({ layout: e.target.value as typeof state.pattern.layout })}
            >
              {layouts.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Gap X</span>
            <input
              type="number"
              className={styles.input}
              value={state.pattern.gapX}
              min={-100}
              max={100}
              onChange={e => update({ gapX: Number(e.target.value) })}
            />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Gap Y</span>
            <input
              type="number"
              className={styles.input}
              value={state.pattern.gapY}
              min={-100}
              max={100}
              onChange={e => update({ gapY: Number(e.target.value) })}
            />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Escala</span>
            <input
              type="range"
              className={styles.input}
              value={state.pattern.scale}
              min={0.1}
              max={3}
              step={0.05}
              onChange={e => update({ scale: Number(e.target.value) })}
            />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Rotación</span>
            <input
              type="range"
              className={styles.input}
              value={state.pattern.rotation}
              min={-180}
              max={180}
              step={1}
              onChange={e => update({ rotation: Number(e.target.value) })}
            />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Aleatorio</span>
            <input
              type="range"
              className={styles.input}
              value={state.pattern.randomOffset}
              min={0}
              max={100}
              step={1}
              onChange={e => update({ randomOffset: Number(e.target.value) })}
            />
          </div>
          <div className={styles.actions}>
            <button className={styles.btnIcon} onClick={generateVariations}>
              Generar 5 variaciones
            </button>
          </div>
          {variations.length > 0 && (
            <div>
              {variations.map((v, i) => (
                <button
                  key={i}
                  className={styles.btnIcon}
                  onClick={() => applyVariation(v)}
                  style={{ display: 'block', width: '100%', marginBottom: 4, fontSize: 11 }}
                >
                  Var {i + 1} (escala {v.scale}x, rot {v.rotation})
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
