import { useMemo } from 'react';
import { useProject } from '../../store/ProjectContext';
import { generateTileLayout } from '../../engine/patternEngine';
import { nodesToPathData } from '../../utils/pathUtils';
import type { Shape } from '../../types';
import styles from './PatternPreview.module.css';

export function PatternPreview() {
  const { state, dispatch } = useProject();
  const { pattern, shapes, tileWidth, tileHeight } = state;

  const tiles = useMemo(() => {
    if (!pattern) return [];
    return generateTileLayout(pattern, tileWidth, tileHeight, 3, 3);
  }, [pattern, tileWidth, tileHeight]);

  const handleTileClick = (index: number) => {
    dispatch({ type: 'SET_SELECTED_TILE', payload: { index: state.selectedTileIndex === index ? null : index } });
  };

  if (!pattern) return null;

  return (
    <div className={styles.preview}>
      <p className={styles.title}>Preview 3x3</p>
      <div className={styles.container}>
        <svg className={styles.svg} viewBox={`0 0 ${tileWidth * 3 + pattern.gapX * 2} ${tileHeight * 3 + pattern.gapY * 2}`}>
          {tiles.map(t => (
            <g
              key={t.instanceIndex}
              className={state.selectedTileIndex === t.instanceIndex ? styles.tileSelected : styles.tile}
              transform={`translate(${t.x}, ${t.y}) scale(${t.scale}) rotate(${t.rotation})`}
              visibility={t.visible ? 'visible' : 'hidden'}
              onClick={() => handleTileClick(t.instanceIndex)}
            >
              {shapes.map((s: Shape) => (
                <path
                  key={s.id}
                  d={nodesToPathData(s.nodes, s.closed)}
                  fill={s.fill}
                  stroke={s.stroke}
                  strokeWidth={s.strokeWidth}
                  opacity={s.opacity}
                  visibility={s.visible ? 'visible' : 'hidden'}
                />
              ))}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
