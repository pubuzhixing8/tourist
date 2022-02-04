import { Point } from "roughjs/bin/geometry";
import { RoughSVG } from "roughjs/bin/svg";
import { Attributes } from "../interfaces/attributes";
import { Element, ElementType } from "../interfaces/element";
import { Paper, setElement } from "../interfaces/paper"
import { PointerType } from "../interfaces/pointer";
import { toPoint } from "../utils/position";
import { ELEMENT_TO_COMPONENTS } from "../utils/weakmaps";
import { Selection } from '../interfaces/selection';

export function movePaper<T extends Paper>(paper: T, rc: RoughSVG, attributes: Attributes) {
    let start: Point | null = null;
    let end: Point | null = null;
    let isDragging = false;
    let dragElement: Element | undefined;
    let domElement: SVGElement | null = null;
    const { mousedown, mousemove, mouseup } = paper;

    paper.mousedown = (event: MouseEvent) => {
        if (paper.pointer === PointerType.pointer) {
            const point = toPoint(event.x, event.y, paper.container as SVGElement);
            const hoveredElement = paper.elements.find((ele) => Element.isHoverdElement(ele, point));
            if (!hoveredElement) {
                // active rectangle
                const activeElement = paper.elements.find((ele) => Element.isIntersected(ele, { anchor: point , focus: point }));
                const isIntersected = activeElement && (Selection.isCollapsed(paper.selection) && Element.isHoverdElement(activeElement as Element, paper.selection.anchor)) || (!Selection.isCollapsed(paper.selection) && Element.isIntersected(activeElement as Element, paper.selection));
                if (isIntersected) {
                    dragElement = activeElement;
                }
            } else {
                dragElement = hoveredElement;
            }
            start = point;
            return;
        }
        mousedown(event);
    }

    paper.mousemove = (event: MouseEvent) => {
        if (start && dragElement) {
            paper.dragging = true;
            isDragging = true;
            end = toPoint(event.x, event.y, paper.container as SVGElement);
            if (domElement) {
                domElement.remove();
            }
            const offsetX = end[0] - start[0];
            const offsetY = end[1] - start[1];

            if (dragElement.type === ElementType.rectangle) {
                const start = dragElement.points[0];
                const end = dragElement.points[1];
                domElement = rc.rectangle(start[0] + offsetX, start[1] + offsetY, end[0] - start[0], end[1] - start[1], { stroke: dragElement.color, strokeWidth: dragElement.strokeWidth });
                paper.container?.appendChild(domElement);
            }
            if (dragElement.type === ElementType.curve) {
                domElement = rc.curve(dragElement.points.map((point) => {
                    return [point[0] + offsetX, point[1] + offsetY];
                }), { stroke: attributes.color, strokeWidth: attributes.strokeWidth });
                paper.container?.appendChild(domElement);
            }
            const elementComponent = ELEMENT_TO_COMPONENTS.get(dragElement);
            if (elementComponent) {
                elementComponent.hidden();
            }
            return;
        }
        mousemove(event);
    }

    paper.mouseup = (event: MouseEvent) => {
        mouseup(event);
        if (isDragging && start && dragElement && end) {
            const offsetX = end[0] - start[0];
            const offsetY = end[1] - start[1];
            setElement(paper, dragElement, {
                points: dragElement.points.map((point) => {
                    return [point[0] + offsetX, point[1] + offsetY];
                })
            })
            const elementComponent = ELEMENT_TO_COMPONENTS.get(dragElement);
            if (elementComponent) {
                elementComponent.show();
            }
            domElement?.remove();
        }
        isDragging = false;
        start = null;
        end = null;
        paper.dragging = false;
        dragElement = undefined;
    }

    return paper;
}