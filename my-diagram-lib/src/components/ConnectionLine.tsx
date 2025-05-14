import React from 'react';
import { IConnection, IDiagramElement } from '../types';
import { computeEndpoints, generateConnectionPathD } from '../utils';

interface ConnectionLineProps {
  connection: IConnection;
  elements: IDiagramElement[];
  mainColor: string;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ connection, elements, mainColor }) => {
  const startElement = elements.find(el => el.id === connection.start.elementId);
  const endElement = elements.find(el => el.id === connection.end.elementId);
  const containerPosition = { x: 0, y: 0 };
  
  if (!startElement || !endElement) {
    return null;
  }

  const { startX, startY, endX, endY, orientation, offset } = computeEndpoints(
    containerPosition,
    startElement,
    endElement,
    undefined,
    20
  );

  const svgPath = generateConnectionPathD(startX, startY, endX, endY, orientation, offset);

  
  return (
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
          d={svgPath}
          stroke={mainColor}
          strokeWidth="2"
          fill="none"
          markerEnd={`url(#arrowhead-${connection.id})`}
        />
        <defs>
          <marker
            id={`arrowhead-${connection.id}`}
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill={mainColor} />
          </marker>
        </defs>
      </svg>
    </div>
  );
};

export default ConnectionLine;