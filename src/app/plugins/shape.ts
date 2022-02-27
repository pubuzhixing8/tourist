import { Point } from "roughjs/bin/geometry";
import { RoughSVG } from "roughjs/bin/svg";
import { Attributes, EdgeMode } from "../interfaces/attributes";
import { ElementType } from "../interfaces/element";
import { addElement, Paper } from "../interfaces/paper";
import { PointerType } from "../interfaces/pointer";
import { generateKey } from "../utils/key";
import { toPoint } from "../utils/position";
import { drawRoundRectangle } from "../utils/rectangle";

const DRAW_SKIP_SAWTOOTH = 3;

export function shapePaper<T extends Paper>(paper: T, rc: RoughSVG, attributes: Attributes) {
    let start: Point | null = null;
    let end: Point | null = null;
    let isDragging = false;
    let dragPoints: Point[] = [];
    let domElement: SVGElement | null = null;
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
            if (domElement) {
                domElement.remove();
            }
            dragPoints.push(end);
            if (paper.pointer === PointerType.rectangle) {
                if (attributes.edgeMode === EdgeMode.round) {
                    domElement = drawRoundRectangle(start, end, rc, { stroke: attributes.color, strokeWidth: attributes.strokeWidth } as any);
                } else {
                    domElement = rc.rectangle(start[0], start[1], end[0] - start[0], end[1] - start[1], { stroke: attributes.color, strokeWidth: attributes.strokeWidth });
                }
                paper.container?.appendChild(domElement);
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
                domElement = rc.curve(points, { stroke: attributes.color, strokeWidth: attributes.strokeWidth });
                paper.container?.appendChild(domElement);
            }
            return;
        }
        mousemove(event);
    }

    paper.mouseup = (event: MouseEvent) => {
        mouseup(event);
        if (isDragging && start) {
            if (paper.pointer === PointerType.rectangle) {
                const element = { type: ElementType.rectangle, points: [start, end], key: generateKey(), color: attributes.color, strokeWidth: attributes.strokeWidth, edgeMode: attributes.edgeMode };
                addElement(paper, element as any);
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
                addElement(paper, { type: ElementType.curve, points, key: generateKey(), color: attributes.color, strokeWidth: attributes.strokeWidth });
            }
            domElement?.remove();
        }
        isDragging = false;
        start = null;
        end = null;
        dragPoints = [];
        paper.dragging = false;
    }

    return paper;
}