import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MINDMAP_KEY, PEM } from './constants';
import { MindmapElement } from './interfaces/element';
import { MindmapNode } from './interfaces/node';
import { Selection } from 'plait/interfaces/selection';
import { PlaitMindmap } from './interfaces/mindmap';
import { createG } from 'plait/utils/dom';

declare const require: any;
const MindmapLayouts = require('mindmap-layouts');

@Component({
  selector: 'plait-mindmap',
  template: `<plait-mindmap-node [mindmapGGroup]="mindmapGGroup" [host]="host" [node]="root" [selection]="selection"></plait-mindmap-node>`,
  styles: [
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'plait-mindmap'
  }
})
export class PlaitMindmapComponent implements OnInit, OnDestroy {
  root!: MindmapNode;

  mindmapGGroup!: SVGGElement;

  @Input() value!: PlaitMindmap;

  @Input() selection: Selection | null = null;

  @Input() host!: SVGElement;

  @Output() valueChange: EventEmitter<PlaitMindmap> = new EventEmitter();

  constructor(private cdr: ChangeDetectorRef) {
    this.mindmapGGroup = createG()
    this.mindmapGGroup.setAttribute(MINDMAP_KEY, 'true');
  }

  ngOnInit(): void {
    this.value.root.isRoot = true;
    const options = this.getOptions();
    const layout = new MindmapLayouts.RightLogical(this.value.root, options) // root is tree node like above
    this.root = layout.doLayout() // you have x, y, centX, centY, actualHeight, actualWidth, etc.
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
    const layout = new MindmapLayouts.RightLogical(this.value.root, options) // root is tree node like above
    this.root = layout.doLayout() // you have x, y, centX, centY, actualHeight, actualWidth, etc.
    this.cdr.detectChanges();
    this.valueChange.emit(this.value);
  }

  ngOnDestroy(): void {
    this.mindmapGGroup.remove();
  }
}
