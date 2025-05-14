import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { IDiagramElement, IConnection, IPoint, IConnectorPoint } from '../types';
import { calculateConnectorPointCoordinates } from '../utils';
import DiagramElement from './DiagramElement';
import ConnectionLine from './ConnectionLine';

interface DiagramPanelProps {
  elements: IDiagramElement[];
  connections: IConnection[];
  mainColor: string;
  onElementsChange: (elements: IDiagramElement[]) => void;
  onConnectionsChange: (connections: IConnection[]) => void;
  onElementSelect: (id: string | null) => void;
  selectedElementId: string | null;
}

function throttle<T extends (...args: any[]) => void>(func: T, limit: number): T {
  let lastFunc: number;
  let lastRan: number;
  return function (this: any, ...args: any[]) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = window.setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  } as T;
}

const DiagramPanel: React.FC<DiagramPanelProps> = ({
  elements,
  connections,
  mainColor,
  onElementsChange,
  onConnectionsChange,
  onElementSelect,
  selectedElementId,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingElement, setDraggingElement] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<IPoint>({ x: 0, y: 0 });
  const [drawingConnection, setDrawingConnection] = useState<{
    start: IConnectorPoint;
    currentEnd: IPoint;
  } | null>(null);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const startElement = useMemo(() => {
    if (!drawingConnection) return null;
    return elements.find(el => el.id === drawingConnection.start.elementId) || null;
  }, [drawingConnection, elements]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
        const newConnections = connections.filter(
          conn => conn.start.elementId !== selectedElementId && conn.end.elementId !== selectedElementId
        );
        onConnectionsChange(newConnections);
        onElementsChange(elements.filter(el => el.id !== selectedElementId));
        onElementSelect(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, elements, connections, onElementsChange, onConnectionsChange, onElementSelect]);

  const handleElementDragStart = useCallback((id: string, e: React.MouseEvent) => {
    const element = elements.find(el => el.id === id);
    if (!element) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDraggingElement(id);
    onElementSelect(id);
    e.stopPropagation();
  }, [elements, onElementSelect]);

  const throttledOnElementsChange = useMemo(() => throttle(onElementsChange, 40), [onElementsChange]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    if (draggingElement) {
      const newElements = elements.map(el => {
        if (el.id === draggingElement) {
          return {
            ...el,
            position: {
              x: e.clientX - canvasRect.left - dragOffset.x,
              y: e.clientY - canvasRect.top - dragOffset.y,
            },
          };
        }
        return el;
      });

      throttledOnElementsChange(newElements);
    }

    if (drawingConnection) {
      setDrawingConnection({
        ...drawingConnection,
        currentEnd: {
          x: e.clientX - canvasRect.left,
          y: e.clientY - canvasRect.top,
        },
      });
    }
  }, [draggingElement, dragOffset, elements, drawingConnection, throttledOnElementsChange]);

  const handleCanvasMouseUp = useCallback(() => {
    setDraggingElement(null);
    if (drawingConnection) {
      setDrawingConnection(null);
    }
  }, [drawingConnection]);


  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      onElementSelect(null);
    }
  }, [onElementSelect]);

  const handleConnectorDragStart = useCallback((elementId: string, position: 'top' | 'right' | 'bottom' | 'left', e: React.MouseEvent) => {
    e.stopPropagation();

    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    setDrawingConnection({
      start: { elementId, position },
      currentEnd: {
        x: e.clientX - canvasRect.left,
        y: e.clientY - canvasRect.top,
      },
    });
  }, []);

  const handleConnectorDragEnd = useCallback((elementId: string, position: 'top' | 'right' | 'bottom' | 'left') => {
    if (!drawingConnection) return;

    const newConnection: IConnection = {
      id: `conn-${Date.now()}`,
      start: drawingConnection.start,
      end: { elementId, position },
    };

    onConnectionsChange([...connections, newConnection]);
    setDrawingConnection(null);
  }, [drawingConnection, connections, onConnectionsChange]);

  return (
    <div
      ref={canvasRef}
      className="diagram-canvas"
      style={{
        position: 'relative',
        width: '99%',
        height: '99%',
        backgroundColor: '#f5f5f5',
        overflow: 'hidden',
        border: '1px solid #ddd',
        userSelect: draggingElement ? 'none' : 'auto',
        cursor: draggingElement ? 'grabbing' : 'default',
      }}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onClick={handleCanvasClick}
    >

      {connections.map(connection => (
        <ConnectionLine
          key={connection.id}
          connection={connection}
          elements={elements}
          mainColor={mainColor}
        />
      ))}

      {drawingConnection && startElement && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
            <path
              d={`M ${calculateConnectorPointCoordinates(
                drawingConnection.start,
                startElement
              ).x} ${calculateConnectorPointCoordinates(
                drawingConnection.start,
                startElement
              ).y} L ${drawingConnection.currentEnd.x} ${drawingConnection.currentEnd.y}`}
              stroke={mainColor}
              strokeWidth={2}
              fill="none"
              strokeDasharray="4"
            />
          </svg>
        </div>
      )}

      {elements.map(element => (
        <DiagramElement
          key={element.id}
          element={element}
          isSelected={selectedElementId === element.id}
          isHovered={hoveredElement === element.id}
          mainColor={mainColor}
          onDragStart={(e) => handleElementDragStart(element.id, e)}
          onMouseEnter={() => setHoveredElement(element.id)}
          onMouseLeave={() => setHoveredElement(null)}
          onConnectorDragStart={handleConnectorDragStart}
          onConnectorDragEnd={handleConnectorDragEnd}
          isDrawingConnection={!!drawingConnection}
        />
      ))}
    </div>
  );
};

export default React.memo(DiagramPanel);