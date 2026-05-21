import type { BezierNode, Point } from '../types';

export function nodesToPathData(nodes: BezierNode[], closed: boolean): string {
  if (nodes.length === 0) return '';
  let d = `M ${nodes[0].point.x} ${nodes[0].point.y}`;
  for (let i = 1; i < nodes.length; i++) {
    const { point, cp1, cp2 } = nodes[i];
    d += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${point.x} ${point.y}`;
  }
  if (closed && nodes.length > 2) {
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    d += ` C ${last.cp2.x} ${last.cp2.y}, ${first.cp1.x} ${first.cp1.y}, ${first.point.x} ${first.point.y} Z`;
  }
  return d;
}

export function pointDistance(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function closestNodeIndex(nodes: BezierNode[], target: Point): number {
  let minDist = Infinity;
  let minIdx = 0;
  nodes.forEach((n, i) => {
    const d = pointDistance(n.point, target);
    if (d < minDist) { minDist = d; minIdx = i; }
  });
  return minIdx;
}
