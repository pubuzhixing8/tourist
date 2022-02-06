import { Point } from "roughjs/bin/geometry";
import { RoughSVG } from "roughjs/bin/svg";
import { Attributes } from "../interfaces/attributes";
import { ElementType } from "../interfaces/element";
import { addElement, Paper } from "../interfaces/paper";
import { PointerType } from "../interfaces/pointer";
import { generateKey } from "../utils/key";
import { toPoint } from "../utils/position";

const DRAW_SKIP_SAWTOOTH = 3;

export function linePaper<T extends Paper>(paper: T, rc: RoughSVG, attributes: Attributes) {
    let start: Point | null = null;
    let end: Point | null = null;
    let isDragging = false;
    let dragPoints: Point[] = [];
    let domElement: SVGElement | null = null;
    const { mousedown, mousemove, mouseup } = paper;

    paper.mousedown = (event: MouseEvent) => {
        if (paper.pointer === PointerType.line) {
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
            if (paper.pointer === PointerType.line) {
                domElement = rc.linearPath([start, end], { stroke: attributes.color, strokeWidth: attributes.strokeWidth });
                paper.container?.appendChild(domElement);
            }
            return;
        }
        mousemove(event);
    }

    paper.mouseup = (event: MouseEvent) => {
        mouseup(event);
        if (isDragging && start) {
            if (paper.pointer === PointerType.line) {
                const element = { type: ElementType.line, points: [start, end], key: generateKey(), color: attributes.color, strokeWidth: attributes.strokeWidth };
                addElement(paper, element as any);
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