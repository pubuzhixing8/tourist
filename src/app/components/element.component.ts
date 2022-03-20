import { ChangeDetectionStrategy, Component, ComponentFactoryResolver, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewContainerRef } from "@angular/core";
import { RoughSVG } from "roughjs/bin/svg";
import { Selection } from "../interfaces/selection";
import { Element, ElementType } from "../interfaces/element";
import { ELEMENT_TO_COMPONENTS } from "../utils/weakmaps";
import { ElementBase } from "../base/element-base";
import { ActiveElementService } from "./active-element.service";
import { EdgeMode } from "../interfaces/attributes";
import { arrowPoints } from "../utils/arrow";
import { drawRoundRectangle } from "../utils/rectangle";
import { renderRichtext } from "../utils/foreign-object";

@Component({
    selector: 'pla-element',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElementComponent extends ElementBase implements OnInit, OnDestroy, OnChanges {
    @Input() element!: Element;

    @Input() rs: RoughSVG | undefined;

    @Input() selection: Selection | undefined;

    svgElement: SVGGElement | undefined;

    arrowDOMElements: SVGElement[] = [];

    activeElementService: ActiveElementService | undefined;

    constructor(private elementRef: ElementRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef) {
        super();
    }

    ngOnInit(): void {
        if (this.element.type === ElementType.curve) {
            this.svgElement = this.rs?.curve(this.element.points, { stroke: this.element.color, strokeWidth: this.element.strokeWidth });
            this.elementRef.nativeElement.parentElement.appendChild(this.svgElement);
        } else if (this.element.type === ElementType.rectangle) {
            const start = this.element.points[0];
            const end = this.element.points[1];
            if (this.element.edgeMode === EdgeMode.round) {
                this.svgElement = drawRoundRectangle(start, end, this.rs as any, { stroke: this.element.color, strokeWidth: this.element.strokeWidth } as any);
            } else {
                this.svgElement = this.rs?.rectangle(start[0], start[1], end[0] - start[0], end[1] - start[1], { stroke: this.element.color, strokeWidth: this.element.strokeWidth });
            }
            this.elementRef.nativeElement.parentElement.appendChild(this.svgElement);
        } else if (this.element.type === ElementType.line) {
            if (this.element.edgeMode === EdgeMode.sharp || !this.element.edgeMode) {
                this.svgElement = this.rs?.linearPath(this.element.points, { stroke: this.element.color, strokeWidth: this.element.strokeWidth });
            }
            if (this.element.edgeMode === EdgeMode.round) {
                this.svgElement = this.rs?.curve(this.element.points, { stroke: this.element.color, strokeWidth: this.element.strokeWidth });
            }
            this.elementRef.nativeElement.parentElement.appendChild(this.svgElement);
        } else if (this.element.type === ElementType.arrow) {
            const { pointLeft, pointRight } = arrowPoints(this.element.points[this.element.points.length - 2], this.element.points[this.element.points.length - 1]);
            if (this.element.edgeMode === EdgeMode.sharp || !this.element.edgeMode) {
                const line = this.rs?.linearPath(this.element.points, { stroke: this.element.color, strokeWidth: this.element.strokeWidth }) as SVGAElement;
                this.arrowDOMElements.push(line);
            } else {
                const curve = this.rs?.curve(this.element.points, { stroke: this.element.color, strokeWidth: this.element.strokeWidth }) as SVGAElement;
                this.arrowDOMElements.push(curve);
            }
            const arrowLineLeft = this.rs?.linearPath([pointLeft, this.element.points[this.element.points.length - 1]], { stroke: this.element.color, strokeWidth: this.element.strokeWidth }) as SVGElement;
            this.arrowDOMElements.push(arrowLineLeft);
            const arrowLineRight = this.rs?.linearPath([pointRight, this.element.points[this.element.points.length - 1]], { stroke: this.element.color, strokeWidth: this.element.strokeWidth }) as SVGElement;
            this.arrowDOMElements.push(arrowLineRight);
            this.arrowDOMElements.forEach((dom) => {
                this.elementRef.nativeElement.parentElement.appendChild(dom);
            });
        } else if (this.element.type === ElementType.text) {
            const { richtextComponentRef, g } = renderRichtext(this.element, this.componentFactoryResolver, this.viewContainerRef);
            this.svgElement = g;
            this.elementRef.nativeElement.parentElement.appendChild(this.svgElement);
        }
        else if (this.element.type === ElementType.circle) {
            const [start, realEnd] = this.element.points;
            const width = Math.abs(realEnd[0] - start[0]);
            let height = Math.abs(realEnd[1] - start[1]);
            const centerPoint = [realEnd[0] > start[0] ? realEnd[0] - width / 2 : realEnd[0] + width / 2, realEnd[1] > start[1] ? realEnd[1] - height / 2 : realEnd[1] + height / 2];
            this.svgElement = this.rs?.ellipse(centerPoint[0], centerPoint[1], width, height, { stroke: this.element.color, strokeWidth: this.element.strokeWidth });
            this.elementRef.nativeElement.parentElement.appendChild(this.svgElement);
        }
        this.activeElementService = new ActiveElementService(this.rs as RoughSVG, this.elementRef.nativeElement.parentElement, this.element, this.selection as Selection);
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
        this.arrowDOMElements.forEach((dom) => {
            dom.remove();
        })
    }
}