import { useProject } from '../../store/ProjectContext';
import type { TileOverride } from '../../types';
import styles from './TileOverridePanel.module.css';

export function TileOverridePanel() {
  const { state, dispatch } = useProject();

  if (state.selectedTileIndex === null || !state.pattern) {
    return (
      <div className={styles.panel}>
        <p className={styles.title}>Tile</p>
        <p className={styles.empty}>Selecciona un tile en el preview</p>
      </div>
    );
  }

  const index = state.selectedTileIndex;
  const override = state.pattern.tileOverrides.find((t: TileOverride) => t.instanceIndex === index);
  const x = override?.x ?? 0;
  const y = override?.y ?? 0;
  const rotation = override?.rotation ?? state.pattern.rotation;
  const scale = override?.scale ?? state.pattern.scale;

  const update = (changes: Record<string, number>) => {
    dispatch({ type: 'UPDATE_TILE_OVERRIDE', payload: { index, changes } });
  };

  const reset = () => {
    const pat = state.pattern!;
    dispatch({ type: 'UPDATE_TILE_OVERRIDE', payload: {
      index,
      changes: { x: 0, y: 0, rotation: pat.rotation, scale: pat.scale, visible: true },
    } });
  };

  return (
    <div className={styles.panel}>
      <p className={styles.title}>Tile #{index}</p>
      <button className={styles.reset} onClick={reset}>Restablecer</button>
      <div className={styles.field}>
        <span className={styles.label}>X</span>
        <input type="number" className={styles.input} value={x} onChange={e => update({ x: Number(e.target.value) })} />
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Y</span>
        <input type="number" className={styles.input} value={y} onChange={e => update({ y: Number(e.target.value) })} />
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Rotacion</span>
        <input type="number" className={styles.input} value={rotation} onChange={e => update({ rotation: Number(e.target.value) })} />
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Escala</span>
        <input type="number" className={styles.input} value={scale} min={0.1} max={5} step={0.1} onChange={e => update({ scale: Number(e.target.value) })} />
      </div>
    </div>
  );
}
