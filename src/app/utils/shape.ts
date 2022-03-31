import { Point } from "roughjs/bin/geometry";
import { rotate } from "./math";

export interface RectangleClient {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface EllipseClient {
    center: Point;
    width: number;
    height: number;
}

export function toRectangleClient(points: [Point, Point]): RectangleClient {
    const xArray = points.map(ele => ele[0]);
    const yArray = points.map(ele => ele[1]);
    const xMin = Math.min(...xArray);
    const xMax = Math.max(...xArray);
    const yMin = Math.min(...yArray);
    const yMax = Math.max(...yArray);
    const rect = { x: xMin, y: yMin, width: xMax - xMin, height: yMax - yMin };
    return rect;
}

export function toEllipseClient(points: [Point, Point]): EllipseClient {
    const [start, end] = points;
    const width = Math.abs(end[0] - start[0]);
    let height = Math.abs(end[1] - start[1]);
    const center: Point = [end[0] > start[0] ? end[0] - width / 2 : end[0] + width / 2, end[1] > start[1] ? end[1] - height / 2 : end[1] + height / 2];
    return { center, width, height };
}


const degree = 20;
const rotateLine = 20;

export function arrowPoints(start: Point, end: Point) {
    const width = Math.abs(start[0] - end[0]);
    const height = Math.abs(start[1] - end[1]);
    let line = Math.hypot(width, height);
    const realRotateLine = line > rotateLine * 2 ? rotateLine : line / 2;
    const rotateWidth = (realRotateLine / line) * width;
    const rotateHeight = (realRotateLine / line) * height;
    const rotatePoint = [end[0] > start[0] ? end[0] - rotateWidth : end[0] + rotateWidth, end[1] > start[1] ? end[1] - rotateHeight : end[1] + rotateHeight];
    const pointRight = rotate(rotatePoint[0], rotatePoint[1], end[0], end[1], (degree * Math.PI) / 180) as Point;
    const pointLeft = rotate(rotatePoint[0], rotatePoint[1], end[0], end[1], (-degree * Math.PI) / 180) as Point;
    return { pointLeft, pointRight };
}