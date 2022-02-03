import { Point } from "roughjs/bin/geometry";
import { ACTIVE_RECTANGLE_DISTANCE } from "../constants";
import { Key } from "../utils/key";
import { toRect, toSelection, toSelectionByPoint } from "../utils/position";
import { Rect } from "./rect";
import { Selection } from './selection';

export interface Element {
    type: ElementType;
    points: Point[];
    key: Key;
    color: string;
    strokeWidth: number;
}

export enum ElementType {
    curve,
    rectangle
}

export const Element = {
    isIntersected(element: Element, selection: Selection) {
        if (Selection.isCollapsed(selection)) {
            selection = toSelectionByPoint(selection.anchor);
        }
        const rect = toRect(element.points);
        return Selection.intersect({ anchor: [rect.x, rect.y], focus: [rect.x + rect.width, rect.y + rect.height] }, selection);
    },
    isHoverdElement(element: Element, point: Point) {
        const selection = toSelectionByPoint(point);
        if (element.type === ElementType.curve) {
            return element.points.some((point) => Selection.intersectPoint(point, selection));
        }
        if (element.type === ElementType.rectangle) {
            const rect = toRect(element.points);
            const innerRectangle = { x: rect.x + ACTIVE_RECTANGLE_DISTANCE, y: rect.y + ACTIVE_RECTANGLE_DISTANCE, width: rect.width - ACTIVE_RECTANGLE_DISTANCE * 2, height: rect.height - ACTIVE_RECTANGLE_DISTANCE * 2 };
            return Selection.intersect(toSelection(rect), selection) && !Selection.intersectPoint(point, toSelection(innerRectangle));
        }
        return false;
    }
}

