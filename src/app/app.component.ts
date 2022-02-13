import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Point } from 'roughjs/bin/geometry';
import rough from 'roughjs/bin/rough';
import { RoughSVG } from 'roughjs/bin/svg';
import { fromEvent } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isHotkey } from 'is-hotkey';
import Hotkeys from './utils/hotkeys';
import { createPaper, removeElement, setElement, setSelection } from './interfaces/paper';
import { Element } from './interfaces/element';
import { Attributes, EdgeMode } from './interfaces/attributes';
import { Operation } from './interfaces/operation';
import { HistoryPaper, historyPaper } from './plugins/history';
import { shapePaper } from './plugins/shape';
import { PointerType } from './interfaces/pointer';
import { Selection } from './interfaces/selection';
import { movePaper } from './plugins/move';
import { cursorPaper } from './plugins/cursor';
import { resizePaper } from './plugins/resize';
import { likeLinePaper } from './plugins/like-line';
import { circlePaper } from './plugins/circle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'tourist';
  container: SVGSVGElement = {} as any;

  @ViewChild('SVG', { static: true })
  SVG: ElementRef | undefined;

  rc: RoughSVG | undefined;

  paper: HistoryPaper | undefined;

  attributes: Attributes = { color: '#000000', strokeWidth: 2, edgeMode: EdgeMode.sharp };

  pointerType = PointerType;

  ngOnInit(): void {
    this.container = this.SVG?.nativeElement;
    this.rc = rough.svg(this.container, { options: { roughness: 0.1, strokeWidth: 2 } });
    const paper = circlePaper(likeLinePaper(resizePaper(cursorPaper(movePaper(shapePaper(historyPaper(createPaper()), this.rc, this.attributes), this.rc, this.attributes), this.container), this.rc, this.attributes), this.rc, this.attributes), this.rc, this.attributes);
    this.paper = paper;
    this.initializePen(this.rc, paper);
    this.useCursor();
    const onChange = paper?.onChange;
    paper.onChange = () => {
      onChange();
      console.log(paper.operations, 'operations');
      console.log(paper.elements, 'elements');
      const op = paper.operations.filter((op: any) => Operation.isSetSelectionOperation(op));
      if (op && this.paper) {
        const elements = [...this.paper.elements];
        const ele = elements.find((value) => {
          const isSelected = Element.isIntersected(value, paper.selection);
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
    this.paper.container = this.container;
  }

  initializePen(rc: RoughSVG, paper: HistoryPaper) {
    // mousedown、mousemove、mouseup
    let context: PenContext = { points: [], isDrawing: false, isReadying: false, rc };
    fromEvent<MouseEvent>(this.container as SVGElement, 'mousedown').pipe(
      tap((event) => {
        paper.mousedown(event);
      })
    ).subscribe({
      next: (event: MouseEvent) => {
      }
    });
    fromEvent<MouseEvent>(this.container as SVGElement, 'mousemove').pipe(
      tap((event) => {
        paper.mousemove(event);
      })
    ).subscribe((event: MouseEvent) => {
    });
    fromEvent<MouseEvent>(document, 'mouseup').pipe(
      tap((event) => {
        paper.mouseup(event);
      })
    ).subscribe((event: MouseEvent) => {
    });
    fromEvent<KeyboardEvent>(document, 'keydown').pipe(
    ).subscribe((event: KeyboardEvent) => {
      this.paper?.keydown(event);
      if (isHotkey('mod+a', event)) {
        const rect = this.container.getBoundingClientRect();
        const selection: Selection = { anchor: [0, 0], focus: [rect.width, rect.height] };
        setSelection(paper, selection);
        paper.pointer = PointerType.pointer;
        event.stopPropagation();
        event.preventDefault();
      }
      if (Hotkeys.isDeleteBackward(event) && paper.pointer === PointerType.pointer) {
        const elements = [...paper.elements];
        elements.forEach((value) => {
          const isSelected = Element.isIntersected(value, paper.selection);
          if (isSelected) {
            removeElement(paper, value);
          }
        });
        event.stopPropagation();
        event.preventDefault();
      }
      if (Hotkeys.isUndo(event)) {
        paper.undo();
      }
      if (Hotkeys.isRedo(event)) {
        paper.redo();
      }
    });
    fromEvent<KeyboardEvent>(document, 'keyup').pipe(
    ).subscribe((event: KeyboardEvent) => {
      this.paper?.keyup(event);
    });
    fromEvent<MouseEvent>(this.container as SVGElement, 'click').pipe().subscribe((event: MouseEvent) => {
      if (paper.pointer === PointerType.pointer) {
        const point = this.mousePointToRelativePoint(event.x, event.y, this.container as SVGSVGElement);
        setSelection(paper, { anchor: point, focus: point });
      }
    });

    fromEvent<MouseEvent>(this.container as SVGElement, 'dblclick').pipe().subscribe((event: MouseEvent) => {
      this.paper?.dblclick(event);
    });
  }

  attributesChange(attributes: Attributes) {
    const paper = this.paper as HistoryPaper;
    if (paper.pointer === PointerType.pointer) {
      const elements = [...paper.elements];
      elements.forEach((value) => {
        const isSelected = Element.isIntersected(value, paper.selection);
        if (isSelected) {
          setElement(paper, value, attributes);
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

  usePointer(event: MouseEvent, pointer: PointerType) {
    event.preventDefault();
    if (this.paper) {
      this.paper.pointer = pointer;
      this.useCursor();
    }
  }

  useCursor() {
    if (this.paper && this.paper.pointer === PointerType.pointer) {
      this.container.classList.add('pointer');
    } else {
      this.container.classList.remove('pointer');
    }
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

export interface Page {
  selection: Selection,
  elements: PenElement[],
}

export const Page = {
  setSelection(page: Page, selection: Selection) {
    page.selection = selection;
  }
}