import { useProject } from '../../store/ProjectContext';
import type { Shape } from '../../types';
import styles from './LayerPanel.module.css';

export function LayerPanel() {
  const { state, dispatch } = useProject();

  const moveUp = (index: number) => {
    if (index <= 0) return;
    const ids = state.shapes.map(s => s.id);
    [ids[index - 1], ids[index]] = [ids[index], ids[index - 1]];
    dispatch({ type: 'REORDER_SHAPES', payload: { shapeIds: ids } });
  };

  const moveDown = (index: number) => {
    if (index >= state.shapes.length - 1) return;
    const ids = state.shapes.map(s => s.id);
    [ids[index], ids[index + 1]] = [ids[index + 1], ids[index]];
    dispatch({ type: 'REORDER_SHAPES', payload: { shapeIds: ids } });
  };

  return (
    <div className={styles.panel}>
      <p className={styles.title}>Capas</p>
      {state.shapes.length === 0 ? (
        <p className={styles.empty}>Sin formas</p>
      ) : (
        <>
          <ul className={styles.list}>
            {state.shapes.map((s: Shape, i: number) => (
              <li
                key={s.id}
                className={s.id === state.selectedShapeId ? styles.itemActive : styles.item}
                onClick={() => dispatch({ type: 'SET_SELECTED_SHAPE', payload: { id: s.id } })}
              >
                <span
                  className={styles.eyeBtn}
                  onClick={e => {
                    e.stopPropagation();
                    dispatch({ type: 'UPDATE_SHAPE', payload: { id: s.id, changes: { visible: !s.visible } } });
                  }}
                >
                  {s.visible ? '👁️' : '🚫'}
                </span>
                <span>Forma {i + 1}</span>
              </li>
            ))}
          </ul>
          <div className={styles.actions}>
            <button className={styles.btnIcon} onClick={() => moveUp(state.shapes.findIndex((s: Shape) => s.id === state.selectedShapeId))}>⬆</button>
            <button className={styles.btnIcon} onClick={() => moveDown(state.shapes.findIndex((s: Shape) => s.id === state.selectedShapeId))}>⬇</button>
            <button
              className={styles.btnIcon}
              onClick={() => {
                if (state.selectedShapeId) {
                  dispatch({ type: 'DELETE_SHAPE', payload: { id: state.selectedShapeId } });
                }
              }}
            >
              🗑️
            </button>
          </div>
        </>
      )}
    </div>
  );
}
