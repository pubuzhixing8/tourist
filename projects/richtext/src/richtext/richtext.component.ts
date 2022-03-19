import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { withRichtext } from '../plugins/with-richtext';
import { createEditor, Editor, Element, Node, Operation, Range, Transforms } from 'slate';
import { BeforeInputEvent } from '../interface/event';
import { RichtextEditor } from '../plugins/richtext-editor';
import { getDefaultView } from '../utils/dom';
import { EDITOR_TO_ELEMENT, EDITOR_TO_ON_CHANGE, EDITOR_TO_WINDOW } from '../utils/weak-maps';

@Component({
  selector: 'plait-richtext',
  templateUrl: './richtext.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaitRichtextComponent implements OnInit, AfterViewInit, OnDestroy {
  initialized = false;

  isComposing = false;

  eventListeners: (() => void)[] = [];

  @Input()
  value: Element | undefined;

  @Output()
  valueChange: EventEmitter<Element> = new EventEmitter();

  editor = withRichtext(createEditor());

  get bindValue(): Element {
    return this.editor.children[0] as Element;
  }

  @ViewChild('richtextContainer', { static: true })
  richtextContainer: ElementRef<HTMLElement> | undefined;

  get editable() {
    return this.richtextContainer?.nativeElement as HTMLElement;
  }

  constructor(
    public renderer2: Renderer2,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (this.value) {
      this.editor.children = [this.value];
    }
  }

  ngAfterViewInit(): void {
    this.initialize();
    this.initialized = true;
  }

  initialize() {
    let window = getDefaultView(this.editable);
    EDITOR_TO_WINDOW.set(this.editor, window);
    EDITOR_TO_ELEMENT.set(this.editor, this.editable);

    this.ngZone.runOutsideAngular(() => {
      // 拦截输入行为
      this.addEventListener('beforeinput', (evt: Event) => this.beforeInput(evt as BeforeInputEvent));
      this.addEventListener('compositionstart', (evt: Event) => this.compositionStart(evt as CompositionEvent));
      this.addEventListener('compositionupdate', (evt: Event) => this.compositionUpdate(evt as CompositionEvent));
      this.addEventListener('compositionend', (evt: Event) => this.compositionEnd(evt as CompositionEvent));
      // 监控选区改变
      this.addEventListener('selectionchange', () => {
        if (this.isComposing) {
          return;
        }
        this.toSlateSelection();
      }, window.document);
    });
    // 监控 onChange
    EDITOR_TO_ON_CHANGE.set(this.editor, () => {
      this.ngZone.run(() => {
        this.onChange();
      });
    });
  }

  onChange() {
    const isValueChange = this.editor.operations.some(op => !Operation.isSelectionOperation(op));
    if (isValueChange) {
      this.valueChange.emit(this.editor.children[0] as any);
      this.cdr.detectChanges();
    }
    this.toNativeSelection();
  }

  private beforeInput(event: BeforeInputEvent) {
    const editor = this.editor;
    const { selection } = editor;
    const { inputType: type } = event;
    const data = event.dataTransfer || event.data || undefined;
    event.preventDefault();
    switch (type) {
      case 'deleteByComposition':
      case 'deleteByCut':
      case 'deleteByDrag': {
        Editor.deleteFragment(editor);
        break;
      }

      case 'deleteContent':
      case 'deleteContentForward': {
        Editor.deleteForward(editor);
        break;
      }

      case 'deleteContentBackward': {
        Editor.deleteBackward(editor);
        break;
      }

      case 'deleteEntireSoftLine': {
        Editor.deleteBackward(editor, { unit: 'line' });
        Editor.deleteForward(editor, { unit: 'line' });
        break;
      }

      case 'deleteHardLineBackward': {
        Editor.deleteBackward(editor, { unit: 'block' });
        break;
      }

      case 'deleteSoftLineBackward': {
        Editor.deleteBackward(editor, { unit: 'line' });
        break;
      }

      case 'deleteHardLineForward': {
        Editor.deleteForward(editor, { unit: 'block' });
        break;
      }

      case 'deleteSoftLineForward': {
        Editor.deleteForward(editor, { unit: 'line' });
        break;
      }

      case 'deleteWordBackward': {
        Editor.deleteBackward(editor, { unit: 'word' });
        break;
      }

      case 'deleteWordForward': {
        Editor.deleteForward(editor, { unit: 'word' });
        break;
      }

      case 'insertLineBreak':
      case 'insertParagraph': {
        Editor.insertBreak(editor);
        break;
      }

      case 'insertFromComposition':
      case 'insertFromDrop':
      case 'insertFromPaste':
      case 'insertFromYank':
      case 'insertReplacementText':
      case 'insertText': {
        if (type === 'insertFromComposition') {
          // COMPAT: in safari, `compositionend` event is dispatched after
          // the beforeinput event with the inputType "insertFromComposition" has been dispatched.
          // https://www.w3.org/TR/input-events-2/
          // so the following code is the right logic
          // because DOM selection in sync will be exec before `compositionend` event
          // isComposing is true will prevent DOM selection being update correctly.
          this.isComposing = false;
        }
        // use a weak comparison instead of 'instanceof' to allow
        // programmatic access of paste events coming from external windows
        // like cypress where cy.window does not work realibly
        if (data?.constructor.name === 'DataTransfer') {
        } else if (typeof data === 'string') {
          Editor.insertText(editor, data);
        }
        break;
      }
    }
  }

  private compositionStart(event: CompositionEvent) {
    this.isComposing = true;
  }
  private compositionUpdate(event: CompositionEvent) {
    this.isComposing = true;
  }
  private compositionEnd(event: CompositionEvent) {
    this.isComposing = false;
  }

  private toNativeSelection() {
    const window = RichtextEditor.getWindow(this.editor);
    const domSelection = window.getSelection();
    const { selection } = this.editor;
    const document = window.document;
    if (selection && domSelection) {
      const newDomRange = selection && RichtextEditor.toDOMRange(this.editor, selection);
      if (newDomRange) {
        const isBackward = Range.isBackward(selection);
        if (isBackward) {
          domSelection.setBaseAndExtent(
            newDomRange.endContainer,
            newDomRange.endOffset,
            newDomRange.startContainer,
            newDomRange.startOffset
          );
        } else {
          domSelection.setBaseAndExtent(
            newDomRange.startContainer,
            newDomRange.startOffset,
            newDomRange.endContainer,
            newDomRange.endOffset
          );
        }
        return;
      }
    }
    domSelection?.removeAllRanges();
  }

  private toSlateSelection() {
    const domSelection = window.getSelection();
    if (domSelection) {
      const slateRange = RichtextEditor.toSlateRange(this.editor, domSelection);
      Transforms.select(this.editor, slateRange);
    } else {
      Transforms.deselect(this.editor);
    }
  }

  private addEventListener(eventName: string, callback: EventListener, target: HTMLElement | Document = this.editable) {
    this.eventListeners.push(
      this.renderer2.listen(target, eventName, (event: Event) => {
        callback(event);
      })
    );
  }

  trackBy = (index: number, node: Node) => {
    return node;
  }

  ngOnDestroy(): void {
    this.eventListeners.forEach(unlisten => {
      unlisten();
    });
    EDITOR_TO_WINDOW.delete(this.editor);
    EDITOR_TO_ELEMENT.delete(this.editor);
  }
}
