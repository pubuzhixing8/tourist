import { Point } from "roughjs/bin/geometry";
import { Element } from "../interfaces/element";
import { Paper } from "../interfaces/paper";
// import { dot } from "./matrix";

export function transform(paper: Paper, element: Element): Element {
    const transformPoints = element.points.map((point) => {
        const width = 800 - (paper.viewport.zoom - 1) * 800;
        const height = 600 - (paper.viewport.zoom - 1) * 600;
        const minX = ((paper.viewport.zoom - 1) * 800) / 2;
        const minY = ((paper.viewport.zoom - 1) * 600) / 2;

        let x = (point[0] / 800) * width + minX;
        let y = (point[1] / 600) * height + minY;
        return [x - paper.viewport.offsetX, y - paper.viewport.offsetY] as Point;
    });
    return { ...element, points: transformPoints };
}

