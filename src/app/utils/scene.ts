import { Point } from "roughjs/bin/geometry";
import { Element } from "../interfaces/element";
import { Paper } from "../interfaces/paper";

export function transform(paper: Paper, element: Element): Element {
    const transformPoints = element.points.map((point) => {
        return [point[0] - paper.sceneState.scrollX , point[1] - paper.sceneState.scrollY] as Point;
    });
    return { ...element, points: transformPoints };
}