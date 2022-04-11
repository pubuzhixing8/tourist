import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import rough from 'roughjs/bin/rough';
import { RoughSVG } from 'roughjs/bin/svg';
import { MindmapElement } from './interface/element';
// import layouts from 'mindmap-layouts';

declare const require: any;

const PEM = 18;

@Component({
  selector: 'plait-mindmap',
  template: `
  <svg #svg width="100%" height="100%">
  </svg>
  `,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaitMindmapComponent implements OnInit {
  roughSVG: RoughSVG | undefined;

  @ViewChild('svg', { static: true })
  svg: ElementRef | undefined;

  get container() {
    if (!this.svg) {
      throw new Error('undefined svg container');
    }
    return this.svg.nativeElement;
  }

  @Input()
  value: MindmapElement | undefined;

  constructor() { }

  ngOnInit(): void {
    this.roughSVG = rough.svg(this.container, { options: { roughness: 0, strokeWidth: 1 } });
    const MindmapLayouts = require('mindmap-layouts');
    if (this.value) {
      this.value.isRoot = true;
      const options = this.getOptions();
      const layout = new MindmapLayouts.RightLogical(this.value, options) // root is tree node like above
      const rootNode = layout.doLayout() // you have x, y, centX, centY, actualHeight, actualWidth, etc.
      console.log(rootNode);
      // 画矩形框
      // 画链接线
      // 渲染富文本
    }

  }

  getOptions() {
    return {
      getHeight(element: MindmapElement) {
        if (element.isRoot) {
          return PEM * 2.4
        }
        return PEM * 1.2
      },
      getWidth(element: MindmapElement) {
        if (element.isRoot) {
          return element.width * 2 + PEM * 1.6;
          // return ctx.measureText(element.value).width * 2 + PEM * 1.6
        }
        // return ctx.measureText(d.name).width + PEM * 1.6
        return element.width + PEM * 1.6;
      },
      getHGap(element: MindmapElement) {
        if (element.isRoot) {
          return PEM * 2
        }
        return Math.round(PEM / 2)
      },
      getVGap(element: MindmapElement) {
        if (element.isRoot) {
          return PEM * 2
        }
        return Math.round(PEM / 2)
      }
    };
  }
}
