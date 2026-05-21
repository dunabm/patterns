# Pattern Designer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a web tool for designing organic vector patterns with a bezier editor and seamless pattern generator.

**Architecture:** React + Vite + TypeScript, SVG-native rendering, state managed via Context + useReducer, pattern engine as pure logic functions.

**Tech Stack:** React 18, Vite, TypeScript, Vitest, CSS Modules

---

## File Structure

```
patternexercice/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── package.json
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── App.module.css
│   ├── types/index.ts
│   ├── store/
│   │   ├── ProjectContext.tsx
│   │   ├── projectReducer.ts
│   │   └── projectReducer.test.ts
│   ├── hooks/
│   │   ├── useHistory.ts
│   │   └── useHistory.test.ts
│   ├── utils/
│   │   ├── pathUtils.ts
│   │   ├── pathUtils.test.ts
│   │   ├── svgExport.ts
│   │   ├── svgExport.test.ts
│   │   ├── snapping.ts
│   │   └── snapping.test.ts
│   ├── engine/
│   │   ├── patternEngine.ts
│   │   └── patternEngine.test.ts
│   ├── components/
│   │   ├── Canvas/
│   │   │   ├── CanvasViewport.tsx
│   │   │   ├── CanvasViewport.module.css
│   │   │   ├── ShapeRenderer.tsx
│   │   │   └── ShapeRenderer.test.tsx
│   │   ├── Toolbar/
│   │   │   ├── Toolbar.tsx
│   │   │   ├── Toolbar.module.css
│   │   │   ├── PenTool.tsx
│   │   │   ├── SelectTool.tsx
│   │   │   └── tools.test.tsx
│   │   ├── Sidebar/
│   │   │   ├── PropertiesPanel.tsx
│   │   │   ├── PropertiesPanel.module.css
│   │   │   ├── LayerPanel.tsx
│   │   │   ├── LayerPanel.module.css
│   │   │   ├── TileOverridePanel.tsx
│   │   │   └── TileOverridePanel.module.css
│   │   ├── Pattern/
│   │   │   ├── PatternControls.tsx
│   │   │   ├── PatternControls.module.css
│   │   │   ├── PatternPreview.tsx
│   │   │   └── PatternPreview.module.css
│   │   └── Export/
│   │       ├── ExportButton.tsx
│   │       └── ExportButton.module.css
│   └── App.module.css
```

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `index.html`
- Create: `src/main.tsx`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "pattern-designer",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 2: Create vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" }
  ]
}
```

- [ ] **Step 4: Create tsconfig.app.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

- [ ] **Step 5: Create index.html**

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pattern Designer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Create src/main.tsx**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 7: Install dependencies**

Run:
```bash
npm install react react-dom
npm install -D typescript @types/react @types/react-dom @vitejs/plugin-react vite vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 8: Add vitest config to vite.config.ts**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
  },
});
```

- [ ] **Step 9: Verify it works**

Run:
```bash
npx tsc -b && npx vite build
```
Expected: Build succeeds, no errors.

- [ ] **Step 10: Commit**

```bash
git init && git add -A && git commit -m "feat: scaffold Vite + React + TypeScript project"
```

---

### Task 2: Type Definitions

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Write the types**

```typescript
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

