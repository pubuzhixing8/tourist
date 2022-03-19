import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { Text } from "slate";
import { ELEMENT_TO_NODE, NODE_TO_ELEMENT, NODE_TO_INDEX } from "../utils/weak-maps";

@Component({
    selector: 'plait-text, span[plaitTextNode]',
    template: '',
    host: {
        class: 'plait-text-node',
        'data-plait-node': 'text'
    },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaitTextComponent implements OnInit, AfterViewInit, OnChanges {
    @Input()
    text?: Text | any;

    @Input()
    index = 0;

    initialized = false;

    constructor(private elementRef: ElementRef<HTMLElement>) { }

    ngOnInit(): void {
        this.updateWeakMap();
    }

    updateWeakMap() {
        if (this.text) {
            ELEMENT_TO_NODE.set(this.elementRef.nativeElement, this.text);
            NODE_TO_ELEMENT.set(this.text, this.elementRef.nativeElement);
            NODE_TO_INDEX.set(this.text, this.index);
        }
    }

    ngAfterViewInit(): void {
        this.render();
        this.initialized = true;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.initialized) {
            return;
        }
        const textChange = changes['text'];
        if (textChange) {
            this.render();
        }
        this.updateWeakMap();
    }

    render() {
        if (this.text) {
            this.elementRef.nativeElement.innerText = this.text?.text;
        }
    }
}