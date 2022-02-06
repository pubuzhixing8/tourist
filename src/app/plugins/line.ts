import { Point } from "roughjs/bin/geometry";
import { RoughSVG } from "roughjs/bin/svg";
import { Attributes } from "../interfaces/attributes";
import { ElementType } from "../interfaces/element";
import { addElement, Paper } from "../interfaces/paper";
import { PointerType } from "../interfaces/pointer";
import { generateKey } from "../utils/key";
import { toPoint } from "../utils/position";

export function linePaper<T extends Paper>(paper: T, rc: RoughSVG, attributes: Attributes) {
    let start: Point | null = null;
    let end: Point | null = null;
    let dragMode = false;
    let isPressing = false;
    
    let clickMode = false;
    let clickPoints: Point[] = [];
    let domElement: SVGElement | null = null;

    const { mousedown, mousemove, mouseup, dblclick } = paper;

    paper.mousedown = (event: MouseEvent) => {
        if (paper.pointer === PointerType.line) {
            start = toPoint(event.x, event.y, paper.container as SVGElement);
            isPressing = true;
            return;
        }
        mousedown(event);
    }

    paper.mousemove = (event: MouseEvent) => {
        if (start && isPressing && !clickMode) {
            dragMode = true;
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
        if (!isPressing && clickMode) {
            end = toPoint(event.x, event.y, paper.container as SVGElement);
            if (domElement) {
                domElement.remove();
            }
            if (paper.pointer === PointerType.line) {
                if (attributes.edgeMode === 'sharp') {
                    domElement = rc.linearPath([...clickPoints, end], { stroke: attributes.color, strokeWidth: attributes.strokeWidth });
                } else {
                    domElement = rc.curve([...clickPoints, end], { stroke: attributes.color, strokeWidth: attributes.strokeWidth });
                }
                paper.container?.appendChild(domElement);
            }
        }
        mousemove(event);
    }

    paper.mouseup = (event: MouseEvent) => {
        mouseup(event);
        if (dragMode && start) {
            if (paper.pointer === PointerType.line) {
                const element = { type: ElementType.line, points: [start, end], key: generateKey(), color: attributes.color, strokeWidth: attributes.strokeWidth };
                addElement(paper, element as any);
            }
            domElement?.remove();
        } else {
            if (paper.pointer === PointerType.line && start) {
                clickMode = true;
                clickPoints.push(start);
            }
        }
        isPressing = false;
        dragMode = false;
        start = null;
        end = null;
        paper.dragging = false;
    }

    paper.dblclick = (event: MouseEvent) => {

        if (clickMode && clickPoints.length > 1) {
            if (domElement) {
                domElement.remove();
            }
            if (paper.pointer === PointerType.line) {
                const element = { type: ElementType.line, points: [...clickPoints], key: generateKey(), color: attributes.color, strokeWidth: attributes.strokeWidth, edgeMode: attributes.edgeMode };
                addElement(paper, element as any);
            }
            clickMode = false;
            clickPoints = [];
        }

        dblclick(event);
    }

    return paper;
}