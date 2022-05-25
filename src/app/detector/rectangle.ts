import { Point } from 'roughjs/bin/geometry';
import { DISTANCE_THRESHOLD } from '../constants';
import { Element } from '../interfaces/element';
import { Selection } from '../interfaces/selection';
import { distanceBetweenPointAndSegment } from '../utils/math';
import { toRectangleClient } from '../utils/shape';
import { BaseDetector } from './base';

export const rectangleDetector: BaseDetector = {
    contian: (selection: Selection, element: Element) => {
        throw new Error('error');
    },
    hit: (point: Point, element: Element) => {
        const [start, end] = element.points;
        const rectangleClient = toRectangleClient([start, end]);
        // (x1, y1) --A-- (x2, y1)
        //    |D             |B
        // (x1, y2) --C-- (x2, y2)
        return (
            distanceBetweenPointAndSegment(
                point[0],
                point[1],
                rectangleClient.x,
                rectangleClient.y,
                rectangleClient.x + rectangleClient.width,
                rectangleClient.y
            ) < DISTANCE_THRESHOLD || // A
            distanceBetweenPointAndSegment(
                point[0],
                point[1],
                rectangleClient.x + rectangleClient.width,
                rectangleClient.y,
                rectangleClient.x + rectangleClient.width,
                rectangleClient.y + rectangleClient.height
            ) < DISTANCE_THRESHOLD || // B
            distanceBetweenPointAndSegment(
                point[0],
                point[1],
                rectangleClient.x + rectangleClient.width,
                rectangleClient.y + rectangleClient.height,
                rectangleClient.x,
                rectangleClient.y + rectangleClient.height
            ) < DISTANCE_THRESHOLD || // C
            distanceBetweenPointAndSegment(
                point[0],
                point[1],
                rectangleClient.x,
                rectangleClient.y + rectangleClient.height,
                rectangleClient.x,
                rectangleClient.y
            ) < DISTANCE_THRESHOLD // D
        );
        throw new Error('error');
    }
};
