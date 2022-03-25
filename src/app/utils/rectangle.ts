import { Point } from "roughjs/bin/geometry";
import { RoughSVG } from "roughjs/bin/svg";
import { Attributes } from "../interfaces/attributes";

export function drawRoundRectangle(start: Point, end: Point, rs: RoughSVG, attributes: Partial<Attributes>) {
    const width = Math.abs(end[0] - start[0]);
    const height = Math.abs(end[1] - start[1]);
    const radius = Math.min(width, height) / 4;
    const point1 = [start[0] + radius, start[1]];
    const point2 = [end[0] - radius, start[1]];
    const point3 = [end[0], start[1] + radius];
    const point4 = [end[0], end[1] - radius];
    const point5 = [end[0] - radius, end[1]];
    const point6 = [start[0] + radius, end[1]];
    const point7 = [start[0], end[1] - radius];
    const point8 = [start[0], start[1] + radius];
    return rs.path(`M${point2[0]} ${point2[1]} A ${radius} ${radius}, 0, 0, 1, ${point3[0]} ${point3[1]} L ${point4[0]} ${point4[1]} A ${radius} ${radius}, 0, 0, 1, ${point5[0]} ${point5[1]} L ${point6[0]} ${point6[1]} A ${radius} ${radius}, 0, 0, 1, ${point7[0]} ${point7[1]} L ${point8[0]} ${point8[1]} A ${radius} ${radius}, 0, 0, 1, ${point1[0]} ${point1[1]} Z`, attributes);
}