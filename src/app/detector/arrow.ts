import { Point } from 'roughjs/bin/geometry';
import { DISTANCE_THRESHOLD } from '../constants';
import { Element } from '../interfaces/element';
import { Selection } from '../interfaces/selection';
import { distanceBetweenPointAndSegment } from '../utils/math';
import { BaseDetector } from './base';
import { lineDetector } from './line';
import { arrowPoints } from '../utils/shape';

export const arrowDetector: BaseDetector = {
    contian: (selection: Selection, element: Element) => {
        throw new Error('error');
    },
    hit: (point: Point, element: Element) => {
        // refactor: strokeSharpness
        const hit = lineDetector.hit(point, element);
        if (hit) {
            return true;
        }
        const { pointLeft, pointRight } = arrowPoints(element.points[element.points.length - 2], element.points[element.points.length - 1]);
        const start = element.points[element.points.length - 1];
        return (
            distanceBetweenPointAndSegment(point[0], point[1], start[0], start[1], pointLeft[0], pointLeft[1]) < DISTANCE_THRESHOLD ||
            distanceBetweenPointAndSegment(point[0], point[1], start[0], start[1], pointRight[0], pointRight[1]) < DISTANCE_THRESHOLD
        );
    }
};
