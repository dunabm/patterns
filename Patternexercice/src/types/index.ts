export interface Point {
  x: number;
  y: number;
}

export interface BezierNode {
  point: Point;
  cp1: Point;
  cp2: Point;
}

export interface Shape {
  id: string;
  nodes: BezierNode[];
  closed: boolean;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  transform: {
    x: number;
    y: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
  };
  visible: boolean;
  locked: boolean;
}

export type LayoutType = 'grid' | 'brick' | 'diamond' | 'hex' | 'mirror';

export interface TileOverride {
  instanceIndex: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  visible: boolean;
}

export interface PatternRule {
  layout: LayoutType;
  gapX: number;
  gapY: number;
  scale: number;
  rotation: number;
  randomOffset: number;
  tileOverrides: TileOverride[];
}

export interface AppState {
  name: string;
  tileWidth: number;
  tileHeight: number;
  shapes: Shape[];
  selectedShapeId: string | null;
  selectedTileIndex: number | null;
  pattern: PatternRule | null;
  tool: 'pen' | 'select' | 'pan';
}
