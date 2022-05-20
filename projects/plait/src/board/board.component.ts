import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { BOARD_TO_ON_CHANGE, IS_TEXT_EDITABLE } from '../utils/weak-maps';
import { PlaitBoard } from '../interfaces/board';
import { PlaitElement } from '../interfaces/element';
import { createBoard } from '../plugins/create-board';
import { withBoard } from '../plugins/with-board';
import { fromEvent, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'plait-board',
  template: `<svg #svg width="100%" height="100%"></svg>`,
  host: {
    class: 'plait-board-container'
  }
})
export class PlaitBoardComponent implements OnInit, OnDestroy {
  board!: PlaitBoard;

  destroy$: Subject<any> = new Subject();

  @ViewChild('svg', { static: true })
  svg!: ElementRef;

  get host(): SVGElement {
    return this.svg.nativeElement;
  }

  @Input() value: PlaitElement[] = [];

  @Output() valueChange: EventEmitter<PlaitElement[]> = new EventEmitter();

  constructor(private cdr: ChangeDetectorRef, private renderer2: Renderer2) { }

  ngOnInit(): void {
    this.board = withBoard(createBoard(this.host, this.value));
    BOARD_TO_ON_CHANGE.set(this.board, () => {
      this.valueChange.emit(this.value);
    });
  }

  initializeEvents() {
    fromEvent<MouseEvent>(this.host, 'mousedown').pipe(takeUntil(this.destroy$)).subscribe((event: MouseEvent) => {
      this.board.mousedown(event);
      fromEvent<MouseEvent>(document, 'mouseup').pipe(take(1)).subscribe((event: MouseEvent) => {
        this.board.mouseup(event);
      });
    });
    fromEvent<MouseEvent>(this.host, 'mousemove').pipe(takeUntil(this.destroy$)).subscribe((event: MouseEvent) => {
      this.board.mousemove(event);
    });
    fromEvent<MouseEvent>(this.host, 'dblclick').pipe(takeUntil(this.destroy$)).subscribe((event: MouseEvent) => {
      this.board.dblclick(event);
    });
    fromEvent<WheelEvent>(this.host, 'wheel').pipe().subscribe((event: WheelEvent) => {
      event.preventDefault();
      const viewport = this.board.viewport;
      // setViewport(this.paper as Paper, { ...viewport, offsetX: viewport?.offsetX - event.deltaX, offsetY: viewport?.offsetY - event.deltaY });
    });
    fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      takeUntil(this.destroy$),
      filter(() => {
        return !IS_TEXT_EDITABLE.get(this.board as PlaitBoard);
      })
    ).subscribe((event: KeyboardEvent) => {
      this.board?.keydown(event);
    });
    fromEvent<KeyboardEvent>(document, 'keyup').pipe(
      takeUntil(this.destroy$)
    ).subscribe((event: KeyboardEvent) => {
      this.board?.keyup(event);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
