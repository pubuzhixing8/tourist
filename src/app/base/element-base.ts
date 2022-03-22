import { ComponentRef } from "@angular/core";
import { PlaitRichtextComponent } from "richtext";
export class ElementBase {
    richtextComponentRef: ComponentRef<PlaitRichtextComponent> | null = null;
    get editor() {
        return this.richtextComponentRef?.instance.editor;
    }

    show() {}

    hidden() {}
}