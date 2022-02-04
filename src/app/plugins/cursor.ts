import { Paper } from "../interfaces/paper";
import { PointerType } from "../interfaces/pointer";
import { toPoint } from "../utils/position";
import { Element } from '../interfaces/element';

export function cursorPaper<T extends Paper>(paper: T, container: SVGElement) {
    const { mousemove } = paper;

    paper.mousemove = (event: MouseEvent) => {
        const point = toPoint(event.x, event.y, container);
        const moveCursor = paper.elements.some((ele) => Element.isHoverdElement(ele, point));
        if (moveCursor && paper.pointer === PointerType.pointer) {
            container.classList.add('move');
        } else {
            container.classList.remove('move');
        }
        mousemove(event);
    }

    return paper;
}