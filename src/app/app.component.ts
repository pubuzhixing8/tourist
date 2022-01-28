import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Point } from 'roughjs/bin/geometry';
import rough from 'roughjs/bin/rough';
import { RoughSVG } from 'roughjs/bin/svg';
import { fromEvent } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { isHotkey } from 'is-hotkey';
import Hotkeys from './utils/hotkeys';
import { addElement, createPaper, removeElement, setElement, setSelection } from './interfaces/paper';
import { ElementType, Element } from './interfaces/element';
import { generateKey } from './utils/key';
import { Attributes } from './interfaces/attributes';
import { Operation } from './interfaces/operation';
import { historyPaper } from './plugins/history';
import { rectanglePaper } from './plugins/rectangle';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'tourist';
  svgElement: SVGSVGElement = {} as any;

  @ViewChild('SVG', { static: true })
  SVG: ElementRef = {} as any;

  rc: RoughSVG = {} as any;

  paper: any = null;

  attributes: Attributes = { color: '#000000', strokeWidth: 2 };

  ngOnInit(): void {
    this.svgElement = this.SVG?.nativeElement;
    this.rc = rough.svg(this.svgElement as SVGSVGElement, { options: { roughness: 0.1, strokeWidth: 2 } });
    this.initializePen(this.rc);
    this.paper = rectanglePaper(historyPaper(createPaper()), this.rc, this.attributes);
    const onChange = this.paper.onChange;
    this.paper.onChange = () => {
      onChange();
      console.log(this.paper.operations, 'operations');
      console.log(this.paper.elements, 'elements');
      const op = this.paper.operations.filter((op: any) => Operation.isSetSelectionOperation(op));
      if (op) {
        const elements = [...this.paper.elements];
        const ele = elements.find((value) => {
          const isSelected = Element.isSelected(value, this.paper.selection);
          return isSelected;
        });
        if (ele) {
          const color = ele.color;
          const strokeWidth = ele.strokeWidth;
          this.attributes.color = color;
          this.attributes.strokeWidth = strokeWidth;
        }
      }
    }
    this.paper.container = this.svgElement;
  }

  initializePen(rc: RoughSVG) {
    // mousedown、mousemove、mouseup
    let context: PenContext = { points: [], isDrawing: false, isReadying: false, rc };
    fromEvent<MouseEvent>(this.svgElement as SVGElement, 'mousedown').pipe(
      tap((event) => {
        this.paper.mousedown(event);
      }),
      filter(() => this.paper.pointer === 'pen')
    ).subscribe({
      next: (event: MouseEvent) => {
        context = { points: [], isReadying: true, isDrawing: false, rc };
        context.points.push(this.mousePointToRelativePoint(event.x, event.y, this.svgElement as SVGSVGElement));
        this.paper.mousedown(event);
      }
    });
    fromEvent<MouseEvent>(this.svgElement as SVGElement, 'mousemove').pipe(
      tap((event) => {
        this.paper.mousemove(event);
      }),
      filter(() => this.paper.pointer === 'pen')
    ).subscribe((event: MouseEvent) => {
      if (context.isReadying && !context.isDrawing) {
        this.startDraw();
      }
      if (context.isReadying) {
        context.isDrawing = true;
        context.points.push(this.mousePointToRelativePoint(event.x, event.y, this.svgElement as SVGSVGElement));
        let svggElement = rc.linearPath(context.points, { stroke: this.attributes.color, strokeWidth: this.attributes.strokeWidth });
        this.svgElement?.appendChild(svggElement);
        this.drawing(context);
        if (context.svg) {
          context.svg.remove();
        }
        context.svg = svggElement;
      }
      this.paper.mousemove(event);
    });
    fromEvent<MouseEvent>(document, 'mouseup').pipe(
      tap((event) => {
        this.paper.mouseup(event);
      }),
      filter(() => this.paper.pointer === 'pen')
    ).subscribe((event: MouseEvent) => {
      if (context.isDrawing) {
        this.endDraw();
        addElement(this.paper, { type: ElementType.linearPath, points: context.points, key: generateKey(), color: this.attributes.color, strokeWidth: this.attributes.strokeWidth });
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
        this.paper.pointer = 'select';
        event.stopPropagation();
        event.preventDefault();
      }
      if (Hotkeys.isDeleteBackward(event) && this.paper.pointer === 'select') {
        const elements = [...this.paper.elements];
        elements.forEach((value) => {
          const isSelected = Element.isSelected(value, this.paper.selection);
          if (isSelected) {
            removeElement(this.paper, value);
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
      if (this.paper.pointer === 'select') {
        const selection = this.getSelectionByPoint(this.mousePointToRelativePoint(event.x, event.y, this.svgElement as SVGSVGElement));
        setSelection(this.paper, selection);
      }
    });
  }

  getSelectionByPoint(point: Point): Selection {
    return { anchor: [point[0] - 5, point[1] - 5], focus: [point[0] + 5, point[1] + 5] };
  }

  attributesChange(attributes: Attributes) {
    if (this.paper.pointer === 'select') {
      const elements = [...this.paper.elements];
      elements.forEach((value) => {
        const isSelected = Element.isSelected(value, this.paper.selection);
        if (isSelected) {
          setElement(this.paper, value, attributes);
        }
      });
    }
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
    this.paper.pointer = 'pen';
  }

  useSelect(event: MouseEvent) {
    event.preventDefault();
    this.paper.pointer = 'select';
  }

  useRectangle(event: MouseEvent) {
    event.preventDefault();
    this.paper.pointer = 'rectangle';
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

export interface Page {
  selection: Selection,
  elements: PenElement[],
}

export const Page = {
  setSelection(page: Page, selection: Selection) {
    page.selection = selection;
  }
}