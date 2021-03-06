import { MindmapNode } from '../interfaces/node';
import { Options } from 'roughjs/bin/core';
import { Point } from 'roughjs/bin/geometry';
import { RoughSVG } from 'roughjs/bin/svg';
import { MAX_RADIUS } from '../constants';
import { PlaitBoard } from 'plait/interfaces/board';

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

export function drawRoundRectangle(rs: RoughSVG, x1: number, y1: number, x2: number, y2: number, options: Options, outline = false) {
    const width = Math.abs(x1 - x2);
    const height = Math.abs(y1 - y2);
    const defaultRadius = Math.min(width, height) / 4;
    const radius = defaultRadius > MAX_RADIUS ? (outline ? MAX_RADIUS + 2 : MAX_RADIUS) : defaultRadius;
    const point1 = [x1 + radius, y1];
    const point2 = [x2 - radius, y1];
    const point3 = [x2, y1 + radius];
    const point4 = [x2, y2 - radius];
    const point5 = [x2 - radius, y2];
    const point6 = [x1 + radius, y2];
    const point7 = [x1, y2 - radius];
    const point8 = [x1, y1 + radius];
    return rs.path(
        `M${point2[0]} ${point2[1]} A ${radius} ${radius}, 0, 0, 1, ${point3[0]} ${point3[1]} L ${point4[0]} ${point4[1]} A ${radius} ${radius}, 0, 0, 1, ${point5[0]} ${point5[1]} L ${point6[0]} ${point6[1]} A ${radius} ${radius}, 0, 0, 1, ${point7[0]} ${point7[1]} L ${point8[0]} ${point8[1]} A ${radius} ${radius}, 0, 0, 1, ${point1[0]} ${point1[1]} Z`,
        options
    );
}

export function getRectangleByNode(node: MindmapNode) {
    const x = Math.round(node.x + node.hgap);
    const y = Math.round(node.y + node.vgap);
    const width = Math.round(node.width - node.hgap * 2);
    const height = Math.round(node.height - node.vgap * 2);
    return {
        x,
        y,
        width,
        height
    };
}

export function hitMindmapNode(baord: PlaitBoard, point: Point, node: MindmapNode) {
    const { x: baseX, y: baseY, width, height } = getRectangleByNode(node);
    const x = baseX + baord.viewport.offsetX;
    const y = baseY + baord.viewport.offsetY;
    return point[0] >= x && point[0] <= x + width && point[1] >= y && point[1] <= y + height;
}
