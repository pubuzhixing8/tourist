import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MINDMAP_KEY, PEM } from './constants';
import { MindmapElement } from './interfaces/element';
import { MindmapNode } from './interfaces/node';
import { Selection } from 'plait/interfaces/selection';
import { PlaitMindmap } from './interfaces/mindmap';
import { createG } from 'plait/utils/dom';
import { MINDMAP_TO_COMPONENT } from './utils/weak-maps';
import { PlaitBoard } from 'plait/interfaces/board';

declare const require: any;
const MindmapLayouts = require('mindmap-layouts');

@Component({
    selector: 'plait-mindmap',
    template: `
        <plait-mindmap-node
            [mindmapGGroup]="mindmapGGroup"
            [host]="host"
            [node]="root"
            [selection]="selection"
            [board]="board"
        ></plait-mindmap-node>
    `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'plait-mindmap'
    }
})
export class PlaitMindmapComponent implements OnInit, OnDestroy {
    root!: MindmapNode;

    mindmapGGroup!: SVGGElement;

    @Input() value!: PlaitMindmap;

    @Input() selection: Selection | null = null;

    @Input() host!: SVGElement;

    @Input() board!: PlaitBoard;

    constructor(private cdr: ChangeDetectorRef) {
        this.mindmapGGroup = createG();
        this.mindmapGGroup.setAttribute(MINDMAP_KEY, 'true');
    }

    ngOnInit(): void {
        this.updateMindmap(false);
    }

    getOptions() {
        return {
            getHeight(element: MindmapElement) {
                if (element.isRoot) {
                    return element.height * 2 + PEM * 0.4;
                }
                return element.height + PEM * 0.4;
            },
            getWidth(element: MindmapElement) {
                if (element.isRoot) {
                    return element.width * 2 + PEM * 1.6;
                }
                return element.width + PEM * 1.6;
            },
            getHGap(element: MindmapElement) {
                if (element.isRoot) {
                    return PEM * 4;
                }
                return Math.round(PEM);
            },
            getVGap(element: MindmapElement) {
                if (element.isRoot) {
                    return PEM * 4;
                }
                return Math.round(PEM);
            }
        };
    }

    updateMindmap(doCheck = true) {
        MINDMAP_TO_COMPONENT.set(this.value, this);
        const options = this.getOptions();
        const layout = new MindmapLayouts.RightLogical(this.value, options);
        this.root = layout.doLayout();
        this.updateMindmapLocation();
        if (doCheck) {
            this.cdr.detectChanges();
        }
    }

    doCheck() {
        this.cdr.markForCheck();
    }

    ngOnDestroy(): void {
        this.mindmapGGroup.remove();
        MINDMAP_TO_COMPONENT.delete(this.value);
    }

    updateMindmapLocation() {
        const { x, y, vgap, hgap } = this.root;
        const offsetX = x + hgap;
        const offsetY = y + vgap;
        (this.root as any).eachNode((node: MindmapNode) => {
            node.x = node.x - offsetX + this.value.points[0][0];
            node.y = node.y - offsetY + this.value.points[0][1];
        });
    }
}
