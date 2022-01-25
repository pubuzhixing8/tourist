import { Point } from "roughjs/bin/geometry";
import { Key } from "../utils/key";
import { Selection } from './selection';

export interface Element {
    type: ElementType;
    points: Point[];
    key: Key;
    color: string;
}

export enum ElementType {
    linearPath
}

export const Element = {
    getRect(element: Element) {
        const xArray = element.points.map(ele => ele[0]);
        const yArray = element.points.map(ele => ele[1]);
        const xMin = Math.min(...xArray);
        const xMax = Math.max(...xArray);
        const yMin = Math.min(...yArray);
        const yMax = Math.max(...yArray);
        return { x: xMin, y: yMin, width: xMax - xMin, height: yMax - yMin };
    },
    isSelected(element: Element, selection: Selection) {
        const rect = Element.getRect(element);
        return Selection.interaction({ anchor: [rect.x, rect.y], focus: [rect.x + rect.width, rect.y + rect.height] }, selection);
    }
}