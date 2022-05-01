import { Point } from "roughjs/bin/geometry";
import { roughDrawer } from "../engine";
import { ElementType, Element } from "../interfaces/element";
import { addElement, Paper } from "../interfaces/paper";
import { PointerType } from "../interfaces/pointer";
import { appendHostSVGG, arrayHostSVGG, destroyHostSVGG, getAttributes } from "../utils/common";
import { generateKey } from "../utils/key";
import { toPoint } from "../utils/position";
import { getRoughSVG } from "../utils/rough";
import { transform } from "../utils/viewport";

export function circlePaper<T extends Paper>(paper: T) {
    let start: Point | null = null;
    let end: Point | null = null;
    let isDragging = false;
    let hostSVGG: SVGGElement[] = [];
    let shiftKey = false;
    const { mousedown, mousemove, mouseup, keydown, keyup } = paper;

    paper.keydown = (event: KeyboardEvent) => {
        shiftKey = event.shiftKey;
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
        const attributes = getAttributes(paper);
        if (start) {
            isDragging = true;
            paper.dragging = true;
            end = toPoint(event.x, event.y, paper.container as SVGElement);
            hostSVGG = destroyHostSVGG(hostSVGG);
            if (paper.pointer === PointerType.circle) {
                const width = Math.abs(end[0] - start[0]);
                let realEnd = end;
                if (shiftKey) {
                    realEnd = [end[0], end[1] > start[1] ? start[1] + width : start[1] - width];
                }
                const curveElement = transform(paper, createCircle(start, realEnd, attributes.stroke, attributes.strokeWidth));
                const g = roughDrawer.draw(getRoughSVG(paper), curveElement);
                appendHostSVGG(paper, g);
                hostSVGG = arrayHostSVGG(g);
            }
            return;
        }
        mousemove(event);
    }

    paper.mouseup = (event: MouseEvent) => {
        const attributes = getAttributes(paper);
        mouseup(event);
        if (isDragging && start) {
            if (paper.pointer === PointerType.circle && end) {
                const width = Math.abs(end[0] - start[0]);
                let realEnd = end;
                if (shiftKey) {
                    realEnd = [end[0], end[1] > start[1] ? start[1] + width : start[1] - width];
                }
                const circleElement = transform(paper, createCircle(start, realEnd, attributes.stroke, attributes.strokeWidth));
                addElement(paper, circleElement);
            }
            hostSVGG = destroyHostSVGG(hostSVGG);
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