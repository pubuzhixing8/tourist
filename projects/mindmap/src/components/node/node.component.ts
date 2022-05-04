import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, Input, OnChanges, OnInit, SimpleChanges, ViewContainerRef } from "@angular/core";
import { drawNode, getRectangleByNode } from "../../draw/node";
import { RoughSVG } from "roughjs/bin/svg";
import { MindmapNode } from "../../interfaces/node";
import { drawLine } from "../../draw/line";
import { drawRoundRectangle } from "../../utils/graph";
import { primaryColor } from "../../constants";
import { HAS_SELECTED_MINDMAP_NODE } from "../../utils/weak-maps";
import { Selection } from 'plait/interfaces/selection';

@Component({
    selector: 'plait-mindmap-node',
    template: '<plait-mindmap-node *ngFor="let childNode of node?.children" [roughSVG]="roughSVG" [rootSVG]="rootSVG" [node]="childNode" [parent]="node" [selection]="selection"></plait-mindmap-node>',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MindmapNodeComponent implements OnInit, OnChanges {
    @Input() node?: MindmapNode;

    @Input() parent?: MindmapNode;

    @Input() rootSVG?: SVGSVGElement;

    @Input() roughSVG?: RoughSVG;

    @Input() selection?: Selection;

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

    ngOnChanges(changes: SimpleChanges): void {
        const selection = changes['selection'];
        if (selection) {
            this.updateSelectedState();
        }
    }

    updateSelectedState() {
        const selected = HAS_SELECTED_MINDMAP_NODE.get(this.node as MindmapNode);
        if (selected && this.selectedMarks.length === 0) {
            const { x, y, width, height } = getRectangleByNode(this.node as MindmapNode);
            const selectedStrokeG = drawRoundRectangle(this.roughSVG as RoughSVG, x - 2, y - 2, x + width + 2, y + height + 2, { stroke: primaryColor, strokeWidth: 2, fill: '' });
            const selectedG = drawRoundRectangle(this.roughSVG as RoughSVG, x - 2, y - 2, x + width + 2, y + height + 2, { stroke: primaryColor, fill: primaryColor, fillStyle: 'solid' });
            selectedG.style.opacity = '0.4';
            this.container.appendChild(selectedG);
            this.container.appendChild(selectedStrokeG);
            this.selectedMarks.push(selectedG, selectedStrokeG);
        } else if (!selected && this.selectedMarks.length > 0) {
            this.selectedMarks.forEach((g) => g.remove());
            this.selectedMarks = [];
        }
    }
}