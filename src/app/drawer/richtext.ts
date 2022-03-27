import { BaseDrawer } from "./base-drawer";
import { Element } from "../interfaces/element";
import { RoughSVG } from "roughjs/bin/svg";
import { ELEMENT_TO_COMPONENTS, HOSTSVGG_TO_RICHTEXT_REF } from "../utils/weak-maps";
import { renderRichtext, startEditRichtext } from "../utils/foreign-object";
import { setFullSelectionAndFocus } from "../utils/richtext";

export const richTextDrawer: BaseDrawer = {
    draw(roughSVG: RoughSVG, element: Element) {
        const component = ELEMENT_TO_COMPONENTS.get(element);
        if (component) {
            const { richtextComponentRef, g } = renderRichtext(element, component.componentFactoryResolver, component.viewContainerRef, true);
            HOSTSVGG_TO_RICHTEXT_REF.set(g, richtextComponentRef);
            setTimeout(() => {
                setFullSelectionAndFocus(richtextComponentRef.instance.editor);
                startEditRichtext(component.getPaper(), element, g);
            }, 200);
            return g;
        }
        throw new Error(`draw unknow ${element}`);
    },
    update(roughSVG: RoughSVG, element: Element, hostSVGG: SVGGElement[]) {
        return hostSVGG;
    },
    destroy(roughSVG: RoughSVG, element: Element, hostSVGG: SVGGElement[]) {
        hostSVGG.forEach((g) => g.remove());
        HOSTSVGG_TO_RICHTEXT_REF.delete(hostSVGG[0]);
    }
};