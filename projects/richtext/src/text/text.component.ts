import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { Text } from "slate";

@Component({
    selector: 'plait-text, span[plaitTextNode]',
    host: {
        class: 'plait-text-node'
    }
})
export class PlaitTextComponent implements OnInit, AfterViewInit, OnChanges {
    @Input()
    text?: Text;

    initialized = false;

    constructor(private elementRef: ElementRef<HTMLElement>) {}

    ngOnInit(): void {
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
    }

    render() {
        if (this.text) {
            this.elementRef.nativeElement.innerText = this.text?.text;
        }
    }
}