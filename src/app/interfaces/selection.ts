import { Point } from "roughjs/bin/geometry";
import { Element, ElementType } from '../interfaces/element';

export interface Selection {
    anchor: [number, number];
    focus: [number, number];
}

export const Selection = {
    intersect: (first: Selection, second: Selection) => {
        const xArray = [first.anchor[0], first.focus[0], second.anchor[0], second.focus[0]];
        const yArray = [first.anchor[1], first.focus[1], second.anchor[1], second.focus[1]];
        const xMin = Math.min(...xArray);
        const xMax = Math.max(...xArray);
        const yMin = Math.min(...yArray);
        const yMax = Math.max(...yArray);
        const firstWidth = Selection.width(first);
        const firstHeight = Selection.height(first);
        const secondWidth = Selection.width(second);
        const secondHeight = Selection.height(second);
        const xWidth = (firstWidth + secondWidth) - (xMax - xMin);
        const yHeight = (firstHeight + secondHeight) - (yMax - yMin);
        if (xWidth > 0 && yHeight > 0) {
            return true;
        } else {
            return false;
        }
    },
    intersectPoint: (point: Point, selection: Selection) => {
        const xArray = [selection.anchor[0], selection.focus[0]];
        const yArray = [selection.anchor[1], selection.focus[1]];
        const xMin = Math.min(...xArray);
        const xMax = Math.max(...xArray);
        const yMin = Math.min(...yArray);
        const yMax = Math.max(...yArray);
        if (point[0] > xMin && point[0] < xMax && point[1] > yMin && point[1] < yMax) {
            return true;
        } else {
            return false;
        }
    },
    isBackward: (selection: Selection) => {
        if (selection.anchor[0] > selection.focus[0]) {
            return true;
        } else {
            return false;
        }
    },
    isCollapsed: (selection: Selection) => {
        if (selection.anchor[0] === selection.focus[0] && selection.anchor[1] === selection.focus[1]) {
            return true
        } else {
            return false;
        }
    },
    width: (selection: Selection) => {
        return Math.abs(selection.anchor[0] - selection.focus[0]);
    },
    height: (selection: Selection) => {
        return Math.abs(selection.anchor[1] - selection.focus[1]);
    },
    intersectRectangle: (selection: Selection, element: Element | null | undefined) => {
        if (element) {
            return element.type === ElementType.rectangle && (Selection.isCollapsed(selection) && Element.isHoveredElement(element, selection.anchor)) || (!Selection.isCollapsed(selection) && Element.isIntersected(element, selection));
        }
        return false;
    }
}