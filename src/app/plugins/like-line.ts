import { Point } from "roughjs/bin/geometry";
import { roughDrawer } from "../drawer";
import { EdgeMode } from "../interfaces/attributes";
import { ElementType, Element } from "../interfaces/element";
import { addElement, Paper } from "../interfaces/paper";
import { PointerType } from "../interfaces/pointer";
import { appendHostSVGG, arrayHostSVGG, destroyHostSVGG, getAttributes } from "../utils/common";
import { generateKey } from "../utils/key";
import { toPoint } from "../utils/position";
import { getRoughSVG } from "../utils/rough";

export function likeLinePaper<T extends Paper>(paper: T) {
    let start: Point | null = null;
    let end: Point | null = null;
    let dragMode = false;
    let isPressing = false;

    let clickMode = false;
    let clickPoints: Point[] = [];

    let hostSVGG: SVGGElement[] = [];

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
        const attributes = getAttributes(paper);
        const roughSVG = getRoughSVG(paper);
        if (start && isPressing && !clickMode) {
            dragMode = true;
            paper.dragging = true;
            end = toPoint(event.x, event.y, paper.container as SVGElement);
            hostSVGG = destroyHostSVGG(hostSVGG);
            let g: SVGGElement[] | SVGGElement = [];
            if (paper.pointer === PointerType.line) {
                const lineElement = createLikeLine(ElementType.line, [start, end], attributes.stroke, attributes.strokeWidth, attributes.edgeMode);
                g = roughDrawer.draw(roughSVG, lineElement);
            }
            if (paper.pointer === PointerType.arrow) {
                const arrowElement = createLikeLine(ElementType.arrow, [start, end], attributes.stroke, attributes.strokeWidth, attributes.edgeMode);
                g = roughDrawer.draw(roughSVG, arrowElement);
            }
            appendHostSVGG(paper, g);
            hostSVGG = arrayHostSVGG(g);
            return;
        }
        if (!isPressing && clickMode) {
            end = toPoint(event.x, event.y, paper.container as SVGElement);
            hostSVGG = destroyHostSVGG(hostSVGG);
            let g: SVGGElement[] | SVGGElement = [];
            if (paper.pointer === PointerType.line) {
                const lineElement = createLikeLine(ElementType.line, [...clickPoints, end], attributes.stroke, attributes.strokeWidth, attributes.edgeMode);
                g = roughDrawer.draw(roughSVG, lineElement);
            }
            if (paper.pointer === PointerType.arrow) {
                const element = createLikeLine(ElementType.arrow, [...clickPoints, end], attributes.stroke, attributes.strokeWidth, attributes.edgeMode);
                g = roughDrawer.draw(roughSVG, element);
            }
            appendHostSVGG(paper, g);
            hostSVGG = arrayHostSVGG(g);
            return;
        }
        mousemove(event);
    }

    paper.mouseup = (event: MouseEvent) => {
        mouseup(event);
        const attributes = getAttributes(paper);
        if (dragMode && start && end) {
            if (paper.pointer === PointerType.line) {
                const lineElement = createLikeLine(ElementType.line, [start, end], attributes.stroke, attributes.strokeWidth, attributes.edgeMode);
                addElement(paper, lineElement);
            }
            if (paper.pointer === PointerType.arrow) {
                const arrowElement = createLikeLine(ElementType.arrow, [start, end], attributes.stroke, attributes.strokeWidth, attributes.edgeMode);
                addElement(paper, arrowElement);
            }
            hostSVGG = destroyHostSVGG(hostSVGG);
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
        const attributes = getAttributes(paper);
        if (clickMode && clickPoints.length > 3) {
            if (paper.pointer === PointerType.line) {
                const lineElement = createLikeLine(ElementType.line, clickPoints.slice(0, clickPoints.length - 1), attributes.stroke, attributes.strokeWidth, attributes.edgeMode);
                addElement(paper, lineElement);
            }
            if (paper.pointer === PointerType.arrow) {
                const element = createLikeLine(ElementType.arrow, clickPoints.slice(0, clickPoints.length - 1), attributes.stroke, attributes.strokeWidth, attributes.edgeMode);
                addElement(paper, element);
            }
            hostSVGG = destroyHostSVGG(hostSVGG);
            clickMode = false;
            clickPoints = [];
        }
        dblclick(event);
    }

    return paper;
}

export function createLikeLine(type: ElementType, points: Point[], stroke: string, strokeWidth: number, edgeMode?: EdgeMode): Element {
    const line: Element = { type, points, key: generateKey(), stroke, strokeWidth };
    if (edgeMode) {
        line.edgeMode = edgeMode;
    }
    return line;
}