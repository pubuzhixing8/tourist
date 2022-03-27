import { BaseDrawer } from "./base-drawer";
import { Element } from "../interfaces/element";
import { RoughSVG } from "roughjs/bin/svg";
import { ELEMENT_TO_COMPONENTS, ELEMENT_TO_RICHTEXT_REF } from "../utils/weak-maps";
import { renderRichtext, startEditRichtext } from "../utils/foreign-object";
import { setFullSelectionAndFocus } from "../utils/richtext";

export const richTextDrawer: BaseDrawer = {
    draw(roughSVG: RoughSVG, element: Element) {
        const component = ELEMENT_TO_COMPONENTS.get(element);
        if (component) {
            const { richtextComponentRef, g } = renderRichtext(element, component.componentFactoryResolver, component.viewContainerRef, true);
            ELEMENT_TO_RICHTEXT_REF.set(element, richtextComponentRef);
            setTimeout(() => {
                setFullSelectionAndFocus(richtextComponentRef.instance.editor);
                startEditRichtext(component.getPaper(), element, g);
            }, 200);
            return g;
        }
        throw new Error(`draw unknow ${element}`);
    },
    update(roughSVG: RoughSVG, element: Element, hostSVGG: SVGGElement[]) {
        // hostSVGG.forEach((g) => g.remove());
        // return richTextDrawer.draw(roughSVG, element);
        // throw new Error(`update unknow ${element}`);
        ELEMENT_TO_RICHTEXT_REF.set(element, richtextComponentRef);
        return hostSVGG;
    },
    destroy(roughSVG: RoughSVG, element: Element, hostSVGG: SVGGElement[]) {
        hostSVGG.forEach((g) => g.remove());
        ELEMENT_TO_RICHTEXT_REF.delete(element);
    }
};