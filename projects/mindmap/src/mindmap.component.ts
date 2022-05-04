import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { mousePointToRelativePoint } from 'plait/utils/dom';
import rough from 'roughjs/bin/rough';
import { RoughSVG } from 'roughjs/bin/svg';
import { fromEvent } from 'rxjs';
import { PEM } from './constants';
import { getRectangleByNode } from './draw/node';
import { MindmapElement } from './interfaces/element';
import { MindmapNode } from './interfaces/node';
import { HAS_SELECTED_MINDMAP_NODE } from './utils/weak-maps';
import { Selection } from 'plait/interfaces/selection';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaitMindmapComponent implements OnInit {
  roughSVG: RoughSVG | undefined;

  root: MindmapNode | undefined;

  @ViewChild('svg', { static: true })
  svg: ElementRef | undefined;

  get container(): SVGSVGElement {
    if (!this.svg) {
      throw new Error('undefined svg container');
    }
    return this.svg.nativeElement;
  }

  @Input() value?: MindmapElement;

  @Input() selection?: Selection;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.roughSVG = rough.svg(this.container, { options: { roughness: 0, strokeWidth: 1 } });
    const MindmapLayouts = require('mindmap-layouts');
    if (this.value) {
      this.value.isRoot = true;
      const options = this.getOptions();
      const layout = new MindmapLayouts.RightLogical(this.value, options) // root is tree node like above
      this.root = layout.doLayout() // you have x, y, centX, centY, actualHeight, actualWidth, etc.
    }
    fromEvent<MouseEvent>(this.container, 'click').subscribe((event: MouseEvent) => {
      const point = mousePointToRelativePoint(event.x, event.y, this.container as SVGElement);
      this.selection = { anchor: point, focus: point };
      this.cdr.markForCheck();
      (this.root as any).eachNode((node: MindmapNode) => {
        const { x, y, width, height } = getRectangleByNode(node);
        if (point[0] >= x && point[0] <= x + width && point[1] >= y && point[1] <= y + height) {
          HAS_SELECTED_MINDMAP_NODE.set(node, true);
        } else {
          HAS_SELECTED_MINDMAP_NODE.delete(node);
        }
      });
    })
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
}
