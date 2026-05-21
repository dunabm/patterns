import type { Point, Shape } from '../types';

export const SNAP_THRESHOLD = 8;

function distance(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function snapPoint(point: Point, anchors: Point[]): Point {
  let closest: Point | null = null;
  let minDist = SNAP_THRESHOLD;
  for (const anchor of anchors) {
    const d = distance(point, anchor);
    if (d < minDist) {
      minDist = d;
      closest = anchor;
    }
  }
  return closest ?? point;
}

export function getAnchorPoints(shapes: Shape[]): Point[] {
  const anchors: Point[] = [];
  for (const shape of shapes) {
    for (const node of shape.nodes) {
      anchors.push(node.point);
    }
  }
  return anchors;
}
