export interface IPoint {
  x: number;
  y: number;
}

export interface ISize {
  width: number;
  height: number;
}

export interface IDiagramElement {
  id: string;
  type: string;
  position: IPoint;
  size: ISize;
  text?: string;
}

export interface IConnectorPoint {
  elementId: string;
  position: 'top' | 'right' | 'bottom' | 'left';
}

export interface IConnection {
  id: string;
  start: IConnectorPoint;
  end: IConnectorPoint;
  path?: IPoint[];
}

export interface DiagramData {
  elements: IDiagramElement[];
  connections: IConnection[];
}

export type ConnectorPosition = 'top' | 'right' | 'bottom' | 'left';