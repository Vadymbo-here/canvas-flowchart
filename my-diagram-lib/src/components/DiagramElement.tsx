import React, { useMemo } from 'react';
import { IDiagramElement as DiagramElementType, ConnectorPosition } from '../types';
import ConnectorPoint from '../components/ConnectorPoint';

interface DiagramElementProps {
  element: DiagramElementType;
  isSelected: boolean;
  isHovered: boolean;
  mainColor: string;
  onDragStart: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onConnectorDragStart: (elementId: string, position: ConnectorPosition, e: React.MouseEvent) => void;
  onConnectorDragEnd: (elementId: string, position: ConnectorPosition) => void;
  isDrawingConnection: boolean;
}

const connectorPositions: ConnectorPosition[] = ['top', 'right', 'bottom', 'left'];

const DiagramElement: React.FC<DiagramElementProps> = ({
  element,
  isSelected,
  isHovered,
  mainColor,
  onDragStart,
  onMouseEnter,
  onMouseLeave,
  onConnectorDragStart,
  onConnectorDragEnd,
  isDrawingConnection,
}) => {
  const { id, position, size, text } = element;

  const pointStyle = useMemo<React.CSSProperties>(() => ({
    position: 'absolute' as const,
    left: position.x,
    top: position.y,
    width: size.width,
    height: size.height,
    backgroundColor: mainColor,
    borderRadius: 5,
    cursor: 'move',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 'bold',
    boxShadow: isSelected ? '0 0 0 2px #00989B' : 'none',
    userSelect: 'none',
    transition: 'box-shadow 0.2s ease',
  }), [position, size, mainColor, isSelected]);

  return (
    <div
      className="diagram-element"
      style={pointStyle}
      onMouseDown={onDragStart}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {text}
      {(isHovered || isSelected) && connectorPositions.map(pos => (
        <ConnectorPoint
          key={pos}
          position={pos}
          elementId={id}
          onDragStart={onConnectorDragStart}
          onDragEnd={onConnectorDragEnd}
          isDrawingConnection={isDrawingConnection}
        />
      ))}
    </div>
  );
};

export default DiagramElement;