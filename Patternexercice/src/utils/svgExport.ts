import type { AppState } from '../types';
import { nodesToPathData } from './pathUtils';
import { generateTileLayout } from '../engine/patternEngine';

export function projectToSvg(state: AppState): string {
  const { tileWidth, tileHeight, shapes, pattern } = state;
  const vbW = pattern ? tileWidth * 3 + pattern.gapX * 2 : tileWidth;
  const vbH = pattern ? tileHeight * 3 + pattern.gapY * 2 : tileHeight;

  let defs = '';
  let body = '';

  if (pattern) {
    defs = '  <defs>\n';
    shapes.forEach(s => {
      const d = nodesToPathData(s.nodes, s.closed);
      defs += `    <path id="${s.id}" d="${d}" fill="${s.fill}" stroke="${s.stroke}" stroke-width="${s.strokeWidth}" opacity="${s.opacity}" />\n`;
    });
    defs += '  </defs>\n';

    const tiles = generateTileLayout(pattern, tileWidth, tileHeight, 3, 3);
    tiles.forEach(t => {
      if (!t.visible) return;
      body += `  <g transform="translate(${t.x},${t.y}) scale(${t.scale}) rotate(${t.rotation})">\n`;
      shapes.forEach(s => {
        body += `    <use href="#${s.id}" />\n`;
      });
      body += '  </g>\n';
    });
  } else {
    shapes.forEach(s => {
      const d = nodesToPathData(s.nodes, s.closed);
      const tx = s.transform;
      const transform = `translate(${tx.x},${tx.y}) rotate(${tx.rotation}) scale(${tx.scaleX},${tx.scaleY})`;
      body += `  <g transform="${transform}" visibility="${s.visible ? 'visible' : 'hidden'}">\n`;
      body += `    <path d="${d}" fill="${s.fill}" stroke="${s.stroke}" stroke-width="${s.strokeWidth}" opacity="${s.opacity}" />\n`;
      body += '  </g>\n';
    });
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vbW} ${vbH}" width="${vbW}" height="${vbH}">\n${defs}${body}</svg>`;
}

export function downloadSvg(state: AppState): void {
  const svg = projectToSvg(state);
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${state.name || 'pattern'}.svg`;
  a.click();
  URL.revokeObjectURL(url);
}
