import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import rough from 'roughjs/bin/rough';
import { RoughSVG } from 'roughjs/bin/svg';
import { fromEvent } from 'rxjs';
import { PEM } from './constants';
import { MindmapElement } from './interfaces/element';
import { MindmapNode } from './interfaces/node';
import { Selection } from './interfaces/selection';

declare const require: any;

@Component({
  selector: 'plait-mindmap',
  template: `
  <svg #svg width="100%" height="100%">
  </svg>
  <plait-mindmap-node [roughSVG]="roughSVG" [rootSVG]="container" [node]="root"></plait-mindmap-node>
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

  constructor() { }

  ngOnInit(): void {
    this.roughSVG = rough.svg(this.container, { options: { roughness: 0, strokeWidth: 1 } });
    const MindmapLayouts = require('mindmap-layouts');
    if (this.value) {
      this.value.isRoot = true;
      const options = this.getOptions();
      const layout = new MindmapLayouts.RightLogical(this.value, options) // root is tree node like above
      this.root = layout.doLayout() // you have x, y, centX, centY, actualHeight, actualWidth, etc.
    }
    fromEvent(this.container, 'click').subscribe(() => {
      
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
