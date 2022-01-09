import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Point } from 'roughjs/bin/geometry';
import rough from 'roughjs/bin/rough';
import { RoughSVG } from 'roughjs/bin/svg';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { isHotkey } from 'is-hotkey';
import Hotkeys from './utils/hotkeys';
import { addLinearPath, createPaper, HistoryPaper } from './interfaces/paper';
import { ElementType } from './interfaces/element';
import { generateKey } from './utils/key';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'tourist';
  svgElement: SVGSVGElement = {} as any;

  @ViewChild('SVG', { static: true })
  SVG: ElementRef = {} as any;

  pointer: 'pen' | 'select' = 'pen';

  paper = HistoryPaper(createPaper());

  selection: Selection = { anchor: [-1, -1], focus: [-1, -1] };

  rc: RoughSVG = {} as any;

  ngOnInit(): void {
    this.svgElement = this.SVG?.nativeElement;
    const rc = rough.svg(this.svgElement as SVGSVGElement, { options: { roughness: 0.1, strokeWidth: 2 } });
    this.initializePen(rc);
    this.rc = rc;
    const onChange = this.paper.onChange;
    this.paper.onChange = () => {
      onChange();
      console.log(this.paper.operations, 'operations');
      console.log(this.paper.elements, 'elements');
    }
  }

  initializePen(rc: RoughSVG) {
    // mousedown、mousemove、mouseup
    let context: PenContext = { points: [], isDrawing: false, isReadying: false, rc };
    fromEvent<MouseEvent>(this.svgElement as SVGElement, 'mousedown').pipe(
      filter(() => this.pointer === 'pen')
    ).subscribe({
      next: (event: MouseEvent) => {
        context = { points: [], isReadying: true, isDrawing: false, rc };
        context.points.push(this.mousePointToRelativePoint(event.x, event.y, this.svgElement as SVGSVGElement));
      }
    });
    fromEvent<MouseEvent>(this.svgElement as SVGElement, 'mousemove').pipe(
      filter(() => this.pointer === 'pen')
    ).subscribe((event: MouseEvent) => {
      if (context.isReadying && !context.isDrawing) {
        this.startDraw();
      }
      if (context.isReadying) {
        context.isDrawing = true;
        context.points.push(this.mousePointToRelativePoint(event.x, event.y, this.svgElement as SVGSVGElement));
        let svggElement = rc.linearPath(context.points);
        this.svgElement?.appendChild(svggElement);
        this.drawing(context);
        if (context.svg) {
          context.svg.remove();
        }
        context.svg = svggElement;
      }
    });
    fromEvent(document, 'mouseup').pipe(
      filter(() => this.pointer === 'pen')
    ).subscribe(() => {
      if (context.isDrawing) {
        this.endDraw();
      }
      context.svg?.remove();
      addLinearPath(this.paper, { type: ElementType.linearPath, points: context.points, key: generateKey() });
      context = { isReadying: false, isDrawing: false, points: [], rc };
    });

    fromEvent<KeyboardEvent>(document, 'keydown').pipe(
    ).subscribe((event: KeyboardEvent) => {
      if (isHotkey('mod+a', event)) {
        const rect = this.svgElement.getBoundingClientRect();
        const selection: Selection = { anchor: [0, 0], focus: [rect.width, rect.height] };
        this.setSelection(selection);
        this.pointer = 'select';
        event.stopPropagation();
        event.preventDefault();
      }
      if (Hotkeys.isDeleteBackward(event) && this.pointer === 'select') {
        // const selectedElements = this.getElementsBySelection(this.selection);
        // selectedElements.forEach((element) => {
        //   element.lineSvg.remove();
        //   element.rectSvg?.remove();
        //   // this.penElements.splice(this.penElements.indexOf(element), 1);
        // })
        event.stopPropagation();
        event.preventDefault();
      }
      if (Hotkeys.isUndo(event)) {
        this.paper.undo();
      }
      if (Hotkeys.isRedo(event)) {
        this.paper.redo();
      }
    });

    fromEvent<MouseEvent>(this.svgElement as SVGElement, 'click').pipe().subscribe((event: MouseEvent) => {
      if (this.pointer === 'select') {
        const selection = this.getSelectionByPoint(this.mousePointToRelativePoint(event.x, event.y, this.svgElement as SVGSVGElement));
        this.setSelection(selection);
      }
    });
  }

  // getElementsBySelection(selection: Selection): PenElement[] {
  //   // return this.penElements.filter((element) => {
  //   //   if (!element.lineSvg) {
  //   //     return false;
  //   //   }
  //   //   const rect = element.lineSvg.getBoundingClientRect();
  //   //   const a: Rect = { start: this.mousePointToRelativePoint(rect.x, rect.y, this.svgElement), width: rect.width, height: rect.height };
  //   //   const b: Rect = { start: [...selection.anchor], width: selection.focus[0] - selection.anchor[0], height: selection.focus[1] - selection.anchor[1] };
  //   //   return Rect.interaction(a, b)
  //   // });
  // }

  getSelectionByPoint(point: Point): Selection {
    return { anchor: [point[0] - 5, point[1] - 5], focus: [point[0] + 5, point[1] + 5] };
  }

  setSelection(selection: Selection) {
    this.removeSelection();
    // const elements = this.getElementsBySelection(selection);
    // elements.forEach((element) => {
    //   const rect = element.lineSvg.getBoundingClientRect();
    //   const point = this.mousePointToRelativePoint(rect.x, rect.y, this.svgElement as SVGSVGElement);
    //   const rectSvg = this.rc.rectangle(point[0] - 3, point[1] - 3, rect.width + 6, rect.height + 6, { strokeLineDash: [6, 6], strokeWidth: 1, stroke: '#348fe4' });
    //   this.svgElement?.appendChild(rectSvg);
    //   element.rectSvg = rectSvg;
    // });
    // this.selection = selection;
  }

  removeSelection() {
    this.selection = { anchor: [-1, -1], focus: [-1, -1] };
    // this.penElements.filter((element) => element.rectSvg).forEach((element) => {
    //   element.rectSvg?.remove();
    // });
  }

  isFocus() {
  }

  hasFocusElement() {

  }

  startDraw() {
    console.log('---start draw---')
  }

  endDraw() {
    console.log('---end draw---')
  }

  drawing(context: PenContext) {

  }

  mousePointToRelativePoint(x: number, y: number, container: SVGSVGElement): Point {
    const rect = container.getBoundingClientRect();
    return [x - rect.x, y - rect.y];
  }

  usePen(event: MouseEvent) {
    event.preventDefault();
    this.pointer = 'pen';
  }

  useSelect(event: MouseEvent) {
    event.preventDefault();
    this.pointer = 'select';
  }
}

