import { Paper } from "../interfaces/paper";
import { PointerType } from "../interfaces/pointer";
import { toPoint } from "../utils/position";
import { Element } from '../interfaces/element';
import { Selection } from '../interfaces/selection';

export function cursorPaper<T extends Paper>(paper: T, container: SVGElement) {
    const { mousemove } = paper;

    paper.mousemove = (event: MouseEvent) => {
        if (paper.pointer === PointerType.pointer && !paper.dragging) {
            const point = toPoint(event.x, event.y, container);
            const moveCursor = paper.elements.some((ele) => Element.isHoverdElement(ele, point));
            if (moveCursor) {
                container.classList.add('move');
            } else {
                // active rectangle
                const activeElement = paper.elements.find((ele) => Element.isIntersected(ele, { anchor: point, focus: point }));
                const isIntersected = activeElement && (Selection.isCollapsed(paper.selection) && Element.isHoverdElement(activeElement as Element, paper.selection.anchor)) || (!Selection.isCollapsed(paper.selection) && Element.isIntersected(activeElement as Element, paper.selection));
                if (isIntersected) {
                    container.classList.add('move');
                } else {
                    container.classList.remove('move');
                }
            }
        }
        mousemove(event);
    }

    return paper;
}