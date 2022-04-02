import { BaseDrawer } from "./base-drawer";
import { Element, ElementType } from "../interfaces/element";
import { RoughSVG } from "roughjs/bin/svg";
import { EdgeMode } from "../interfaces/attributes";
import { arrowPoints } from "../utils/shape";
import { drawRoundRectangle } from "../utils/rough";

export const roughCommonDrawer: BaseDrawer = {
    draw(roughSVG: RoughSVG, element: Element) {
        if (element.type === ElementType.rectangle) {
            const start = element.points[0];
            const end = element.points[1];
            if (element.edgeMode === EdgeMode.round) {
                return drawRoundRectangle(roughSVG, start, end, { stroke: element.stroke, strokeWidth: element.strokeWidth });
            } else {
                return roughSVG.rectangle(start[0], start[1], end[0] - start[0], end[1] - start[1], { stroke: element.stroke, strokeWidth: element.strokeWidth });
            }
        }
        if (element.type === ElementType.curve) {
            return roughSVG.curve(element.points, { stroke: element.stroke, strokeWidth: element.strokeWidth });
        }
        if (element.type === ElementType.line) {
            if (element.edgeMode === EdgeMode.sharp || !element.edgeMode) {
                return roughSVG.linearPath(element.points, { stroke: element.stroke, strokeWidth: element.strokeWidth });
            }
            if (element.edgeMode === EdgeMode.round) {
                return roughSVG.curve(element.points, { stroke: element.stroke, strokeWidth: element.strokeWidth });
            }
            return roughSVG.curve(element.points, { stroke: element.stroke, strokeWidth: element.strokeWidth });
        }
        if (element.type === ElementType.arrow) {
            const hostSVGG: SVGGElement[] = [];
            const { pointLeft, pointRight } = arrowPoints(element.points[element.points.length - 2], element.points[element.points.length - 1]);
            if (element.edgeMode === EdgeMode.sharp || !element.edgeMode) {
                const line = roughSVG.linearPath(element.points, { stroke: element.stroke, strokeWidth: element.strokeWidth });
                hostSVGG.push(line);
            } else {
                const curve = roughSVG.curve(element.points, { stroke: element.stroke, strokeWidth: element.strokeWidth });
                hostSVGG.push(curve);
            }
            const arrowLineLeft = roughSVG.linearPath([pointLeft, element.points[element.points.length - 1]], { stroke: element.stroke, strokeWidth: element.strokeWidth });
            hostSVGG.push(arrowLineLeft);
            const arrowLineRight = roughSVG.linearPath([pointRight, element.points[element.points.length - 1]], { stroke: element.stroke, strokeWidth: element.strokeWidth });
            hostSVGG.push(arrowLineRight);
            return hostSVGG;
        }
        if (element.type === ElementType.circle) {
            const [start, realEnd] = element.points;
            const width = Math.abs(realEnd[0] - start[0]);
            let height = Math.abs(realEnd[1] - start[1]);
            const centerPoint = [realEnd[0] > start[0] ? realEnd[0] - width / 2 : realEnd[0] + width / 2, realEnd[1] > start[1] ? realEnd[1] - height / 2 : realEnd[1] + height / 2];
            return roughSVG.ellipse(centerPoint[0], centerPoint[1], width, height, { stroke: element.stroke, strokeWidth: element.strokeWidth });
        }
        throw new Error(`draw unknow ${element}`);
    },
    update(roughSVG: RoughSVG, element: Element, hostSVGG: SVGGElement[]) {
        hostSVGG.forEach((g) => g.remove());
        return roughCommonDrawer.draw(roughSVG, element);
    },
    destroy(roughSVG: RoughSVG, element: Element, hostSVGG: SVGGElement[]) {
        hostSVGG.forEach((g) => g.remove());
        throw new Error(`destroy unknow ${element}`);
    }
};