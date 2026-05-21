import { useEffect } from 'react';
import { ProjectProvider, useProject } from './store/ProjectContext';
import { Toolbar } from './components/Toolbar/Toolbar';
import { CanvasViewport } from './components/Canvas/CanvasViewport';
import { PropertiesPanel } from './components/Sidebar/PropertiesPanel';
import { LayerPanel } from './components/Sidebar/LayerPanel';
import { TileOverridePanel } from './components/Sidebar/TileOverridePanel';
import { PatternControls } from './components/Pattern/PatternControls';
import { PatternPreview } from './components/Pattern/PatternPreview';
import { ExportButton } from './components/Export/ExportButton';
import { useHistory } from './hooks/useHistory';
import styles from './App.module.css';

function AppInner() {
  const { state, dispatch } = useProject();
  const history = useHistory(state);

  useEffect(() => {
    history.push(state);
  }, [state.shapes, state.pattern]);

  const handleUndo = () => {
    const prev = history.undo();
    if (prev) dispatch({ type: 'RESTORE', payload: prev });
  };

  const handleRedo = () => {
    const next = history.redo();
    if (next) dispatch({ type: 'RESTORE', payload: next });
  };

  return (
    <div className={styles.app}>
      <Toolbar />
      <div className={styles.main}>
        <div className={styles.topBar}>
          <span className={styles.topBarTitle}>Pattern Designer</span>
          <button className={styles.topBarBtn} disabled={!history.canUndo} onClick={handleUndo}>
            Deshacer
          </button>
          <button className={styles.topBarBtn} disabled={!history.canRedo} onClick={handleRedo}>
            Rehacer
          </button>
        </div>
        <div className={styles.canvas}>
          <CanvasViewport />
        </div>
        <div className={styles.footer}>
          <ExportButton />
        </div>
      </div>
      <div className={styles.sidebar}>
        <PropertiesPanel />
        <LayerPanel />
        <div className={styles.patternSection}>
          <PatternControls />
          <PatternPreview />
          <TileOverridePanel />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ProjectProvider>
      <AppInner />
    </ProjectProvider>
  );
}
