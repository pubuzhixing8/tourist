import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import { RoughSVG } from "roughjs/bin/svg";
import { Selection } from "../interfaces/selection";
import { Element, ElementType } from "../interfaces/element";
import { ELEMENT_TO_COMPONENTS } from "../utils/weakmaps";
import { ElementBase } from "../base/element-base";
import { ActiveElementService } from "./active-element.service";

@Component({
    selector: 'pla-element',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElementComponent extends ElementBase implements OnInit, OnDestroy, OnChanges {
    @Input() element!: Element;

    @Input() rc: RoughSVG | undefined;

    @Input() selection: Selection | undefined;

    svgElement: SVGGElement | undefined;

    activeElementService: ActiveElementService | undefined;

    constructor(private elementRef: ElementRef) {
        super();
    }

    ngOnInit(): void {
        if (this.element.type === ElementType.curve) {
            this.svgElement = this.rc?.curve(this.element.points, { stroke: this.element.color, strokeWidth: this.element.strokeWidth });
            this.elementRef.nativeElement.parentElement.appendChild(this.svgElement);
        } else if (this.element.type === ElementType.rectangle) {
            const start = this.element.points[0];
            const end = this.element.points[1];
            this.svgElement = this.rc?.rectangle(start[0], start[1], end[0] - start[0], end[1] - start[1], { stroke: this.element.color, strokeWidth: this.element.strokeWidth });
            this.elementRef.nativeElement.parentElement.appendChild(this.svgElement);
        }
        this.activeElementService = new ActiveElementService(this.rc as RoughSVG, this.elementRef.nativeElement.parentElement, this.element, this.selection as Selection);
    }

    hidden() {
        if (this.svgElement) {
            this.svgElement.classList.add('hidden');
        }
        if (this.activeElementService) {
            this.activeElementService.hiddenActiveRectangle();
        }
    }

    show() {
        if (this.svgElement) {
            this.svgElement.classList.remove('hidden');
        }
        this.activeElementService?.showActiveRectangle();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const elementChange = changes['element'];
        if (elementChange) {
            ELEMENT_TO_COMPONENTS.set(this.element, this);
        }
        this.activeElementService?.update(this.element, this.selection as Selection);
    }

    ngOnDestroy(): void {
        this.svgElement?.remove();
        this.activeElementService?.removeActiveRectangle();
    }
}