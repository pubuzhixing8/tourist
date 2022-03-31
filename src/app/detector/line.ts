import { Point } from "roughjs/bin/geometry";
import { DISTANCE_THRESHOLD } from "../constants";
import { EdgeMode } from "../interfaces/attributes";
import { Element } from "../interfaces/element";
import { Selection } from "../interfaces/selection";
import { distanceBetweenPointAndSegment } from "../utils/math";
import { BaseDetector } from "./base";
import { pointsOnBezierCurves } from 'points-on-curve';
import { curveToBezier } from 'points-on-curve/lib/curve-to-bezier.js';


export const lineDetector: BaseDetector = {
    contian: (selection: Selection, element: Element) => {
        throw new Error('error');
    },
    hit: (point: Point, element: Element) => {
        // refactor: strokeSharpness
        if (element.edgeMode === EdgeMode.round) {
            // 贝塞尔曲线
            const bcurve = curveToBezier(element.points);
            const points = pointsOnBezierCurves(bcurve, 1, 3);
            return pointsDetection(point, points as Point[], DISTANCE_THRESHOLD);
        } else {
            // 直线
            return pointsDetection(point, element.points, DISTANCE_THRESHOLD);
        }
        throw new Error('error');
    }
};

export function pointsDetection(origin: Point, target: Point[], distance: number) {
    return target.filter((value, index) => index > 0).some((value, index) => {
        const start = target[index - 1];
        const end = value;
        return distanceBetweenPointAndSegment(origin[0], origin[1], start[0], start[1], end[0], end[1]) < distance;
    });
}