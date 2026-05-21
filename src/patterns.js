export const heroPatternUrl = '/patrones-bg.svg';

export const cardTileSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 490" width="448" height="490">
  <polygon fill="#c2ff06" points="461.55 733.56 413.36 733.56 461.55 781.35 461.55 826.09 369.76 735.08 369.76 689.55 231.31 689.55 277.96 735.8 277.96 778.28 418.02 917.15 372.9 917.15 327.55 873.14 369.76 873.14 369.76 871.56 186.19 689.55 143.95 689.55 12.87 829.61 12.87 784.49 101.72 689.55 59.49 689.55 12.87 739.36 12.87 672.77 461.55 672.77 461.55 733.56" transform="translate(-12,-672)"/>
  <polygon fill="#ff00f3" points="98.83 873.14 186.17 779.82 186.17 734.69 56.59 873.14 98.83 873.14" transform="translate(-12,-672)"/>
  <polygon fill="#ff00f3" points="186.17 873.14 186.17 824.94 141.06 873.14 186.17 873.14" transform="translate(-12,-672)"/>
  <polygon fill="#0013ff" points="369.76 782.08 369.76 826.82 320.8 778.28 277.98 735.82 277.96 735.8 231.31 689.55 276.44 689.55 300.53 713.44 320.83 733.56 365.93 778.28 369.76 782.08" transform="translate(-12,-672)"/>
  <polygon fill="#0013ff" points="369.76 689.55 369.76 737.34 365.95 733.56 345.65 713.44 321.56 689.55 369.76 689.55" transform="translate(-12,-672)"/>
  <polygon fill="#0013ff" points="186.17 779.82 186.17 734.27 211.08 753.33 211.08 839.85 186.17 779.82" transform="translate(-12,-672)"/>
  <polygon fill="#ffffff" points="461.55 826.09 461.55 870.83 368.21 778.28 323.11 733.56 368.23 733.56 369.76 735.08 461.55 826.09" transform="translate(-12,-672)"/>
  <polygon fill="#ffffff" points="323.11 733.56 277.98 733.56 277.96 778.28 382.97 778.28 323.11 733.56" transform="translate(-12,-672)"/>
  <rect fill="#c2ff06" x="12.87" y="656.17" width="448.68" height="16.6" transform="translate(-12,-672)"/>
  <polygon fill="#0013ff" points="235.98 873.14 186.17 823.75 186.17 873.14 235.98 873.14" transform="translate(-12,-672)"/>
  <polygon fill="#0013ff" points="281.11 873.14 186.17 779.01 186.17 823.75 235.98 873.14 281.11 873.14" transform="translate(-12,-672)"/>
  <polygon fill="#ffffff" points="327.78 917.15 277.96 867.76 277.96 917.15 327.78 917.15" transform="translate(-12,-672)"/>
  <polygon fill="#ffffff" points="372.9 917.15 327.78 917.15 277.96 868.81 277.96 825.02 327.55 873.14 372.9 917.15" transform="translate(-12,-672)"/>
  <polygon fill="#ff00f3" points="186.17 734.69 277.96 825.02 277.96 868.81 186.17 779.01 186.17 734.69" transform="translate(-12,-672)"/>
  <rect fill="#ffffff" x="0" y="656.17" width="1463.01" height="16.6" transform="translate(-12,-672)"/>
</svg>`;

export function cardTileCSS() {
  const encoded = encodeURIComponent(cardTileSVG);
  return {
    backgroundImage: `url("data:image/svg+xml,${encoded}")`,
    backgroundSize: '224px 245px',
    backgroundRepeat: 'repeat',
  };
}

export function applyPatternBackground(element, options = {}) {
  const { backgroundSize = '224px 245px' } = options;
  const css = cardTileCSS();
  element.style.backgroundImage = css.backgroundImage;
  element.style.backgroundSize = backgroundSize;
  element.style.backgroundRepeat = css.backgroundRepeat;
}
