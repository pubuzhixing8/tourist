import { Point } from "roughjs/bin/geometry";
import { RoughSVG } from "roughjs/bin/svg";
import { roughDrawer } from "../drawer";
import { Attributes, EdgeMode } from "../interfaces/attributes";
import { ElementType, Element } from "../interfaces/element";
import { addElement, Paper } from "../interfaces/paper";
import { PointerType } from "../interfaces/pointer";
import { generateKey } from "../utils/key";
import { toPoint } from "../utils/position";

const DRAW_SKIP_SAWTOOTH = 3;

export function shapePaper<T extends Paper>(paper: T, rc: RoughSVG, attributes: Attributes) {
    let start: Point | null = null;
    let end: Point | null = null;
    let isDragging = false;
    let dragPoints: Point[] = [];
    let hostSVGG: SVGGElement[] = [];
    const { mousedown, mousemove, mouseup } = paper;

    paper.mousedown = (event: MouseEvent) => {
        if (paper.pointer === PointerType.draw || paper.pointer === PointerType.rectangle) {
            start = toPoint(event.x, event.y, paper.container as SVGElement);
            return;
        }
        mousedown(event);
    }

    paper.mousemove = (event: MouseEvent) => {
        if (start) {
            isDragging = true;
            paper.dragging = true;
            end = toPoint(event.x, event.y, paper.container as SVGElement);
            hostSVGG.forEach((g) => g.remove());
            dragPoints.push(end);
            let g: SVGGElement[] | SVGGElement = [];
            if (paper.pointer === PointerType.rectangle) {
                const tempElement = createRectangle(start, end, attributes.stroke, attributes.strokeWidth, attributes.edgeMode as EdgeMode);
                g = roughDrawer.draw(rc, tempElement);
            }
            if (paper.pointer === PointerType.draw) {
                let points = [start, ...dragPoints];
                points = points.filter((value, index) => {
                    if (index % DRAW_SKIP_SAWTOOTH === 0 || index === points.length - 1) {
                        return true;
                    } else {
                        return false;
                    }
                });
                const curveElement = createCurve(points, attributes.stroke, attributes.strokeWidth);
                g = roughDrawer.draw(rc, curveElement);
            }
            if (Array.isArray(g)) {
                g.forEach((dom) => {
                    paper.container?.appendChild(dom);
                });
                hostSVGG = g;
            } else {
                hostSVGG = [g];
                paper.container?.appendChild(g);
            }
            return;
        }
        mousemove(event);
    }

    paper.mouseup = (event: MouseEvent) => {
        mouseup(event);
        if (isDragging && start && end) {
            if (paper.pointer === PointerType.rectangle) {
                addElement(paper, createRectangle(start, end, attributes.stroke, attributes.strokeWidth, attributes.edgeMode as EdgeMode));
            }
            if (paper.pointer === PointerType.draw) {
                let points = [start, ...dragPoints];
                points = points.filter((value, index) => {
                    if (index % DRAW_SKIP_SAWTOOTH === 0 || index === points.length - 1) {
                        return true;
                    } else {
                        return false;
                    }
                });
                const curveElement = createCurve(points, attributes.stroke, attributes.strokeWidth);
                addElement(paper, curveElement);
            }
            hostSVGG.forEach((g) => g.remove());
        }
        isDragging = false;
        start = null;
        end = null;
        dragPoints = [];
        paper.dragging = false;
    }

    return paper;
}

export function createRectangle(start: Point, end: Point, stroke: string, strokeWidth: number, edgeMode: EdgeMode): Element {
    return { type: ElementType.rectangle, points: [start, end], key: generateKey(), stroke, strokeWidth, edgeMode };
}

export function createCurve(points: Point[], stroke: string, strokeWidth: number): Element {
    return { type: ElementType.curve, points, key: generateKey(), stroke, strokeWidth };
}