import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { mousePointToRelativePoint } from 'plait/utils/dom';
import rough from 'roughjs/bin/rough';
import { RoughSVG } from 'roughjs/bin/svg';
import { fromEvent } from 'rxjs';
import { PEM } from './constants';
import { addMindmapElement, addMindmapElementAfter, MindmapElement, removeMindmapElement, updateMindmapElement } from './interfaces/element';
import { MindmapNode } from './interfaces/node';
import { HAS_SELECTED_MINDMAP_NODE, ELEMENT_GROUP_TO_COMPONENT, MINDMAP_NODE_TO_COMPONENT, IS_TEXT_EDITABLE } from './utils/weak-maps';
import { Selection } from 'plait/interfaces/selection';
import hotkeys from 'plait/utils/hotkeys';
import { hitMindmapNode } from './utils/graph';
import { PlaitMindmap } from './interfaces/mindmap';

declare const require: any;

@Component({
  selector: 'plait-mindmap',
  template: `
  <svg #svg width="100%" height="100%">
  </svg>
  <plait-mindmap-node [roughSVG]="roughSVG" [rootSVG]="container" [node]="root" [selection]="selection"></plait-mindmap-node>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'plait-mindmap'
  }
})
export class PlaitMindmapComponent implements OnInit {
  roughSVG: RoughSVG | undefined;

  root: MindmapNode | undefined;

  MindmapLayouts = require('mindmap-layouts');


  @ViewChild('svg', { static: true })
  svg: ElementRef | undefined;

  get container(): SVGSVGElement {
    if (!this.svg) {
      throw new Error('undefined svg container');
    }
    return this.svg.nativeElement;
  }

  @Input() value?: PlaitMindmap;

  @Input() selection?: Selection;

  @Output() valueChange: EventEmitter<PlaitMindmap> = new EventEmitter();

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.roughSVG = rough.svg(this.container, { options: { roughness: 0, strokeWidth: 1 } });
    if (this.value) {
      this.value.root.isRoot = true;
      const options = this.getOptions();
      const layout = new this.MindmapLayouts.RightLogical(this.value.root, options) // root is tree node like above
      this.root = layout.doLayout() // you have x, y, centX, centY, actualHeight, actualWidth, etc.
    }
    // fromEvent<MouseEvent>(this.container, 'click').subscribe((event: MouseEvent) => {
    //   if (IS_TEXT_EDITABLE.get(this.value as PlaitMindmap)) {
    //     return;
    //   }
    //   const point = mousePointToRelativePoint(event.x, event.y, this.container as SVGElement);
    //   this.selection = { anchor: point, focus: point };
    //   this.cdr.markForCheck();
    //   (this.root as any).eachNode((node: MindmapNode) => {
    //     if (hitMindmapNode(point, node)) {
    //       HAS_SELECTED_MINDMAP_NODE.set(node, true);
    //     } else {
    //       HAS_SELECTED_MINDMAP_NODE.delete(node);
    //     }
    //   });
    // })

    // fromEvent<MouseEvent>(this.container, 'dblclick').subscribe((event: MouseEvent) => {
    //   if (IS_TEXT_EDITABLE.get(this.value as PlaitMindmap)) {
    //     return;
    //   }
    //   if (event.target instanceof HTMLElement) {
    //     const point = mousePointToRelativePoint(event.x, event.y, this.container as SVGElement);
    //     (this.root as any).eachNode((node: MindmapNode) => {
    //       if (hitMindmapNode(point, node)) {
    //         const nodeComponent = MINDMAP_NODE_TO_COMPONENT.get(node);
    //         if (nodeComponent) {
    //           IS_TEXT_EDITABLE.set(this.value as PlaitMindmap, true);
    //           nodeComponent.startEditText((node) => {
    //             updateMindmapElement(this.value?.root as MindmapElement, nodeComponent.node?.data as MindmapElement, node);
    //             this.updateMindmap();
    //           }, () => {
    //             IS_TEXT_EDITABLE.set(this.value as PlaitMindmap, false);
    //           });
    //         }
    //         return;
    //       }
    //     });
    //   }
    // });

    // fromEvent<KeyboardEvent>(document, 'keydown').subscribe((event: KeyboardEvent) => {
    //   if (IS_TEXT_EDITABLE.get(this.value as PlaitMindmap)) {
    //     return;
    //   }
    //   if (event.key === 'Tab') {
    //     event.preventDefault();
    //     (this.root as any).eachNode((node: MindmapNode) => {
    //       if (HAS_SELECTED_MINDMAP_NODE.get(node)) {
    //         addMindmapElement(this.value?.root as MindmapElement, node.data);
    //         this.updateMindmap();
    //       }
    //     });
    //   }
    //   if (hotkeys.isDeleteBackward(event)) {
    //     (this.root as any).eachNode((node: MindmapNode) => {
    //       if (HAS_SELECTED_MINDMAP_NODE.get(node)) {
    //         removeMindmapElement(this.value?.root as MindmapElement, node.data);
    //         this.updateMindmap();
    //       }
    //     });
    //   }
    //   if (event.key === 'Enter') {
    //     (this.root as any).eachNode((node: MindmapNode) => {
    //       if (HAS_SELECTED_MINDMAP_NODE.get(node)) {
    //         addMindmapElementAfter(this.value?.root as MindmapElement, node.data);
    //         this.updateMindmap();
    //       }
    //     });
    //   }
    // });
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
        return Math.round(PEM)
      },
      getVGap(element: MindmapElement) {
        if (element.isRoot) {
          return PEM * 4
        }
        return Math.round(PEM)
      }
    };
  }

  updateMindmap() {
    if (!this.value) {
      throw new Error('');
    }
    this.value.root.isRoot = true;
    const options = this.getOptions();
    const layout = new this.MindmapLayouts.RightLogical(this.value.root, options) // root is tree node like above
    this.root = layout.doLayout() // you have x, y, centX, centY, actualHeight, actualWidth, etc.
    this.cdr.detectChanges();
    this.valueChange.emit(this.value);
  }
}
