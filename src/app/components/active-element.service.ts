import { RoughSVG } from "roughjs/bin/svg";
import { ACTIVE_RECTANGLE_DISTANCE } from "../constants";
import { Element } from '../interfaces/element';
import { toRect } from "../utils/position";
import { Selection } from '../interfaces/selection';

export class ActiveElementService {
    activeRectangle: SVGGElement | undefined | null;

    rc: RoughSVG;

    element: Element;

    selection: Selection;

    container: SVGElement;

    constructor(rc: RoughSVG, container: SVGElement, element: Element, selection: Selection) {
        this.rc = rc;
        this.container = container;
        this.element = element;
        this.selection = selection;
    }

    update(element: Element, selection: Selection) {
        this.element = element;
        this.selection = selection;
        this.render();
    }

    render() {
        const isIntersected = (Selection.isCollapsed(this.selection) && Element.isHoverdElement(this.element, this.selection.anchor)) || (!Selection.isCollapsed(this.selection) && Element.isIntersected(this.element, this.selection));
        if (isIntersected) {
            if (!this.activeRectangle) {
                this.addActiveRectangle();
            }
        } else {
            this.removeActiveRectangle();
        }
    }

    removeActiveRectangle() {
        if (this.activeRectangle) {
            this.activeRectangle.remove();
            this.activeRectangle = null;
        }
    }

    addActiveRectangle() {
        const rect = toRect(this.element.points);
        this.activeRectangle = this.rc?.rectangle(rect.x - ACTIVE_RECTANGLE_DISTANCE, rect.y - ACTIVE_RECTANGLE_DISTANCE, rect.width + ACTIVE_RECTANGLE_DISTANCE * 2, rect.height + ACTIVE_RECTANGLE_DISTANCE * 2, { strokeLineDash: [6, 6], strokeWidth: 1.5, stroke: '#348fe4', fill: 'fff' });
        this.container.appendChild(this.activeRectangle);
    }

    hiddenActiveRectangle() {
        if (this.activeRectangle) {
            this.activeRectangle.classList.add('hidden');
        }
    }

    showActiveRectangle() {
        if (this.activeRectangle) {
            this.activeRectangle.classList.remove('hidden');
        }
    }
}