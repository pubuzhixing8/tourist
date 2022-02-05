import { Paper } from "../interfaces/paper";
import { PointerType } from "../interfaces/pointer";
import { RectanglePositionToCursor, toPoint, toRectangle } from "../utils/position";
import { Element, ElementType } from '../interfaces/element';
import { Selection } from '../interfaces/selection';
import { Rectangle } from "../interfaces/rectangle";

export const MOVE_CLASS_NAME = 'move';

export function cursorPaper<T extends Paper>(paper: T, container: SVGElement) {
    const { mousemove } = paper;

    paper.mousemove = (event: MouseEvent) => {
        if (paper.pointer === PointerType.pointer && !paper.dragging) {
            const point = toPoint(event.x, event.y, container);
            const hoveredElementIndex = paper.elements.findIndex((ele) => Element.isHoveredElement(ele, point));
            let moveStatus = false;
            if (hoveredElementIndex >= 0) {
                moveStatus = true;
            } else {
                // active rectangle
                const activeElement = paper.elements.find((ele) => Element.isIntersected(ele, { anchor: point, focus: point }));
                if (Selection.intersectElement(paper.selection, activeElement)) {
                    moveStatus = true;
                }
            }
            if (moveStatus) {
                if (hoveredElementIndex >= 0 && paper.elements[hoveredElementIndex].type === ElementType.rectangle && Selection.intersectElement(paper.selection, paper.elements[hoveredElementIndex])) {
                    const position = Rectangle.getPosition(point, toRectangle(paper.elements[hoveredElementIndex].points));
                    if (position) {
                        container.style.cursor = `${RectanglePositionToCursor[position]}`;
                    } else {
                        container.style.removeProperty('cursor');
                    }
                }

                if (!container.classList.contains(MOVE_CLASS_NAME)) {
                    container.classList.add(MOVE_CLASS_NAME);
                }
            } else {
                if (container.classList.contains(MOVE_CLASS_NAME)) {
                    container.classList.remove(MOVE_CLASS_NAME);
                }
                container.style.removeProperty('cursor');
            }
        }
        mousemove(event);
    }

    return paper;
}