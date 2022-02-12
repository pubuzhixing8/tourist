import { Point } from "roughjs/bin/geometry";
import { RoughSVG } from "roughjs/bin/svg";
import { Attributes } from "../interfaces/attributes";
import { ElementType } from "../interfaces/element";
import { addElement, Paper } from "../interfaces/paper";
import { PointerType } from "../interfaces/pointer";
import { arrowPoints } from "../utils/arrow";
import { generateKey } from "../utils/key";
import { toPoint } from "../utils/position";

export function likeLinePaper<T extends Paper>(paper: T, rc: RoughSVG, attributes: Attributes) {
    let start: Point | null = null;
    let end: Point | null = null;
    let dragMode = false;
    let isPressing = false;

    let clickMode = false;
    let clickPoints: Point[] = [];
    let domElement: SVGElement | null = null;
    let arrowDOMElements: SVGElement[] = [];

    const { mousedown, mousemove, mouseup, dblclick } = paper;

    paper.mousedown = (event: MouseEvent) => {
        if (paper.pointer === PointerType.line || paper.pointer === PointerType.arrow) {
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
            arrowDOMElements.forEach((dom) => {
                dom.remove();
            });
            arrowDOMElements = [];
            if (paper.pointer === PointerType.line) {
                domElement = rc.linearPath([start, end], { stroke: attributes.color, strokeWidth: attributes.strokeWidth });
                paper.container?.appendChild(domElement);
            }
            if (paper.pointer === PointerType.arrow) {
                const { pointLeft, pointRight } = arrowPoints(start, end);
                const line = rc.linearPath([start, end], { stroke: attributes.color, strokeWidth: attributes.strokeWidth });
                arrowDOMElements.push(line);
                const arrowLineLeft = rc.linearPath([pointLeft, end], { stroke: attributes.color, strokeWidth: attributes.strokeWidth });
                arrowDOMElements.push(arrowLineLeft);
                const arrowLineRight = rc.linearPath([pointRight, end], { stroke: attributes.color, strokeWidth: attributes.strokeWidth });
                arrowDOMElements.push(arrowLineRight);
                arrowDOMElements.forEach((dom) => {
                    paper.container?.appendChild(dom);
                })
            }
            return;
        }
        if (!isPressing && clickMode) {
            end = toPoint(event.x, event.y, paper.container as SVGElement);
            if (domElement) {
                domElement.remove();
            }
            arrowDOMElements.forEach((dom) => {
                dom.remove();
            });
            arrowDOMElements = [];
            if (paper.pointer === PointerType.line) {
                if (attributes.edgeMode === 'sharp') {
                    domElement = rc.linearPath([...clickPoints, end], { stroke: attributes.color, strokeWidth: attributes.strokeWidth });
                } else {
                    domElement = rc.curve([...clickPoints, end], { stroke: attributes.color, strokeWidth: attributes.strokeWidth });
                }
                paper.container?.appendChild(domElement);
            }
            if (paper.pointer === PointerType.arrow) {
                const { pointLeft, pointRight } = arrowPoints(clickPoints[clickPoints.length - 1], end);
                const arrowLineLeft = rc.linearPath([pointLeft, end], { stroke: attributes.color, strokeWidth: attributes.strokeWidth });
                arrowDOMElements.push(arrowLineLeft);
                const arrowLineRight = rc.linearPath([pointRight, end], { stroke: attributes.color, strokeWidth: attributes.strokeWidth });
                arrowDOMElements.push(arrowLineRight);
                if (attributes.edgeMode === 'sharp') {
                    const line = rc.linearPath([...clickPoints, end], { stroke: attributes.color, strokeWidth: attributes.strokeWidth });
                    arrowDOMElements.push(line);
                } else {
                    const curve = rc.curve([...clickPoints, end], { stroke: attributes.color, strokeWidth: attributes.strokeWidth });
                    arrowDOMElements.push(curve);
                }
                arrowDOMElements.forEach((dom) => {
                    paper.container?.appendChild(dom);
                })
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
                domElement?.remove();
            }
            if (paper.pointer === PointerType.arrow) {
                const element = { type: ElementType.arrow, points: [start, end], key: generateKey(), color: attributes.color, strokeWidth: attributes.strokeWidth };
                addElement(paper, element as any);
                arrowDOMElements.forEach((dom) => {
                    dom.remove();
                });
                arrowDOMElements = [];
            }
        } else {
            if ((paper.pointer === PointerType.line || paper.pointer === PointerType.arrow) && start) {
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

        if (clickMode && clickPoints.length > 3) {

            if (domElement) {
                domElement.remove();
            }
            if (paper.pointer === PointerType.line) {
                const element = { type: ElementType.line, points: [...clickPoints.slice(0, clickPoints.length - 1)], key: generateKey(), color: attributes.color, strokeWidth: attributes.strokeWidth, edgeMode: attributes.edgeMode };
                addElement(paper, element as any);
            }
            if (paper.pointer === PointerType.arrow) {
                const element = { type: ElementType.arrow, points: [...clickPoints.slice(0, clickPoints.length - 1)], key: generateKey(), color: attributes.color, strokeWidth: attributes.strokeWidth, edgeMode: attributes.edgeMode };
                addElement(paper, element as any);
            }
            arrowDOMElements.forEach((dom) => {
                dom.remove();
            });
            arrowDOMElements = [];
            clickMode = false;
            clickPoints = [];
        }

        dblclick(event);
    }

    return paper;
}