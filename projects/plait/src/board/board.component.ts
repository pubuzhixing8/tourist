import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { createBoard } from '../plugins/with-board';

@Component({
  selector: 'plait-board',
  template: `<svg #svg width="100%" height="100%"></svg>`,
  host: {
    class: 'plait-board-container'
  }
})
export class PlaitBoardComponent implements OnInit {
  @ViewChild('svg', { static: true })
  svg?: ElementRef;

  board = createBoard();

  constructor() {}

  ngOnInit(): void {
  }
}
