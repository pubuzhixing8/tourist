import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import { Point } from "roughjs/bin/geometry";
import { RoughSVG } from "roughjs/bin/svg";
import { Selection } from "../interfaces/selection";
import { Element, ElementType } from "../interfaces/element";
import { ACTIVE_RECTANGLE_DISTANCE } from "../constants";
import { toRect } from "../utils/position";
import { ELEMENT_TO_COMPONENTS } from "../utils/weakmaps";
import { ElementBase } from "../base/element-base";

@Component({
    selector: 'linear-path',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class curveComponent extends ElementBase implements OnInit, OnDestroy, OnChanges {
    @Input() element!: Element;

    @Input() rc: RoughSVG | undefined;

    @Input() selection: Selection | undefined;

    svgElement: SVGGElement | undefined;

    activeRectangle: SVGGElement | undefined;

    constructor(private elementRef: ElementRef) { 
        super();
    }

    ngOnInit(): void {
        if (this.element.type === ElementType.curve) {
            this.svgElement = this.rc?.curve(this.element.points, { stroke: this.element.color, strokeWidth: this.element.strokeWidth });
            this.elementRef.nativeElement.parentElement.appendChild(this.svgElement);
        } else if(this.element.type === ElementType.rectangle) {
            const start = this.element.points[0];
            const end = this.element.points[1];
            this.svgElement = this.rc?.rectangle(start[0], start[1], end[0] - start[0], end[1] - start[1], { stroke: this.element.color, strokeWidth: this.element.strokeWidth });
            this.elementRef.nativeElement.parentElement.appendChild(this.svgElement);
        }
    }

    hidden() {
        if (this.svgElement) {
            this.svgElement.classList.add('hidden');
        }
        if (this.activeRectangle) {
            this.activeRectangle.classList.add('hidden');
        }
    }

    show() {
        if (this.svgElement) {
            this.svgElement.classList.remove('hidden');
        }
        if (this.activeRectangle) {
            this.activeRectangle.classList.remove('hidden');
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        const elementChange = changes['element'];
        if (elementChange) {
            ELEMENT_TO_COMPONENTS.set(this.element, this);
        }

        if (this.selection) {
            const isIntersected = (Selection.isCollapsed(this.selection) && Element.isHoverdElement(this.element, this.selection.anchor)) || (!Selection.isCollapsed(this.selection) && Element.isIntersected(this.element, this.selection));
            if (isIntersected && !this.activeRectangle) {
                this.addSelectedRect();
            } else {
                this.removeSelectedRect();
            }
            return;
        } 
        this.removeSelectedRect();
    }

    addSelectedRect() {
        const rect = toRect(this.element.points);
        this.activeRectangle = this.rc?.rectangle(rect.x - ACTIVE_RECTANGLE_DISTANCE, rect.y - ACTIVE_RECTANGLE_DISTANCE, rect.width + ACTIVE_RECTANGLE_DISTANCE * 2, rect.height + ACTIVE_RECTANGLE_DISTANCE * 2, { strokeLineDash: [6, 6], strokeWidth: 1.5, stroke: '#348fe4', fill: 'fff' });
        this.elementRef.nativeElement.parentElement.appendChild(this.activeRectangle);
    }

    removeSelectedRect() {
        if (this.activeRectangle) {
            this.activeRectangle.remove();
            this.activeRectangle = undefined;
        }
    }

    ngOnDestroy(): void {
        this.svgElement?.remove();
        this.removeSelectedRect();
    }
}