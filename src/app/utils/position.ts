import { Point } from "roughjs/bin/geometry";
// import { Rectangle } from "../interfaces/rectangle";
import { Selection } from '../interfaces/selection';

export enum RectanglePosition {
    left = 1,
    top,
    right,
    bottom,
    leftTop,
    rightTop,
    rightBottom,
    leftBottom,
    unkonwn
}

export const RectanglePositionToCursor = {
    [`${RectanglePosition.right}`]: 'ew-resize',
    [`${RectanglePosition.rightTop}`]: 'nesw-resize',
    [`${RectanglePosition.leftTop}`]: 'nwse-resize',
    [`${RectanglePosition.top}`]: 'ns-resize',
    [`${RectanglePosition.rightBottom}`]: 'nwse-resize',
    [`${RectanglePosition.leftBottom}`]: 'nesw-resize',
    [`${RectanglePosition.bottom}`]: 'ns-resize',
    [`${RectanglePosition.left}`]: 'ew-resize',
}

export function toPoint(x: number, y: number, container: SVGElement): Point {
    const rect = container.getBoundingClientRect();
    return [x - rect.x, y - rect.y];
}

// export function toSelection(rect: Rectangle): Selection {
//     return { anchor: [rect.x, rect.y], focus: [rect.x + rect.width, rect.y + rect.height] };
// }

export function toRectangle(points: Point[]) {
    const xArray = points.map(ele => ele[0]);
    const yArray = points.map(ele => ele[1]);
    const xMin = Math.min(...xArray);
    const xMax = Math.max(...xArray);
    const yMin = Math.min(...yArray);
    const yMax = Math.max(...yArray);
    const rect = { x: xMin, y: yMin, width: xMax - xMin , height: yMax - yMin };
    if (rect.width === 0) {
        rect.width = 1;
    }
    if (rect.height === 0) {
        rect.height = 1;
    }
    return rect;
}

export function toSelectionByPoint(point: Point): Selection {
    const distance = 8;
    return { anchor: [point[0] - distance, point[1] - distance], focus: [point[0] + distance * 2, point[1] + distance * 2] };
}