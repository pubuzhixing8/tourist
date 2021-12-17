import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Point } from 'roughjs/bin/geometry';
import rough from 'roughjs/bin/rough';
import { RoughSVG } from 'roughjs/bin/svg';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import isHotkey from 'is-hotkey';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ipen';
  svgElement: SVGSVGElement | undefined;

  @ViewChild('SVG', { static: true })
  SVG: ElementRef | undefined;

  pointer: 'pen' | 'cursor' = 'pen';

  penElements: PenElement[] = [];

  ngOnInit(): void {
    console.log(rough);
    this.svgElement = this.SVG?.nativeElement;
    const rc = rough.svg(this.svgElement as SVGSVGElement, { options: { roughness: 0.1, strokeWidth: 2 } });
    this.initializePen(rc);
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
      this.penElements.push({ points: context.points, lineSvg: context.svg as SVGGElement });
      context = { isReadying: false, isDrawing: false, points: [], rc };
    });

    fromEvent<KeyboardEvent>(document, 'keydown').pipe(
    ).subscribe((event: KeyboardEvent) => {
      event.stopPropagation();
      event.preventDefault();
      if (isHotkey('mod+a', event)) {
        this.penElements.forEach((penElement) => {
          const rect = penElement.lineSvg.getBoundingClientRect();
          const point = this.mousePointToRelativePoint(rect.x, rect.y, this.svgElement as SVGSVGElement);
          const rectSvg = rc.rectangle(point[0] - 3, point[1] - 3, rect.width + 6, rect.height + 6, { strokeLineDash: [6, 6], strokeWidth: 1, stroke: '#348fe4' });
          this.svgElement?.appendChild(rectSvg);
          penElement.rectSvg = rectSvg;
        });
      }
    });
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

  togglePointer(event: MouseEvent) {
    event.preventDefault();
    this.pointer = this.pointer === 'pen' ? 'cursor' : 'pen';
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