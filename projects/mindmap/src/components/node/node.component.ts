import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, Input, OnInit, ViewContainerRef } from "@angular/core";
import { drawNode, getRectangleByNode } from "../../draw/node";
import { RoughSVG } from "roughjs/bin/svg";
import { MindmapNode } from "../../interfaces/node";
import { drawLine } from "../../draw/line";
import { drawRoundRectangle } from "../../utils/graph";
import { primaryColor } from "../../constants";

@Component({
    selector: 'plait-mindmap-node',
    template: '<plait-mindmap-node *ngFor="let childNode of node?.children" [roughSVG]="roughSVG" [rootSVG]="rootSVG" [node]="childNode" [parent]="node"></plait-mindmap-node>',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MindmapNodeComponent implements OnInit {
    selected = false;

    @Input() node?: MindmapNode;

    @Input() parent?: MindmapNode;

    @Input() rootSVG?: SVGSVGElement;

    @Input() roughSVG?: RoughSVG;

    selectedMarks: SVGGElement[] = [];

    nodeG?: SVGGElement;

    lineG?: SVGGElement;

    richtextG?: SVGGElement;

    get container(): SVGSVGElement {
        if (!this.rootSVG) {
            throw new Error('undefined svg container');
        }
        return this.rootSVG;
    }

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private viewContainerRef: ViewContainerRef) { }

    ngOnInit(): void {
        // 画矩形、渲染富文本
        const { nodeG, richTextG, richtextComponentRef } = drawNode(this.roughSVG as RoughSVG, this.node as MindmapNode, this.componentFactoryResolver, this.viewContainerRef, 1);
        this.container.appendChild(nodeG);
        this.container.appendChild(richTextG);
        this.nodeG = nodeG;
        if (this.parent) {
            const lineG = drawLine(this.roughSVG as RoughSVG, this.parent as MindmapNode, this.node as MindmapNode, true, 1);
            this.container.prepend(lineG);
            this.lineG = lineG;
        }
    }

    updateSelectedState() {
        if (this.selected && this.selectedMarks.length === 0) {
            const { x, y, width, height } = getRectangleByNode(this.node as MindmapNode);
            const selectedStrokeG = drawRoundRectangle(this.roughSVG as RoughSVG, x - 2, y - 2, x + width + 2, y + height + 2, { stroke: primaryColor, strokeWidth: 2, fill: '' });
            const selectedG = drawRoundRectangle(this.roughSVG as RoughSVG, x - 2, y - 2, x + width + 2, y + height + 2, { stroke: primaryColor, fill: primaryColor, fillStyle: 'solid' });
            selectedG.style.opacity = '0.4';
            this.container.appendChild(selectedG);
            this.container.appendChild(selectedStrokeG);
            this.selectedMarks.push(selectedG, selectedStrokeG);
        } else if (!this.selected && this.selectedMarks.length > 0) {
            this.selectedMarks.forEach((g) => g.remove());
            this.selectedMarks = [];
        }
    }
}