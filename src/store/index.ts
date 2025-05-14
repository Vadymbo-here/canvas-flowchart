import { create } from 'zustand';
import { IDiagramElement, IConnection } from '../../my-diagram-lib/src/types';

interface DiagramState {
  elements: IDiagramElement[];
  connections: IConnection[];
  mainColor: string;
  selectedElementId: string | null;
  setElements: (elements: IDiagramElement[]) => void;
  setConnections: (connections: IConnection[]) => void;
  setColor: (color: string) => void;
  setSelectedElementId: (id: string | null) => void;
  addElement: (element: IDiagramElement) => void;
}

export const useStore = create<DiagramState>((set) => ({
  elements: [
    {
      id: 'obj-def-1',
      type: 'rectangle',
      position: { x: 100, y: 100 },
      size: { width: 120, height: 80 },
      text: 'Obj 1',
    },
    {
      id: 'obj-def-2',
      type: 'rectangle',
      position: { x: 300, y: 200 },
      size: { width: 120, height: 80 },
      text: 'Obj 2',
    },
  ],
  connections: [],
  mainColor: '#4caf50',
  selectedElementId: null,
  setElements: (elements) => set({ elements }),
  setConnections: (connections) => set({ connections }),
  setColor: (mainColor) => set({ mainColor }),
  setSelectedElementId: (id) => set({ selectedElementId: id }),
  addElement: (element) => set((state) => ({ 
    elements: [...state.elements, element],
    selectedElementId: element.id,
  })),
}));