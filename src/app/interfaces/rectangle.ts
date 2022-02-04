import { Point } from "roughjs/bin/geometry";
import { ACTIVE_RECTANGLE_DISTANCE } from "../constants";
import { RectanglePosition } from "../utils/position";

export interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
}

export const Rectangle = {
    create(x: number, y: number, width: number, height: number): Rectangle {
        return { x, y, width, height };
    },
    getStartPoint(rectangle: Rectangle): Point {
        return [rectangle.x, rectangle.y];
    },
    getEndPoint(rectangle: Rectangle): Point {
        return [rectangle.x + rectangle.width, rectangle.y + rectangle.height];
    },
    getPosition(point: Point, rectangle: Rectangle): RectanglePosition | undefined {
        const start = Rectangle.getStartPoint(rectangle);
        const end = Rectangle.getEndPoint(rectangle);

        const segment = ACTIVE_RECTANGLE_DISTANCE;

        const leftRange = [start[0] - segment, start[0] + segment];
        const topRange = [start[1] - segment, start[1] + segment];
        const rightRange = [end[0] - segment, end[0] + segment];
        const bottomRange = [end[1] - segment, end[1] + segment];

        const inLeft = point[0] > leftRange[0] && point[0] < leftRange[1];
        const inTop = point[1] > topRange[0] && point[1] < topRange[1];
        const inRight = point[0] > rightRange[0] && point[0] < rightRange[1];
        const inBottom = point[1] > bottomRange[0] && point[1] < bottomRange[1];

        if (inLeft && inTop) {
            return RectanglePosition.leftTop;
        }
        if (inTop && inRight) {
            return RectanglePosition.rightTop
        }
        if (inRight && inBottom) {
            return RectanglePosition.rightBottom;
        }
        if (inBottom && inLeft) {
            return RectanglePosition.leftBottom;
        }

        const xRange = [start[0] + segment, end[0] - segment];
        const yRange = [start[1] + segment, end[1] - segment];
        const inXRange = point[0] >= xRange[0] && point[0] <= xRange[1];
        const inYRange = point[1] >= yRange[0] && point[1] <= yRange[1];

        if (inLeft && inYRange) {
            return RectanglePosition.left;
        }
        if (inTop && inXRange) {
            return RectanglePosition.top;
        }
        if (inRight && inYRange) {
            return RectanglePosition.right;
        }
        if (inBottom && inXRange) {
            return RectanglePosition.bottom;
        }

        return undefined;
    },
    isRight() {

    }
};