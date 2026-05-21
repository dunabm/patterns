# Tipografía Cinética: Alcachofa

## Resumen
Herramienta web independiente que anima la palabra "ALCACHOFA" con tipografía cinética. La palabra brota como un conjunto desde la tierra (conceptual) y luego se deshoja letra por letra, evocando el ciclo de una alcachofa: crecer y ser preparada para cocinar.

## Stack
- React + Vite (sin TypeScript)
- GSAP para animaciones
- Google Fonts (Montserrat)
- Sin otras dependencias

## Componentes
- `App.jsx` — renderiza `<KineticText />` centrado en la pantalla
- `KineticText.jsx` — lógica de animación con GSAP timeline
- `KineticText.css` — estilos base

## Flujo de animación (auto-loop)

### 1. Sprout (~2s)
El conjunto "ALCACHOFA" emerge desde abajo del viewport (`y: 100` → `y: 0`) con `scale(0.3 → 1)` y `opacity(0 → 1)`. Easing `power3.out`. Las letras tienen un degradado vertical: marrón/terracota en la base → verde musgo en la parte superior.

### 2. Display (~1.5s)
Pausa. La palabra se muestra completa con color verde vibrante y sombra suave.

### 3. Peel (~4.5s, ~0.5s por letra)
Cada letra se deshoja individualmente en orden (A1, L, C, A2, C, H, O, F, A3):
- Separa hacia la derecha/abajo con rotación ~15-20deg
- Color muta: verde vibrante → ocre/marrón claro → casi blanco/transparente
- Letra se vuelve un "fantasma" (outline fino, fill vacío)
- Letra se desvanece y "cae" fuera de pantalla

Usar `stagger: 0.5` en GSAP para secuenciar las 9 letras.

### 4. Reset (~0.5s)
Transición instantánea al estado inicial. `repeatDelay: 1`. El loop se repite con `repeat: -1`.

## Estética
- Fondo oscuro (#1a1a1a)
- Tipografía sans-serif bold (Montserrat)
- Letras son `<span>` individuales dentro de un `flex` container centrado
- Paleta verde-tierra: marrón/terracota → verde musgo → ocre → pálido/transparente

## Estructura de archivos
```
/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── KineticText.jsx
│   └── KineticText.css
└── docs/superpowers/specs/2026-05-19-alcachofa-tipografia-cinetica-design.md
```
