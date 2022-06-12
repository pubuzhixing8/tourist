import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MINDMAP_KEY, PEM } from './constants';
import { MindmapElement } from './interfaces/element';
import { MindmapNode } from './interfaces/node';
import { Selection } from 'plait/interfaces/selection';
import { PlaitMindmap } from './interfaces/mindmap';
import { createG } from 'plait/utils/dom';
import { MINDMAP_TO_COMPONENT } from './utils/weak-maps';
import { PlaitBoard } from 'plait/interfaces/board';
// import { BoundingBox } from 'tiny-tree-layouts/bounding-box';
import { Layout } from 'tiny-tree-layouts/layout';
import { BoundingBox } from 'tiny-tree-layouts/public-api';

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
        // const options = this.getOptions();
        const bb = new BoundingBox(20, 40);
        const layout = new Layout(bb);
        // const layout = new MindmapLayouts.RightLogical(this.value, options);
        this.root = layout.layout(this.value).result;
        console.log(this.root);
        // this.updateMindmapLocation();
        this.normalizeMindmap();
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

    normalizeMindmap() {
        // const bb: BoundingBox = { left: Number.MAX_VALUE, top: Number.MAX_VALUE, width: 0, height: 0 };
        // let lastNode: MindmapNode | null = null;
        // let lastOffsetY = 0;
        // dfs(this.root, node => {
        //     if (!lastNode) {
        //         bb.left = Math.min(bb.left, node.x);
        //         bb.top = Math.min(bb.top, node.y);
        //         bb.width = Math.max(bb.width, node.x + node.width);
        //         bb.height = Math.max(bb.height, node.y + node.height);
        //         lastNode = node;
        //         return;
        //     }
        //     if (node.y + 1 >= bb.height || (lastNode && node.children.includes(lastNode))) {
        //         // right
        //     } else {
        //         // fail
        //         // console.log('fail', Node.string(node.data.value));
        //         const offsetY = bb.height - node.y;
        //         lastOffsetY = lastOffsetY + offsetY;
        //     }
        //     bb.left = Math.min(bb.left, node.x);
        //     bb.top = Math.min(bb.top, node.y);
        //     bb.width = Math.max(bb.width, node.x + node.width);
        //     bb.height = Math.max(bb.height, node.y + node.height);
        //     lastNode = node;
        //     if (lastOffsetY > 0) {
        //         if (node === this.root) {
        //             return;
        //         }
        //         node.y = node.y + lastOffsetY;
        //     }
        // });
    }
}

function dfs(node: MindmapNode, callback: (node: MindmapNode) => void) {
    node.children.forEach(_node => {
        dfs(_node, callback);
    });
    callback(node);
}

// export interface BoundingBox {
//     left: number;
//     top: number;
//     width: number;
//     height: number;
// }
