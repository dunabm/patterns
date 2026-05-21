import { createContext, useContext, useReducer, type ReactNode } from 'react';
import { projectReducer, initialState } from './projectReducer';
import type { Action } from './projectReducer';
import type { AppState } from '../types';

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
