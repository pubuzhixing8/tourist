import { Point } from "roughjs/bin/geometry";
import { detector } from "../engine";
import { Element } from "../interfaces/element";
import { Paper, setSelection } from "../interfaces/paper";
import { PointerType } from "../interfaces/pointer";
import { mousePointToRelativePoint } from "../utils/dom";
import { toPoint } from "../utils/position";
import { toRectangleClient } from "../utils/shape";
import { transform, transformPoints } from "../utils/viewport";

export function selectionPager<T extends Paper>(paper: T) {
    const { mousedown, mousemove, mouseup, keyup } = paper;

    let start: Point | null = null;
    let end: Point | null = null;

    paper.mousedown = (event: MouseEvent) => {
        if (paper.pointer === PointerType.pointer && paper.container) {
            start = toPoint(event.x, event.y, paper.container);
        }
        mousedown(event);
    }

    paper.mousemove = (event: MouseEvent) => {
        const movedTarget = toPoint(event.x, event.y, paper.container as SVGElement);
        if (start) {
            const rectangleClient = toRectangleClient([start, movedTarget]);
            if (start && Math.hypot(rectangleClient.width, rectangleClient.height) > 5) {
                end = movedTarget;
            }
        }
        mousemove(event);
    }

    paper.mouseup = (event: MouseEvent) => {
        if (start && end) {

        } else if (start) {
            const points = transformPoints(paper, [mousePointToRelativePoint(event.x, event.y, paper.container as SVGElement)]);
            const map: WeakMap<Element, boolean> = new WeakMap();
            paper.elements.forEach((ele) => {
                map.set(ele, detector.hit(points[0], ele))
            });
            paper.selectedMap = map;
            setSelection(paper, { anchor: points[0], focus: points[0] });
        }
        start = null;
        end = null;
        mouseup(event);
    }

    return paper;
}
