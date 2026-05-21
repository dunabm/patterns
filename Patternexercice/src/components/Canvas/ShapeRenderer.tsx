import type { Shape } from '../../types';
import { nodesToPathData } from '../../utils/pathUtils';

interface ShapeRendererProps {
  shape: Shape;
  isSelected: boolean;
}

export function ShapeRenderer({ shape, isSelected }: ShapeRendererProps) {
  const { nodes, closed, fill, stroke, strokeWidth, opacity, transform, visible } = shape;
  const d = nodesToPathData(nodes, closed);
  const transformStr = `translate(${transform.x},${transform.y}) rotate(${transform.rotation}) scale(${transform.scaleX},${transform.scaleY})`;

  return (
    <g transform={transformStr} visibility={visible ? 'visible' : 'hidden'}>
      <path
        d={d}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        opacity={opacity}
      />
      {isSelected && (
        <path
          d={d}
          fill="none"
          stroke="#0078d7"
          strokeWidth={strokeWidth + 2}
          strokeDasharray="4 4"
          opacity={0.5}
          pointerEvents="none"
        />
      )}
    </g>
  );
}
