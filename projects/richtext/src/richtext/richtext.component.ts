import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { createEditor, Element } from 'slate';

@Component({
  selector: 'pla-richtext',
  templateUrl: './richtext.component.html'
})
export class PlaitRichtextComponent implements OnInit {

  @Input()
  value: Element | undefined;

  @Output()
  valueChange: EventEmitter<Element> = new EventEmitter();

  editor = createEditor();

  @ViewChild('richtextContainer', { static: true })
  richtextContainer: ElementRef<HTMLElement> | undefined;

  constructor() { }

  ngOnInit(): void {
    if (this.value) {
      this.editor.children = [this.value];
    }
  }
}
