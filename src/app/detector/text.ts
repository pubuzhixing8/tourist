import { Point } from "roughjs/bin/geometry";
import { Element } from "../interfaces/element";
import { Selection } from "../interfaces/selection";
import { toRectangleClient } from "../utils/shape";
import { BaseDetector } from "./base";
import { rectangleDetector } from "./rectangle";

export const textDetector: BaseDetector = {
    contian: (selection: Selection, element: Element) => {
        throw new Error('error');
    },
    hit: (point: Point, element: Element) => {
        const hit = rectangleDetector.hit(point, element);
        if (hit) {
            return true;
        }
        const [start, end] = element.points;
        const rectangleClient = toRectangleClient([start, end]);
        if (point[0] > rectangleClient.x && point[0] < rectangleClient.x + rectangleClient.width
            && point[1] > rectangleClient.y && point[1] < rectangleClient.y + rectangleClient.height) {
            return true;
        }
        return false;
    }
};