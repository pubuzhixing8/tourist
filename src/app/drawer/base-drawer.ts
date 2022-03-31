import { RoughSVG } from "roughjs/bin/svg";
import { Element } from "../interfaces/element";

export interface BaseDrawer {
    draw: (roughSVG: RoughSVG, element: Element) => SVGGElement[] | SVGGElement;
    update: (roughSVG: RoughSVG, element: Element, hostSVGG: SVGGElement[]) => SVGGElement[] | SVGGElement;
    destroy: (roughSVG: RoughSVG, element: Element, hostSVGG: SVGGElement[]) => void;
}