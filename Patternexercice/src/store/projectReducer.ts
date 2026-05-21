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
