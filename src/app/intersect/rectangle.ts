import { Point } from "roughjs/bin/geometry";
import { Element } from "../interfaces/element";
import { Selection } from "../interfaces/selection";
import { BaseIntersect } from "./base";

export const RectangleIntersect: BaseIntersect = {
    contian: (selection: Selection, element: Element) => {
        throw new Error('error');
    },
    hit: (point: Point, element: Element) => {
        throw new Error('error');
    }
};