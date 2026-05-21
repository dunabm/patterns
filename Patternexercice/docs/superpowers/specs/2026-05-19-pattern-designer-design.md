# Pattern Designer — Herramienta Web de Patrones Vectoriales

## Resumen

Herramienta web pública para que diseñadores creen patrones vectoriales orgánicos. Combina un editor de curvas bezier con un motor semi-automático de generación de patrones seamless. Exporta a SVG estándar.

## Stack tecnológico

- **Framework:** React (con hooks para estado)
- **Renderizado:** SVG nativo en el DOM (cada forma es un elemento `<path>`)
- **Estilos:** CSS Modules o Tailwind CSS
- **Build:** Vite
- **Testing:** Vitest + React Testing Library

## Arquitectura

Dos subsistemas comunicados por un modelo de datos compartido:

```
Editor Vectorial ──▶ Motor de Patrón ──▶ Preview/Export SVG
       │                    │
       └──── Modelo de datos compartido ────┘
```

No hay backend — toda la lógica corre en el cliente. El estado se maneja con React Context + useReducer.

## Editor Vectorial

### Canvas SVG
- Viewport que renderiza elementos `<path>` directamente
- Soporta zoom y pan

### Toolbar
- **Pluma (bezier):** clic para añadir puntos, handles de control para curvatura
- **Selección:** click en una forma para seleccionarla
- **Mover nodo:** arrastrar puntos existentes
- **Borrar:** eliminar forma o nodo seleccionado
- **Zoom/Pan:** navegación del canvas



### Sidebar de Propiedades
- Color de relleno y trazo
- Grosor de trazo
- Opacidad
- Transformaciones (posición, rotación, escala)

### Layer Panel
- Lista de formas con toggle de visibilidad
- Reordenar arrastrando
- Agrupar/desagrupar

### Historial (Undo/Redo)
- Pila de estados del modelo
- Atajos de teclado (Ctrl+Z / Ctrl+Shift+Z)

## Modelo de Datos

```typescript
interface Point { x: number; y: number }

interface Shape {
  id: string;
  type: 'path' | 'circle' | 'rect';
  pathData: string;           // SVG path commands (M, C, S, Q, etc.)
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  transform: {
    x: number; y: number;
    rotation: number;
    scaleX: number; scaleY: number;
  };
  visible: boolean;
  locked: boolean;
}

interface TileOverride {
  instanceIndex: number;       // índice (fila * totalCols + col)
  x: number; y: number;         // desplazamiento propio
  rotation: number;             // rotación propia (°)
  scale: number;                // escala propia
  visible: boolean;
}

interface PatternRule {
  layout: 'grid' | 'brick' | 'diamond' | 'hex' | 'mirror';
  gapX: number;
  gapY: number;
  scale: number;
  rotation: number;
  randomOffset: number;
  tileOverrides: TileOverride[];
}

interface Project {
  name: string;
  tileWidth: number;
  tileHeight: number;
  shapes: Shape[];
  pattern: PatternRule | null;
}
```

## Motor de Patrón Seamless

### Funcionamiento
- Toma las shapes seleccionadas del editor
- Aplica la regla de repetición elegida
- Genera un grupo SVG con `<defs>` + `<use>` para cada tile

### Layouts Soportados
- **Grid:** repetición rectilínea simple
- **Brick (offset):** filas alternadas
- **Diamond:** 45º con bounding box rotado
- **Hex:** empaquetamiento hexagonal
- **Mirror:** simetría espejada horizontal/vertical

### Ajustes
- Espaciado entre tiles (gap X/Y)
- Escala del tile
- Rotación por tile
- Desplazamiento aleatorio controlado (%)

### Smart Snapping
- Detecta bordes cercanos entre formas adyacentes
- Sugiere alineaciones para que el tile sea seamless
- No obligatorio, el usuario puede desactivarlo

### Generación de Variaciones
- Botón "Generar 5 variaciones"
- La herramienta combina aleatoriamente los ajustes dentro de rangos definidos
- El usuario elige una y la aplica

## Preview y Exportación

### Preview
- Muestra 3×3 tiles del patrón aplicado
- Se actualiza en tiempo real al cambiar ajustes
- Cada tile es un `<g>` clickeable
- Al hacer clic en un tile, la sidebar muestra sus overrides (posición, rotación, escala propios)
- Botón "Reset" por override para volver al valor base del patrón

### Exportación
- Serializa el proyecto completo a un SVG estándar
- `<defs>` con las formas originales
- `<g>` con `<use>` para cada tile (con overrides inline si los tiene)
- Atributos viewBox, width, height correctos
- Descarga directa como archivo `.svg`

## UX / Flujo del Usuario

1. El usuario abre la herramienta (sin registro, sin backend)
2. Dibuja formas orgánicas con la herramienta pluma
3. Ajusta propiedades (color, trazo, etc.) desde la sidebar
4. Selecciona formas y activa el modo patrón
5. Elige layout y ajustes; el preview 3×3 se actualiza
6. Opcional: edita formas originales — los cambios se reflejan en todas las repeticiones
7. Opcional: hace clic en un tile individual del preview y ajusta su override (posición, rotación, escala)
8. Opcional: pide variaciones automáticas
9. Exporta como SVG

## Criterios de Éxito

- Editor de curvas bezier funcional con handles de control
- Al menos 5 layouts de repetición seamless
- Preview en tiempo real del patrón 3×3
- Exportación SVG válida y descargable
- Sin backend — 100% cliente
- Funcional en navegadores modernos (Chrome, Firefox, Safari)

## No Incluye (YAGNI)

- Autenticación / usuarios
- Guardado en servidor
- Exportación a PNG (solo SVG)
- Plugins / extensiones
- Colaboración en tiempo real