export interface HistoryEntry {
  state: AppState;
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
```

- [ ] **Step 2: Write a quick type-check**

Run:
```bash
npx tsc --noEmit src/types/index.ts
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add TypeScript type definitions"
```

---

### Task 3: State Management — Reducer + Context

**Files:**
- Create: `src/store/projectReducer.ts`
- Create: `src/store/projectReducer.test.ts`
- Create: `src/store/ProjectContext.tsx`

- [ ] **Step 1: Write the failing test**

File: `src/store/projectReducer.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { projectReducer, initialState } from './projectReducer';

describe('projectReducer', () => {
  it('returns initial state for unknown action', () => {
    const state = projectReducer(undefined, { type: 'UNKNOWN' } as any);
    expect(state.shapes).toEqual([]);
    expect(state.tool).toBe('pen');
  });

  it('handles ADD_SHAPE', () => {
    const state = projectReducer(initialState(), {
      type: 'ADD_SHAPE',
      payload: { nodes: [{ point: { x: 0, y: 0 }, cp1: { x: 0, y: 0 }, cp2: { x: 0, y: 0 } }], closed: false },
    });
    expect(state.shapes).toHaveLength(1);
    expect(state.shapes[0].nodes).toHaveLength(1);
  });

  it('handles UPDATE_SHAPE', () => {
    const addState = projectReducer(initialState(), {
      type: 'ADD_SHAPE',
      payload: { nodes: [{ point: { x: 0, y: 0 }, cp1: { x: 0, y: 0 }, cp2: { x: 0, y: 0 } }], closed: false },
    });
    const shapeId = addState.shapes[0].id;
    const updated = projectReducer(addState, {
      type: 'UPDATE_SHAPE',
      payload: { id: shapeId, changes: { fill: '#ff0000' } },
    });
    expect(updated.shapes[0].fill).toBe('#ff0000');
  });

  it('handles DELETE_SHAPE', () => {
    const addState = projectReducer(initialState(), {
      type: 'ADD_SHAPE',
      payload: { nodes: [{ point: { x: 0, y: 0 }, cp1: { x: 0, y: 0 }, cp2: { x: 0, y: 0 } }], closed: false },
    });
    const shapeId = addState.shapes[0].id;
    const deleted = projectReducer(addState, { type: 'DELETE_SHAPE', payload: { id: shapeId } });
    expect(deleted.shapes).toHaveLength(0);
  });

  it('handles SET_TOOL', () => {
    const state = projectReducer(initialState(), { type: 'SET_TOOL', payload: 'select' });
    expect(state.tool).toBe('select');
  });

  it('handles SET_PATTERN', () => {
    const state = projectReducer(initialState(), {
      type: 'SET_PATTERN',
      payload: { layout: 'grid', gapX: 10, gapY: 10, scale: 1, rotation: 0, randomOffset: 0, tileOverrides: [] },
    });
    expect(state.pattern?.layout).toBe('grid');
  });

  it('handles REORDER_SHAPES', () => {
    const s1 = projectReducer(initialState(), {
      type: 'ADD_SHAPE',
      payload: { nodes: [{ point: { x: 0, y: 0 }, cp1: { x: 0, y: 0 }, cp2: { x: 0, y: 0 } }], closed: false },
    });
    const s2 = projectReducer(s1, {
      type: 'ADD_SHAPE',
      payload: { nodes: [{ point: { x: 1, y: 1 }, cp1: { x: 0, y: 0 }, cp2: { x: 0, y: 0 } }], closed: false },
    });
    const ids = s2.shapes.map(s => s.id);
    const reordered = projectReducer(s2, { type: 'REORDER_SHAPES', payload: { shapeIds: [ids[1], ids[0]] } });
    expect(reordered.shapes[0].id).toBe(ids[1]);
    expect(reordered.shapes[1].id).toBe(ids[0]);
  });

  it('handles SET_SELECTED_SHAPE', () => {
    const addState = projectReducer(initialState(), {
      type: 'ADD_SHAPE',
      payload: { nodes: [{ point: { x: 0, y: 0 }, cp1: { x: 0, y: 0 }, cp2: { x: 0, y: 0 } }], closed: false },
    });
    const shapeId = addState.shapes[0].id;
    const selected = projectReducer(addState, { type: 'SET_SELECTED_SHAPE', payload: { id: shapeId } });
    expect(selected.selectedShapeId).toBe(shapeId);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run:
```bash
npx vitest run src/store/projectReducer.test.ts --reporter=verbose
```
Expected: FAIL — "Cannot find module './projectReducer'"

- [ ] **Step 3: Write the implementation**

File: `src/store/projectReducer.ts`

```typescript
import type { AppState, Shape, BezierNode, PatternRule } from '../types';

let nextId = 1;
function generateId(): string {
  return `shape_${nextId++}`;
}

export function initialState(): AppState {
  return {
    name: 'Sin título',
    tileWidth: 200,
    tileHeight: 200,
    shapes: [],
    selectedShapeId: null,
    selectedTileIndex: null,
    pattern: null,
    tool: 'pen',
  };
}

export type Action =
  | { type: 'ADD_SHAPE'; payload: { nodes: BezierNode[]; closed: boolean } }
  | { type: 'UPDATE_SHAPE'; payload: { id: string; changes: Partial<Shape> } }
  | { type: 'DELETE_SHAPE'; payload: { id: string } }
  | { type: 'SET_TOOL'; payload: AppState['tool'] }
  | { type: 'SET_PATTERN'; payload: PatternRule | null }
  | { type: 'REORDER_SHAPES'; payload: { shapeIds: string[] } }
  | { type: 'SET_SELECTED_SHAPE'; payload: { id: string | null } }
  | { type: 'SET_SELECTED_TILE'; payload: { index: number | null } }
  | { type: 'UPDATE_TILE_OVERRIDE'; payload: { index: number; changes: Partial<import('../types').TileOverride> } }
  | { type: 'SET_PROJECT_NAME'; payload: string }
  | { type: 'RESTORE'; payload: AppState };

export function projectReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_SHAPE': {
      const newShape: Shape = {
        id: generateId(),
        nodes: action.payload.nodes,
        closed: action.payload.closed,
        fill: '#cccccc',
        stroke: '#333333',
        strokeWidth: 2,
        opacity: 1,
        transform: { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1 },
        visible: true,
        locked: false,
      };
      return { ...state, shapes: [...state.shapes, newShape] };
    }
    case 'UPDATE_SHAPE':
      return {
        ...state,
        shapes: state.shapes.map(s => (s.id === action.payload.id ? { ...s, ...action.payload.changes } : s)),
      };
    case 'DELETE_SHAPE':
      return {
        ...state,
        shapes: state.shapes.filter(s => s.id !== action.payload.id),
        selectedShapeId: state.selectedShapeId === action.payload.id ? null : state.selectedShapeId,
      };
    case 'SET_TOOL':
      return { ...state, tool: action.payload };
    case 'SET_PATTERN':
      return { ...state, pattern: action.payload };
    case 'REORDER_SHAPES':
      return { ...state, shapes: action.payload.shapeIds.map(id => state.shapes.find(s => s.id === id)!).filter(Boolean) };
    case 'SET_SELECTED_SHAPE':
      return { ...state, selectedShapeId: action.payload.id };
    case 'SET_SELECTED_TILE':
      return { ...state, selectedTileIndex: action.payload.index };
    case 'UPDATE_TILE_OVERRIDE': {
      if (!state.pattern) return state;
      return {
        ...state,
        pattern: {
          ...state.pattern,
          tileOverrides: state.pattern.tileOverrides.some(t => t.instanceIndex === action.payload.index)
            ? state.pattern.tileOverrides.map(t =>
                t.instanceIndex === action.payload.index ? { ...t, ...action.payload.changes } : t
              )
            : [...state.pattern.tileOverrides, { instanceIndex: action.payload.index, x: 0, y: 0, rotation: 0, scale: 1, visible: true, ...action.payload.changes }],
        },
      };
    }
    case 'SET_PROJECT_NAME':
      return { ...state, name: action.payload };
    case 'RESTORE':
      return action.payload;
    default:
      return state;
  }
}
```

- [ ] **Step 4: Run tests**

Run:
```bash
npx vitest run src/store/projectReducer.test.ts --reporter=verbose
```
Expected: All tests PASS.

- [ ] **Step 5: Write the Context**

File: `src/store/ProjectContext.tsx`

```tsx
import { createContext, useContext, useReducer, type ReactNode } from 'react';
import { projectReducer, initialState } from './projectReducer';
import type { AppState, Action } from './projectReducer';

const ProjectContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, undefined, initialState);
  return <ProjectContext.Provider value={{ state, dispatch }}>{children}</ProjectContext.Provider>;
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject must be used within ProjectProvider');
  return ctx;
}
```

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add project reducer and context"
```

---

### Task 4: Path Utilities

**Files:**
- Create: `src/utils/pathUtils.ts`
- Create: `src/utils/pathUtils.test.ts`

- [ ] **Step 1: Write the failing test**

File: `src/utils/pathUtils.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { nodesToPathData, pathDataToNodes, pointDistance, closestNodeIndex } from './pathUtils';

describe('nodesToPathData', () => {
  it('converts a single node to M + C path', () => {
    const nodes = [{ point: { x: 10, y: 20 }, cp1: { x: 5, y: 10 }, cp2: { x: 15, y: 30 } }];
    expect(nodesToPathData(nodes, false)).toMatch(/^M 10 20/);
  });

  it('produces a closed path with Z', () => {
    const nodes = [
      { point: { x: 0, y: 0 }, cp1: { x: 0, y: 0 }, cp2: { x: 0, y: 0 } },
      { point: { x: 100, y: 0 }, cp1: { x: 100, y: 0 }, cp2: { x: 100, y: 0 } },
      { point: { x: 100, y: 100 }, cp1: { x: 100, y: 100 }, cp2: { x: 100, y: 100 } },
    ];
    const d = nodesToPathData(nodes, true);
    expect(d.endsWith('Z')).toBe(true);
  });
});

describe('pointDistance', () => {
  it('returns correct distance between two points', () => {
    expect(pointDistance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });
});

describe('closestNodeIndex', () => {
  it('returns index of closest node', () => {
    const nodes = [
      { point: { x: 0, y: 0 }, cp1: { x: 0, y: 0 }, cp2: { x: 0, y: 0 } },
      { point: { x: 100, y: 100 }, cp1: { x: 100, y: 100 }, cp2: { x: 100, y: 100 } },
    ];
    expect(closestNodeIndex(nodes, { x: 95, y: 95 })).toBe(1);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run:
```bash
npx vitest run src/utils/pathUtils.test.ts --reporter=verbose
```
Expected: FAIL — "Cannot find module './pathUtils'"

- [ ] **Step 3: Write the implementation**

File: `src/utils/pathUtils.ts`

```typescript
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
```

- [ ] **Step 4: Run tests**

Run:
```bash
npx vitest run src/utils/pathUtils.test.ts --reporter=verbose
```
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add path utilities"
```

---

### Task 5: History Hook (Undo/Redo)

**Files:**
- Create: `src/hooks/useHistory.ts`
- Create: `src/hooks/useHistory.test.ts`

- [ ] **Step 1: Write the failing test**

File: `src/hooks/useHistory.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHistory } from './useHistory';
import type { AppState } from '../types';

const mockState: AppState = {
  name: 'test',
  tileWidth: 200,
  tileHeight: 200,
  shapes: [],
  selectedShapeId: null,
  selectedTileIndex: null,
  pattern: null,
  tool: 'pen',
};

const mockState2: AppState = { ...mockState, name: 'changed' };

describe('useHistory', () => {
  it('starts with no undo or redo', () => {
    const { result } = renderHook(() => useHistory(mockState));
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it('push enables undo', () => {
    const { result } = renderHook(() => useHistory(mockState));
    act(() => result.current.push(mockState2));
    expect(result.current.canUndo).toBe(true);
  });

  it('undo returns previous state', () => {
    const { result } = renderHook(() => useHistory(mockState));
    act(() => result.current.push(mockState2));
    const undone = result.current.undo();
    expect(undone?.name).toBe('test');
  });

  it('redo returns next state after undo', () => {
    const { result } = renderHook(() => useHistory(mockState));
    act(() => result.current.push(mockState2));
    result.current.undo();
    const redone = result.current.redo();
    expect(redone?.name).toBe('changed');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run:
```bash
npx vitest run src/hooks/useHistory.test.ts --reporter=verbose
```
Expected: FAIL — "Cannot find module './useHistory'"

- [ ] **Step 3: Write the implementation**

File: `src/hooks/useHistory.ts`

```typescript
import { useState, useCallback } from 'react';
import type { AppState } from '../types';

const MAX_HISTORY = 50;

export function useHistory(initialState: AppState) {
  const [past, setPast] = useState<AppState[]>([]);
  const [future, setFuture] = useState<AppState[]>([]);
  const [current, setCurrent] = useState<AppState>(initialState);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const push = useCallback((state: AppState) => {
    setPast(p => [...p.slice(-MAX_HISTORY + 1), state]);
    setFuture([]);
    setCurrent(state);
  }, []);

  const undo = useCallback(() => {
    if (past.length === 0) return null;
    const previous = past[past.length - 1];
    setPast(p => p.slice(0, -1));
    setFuture(f => [...f, current]);
    setCurrent(previous);
    return previous;
  }, [past, current]);

  const redo = useCallback(() => {
    if (future.length === 0) return null;
    const next = future[future.length - 1];
    setFuture(f => f.slice(0, -1));
    setPast(p => [...p, current]);
    setCurrent(next);
    return next;
  }, [future, current]);

  return { canUndo, canRedo, push, undo, redo };
}
```

- [ ] **Step 4: Run tests**

Run:
```bash
npx vitest run src/hooks/useHistory.test.ts --reporter=verbose
```
Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add undo/redo history hook"
```

---

### Task 6: Canvas Viewport and Shape Renderer

**Files:**
- Create: `src/components/Canvas/CanvasViewport.tsx`
- Create: `src/components/Canvas/CanvasViewport.module.css`
- Create: `src/components/Canvas/ShapeRenderer.tsx`
- Create: `src/components/Canvas/ShapeRenderer.test.tsx`

- [ ] **Step 1: Write ShapeRenderer test**

File: `src/components/Canvas/ShapeRenderer.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ShapeRenderer } from './ShapeRenderer';
import type { Shape } from '../../types';

const mockShape: Shape = {
  id: 's1',
  nodes: [{ point: { x: 0, y: 0 }, cp1: { x: 10, y: 10 }, cp2: { x: 20, y: 20 } }],
  closed: false,
  fill: 'none',
  stroke: '#000',
  strokeWidth: 2,
  opacity: 1,
  transform: { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1 },
  visible: true,
  locked: false,
};

describe('ShapeRenderer', () => {
  it('renders a path element', () => {
    render(<svg><ShapeRenderer shape={mockShape} isSelected={false} /></svg>);
    const path = document.querySelector('path');
    expect(path).not.toBeNull();
    expect(path?.getAttribute('stroke')).toBe('#000');
  });

  it('hides invisible shapes', () => {
    render(<svg><ShapeRenderer shape={{ ...mockShape, visible: false }} isSelected={false} /></svg>);
    const path = document.querySelector('path');
    expect(path?.getAttribute('visibility')).toBe('hidden');
  });

  it('applies transform from shape', () => {
    render(<svg><ShapeRenderer shape={mockShape} isSelected={false} /></svg>);
    const g = document.querySelector('g');
    expect(g?.getAttribute('transform')).toContain('translate');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run:
```bash
npx vitest run src/components/Canvas/ShapeRenderer.test.tsx --reporter=verbose
```
Expected: FAIL

- [ ] **Step 3: Write ShapeRenderer**

File: `src/components/Canvas/ShapeRenderer.tsx`

```tsx
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
```

- [ ] **Step 4: Run tests**

Run:
```bash
npx vitest run src/components/Canvas/ShapeRenderer.test.tsx --reporter=verbose
```
Expected: PASS

- [ ] **Step 5: Write CanvasViewport**

File: `src/components/Canvas/CanvasViewport.module.css`

```css
.viewport {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  cursor: crosshair;
  overflow: hidden;
  position: relative;
}

.svg {
  width: 100%;
  height: 100%;
  display: block;
}
```

File: `src/components/Canvas/CanvasViewport.tsx`

```tsx
import { useRef, useCallback, type MouseEvent, type WheelEvent } from 'react';
import { useProject } from '../../store/ProjectContext';
import { ShapeRenderer } from './ShapeRenderer';
import styles from './CanvasViewport.module.css';

export function CanvasViewport() {
  const { state, dispatch } = useProject();
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 800, h: 600 });
  const [panning, setPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, vbX: 0, vbY: 0 });

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const scale = e.deltaY > 0 ? 1.1 : 0.9;
    setViewBox(vb => ({ ...vb, w: vb.w * scale, h: vb.h * scale }));
  }, []);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (state.tool !== 'pan') return;
    setPanning(true);
    panStart.current = { x: e.clientX, y: e.clientY, vbX: viewBox.x, vbY: viewBox.y };
  }, [state.tool, viewBox]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!panning) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setViewBox(vb => ({ ...vb, x: panStart.current.vbX - dx, y: panStart.current.vbY - dy }));
  }, [panning]);

  const handleMouseUp = useCallback(() => setPanning(false), []);

  const screenToSvg = (clientX: number, clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: ((clientX - rect.left) / rect.width) * viewBox.w + viewBox.x,
      y: ((clientY - rect.top) / rect.height) * viewBox.h + viewBox.y,
    };
  };

  return (
    <div className={styles.viewport}>
      <svg
        ref={svgRef}
        className={styles.svg}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {state.shapes.map(s => (
          <ShapeRenderer key={s.id} shape={s} isSelected={s.id === state.selectedShapeId} />
        ))}
      </svg>
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add canvas viewport and shape renderer"
```

---

### Task 7: Pen Tool

**Files:**
- Create: `src/components/Toolbar/PenTool.tsx`

- [ ] **Step 1: Write PenTool**

The PenTool is not a separate component with UI — it's the click handler on the canvas when tool='pen'.

Add to `src/components/Canvas/CanvasViewport.tsx`:

Add the import at top:
```typescript
import { useState, useCallback, useRef } from 'react';
```

Add a `useEffect` to handle pen clicks. Modify the `handleMouseDown`:

```typescript
const handleMouseDown = useCallback((e: MouseEvent) => {
  if (state.tool === 'pan') {
    setPanning(true);
    panStart.current = { x: e.clientX, y: e.clientY, vbX: viewBox.x, vbY: viewBox.y };
    return;
  }
  if (state.tool === 'pen') {
    const pt = screenToSvg(e.clientX, e.clientY);
    const newNodes = [...draftNodes.current, { point: pt, cp1: pt, cp2: pt }];
    draftNodes.current = newNodes;
  }
}, [state.tool, viewBox]);

const handleDblClick = useCallback((e: MouseEvent) => {
  if (state.tool !== 'pen' || draftNodes.current.length < 2) return;
  dispatch({ type: 'ADD_SHAPE', payload: { nodes: draftNodes.current, closed: closed.current } });
  draftNodes.current = [];
  closed.current = false;
}, [state.tool, dispatch]);
```

- [ ] **Step 2: Add draft state and pen handlers to CanvasViewport**

Replace the full CanvasViewport with the pen-aware version:

File: `src/components/Canvas/CanvasViewport.tsx`

```tsx
import { useState, useCallback, useRef } from 'react';
import { useProject } from '../../store/ProjectContext';
import { ShapeRenderer } from './ShapeRenderer';
import { nodesToPathData } from '../../utils/pathUtils';
import type { BezierNode } from '../../types';
import styles from './CanvasViewport.module.css';

export function CanvasViewport() {
  const { state, dispatch } = useProject();
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 800, h: 600 });
  const [panning, setPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, vbX: 0, vbY: 0 });
  const [draftNodes, setDraftNodes] = useState<BezierNode[]>([]);
  const [draftClosed, setDraftClosed] = useState(false);

  const screenToSvg = useCallback((clientX: number, clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: ((clientX - rect.left) / rect.width) * viewBox.w + viewBox.x,
      y: ((clientY - rect.top) / rect.height) * viewBox.h + viewBox.y,
    };
  }, [viewBox]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const scale = e.deltaY > 0 ? 1.1 : 0.9;
    setViewBox(vb => ({ ...vb, w: vb.w * scale, h: vb.h * scale }));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (state.tool === 'pan') {
      setPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY, vbX: viewBox.x, vbY: viewBox.y };
      return;
    }
    if (state.tool === 'pen') {
      const pt = screenToSvg(e.clientX, e.clientY);
      setDraftNodes(prev => [...prev, { point: pt, cp1: pt, cp2: pt }]);
      return;
    }
    if (state.tool === 'select') {
      const pt = screenToSvg(e.clientX, e.clientY);
      const hit = state.shapes.find(s => {
        const bounds = s.nodes.reduce(
          (acc, n) => ({
            minX: Math.min(acc.minX, n.point.x),
            minY: Math.min(acc.minY, n.point.y),
            maxX: Math.max(acc.maxX, n.point.x),
            maxY: Math.max(acc.maxY, n.point.y),
          }),
          { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
        );
        const margin = 10;
        return pt.x >= bounds.minX - margin && pt.x <= bounds.maxX + margin &&
               pt.y >= bounds.minY - margin && pt.y <= bounds.maxY + margin;
      });
      dispatch({ type: 'SET_SELECTED_SHAPE', payload: { id: hit?.id ?? null } });
    }
  }, [state.tool, state.shapes, viewBox, screenToSvg, dispatch]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!panning) return;
    const dx = e.clientX - panStart.current.x;
    const dy = e.clientY - panStart.current.y;
    setViewBox(vb => ({ ...vb, x: panStart.current.vbX - dx, y: panStart.current.vbY - dy }));
  }, [panning]);

  const handleMouseUp = useCallback(() => setPanning(false), []);

  const handleDblClick = useCallback((e: React.MouseEvent) => {
    if (state.tool !== 'pen' || draftNodes.length < 2) return;
    dispatch({ type: 'ADD_SHAPE', payload: { nodes: draftNodes, closed: draftClosed } });
    setDraftNodes([]);
    setDraftClosed(false);
  }, [state.tool, draftNodes, draftClosed, dispatch]);

  const draftD = draftNodes.length > 1 ? nodesToPathData(draftNodes, draftClosed) : null;

  return (
    <div className={styles.viewport}>
      <svg
        ref={svgRef}
        className={styles.svg}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDblClick}
      >
        {state.shapes.map(s => (
          <ShapeRenderer key={s.id} shape={s} isSelected={s.id === state.selectedShapeId} />
        ))}
        {draftNodes.length > 0 && (
          <g>
            {draftNodes.map((n, i) => (
              <circle key={i} cx={n.point.x} cy={n.point.y} r={4} fill="#0078d7" />
            ))}
            {draftNodes.map((n, i) => (
              i > 0 ? (
                <line
                  key={`l${i}`}
                  x1={draftNodes[i-1].point.x} y1={draftNodes[i-1].point.y}
                  x2={n.point.x} y2={n.point.y}
                  stroke="#0078d7" strokeWidth={1} strokeDasharray="3 3"
                />
              ) : null
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add pen tool with draft drawing on canvas"
```

---

### Task 8: Toolbar Component

**Files:**
- Create: `src/components/Toolbar/Toolbar.tsx`
- Create: `src/components/Toolbar/Toolbar.module.css`

- [ ] **Step 1: Write the Toolbar**

File: `src/components/Toolbar/Toolbar.module.css`

```css
.toolbar {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  background: #fff;
  border-right: 1px solid #ddd;
}

.button {
  width: 40px;
  height: 40px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.button:hover {
  background: #f0f0f0;
}

.buttonActive {
  composes: button;
  background: #e0e7ff;
  border-color: #0078d7;
}
```

File: `src/components/Toolbar/Toolbar.tsx`

```tsx
import { useProject } from '../../store/ProjectContext';
import styles from './Toolbar.module.css';

const tools = [
  { id: 'pen' as const, label: '✏️', title: 'Pluma (dibujar)' },
  { id: 'select' as const, label: '⬆️', title: 'Seleccionar' },
  { id: 'pan' as const, label: '✋', title: 'Mover canvas' },
];

export function Toolbar() {
  const { state, dispatch } = useProject();
  return (
    <div className={styles.toolbar}>
      {tools.map(t => (
        <button
          key={t.id}
          className={state.tool === t.id ? styles.buttonActive : styles.button}
          title={t.title}
          onClick={() => dispatch({ type: 'SET_TOOL', payload: t.id })}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add toolbar with tool selection"
```

---

### Task 9: Properties Panel

**Files:**
- Create: `src/components/Sidebar/PropertiesPanel.tsx`
- Create: `src/components/Sidebar/PropertiesPanel.module.css`

- [ ] **Step 1: Write PropertiesPanel**

File: `src/components/Sidebar/PropertiesPanel.module.css`

```css
.panel {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.title {
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  margin: 0 0 8px;
}

.field {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.label {
  font-size: 12px;
  color: #333;
  min-width: 60px;
}

.input {
  flex: 1;
  padding: 4px 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 12px;
}

.colorInput {
  width: 32px;
  height: 28px;
  padding: 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.empty {
  font-size: 13px;
  color: #999;
  padding: 24px;
  text-align: center;
}
```

File: `src/components/Sidebar/PropertiesPanel.tsx`

```tsx
import { useProject } from '../../store/ProjectContext';
import styles from './PropertiesPanel.module.css';

export function PropertiesPanel() {
  const { state, dispatch } = useProject();
  const shape = state.shapes.find(s => s.id === state.selectedShapeId);

  if (!shape) {
    return (
      <div className={styles.panel}>
        <p className={styles.empty}>Selecciona una forma para editar</p>
      </div>
    );
  }

  const update = (changes: Record<string, any>) => {
    dispatch({ type: 'UPDATE_SHAPE', payload: { id: shape.id, changes } });
  };

  return (
    <div className={styles.panel}>
      <p className={styles.title}>Propiedades</p>
      <div className={styles.field}>
        <span className={styles.label}>Relleno</span>
        <input
          type="color"
          className={styles.colorInput}
          value={shape.fill}
          onChange={e => update({ fill: e.target.value })}
        />
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Trazo</span>
        <input
          type="color"
          className={styles.colorInput}
          value={shape.stroke}
          onChange={e => update({ stroke: e.target.value })}
        />
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Grosor</span>
        <input
          type="number"
          className={styles.input}
          value={shape.strokeWidth}
          min={0}
          max={50}
          onChange={e => update({ strokeWidth: Number(e.target.value) })}
        />
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Opacidad</span>
        <input
          type="range"
          className={styles.input}
          value={shape.opacity}
          min={0}
          max={1}
          step={0.05}
          onChange={e => update({ opacity: Number(e.target.value) })}
        />
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Cerrar</span>
        <input
          type="checkbox"
          checked={shape.closed}
          onChange={e => update({ closed: e.target.checked })}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add properties panel"
```

---

### Task 10: Layer Panel

**Files:**
- Create: `src/components/Sidebar/LayerPanel.tsx`
- Create: `src/components/Sidebar/LayerPanel.module.css`

- [ ] **Step 1: Write LayerPanel**

File: `src/components/Sidebar/LayerPanel.module.css`

```css
.panel {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.title {
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  margin: 0 0 8px;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.item:hover {
  background: #f5f5f5;
}

.itemActive {
  composes: item;
  background: #e0e7ff;
}

.eyeBtn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  opacity: 0.6;
}

.actions {
  display: flex;
  gap: 4px;
  margin-top: 8px;
}

.btnIcon {
  background: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
}

.empty {
  font-size: 13px;
  color: #999;
  padding: 12px;
  text-align: center;
}
```

File: `src/components/Sidebar/LayerPanel.tsx`

```tsx
import { useProject } from '../../store/ProjectContext';
import styles from './LayerPanel.module.css';

export function LayerPanel() {
  const { state, dispatch } = useProject();

  const moveUp = (index: number) => {
    if (index <= 0) return;
    const ids = state.shapes.map(s => s.id);
    [ids[index - 1], ids[index]] = [ids[index], ids[index - 1]];
    dispatch({ type: 'REORDER_SHAPES', payload: { shapeIds: ids } });
  };

  const moveDown = (index: number) => {
    if (index >= state.shapes.length - 1) return;
    const ids = state.shapes.map(s => s.id);
    [ids[index], ids[index + 1]] = [ids[index + 1], ids[index]];
    dispatch({ type: 'REORDER_SHAPES', payload: { shapeIds: ids } });
  };

  return (
    <div className={styles.panel}>
      <p className={styles.title}>Capas</p>
      {state.shapes.length === 0 ? (
        <p className={styles.empty}>Sin formas</p>
      ) : (
        <>
          <ul className={styles.list}>
            {state.shapes.map((s, i) => (
              <li
                key={s.id}
                className={s.id === state.selectedShapeId ? styles.itemActive : styles.item}
                onClick={() => dispatch({ type: 'SET_SELECTED_SHAPE', payload: { id: s.id } })}
              >
                <span
                  className={styles.eyeBtn}
                  onClick={e => {
                    e.stopPropagation();
                    dispatch({ type: 'UPDATE_SHAPE', payload: { id: s.id, changes: { visible: !s.visible } } });
                  }}
                >
                  {s.visible ? '👁️' : '🚫'}
                </span>
                <span>Forma {i + 1}</span>
              </li>
            ))}
          </ul>
          <div className={styles.actions}>
            <button className={styles.btnIcon} onClick={() => moveUp(state.shapes.findIndex(s => s.id === state.selectedShapeId))}>⬆</button>
            <button className={styles.btnIcon} onClick={() => moveDown(state.shapes.findIndex(s => s.id === state.selectedShapeId))}>⬇</button>
            <button
              className={styles.btnIcon}
              onClick={() => {
                if (state.selectedShapeId) {
                  dispatch({ type: 'DELETE_SHAPE', payload: { id: state.selectedShapeId } });
                }
              }}
            >
              🗑️
            </button>
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add layer panel"
```

---

### Task 11: Pattern Engine (Pure Logic)

**Files:**
- Create: `src/engine/patternEngine.ts`
- Create: `src/engine/patternEngine.test.ts`

- [ ] **Step 1: Write the failing test**

File: `src/engine/patternEngine.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { generateTileLayout } from './patternEngine';
import type { PatternRule } from '../types';

describe('generateTileLayout', () => {
  const rule: PatternRule = {
    layout: 'grid',
    gapX: 10,
    gapY: 10,
    scale: 1,
    rotation: 0,
    randomOffset: 0,
    tileOverrides: [],
  };

  it('returns 9 tiles for 3x3 grid', () => {
    const tiles = generateTileLayout(rule, 100, 100, 3, 3);
    expect(tiles).toHaveLength(9);
  });

  it('each tile has correct initial position', () => {
    const tiles = generateTileLayout(rule, 100, 100, 3, 3);
    expect(tiles[0]).toMatchObject({ x: 0, y: 0, col: 0, row: 0 });
    expect(tiles[4]).toMatchObject({ x: 110, y: 110, col: 1, row: 1 });
  });

  it('applies brick offset', () => {
    const brickRule = { ...rule, layout: 'brick' as const };
    const tiles = generateTileLayout(brickRule, 100, 100, 3, 2);
    expect(tiles[3].x).toBe(55);
  });

  it('applies tile overrides', () => {
    const ruleWithOverride: PatternRule = {
      ...rule,
      tileOverrides: [{ instanceIndex: 0, x: 50, y: 50, rotation: 45, scale: 0.5, visible: true }],
    };
    const tiles = generateTileLayout(ruleWithOverride, 100, 100, 3, 3);
    expect(tiles[0].x).toBe(50);
    expect(tiles[0].rotation).toBe(45);
    expect(tiles[0].scale).toBe(0.5);
  });

  it('mark tiles as invisible when override says so', () => {
    const ruleWithOverride: PatternRule = {
      ...rule,
      tileOverrides: [{ instanceIndex: 0, x: 0, y: 0, rotation: 0, scale: 1, visible: false }],
    };
    const tiles = generateTileLayout(ruleWithOverride, 100, 100, 3, 3);
    expect(tiles[0].visible).toBe(false);
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run:
```bash
npx vitest run src/engine/patternEngine.test.ts --reporter=verbose
```
Expected: FAIL

- [ ] **Step 3: Write the implementation**

File: `src/engine/patternEngine.ts`

```typescript
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
```

- [ ] **Step 4: Run tests**

Run:
```bash
npx vitest run src/engine/patternEngine.test.ts --reporter=verbose
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add pattern engine for tile layout generation"
```

---

### Task 12: Pattern Controls UI

**Files:**
- Create: `src/components/Pattern/PatternControls.tsx`
- Create: `src/components/Pattern/PatternControls.module.css`

- [ ] **Step 1: Write PatternControls**

File: `src/components/Pattern/PatternControls.module.css`

```css
.panel {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.title {
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  margin: 0 0 8px;
}

.field {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.label {
  font-size: 12px;
  color: #333;
  min-width: 80px;
}

.input {
  flex: 1;
  padding: 4px 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 12px;
}

.select {
  flex: 1;
  padding: 4px 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 12px;
  background: white;
}

.toggleBtn {
  width: 100%;
  padding: 8px;
  border: 1px solid #0078d7;
  border-radius: 6px;
  background: #e0e7ff;
  color: #0078d7;
  font-weight: 600;
  cursor: pointer;
  font-size: 13px;
  margin-bottom: 8px;
}

.toggleBtnOff {
  composes: toggleBtn;
  background: white;
  color: #666;
  border-color: #ccc;
}

.actions {
  display: flex;
  gap: 4px;
  margin-top: 8px;
}

.btnIcon {
  background: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
}
```

File: `src/components/Pattern/PatternControls.tsx`

```tsx
import { useProject } from '../../store/ProjectContext';
import type { LayoutType, PatternRule } from '../../types';
import styles from './PatternControls.module.css';

const layouts: { value: LayoutType; label: string }[] = [
  { value: 'grid', label: 'Grid' },
  { value: 'brick', label: 'Ladrillo' },
  { value: 'diamond', label: 'Diamante' },
  { value: 'hex', label: 'Hexagonal' },
  { value: 'mirror', label: 'Espejo' },
];

export function PatternControls() {
  const { state, dispatch } = useProject();
  const active = state.pattern !== null;

  const toggle = () => {
    if (active) {
      dispatch({ type: 'SET_PATTERN', payload: null });
    } else {
      dispatch({
        type: 'SET_PATTERN',
        payload: {
          layout: 'grid',
          gapX: 0,
          gapY: 0,
          scale: 1,
          rotation: 0,
          randomOffset: 0,
          tileOverrides: [],
        },
      });
    }
  };

  const update = (changes: Partial<PatternRule>) => {
    if (!state.pattern) return;
    dispatch({ type: 'SET_PATTERN', payload: { ...state.pattern, ...changes } });
  };

  return (
    <div className={styles.panel}>
      <p className={styles.title}>Patrón</p>
      <button className={active ? styles.toggleBtn : styles.toggleBtnOff} onClick={toggle}>
        {active ? 'Desactivar patrón' : 'Activar patrón'}
      </button>
      {active && state.pattern && (
        <>
          <div className={styles.field}>
            <span className={styles.label}>Layout</span>
            <select
              className={styles.select}
              value={state.pattern.layout}
              onChange={e => update({ layout: e.target.value as LayoutType })}
            >
              {layouts.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Gap X</span>
            <input
              type="number"
              className={styles.input}
              value={state.pattern.gapX}
              min={-100}
              max={100}
              onChange={e => update({ gapX: Number(e.target.value) })}
            />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Gap Y</span>
            <input
              type="number"
              className={styles.input}
              value={state.pattern.gapY}
              min={-100}
              max={100}
              onChange={e => update({ gapY: Number(e.target.value) })}
            />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Escala</span>
            <input
              type="range"
              className={styles.input}
              value={state.pattern.scale}
              min={0.1}
              max={3}
              step={0.05}
              onChange={e => update({ scale: Number(e.target.value) })}
            />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Rotación</span>
            <input
              type="range"
              className={styles.input}
              value={state.pattern.rotation}
              min={-180}
              max={180}
              step={1}
              onChange={e => update({ rotation: Number(e.target.value) })}
            />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Aleatorio</span>
            <input
              type="range"
              className={styles.input}
              value={state.pattern.randomOffset}
              min={0}
              max={100}
              step={1}
              onChange={e => update({ randomOffset: Number(e.target.value) })}
            />
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add pattern controls UI"
```

---

### Task 13: Pattern Preview

**Files:**
- Create: `src/components/Pattern/PatternPreview.tsx`
- Create: `src/components/Pattern/PatternPreview.module.css`

- [ ] **Step 1: Write PatternPreview**

File: `src/components/Pattern/PatternPreview.module.css`

```css
.preview {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.title {
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  margin: 0 0 8px;
}

.container {
  width: 100%;
  aspect-ratio: 1;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
}

.svg {
  width: 100%;
  height: 100%;
  display: block;
}

.tile {
  cursor: pointer;
  transition: opacity 0.1s;
}

.tile:hover {
  opacity: 0.8;
}

.tileSelected {
  cursor: pointer;
  outline: 2px solid #0078d7;
}
```

File: `src/components/Pattern/PatternPreview.tsx`

```tsx
import { useMemo } from 'react';
import { useProject } from '../../store/ProjectContext';
import { generateTileLayout } from '../../engine/patternEngine';
import { nodesToPathData } from '../../utils/pathUtils';
import styles from './PatternPreview.module.css';

export function PatternPreview() {
  const { state, dispatch } = useProject();
  const { pattern, shapes, tileWidth, tileHeight } = state;

  const tiles = useMemo(() => {
    if (!pattern) return [];
    return generateTileLayout(pattern, tileWidth, tileHeight, 3, 3);
  }, [pattern, tileWidth, tileHeight]);

  const handleTileClick = (index: number) => {
    dispatch({ type: 'SET_SELECTED_TILE', payload: { index: state.selectedTileIndex === index ? null : index } });
  };

  if (!pattern) return null;

  return (
    <div className={styles.preview}>
      <p className={styles.title}>Preview 3x3</p>
      <div className={styles.container}>
        <svg className={styles.svg} viewBox={`0 0 ${tileWidth * 3 + pattern.gapX * 2} ${tileHeight * 3 + pattern.gapY * 2}`}>
          {tiles.map(t => (
            <g
              key={t.instanceIndex}
              className={state.selectedTileIndex === t.instanceIndex ? styles.tileSelected : styles.tile}
              transform={`translate(${t.x}, ${t.y}) scale(${t.scale}) rotate(${t.rotation})`}
              visibility={t.visible ? 'visible' : 'hidden'}
              onClick={() => handleTileClick(t.instanceIndex)}
            >
              {shapes.map(s => (
                <path
                  key={s.id}
                  d={nodesToPathData(s.nodes, s.closed)}
                  fill={s.fill}
                  stroke={s.stroke}
                  strokeWidth={s.strokeWidth}
                  opacity={s.opacity}
                  visibility={s.visible ? 'visible' : 'hidden'}
                />
              ))}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add pattern preview 3x3 with clickable tiles"
```

---

### Task 14: Tile Override Panel

**Files:**
- Create: `src/components/Sidebar/TileOverridePanel.tsx`
- Create: `src/components/Sidebar/TileOverridePanel.module.css`

- [ ] **Step 1: Write TileOverridePanel**

File: `src/components/Sidebar/TileOverridePanel.module.css`

```css
.panel {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.title {
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  margin: 0 0 8px;
}

.field {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.label {
  font-size: 12px;
  color: #333;
  min-width: 80px;
}

.input {
  flex: 1;
  padding: 4px 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 12px;
}

.reset {
  background: none;
  border: none;
  color: #0078d7;
  cursor: pointer;
  font-size: 11px;
  text-decoration: underline;
}

.empty {
  font-size: 13px;
  color: #999;
  padding: 12px;
  text-align: center;
}
```

File: `src/components/Sidebar/TileOverridePanel.tsx`

```tsx
import { useProject } from '../../store/ProjectContext';
import styles from './TileOverridePanel.module.css';

export function TileOverridePanel() {
  const { state, dispatch } = useProject();

  if (state.selectedTileIndex === null || !state.pattern) {
    return (
      <div className={styles.panel}>
        <p className={styles.title}>Tile</p>
        <p className={styles.empty}>Selecciona un tile en el preview</p>
      </div>
    );
  }

  const index = state.selectedTileIndex;
  const override = state.pattern.tileOverrides.find(t => t.instanceIndex === index);
  const x = override?.x ?? 0;
  const y = override?.y ?? 0;
  const rotation = override?.rotation ?? state.pattern.rotation;
  const scale = override?.scale ?? state.pattern.scale;

  const update = (changes: Record<string, number>) => {
    dispatch({ type: 'UPDATE_TILE_OVERRIDE', payload: { index, changes } });
  };

  const reset = () => {
    dispatch({ type: 'UPDATE_TILE_OVERRIDE', payload: {
      index,
      changes: { x: 0, y: 0, rotation: state.pattern.rotation, scale: state.pattern.scale, visible: true },
    } });
  };

  return (
    <div className={styles.panel}>
      <p className={styles.title}>Tile #{index}</p>
      <button className={styles.reset} onClick={reset}>Restablecer</button>
      <div className={styles.field}>
        <span className={styles.label}>X</span>
        <input type="number" className={styles.input} value={x} onChange={e => update({ x: Number(e.target.value) })} />
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Y</span>
        <input type="number" className={styles.input} value={y} onChange={e => update({ y: Number(e.target.value) })} />
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Rotacion</span>
        <input type="number" className={styles.input} value={rotation} onChange={e => update({ rotation: Number(e.target.value) })} />
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Escala</span>
        <input type="number" className={styles.input} value={scale} min={0.1} max={5} step={0.1} onChange={e => update({ scale: Number(e.target.value) })} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add tile override panel"
```

---

### Task 15: Generate Variations Button

**Files:**
- Modify: `src/components/Pattern/PatternControls.tsx`

- [ ] **Step 1: Add variations generator**

Add to `src/components/Pattern/PatternControls.tsx`.

Add import at top:
```typescript
import { useState } from 'react';
```

Add state and handler inside PatternControls, before the return:
```typescript
const [variations, setVariations] = useState<PatternRule[]>([]);

const generateVariations = () => {
  if (!state.pattern) return;
  const base = state.pattern;
  const generated: PatternRule[] = [];
  for (let i = 0; i < 5; i++) {
    generated.push({
      ...base,
      scale: Math.round((base.scale + (Math.random() - 0.5) * 0.8) * 100) / 100,
      rotation: Math.round(base.rotation + (Math.random() - 0.5) * 60),
      gapX: Math.round(base.gapX + (Math.random() - 0.5) * 40),
      gapY: Math.round(base.gapY + (Math.random() - 0.5) * 40),
      randomOffset: Math.round(base.randomOffset + (Math.random() - 0.5) * 30),
    });
  }
  setVariations(generated);
};

const applyVariation = (rule: PatternRule) => {
  dispatch({ type: 'SET_PATTERN', payload: rule });
  setVariations([]);
};
```

Add variations UI after the last field and before the closing `)}`:
```tsx
          <div className={styles.actions}>
            <button className={styles.btnIcon} onClick={generateVariations}>
              Generar 5 variaciones
            </button>
          </div>
          {variations.length > 0 && (
            <div>
              {variations.map((v, i) => (
                <button
                  key={i}
                  className={styles.btnIcon}
                  onClick={() => applyVariation(v)}
                  style={{ display: 'block', width: '100%', marginBottom: 4, fontSize: 11 }}
                >
                  Var {i + 1} (escala {v.scale}x, rot {v.rotation})
                </button>
              ))}
            </div>
          )}
```

Add this CSS to `PatternControls.module.css`:
```css
.actions {
  display: flex;
  gap: 4px;
  margin-top: 8px;
}

.btnIcon {
  background: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
}
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add generate variations button"
```

---

### Task 17: SVG Export

**Files:**
- Create: `src/utils/svgExport.ts`
- Create: `src/utils/svgExport.test.ts`
- Create: `src/components/Export/ExportButton.tsx`
- Create: `src/components/Export/ExportButton.module.css`

- [ ] **Step 1: Write the failing test**

File: `src/utils/svgExport.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { projectToSvg } from './svgExport';
import type { AppState } from '../types';

const mockState: AppState = {
  name: 'test',
  tileWidth: 200,
  tileHeight: 200,
  shapes: [{
    id: 's1',
    nodes: [{ point: { x: 0, y: 0 }, cp1: { x: 10, y: 10 }, cp2: { x: 20, y: 20 } }],
    closed: false,
    fill: '#ccc',
    stroke: '#333',
    strokeWidth: 2,
    opacity: 1,
    transform: { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1 },
    visible: true,
    locked: false,
  }],
  selectedShapeId: null,
  selectedTileIndex: null,
  pattern: null,
  tool: 'pen',
};

describe('projectToSvg', () => {
  it('starts with <svg> tag', () => {
    const svg = projectToSvg(mockState);
    expect(svg.startsWith('<svg')).toBe(true);
  });

  it('contains viewBox', () => {
    const svg = projectToSvg(mockState);
    expect(svg).toContain('viewBox');
  });

  it('ends with </svg>', () => {
    const svg = projectToSvg(mockState);
    expect(svg.endsWith('</svg>')).toBe(true);
  });

  it('includes shape paths', () => {
    const svg = projectToSvg(mockState);
    expect(svg).toContain('<path');
  });

  it('includes pattern tiles when pattern is active', () => {
    const stateWithPattern: AppState = {
      ...mockState,
      pattern: { layout: 'grid', gapX: 0, gapY: 0, scale: 1, rotation: 0, randomOffset: 0, tileOverrides: [] },
    };
    const svg = projectToSvg(stateWithPattern);
    expect(svg).toContain('<defs');
    expect(svg).toContain('<use');
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run:
```bash
npx vitest run src/utils/svgExport.test.ts --reporter=verbose
```
Expected: FAIL

- [ ] **Step 3: Write the implementation**

File: `src/utils/svgExport.ts`

```typescript
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
```

- [ ] **Step 4: Run tests**

Run:
```bash
npx vitest run src/utils/svgExport.test.ts --reporter=verbose
```
Expected: PASS

- [ ] **Step 5: Write ExportButton**

File: `src/components/Export/ExportButton.module.css`

```css
.exportBtn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 6px;
  background: #0078d7;
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
}

.exportBtn:hover {
  background: #005fa3;
}
```

File: `src/components/Export/ExportButton.tsx`

```tsx
import { useProject } from '../../store/ProjectContext';
import { downloadSvg } from '../../utils/svgExport';
import styles from './ExportButton.module.css';

export function ExportButton() {
  const { state } = useProject();
  return (
    <button className={styles.exportBtn} onClick={() => downloadSvg(state)}>
      Exportar SVG
    </button>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add SVG export and download button"
```

---

### Task 18: App Assembly and Undo/Redo Integration

**Files:**
- Create: `src/App.tsx`
- Create: `src/App.module.css`

- [ ] **Step 1: Write App shell with layout and undo/redo**

File: `src/App.module.css`

```css
.app {
  display: flex;
  height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.sidebar {
  width: 260px;
  background: #fff;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topBar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #fff;
  border-bottom: 1px solid #ddd;
}

.topBarTitle {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  flex: 1;
}

.topBarBtn {
  background: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 10px;
  cursor: pointer;
  font-size: 12px;
}

.topBarBtn:disabled {
  opacity: 0.4;
  cursor: default;
}

.canvas {
  flex: 1;
  overflow: hidden;
}

.footer {
  padding: 8px 16px;
  background: #fff;
  border-top: 1px solid #ddd;
}

.patternSection {
  border-top: 1px solid #eee;
}
```

File: `src/App.tsx`

```tsx
import { useEffect } from 'react';
import { ProjectProvider, useProject } from './store/ProjectContext';
import { Toolbar } from './components/Toolbar/Toolbar';
import { CanvasViewport } from './components/Canvas/CanvasViewport';
import { PropertiesPanel } from './components/Sidebar/PropertiesPanel';
import { LayerPanel } from './components/Sidebar/LayerPanel';
import { TileOverridePanel } from './components/Sidebar/TileOverridePanel';
import { PatternControls } from './components/Pattern/PatternControls';
import { PatternPreview } from './components/Pattern/PatternPreview';
import { ExportButton } from './components/Export/ExportButton';
import { useHistory } from './hooks/useHistory';
import styles from './App.module.css';

function AppInner() {
  const { state, dispatch } = useProject();
  const history = useHistory(state);

  useEffect(() => {
    history.push(state);
  }, [state.shapes, state.pattern]);

  const handleUndo = () => {
    const prev = history.undo();
    if (prev) dispatch({ type: 'RESTORE', payload: prev });
  };

  const handleRedo = () => {
    const next = history.redo();
    if (next) dispatch({ type: 'RESTORE', payload: next });
  };

  return (
    <div className={styles.app}>
      <Toolbar />
      <div className={styles.main}>
        <div className={styles.topBar}>
          <span className={styles.topBarTitle}>Pattern Designer</span>
          <button className={styles.topBarBtn} disabled={!history.canUndo} onClick={handleUndo}>
            Deshacer
          </button>
          <button className={styles.topBarBtn} disabled={!history.canRedo} onClick={handleRedo}>
            Rehacer
          </button>
        </div>
        <div className={styles.canvas}>
          <CanvasViewport />
        </div>
        <div className={styles.footer}>
          <ExportButton />
        </div>
      </div>
      <div className={styles.sidebar}>
        <PropertiesPanel />
        <LayerPanel />
        <div className={styles.patternSection}>
          <PatternControls />
          <PatternPreview />
          <TileOverridePanel />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ProjectProvider>
      <AppInner />
    </ProjectProvider>
  );
}
```

- [ ] **Step 2: Verify the app builds**

Run:
```bash
npx tsc -b && npx vite build
```
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: assemble app with layout, undo/redo and all panels"
```

---

### Task 19: Smart Snapping Utility

**Files:**
- Create: `src/utils/snapping.ts`
- Create: `src/utils/snapping.test.ts`

- [ ] **Step 1: Write the failing test**

File: `src/utils/snapping.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { snapPoint, SNAP_THRESHOLD } from './snapping';
import type { Point } from '../types';

describe('snapPoint', () => {
  it('snaps to a nearby point within threshold', () => {
    const anchors: Point[] = [{ x: 100, y: 100 }];
    const result = snapPoint({ x: 102, y: 101 }, anchors);
    expect(result).toEqual({ x: 100, y: 100 });
  });

  it('returns original point if no anchor is close', () => {
    const anchors: Point[] = [{ x: 0, y: 0 }];
    const result = snapPoint({ x: 200, y: 200 }, anchors);
    expect(result).toEqual({ x: 200, y: 200 });
  });

  it('snaps to the closest anchor', () => {
    const anchors: Point[] = [{ x: 50, y: 50 }, { x: 100, y: 100 }];
    const result = snapPoint({ x: 98, y: 102 }, anchors);
    expect(result).toEqual({ x: 100, y: 100 });
  });
});
```

- [ ] **Step 2: Run to verify it fails**

Run:
```bash
npx vitest run src/utils/snapping.test.ts --reporter=verbose
```
Expected: FAIL

- [ ] **Step 3: Write the implementation**

File: `src/utils/snapping.ts`

```typescript
import type { Point } from '../types';

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

export function getAnchorPoints(shapes: import('../types').Shape[]): Point[] {
  const anchors: Point[] = [];
  for (const shape of shapes) {
    for (const node of shape.nodes) {
      anchors.push(node.point);
    }
  }
  return anchors;
}
```

- [ ] **Step 4: Run tests**

Run:
```bash
npx vitest run src/utils/snapping.test.ts --reporter=verbose
```
Expected: PASS

- [ ] **Step 5: Integrate snapping into CanvasViewport**

Modify `src/components/Canvas/CanvasViewport.tsx`.

Add import at top:
```typescript
import { snapPoint, getAnchorPoints } from '../../utils/snapping';
```

Modify pen tool handler:
```typescript
if (state.tool === 'pen') {
  const pt = screenToSvg(e.clientX, e.clientY);
  const anchors = getAnchorPoints(state.shapes.filter(s => s.visible));
  const snapped = snapPoint(pt, anchors);
  setDraftNodes(prev => [...prev, { point: snapped, cp1: snapped, cp2: snapped }]);
  return;
}
```

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add smart snapping for pen tool"
```

---

### Task 20: Final Verification

- [ ] **Step 1: Run full test suite**

Run:
```bash
npx vitest run --reporter=verbose
```
Expected: All tests PASS.

- [ ] **Step 2: Run full build**

Run:
```bash
npx tsc -b && npx vite build
```
Expected: Build succeeds with no errors.

- [ ] **Step 3: Final commit**

```bash
git add -A && git commit -m "chore: final build verification"
```
