import { MindmapNode } from "../interfaces/node";
import { drawRichtext, updateForeignObject } from "richtext";
import { ComponentFactoryResolver, ViewContainerRef } from "@angular/core";
import { getRectangleByNode } from "../utils/graph";
import { PEM } from "../constants";
import { maxSize } from "richtext/constant";

export function drawMindmapNodeRichtext(node: MindmapNode, componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef, scale = 1) {
    const data = node.data;
    const { x, y, width, height } = getRectangleByNode(node);

    const textX = (x + PEM * 0.8) / scale;
    const textY = (y + PEM * 0.2) / scale;
    const classList = [];
    if (data.isRoot) {
        classList.push('root-node');
    }
    return drawRichtext(textX, textY, width, height, data.value, componentFactoryResolver, viewContainerRef, classList);
}

export function updateMindmapNodeRichtextLocation(node: MindmapNode, g: SVGGElement, scale = 1) {
    const { x, y, width, height } = getRectangleByNode(node);

    const textX = (x + PEM * 0.8) / scale;
    const textY = (y + PEM * 0.2) / scale; 
    updateForeignObject(g, width, height, textX, textY);
}