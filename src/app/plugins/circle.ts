import { Point } from "roughjs/bin/geometry";
import { RoughSVG } from "roughjs/bin/svg";
import { Attributes, EdgeMode } from "../interfaces/attributes";
import { ElementType, Element } from "../interfaces/element";
import { addElement, Paper } from "../interfaces/paper";
import { PointerType } from "../interfaces/pointer";
import { generateKey } from "../utils/key";
import { toPoint } from "../utils/position";

export function circlePaper<T extends Paper>(paper: T, rc: RoughSVG, attributes: Attributes) {
    let start: Point | null = null;
    let end: Point | null = null;
    let isDragging = false;
    let domElement: SVGElement | null = null;
    let shiftKey = false;
    const { mousedown, mousemove, mouseup, keydown, keyup } = paper;

    paper.keydown = (event: KeyboardEvent) => {
        shiftKey = event.shiftKey;
        console.log(`shfit：` + shiftKey);
        keydown(event);
    }

    paper.keyup = (event: KeyboardEvent) => {
        shiftKey = event.shiftKey;
        keyup(event);
    }

    paper.mousedown = (event: MouseEvent) => {
        if (paper.pointer === PointerType.circle) {
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
            if (paper.pointer === PointerType.circle) {
                const width = Math.abs(end[0] - start[0]);
                let height = Math.abs(end[1] - start[1]);
                let realEnd = end;
                if (shiftKey) {
                    realEnd = [end[0], end[1] > start[1] ? start[1] + width : start[1] - width];
                    height = width;
                }
                const centerPoint = [realEnd[0] > start[0] ? realEnd[0] - width / 2 : realEnd[0] + width / 2, realEnd[1] > start[1] ? realEnd[1] - height / 2 : realEnd[1] + height / 2];
                domElement = rc.ellipse(centerPoint[0], centerPoint[1], width, height, { stroke: attributes.stroke, strokeWidth: attributes.strokeWidth });
                paper.container?.appendChild(domElement);
            }
            return;
        }
        mousemove(event);
    }

    paper.mouseup = (event: MouseEvent) => {
        mouseup(event);
        if (isDragging && start) {
            if (paper.pointer === PointerType.circle && end) {
                const width = Math.abs(end[0] - start[0]);
                let realEnd = end;
                if (shiftKey) {
                    realEnd = [end[0], end[1] > start[1] ? start[1] + width : start[1] - width];
                }
                const circleElement = createCircle(start, realEnd, attributes.stroke, attributes.strokeWidth);
                addElement(paper, circleElement);
            }
            domElement?.remove();
        }
        isDragging = false;
        start = null;
        end = null;
        paper.dragging = false;
    }

    return paper;
}

export function createCircle(start: Point, end: Point, stroke: string, strokeWidth: number): Element {
    return { type: ElementType.circle, points: [start, end], key: generateKey(), stroke, strokeWidth };
}