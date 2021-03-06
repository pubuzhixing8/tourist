import { Paper } from '../interfaces/paper';
import { PAPER_TO_ROUGHSVG } from './weak-maps';
import { Point } from 'roughjs/bin/geometry';
import { RoughSVG } from 'roughjs/bin/svg';
import { Attributes } from '../interfaces/attributes';
import { toRectangleClient } from './shape';

export function getRoughSVG(paper: Paper) {
    const roughSVG = PAPER_TO_ROUGHSVG.get(paper);
    if (!roughSVG) {
        throw new Error('undefined roughSVG');
    }
    return roughSVG;
}

export function drawRoundRectangle(rs: RoughSVG, start: Point, end: Point, attributes: Partial<Attributes>) {
    const rectangleClient = toRectangleClient([start, end]);
    const x1 = rectangleClient.x;
    const y1 = rectangleClient.y;
    const x2 = rectangleClient.x + rectangleClient.width;
    const y2 = rectangleClient.y + rectangleClient.height;
    const radius = Math.min(rectangleClient.width, rectangleClient.height) / 4;
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
        attributes
    );
}
