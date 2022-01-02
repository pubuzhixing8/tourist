import { Point } from "roughjs/bin/geometry";

export interface Element {
    type: string;
    points: Point[];
    key: string;
}