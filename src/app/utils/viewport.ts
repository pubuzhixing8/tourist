import { Point } from "roughjs/bin/geometry";
import { Element } from "../interfaces/element";
import { Paper } from "../interfaces/paper";

export function transform(paper: Paper, element: Element): Element {
    const baseWidth: number = paper.viewport.width
    const baseHeight: number = paper.viewport.height;
    const viewBox = getViewBox(paper);
    const transformPoints = element.points.map((point) => {
        let x = (point[0] / baseWidth) * viewBox.width + viewBox.minX;
        let y = (point[1] / baseHeight) * viewBox.height + viewBox.minY;
        return [x - paper.viewport.offsetX, y - paper.viewport.offsetY] as Point;
    });
    return { ...element, points: transformPoints };
}

export function getViewBox(paper: Paper): ViewBox {
    const baseWidth: number = paper.viewport.width
    const baseHeight: number = paper.viewport.height;
    const scaleWidth = (paper.viewport.zoom - 1) * baseWidth;
    const scaleHeight = (paper.viewport.zoom - 1) * baseHeight;
    const width = baseWidth - scaleWidth;
    const height = baseHeight - scaleHeight;
    const minX = scaleWidth / 2;
    const minY = scaleHeight / 2;
    return { minX, minY, width, height };
}

export type ViewBox = {
    minX: number,
    minY: number,
    width: number,
    height: number;
}