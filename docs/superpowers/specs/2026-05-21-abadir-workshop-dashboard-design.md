# Abadir Workshop Dashboard — Design Spec

## Overview
Single-page dashboard that showcases 4 interactive web exercises (PatternExercice, Tipografia Cinetica, Testa, MANIONETTE) under the "Abadir Workshop" brand. Built with vanilla HTML/CSS/JS + Vite. Each exercise is embedded via iframe.

## Color Palette

| Role | Hex | Usage |
|------|-----|-------|
| Page background | `#0013ff` (Azul Eléctrico) | Main page background |
| Header | `#ff00f3` (Rosa) | Header bar, footer |
| Accent primary | `#c2ff06` (Lima) | Buttons, interactive elements |
| Card background | `#ffffff` (Blanco) | Card content areas |
| Strokes & text on light | `#000000` (Negro) | Borders, text on white |

## Typography

| Element | Font | Size | Case |
|---------|------|------|------|
| H1 (header title) | Boldense Regular | 48px | UPPERCASE |
| H2 (hero subtitle) | Boldense Regular | 24px | Sentence case |
| Card titles | Boldense Regular | 20px | UPPERCASE |
| Card descriptions | Helvetica Light | 14px | lowercase |
| Buttons | Helvetica Bold | 14px | — |
| Footer | Helvetica Light Italic | 12px | — |

Fonts loaded via `@font-face` for Boldense (WOFF2) and system fallback for Helvetica.

## Layout

### Header
- Background: Rosa `#ff00f3`, text white
- Left: "DUNA BLÁZQUEZ" in Boldense 48px
- Right: nav links (Inicio, Ejercicios, Contacto) with instant color inversion on hover

### Hero Section
- Background: Azul Eléctrico `#0013ff` with triangle pattern from `patrones.svg`
- Pattern animates with slow diagonal drift (CSS keyframes), accelerates 3x on hover
- "Abadir workshop" in white Boldense 24px
- Optional filter/search bar

### Exercise Grid
- 3-column CSS Grid (→ 2 cols at 768px → 1 col at 480px)
- Each card:
  - Background white, border 2px black
  - Header strip: simplified SVG triangle pattern (from `patrones.svg`)
  - Title (Boldense 20px uppercase, black)
  - Description (Helvetica Light 14px, black)
  - CTA button (Lima `#c2ff06` bg, black text, bold)
  - Hover: card lifts (translateY -4px), border → 4px, bg → `#0013ff`, text → white
  - Button hover: bg → Rosa `#ff00f3`, text → white

### Exercise Viewer
- Replaces grid section when a card is clicked
- "← Volver" button at top to return to grid
- Iframe fills the viewer area, loaded from each exercise's built `dist/` folder

### Footer
- Rosa `#ff00f3` background, white text
- Helvetica Light Italic 12pt

## Pattern Integration
- SVG triangle/diagonal patterns extracted from `patrones.svg`
- Hero: full pattern as CSS background-image with `@keyframes` diagonal scroll
- Card headers: inline SVG pattern clipped to header strip
- Viewer background: semi-transparent pattern overlay while iframe loads

## Responsive Breakpoints
- Desktop: 3-column grid, full sizes
- Tablet (max 768px): 2-column grid, H1 36px, H2 20px
- Mobile (max 480px): 1-column grid, H1 28px, H2 18px, hamburger nav

## Tech Stack
- Vite 6 (vanilla JS template)
- Vanilla JS for DOM manipulation (section swap, iframe loading, hover effects)
- CSS animations for pattern drift and card interactions
- No frameworks, no extra dependencies

## File Structure
```
/
├── index.html              # Main entry
├── vite.config.js          # Vite config
├── src/
│   ├── main.js             # App logic: nav, grid, viewer swap
│   ├── style.css           # All styles
│   └── patterns.js         # SVG pattern extraction & animation
├── public/
│   └── patrones.svg        # Source pattern SVG
├── Patternexercice/        # (existing)
├── tipografia cinetica/    # (existing)
├── testa/                  # (existing)
└── MANIONETTE/             # (existing)
```

## Edge Cases
- Iframe loading: show a "Cargando..." state with the pattern overlay
- Failed iframe (404/dead link): show an error state with retry button
- Empty search/filter results: show "No se encontraron ejercicios"
- Mobile nav: hamburger toggle with full-screen overlay menu
