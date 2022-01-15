import { Point } from "roughjs/bin/geometry";

export interface Rect {
    start: Point;
    width: number;
    height: number;
}

export const Rect = {
    interaction: (a: Rect, b: Rect) => {
        const minX = a.start[0] < b.start[0] ? a.start[0] : b.start[0];
        const maxX = a.start[0] + a.width < b.start[0] + b.width ? b.start[0] + b.width : a.start[0] + a.width;
        const minY = a.start[1] < b.start[1] ? a.start[1] : b.start[1];
        const maxY = a.start[1] + a.height < b.start[1] + b.height ? b.start[1] + b.height : a.start[1] + a.height;
        const xWidth = (a.width + b.width) - (maxX - minX);
        const yHeight = (a.height + b.height) - (maxY - minY);
        if (xWidth > 0 && yHeight > 0) {
            return true;
        } else {
            return false;
        }
    }
};