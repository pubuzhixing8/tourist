import { Point } from "roughjs/bin/geometry";
import { RoughSVG } from "roughjs/bin/svg";
import { Attributes } from "../interfaces/attributes";
import { ElementType } from "../interfaces/element";
import { addElement, Paper } from "../interfaces/paper";
import { generateKey } from "../utils/key";
import { toPoint } from "../utils/position";

export function rectanglePaper(paper: Paper, rc: RoughSVG, attributes: Attributes) {
    let start: Point | null = null;
    let end: Point | null = null;
    let isReady = false;
    let isDrawing = false;
    let rect: any = null;
    const { mousedown, mousemove, mouseup } = paper;

    paper.mousedown = (event: MouseEvent) => {
        if (paper.pointer === 'rectangle') {
            start = toPoint(event.x, event.y, paper.container as any);
            isReady = true;
            return;
        }
        mousedown(event);
    }

    paper.mousemove = (event: MouseEvent) => {
        if (isReady && start) {
            isDrawing = true;
            end = toPoint(event.x, event.y, paper.container as any);
            if (rect) {
                rect.remove();
            }
            rect = rc.rectangle(start[0], start[1], end[0] - start[0], end[1] - start[1], { stroke: attributes.color, strokeWidth: attributes.strokeWidth });
            paper.container?.appendChild(rect);
            return;
        }
        mousemove(event);
    }

    paper.mouseup = (event: MouseEvent) => {
        mouseup(event);
        if (isDrawing) {
            const element = { type: ElementType.rectangle, points: [start, end], key: generateKey(), color: attributes.color, strokeWidth: attributes.strokeWidth };
            addElement(paper, element as any);
            rect.remove();
            isDrawing = false;
            start = null;
            end = null;
            isReady = false;
        }
    }

    return paper;
}