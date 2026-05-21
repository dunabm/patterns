import { useProject } from '../../store/ProjectContext';
import styles from './Toolbar.module.css';

const tools = [
  { id: 'pen' as const, label: '✏️', title: 'Pluma (dibujar)' },
  { id: 'select' as const, label: '⬆️', title: 'Seleccionar' },
  { id: 'pan' as const, label: '✋', title: 'Mover canvas' },
];

export function Toolbar() {
  const { state, dispatch } = useProject();
  return (
    <div className={styles.toolbar}>
      {tools.map(t => (
        <button
          key={t.id}
          className={state.tool === t.id ? styles.buttonActive : styles.button}
          title={t.title}
          onClick={() => dispatch({ type: 'SET_TOOL', payload: t.id })}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
