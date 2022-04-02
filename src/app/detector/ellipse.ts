import { Point } from "roughjs/bin/geometry";
import { DISTANCE_THRESHOLD } from "../constants";
import { Element } from "../interfaces/element";
import { Selection } from "../interfaces/selection";
import { toEllipseClient, toRectangleClient } from "../utils/shape";
import { BaseDetector } from "./base";

export const ellipseDetector: BaseDetector = {
    contian: (selection: Selection, element: Element) => {
        throw new Error('error');
    },
    hit: (point: Point, element: Element) => {
        const rectangleClient = toRectangleClient([element.points[0], element.points[1]]);
        // https://stackoverflow.com/a/46007540/232122
        const px = Math.abs(point[0] - rectangleClient.x - rectangleClient.width / 2);
        const py = Math.abs(point[1] - rectangleClient.y - rectangleClient.height / 2);

        let tx = 0.707;
        let ty = 0.707;

        const a = Math.abs(rectangleClient.width) / 2;
        const b = Math.abs(rectangleClient.height) / 2;

        [0, 1, 2, 3].forEach(x => {
            const xx = a * tx;
            const yy = b * ty;

            const ex = ((a * a - b * b) * tx ** 3) / a;
            const ey = ((b * b - a * a) * ty ** 3) / b;

            const rx = xx - ex;
            const ry = yy - ey;

            const qx = px - ex;
            const qy = py - ey;

            const r = Math.hypot(ry, rx);
            const q = Math.hypot(qy, qx);

            tx = Math.min(1, Math.max(0, ((qx * r) / q + ex) / a));
            ty = Math.min(1, Math.max(0, ((qy * r) / q + ey) / b));
            const t = Math.hypot(ty, tx);
            tx /= t;
            ty /= t;
        });

        return Math.hypot(a * tx - px, b * ty - py) < DISTANCE_THRESHOLD;
    }
};