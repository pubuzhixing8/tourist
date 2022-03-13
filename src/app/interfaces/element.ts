import { Point } from "roughjs/bin/geometry";
import { ACTIVE_RECTANGLE_DISTANCE } from "../constants";
import { Key } from "../utils/key";
import { toRectangle, toSelection, toSelectionByPoint } from "../utils/position";
import { EdgeMode } from "./attributes";
import { Rectangle } from "./rectangle";
import { Selection } from './selection';

export interface Element {
    type: ElementType;
    points: Point[];
    key: Key;
    color: string;
    strokeWidth: number;
    edgeMode?: EdgeMode;
    value?: any;
}

export enum ElementType {
    curve = 'curve',
    rectangle = 'rectangle',
    line = 'line',
    arrow = 'arrow',
    circle = 'circle',
    text = 'text'
}

export const Element = {
    isIntersected(element: Element, selection: Selection) {
        if (Selection.isCollapsed(selection)) {
            selection = toSelectionByPoint(selection.anchor);
        }
        const rect = toRectangle(element.points);
        return Selection.intersect({ anchor: [rect.x, rect.y], focus: [rect.x + rect.width, rect.y + rect.height] }, selection);
    },
    isHoveredElement(element: Element, point: Point) {
        const selection = toSelectionByPoint(point);
        if (element.type === ElementType.curve) {
            return element.points.some((point) => Selection.intersectPoint(point, selection));
        }
        if (element.type === ElementType.rectangle) {
            const rect = toRectangle(element.points);
            const innerRectangle = { x: rect.x + ACTIVE_RECTANGLE_DISTANCE, y: rect.y + ACTIVE_RECTANGLE_DISTANCE, width: rect.width - ACTIVE_RECTANGLE_DISTANCE * 2, height: rect.height - ACTIVE_RECTANGLE_DISTANCE * 2 };
            return Selection.intersect(toSelection(rect), selection) && !Selection.intersectPoint(point, toSelection(innerRectangle));
        }
        return false;
    }
}

