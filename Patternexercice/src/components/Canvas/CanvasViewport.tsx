import { useState, useCallback, useRef } from 'react';
import { useProject } from '../../store/ProjectContext';
import { ShapeRenderer } from './ShapeRenderer';
import { snapPoint, getAnchorPoints } from '../../utils/snapping';
import type { BezierNode, Shape } from '../../types';
import styles from './CanvasViewport.module.css';

export function CanvasViewport() {
  const { state, dispatch } = useProject();
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 800, h: 600 });
  const [panning, setPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, vbX: 0, vbY: 0 });
  const [draftNodes, setDraftNodes] = useState<BezierNode[]>([]);
  const [draftClosed, setDraftClosed] = useState(false);

  const screenToSvg = useCallback((clientX: number, clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: ((clientX - rect.left) / rect.width) * viewBox.w + viewBox.x,
      y: ((clientY - rect.top) / rect.height) * viewBox.h + viewBox.y,
    };
  }, [viewBox]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const scale = e.deltaY > 0 ? 1.1 : 0.9;
    setViewBox(vb => ({ ...vb, w: vb.w * scale, h: vb.h * scale }));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (state.tool === 'pan') {
      setPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY, vbX: viewBox.x, vbY: viewBox.y };
      return;
    }
    if (state.tool === 'pen') {
      const pt = screenToSvg(e.clientX, e.clientY);
      const anchors = getAnchorPoints(state.shapes.filter((s: Shape) => s.visible));
      const snapped = snapPoint(pt, anchors);
      setDraftNodes(prev => [...prev, { point: snapped, cp1: snapped, cp2: snapped }]);
      return;
    }
    if (state.tool === 'select') {
      const pt = screenToSvg(e.clientX, e.clientY);
      const hit = [...state.shapes].reverse().find((s: Shape) => {
        const bounds = s.nodes.reduce(
          (acc: { minX: number; minY: number; maxX: number; maxY: number }, n: BezierNode) => ({
            minX: Math.min(acc.minX, n.point.x),
            minY: Math.min(acc.minY, n.point.y),
            maxX: Math.max(acc.maxX, n.point.x),
            maxY: Math.max(acc.maxY, n.point.y),
          }),
          { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
        );
        const margin = 10;
        return pt.x >= bounds.minX - margin && pt.x <= bounds.maxX + margin &&
               pt.y >= bounds.minY - margin && pt.y <= bounds.maxY + margin;
      });
      dispatch({ type: 'SET_SELECTED_SHAPE', payload: { id: hit?.id ?? null } });
    }
  }, [state.tool, state.shapes, viewBox, screenToSvg, dispatch]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!panning) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setViewBox(vb => ({ ...vb, x: panStart.current.vbX - dx, y: panStart.current.vbY - dy }));
  }, [panning]);

  const handleMouseUp = useCallback(() => setPanning(false), []);

  const handleDblClick = useCallback(() => {
    if (state.tool !== 'pen' || draftNodes.length < 2) return;
    dispatch({ type: 'ADD_SHAPE', payload: { nodes: draftNodes, closed: draftClosed } });
    setDraftNodes([]);
    setDraftClosed(false);
  }, [state.tool, draftNodes, draftClosed, dispatch]);

  return (
    <div className={styles.viewport}>
      <svg
        ref={svgRef}
        className={styles.svg}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDblClick}
      >
        {state.shapes.map((s: Shape) => (
          <ShapeRenderer key={s.id} shape={s} isSelected={s.id === state.selectedShapeId} />
        ))}
        {draftNodes.length > 0 && (
          <g>
            {draftNodes.map((n, i) => (
              <circle key={i} cx={n.point.x} cy={n.point.y} r={4} fill="#0078d7" />
            ))}
            {draftNodes.map((n, i) => (
              i > 0 ? (
                <line
                  key={`l${i}`}
                  x1={draftNodes[i-1].point.x} y1={draftNodes[i-1].point.y}
                  x2={n.point.x} y2={n.point.y}
                  stroke="#0078d7" strokeWidth={1} strokeDasharray="3 3"
                />
              ) : null
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
