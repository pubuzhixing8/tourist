import { PlaitElement } from "plait/interfaces/element";
import { MindmapElement } from "./element";

export interface PlaitMindmap extends PlaitElement {
    root: MindmapElement
}

export const isPlaitMindmap = (value: any): value is PlaitMindmap => {
    return !!value.root;
}
