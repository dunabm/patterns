import { useProject } from '../../store/ProjectContext';
import type { Shape } from '../../types';
import styles from './PropertiesPanel.module.css';

export function PropertiesPanel() {
  const { state, dispatch } = useProject();
  const shape = state.shapes.find((s: Shape) => s.id === state.selectedShapeId);

  if (!shape) {
    return (
      <div className={styles.panel}>
        <p className={styles.empty}>Selecciona una forma para editar</p>
      </div>
    );
  }

  const update = (changes: Record<string, any>) => {
    dispatch({ type: 'UPDATE_SHAPE', payload: { id: shape.id, changes } });
  };

  return (
    <div className={styles.panel}>
      <p className={styles.title}>Propiedades</p>
      <div className={styles.field}>
        <span className={styles.label}>Relleno</span>
        <input
          type="color"
          className={styles.colorInput}
          value={shape.fill}
          onChange={e => update({ fill: e.target.value })}
        />
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Trazo</span>
        <input
          type="color"
          className={styles.colorInput}
          value={shape.stroke}
          onChange={e => update({ stroke: e.target.value })}
        />
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Grosor</span>
        <input
          type="number"
          className={styles.input}
          value={shape.strokeWidth}
          min={0}
          max={50}
          onChange={e => update({ strokeWidth: Number(e.target.value) })}
        />
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Opacidad</span>
        <input
          type="range"
          className={styles.input}
          value={shape.opacity}
          min={0}
          max={1}
          step={0.05}
          onChange={e => update({ opacity: Number(e.target.value) })}
        />
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Cerrar</span>
        <input
          type="checkbox"
          checked={shape.closed}
          onChange={e => update({ closed: e.target.checked })}
        />
      </div>
    </div>
  );
}
