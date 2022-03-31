import { Point } from "roughjs/bin/geometry";
import { DISTANCE_THRESHOLD } from "../constants";
import { Element } from "../interfaces/element";
import { Selection } from "../interfaces/selection";
import { toEllipseClient } from "../utils/shape";
import { BaseDetector } from "./base";

export const ellipseDetector: BaseDetector = {
    contian: (selection: Selection, element: Element) => {
        throw new Error('error');
    },
    hit: (point: Point, element: Element) => {
        const [x, y] = point;
        const [start, end] = element.points;
        const ellipseClient = toEllipseClient([start, end]);
        // https://stackoverflow.com/a/46007540/232122
        const px = Math.abs(x - ellipseClient.center[0] - ellipseClient.width / 2);
        const py = Math.abs(y - ellipseClient.center[1] - ellipseClient.height / 2);

        let tx = 0.707;
        let ty = 0.707;

        const a = ellipseClient.width / 2;
        const b = ellipseClient.height / 2;

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