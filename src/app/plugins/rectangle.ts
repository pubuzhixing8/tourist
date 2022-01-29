import { Point } from "roughjs/bin/geometry";
import { RoughSVG } from "roughjs/bin/svg";
import { Attributes } from "../interfaces/attributes";
import { ElementType } from "../interfaces/element";
import { addElement, Paper } from "../interfaces/paper";
import { PointerType } from "../interfaces/pointer";
import { generateKey } from "../utils/key";
import { toPoint } from "../utils/position";

export function rectanglePaper<T extends Paper>(paper: T, rc: RoughSVG, attributes: Attributes) {
    let start: Point | null = null;
    let end: Point | null = null;
    let isDragging = false;
    let domElement: SVGElement | null = null;
    const { mousedown, mousemove, mouseup } = paper;

    paper.mousedown = (event: MouseEvent) => {
        if (paper.pointer === PointerType.pointer) {
            start = toPoint(event.x, event.y, paper.container as any);
            return;
        }
        mousedown(event);
    }

    paper.mousemove = (event: MouseEvent) => {
        if (start) {
            isDragging = true;
            end = toPoint(event.x, event.y, paper.container as any);
            if (domElement) {
                domElement.remove();
            }
            domElement = rc.rectangle(start[0], start[1], end[0] - start[0], end[1] - start[1], { stroke: attributes.color, strokeWidth: attributes.strokeWidth });
            paper.container?.appendChild(domElement);
            return;
        }
        mousemove(event);
    }

    paper.mouseup = (event: MouseEvent) => {
        mouseup(event);
        if (isDragging) {
            const element = { type: ElementType.rectangle, points: [start, end], key: generateKey(), color: attributes.color, strokeWidth: attributes.strokeWidth };
            addElement(paper, element as any);
            domElement?.remove();
        }
        isDragging = false;
        start = null;
        end = null;
    }

    return paper;
}