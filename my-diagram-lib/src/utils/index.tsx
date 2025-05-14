import { IConnectorPoint, IDiagramElement, IPoint } from "../types";

export function calculateConnectorPointCoordinates(
  connectorPoint: IConnectorPoint,
  element: IDiagramElement
): IPoint {
  const { position, size } = element;

  switch (connectorPoint.position) {
    case 'top':
      return { x: position.x + size.width / 2, y: position.y };
    case 'right':
      return { x: position.x + size.width, y: position.y + size.height / 2 };
    case 'bottom':
      return { x: position.x + size.width / 2, y: position.y + size.height };
    case 'left':
      return { x: position.x, y: position.y + size.height / 2 };
  }
}

export function determineOrientation(
  startElem: IDiagramElement,
  endElem: IDiagramElement
): 'horizontal' | 'vertical' {
  const startBottom = startElem.position.y + startElem.size.height;
  const endTop = endElem.position.y;

  const verticalGap = endTop - startBottom;

  const startRight = startElem.position.x + startElem.size.width;
  const endLeft = endElem.position.x;

  const horizontalGap = endLeft - startRight;

  return horizontalGap > verticalGap ? 'vertical' : 'horizontal';
}

export function computeEndpoints(
  containerPosition: IPoint,
  startElem: IDiagramElement,
  endElem: IDiagramElement,
  orientation?: 'horizontal' | 'vertical',
  offset = 20
) {
  if (orientation !== 'horizontal' && orientation !== 'vertical') {
    orientation = determineOrientation(startElem, endElem);
  }

  let s = startElem;
  let e = endElem;

  let swap = false;
  if (orientation === 'vertical') {
    swap = s.position.x > e.position.x;
  } else {
    swap = s.position.y > e.position.y;
  }
  if (swap) {
    [s, e] = [e, s];
  }

  const centreSX = orientation === 'vertical' ? 1 : 0.5;
  const centreSY = orientation === 'vertical' ? 0.5 : 1;
  const centreEX = orientation === 'vertical' ? 0 : 0.5;
  const centreEY = orientation === 'vertical' ? 0.5 : 0;

  const startX = s.position.x + centreSX * s.size.width - containerPosition.x;
  const startY = s.position.y + centreSY * s.size.height - containerPosition.y;
  const endX = e.position.x + centreEX * e.size.width - containerPosition.x;
  const endY = e.position.y + centreEY * e.size.height - containerPosition.y;

  return { startX, startY, endX, endY, orientation, offset };
}

export function generateConnectionPathD(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  orientation: 'horizontal' | 'vertical',
  offset: number
): string {
  const deltaX = Math.abs(endX - startX);
  const deltaY = Math.abs(endY - startY);
  const delta = Math.min(deltaX * 0.15, deltaY * 0.15);

  if (orientation === 'vertical') {
    const sigY = endY > startY ? 1 : -1;
    const arc1 = startY < endY ? 1 : 0;
    const arc2 = arc1 === 1 ? 0 : 1;
    const ox = startX + offset;

    return `
      M${startX} ${startY}
      H${ox + delta}
      A${delta} ${delta} 0 0 ${arc1} ${ox + 2 * delta} ${startY + delta * sigY}
      V${endY - delta * sigY}
      A${delta} ${delta} 0 0 ${arc2} ${ox + 3 * delta} ${endY}
      H${endX}
    `.replace(/\s+/g, ' ').trim();
  } else {
    const sigX = endX > startX ? 1 : -1;
    const arc1 = startX > endX ? 1 : 0;
    const arc2 = arc1 === 1 ? 0 : 1;
    const oy = startY + offset;

    return `
      M${startX} ${startY}
      V${oy + delta}
      A${delta} ${delta} 0 0 ${arc1} ${startX + delta * sigX} ${oy + 2 * delta}
      H${endX - delta * sigX}
      A${delta} ${delta} 0 0 ${arc2} ${endX} ${oy + 3 * delta}
      V${endY}
    `.replace(/\s+/g, ' ').trim();
  }
}
