import { Point } from "roughjs/bin/geometry";
import { RoughSVG } from "roughjs/bin/svg";
import { Attributes } from "../interfaces/attributes";
import { Element, ElementType } from "../interfaces/element";
import { Paper, setElement } from "../interfaces/paper"
import { PointerType } from "../interfaces/pointer";
import { RectanglePosition, toPoint, toRectangle } from "../utils/position";
import { ELEMENT_TO_COMPONENTS } from "../utils/weakmaps";
import { Selection } from '../interfaces/selection';
import { Rectangle } from "../interfaces/rectangle";

export function resizePaper<T extends Paper>(paper: T, rc: RoughSVG, attributes: Attributes) {
    let start: Point | null = null;
    let end: Point | null = null;
    let isDragging = false;
    let dragElement: Element | undefined;
    let domElement: SVGElement | null = null;
    let position: RectanglePosition | undefined;
    const { mousedown, mousemove, mouseup } = paper;

    paper.mousedown = (event: MouseEvent) => {
        if (paper.pointer === PointerType.pointer) {
            const point = toPoint(event.x, event.y, paper.container as SVGElement);
            const activeElement = paper.elements.find((ele) => Element.isIntersected(ele, { anchor: point, focus: point }));
            const isActive = activeElement && Selection.intersectElement(paper.selection, activeElement);
            const isHoveredLine = activeElement && Element.isHoveredElement(activeElement, point);
            if (activeElement && isActive && isHoveredLine && activeElement.type === ElementType.rectangle) { // resize
                dragElement = activeElement;
                start = point;
                position = Rectangle.getPosition(point, toRectangle(activeElement.points));
                return;
            }
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
                const newRectangle = getNewRectangle(dragElement.points[0], dragElement.points[1], offsetX, offsetY, position as RectanglePosition);
                domElement = rc.rectangle(newRectangle.newStart[0], newRectangle.newStart[1], newRectangle.newWidth, newRectangle.newHeight, { stroke: dragElement.color, strokeWidth: dragElement.strokeWidth });
                paper.container?.appendChild(domElement);
            }
            if (dragElement.type === ElementType.curve) {
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
        if (isDragging && start && dragElement && end) {
            const offsetX = end[0] - start[0];
            const offsetY = end[1] - start[1];
            const newRectangle = getNewRectangle(dragElement.points[0], dragElement.points[1], offsetX, offsetY, position as RectanglePosition);
            let startX = newRectangle.newStart[0];
            let startY = newRectangle.newStart[1];
            let width = Math.abs(newRectangle.newWidth);
            let height = Math.abs(newRectangle.newHeight);
            if (newRectangle.newWidth < 0) {
                startX = startX + newRectangle.newWidth;
            }
            if (newRectangle.newHeight < 0) {
                startY = startY + newRectangle.newHeight;
            }
            setElement(paper, dragElement, {
                points: [[startX, startY], [startX + width, startY + height]]
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
        position = undefined;
        mouseup(event);
    }

    return paper;
}

function getNewRectangle(oldStart: Point, oldEnd: Point, offsetX: number, offsetY: number, position: RectanglePosition) {
    const oldWidth = oldEnd[0] - oldStart[0];
    const oldHeight = oldEnd[1] - oldStart[1];
    let newStart = [0, 0];
    let newWidth = 0;
    let newHeight = 0;
    if (position === RectanglePosition.rightBottom || position === RectanglePosition.right || position === RectanglePosition.bottom) {
        newStart = oldStart;
        if (position === RectanglePosition.rightBottom) {
            newWidth = oldWidth + offsetX;
            newHeight = oldHeight + offsetY;
        }
        if (position === RectanglePosition.bottom) {
            newWidth = oldWidth;
            newHeight = oldHeight + offsetY;
        }
        if (position === RectanglePosition.right) {
            newWidth = oldWidth + offsetX;
            newHeight = oldHeight;
        }
    }
    if (position === RectanglePosition.leftBottom || position === RectanglePosition.left) {
        newStart = [oldStart[0] + oldWidth, oldStart[1]];
        if (position === RectanglePosition.leftBottom) {
            newWidth = -oldWidth + offsetX;
            newHeight = oldHeight + offsetY;
        }
        if (position === RectanglePosition.left) {
            newWidth = -oldWidth + offsetX;
            newHeight = oldHeight;
        }
    }
    if (position === RectanglePosition.leftTop || position === RectanglePosition.top) {
        newStart = [oldStart[0] + oldWidth, oldStart[1] + oldHeight];
        if (position === RectanglePosition.leftTop) {
            newWidth = -oldWidth + offsetX;
            newHeight = -oldHeight + offsetY;
        }
        if (position === RectanglePosition.top) {
            newWidth = -oldWidth;
            newHeight = -oldHeight + offsetY;
        }
    }
    if (position === RectanglePosition.rightTop) {
        newStart = [oldStart[0], oldStart[1] + oldHeight];
        if (position === RectanglePosition.rightTop) {
            newWidth = oldWidth + offsetX;
            newHeight = -oldHeight + offsetY;
        }
    }
    return { newStart, newWidth, newHeight };
}