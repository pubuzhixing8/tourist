import { Point } from "roughjs/bin/geometry";
import { Key } from "../utils/key";

export interface Element {
    type: ElementType;
    points: Point[];
    key: Key;
}

export enum ElementType {
    linearPath
}