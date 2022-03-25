import { RoughSVG } from "roughjs/bin/svg";
import { Element, ElementType } from "../interfaces/element";
import { BaseDrawer } from "./base-drawer";
import { roughCommonDrawer } from "./common-drawer";

export const roughDrawer: BaseDrawer = {
    draw(roughSVG: RoughSVG, element: Element) {
        return drawerMap[element.type].draw(roughSVG, element);
    },
    update(roughSVG: RoughSVG, element: Element, hostSVGG: SVGGElement[]) {
        return drawerMap[element.type].update(roughSVG, element, hostSVGG);
    },
    destroy(roughSVG: RoughSVG, element: Element, hostSVGG: SVGGElement[]) {
        return drawerMap[element.type].destroy(roughSVG, element, hostSVGG);
    }
};

const drawerMap: any = {
    [ElementType.rectangle]: roughCommonDrawer,
    [ElementType.curve]: roughCommonDrawer,
    [ElementType.line]: roughCommonDrawer,
    [ElementType.arrow]: roughCommonDrawer,
    [ElementType.circle]: roughCommonDrawer
};

