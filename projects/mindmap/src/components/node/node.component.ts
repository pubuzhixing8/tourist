import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, ComponentRef, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewContainerRef } from "@angular/core";
import { drawNode } from "../../draw/node";
import { RoughSVG } from "roughjs/bin/svg";
import { MindmapNode } from "../../interfaces/node";
import { drawLine } from "../../draw/line";
import { drawRoundRectangle, getRectangleByNode } from "../../utils/graph";
import { nodeGroup, primaryColor } from "../../constants";
import { HAS_SELECTED_MINDMAP_NODE, ELEMENT_GROUP_TO_COMPONENT } from "../../utils/weak-maps";
import { Selection } from 'plait/interfaces/selection';
import { PlaitRichtextComponent, setFullSelectionAndFocus } from "richtext";
import { take } from "rxjs/operators";
import { drawMindmapNodeRichtext, updateMindmapNodeRichtextLocation } from "../../draw/richtext";
import { createG } from "plait/utils/dom";
import { MindmapElement } from "../../interfaces/element";

@Component({
    selector: 'plait-mindmap-node',
    template: '<plait-mindmap-node *ngFor="let childNode of node?.children;trackBy: trackBy" [roughSVG]="roughSVG" [rootSVG]="rootSVG" [node]="childNode" [parent]="node" [selection]="selection"></plait-mindmap-node>',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MindmapNodeComponent implements OnInit, OnChanges, OnDestroy {
    initialized = false;

    @Input() node?: MindmapNode;

    @Input() parent?: MindmapNode;

    @Input() rootSVG?: SVGSVGElement;

    @Input() roughSVG?: RoughSVG;

    @Input() selection?: Selection;

    selectedMarks: SVGGElement[] = [];

    nodeG: SVGGElement | null = null;

    lineG?: SVGGElement;

    richtextG?: SVGGElement;

    richtextComponentRef?: ComponentRef<PlaitRichtextComponent>;

    gGroup: SVGGElement;

    get container(): SVGGElement {
        return this.gGroup;
    }

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private viewContainerRef: ViewContainerRef) {
        this.gGroup = createG()
        this.gGroup.classList.add(nodeGroup);
    }

    ngOnInit(): void {
        this.rootSVG?.append(this.gGroup);
        this.drawNode();
        this.drawLine();
        this.drawRichtext();
        this.initialized = true;
        ELEMENT_GROUP_TO_COMPONENT.set(this.container, this);
    }

    drawNode() {
        this.destroyNode();
        this.nodeG = drawNode(this.roughSVG as RoughSVG, this.node as MindmapNode);
        this.container.prepend(this.nodeG);
    }

    destroyNode() {
        if (this.nodeG) {
            this.nodeG.remove();
            this.nodeG = null;
        }
    }

    drawLine() {
        if (this.parent) {
            if (this.lineG) {
                this.lineG.remove();
            }
            this.lineG = drawLine(this.roughSVG as RoughSVG, this.parent as MindmapNode, this.node as MindmapNode, true, 1);
            this.container.append(this.lineG);
        }
    }

    destroyLine() {
        if (this.parent) {
            if (this.lineG) {
                this.lineG.remove();
            }
        }
    }

    drawSelectedState() {
        this.destroySelectedState();
        const selected = HAS_SELECTED_MINDMAP_NODE.get(this.node as MindmapNode);
        if (selected) {
            const { x, y, width, height } = getRectangleByNode(this.node as MindmapNode);
            const selectedStrokeG = drawRoundRectangle(this.roughSVG as RoughSVG, x - 2, y - 2, x + width + 2, y + height + 2, { stroke: primaryColor, strokeWidth: 2, fill: '' });
            this.container.appendChild(selectedStrokeG);
            this.selectedMarks.push(selectedStrokeG);
            if (this.richtextComponentRef?.instance.readonly === true) {
                const selectedBackgroundG = drawRoundRectangle(this.roughSVG as RoughSVG, x - 2, y - 2, x + width + 2, y + height + 2, { stroke: primaryColor, fill: primaryColor, fillStyle: 'solid' });
                selectedBackgroundG.style.opacity = '0.4';
                this.container.appendChild(selectedBackgroundG);
                this.selectedMarks.push(selectedBackgroundG, selectedStrokeG);
            }
        }
    }

    destroySelectedState() {
        this.selectedMarks.forEach((g) => g.remove());
        this.selectedMarks = [];
    }

    drawRichtext() {
        const { richTextG, richtextComponentRef } = drawMindmapNodeRichtext(this.node as MindmapNode, this.componentFactoryResolver, this.viewContainerRef);
        this.richtextComponentRef = richtextComponentRef;
        this.richtextG = richTextG;
        this.container.append(richTextG);
    }

    destroyRichtext() {
        if (this.richtextG) {
            this.richtextG.remove();
        }
        if (this.richtextComponentRef) {
            this.richtextComponentRef.destroy();
        }
    }

    updateRichtextLocation() {
        updateMindmapNodeRichtextLocation(this.node as MindmapNode, this.richtextG as SVGGElement);
    }

    ngOnChanges(changes: SimpleChanges): void {
        const selection = changes['selection'];
        if (selection) {
            this.drawSelectedState();
        }
        if (this.initialized) {
            const node = changes['node'];
            if (node) {
                this.drawNode();
                this.drawLine();
                this.updateRichtextLocation();
                this.drawSelectedState();
            }
        }
    }

    startEditText(setElement: (element: MindmapElement) => void) {
        if (!this.richtextComponentRef) {
            throw new Error('undefined richtextComponentRef');
        }
        const richtextInstance = this.richtextComponentRef.instance;
        if (richtextInstance.readonly) {
            richtextInstance.readonly = false;
            this.richtextComponentRef.changeDetectorRef.markForCheck();
            setTimeout(() => {
                setFullSelectionAndFocus(richtextInstance.editor);
                updateMindmapNodeRichtextLocation(this.node as MindmapNode, this.richtextG as SVGGElement, true);
            }, 0);
        }
        let richtext = richtextInstance.value;
        const valueChange$ = richtextInstance.onChange.subscribe((event) => {
            richtext = event.value;
            // 更新富文本、更新宽高
            const { width, height } = richtextInstance.editable.getBoundingClientRect();
            const newElement = { ...this.node?.data, value: richtext, width: width, height } as MindmapElement;
            setElement(newElement);
        });
        richtextInstance.blur.pipe(take(1)).subscribe(() => {
            richtextInstance.readonly = true;
            this.richtextComponentRef?.changeDetectorRef.markForCheck();
            // 取消订阅内容变化
            valueChange$.unsubscribe();
            this.endEditText();
        });
    }

    endEditText() {
        this.drawSelectedState();
    }

    trackBy = (index: number, node: MindmapNode) => {
        return index;
    }

    ngOnDestroy(): void {
        this.destroyRichtext();
        this.container.remove();
        ELEMENT_GROUP_TO_COMPONENT.delete(this.container);
    }
}