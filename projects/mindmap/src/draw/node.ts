import { ComponentFactoryResolver, ViewContainerRef } from "@angular/core";
import { PEM } from "../constants";
import { drawRichtext } from "richtext";
import { RoughSVG } from "roughjs/bin/svg";
import { MindmapNode } from '../interface/node';
import { drawRoundRectangle } from '../utils/graph';

const color = '#e67700';

export function drawNode(roughSVG: RoughSVG, node: MindmapNode, componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef, scale = 1) {
    const data = node.data;
    const x = Math.round(node.x + node.hgap);
    const y = Math.round(node.y + node.vgap);
    const width = Math.round(node.width - node.hgap * 2);
    const height = Math.round(node.height - node.vgap * 2);

    // 绘制富文本 ？
    const textX = (x + PEM * 0.8) / scale;
    const textY = (y + PEM * 0.2) / scale;

    const nodeG = drawRoundRectangle(roughSVG, x, y, x + width, y + height, { stroke: color, fill: 'white', fillStyle: 'solid' });
    const classList = [];
    if (data.isRoot) {
        classList.push('root-node');
    }
    const { richtextComponentRef, richTextG } = drawRichtext(textX, textY, width, height, data.value, componentFactoryResolver, viewContainerRef, classList);

    return { nodeG, richTextG, richtextComponentRef };
}
