import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Point } from 'roughjs/bin/geometry';
import rough from 'roughjs/bin/rough';
import { RoughSVG } from 'roughjs/bin/svg';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { isHotkey } from 'is-hotkey';
import Hotkeys from './utils/hotkeys';
import { addLinearPath, createPaper, HistoryPaper, removeLinearPath, setSelection } from './interfaces/paper';
import { ElementType, Element } from './interfaces/element';
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
        addLinearPath(this.paper, { type: ElementType.linearPath, points: context.points, key: generateKey() });
      }
      context.svg?.remove();
      context = { isReadying: false, isDrawing: false, points: [], rc };
    });

    fromEvent<KeyboardEvent>(document, 'keydown').pipe(
    ).subscribe((event: KeyboardEvent) => {
      if (isHotkey('mod+a', event)) {
        const rect = this.svgElement.getBoundingClientRect();
        const selection: Selection = { anchor: [0, 0], focus: [rect.width, rect.height] };
        setSelection(this.paper, selection);
        this.pointer = 'select';
        event.stopPropagation();
        event.preventDefault();
      }
      if (Hotkeys.isDeleteBackward(event) && this.pointer === 'select') {
        this.paper.elements.forEach((value) => {
          const isSelected = Element.isSelected(value, this.paper.selection);
          if (isSelected) {
            removeLinearPath(this.paper, value);
          }
        });
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
        setSelection(this.paper, selection);
      }
    });
  }

  getSelectionByPoint(point: Point): Selection {
    return { anchor: [point[0] - 5, point[1] - 5], focus: [point[0] + 5, point[1] + 5] };
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