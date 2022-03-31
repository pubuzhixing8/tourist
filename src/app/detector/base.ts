import { Selection } from '../interfaces/selection';
import { Element } from '../interfaces/element';
import { Point } from 'roughjs/bin/geometry';

export interface BaseDetector {
    contian: (selection: Selection, element: Element) => boolean;// 框选
    hit: (point: Point, element: Element) => boolean;
}