export interface Rect {
  start: Point;
  width: number;
  height: number;
}

export const Rect = {
  interaction: (a: Rect, b: Rect) => {
    const minX = a.start[0] < b.start[0] ? a.start[0] : b.start[0];
    const maxX = a.start[0] + a.width < b.start[0] + b.width ? b.start[0] + b.width : a.start[0] + a.width;
    const minY = a.start[1] < b.start[1] ? a.start[1] : b.start[1];
    const maxY = a.start[1] + a.height < b.start[1] + b.height ? b.start[1] + b.height : a.start[1] + a.height;
    const xWidth = (a.width + b.width) - (maxX - minX);
    const yHeight = (a.height + b.height) - (maxY - minY);
    if (xWidth > 0 && yHeight > 0) {
      return true;
    } else {
      return false;
    }
  }
};


export interface PenContext {
  isReadying: boolean;
  isDrawing: boolean;
  points: Point[];
  rc: RoughSVG;
  svg?: SVGGElement;
};

export interface PenElement {
  points: Point[];
  lineSvg: SVGGElement;
  rectSvg?: SVGGElement;
}

export interface Selection {
  anchor: [number, number];
  focus: [number, number];
}

export const Selection = {

};

export interface Page {
  selection: Selection,
  elements: PenElement[],
}

export const Page = {
  setSelection(page: Page, selection: Selection) {
    page.selection = selection;

  }
}