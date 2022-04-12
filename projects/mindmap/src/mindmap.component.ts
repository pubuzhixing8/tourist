import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import rough from 'roughjs/bin/rough';
import { RoughSVG } from 'roughjs/bin/svg';
import { PEM } from './constants';
import { drawNode } from './draw/node';
import { MindmapElement } from './interface/element';
import { MindmapNode } from './interface/node';
// import layouts from 'mindmap-layouts';

declare const require: any;

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

  get container(): SVGSVGElement {
    if (!this.svg) {
      throw new Error('undefined svg container');
    }
    return this.svg.nativeElement;
  }

  @Input()
  value: MindmapElement | undefined;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private viewContainerRef: ViewContainerRef) { }

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
      rootNode.eachNode((node: MindmapNode) => {
        node.children.forEach(child => {
          // drawLink(node, child, ctx, isHorizontal(layoutType), scale)
          // 画链接线
        })
        // 画矩形、渲染富文本
        const { nodeG, richTextG, richtextComponentRef } = drawNode(this.roughSVG as RoughSVG, node, this.componentFactoryResolver, this.viewContainerRef, 1);
        this.container.appendChild(nodeG);
        this.container.appendChild(richTextG);
      })
    }

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
