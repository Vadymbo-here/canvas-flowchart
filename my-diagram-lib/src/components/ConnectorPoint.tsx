import React from 'react';
import { ConnectorPosition } from '../types';

interface ConnectorPointProps {
  position: ConnectorPosition;
  elementId: string;
  onDragStart: (elementId: string, position: ConnectorPosition, e: React.MouseEvent) => void;
  onDragEnd: (elementId: string, position: ConnectorPosition) => void;
  isDrawingConnection: boolean;
}

const ConnectorPoint: React.FC<ConnectorPointProps> = ({
  position,
  elementId,
  onDragStart,
  onDragEnd,
  isDrawingConnection,
}) => {
  const getPositionStyle = () => {
    switch (position) {
      case 'top':
        return { top: '-6px', left: '50%', transform: 'translateX(-50%)' };
      case 'right':
        return { right: '-6px', top: '50%', transform: 'translateY(-50%)' };
      case 'bottom':
        return { bottom: '-6px', left: '50%', transform: 'translateX(-50%)' };
      case 'left':
        return { left: '-6px', top: '50%', transform: 'translateY(-50%)' };
    }
  };

  return (
    <div
      className="connector-point"
      style={{
        position: 'absolute',
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: isDrawingConnection ? '#00989B' : '#fff',
        border: '2px solid #00989B',
        cursor: 'pointer',
        zIndex: 10,
        ...getPositionStyle(),
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onDragStart(elementId, position, e);
      }}
      onMouseUp={() => onDragEnd(elementId, position)}
    />
  );
};

export default ConnectorPoint;
