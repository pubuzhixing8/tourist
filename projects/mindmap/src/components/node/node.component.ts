import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, Input, OnInit, ViewContainerRef } from "@angular/core";
import { drawNode } from "../../draw/node";
import { RoughSVG } from "roughjs/bin/svg";
import { MindmapNode } from "../../interface/node";
import { drawLine } from "../../draw/line";

@Component({
    selector: 'plait-mindmap-node',
    template: '<plait-mindmap-node *ngFor="let childNode of node?.children" [roughSVG]="roughSVG" [rootSVG]="rootSVG" [node]="childNode"></plait-mindmap-node>',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MindmapNodeComponent implements OnInit {
    selected = false;

    @Input()
    node?: MindmapNode;

    @Input() rootSVG?: SVGSVGElement;

    @Input() roughSVG?: RoughSVG;


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
        this.node?.children.forEach(child => {
            // 画链接线
            const lineG = drawLine(this.roughSVG as RoughSVG, this.node as MindmapNode, child, true, 1);
            this.container.appendChild(lineG);
        })
    }
}