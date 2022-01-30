import { Point } from "roughjs/bin/geometry";
import { Rect } from "../interfaces/rect";
import { Selection } from '../interfaces/selection';

export function toPoint(x: number, y: number, container: SVGElement): Point {
    const rect = container.getBoundingClientRect();
    return [x - rect.x, y - rect.y];
}

export function toSelection(rect: Rect): Selection {
    return { anchor: [rect.x, rect.y], focus: [rect.x + rect.width, rect.y + rect.height] };
}

export function toRect(points: Point[]) {
    const xArray = points.map(ele => ele[0]);
    const yArray = points.map(ele => ele[1]);
    const xMin = Math.min(...xArray);
    const xMax = Math.max(...xArray);
    const yMin = Math.min(...yArray);
    const yMax = Math.max(...yArray);
    return { x: xMin, y: yMin, width: xMax - xMin, height: yMax - yMin };
}

export function toSelectionByPoint(point: Point): Selection {
    return { anchor: [point[0] - 5, point[1] - 5], focus: [point[0] + 5, point[1] + 5] };
}