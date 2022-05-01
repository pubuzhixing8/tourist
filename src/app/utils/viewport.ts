import { Point } from "roughjs/bin/geometry";
import { Element } from "../interfaces/element";
import { Paper } from "../interfaces/paper";

export function transform(paper: Paper, element: Element): Element {
    return { ...element, points: transformPoints(paper, element.points) };
}

export function transformPoints(paper: Paper, points: Point[]) {
    const { width, height } = (paper.container as SVGGElement).getBoundingClientRect();
    const viewBox = getViewBox(paper);
    const newPoints = points.map((point) => {
        let x = (point[0] / width) * viewBox.width + viewBox.minX;
        let y = (point[1] / height) * viewBox.height + viewBox.minY;
        return [x - paper.viewport.offsetX, y - paper.viewport.offsetY] as Point;
    });
    return newPoints;
}

export function getViewBox(paper: Paper): ViewBox {
    const viewBoxValues = paper?.container?.getAttribute('viewBox');
    const { width, height } = paper?.container?.getBoundingClientRect() as DOMRect;
    let deltaX = 0;
    let deltaY = 0;
    if (paper.container && viewBoxValues) {
        const values = viewBoxValues.split(',');
        const scaleWidth = width - Number(values[2].trim());
        const scaleHeight = height - Number(values[3].trim());
        deltaX = (scaleWidth / 2 - Number(values[0].trim()));
        deltaY = (scaleHeight / 2 - Number(values[1].trim()));
    }
    const scaleWidth = (paper.viewport.zoom - 1) * width;
    const scaleHeight = (paper.viewport.zoom - 1) * height;
    const viewBoxWidth = width - scaleWidth;
    const viewBoxHeight = height - scaleHeight;
    const minX = scaleWidth / 2;
    const minY = scaleHeight / 2;
    return { minX: minX - deltaX, minY: minY - deltaY, width: viewBoxWidth, height: viewBoxHeight };
}

export type ViewBox = {
    minX: number,
    minY: number,
    width: number,
    height: number;
}