import type { PatternRule } from '../types';

export interface TileInstance {
  col: number;
  row: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  visible: boolean;
  instanceIndex: number;
}

export function generateTileLayout(
  rule: PatternRule,
  tileW: number,
  tileH: number,
  cols: number,
  rows: number,
): TileInstance[] {
  const tiles: TileInstance[] = [];
  const gapX = rule.gapX;
  const gapY = rule.gapY;
  const stepX = tileW + gapX;
  const stepY = tileH + gapY;
  const halfStepX = stepX / 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col;
      let x: number;
      let y: number;

      switch (rule.layout) {
        case 'grid':
          x = col * stepX;
          y = row * stepY;
          break;
        case 'brick':
          x = col * stepX + (row % 2 === 1 ? halfStepX : 0);
          y = row * stepY;
          break;
        case 'diamond':
          x = col * stepX + (row % 2 === 1 ? halfStepX : 0);
          y = row * stepY * 0.5;
          break;
        case 'hex':
          x = col * stepX * 0.75;
          y = row * stepY + (col % 2 === 1 ? stepY * 0.5 : 0);
          break;
        case 'mirror':
          x = col * stepX;
          y = row * stepY;
          break;
        default:
          x = col * stepX;
          y = row * stepY;
      }

      const override = rule.tileOverrides.find(t => t.instanceIndex === index);
      const ro = rule.randomOffset > 0
        ? { x: (Math.random() - 0.5) * rule.randomOffset, y: (Math.random() - 0.5) * rule.randomOffset }
        : { x: 0, y: 0 };

      tiles.push({
        col,
        row,
        instanceIndex: index,
        x: override ? override.x : x + ro.x,
        y: override ? override.y : y + ro.y,
        rotation: override ? override.rotation : rule.rotation,
        scale: override ? override.scale : rule.scale,
        visible: override ? override.visible : true,
      });
    }
  }

  return tiles;
}
