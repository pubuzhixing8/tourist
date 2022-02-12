import { Point } from "roughjs/bin/geometry";
import { rotate } from "./math";

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