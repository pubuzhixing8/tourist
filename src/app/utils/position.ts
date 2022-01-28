import { Point } from "roughjs/bin/geometry";

export function toPoint(x: number, y: number, container: HTMLElement): Point {
    const rect = container.getBoundingClientRect();
    return [x - rect.x, y - rect.y];
}