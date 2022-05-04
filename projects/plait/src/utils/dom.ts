import { Point } from "roughjs/bin/geometry";

export function mousePointToRelativePoint(x: number, y: number, container: SVGElement): Point {
    const rect = container.getBoundingClientRect();
    return [x - rect.x, y - rect.y];
}
