import { useProject } from '../../store/ProjectContext';
import { downloadSvg } from '../../utils/svgExport';
import styles from './ExportButton.module.css';

export function ExportButton() {
  const { state } = useProject();
  return (
    <button className={styles.exportBtn} onClick={() => downloadSvg(state)}>
      Exportar SVG
    </button>
  );
}
