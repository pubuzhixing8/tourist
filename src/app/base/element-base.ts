import { ComponentRef } from "@angular/core";
import { PlaitRichtextComponent } from "richtext";
export class ElementBase {
    richtextComponentRef: ComponentRef<PlaitRichtextComponent> | null = null;

    svgGElement: SVGGElement | undefined;

    get g(): SVGGElement {
        if (this.svgGElement) {
            return this.svgGElement;
        }
        throw new Error('undefined g');
    }

    get editor() {
        return this.richtextComponentRef?.instance.editor;
    }

    show() {}

    hidden() {}
}